import type { PlaceId } from "../places/place_types";
import type { QuizSetup, QuizType } from "./quiz_setup_types";

export type AnswerOutcome = "first_try" | "retry" | "failed";

export interface QuizStart {
    quiz_type: QuizType;
    question_ids: PlaceId[];
}

export interface QuizSession {
    quiz_type: QuizType;
    question_ids: PlaceId[];
    current_question_index: number;
    miss_count: number;
    is_revealing_answer: boolean;
    outcomes: Partial<Record<PlaceId, AnswerOutcome>>;
}

export interface QuizState {
    quiz_setup: QuizSetup | null;
    quiz_session: QuizSession | null;
}

export type QuizAction =
    | { type: "startQuiz"; quiz_setup: QuizSetup; quiz_start: QuizStart }
    | { type: "restartQuiz"; quiz_start: QuizStart }
    | { type: "clickPlace"; place_id: PlaceId; should_skip_failed_answer_confirmation: boolean }
    | { type: "endQuiz" };

export const ANSWER_OUTCOMES: readonly AnswerOutcome[] = ["first_try", "retry", "failed"];

export const TRIES_PER_QUESTION: number = 3;
