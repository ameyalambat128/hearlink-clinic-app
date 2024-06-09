import { Foundation, Ionicons } from "@expo/vector-icons";
import { FlatList, SafeAreaView, View, Text } from "react-native";

import { usePureToneResultsStore } from "@/store/store";

export default function Screen() {
  const testResults = usePureToneResultsStore((state) => state.testResults);
  console.log(testResults);

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
          <Text className="mb-8 text-center text-2xl font-bold">Results</Text>
          <FlatList
            data={Object.keys(testResults)}
            className="mt-10"
            keyExtractor={(item) => item}
            renderItem={({ item }: { item: any }) => (
              <View className="flex-row items-center">
                <Text className="text-2xl font-bold">{item} Hz</Text>
                <Text className="mx-4 text-2xl font-bold">-</Text>
                <Text
                  className={`text-2xl font-bold ${
                    calculate(testResults[item]) === "Pass"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {calculate(testResults[item]) === "Pass" ? (
                    <Ionicons
                      name="checkmark-outline"
                      size={24}
                      color="green"
                    />
                  ) : (
                    <Ionicons name="close-outline" size={24} color="red" />
                  )}
                  {calculate(testResults[item])}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
