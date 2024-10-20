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

const trackTimings = {
  3: {
    "1": [7, 13], // Sentence silence 1: start at 7s, end at 13s
    "2": [15, 22],
    "3": [25, 30],
    "4": [33, 39],
    "5": [42, 48],
    "6": [52, 58],
  },
  4: {
    "1": [7, 13], // Sentence silence 1: start at 7s, end at 13s
    "2": [15, 22],
    "3": [25, 30],
    "4": [33, 39],
    "5": [42, 48],
    "6": [52, 58],
  },
  5: {
    "1": [7, 13], // Sentence silence 1: start at 7s, end at 13s
    "2": [15, 22],
    "3": [25, 30],
    "4": [33, 39],
    "5": [42, 48],
    "6": [52, 58],
  },
  track_6: {
    "1": [7, 13], // Sentence silence 1: start at 7s, end at 13s
    "2": [15, 22],
    "3": [25, 30],
    "4": [33, 39],
    "5": [42, 48],
    "6": [52, 58],
  },
  track_7: {
    "1": [7, 13], // Sentence silence 1: start at 7s, end at 13s
    "2": [15, 22],
    "3": [25, 30],
    "4": [33, 39],
    "5": [42, 48],
    "6": [52, 58],
  },
  track_8: {
    "1": [7, 13], // Sentence silence 1: start at 7s, end at 13s
    "2": [15, 22],
    "3": [25, 30],
    "4": [33, 39],
    "5": [42, 48],
    "6": [52, 58],
  },
  track_9: {
    "1": [7, 13], // Sentence silence 1: start at 7s, end at 13s
    "2": [15, 22],
    "3": [25, 30],
    "4": [33, 39],
    "5": [42, 48],
    "6": [52, 58],
  },
  track_10: {
    "1": [7, 13], // Sentence silence 1: start at 7s, end at 13s
    "2": [15, 22],
    "3": [25, 30],
    "4": [33, 39],
    "5": [42, 48],
    "6": [52, 58],
  },
  track_11: {
    "1": [7, 13], // Sentence silence 1: start at 7s, end at 13s
    "2": [15, 22],
    "3": [25, 30],
    "4": [33, 39],
    "5": [42, 48],
    "6": [52, 58],
  },
  track_12: {
    "1": [7, 13], // Sentence silence 1: start at 7s, end at 13s
    "2": [15, 22],
    "3": [25, 30],
    "4": [33, 39],
    "5": [42, 48],
    "6": [52, 58],
  },
  track_13: {
    "1": [7, 13], // Sentence silence 1: start at 7s, end at 13s
    "2": [15, 22],
    "3": [25, 30],
    "4": [33, 39],
    "5": [42, 48],
    "6": [52, 58],
  },
  track_14: {
    "1": [7, 13], // Sentence silence 1: start at 7s, end at 13s
    "2": [15, 22],
    "3": [25, 30],
    "4": [33, 39],
    "5": [42, 48],
    "6": [52, 58],
  },
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

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechEnd = onSpeechEnd;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e: any) => {
    console.log("onSpeechStart: ", e);
  };

  const onSpeechEnd = () => {
    console.log("Speech recognition ended");
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
  const sentenceRefs = useRef<Record<string, number>>({
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
  });
  const onSpeechResults = (e: any) => {
    const transcription = e.value;
    console.log("Transcription:", transcription);

    // Separate words in the transcription
    const words = transcription[0].toLowerCase().split(/\s+/);
    console.log("Words:", words);

    const trackId = trackNumberRef.current;
    const currentSentence = currentSentenceRef.current; // Use current sentence ID

    // Get the keywords for the current sentence
    const keywordsList = extractKeywords(trackId, parseInt(currentSentence));
    let correctCount = 0;

    keywordsList.forEach((keyword: string) => {
      if (words.includes(keyword.toLowerCase())) {
        correctCount++;
      }
    });

    // Update the sentence result in the ref
    sentenceRefs.current[currentSentence] = correctCount;
    console.log(`Sentence ${currentSentence} result stored:`, correctCount);
  };

  const calculateSNRLoss = () => {
    const totalScore = Object.values(sentenceRefs.current).reduce(
      (acc, score) => acc + score,
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
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
      setFinished(true);
      console.log("Result State:", result);
    } catch (e) {
      console.error(e);
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
      // const randomTrackNumber = trackKeys[randomIndex];
      const randomTrackNumber = "3";

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
      setSound(newSound);
      playSound(newSound);
      await startRecognizing();
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  }, [sound, playSound, recording]);

  const onPlaybackStatusUpdate = useCallback(
    async (newStatus: AVPlaybackStatus) => {
      if (newStatus.isLoaded) {
        const currentTime = Math.floor(newStatus.positionMillis * 0.001); // Convert to seconds
        const trackId = trackNumberRef.current;

        if (trackId && trackTimings[trackId]) {
          const sentences = trackTimings[trackId];

          Object.keys(sentences).forEach(async (sentenceId) => {
            const [start, end] = sentences[sentenceId];

            console.log(
              `Checking sentence ${sentenceId}: currentTime = ${currentTime}, start = ${start}, end = ${end}`
            );

            // Sentence is currently playing, transcription should start
            if (currentTime >= start && currentTime < end) {
              currentSentenceRef.current = sentenceId; // Update the current sentence reference
              console.log(`Starting transcription for sentence ${sentenceId}`);
              await startRecognizing(); // Start speech recognition
            }

            // Sentence has finished playing, transcription should stop
            if (currentTime >= end) {
              console.log(`Stopping transcription for sentence ${sentenceId}`);

              // If this is the last sentence, calculate the SNR loss
              if (newStatus.didJustFinish && !newStatus.isLooping) {
                console.log(sentenceRefs.current);

                await stopRecognizing();
                calculateSNRLoss();
              }
            }
          });
        }

        setIsPlaying(newStatus.isPlaying); // Update playback status
      }
    },
    [stopRecognizing, startRecognizing]
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
              <Text className="font-bold italic md:text-2xl">
                Click the button below to play
              </Text>
              <TouchableOpacity onPress={loadAndPlaySound}>
                <Ionicons
                  name="play"
                  size={50 * (isPad ? 2 : 1)}
                  color="black"
                />
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
