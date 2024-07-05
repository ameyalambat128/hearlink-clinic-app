import { Ionicons } from "@expo/vector-icons";
import { AVPlaybackStatus, Audio } from "expo-av";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

import { SetUpButton } from "@/components/ui/Button";
import { usePauseStore } from "@/store/store";

const frequencies: number[] = [1000];
const INITIAL_INTENSITY: number = 30;
const TEST_INTENSITY_STEP_UP: number = 5;
const TEST_INTENSITY_STEP_DOWN: number = 10;
const INITIAL_INTENSITY_STEP_UP: number = 20;
const MAX_INTENSITY: number = 70;
const RESPONSE_TIMEOUT: number = 3000; // 3 seconds

const audioFilePaths: {
  [frequency: string]: {
    [intensity: string]: number;
  };
} = {
  "250": {
    "0": require(`../../../../assets/audio/pure_tone/0dB_HL/0dB_250Hz_2s.wav`),
    "5": require(`../../../../assets/audio/pure_tone/5dB_HL/5dB_250Hz_2s.wav`),
    "10": require(`../../../../assets/audio/pure_tone/10dB_HL/10dB_250Hz_2s.wav`),
    "15": require(`../../../../assets/audio/pure_tone/15dB_HL/15dB_250Hz_2s.wav`),
    "20": require(`../../../../assets/audio/pure_tone/20dB_HL/20dB_250Hz_2s.wav`),
    "25": require(`../../../../assets/audio/pure_tone/25dB_HL/25dB_250Hz_2s.wav`),
    "30": require(`../../../../assets/audio/pure_tone/30dB_HL/30dB_250Hz_2s.wav`),
    "35": require(`../../../../assets/audio/pure_tone/35dB_HL/35dB_250Hz_2s.wav`),
    "40": require(`../../../../assets/audio/pure_tone/40dB_HL/40dB_250Hz_2s.wav`),
    "45": require(`../../../../assets/audio/pure_tone/45dB_HL/45dB_250Hz_2s.wav`),
    "50": require(`../../../../assets/audio/pure_tone/50dB_HL/50dB_250Hz_2s.wav`),
    "55": require(`../../../../assets/audio/pure_tone/55dB_HL/55dB_250Hz_2s.wav`),
    "60": require(`../../../../assets/audio/pure_tone/60dB_HL/60dB_250Hz_2s.wav`),
    "65": require(`../../../../assets/audio/pure_tone/65dB_HL/65dB_250Hz_2s.wav`),
    "70": require(`../../../../assets/audio/pure_tone/70dB_HL/70dB_250Hz_2s.wav`),
  },
  "500": {
    "0": require(`../../../../assets/audio/pure_tone/0dB_HL/0dB_500Hz_2s.wav`),
    "5": require(`../../../../assets/audio/pure_tone/5dB_HL/5dB_500Hz_2s.wav`),
    "10": require(`../../../../assets/audio/pure_tone/10dB_HL/10dB_500Hz_2s.wav`),
    "15": require(`../../../../assets/audio/pure_tone/15dB_HL/15dB_500Hz_2s.wav`),
    "20": require(`../../../../assets/audio/pure_tone/20dB_HL/20dB_500Hz_2s.wav`),
    "25": require(`../../../../assets/audio/pure_tone/25dB_HL/25dB_500Hz_2s.wav`),
    "30": require(`../../../../assets/audio/pure_tone/30dB_HL/30dB_500Hz_2s.wav`),
    "35": require(`../../../../assets/audio/pure_tone/35dB_HL/35dB_500Hz_2s.wav`),
    "40": require(`../../../../assets/audio/pure_tone/40dB_HL/40dB_500Hz_2s.wav`),
    "45": require(`../../../../assets/audio/pure_tone/45dB_HL/45dB_500Hz_2s.wav`),
    "50": require(`../../../../assets/audio/pure_tone/50dB_HL/50dB_500Hz_2s.wav`),
    "55": require(`../../../../assets/audio/pure_tone/55dB_HL/55dB_500Hz_2s.wav`),
    "60": require(`../../../../assets/audio/pure_tone/60dB_HL/60dB_500Hz_2s.wav`),
    "65": require(`../../../../assets/audio/pure_tone/65dB_HL/65dB_500Hz_2s.wav`),
    "70": require(`../../../../assets/audio/pure_tone/70dB_HL/70dB_500Hz_2s.wav`),
  },
  "1000": {
    "0": require(`../../../../assets/audio/pure_tone/0dB_HL/0dB_1000Hz_2s.wav`),
    "5": require(`../../../../assets/audio/pure_tone/5dB_HL/5dB_1000Hz_2s.wav`),
    "10": require(`../../../../assets/audio/pure_tone/10dB_HL/10dB_1000Hz_2s.wav`),
    "15": require(`../../../../assets/audio/pure_tone/15dB_HL/15dB_1000Hz_2s.wav`),
    "20": require(`../../../../assets/audio/pure_tone/20dB_HL/20dB_1000Hz_2s.wav`),
    "25": require(`../../../../assets/audio/pure_tone/25dB_HL/25dB_1000Hz_2s.wav`),
    "30": require(`../../../../assets/audio/pure_tone/30dB_HL/30dB_1000Hz_2s.wav`),
    "35": require(`../../../../assets/audio/pure_tone/35dB_HL/35dB_1000Hz_2s.wav`),
    "40": require(`../../../../assets/audio/pure_tone/40dB_HL/40dB_1000Hz_2s.wav`),
    "45": require(`../../../../assets/audio/pure_tone/45dB_HL/45dB_1000Hz_2s.wav`),
    "50": require(`../../../../assets/audio/pure_tone/50dB_HL/50dB_1000Hz_2s.wav`),
    "55": require(`../../../../assets/audio/pure_tone/55dB_HL/55dB_1000Hz_2s.wav`),
    "60": require(`../../../../assets/audio/pure_tone/60dB_HL/60dB_1000Hz_2s.wav`),
    "65": require(`../../../../assets/audio/pure_tone/65dB_HL/65dB_1000Hz_2s.wav`),
    "70": require(`../../../../assets/audio/pure_tone/70dB_HL/70dB_1000Hz_2s.wav`),
  },
  "2000": {
    "0": require(`../../../../assets/audio/pure_tone/0dB_HL/0dB_2000Hz_2s.wav`),
    "5": require(`../../../../assets/audio/pure_tone/5dB_HL/5dB_2000Hz_2s.wav`),
    "10": require(`../../../../assets/audio/pure_tone/10dB_HL/10dB_2000Hz_2s.wav`),
    "15": require(`../../../../assets/audio/pure_tone/15dB_HL/15dB_2000Hz_2s.wav`),
    "20": require(`../../../../assets/audio/pure_tone/20dB_HL/20dB_2000Hz_2s.wav`),
    "25": require(`../../../../assets/audio/pure_tone/25dB_HL/25dB_2000Hz_2s.wav`),
    "30": require(`../../../../assets/audio/pure_tone/30dB_HL/30dB_2000Hz_2s.wav`),
    "35": require(`../../../../assets/audio/pure_tone/35dB_HL/35dB_2000Hz_2s.wav`),
    "40": require(`../../../../assets/audio/pure_tone/40dB_HL/40dB_2000Hz_2s.wav`),
    "45": require(`../../../../assets/audio/pure_tone/45dB_HL/45dB_2000Hz_2s.wav`),
    "50": require(`../../../../assets/audio/pure_tone/50dB_HL/50dB_2000Hz_2s.wav`),
    "55": require(`../../../../assets/audio/pure_tone/55dB_HL/55dB_2000Hz_2s.wav`),
    "60": require(`../../../../assets/audio/pure_tone/60dB_HL/60dB_2000Hz_2s.wav`),
    "65": require(`../../../../assets/audio/pure_tone/65dB_HL/65dB_2000Hz_2s.wav`),
    "70": require(`../../../../assets/audio/pure_tone/70dB_HL/70dB_2000Hz_2s.wav`),
  },
  "3000": {
    "0": require(`../../../../assets/audio/pure_tone/0dB_HL/0dB_3000Hz_2s.wav`),
    "5": require(`../../../../assets/audio/pure_tone/5dB_HL/5dB_3000Hz_2s.wav`),
    "10": require(`../../../../assets/audio/pure_tone/10dB_HL/10dB_3000Hz_2s.wav`),
    "15": require(`../../../../assets/audio/pure_tone/15dB_HL/15dB_3000Hz_2s.wav`),
    "20": require(`../../../../assets/audio/pure_tone/20dB_HL/20dB_3000Hz_2s.wav`),
    "25": require(`../../../../assets/audio/pure_tone/25dB_HL/25dB_3000Hz_2s.wav`),
    "30": require(`../../../../assets/audio/pure_tone/30dB_HL/30dB_3000Hz_2s.wav`),
    "35": require(`../../../../assets/audio/pure_tone/35dB_HL/35dB_3000Hz_2s.wav`),
    "40": require(`../../../../assets/audio/pure_tone/40dB_HL/40dB_3000Hz_2s.wav`),
    "45": require(`../../../../assets/audio/pure_tone/45dB_HL/45dB_3000Hz_2s.wav`),
    "50": require(`../../../../assets/audio/pure_tone/50dB_HL/50dB_3000Hz_2s.wav`),
    "55": require(`../../../../assets/audio/pure_tone/55dB_HL/55dB_3000Hz_2s.wav`),
    "60": require(`../../../../assets/audio/pure_tone/60dB_HL/60dB_3000Hz_2s.wav`),
    "65": require(`../../../../assets/audio/pure_tone/65dB_HL/65dB_3000Hz_2s.wav`),
    "70": require(`../../../../assets/audio/pure_tone/70dB_HL/70dB_3000Hz_2s.wav`),
  },
  "4000": {
    "0": require(`../../../../assets/audio/pure_tone/0dB_HL/0dB_4000Hz_2s.wav`),
    "5": require(`../../../../assets/audio/pure_tone/5dB_HL/5dB_4000Hz_2s.wav`),
    "10": require(`../../../../assets/audio/pure_tone/10dB_HL/10dB_4000Hz_2s.wav`),
    "15": require(`../../../../assets/audio/pure_tone/15dB_HL/15dB_4000Hz_2s.wav`),
    "20": require(`../../../../assets/audio/pure_tone/20dB_HL/20dB_4000Hz_2s.wav`),
    "25": require(`../../../../assets/audio/pure_tone/25dB_HL/25dB_4000Hz_2s.wav`),
    "30": require(`../../../../assets/audio/pure_tone/30dB_HL/30dB_4000Hz_2s.wav`),
    "35": require(`../../../../assets/audio/pure_tone/35dB_HL/35dB_4000Hz_2s.wav`),
    "40": require(`../../../../assets/audio/pure_tone/40dB_HL/40dB_4000Hz_2s.wav`),
    "45": require(`../../../../assets/audio/pure_tone/45dB_HL/45dB_4000Hz_2s.wav`),
    "50": require(`../../../../assets/audio/pure_tone/50dB_HL/50dB_4000Hz_2s.wav`),
    "55": require(`../../../../assets/audio/pure_tone/55dB_HL/55dB_4000Hz_2s.wav`),
    "60": require(`../../../../assets/audio/pure_tone/60dB_HL/60dB_4000Hz_2s.wav`),
    "65": require(`../../../../assets/audio/pure_tone/65dB_HL/65dB_4000Hz_2s.wav`),
    "70": require(`../../../../assets/audio/pure_tone/70dB_HL/70dB_4000Hz_2s.wav`),
  },
  "6000": {
    "0": require(`../../../../assets/audio/pure_tone/0dB_HL/0dB_6000Hz_2s.wav`),
    "5": require(`../../../../assets/audio/pure_tone/5dB_HL/5dB_6000Hz_2s.wav`),
    "10": require(`../../../../assets/audio/pure_tone/10dB_HL/10dB_6000Hz_2s.wav`),
    "15": require(`../../../../assets/audio/pure_tone/15dB_HL/15dB_6000Hz_2s.wav`),
    "20": require(`../../../../assets/audio/pure_tone/20dB_HL/20dB_6000Hz_2s.wav`),
    "25": require(`../../../../assets/audio/pure_tone/25dB_HL/25dB_6000Hz_2s.wav`),
    "30": require(`../../../../assets/audio/pure_tone/30dB_HL/30dB_6000Hz_2s.wav`),
    "35": require(`../../../../assets/audio/pure_tone/35dB_HL/35dB_6000Hz_2s.wav`),
    "40": require(`../../../../assets/audio/pure_tone/40dB_HL/40dB_6000Hz_2s.wav`),
    "45": require(`../../../../assets/audio/pure_tone/45dB_HL/45dB_6000Hz_2s.wav`),
    "50": require(`../../../../assets/audio/pure_tone/50dB_HL/50dB_6000Hz_2s.wav`),
    "55": require(`../../../../assets/audio/pure_tone/55dB_HL/55dB_6000Hz_2s.wav`),
    "60": require(`../../../../assets/audio/pure_tone/60dB_HL/60dB_6000Hz_2s.wav`),
    "65": require(`../../../../assets/audio/pure_tone/65dB_HL/65dB_6000Hz_2s.wav`),
    "70": require(`../../../../assets/audio/pure_tone/70dB_HL/70dB_6000Hz_2s.wav`),
  },
  "8000": {
    "0": require(`../../../../assets/audio/pure_tone/0dB_HL/0dB_8000Hz_2s.wav`),
    "5": require(`../../../../assets/audio/pure_tone/5dB_HL/5dB_8000Hz_2s.wav`),
    "10": require(`../../../../assets/audio/pure_tone/10dB_HL/10dB_8000Hz_2s.wav`),
    "15": require(`../../../../assets/audio/pure_tone/15dB_HL/15dB_8000Hz_2s.wav`),
    "20": require(`../../../../assets/audio/pure_tone/20dB_HL/20dB_8000Hz_2s.wav`),
    "25": require(`../../../../assets/audio/pure_tone/25dB_HL/25dB_8000Hz_2s.wav`),
    "30": require(`../../../../assets/audio/pure_tone/30dB_HL/30dB_8000Hz_2s.wav`),
    "35": require(`../../../../assets/audio/pure_tone/35dB_HL/35dB_8000Hz_2s.wav`),
    "40": require(`../../../../assets/audio/pure_tone/40dB_HL/40dB_8000Hz_2s.wav`),
    "45": require(`../../../../assets/audio/pure_tone/45dB_HL/45dB_8000Hz_2s.wav`),
    "50": require(`../../../../assets/audio/pure_tone/50dB_HL/50dB_8000Hz_2s.wav`),
    "55": require(`../../../../assets/audio/pure_tone/55dB_HL/55dB_8000Hz_2s.wav`),
    "60": require(`../../../../assets/audio/pure_tone/60dB_HL/60dB_8000Hz_2s.wav`),
    "65": require(`../../../../assets/audio/pure_tone/65dB_HL/65dB_8000Hz_2s.wav`),
    "70": require(`../../../../assets/audio/pure_tone/70dB_HL/70dB_8000Hz_2s.wav`),
  },
};

