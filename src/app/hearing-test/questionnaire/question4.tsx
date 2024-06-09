import { useRouter } from "expo-router";

import Questionnaire from "@/components/Questionnaire";
import { useQuestionnaireStore } from "@/store/store";

export default function Question4() {
  const router = useRouter();
  const addResponse = useQuestionnaireStore((state) => state.addResponse);

  const handleYes = () => {
    addResponse("4", "yes");
    nextQuestion();
  };

  const handleNo = () => {
    addResponse("4", "no");
    nextQuestion();
  };

  const nextQuestion = () => {
    router.push("/hearing-test/questionnaire/question5");
  };

  return (
    <Questionnaire
      questionNumber="Q4"
      question="Do you have hearing loss in only one ear?"
      handleYes={handleYes}
      handleNo={handleNo}
    />
  );
}
