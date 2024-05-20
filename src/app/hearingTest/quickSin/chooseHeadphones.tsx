import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { SetUpButton } from "@/components/ui/Button";

export default function Screen() {
  const router = useRouter();
  const [headphonesConnected, setHeadphonesConnected] = useState(true);
  const [selectedHeadphones, setSelectedHeadphones] = useState<
    "airpodsPro" | "airpodsMax" | null
  >(null);

  const handleHeadphonesSelection = (
    headphonesType: "airpodsPro" | "airpodsMax"
  ) => {
    setSelectedHeadphones(headphonesType);
  };

  const handleNext = () => {
    router.push("/hearingTest/quickSin/connectHeadphones");
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8">
          <Text className="pb-6 text-2xl font-bold">
            Connect Your Headphones
          </Text>
          <Text className="text-md text-center font-medium">
            Remember to turn on noise cancellation
          </Text>
        </View>
        <View className="flex flex-col justify-center w-full">
          <TouchableOpacity
            className={`flex flex-row items-center rounded-xl border-2  bg-gray-200 p-4 mb-8 ${
              selectedHeadphones === "airpodsPro"
                ? "border-2 border-blue-500"
                : "border-transparent"
            }`}
            onPress={() => handleHeadphonesSelection("airpodsPro")}
          >
            <Image
              source={require("../../../../assets/images/airpods-pro.png")}
              style={{ width: 50, height: 50, borderRadius: 10 }}
            />
            <Text className="ml-4 text-lg font-semibold">Airpods Pro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex flex-row items-center rounded-xl border-2  bg-gray-200 p-4 ${
              selectedHeadphones === "airpodsMax"
                ? "border-blue-500"
                : "border-transparent"
            }`}
            onPress={() => handleHeadphonesSelection("airpodsMax")}
          >
            <Image
              source={require("../../../../assets/images/airpods-max.png")}
              style={{ width: 50, height: 50, borderRadius: 10 }}
            />
            <Text className="ml-4 text-lg font-semibold">Airpods Max</Text>
          </TouchableOpacity>
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
