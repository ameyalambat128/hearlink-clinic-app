import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, View, Text, Platform } from "react-native";

import { SetUpButton } from "@/components/ui/Button";
import { Video } from "expo-av";

const isPad: boolean = Platform.OS === "ios" && Platform.isPad;

export default function Screen() {
  const router = useRouter();
  const [headphonesConnected, setHeadphonesConnected] = useState(true);

  const handleNext = () => {
    router.push("/hearing-test/comprehensiveTest/volumeAdjust");
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8">
          <Text className="pb-6 text-3xl font-bold">Connect Your AirPods</Text>
          <Text className="text-xl text-center font-medium">
            Remember to turn on noise cancellation
          </Text>
        </View>
        <View className="items-center">
          <Video
            source={require("../../../../assets/media/airpods-p.mp4")}
            style={{
              height: 520 * (isPad ? 1.8 : 1),
              width: "100%",
            }}
            isLooping={true}
            shouldPlay={true}
            isMuted={true}
          />
        </View>
        <View className="mb-4 flex items-center">
          <SetUpButton title="Next" handlePress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}
