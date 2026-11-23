import type { PlaceId, PrefectureId } from "../places/place_types";
import type { QuizSetup, QuizType } from "./quiz_setup_types";

export type AnswerOutcome = "first_try" | "retry" | "failed";

export type QuizSectionLabel =
    { kind: "stage"; quiz_type: QuizType } | { kind: "area"; quiz_type: QuizType; place_id: PlaceId };

export interface QuizStep {
    quiz_type: QuizType;
    section_index: number;
    board_prefecture_ids: PrefectureId[];
    question_ids: PlaceId[];
}

export interface QuizStart {
    sections: QuizSectionLabel[];
    steps: QuizStep[];
}

export type LayerOutcomes = Record<QuizType, Partial<Record<PlaceId, AnswerOutcome>>>;

export interface QuizAnswer {
    quiz_type: QuizType;
    place_id: PlaceId;
    outcome: AnswerOutcome | undefined;
}

export interface QuizSession {
    sections: QuizSectionLabel[];
    steps: QuizStep[];
    current_step_index: number;
    current_question_index: number;
    miss_count: number;
    is_revealing_answer: boolean;
    outcomes: LayerOutcomes;
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
