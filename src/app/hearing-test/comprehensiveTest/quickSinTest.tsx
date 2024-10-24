import { Ionicons } from "@expo/vector-icons";
import { AVPlaybackStatus, Audio } from "expo-av";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import Voice from "@react-native-voice/voice";

import ExternalLink from "@/components/ExternalLink";
import { SetUpButton } from "@/components/ui/Button";
import { chunkArray, extractKeywords, getKeywordsForTrack } from "@/lib/utils";
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

const isPad: boolean = Platform.OS === "ios" && Platform.isPad;

export default function Screen() {
  const router = useRouter();
  const { setSnrLoss } = useUserStore();

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordings, setRecordings] = useState<string[]>([]);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [result, setResult] = useState<Record<string, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  });
  const [finalResults, setFinalResults] = useState<Record<string, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  });
  const [resultCount, setResultCount] = useState<number>(0);
  const [score, setScore] = useState<number | null>(null);

  const [finished, setFinished] = useState<boolean>(false);
  const [words, setWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState({});
  const trackNumberRef = useRef<string | null>(null);
  const currentSentenceRef = useRef<string | null>(null);

  const handleNext = () => {
    // stopRecognizing();
    router.push("/hearing-test/comprehensiveTest/volumeAdjustScreening");
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

  const handleWordPress = (index) => {
    setSelectedWords((prevWords) => ({ ...prevWords, [index]: words[index] }));
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
      trackNumberRef.current = randomTrackNumber;
      setWords(getKeywordsForTrack(randomTrackNumber));
      setSound(newSound);
      playSound(newSound);
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  }, [sound, playSound, recording]);

  const onPlaybackStatusUpdate = useCallback(
    async (newStatus: AVPlaybackStatus) => {
      if (newStatus.isLoaded) {
        const currentTime = Math.floor(newStatus.positionMillis * 0.001); // Convert to seconds

        setIsPlaying(newStatus.isPlaying); // Update playback status
      }
    },
    []
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

  const rows = chunkArray(words, 5);

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8 md:pt-10">
          <Text className="pb-6 text-3xl md:text-4xl font-bold">
            Quick SIN Test
          </Text>
          {/* TODO: Description update here */}
          <Text className="text-xl md:text-2xl text-center font-medium">
            After hearing each sentence, repeat it back immediately. Remember,
            the noise level will change, so some parts might be easier or harder
            to hear
          </Text>
          {/* <ExternalLink
            className="mt-3 text-blue-500 underline"
            href="https://www.youtube.com/watch?v=CaK6UP0W-9o"
          >
            What is SNR loss?
          </ExternalLink> */}
        </View>
        <View className="flex flex-col justify-around w-full">
          {isPlaying ? (
            <View className="flex flex-col justify-around w-full">
              {rows.map((row, rowIndex) => (
                <View
                  key={rowIndex}
                  className="flex flex-row justify-around gap-16 w-full"
                >
                  {row.map((word, index) => (
                    <TouchableOpacity
                      key={index}
                      className="m-3 w-20 h-10 justify-center items-center bg-gray-200 rounded-md"
                      onPress={() => handleWordPress(index + rowIndex * 5)}
                    >
                      <Text>{word}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
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
