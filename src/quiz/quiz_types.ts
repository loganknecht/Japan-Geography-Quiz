import type { QuizSetup } from "./quiz_setup_types";

export interface QuizState {
    quiz_setup: QuizSetup | null;
}

export type QuizAction = { type: "startQuiz"; quiz_setup: QuizSetup } | { type: "endQuiz" };