export default function Screen() {
  const router = useRouter();
  const { isPaused, togglePause } = usePauseStore();

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>();
  const [currentFrequencyIndex, setCurrentFrequencyIndex] = useState<number>(0);
  const [currentIntensity, setCurrentIntensity] =
    useState<number>(INITIAL_INTENSITY);
  const [isInitialPhase, setIsInitialPhase] = useState<boolean>(true);
  const [lastResponseWasNo, setLastResponseWasNo] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState<boolean>(false);

  const handleNext = () => {
    router.push("/hearing-test/hearingScreening/hearingScreeningTest");
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

  const loadAndPlaySound = useCallback(
    async (frequency: number, intensity: number) => {
      try {
        if (sound) await sound.unloadAsync();

        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: false,
          shouldDuckAndroid: false,
        });

        const audioFile =
          audioFilePaths[frequency.toString()][intensity.toString()];
        console.log("Frequency =", frequency, "|", "Intensity =", intensity);

        const { sound: newSound } = await Audio.Sound.createAsync(
          audioFile,
          undefined,
          onPlaybackStatusUpdate
        );
        setSound(newSound);
        playSound(newSound);
      } catch (error) {
        console.error("Error loading sound:", error);
      }
    },
    [sound, playSound]
  );

  const onPlaybackStatusUpdate = useCallback(
    async (newStatus: AVPlaybackStatus) => {
      setStatus(newStatus);
      // console.log(JSON.stringify(newStatus, null, 2));
    },
    [sound]
  );

  const increaseIntensity = async () => {
    const newIntensity = Math.min(
      currentIntensity + TEST_INTENSITY_STEP_UP,
      70
    );
    setCurrentIntensity(newIntensity);
    await loadAndPlaySound(frequencies[currentFrequencyIndex], newIntensity);
  };

  const decreaseIntensity = async () => {
    const newIntensity = Math.max(
      currentIntensity - TEST_INTENSITY_STEP_DOWN,
      0
    );
    setCurrentIntensity(newIntensity);
    await loadAndPlaySound(frequencies[currentFrequencyIndex], newIntensity);
  };

  const handleYesPress = async () => {
    if (isInitialPhase) {
      setIsInitialPhase(false);
      setLastResponseWasNo(false); // Resetting for test phase
    } else {
      if (lastResponseWasNo) {
        console.log(
          `Test completed for ${frequencies[currentFrequencyIndex]} Hz, Final Intensity: ${currentIntensity} dB`
        );
        moveToNextFrequency();
      } else {
        await decreaseIntensity();
      }
    }
  };

  const handleNoPress = async () => {
    if (isInitialPhase) {
      const newIntensity = Math.min(
        currentIntensity + INITIAL_INTENSITY_STEP_UP,
        MAX_INTENSITY
      );
      setCurrentIntensity(newIntensity);
      await loadAndPlaySound(frequencies[currentFrequencyIndex], newIntensity);
    } else {
      await increaseIntensity();
      setLastResponseWasNo(true);
    }
  };

  const moveToNextFrequency = () => {
    if (currentFrequencyIndex < frequencies.length - 1) {
      setCurrentFrequencyIndex((prevIndex) => prevIndex + 1);
      setCurrentIntensity(INITIAL_INTENSITY);
      setIsInitialPhase(true); // Reset to initial phase for the new frequency
    } else {
      console.log("Test completed for all frequencies");
      setPracticeCompleted(true);
    }
  };

  // On Component Mount Sound Loading
  // useEffect(() => {
  //   loadAndPlaySound(frequencies[currentFrequencyIndex], INITIAL_INTENSITY);
  // }, []);

  // Initial Phase Sound Loading
  useEffect(() => {
    loadAndPlaySound(frequencies[currentFrequencyIndex], currentIntensity);
  }, [currentFrequencyIndex, currentIntensity]);

  // Test phase sound loading
  useEffect(() => {
    if (!isInitialPhase) {
      loadAndPlaySound(frequencies[currentFrequencyIndex], currentIntensity);
      console.log(
        `Test phase has begun for ${frequencies[currentFrequencyIndex]} Hz`
      );
    } else {
      loadAndPlaySound(frequencies[currentFrequencyIndex], INITIAL_INTENSITY);
    }
  }, [isInitialPhase, currentFrequencyIndex, currentIntensity]);

  // Sound Pausing
  useEffect(() => {
    if (isPaused) {
      // Pause the audio
      if (sound) {
        sound.pauseAsync();
        console.log("Sound Paused");
      }
    } else {
      // Resume the audio if needed
    }
  }, [isPaused, sound]);

  // Sound Unloading
  useEffect(() => {
    return sound
      ? () => {
          // console.log("Unloading Sound");
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
            Whenever you hear a beep, no matter how faint, please press yes but
            if you don't hear a beep for over 5 seconds, press no.
          </Text>
        </View>

        {practiceCompleted ? (
          <View className="items-center gap-32">
            <Text className="text-center text-xl font-bold">
              Great! You are ready for the test!
            </Text>
            <Ionicons name="arrow-down-outline" size={50} color="black" />
          </View>
        ) : (
          <View className="">
            <TouchableOpacity
              className="items-center justify-center rounded-full bg-blue-200 p-4 mb-8"
              onPress={handleYesPress}
            >
              <Text className="text-base font-medium text-blue-800">Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center justify-center rounded-full bg-red-200 p-4"
              onPress={handleNoPress}
            >
              <Text className="text-base font-medium text-red-800">No</Text>
            </TouchableOpacity>
          </View>
        )}
        <View className="mb-4 flex items-center">
          <SetUpButton
            title="I'm Ready"
            handlePress={handleNext}
            disabled={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
