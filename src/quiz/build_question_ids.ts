import type { Prefecture, PrefectureId } from "../places/place_types";
import { PREFECTURES_NORTH_TO_SOUTH } from "../places/prefectures";
import { shuffle } from "../utilities/shuffle";
import type { PrefectureScope, QuizSetup } from "./quiz_setup_types";

const isPrefectureInScope = (prefecture: Prefecture, prefecture_scope: PrefectureScope): boolean => {
    let is_in_scope: boolean = true;
    switch (prefecture_scope.kind) {
        case "island": {
            is_in_scope = prefecture.island_id === prefecture_scope.island_id;
            break;
        }
        case "region": {
            is_in_scope = prefecture.region_id === prefecture_scope.region_id;
            break;
        }
        case "all_japan": {
            break;
        }
    }
    return is_in_scope;
};

export const isPrefectureQuiz = (quiz_setup: QuizSetup): boolean => {
    const is_single_mode = quiz_setup.play_mode === "single";
    const is_prefecture_quiz: boolean = is_single_mode === true && quiz_setup.quiz_type === "prefectures";
    return is_prefecture_quiz;
};

export const buildQuestionIds = (quiz_setup: QuizSetup): PrefectureId[] => {
    let question_ids: PrefectureId[] = [];
    const is_single_mode = quiz_setup.play_mode === "single";
    if (is_single_mode === true) {
        const prefecture_scope: PrefectureScope = quiz_setup.prefecture_scope;
        const prefectures_in_scope: Prefecture[] = PREFECTURES_NORTH_TO_SOUTH.filter(
            (prefecture: Prefecture): boolean => {
                const is_in_scope: boolean = isPrefectureInScope(prefecture, prefecture_scope);
                return is_in_scope;
            }
        );
        const prefecture_ids: PrefectureId[] = prefectures_in_scope.map((prefecture: Prefecture): PrefectureId => {
            const prefecture_id: PrefectureId = prefecture.id;
            return prefecture_id;
        });
        question_ids = shuffle(prefecture_ids);
    }
    return question_ids;
};
