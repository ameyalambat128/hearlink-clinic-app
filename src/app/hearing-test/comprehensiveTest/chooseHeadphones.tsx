import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { SetUpButton } from "@/components/ui/Button";

export default function Screen() {
  const router = useRouter();
  const [selectedHeadphones, setSelectedHeadphones] = useState<
    "airpodsPro" | "airpodsMax" | null
  >(null);

  const handleHeadphonesSelection = (
    headphonesType: "airpodsPro" | "airpodsMax"
  ) => {
    setSelectedHeadphones(headphonesType);
  };

  const handleNext = () => {
    if (selectedHeadphones === "airpodsPro") {
      router.push("/hearing-test/comprehensiveTest/connectAirpodsPro");
    } else if (selectedHeadphones === "airpodsMax") {
      router.push("/hearing-test/comprehensiveTest/connectAirpodsMax");
    }
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8">
          <Text className="pb-6 text-3xl font-bold">
            Connect Your Headphones
          </Text>
          <Text className="text-xl text-center font-medium">
            Remember to turn on noise cancellation
          </Text>
        </View>
        <View className="flex flex-col justify-center w-full">
          <TouchableOpacity
            className={`flex flex-row items-center rounded-xl border-2 bg-gray-200 p-4 lg:p-10 mb-8 lg:mb-20 ${
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
            <Text className="ml-4 text-lg font-semibold">Airpods Pro 2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex flex-row items-center rounded-xl border-2 bg-gray-200 lg:p-10 ${
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
          <SetUpButton
            title="Next"
            disabled={!selectedHeadphones}
            handlePress={handleNext}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
