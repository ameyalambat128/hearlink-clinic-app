import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Image, SafeAreaView, View, Text } from "react-native";

import { SetUpButton } from "@/components/ui/Button";

export default function Screen() {
  const router = useRouter();
  const [headphonesConnected, setHeadphonesConnected] = useState(true);

  const handleNext = () => {
    router.push("/hearingTest/hearingScreening/volumeAdjust");
  };
  // useEffect(() => {
  //   const checkHeadphonesConnected = async () => {
  //     const isConnected = await isHeadphonesConnected();
  //     setHeadphonesConnected(isConnected);
  //   };
  //   checkHeadphonesConnected();
  // }, []);

  return (
    <SafeAreaView className="flex h-full items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8">
          <Text className="pb-6 text-2xl font-bold">
            Connect Your Airpods Pro
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
          {/* Disable Link interaction when headphones are not connected */}
          {headphonesConnected ? (
            <SetUpButton title="Next" handlePress={handleNext} />
          ) : (
            <Button title="Next" disabled />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
