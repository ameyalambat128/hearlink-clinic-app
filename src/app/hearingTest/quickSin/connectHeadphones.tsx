import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, Image, SafeAreaView, View } from "react-native";

import { SetUpButton } from "@/components/ui/Button";

export default function ConnectHeadphones() {
  const router = useRouter();
  const [headphonesConnected, setHeadphonesConnected] = useState(true);

  const handleNext = () => {
    router.push("/hearingTest/quickSin/volumeAdjust");
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8">
          <Text className="pb-6 text-2xl font-bold">
            Connect Your AirPods Pro
          </Text>
          <Text className="text-md text-center font-medium">
            Remember to turn on noise cancellation
          </Text>
        </View>
        <View className="shadow-2xl">
          <Image
            source={require("../../../../assets/media/noiseCancellation.gif")} // Replace with your volume icon
            resizeMode="contain"
            style={{
              width: 300,
              height: 450,
            }}
          />
        </View>
        <View className="mb-4 flex items-center">
          <SetUpButton title="Next" handlePress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}
