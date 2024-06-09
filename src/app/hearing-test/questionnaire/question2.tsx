import { useRouter } from "expo-router";

import Questionnaire from "@/components/Questionnaire";
import { useQuestionnaireStore } from "@/store/store";

export default function Question2() {
  const router = useRouter();
  const addResponse = useQuestionnaireStore((state) => state.addResponse);

  const handleYes = () => {
    addResponse("2", "yes");
    nextQuestion();
  };

  const handleNo = () => {
    addResponse("2", "no");
    nextQuestion();
  };

  const nextQuestion = () => {
    router.push("/hearing-test/questionnaire/question3");
  };

  return (
    <Questionnaire
      questionNumber="Q2"
      question="Did the hearing loss in either of your ears develop suddenly?"
      handleYes={handleYes}
      handleNo={handleNo}
    />
  );
}
