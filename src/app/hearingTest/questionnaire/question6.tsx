import { useRouter } from "expo-router";

import Questionnaire from "@/components/Questionnaire";
import { useQuestionnaireStore } from "@/store/store";

export default function Question6() {
  const router = useRouter();
  const addResponse = useQuestionnaireStore((state) => state.addResponse);

  const handleYes = () => {
    addResponse("6", "yes");
    nextQuestion();
  };

  const handleNo = () => {
    addResponse("6", "no");
    nextQuestion();
  };

  const nextQuestion = () => {
    router.push("/hearingTest/questionnaire/question7");
  };

  return (
    <Questionnaire
      questionNumber="Q6"
      question="Does your hearing change from day to day?"
      handleYes={handleYes}
      handleNo={handleNo}
    />
  );
}
