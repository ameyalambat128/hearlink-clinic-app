import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, View, Text } from "react-native";

import { SetUpButton } from "@/components/ui/Button";
import { Video } from "expo-av";

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
          <Text className="pb-6 text-2xl font-bold">
            Connect Your AirPods Max
          </Text>
          <Text className="text-md text-center font-medium">
            Remember to turn on noise cancellation
          </Text>
        </View>
        <View className="items-center">
          <Video
            source={require("../../../../assets/media/airpods-m.mp4")}
            style={{
              height: 520,
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
