import { useRouter } from "expo-router";

import Questionnaire from "@/components/Questionnaire";
import { useQuestionnaireStore } from "@/store/store";

export default function Question8() {
  const router = useRouter();
  const addResponse = useQuestionnaireStore((state) => state.addResponse);

  const handleYes = () => {
    addResponse("8", "yes");
    nextQuestion();
  };

  const handleNo = () => {
    addResponse("8", "no");
    nextQuestion();
  };

  const nextQuestion = () => {
    router.push("/hearing-test/questionnaire/question9");
  };

  return (
    <Questionnaire
      questionNumber="Q8"
      question="Have you ever noticed pus, blood or other active fluid discharge from your ear?"
      handleYes={handleYes}
      handleNo={handleNo}
    />
  );
}
