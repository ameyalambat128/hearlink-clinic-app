import { Link, useRouter } from "expo-router";
import { Button, Image, SafeAreaView, View, Text } from "react-native";

import { SetUpButton } from "@/components/ui/Button";

export default function Screen() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/hearingTest/hearingScreening/enterDetails");
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8">
          <Text className="pb-6 text-2xl font-bold">
            Hearing Screening Test
          </Text>
          <Text className="text-md text-center font-medium">
            This test determines the quietest sounds a person can hear at
            different pitches.
          </Text>
        </View>
        {/* <View className="items-center"> */}
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
        {/* </View> */}
        <View className="mb-4 flex items-center">
          <SetUpButton title="Next" handlePress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}
