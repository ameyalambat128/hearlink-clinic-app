import { useRouter } from "expo-router";

import Questionnaire from "@/components/Questionnaire";
import { useQuestionnaireStore } from "@/store/store";

export default function Question9() {
  const router = useRouter();
  const addResponse = useQuestionnaireStore((state) => state.addResponse);

  const handleYes = () => {
    addResponse("9", "yes");
    nextQuestion();
  };

  const handleNo = () => {
    addResponse("9", "no");
    nextQuestion();
  };

  const nextQuestion = () => {
    router.push("/hearing-test/questionnaire/question10");
  };

  return (
    <Questionnaire
      questionNumber="Q9"
      question="Have you ever been told by a physician that you have Meniere's disease?"
      handleYes={handleYes}
      handleNo={handleNo}
    />
  );
}
