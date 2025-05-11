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

// Hearing Screening Results Store
type HearingScreeningResultsStore = {
  leftEarResults: Record<number, number>;
  rightEarResults: Record<number, number>;
  setTestResults: (
    leftEar: Record<number, number>,
    rightEar: Record<number, number>
  ) => void;
};

export const useHearingScreeningResultsStore =
  create<HearingScreeningResultsStore>((set) => ({
    leftEarResults: {},
    rightEarResults: {},
    setTestResults: (leftEar, rightEar) =>
      set(() => ({
        leftEarResults: leftEar,
        rightEarResults: rightEar,
      })),
  }));

// Hearing Test User Details Store
type UserState = {
  name: string;
  dateOfBirth: string;
  dateOfTest: string;
  snrLoss: string;
  testConducted: string;
  leftEarResults: Record<number, number>;
  rightEarResults: Record<number, number>;
  questionOne: boolean;
  questionTwo: boolean;
  setName: (name: string) => void;
  setDateOfBirth: (dateOfBirth: string) => void;
  setDateOfTest: (dateOfTest: string) => void;
  setSnrLoss: (snrLoss: string) => void;
  setTestConducted: (testConducted: string) => void;
  setQuestionOne: (value: boolean) => void;
  setQuestionTwo: (value: boolean) => void;
};

export const useUserStore = create<UserState>((set) => ({
  name: "",
  dateOfBirth: "",
  dateOfTest: "",
  snrLoss: "",
  testConducted: "",
  leftEarResults: {},
  rightEarResults: {},
  questionOne: false,
  questionTwo: false,
  setName: (name: string) => set({ name }),
  setDateOfBirth: (dateOfBirth: string) => set({ dateOfBirth }),
  setDateOfTest: (dateOfTest: string) => set({ dateOfTest }),
  setSnrLoss: (snrLoss: string) => set({ snrLoss }),
  setTestConducted: (testConducted: string) => set({ testConducted }),
  setQuestionOne: (value: boolean) => set({ questionOne: value }),
  setQuestionTwo: (value: boolean) => set({ questionTwo: value }),
}));

// Reports Store
type Report = {
  id: string;
  name: string;
  date: string;
  filePath: string;
};

type ReportsStore = {
  reports: Report[];
  addReport: (report: Report) => void;
  removeReport: (reportId: string) => void;
};

export const useReportsStore = create<ReportsStore>((set) => ({
  reports: [],
  addReport: (report: Report) => {
    set((state) => ({ reports: [...state.reports, report] }));
  },
  removeReport: (reportId: string) => {
    set((state) => ({
      reports: state.reports.filter((report) => report.id !== reportId),
    }));
  },
}));

// Questionnaire Store
type QuestionnaireStore = {
  responses: Record<string, string | Record<string, string | null>>;
  addResponse: (
    questionId: string,
    response: string | Record<string, string | null>
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
