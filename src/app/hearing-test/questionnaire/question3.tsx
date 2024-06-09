import { useRouter } from "expo-router";

import Questionnaire from "@/components/Questionnaire";
import { useQuestionnaireStore } from "@/store/store";

export default function Question3() {
  const router = useRouter();
  const addResponse = useQuestionnaireStore((state) => state.addResponse);

  const handleYes = () => {
    addResponse("3", "yes");
    nextQuestion();
  };

  const handleNo = () => {
    addResponse("3", "no");
    nextQuestion();
  };

  const nextQuestion = () => {
    router.push("/hearing-test/questionnaire/question4");
  };

  return (
    <Questionnaire
      questionNumber="Q3"
      question="Have you ever had a sudden permanent change in your hearing?"
      handleYes={handleYes}
      handleNo={handleNo}
    />
  );
}
