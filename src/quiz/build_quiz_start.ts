import { ISLANDS_SOUTH_TO_NORTH } from "../places/islands";
import type { Island, Prefecture, Region } from "../places/place_types";
import { PREFECTURES_NORTH_TO_SOUTH } from "../places/prefectures";
import { REGIONS_SOUTH_TO_NORTH } from "../places/regions";
import { shuffle } from "../utilities/shuffle";
import type { PrefectureScope, QuizSetup, QuizType } from "./quiz_setup_types";
import type { QuizStart } from "./quiz_types";

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

const listPrefectureIds = (prefecture_scope: PrefectureScope): Prefecture["id"][] => {
    const prefectures_in_scope: Prefecture[] = PREFECTURES_NORTH_TO_SOUTH.filter((prefecture: Prefecture): boolean => {
        const is_in_scope: boolean = isPrefectureInScope(prefecture, prefecture_scope);
        return is_in_scope;
    });
    const prefecture_ids: Prefecture["id"][] = prefectures_in_scope.map((prefecture: Prefecture): Prefecture["id"] => {
        const prefecture_id: Prefecture["id"] = prefecture.id;
        return prefecture_id;
    });
    return prefecture_ids;
};

const listIslandIds = (): Island["id"][] => {
    const island_ids: Island["id"][] = ISLANDS_SOUTH_TO_NORTH.map((island: Island): Island["id"] => {
        const island_id: Island["id"] = island.id;
        return island_id;
    });
    return island_ids;
};

const listRegionIds = (): Region["id"][] => {
    const region_ids: Region["id"][] = REGIONS_SOUTH_TO_NORTH.map((region: Region): Region["id"] => {
        const region_id: Region["id"] = region.id;
        return region_id;
    });
    return region_ids;
};

export const isPlayableQuiz = (quiz_setup: QuizSetup): boolean => {
    const is_single_mode: boolean = quiz_setup.play_mode === "single";
    return is_single_mode;
};

export const buildQuizStart = (quiz_setup: QuizSetup): QuizStart => {
    let quiz_start: QuizStart = { quiz_type: "islands", question_ids: [] };
    const is_progressive_mode = quiz_setup.play_mode === "progressive";
    if (is_progressive_mode === true) {
        const first_stage: QuizType = quiz_setup.stages.at(0) ?? "islands";
        quiz_start = { quiz_type: first_stage, question_ids: [] };
        return quiz_start;
    }
    switch (quiz_setup.quiz_type) {
        case "islands": {
            quiz_start = { quiz_type: "islands", question_ids: shuffle(listIslandIds()) };
            break;
        }
        case "regions": {
            quiz_start = { quiz_type: "regions", question_ids: shuffle(listRegionIds()) };
            break;
        }
        case "prefectures": {
            const prefecture_ids: Prefecture["id"][] = listPrefectureIds(quiz_setup.prefecture_scope);
            quiz_start = { quiz_type: "prefectures", question_ids: shuffle(prefecture_ids) };
            break;
        }
    }
    return quiz_start;
};
