import { useRouter } from "expo-router";
import { SafeAreaView, TouchableOpacity, View, Text } from "react-native";

import { useQuestionnaireStore } from "@/store/store";

export default function question13a() {
  const router = useRouter();
  const addResponse = useQuestionnaireStore((state) => state.addResponse);

  const handleOption1 = () => {
    addResponse("13a", "Both Ears");
    nextQuestion();
  };

  const handleOption2 = () => {
    addResponse("13a", "Right Ear");
    nextQuestion();
  };

  const handleOption3 = () => {
    addResponse("13a", "Left Ear");
    nextQuestion();
  };

  const handleOption4 = () => {
    addResponse("13a", "Unsure");
    nextQuestion();
  };

  const nextQuestion = () => {
    router.push("/hearingTest/questionnaire/question13b");
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-start dark:bg-slate-800">
      {/* Question */}
      <View className="relative mt-28 w-4/5 rounded-3xl bg-blue-200 p-6 shadow-sm dark:bg-black">
        <View className="mb-6 self-start rounded-xl bg-blue-50 p-2">
          <Text className="text-xl font-semibold text-blue-800">Q13</Text>
        </View>
        <Text className="mb-6 text-left text-lg font-semibold">
          Do you have tinnitus in:
        </Text>
      </View>

      {/* Option Buttons */}
      <View className="absolute bottom-12 w-full px-4">
        <View className="mb-4 flex-row justify-evenly">
          <TouchableOpacity
            className="w-40 items-center justify-center rounded-xl bg-red-100 px-6 py-4"
            onPress={handleOption3}
          >
            <Text className="font-medium text-red-800">Left Ear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-40 items-center justify-center rounded-xl bg-blue-100 px-6 py-4"
            onPress={handleOption2}
          >
            <Text className="font-medium text-blue-800">Right Ear</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-evenly">
          <TouchableOpacity
            className="w-40 items-center justify-center rounded-xl bg-red-200 px-6 py-4"
            onPress={handleOption4}
          >
            <Text className="font-medium text-red-800">Unsure</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-40 items-center justify-center rounded-xl bg-blue-200 px-6 py-4"
            onPress={handleOption1}
          >
            <Text className="font-medium text-blue-800">Both Ears</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
