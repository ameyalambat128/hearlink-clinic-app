import { Ionicons } from "@expo/vector-icons";
import { AVPlaybackStatus, Audio } from "expo-av";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Text, SafeAreaView, TouchableOpacity, View } from "react-native";
import Voice from "@react-native-voice/voice";

import ExternalLink from "@/components/ExternalLink";
import { SetUpButton } from "@/components/ui/Button";
import { extractKeywords } from "@/lib/utils";
import { useUserStore } from "@/store/store";

const audioFilePaths = {
  3: require("../../../../assets/audio/quicksin/track_03.mp3"),
  4: require("../../../../assets/audio/quicksin/track_04.mp3"),
  5: require("../../../../assets/audio/quicksin/track_05.mp3"),
  6: require("../../../../assets/audio/quicksin/track_06.mp3"),
  7: require("../../../../assets/audio/quicksin/track_07.mp3"),
  8: require("../../../../assets/audio/quicksin/track_08.mp3"),
  9: require("../../../../assets/audio/quicksin/track_09.mp3"),
  10: require("../../../../assets/audio/quicksin/track_10.mp3"),
  11: require("../../../../assets/audio/quicksin/track_11.mp3"),
  12: require("../../../../assets/audio/quicksin/track_12.mp3"),
  13: require("../../../../assets/audio/quicksin/track_13.mp3"),
  14: require("../../../../assets/audio/quicksin/track_14.mp3"),
};

export default function Screen() {
  const router = useRouter();
  const { setSnrLoss } = useUserStore();

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordings, setRecordings] = useState<string[]>([]);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [result, setResult] = useState<Record<string, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const trackNumberRef = useRef<string | null>(null);

  const handleNext = () => {
    router.push("/hearing-test/comprehensiveTest/hearingScreeningResults");
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

  /*
   * TODO: onSpeechResults
   * Test is still not completely correct
   * Need to make sure that each sentence is graded seperately
   * currently words which is all the word in the transcription seperated by space is being graded
   * Need to make sure that each sentence is graded seperately
   * Somehow need to add markers whenever a sentence is completed or
   * somehow add punctuation to the transcription
   */
  const onSpeechResults = (e: any) => {
    const transcription = e.value;
    console.log("Transcription:", transcription);

    // Step 1: Separate words in the transcription
    const words = transcription[0].toLowerCase().split(/\s+/);
    console.log("Words:", words);

    // Step 2: Grade the transcription
    console.log("Track ID:", trackNumberRef.current);
    const trackId = trackNumberRef.current;

    const sentenceCount = 6;
    let result: { [key: number]: number } = {};

    for (let i = 1; i <= sentenceCount; i++) {
      const keywordsList = extractKeywords(trackId, i);
      let count = 0;
      keywordsList.forEach((keyword: string) => {
        if (words.includes(keyword.toLowerCase())) {
          count++;
        }
      });
      result[i] = count;
    }

    console.log("Result:", result);

    const totalScore = Object.values(result).reduce(
      (total, score) => total + score,
      0
    );
    const snrLoss = 25.5 - totalScore;
    console.log("SNR Loss:", snrLoss);
    setScore(snrLoss);
    setSnrLoss(snrLoss + " dB");
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
      setFinished(true);
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
      Voice.onSpeechResults = onSpeechResults;
      setRecording(null);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
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

      const trackKeys = Object.keys(audioFilePaths);
      const randomIndex = Math.floor(Math.random() * trackKeys.length);
      const randomTrackNumber = trackKeys[randomIndex];

      // @ts-ignore
      const audioFile = audioFilePaths[randomTrackNumber];
      console.log("Track: track_" + randomTrackNumber);
      console.log(randomTrackNumber);

      const { sound: newSound } = await Audio.Sound.createAsync(
        audioFile,
        undefined,
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      playSound(newSound);
      trackNumberRef.current = randomTrackNumber;
      await startRecognizing();
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
          Voice.onSpeechResults = onSpeechResults;
          await stopRecognizing();
          // await stopRecording();
        }
      }
    },
    [stopRecognizing]
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
          <Text className="pb-6 text-2xl font-bold">Quick SIN Test</Text>
          {/* TODO: Description update here */}
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
          {finished && score && (
            <Text className="text-2xl font-bold">
              Your SNR Loss is {score} dB
            </Text>
          )}
        </View>
        <View className="mb-4 flex items-center">
          <SetUpButton title="Next" handlePress={handleNext} disabled={false} />
        </View>
      </View>
    </SafeAreaView>
  );
}
