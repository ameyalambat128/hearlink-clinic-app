import { Link, useRouter } from "expo-router";
import { Text, Image, SafeAreaView, View } from "react-native";

import { SetUpButton } from "@/components/ui/Button";

export default function QuickSin() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/hearingTest/quickSin/noiseCheck");
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8">
          <Text className="pb-6 text-2xl font-bold">QuickSIN Test</Text>
          <Text className="text-md text-center font-medium">
            The QuickSIN test is a rapid and effective assessment tool used in
            audiology to measure a person's ability to understand speech in
            noisy environments, helping to identify issues with speech
            discrimination
          </Text>
        </View>
        <View className="items-center">
          <Image
            source={require("../../../../assets/images/quicksin-logo.png")}
            style={{
              width: "100%",
              height: undefined,
              aspectRatio: 1,
              resizeMode: "contain",
              borderRadius: 24,
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
