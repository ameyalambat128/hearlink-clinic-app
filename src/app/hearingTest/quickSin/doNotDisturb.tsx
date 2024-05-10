import { useRouter } from "expo-router";
import { Text, Image, SafeAreaView, View } from "react-native";

import { SetUpButton } from "@/components/ui/Button";

export default function DoNotDisturb() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/hearingTest/quickSin/practiceQuickSin");
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8">
          <Text className="pb-6 text-2xl font-bold">
            Turn on Do Not Disturb
          </Text>
          {/* TODO: Description update here */}
          <Text className="text-md text-center font-medium">
            To avoid interruptions, and to ensure the most accurate results,
            turn on Do Not Disturb
          </Text>
        </View>
        <View className="shadow-2xl">
          <Image
            source={require("../../../../assets/media/doNotDisturb.gif")} // Replace with your volume icon
            resizeMode="contain"
            style={{
              width: 300,
              height: 430,
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
