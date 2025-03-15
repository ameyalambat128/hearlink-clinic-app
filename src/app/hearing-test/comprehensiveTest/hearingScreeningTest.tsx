import { AVPlaybackStatus, Audio, InterruptionModeIOS } from "expo-av";
import { Stack, useRouter } from "expo-router";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

import { usePauseStore, useHearingScreeningResultsStore } from "@/store/store";
import Colors from "@/constants/Colors";

const frequencies: number[] = [1000, 2000, 4000, 8000, 500];
const INITIAL_INTENSITY: number = 35;
const SECOND_INTENSITY: number = 25;
const TEST_INTENSITY_STEP_UP: number = 5;
const TEST_INTENSITY_STEP_DOWN: number = 10;
const INITIAL_INTENSITY_STEP_UP: number = 20;
const MAX_INTENSITY: number = 70;
const RESPONSE_TIMEOUT: number = 3000; // 3 seconds

const audioFilePathsRight: {
  [frequency: string]: {
    [intensity: string]: number;
  };
} = {
  "250": {
    "0": require(`../../../../assets/audio/pure_tone_right/0dB_HL/0dB_250Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_right/5dB_HL/5dB_250Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_right/10dB_HL/10dB_250Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_right/15dB_HL/15dB_250Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_right/20dB_HL/20dB_250Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_right/25dB_HL/25dB_250Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_right/30dB_HL/30dB_250Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_right/35dB_HL/35dB_250Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_right/40dB_HL/40dB_250Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_right/45dB_HL/45dB_250Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_right/50dB_HL/50dB_250Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_right/55dB_HL/55dB_250Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_right/60dB_HL/60dB_250Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_right/65dB_HL/65dB_250Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_right/70dB_HL/70dB_250Hz_2s.aac`),
  },
  "500": {
    "0": require(`../../../../assets/audio/pure_tone_right/0dB_HL/0dB_500Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_right/5dB_HL/5dB_500Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_right/10dB_HL/10dB_500Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_right/15dB_HL/15dB_500Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_right/20dB_HL/20dB_500Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_right/25dB_HL/25dB_500Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_right/30dB_HL/30dB_500Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_right/35dB_HL/35dB_500Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_right/40dB_HL/40dB_500Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_right/45dB_HL/45dB_500Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_right/50dB_HL/50dB_500Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_right/55dB_HL/55dB_500Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_right/60dB_HL/60dB_500Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_right/65dB_HL/65dB_500Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_right/70dB_HL/70dB_500Hz_2s.aac`),
  },
  "1000": {
    "0": require(`../../../../assets/audio/pure_tone_right/0dB_HL/0dB_1000Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_right/5dB_HL/5dB_1000Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_right/10dB_HL/10dB_1000Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_right/15dB_HL/15dB_1000Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_right/20dB_HL/20dB_1000Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_right/25dB_HL/25dB_1000Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_right/30dB_HL/30dB_1000Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_right/35dB_HL/35dB_1000Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_right/40dB_HL/40dB_1000Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_right/45dB_HL/45dB_1000Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_right/50dB_HL/50dB_1000Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_right/55dB_HL/55dB_1000Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_right/60dB_HL/60dB_1000Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_right/65dB_HL/65dB_1000Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_right/70dB_HL/70dB_1000Hz_2s.aac`),
  },
  "2000": {
    "0": require(`../../../../assets/audio/pure_tone_right/0dB_HL/0dB_2000Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_right/5dB_HL/5dB_2000Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_right/10dB_HL/10dB_2000Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_right/15dB_HL/15dB_2000Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_right/20dB_HL/20dB_2000Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_right/25dB_HL/25dB_2000Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_right/30dB_HL/30dB_2000Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_right/35dB_HL/35dB_2000Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_right/40dB_HL/40dB_2000Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_right/45dB_HL/45dB_2000Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_right/50dB_HL/50dB_2000Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_right/55dB_HL/55dB_2000Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_right/60dB_HL/60dB_2000Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_right/65dB_HL/65dB_2000Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_right/70dB_HL/70dB_2000Hz_2s.aac`),
  },
  "3000": {
    "0": require(`../../../../assets/audio/pure_tone_right/0dB_HL/0dB_3000Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_right/5dB_HL/5dB_3000Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_right/10dB_HL/10dB_3000Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_right/15dB_HL/15dB_3000Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_right/20dB_HL/20dB_3000Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_right/25dB_HL/25dB_3000Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_right/30dB_HL/30dB_3000Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_right/35dB_HL/35dB_3000Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_right/40dB_HL/40dB_3000Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_right/45dB_HL/45dB_3000Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_right/50dB_HL/50dB_3000Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_right/55dB_HL/55dB_3000Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_right/60dB_HL/60dB_3000Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_right/65dB_HL/65dB_3000Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_right/70dB_HL/70dB_3000Hz_2s.aac`),
  },
  "4000": {
    "0": require(`../../../../assets/audio/pure_tone_right/0dB_HL/0dB_4000Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_right/5dB_HL/5dB_4000Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_right/10dB_HL/10dB_4000Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_right/15dB_HL/15dB_4000Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_right/20dB_HL/20dB_4000Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_right/25dB_HL/25dB_4000Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_right/30dB_HL/30dB_4000Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_right/35dB_HL/35dB_4000Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_right/40dB_HL/40dB_4000Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_right/45dB_HL/45dB_4000Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_right/50dB_HL/50dB_4000Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_right/55dB_HL/55dB_4000Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_right/60dB_HL/60dB_4000Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_right/65dB_HL/65dB_4000Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_right/70dB_HL/70dB_4000Hz_2s.aac`),
  },
  "6000": {
    "0": require(`../../../../assets/audio/pure_tone_right/0dB_HL/0dB_6000Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_right/5dB_HL/5dB_6000Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_right/10dB_HL/10dB_6000Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_right/15dB_HL/15dB_6000Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_right/20dB_HL/20dB_6000Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_right/25dB_HL/25dB_6000Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_right/30dB_HL/30dB_6000Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_right/35dB_HL/35dB_6000Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_right/40dB_HL/40dB_6000Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_right/45dB_HL/45dB_6000Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_right/50dB_HL/50dB_6000Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_right/55dB_HL/55dB_6000Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_right/60dB_HL/60dB_6000Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_right/65dB_HL/65dB_6000Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_right/70dB_HL/70dB_6000Hz_2s.aac`),
  },
  "8000": {
    "0": require(`../../../../assets/audio/pure_tone_right/0dB_HL/0dB_8000Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_right/5dB_HL/5dB_8000Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_right/10dB_HL/10dB_8000Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_right/15dB_HL/15dB_8000Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_right/20dB_HL/20dB_8000Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_right/25dB_HL/25dB_8000Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_right/30dB_HL/30dB_8000Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_right/35dB_HL/35dB_8000Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_right/40dB_HL/40dB_8000Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_right/45dB_HL/45dB_8000Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_right/50dB_HL/50dB_8000Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_right/55dB_HL/55dB_8000Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_right/60dB_HL/60dB_8000Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_right/65dB_HL/65dB_8000Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_right/70dB_HL/70dB_8000Hz_2s.aac`),
  },
};

