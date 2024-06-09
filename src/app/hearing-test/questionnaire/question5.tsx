import { useRouter } from "expo-router";

import Questionnaire from "@/components/Questionnaire";
import { useQuestionnaireStore } from "@/store/store";

export default function Question5() {
  const router = useRouter();
  const addResponse = useQuestionnaireStore((state) => state.addResponse);

  const handleYes = () => {
    addResponse("5", "yes");
    nextQuestion();
  };

  const handleNo = () => {
    addResponse("5", "no");
    nextQuestion();
  };

  const nextQuestion = () => {
    router.push("/hearing-test/questionnaire/question6");
  };

  return (
    <Questionnaire
      questionNumber="Q5"
      question="Do you hear better in one ear than the other?"
      handleYes={handleYes}
      handleNo={handleNo}
    />
  );
}
