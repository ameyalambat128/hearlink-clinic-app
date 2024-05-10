import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Stack, useNavigation, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
  Text,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { SetUpButton } from "@/components/ui/Button";
import Colors from "@/constants/Colors";

const AudioMeter = ({ dbValue }: { dbValue: number }) => {
  const meterLevel = useSharedValue(0);
  const [smoothedDbValue, setSmoothedDbValue] = useState(dbValue);
  const smoothingFactor = 0.2; // Adjust this to control smoothing (0 to 1)
  const updateInterval = 30; // How often to update the smoothed value in milliseconds

  const normalizeMetering = (db: number) => {
    const minDb = -60;
    const maxDb = 0;
    return db < minDb ? 0 : db > maxDb ? 1 : (db - minDb) / (maxDb - minDb);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Apply simple exponential smoothing
      setSmoothedDbValue(
        (prevSmoothedDb) =>
          prevSmoothedDb + smoothingFactor * (dbValue - prevSmoothedDb)
      );
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [dbValue]);

  useEffect(() => {
    meterLevel.value = withTiming(normalizeMetering(smoothedDbValue), {
      duration: updateInterval,
    });
  }, [smoothedDbValue]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: `${meterLevel.value * 100}%`,
    };
  });

  return (
    <View style={styles.meterContainer}>
      <Animated.View style={[styles.meterFill, animatedStyles]} />
    </View>
  );
};

const styles = StyleSheet.create({
  meterContainer: {
    width: "100%",
    height: 20,
    backgroundColor: "lightgray",
    borderRadius: 10,
    overflow: "hidden",
  },
  meterFill: {
    height: "100%",
    backgroundColor: "green",
    borderRadius: 10,
  },
});

export default function Screen() {
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const recordingRef = useRef<Audio.Recording | null>(null);

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [metering, setMetering] = useState(0);
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const [meter, setMeter] = useState(0);

  const startRecording = async () => {
    try {
      if (recordingRef.current) recordingRef.current.stopAndUnloadAsync();
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          // Android-specific settings
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
          onRecordingStatusUpdate
        );

        recordingRef.current = newRecording;
        await newRecording.startAsync();
        console.log("Recording started");
      }
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const onRecordingStatusUpdate = async (newStatus: Audio.RecordingStatus) => {
    setStatus(newStatus);
    console.log("Recording status:", newStatus);
    if (newStatus.isRecording && newStatus.metering) {
      setMetering(newStatus.metering);
    }
  };

  const stopRecording = async () => {
    const currentRecording = recordingRef.current;
    if (!currentRecording) return;
    await currentRecording.stopAndUnloadAsync();
    console.log("Recording stopped");
    const uri = currentRecording.getURI();
    console.log("Recording URI:", uri);
  };

  const startMetering = async () => {
    await startRecording();
  };

  const handleNext = async () => {
    await stopRecording();
    router.push("/hearingTest/hearingScreening/connectHeadphones");
  };

  useEffect(() => {
    startMetering();
  }, []);

  return (
    <SafeAreaView className="flex h-full items-center justify-center">
      <Stack.Screen
        options={{
          title: "Get Set Up",
          headerLeft: () => <View />,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                stopRecording();
                navigation.dispatch({ type: "POP_TO_TOP" });
                navigation.dispatch({ type: "POP_TO_TOP" });
              }}
            >
              <Ionicons
                name="close-outline"
                size={30}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8">
          <Text className="pb-6 text-2xl font-bold">Find a quiet place</Text>
          <Text className="text-md text-center font-medium">
            The hearing test is most accurate when done in silence
          </Text>
        </View>
        <AudioMeter dbValue={metering} />
        <View className="mb-4 flex items-center">
          <SetUpButton title="All Set" handlePress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}