const audioFilePathsLeft: {
  [frequency: string]: {
    [intensity: string]: number;
  };
} = {
  "250": {
    "0": require(`../../../../assets/audio/pure_tone_left/0dB_HL/0dB_250Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_left/5dB_HL/5dB_250Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_left/10dB_HL/10dB_250Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_left/15dB_HL/15dB_250Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_left/20dB_HL/20dB_250Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_left/25dB_HL/25dB_250Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_left/30dB_HL/30dB_250Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_left/35dB_HL/35dB_250Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_left/40dB_HL/40dB_250Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_left/45dB_HL/45dB_250Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_left/50dB_HL/50dB_250Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_left/55dB_HL/55dB_250Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_left/60dB_HL/60dB_250Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_left/65dB_HL/65dB_250Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_left/70dB_HL/70dB_250Hz_2s.aac`),
  },
  "500": {
    "0": require(`../../../../assets/audio/pure_tone_left/0dB_HL/0dB_500Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_left/5dB_HL/5dB_500Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_left/10dB_HL/10dB_500Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_left/15dB_HL/15dB_500Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_left/20dB_HL/20dB_500Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_left/25dB_HL/25dB_500Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_left/30dB_HL/30dB_500Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_left/35dB_HL/35dB_500Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_left/40dB_HL/40dB_500Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_left/45dB_HL/45dB_500Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_left/50dB_HL/50dB_500Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_left/55dB_HL/55dB_500Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_left/60dB_HL/60dB_500Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_left/65dB_HL/65dB_500Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_left/70dB_HL/70dB_500Hz_2s.aac`),
  },
  "1000": {
    "0": require(`../../../../assets/audio/pure_tone_left/0dB_HL/0dB_1000Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_left/5dB_HL/5dB_1000Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_left/10dB_HL/10dB_1000Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_left/15dB_HL/15dB_1000Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_left/20dB_HL/20dB_1000Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_left/25dB_HL/25dB_1000Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_left/30dB_HL/30dB_1000Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_left/35dB_HL/35dB_1000Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_left/40dB_HL/40dB_1000Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_left/45dB_HL/45dB_1000Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_left/50dB_HL/50dB_1000Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_left/55dB_HL/55dB_1000Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_left/60dB_HL/60dB_1000Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_left/65dB_HL/65dB_1000Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_left/70dB_HL/70dB_1000Hz_2s.aac`),
  },
  "2000": {
    "0": require(`../../../../assets/audio/pure_tone_left/0dB_HL/0dB_2000Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_left/5dB_HL/5dB_2000Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_left/10dB_HL/10dB_2000Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_left/15dB_HL/15dB_2000Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_left/20dB_HL/20dB_2000Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_left/25dB_HL/25dB_2000Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_left/30dB_HL/30dB_2000Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_left/35dB_HL/35dB_2000Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_left/40dB_HL/40dB_2000Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_left/45dB_HL/45dB_2000Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_left/50dB_HL/50dB_2000Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_left/55dB_HL/55dB_2000Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_left/60dB_HL/60dB_2000Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_left/65dB_HL/65dB_2000Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_left/70dB_HL/70dB_2000Hz_2s.aac`),
  },
  "3000": {
    "0": require(`../../../../assets/audio/pure_tone_left/0dB_HL/0dB_3000Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_left/5dB_HL/5dB_3000Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_left/10dB_HL/10dB_3000Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_left/15dB_HL/15dB_3000Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_left/20dB_HL/20dB_3000Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_left/25dB_HL/25dB_3000Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_left/30dB_HL/30dB_3000Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_left/35dB_HL/35dB_3000Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_left/40dB_HL/40dB_3000Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_left/45dB_HL/45dB_3000Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_left/50dB_HL/50dB_3000Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_left/55dB_HL/55dB_3000Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_left/60dB_HL/60dB_3000Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_left/65dB_HL/65dB_3000Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_left/70dB_HL/70dB_3000Hz_2s.aac`),
  },
  "4000": {
    "0": require(`../../../../assets/audio/pure_tone_left/0dB_HL/0dB_4000Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_left/5dB_HL/5dB_4000Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_left/10dB_HL/10dB_4000Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_left/15dB_HL/15dB_4000Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_left/20dB_HL/20dB_4000Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_left/25dB_HL/25dB_4000Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_left/30dB_HL/30dB_4000Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_left/35dB_HL/35dB_4000Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_left/40dB_HL/40dB_4000Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_left/45dB_HL/45dB_4000Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_left/50dB_HL/50dB_4000Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_left/55dB_HL/55dB_4000Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_left/60dB_HL/60dB_4000Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_left/65dB_HL/65dB_4000Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_left/70dB_HL/70dB_4000Hz_2s.aac`),
  },
  "6000": {
    "0": require(`../../../../assets/audio/pure_tone_left/0dB_HL/0dB_6000Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_left/5dB_HL/5dB_6000Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_left/10dB_HL/10dB_6000Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_left/15dB_HL/15dB_6000Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_left/20dB_HL/20dB_6000Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_left/25dB_HL/25dB_6000Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_left/30dB_HL/30dB_6000Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_left/35dB_HL/35dB_6000Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_left/40dB_HL/40dB_6000Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_left/45dB_HL/45dB_6000Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_left/50dB_HL/50dB_6000Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_left/55dB_HL/55dB_6000Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_left/60dB_HL/60dB_6000Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_left/65dB_HL/65dB_6000Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_left/70dB_HL/70dB_6000Hz_2s.aac`),
  },
  "8000": {
    "0": require(`../../../../assets/audio/pure_tone_left/0dB_HL/0dB_8000Hz_2s.aac`),
    "5": require(`../../../../assets/audio/pure_tone_left/5dB_HL/5dB_8000Hz_2s.aac`),
    "10": require(`../../../../assets/audio/pure_tone_left/10dB_HL/10dB_8000Hz_2s.aac`),
    "15": require(`../../../../assets/audio/pure_tone_left/15dB_HL/15dB_8000Hz_2s.aac`),
    "20": require(`../../../../assets/audio/pure_tone_left/20dB_HL/20dB_8000Hz_2s.aac`),
    "25": require(`../../../../assets/audio/pure_tone_left/25dB_HL/25dB_8000Hz_2s.aac`),
    "30": require(`../../../../assets/audio/pure_tone_left/30dB_HL/30dB_8000Hz_2s.aac`),
    "35": require(`../../../../assets/audio/pure_tone_left/35dB_HL/35dB_8000Hz_2s.aac`),
    "40": require(`../../../../assets/audio/pure_tone_left/40dB_HL/40dB_8000Hz_2s.aac`),
    "45": require(`../../../../assets/audio/pure_tone_left/45dB_HL/45dB_8000Hz_2s.aac`),
    "50": require(`../../../../assets/audio/pure_tone_left/50dB_HL/50dB_8000Hz_2s.aac`),
    "55": require(`../../../../assets/audio/pure_tone_left/55dB_HL/55dB_8000Hz_2s.aac`),
    "60": require(`../../../../assets/audio/pure_tone_left/60dB_HL/60dB_8000Hz_2s.aac`),
    "65": require(`../../../../assets/audio/pure_tone_left/65dB_HL/65dB_8000Hz_2s.aac`),
    "70": require(`../../../../assets/audio/pure_tone_left/70dB_HL/70dB_8000Hz_2s.aac`),
  },
};

