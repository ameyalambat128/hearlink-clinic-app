import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, Image, SafeAreaView, View } from "react-native";

import { SetUpButton } from "@/components/ui/Button";

export default function Screen() {
  const router = useRouter();
  const [volume, setVolume] = useState(0);

  const handleNext = () => {
    router.push("/hearing-test/comprehensiveTest/doNotDisturb");
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8">
          <Text className="pb-6 text-2xl font-bold">Adjust your Volume</Text>
          {/* TODO: Description update here */}
          <Text className="text-md text-center font-medium">
            Increase the volume to 100% using the slider below or the volume
            buttons on your phone
          </Text>
        </View>
        <View className="shadow-2xl">
          <Image
            source={require("../../../../assets/media/volumeAdjust.gif")} // Replace with your volume icon
            resizeMode="contain"
            style={{
              width: 300,
              height: 300,
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
