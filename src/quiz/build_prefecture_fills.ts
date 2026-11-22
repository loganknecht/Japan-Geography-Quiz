import type { PrefectureFill } from "../map/prefecture_map_types";
import type { PlaceId, PrefectureId } from "../places/place_types";
import { PREFECTURES_NORTH_TO_SOUTH } from "../places/prefectures";
import { findQuizPlaceId } from "./quiz_places";
import type { QuizType } from "./quiz_setup_types";
import type { AnswerOutcome, QuizSession } from "./quiz_types";

export const buildPrefectureGroups = (quiz_type: QuizType): Partial<Record<PrefectureId, PlaceId>> => {
    const prefecture_groups: Partial<Record<PrefectureId, PlaceId>> = {};
    for (const prefecture of PREFECTURES_NORTH_TO_SOUTH) {
        prefecture_groups[prefecture.id] = findQuizPlaceId(prefecture, quiz_type);
    }
    return prefecture_groups;
};

export const buildPrefectureFills = (quiz_session: QuizSession): Partial<Record<PrefectureId, PrefectureFill>> => {
    const answer_id: PlaceId | undefined = quiz_session.question_ids.at(quiz_session.current_question_index);
    const prefecture_fills: Partial<Record<PrefectureId, PrefectureFill>> = {};
    for (const prefecture of PREFECTURES_NORTH_TO_SOUTH) {
        const place_id: PlaceId = findQuizPlaceId(prefecture, quiz_session.quiz_type);
        const is_question_place: boolean = quiz_session.question_ids.includes(place_id);
        const outcome: AnswerOutcome | undefined = quiz_session.outcomes[place_id];
        const is_revealed_answer = quiz_session.is_revealing_answer === true && place_id === answer_id;
        const has_outcome = outcome !== undefined;
        let prefecture_fill: PrefectureFill = "untouched";
        if (is_question_place === false) {
            prefecture_fill = "inactive";
        } else if (is_revealed_answer === true) {
            prefecture_fill = "revealing";
        } else if (has_outcome === true) {
            prefecture_fill = outcome;
        }
        prefecture_fills[prefecture.id] = prefecture_fill;
    }
    return prefecture_fills;
};
