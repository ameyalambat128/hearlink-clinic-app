import { useRouter } from "expo-router";
import { Text, Image, SafeAreaView, View } from "react-native";

import { SetUpButton } from "@/components/ui/Button";
import { Video, ResizeMode } from "expo-av";

export default function Screen() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/hearing-test/hearingScreening/practiceHearingScreening");
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8">
          <Text className="pb-6 text-2xl font-bold">
            Turn on Do Not Disturb
          </Text>
          <Text className="text-md text-center font-medium">
            To avoid interruptions, and to ensure the most accurate results,
            turn on Do Not Disturb
          </Text>
        </View>
        <View className="items-center">
          <Video
            source={require("../../../../assets/media/do-not-disturb.mp4")}
            style={{
              height: 480,
              width: "100%",
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
