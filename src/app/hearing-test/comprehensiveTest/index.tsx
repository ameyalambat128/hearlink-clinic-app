import { useRouter } from "expo-router";
import { Image, SafeAreaView, View, Text } from "react-native";

import { SetUpButton } from "@/components/ui/Button";

export default function Screen() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/hearing-test/comprehensiveTest/enterDetails");
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8 lg:pt-10">
          <Text className="pb-6 text-3xl lg:text-5xl font-bold">
            Hearing Screening Test
          </Text>
          <Text className="text-xl lg:text-3xl text-center font-medium">
            Easily screen your hearing with key tones at different frequencies
            and assess your ability to hear speech in noise using the QuickSIN
            test. Get instant results to help determine if you need a more
            detailed hearing test.
          </Text>
        </View>
        <View className="items-center">
          <Image
            source={require("../../../../assets/images/hearingscreen-logo.png")}
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
