import { useRouter } from "expo-router";

import Questionnaire from "@/components/Questionnaire";
import { useQuestionnaireStore } from "@/store/store";

export default function Question6() {
  const router = useRouter();
  const addResponse = useQuestionnaireStore((state) => state.addResponse);

  const handleYes = () => {
    addResponse("7", "yes");
    nextQuestion();
  };

  const handleNo = () => {
    addResponse("7", "no");
    nextQuestion();
  };

  const nextQuestion = () => {
    router.push("/hearing-test/questionnaire/question8");
  };

  return (
    <Questionnaire
      questionNumber="Q7"
      question="As an adult, have you ever had more than one infection in the same ear during one year?"
      handleYes={handleYes}
      handleNo={handleNo}
    />
  );
}
