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
  { id: "q1", text: "Any persistent discharge from either ear" },
  { id: "q2", text: "Pus or blood in your ears" },
  { id: "q3", text: "Any persistent pain in or around either ear" },
  { id: "q4", text: "A change in hearing in one or both ears" },
  {
    id: "q5",
    text: "A head cold or sinus problem that made your hearing worse",
  },
  {
    id: "q6",
    text: "Dizziness",
  },
  {
    id: "q7",
    text: "Fell because of poor balance",
  },
  {
    id: "q8",
    text: "A persistent or recurring headache",
  },
  {
    id: "q9",
    text: "Recurring fever, night sweats, chills",
  },
];

export default function question15() {
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
    addResponse("15", answers);
    nextQuestion();
  };

  const nextQuestion = () => {
    router.push("/hearing-test/questionnaire/results");
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
        <View className="relative mb-20 mt-6 w-4/5 items-center">
          <View className="w-full rounded-3xl bg-blue-200 p-6 shadow-sm dark:bg-black">
            <View className="mb-6 self-start rounded-xl bg-blue-50 p-2">
              <Text className="text-xl font-semibold text-blue-800">Q15</Text>
            </View>
            <Text className="mb-4 text-left text-lg font-semibold">
              In the past 3 months, have you had any of the following symptoms?
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
