import { Feather, Ionicons } from "@expo/vector-icons";
import { AVPlaybackStatus, Audio } from "expo-av";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Text, SafeAreaView, TouchableOpacity, View } from "react-native";
import Voice from "@react-native-voice/voice";

import ExternalLink from "@/components/ExternalLink";
import { SetUpButton } from "@/components/ui/Button";

export default function Screen() {
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordings, setRecordings] = useState<string[]>([]);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [result, setResult] = useState<Record<string, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleNext = () => {
    router.push("/hearingTest/quickSin/quickSinTest");
  };

  const playSound = useCallback(async (soundToPlay: Audio.Sound) => {
    try {
      if (!soundToPlay) {
        return;
      }
      await soundToPlay.replayAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, []);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
        });
        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        recordingRef.current = newRecording;
        await newRecording.startAsync();
      }
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e: any) => {
    console.log("onSpeechStart: ", e);
  };

  const onSpeechResults = (e: any) => {
    console.log("onSpeechResults: ", e);
    setResults(e.value);
    // Assuming you want to use the extracted keywords and score calculation here
    // const sentenceScores = calculateScores(e.value.join(" "));
    // const totalScore = sentenceScores.reduce(
    //   (total, score) => total + score,
    //   0
    // );
    // const snrLoss = 25.5 - 1.5 * totalScore;
    // setScore(snrLoss);
  };

  const startRecognizing = async () => {
    try {
      await Voice.start("en-US");
      setStarted(true);
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
      setStarted(false);
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecording = async () => {
    const currentRecording = recordingRef.current;
    if (!currentRecording) return;
    console.log("Stopping recording:", recording);
    try {
      await currentRecording.stopAndUnloadAsync();
      const uri = currentRecording.getURI();
      console.log("Recording URI:", uri);
      if (uri) {
        setRecordings((prevRecordings) => [...prevRecordings, uri]);
        // const response = await uploadAudioAsync(uri);
      }
      console.log("Recording stopped and stored at", uri);
      setRecording(null);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const uploadAudioAsync = async (uri: string) => {
    console.log("Uploading " + uri);
    let apiUrl = "http://127.0.0.1:5000/evaluate"; // Make sure to use the correct port
    let uriParts = uri.split(".");
    let fileType = uriParts[uriParts.length - 1];

    let formData = new FormData();
    // @ts-ignore
    formData.append("file", {
      uri,
      name: `recording.${fileType}`,
      type: `audio/x-${fileType}`,
    });

    // Include metadata if needed
    const metadata = {
      quicksin_audio: "track_03", // Replace with actual track number or other metadata
    };
    formData.append("metadata", JSON.stringify(metadata));

    let options = {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };

    console.log("POSTing " + uri + " to " + apiUrl);
    return fetch(apiUrl, options);
  };

  const playRecording = async (uri: string) => {
    try {
      const { sound: playbackSound } = await Audio.Sound.createAsync({
        uri,
      });
      playSound(playbackSound);
    } catch (error) {
      console.error("Error playing recording:", error);
    }
  };

  const loadAndPlaySound = useCallback(async () => {
    try {
      if (sound) await sound.unloadAsync();

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });

      const audioFile = require("../../../../assets/audio/quicksin/track_03.mp3");

      const { sound: newSound } = await Audio.Sound.createAsync(
        audioFile,
        undefined,
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      await startRecording();
      await startRecognizing();
      playSound(newSound);
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  }, [sound, playSound, recording]);

  const onPlaybackStatusUpdate = useCallback(
    async (newStatus: AVPlaybackStatus) => {
      setStatus(newStatus);
      if (newStatus.isLoaded) {
        setIsPlaying(newStatus.isPlaying);
        if (newStatus.didJustFinish && !newStatus.isLooping) {
          // Sound has finished playing, stop recording
          console.log("Sound finished playing");
          await stopRecognizing();
          await stopRecording();
        }
      }
    },
    [stopRecording]
  );

  // Sound Unloading
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8">
          <Text className="pb-6 text-2xl font-bold">Practice</Text>
          <Text className="text-md text-center font-medium">
            After hearing each sentence, repeat it back immediately. Remember,
            the noise level will change, so some parts might be easier or harder
            to hear
          </Text>
          <ExternalLink
            className="mt-3 text-blue-500 underline"
            href="https://www.youtube.com/watch?v=CaK6UP0W-9o"
          >
            What is SNR loss?
          </ExternalLink>
        </View>
        <View className="flex items-center">
          {isPlaying ? (
            <View className="flex items-center">
              <Text className="font-bold">Playing</Text>
              <Text className="font-bold">
                Repeat the senetence immediately
              </Text>
            </View>
          ) : (
            <View className="items-center">
              <Text className="font-bold italic">
                Click the button below to play
              </Text>
              <TouchableOpacity onPress={loadAndPlaySound}>
                <Ionicons name="play" size={50} color="black" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="items-center">
          {score && (
            <Text className="text-2xl font-bold">
              Your SNR Loss is {score} dB
            </Text>
          )}
          {/* Show Recordings */}
          {/* {recordings.map((uri, index) => (
            <Button
              key={index}
              title={`Play Recording ${index + 1}`}
              onPress={() => playRecording(uri)}
            />
          ))} */}
        </View>
        <View className="mb-4 flex items-center">
          <SetUpButton title="Next" handlePress={handleNext} disabled={false} />
        </View>
      </View>
    </SafeAreaView>
  );
}