export default function Screen() {
  const router = useRouter();
  const { isPaused, togglePause } = usePauseStore();
  const setGTestResult = useHearingScreeningResultsStore(
    (state) => state.setTestResults
  );

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [status, setStatus] = useState<AVPlaybackStatus>();
  const [currentFrequencyIndex, setCurrentFrequencyIndex] = useState<number>(0);
  const [currentIntensity, setCurrentIntensity] =
    useState<number>(INITIAL_INTENSITY);
  const [currentEar, setCurrentEar] = useState<"right" | "left">("right");
  const [results, setResults] = useState({ right: {}, left: {} });
  const [progress, setProgress] = useState(new Animated.Value(0));

  const pressAnim = useRef(new Animated.Value(1)).current;

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

  const loadAndPlaySound = useCallback(
    async (frequency: number, intensity: number) => {
      try {
        if (sound) await sound.unloadAsync();

        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          staysActiveInBackground: false,
        });

        const audioFile =
          currentEar === "right"
            ? audioFilePathsRight[frequency.toString()][intensity.toString()]
            : audioFilePathsLeft[frequency.toString()][intensity.toString()];
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
    [sound, currentEar, playSound]
  );

  const onPlaybackStatusUpdate = useCallback(
    async (newStatus: AVPlaybackStatus) => {
      setStatus(newStatus);
      // console.log(JSON.stringify(newStatus, null, 2));
    },
    [sound]
  );

  const decreaseIntensity = async () => {
    const newIntensity = Math.max(
      currentIntensity - TEST_INTENSITY_STEP_DOWN,
      0
    );
    setCurrentIntensity(newIntensity);
  };

  const handleYesPress = async () => {
    if (currentIntensity === SECOND_INTENSITY) {
      setTestResult(frequencies[currentFrequencyIndex], currentIntensity);
      moveToNextFrequency();
    } else {
      decreaseIntensity();
    }
  };

  const setTestResult = (frequency: number, intensity: number) => {
    setResults((prevResults) => ({
      ...prevResults,
      [currentEar]: {
        ...prevResults[currentEar],
        [frequency]: intensity,
      },
    }));
  };

  const finishTest = () => {
    setResults((currentResults) => {
      console.log("Finish Test: ", currentResults);
      // Both ears have been tested, update the global state
      setGTestResult(currentResults.right, currentResults.left);
      return currentResults;
    });
    handleNext();
  };

  const moveToNextFrequency = () => {
    // First, save the current frequency result
    setTestResult(frequencies[currentFrequencyIndex], currentIntensity);

    // Check if we're at the last frequency in the array
    if (currentFrequencyIndex < frequencies.length - 1) {
      // Move to next frequency in the same ear
      setCurrentFrequencyIndex((prevIndex) => prevIndex + 1);
      setCurrentIntensity(INITIAL_INTENSITY);
    } else {
      // We've reached the end of frequencies for current ear
      if (currentEar === "right") {
        // Switch to left ear and reset to first frequency
        setCurrentEar("left");
        setCurrentFrequencyIndex(0);
        setCurrentIntensity(INITIAL_INTENSITY);
        console.log(
          "Switching to left ear, starting with frequency:",
          frequencies[0]
        );
      } else {
        // Both ears have been tested for all frequencies
        finishTest();
      }
    }
  };

  const testPaused = () => {
    togglePause();
    router.push("/(modals)/pause-modal");
  };

  const handleButtonPressIn = () => {
    setIsPressed(true);
    Animated.timing(pressAnim, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    setIsPressed(false);
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    handleYesPress();
  };

  // Test phase sound loading
  useEffect(() => {
    loadAndPlaySound(frequencies[currentFrequencyIndex], currentIntensity);
    console.log(
      `Test phase has begun for ${currentEar}: ${frequencies[currentFrequencyIndex]} Hz`
    );
  }, [currentFrequencyIndex, currentIntensity]);

  // Timeout for no response
  useEffect(() => {
    const timeout = setTimeout(() => {
      moveToNextFrequency();
    }, 8000); // 8 seconds

    return () => {};
  }, [currentFrequencyIndex, currentIntensity, currentEar]);

  // Add cleanup function to handle test interruption

  // Update your existing useEffect for isPaused
  useEffect(() => {
    if (isPaused) {
      // Pause the audio
      if (sound) {
        sound.pauseAsync();
        console.log("Sound Paused");
      }
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

  // Circle Animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Stack.Screen
        options={{
          title: "Hearing Test",
          gestureEnabled: false,
          headerLeft: () => <View />,
          headerRight: () => (
            <TouchableOpacity onPress={testPaused}>
              <Ionicons
                name="pause-outline"
                size={30}
                color={Colors["light"].text}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8 md:pt-10">
          <Text className="pb-6 text-3xl md:text-4xl font-bold">
            Hearing Screening Test
          </Text>
          <Text className="text-xl md:text-2xl text-center font-medium">
            Whenever you hear a tone, no matter how faint, please tap the
            circle.
          </Text>
        </View>

        <View className="mb-4 flex items-center justify-center gap-y-36 h-2/3 relative">
          <Animated.View
            className="w-[250px] md:w-[500px] h-[250px] md:h-[500px] border-4 md:border-[5px] rounded-full"
            style={{
              borderColor: "rgba(30, 144, 255, 0.6)",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "transparent",
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.7, 1],
              }),
              transform: [
                {
                  scale: Animated.multiply(
                    progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.1],
                    }),
                    pressAnim
                  ),
                },
              ],
            }}
          >
            <TouchableOpacity
              className="items-center justify-center rounded-full z-10 w-[250px] md:w-[500px] h-[250px] md:h-[500px]"
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
            >
              <Text className="text-blue-800 text-xl font-bold"></Text>
            </TouchableOpacity>
            <BlurView
              intensity={10} // Adjust blur strength
              tint="regular"
              className="absolute w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full"
            />
          </Animated.View>
          <Text className="text-xl text-center mt-8 text-gray-700 font-medium">
            Tap the circle when you hear a tone
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
