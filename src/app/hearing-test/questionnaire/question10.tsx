import { useRouter } from "expo-router";
import { SafeAreaView, TouchableOpacity, View, Text } from "react-native";

import { useQuestionnaireStore } from "@/store/store";

export default function question10() {
  const router = useRouter();
  const addResponse = useQuestionnaireStore((state) => state.addResponse);

  const handleOption1 = () => {
    addResponse("10", "Very Good");
    nextQuestion();
  };

  const handleOption2 = () => {
    addResponse("10", "Good");
    nextQuestion();
  };

  const handleOption3 = () => {
    addResponse("10", "Poor");
    nextQuestion();
  };

  const handleOption4 = () => {
    addResponse("10", "Very Poor");
    nextQuestion();
  };

  const nextQuestion = () => {
    router.push("/hearing-test/questionnaire/question11");
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-start dark:bg-slate-800">
      {/* Question */}
      <View className="relative mt-28 w-4/5 rounded-3xl bg-blue-200 p-6 shadow-sm dark:bg-black">
        <View className="mb-6 self-start rounded-xl bg-blue-50 p-2">
          <Text className="text-xl font-semibold text-blue-800">Q10</Text>
        </View>
        <Text className="mb-6 text-left text-lg font-semibold">
          Overall, how would you rate your health?
        </Text>
      </View>

      {/* Option Buttons */}
      <View className="absolute bottom-12 w-full px-4">
        <View className="mb-4 flex-row justify-evenly">
          <TouchableOpacity
            className="w-40 items-center justify-center rounded-xl bg-red-100 px-6 py-4"
            onPress={handleOption3}
          >
            <Text className="font-medium text-red-800">Poor</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-40 items-center justify-center rounded-xl bg-blue-100 px-6 py-4"
            onPress={handleOption2}
          >
            <Text className="font-medium text-blue-800">Good</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-evenly">
          <TouchableOpacity
            className="w-40 items-center justify-center rounded-xl bg-red-200 px-6 py-4"
            onPress={handleOption4}
          >
            <Text className="font-medium text-red-800">Very Poor</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-40 items-center justify-center rounded-xl bg-blue-200 px-6 py-4"
            onPress={handleOption1}
          >
            <Text className="font-medium text-blue-800">Very Good</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
