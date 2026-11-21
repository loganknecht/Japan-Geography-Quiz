import type { PrefectureId } from "../places/place_types";
import type { QuizSetup } from "./quiz_setup_types";

export type AnswerOutcome = "first_try" | "retry" | "failed";

export interface QuizSession {
    question_ids: PrefectureId[];
    current_question_index: number;
    miss_count: number;
    is_revealing_answer: boolean;
    outcomes: Partial<Record<PrefectureId, AnswerOutcome>>;
}

export interface QuizState {
    quiz_setup: QuizSetup | null;
    quiz_session: QuizSession | null;
}

export type QuizAction =
    | { type: "startQuiz"; quiz_setup: QuizSetup; question_ids: PrefectureId[] }
    | { type: "restartQuiz"; question_ids: PrefectureId[] }
    | { type: "clickPrefecture"; prefecture_id: PrefectureId; should_skip_failed_answer_confirmation: boolean }
    | { type: "endQuiz" };

export const ANSWER_OUTCOMES: readonly AnswerOutcome[] = ["first_try", "retry", "failed"];

export const TRIES_PER_QUESTION: number = 3;
