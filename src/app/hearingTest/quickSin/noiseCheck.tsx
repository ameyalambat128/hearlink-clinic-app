import { useRouter } from "expo-router";
import { Text, Image, SafeAreaView, View } from "react-native";

import { SetUpButton } from "@/components/ui/Button";

export default function NoiseCheck() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/hearingTest/quickSin/connectHeadphones");
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="w-3/4 flex-1 justify-between">
        <View className="flex items-center pt-8">
          <Text className="pb-6 text-2xl font-bold">Find a quiet place</Text>
          <Text className="text-md text-center font-medium">
            The hearing test is most accurate when done in silence
          </Text>
        </View>
        <View className="">
          <Image
            source={require("../../../../assets/images/quietPlace.png")} // Replace with your volume icon
            resizeMode="contain"
            style={{
              width: 300,
              height: 300,
            }}
          />
        </View>
        <View className="mb-4 flex items-center">
          <SetUpButton title="All Set" handlePress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}
