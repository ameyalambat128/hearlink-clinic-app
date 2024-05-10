import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

import { useQuestionnaireStore } from "@/store/store";

type QuestionCardProps = {
  question: string;
  onAnswer: (answer: "yes" | "no") => void;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<"yes" | "no" | null>(
    null
  );

  const handlePress = (answer: "yes" | "no") => {
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  return (
    <View className="mt-4 w-full rounded-3xl border-[1px] border-blue-200 bg-blue-50 p-6 shadow dark:bg-black">
      <Text className="text-lg font-semibold">{question}</Text>
      <View className="mt-2 flex-row justify-between">
        <TouchableOpacity
          onPress={() => handlePress("no")}
          className={`rounded-lg px-6 py-2 ${
            selectedAnswer === "no" ? "bg-red-700" : "bg-red-200"
          }`}
        >
          <Text
            className={`font-medium ${
              selectedAnswer === "no" ? "text-red-200" : "text-red-800"
            }`}
          >
            No
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handlePress("yes")}
          className={`rounded-lg px-6 py-2 ${
            selectedAnswer === "yes" ? "bg-blue-700" : "bg-blue-200"
          }`}
        >
          <Text
            className={`font-medium ${
              selectedAnswer === "yes" ? "text-blue-200" : "text-blue-800"
            }`}
          >
            Yes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const questions = [
  { id: "q1", text: "Sudden drop in hearing in one or both ears" },
  { id: "q2", text: "A rapid change in vision in one or both eyes" },
];

export default function question13b() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, "yes" | "no" | null>>(
    {}
  );
  const addResponse = useQuestionnaireStore((state) => state.addResponse);

  const handleAnswer = (questionId: string, answer: "yes" | "no" | null) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    addResponse("14", answers);
    nextQuestion();
  };

  const nextQuestion = () => {
    router.push("/hearingTest/questionnaire/question15");
  };

  return (
    <SafeAreaView className="flex-1 dark:bg-slate-800">
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
        className="w-full flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="relative my-6 w-4/5 items-center">
          <View className="w-full rounded-3xl bg-blue-200 p-6 shadow-sm dark:bg-black">
            <View className="mb-6 self-start rounded-xl bg-blue-50 p-2">
              <Text className="text-xl font-semibold text-blue-800">Q14</Text>
            </View>
            <Text className="mb-4 text-left text-lg font-semibold">
              Have you ever had any of the following symptoms lasting longer
              than 10 minutes?
            </Text>
            <Text className="text-xs text-gray-600 dark:text-gray-400">
              * Please answer all questions before proceeding.
            </Text>
          </View>

          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question.text}
              onAnswer={(answer) => handleAnswer(question.id, answer)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Next Button */}
      <View className="absolute bottom-10 w-full flex-row justify-evenly px-4">
        <TouchableOpacity
          className={`w-80 items-center justify-center rounded-xl px-6 py-4 ${
            Object.keys(answers).length !== questions.length
              ? "bg-blue-200/80"
              : "bg-blue-200"
          }`}
          onPress={handleNext}
          disabled={Object.keys(answers).length !== questions.length}
        >
          <Text
            className={`font-medium ${
              Object.keys(answers).length !== questions.length
                ? "text-blue-800/50"
                : "text-blue-800"
            }`}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
