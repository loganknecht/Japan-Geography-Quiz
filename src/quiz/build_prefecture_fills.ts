import type { PrefectureFill } from "../map/prefecture_map_types";
import type { PrefectureId } from "../places/place_types";
import { PREFECTURES_NORTH_TO_SOUTH } from "../places/prefectures";
import type { AnswerOutcome, QuizSession } from "./quiz_types";

export const buildPrefectureFills = (quiz_session: QuizSession): Partial<Record<PrefectureId, PrefectureFill>> => {
    const answer_id: PrefectureId | undefined = quiz_session.question_ids.at(quiz_session.current_question_index);
    const prefecture_fills: Partial<Record<PrefectureId, PrefectureFill>> = {};
    for (const prefecture of PREFECTURES_NORTH_TO_SOUTH) {
        const is_question_prefecture: boolean = quiz_session.question_ids.includes(prefecture.id);
        const outcome: AnswerOutcome | undefined = quiz_session.outcomes[prefecture.id];
        const is_revealed_answer = quiz_session.is_revealing_answer === true && prefecture.id === answer_id;
        const has_outcome = outcome !== undefined;
        let prefecture_fill: PrefectureFill = "untouched";
        if (is_question_prefecture === false) {
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
