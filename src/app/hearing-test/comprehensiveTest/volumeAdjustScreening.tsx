import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, Image, SafeAreaView, View, Platform } from "react-native";

import { SetUpButton } from "@/components/ui/Button";

const isPad: boolean = Platform.OS === "ios" && Platform.isPad;

export default function Screen() {
  const router = useRouter();
  const [volume, setVolume] = useState(0);

  const handleNext = () => {
    router.push("/hearing-test/comprehensiveTest/hearingScreeningTest");
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8 md:pt-10">
          <Text className="pb-6 text-3xl md:text-4xl font-bold">
            Adjust your Volume
          </Text>
          {/* TODO: Description update here */}
          <Text className="text-xl md:text-2xl text-center font-medium">
            Increase the volume to 100% using the slider below or the volume
            buttons on your phone
          </Text>
        </View>
        <View className="flex items-center shadow-2xl">
          <Image
            source={require("../../../../assets/media/volumeAdjustQ.gif")} // Replace with your volume icon
            resizeMode="contain"
            style={{
              width: 300 * (isPad ? 2 : 1),
              height: 300 * (isPad ? 2 : 1),
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
