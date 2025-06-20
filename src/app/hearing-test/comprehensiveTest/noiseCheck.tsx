import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  useColorScheme,
  Text,
} from "react-native";
import { configureReanimatedLogger } from "react-native-reanimated";

import { SetUpButton } from "@/components/ui/Button";
import AudioMeter from "@/components/AudioMeter";
import Colors from "@/constants/Colors";

configureReanimatedLogger({
  strict: false,
});

export default function Screen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const recordingRef = useRef<Audio.Recording | null>(null);

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [metering, setMetering] = useState(0);
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const [meter, setMeter] = useState(0);

  const handleNext = async () => {
    await stopRecording();
    recordingRef.current = null;
    router.push("/hearing-test/comprehensiveTest/chooseHeadphones");
  };

  const startRecording = async () => {
    try {
      if (recordingRef.current) recordingRef.current.stopAndUnloadAsync();
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
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

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: false,
    });
  };

  const startMetering = async () => {
    await startRecording();
  };

  useEffect(() => {
    startMetering();
  }, []);

  useEffect(() => {
    return recordingRef.current
      ? () => {
          console.log("Unloading Recording");
          recordingRef.current?.stopAndUnloadAsync();
        }
      : undefined;
  }, [recordingRef.current]);

  return (
    <SafeAreaView className="flex h-full items-center justify-center">
      <Stack.Screen
        options={{
          title: "Get Set Up",
          headerLeft: () => <View />,
          headerRight: () => (
            <TouchableOpacity
              onPress={async () => {
                if (recordingRef.current) await stopRecording();
                router.dismissAll();
                router.dismissAll();
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
        <View className="flex items-center pt-8 md:pt-10">
          <Text className="pb-6 text-3xl md:text-4xl font-bold">
            Find a quiet place
          </Text>
          <Text className="text-xl md:text-2xl text-center font-medium">
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
