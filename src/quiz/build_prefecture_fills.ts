import type { PrefectureFill } from "../map/prefecture_map_types";
import type { PlaceId, PrefectureId } from "../places/place_types";
import { PREFECTURES_NORTH_TO_SOUTH } from "../places/prefectures";
import { findQuizPlaceId } from "./quiz_places";
import { findAnswerId } from "./quiz_progress";
import type { QuizType } from "./quiz_setup_types";
import type { AnswerOutcome, QuizSession, QuizStep } from "./quiz_types";

export const buildPrefectureGroups = (quiz_type: QuizType): Partial<Record<PrefectureId, PlaceId>> => {
    const prefecture_groups: Partial<Record<PrefectureId, PlaceId>> = {};
    for (const prefecture of PREFECTURES_NORTH_TO_SOUTH) {
        prefecture_groups[prefecture.id] = findQuizPlaceId(prefecture, quiz_type);
    }
    return prefecture_groups;
};

export const buildPrefectureFills = (
    quiz_session: QuizSession,
    current_step: QuizStep
): Partial<Record<PrefectureId, PrefectureFill>> => {
    const answer_id: PlaceId | undefined = findAnswerId(quiz_session);
    const layer_outcomes: Partial<Record<PlaceId, AnswerOutcome>> = quiz_session.outcomes[current_step.quiz_type];
    const prefecture_fills: Partial<Record<PrefectureId, PrefectureFill>> = {};
    for (const prefecture of PREFECTURES_NORTH_TO_SOUTH) {
        const place_id: PlaceId = findQuizPlaceId(prefecture, current_step.quiz_type);
        const is_on_board: boolean = current_step.board_prefecture_ids.includes(prefecture.id);
        const outcome: AnswerOutcome | undefined = layer_outcomes[place_id];
        const is_revealed_answer = quiz_session.is_revealing_answer === true && place_id === answer_id;
        const has_outcome = outcome !== undefined;
        let prefecture_fill: PrefectureFill = "untouched";
        if (is_revealed_answer === true) {
            prefecture_fill = "revealing";
        } else if (has_outcome === true) {
            prefecture_fill = outcome;
        } else if (is_on_board === false) {
            prefecture_fill = "inactive";
        }
        prefecture_fills[prefecture.id] = prefecture_fill;
    }
    return prefecture_fills;
};
