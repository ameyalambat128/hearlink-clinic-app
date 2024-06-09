import { SimpleLineIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function Questionnaire() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 items-center justify-start dark:bg-slate-800">
      <View className="mt-20 w-4/5 rounded-3xl bg-blue-200 p-6 shadow-sm dark:bg-black">
        <View className="mb-6 self-center p-2">
          <SimpleLineIcons
            name="note"
            size={30}
            style={{ color: "rgb(30 64 175)" }}
          />
        </View>
        <Text className="mb-10 text-center text-lg font-semibold">
          This questionnaire is designed to help you decide if you need to see a
          doctor before obtaining a hearing device. If you have any medical
          questions or concerns about your hearing, you should see a doctor no
          matter what your score is on this questionnaire.
        </Text>
      </View>
      <View className="absolute bottom-12 w-full flex-row justify-evenly px-4">
        <Link href="/hearing-test/questionnaire/question1" asChild>
          <TouchableOpacity className="w-80 items-center justify-center rounded-xl bg-blue-200 px-6 py-4">
            <Text className="text-base font-medium text-blue-800">Next</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}
