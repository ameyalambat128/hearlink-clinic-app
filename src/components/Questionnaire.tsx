import { TouchableOpacity, View, Text } from "react-native";

import Page from "./Page";

type QuestionnaireProps = {
  questionNumber: string;
  question: string;
  handleYes: () => void;
  handleNo: () => void;
};

const Questionnaire: React.FC<QuestionnaireProps> = ({
  questionNumber,
  question,
  handleYes: handleYes,
  handleNo: handleNo,
}) => {
  return (
    <Page className="justify-star flex-1 items-center dark:bg-slate-800">
      {/* Question */}
      <View className="relative mt-28 w-4/5 rounded-3xl bg-blue-200 p-6 shadow-sm dark:bg-black">
        <View className="mb-6 self-start rounded-xl bg-blue-50 p-2">
          <Text className="text-xl font-semibold text-blue-800">
            {questionNumber}
          </Text>
        </View>
        <Text className="mb-6 text-left text-lg font-semibold">{question}</Text>
      </View>

      {/* Yes & No */}
      <View className="absolute bottom-12 w-full flex-row justify-evenly px-4">
        <TouchableOpacity
          className="w-40 items-center justify-center rounded-xl bg-red-200 px-6 py-4"
          onPress={handleNo}
        >
          <Text className="text-base font-medium text-red-800">No</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-40 items-center justify-center rounded-xl bg-blue-200 px-6 py-4"
          onPress={handleYes}
        >
          <Text className="text-base font-medium text-blue-800">Yes</Text>
        </TouchableOpacity>
      </View>
    </Page>
  );
};

export default Questionnaire;
