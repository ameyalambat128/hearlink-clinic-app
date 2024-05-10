import { useRouter } from "expo-router";

import Questionnaire from "@/components/Questionnaire";
import { useQuestionnaireStore } from "@/store/store";

export default function Question1() {
  const router = useRouter();
  const addResponse = useQuestionnaireStore((state) => state.addResponse);

  const handleYes = () => {
    addResponse("1", "yes");
    nextQuestion();
  };

  const handleNo = () => {
    addResponse("1", "no");
    nextQuestion();
  };

  const nextQuestion = () => {
    router.push("/hearingTest/questionnaire/question2");
  };

  return (
    <Questionnaire
      questionNumber="Q1"
      question="When talking on a telephone, do you understand what people say better in one ear than the other?"
      handleYes={handleYes}
      handleNo={handleNo}
    />
  );
}
