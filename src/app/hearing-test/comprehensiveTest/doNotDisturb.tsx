import { useRouter } from "expo-router";
import { Text, Image, SafeAreaView, View, Platform } from "react-native";

import { SetUpButton } from "@/components/ui/Button";
import { Video, ResizeMode } from "expo-av";

const isPad: boolean = Platform.OS === "ios" && Platform.isPad;

export default function Screen() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/hearing-test/comprehensiveTest/quickSinTest");
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8">
          <Text className="pb-6 text-3xl font-bold">
            Turn on Do Not Disturb
          </Text>
          <Text className="text-xl text-center font-medium">
            To avoid interruptions, and to ensure the most accurate results,
            turn on Do Not Disturb
          </Text>
        </View>
        <View className="items-center">
          <Video
            source={require("../../../../assets/media/do-not-disturb.mp4")}
            style={{
              height: 480 * (isPad ? 2 : 1),
              width: isPad ? "80%" : "100%",
              borderRadius: 10,
            }}
            isLooping={true}
            shouldPlay={true}
            isMuted={true}
            resizeMode={ResizeMode.COVER}
          />
        </View>
        <View className="mb-4 flex items-center">
          <SetUpButton title="Next" handlePress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}
