import { create } from "zustand";

// Pure Tone Pause Store
type PauseStore = {
  isPaused: boolean;
  togglePause: () => void;
};

export const usePauseStore = create<PauseStore>((set) => ({
  isPaused: false,
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
}));

// Pure Tone Results Store
type PureToneResultsStore = {
  testResults: Record<number, number>;
  setTestResult: (frequency: number, intensity: number) => void;
};

export const usePureToneResultsStore = create<PureToneResultsStore>((set) => ({
  testResults: {},
  setTestResult: (frequency, intensity) =>
    set((state) => ({
      testResults: {
        ...state.testResults,
        [frequency]: intensity,
      },
    })),
}));

// Questionnaire Store
type QuestionnaireStore = {
  responses: Record<string, string | Record<string, string | null>>;
  addResponse: (
    questionId: string,
    response: string | Record<string, string | null>,
  ) => void;
};

export const useQuestionnaireStore = create<QuestionnaireStore>((set) => ({
  responses: {},
  addResponse: (questionId, response) =>
    set((state) => ({
      responses: {
        ...state.responses,
        [questionId]: response,
      },
    })),
}));
