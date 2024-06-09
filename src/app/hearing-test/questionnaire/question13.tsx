import { useRouter } from "expo-router";

import Questionnaire from "@/components/Questionnaire";
import { useQuestionnaireStore } from "@/store/store";

export default function Question13() {
  const router = useRouter();
  const addResponse = useQuestionnaireStore((state) => state.addResponse);

  const handleYes = () => {
    addResponse("13", "yes");
    router.push("/hearing-test/questionnaire/question13a");
  };

  const handleNo = () => {
    addResponse("13", "no");
    router.push("/hearing-test/questionnaire/question14");
  };

  return (
    <Questionnaire
      questionNumber="Q13"
      question="Do you have tinnitus, such as ringing, roaring, or cricket-like sounds in your ears?"
      handleYes={handleYes}
      handleNo={handleNo}
    />
  );
}
