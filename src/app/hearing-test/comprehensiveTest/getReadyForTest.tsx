import { Stack, useRouter } from "expo-router";
import { SafeAreaView, View, Text } from "react-native";

import { SetUpButton } from "@/components/ui/Button";

export default function Screen() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/hearing-test/comprehensiveTest/hearingScreeningTest");
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8 md:pt-10">
          <Text className="pb-6 text-3xl md:text-4xl font-bold">
            Hearing Screening Test
          </Text>
          <Text className="text-xl md:text-2xl text-center font-medium">
            Whenever you hear a beep, no matter how faint, please press YES.
          </Text>
          <Text className="text-xl md:text-2xl text-center font-medium">
            The test will begin after you press the button below.
          </Text>
        </View>
        <View className="items-center"></View>
        <View className="mb-4 flex items-center">
          <SetUpButton title="Begin Testing" handlePress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}
