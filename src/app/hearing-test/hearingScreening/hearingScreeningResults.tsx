import { Foundation, Ionicons } from "@expo/vector-icons";
import { FlatList, SafeAreaView, View, Text } from "react-native";

import { useHearingScreeningResultsStore } from "@/store/store";

export default function Screen() {
  const { leftEarResults, rightEarResults } = useHearingScreeningResultsStore(
    (state) => ({
      leftEarResults: state.leftEarResults,
      rightEarResults: state.rightEarResults,
    })
  );

  const calculate = (score: number) => {
    if (score < 25) {
      return "Pass";
    } else {
      return "Fail";
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-start">
      <View className="mt-20 w-4/5 rounded-3xl bg-blue-200 p-6 shadow-xl dark:bg-black">
        <View className="mb-6 self-center p-2">
          <Foundation
            name="results"
            size={30}
            style={{ color: "rgb(30 64 175)" }}
          />
        </View>
        <View className="flex items-center">
          <Text className="mb-6 text-center text-2xl font-bold">Results</Text>
          <Text className="mb-4 text-center text-2xl font-bold">Right Ear</Text>
          <FlatList
            data={Object.keys(rightEarResults)}
            className=""
            keyExtractor={(item) => item}
            renderItem={({ item }: { item: any }) => (
              <View className="flex-row items-center">
                <Text className="text-2xl font-bold">{item} Hz</Text>
                <Text className="mx-4 text-2xl font-bold">-</Text>
                <Text
                  className={`text-2xl font-bold ${
                    calculate(rightEarResults[item]) === "Pass"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {calculate(rightEarResults[item]) === "Pass" ? (
                    <Ionicons
                      name="checkmark-outline"
                      size={24}
                      color="green"
                    />
                  ) : (
                    <Ionicons name="close-outline" size={24} color="red" />
                  )}
                  {calculate(rightEarResults[item])}
                </Text>
              </View>
            )}
          />
          <Text className="my-4 text-center text-2xl font-bold">Left Ear</Text>
          <FlatList
            data={Object.keys(leftEarResults)}
            className=""
            keyExtractor={(item) => item}
            renderItem={({ item }: { item: any }) => (
              <View className="flex-row items-center">
                <Text className="text-2xl font-bold">{item} Hz</Text>
                <Text className="mx-4 text-2xl font-bold">-</Text>
                <Text
                  className={`text-2xl font-bold ${
                    calculate(leftEarResults[item]) === "Pass"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {calculate(leftEarResults[item]) === "Pass" ? (
                    <Ionicons
                      name="checkmark-outline"
                      size={24}
                      color="green"
                    />
                  ) : (
                    <Ionicons name="close-outline" size={24} color="red" />
                  )}
                  {calculate(leftEarResults[item])}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
