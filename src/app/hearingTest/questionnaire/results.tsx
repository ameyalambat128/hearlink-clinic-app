import { Foundation, SimpleLineIcons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity, View, Text } from "react-native";

import { useQuestionnaireStore } from "@/store/store";

export default function Results() {
  const navigation = useNavigation();

  const responses = useQuestionnaireStore((state) => state.responses);
  const [score, setScore] = useState<number>();

  function scoreData(): number {
    let score = 0;
    // Add one point for every "yes" from 1 - 9
    for (let i = 1; i <= 9; i++) {
      console.log(responses[i.toString()]);
      if (responses[i.toString()] === "yes") {
        score += 1;
      }
    }
    console.log("A: " + score);
    console.log(responses["10"]);

    // Question 10: One point if "Poor" or "Very Poor" is checked
    if (responses["10"] === "Poor" || responses["10"] === "Very Poor") {
      score += 1;
    }
    // Question 11: One point if "Frequently" or "Always" is checked
    if (responses["11"] === "Frequently" || responses["11"] === "Always") {
      score += 1;
    }
    // Question 12: One point if "Poor" or "Very Poor" is checked
    if (responses["12"] === "Poor" || responses["12"] === "Very Poor") {
      score += 1;
    }
    // Question 13a: One point if either “Right ear” OR “Left Ear” is checked
    if (responses["13a"] === "Right ear" || responses["13a"] === "Left Ear") {
      score += 1;
    }
    // Questions 13b, 14, 15: Number of “yes” responses
    ["13b", "14", "15"].forEach((value, key) => {
      if (responses[value]) {
        Object.values(responses[value]).forEach((response) => {
          if (response === "yes") {
            score += 1;
          }
        });
      }
    });

    return score;
  }

  useEffect(() => {
    setScore(scoreData());
    console.log(responses);
  }, []);

  return (
    <SafeAreaView className="flex-1 items-center justify-start dark:bg-slate-800">
      <View className="mt-20 w-4/5 rounded-3xl bg-blue-200 p-6 shadow-sm dark:bg-black">
        <View className="mb-6 self-center p-2">
          <Foundation
            name="results"
            size={30}
            style={{ color: "rgb(30 64 175)" }}
          />
        </View>
        <View className="flex items-center">
          <Text className="mb-10 text-center text-2xl font-bold">Results</Text>
          <Text className="text-xl font-bold">Your Score is</Text>
          <Text className="pt-8 text-4xl font-medium">{score}</Text>
        </View>
      </View>
      <View className="mt-4 w-4/5 rounded-3xl bg-blue-200 p-6 shadow-sm dark:bg-black">
        <View className="self-center p-2">
          <Text className="text-xl font-bold">
            If your score is 4 or higher, you should talk to a doctor about your
            symptoms.
          </Text>
        </View>
      </View>
      <View className="absolute bottom-12 w-full flex-row justify-evenly px-4">
        <TouchableOpacity
          className="w-80 items-center justify-center rounded-xl bg-blue-200 px-6 py-4"
          onPress={() => {
            navigation.dispatch({ type: "POP_TO_TOP" });
            navigation.dispatch({ type: "POP_TO_TOP" });
          }}
        >
          <Text className="text-base font-medium text-blue-800">
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
