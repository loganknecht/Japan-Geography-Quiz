import { findRegionHomeIsland, listIslandIds, listRegionIds } from "../places/place_lists";
import type { IslandId, PlaceId, RegionId } from "../places/place_types";
import { PREFECTURES_NORTH_TO_SOUTH } from "../places/prefectures";
import { listAllAnswers } from "./quiz_outcomes";
import type { QuizType } from "./quiz_setup_types";
import type { QuizAnswer, QuizSession } from "./quiz_types";

export interface RegionScore {
    region_id: RegionId;
    region_answer: QuizAnswer | null;
    prefecture_answers: QuizAnswer[];
    answers: QuizAnswer[];
}

export interface IslandScore {
    island_id: IslandId;
    island_answer: QuizAnswer | null;
    loose_prefecture_answers: QuizAnswer[];
    region_scores: RegionScore[];
    answers: QuizAnswer[];
}

const findAnswer = (answers: QuizAnswer[], quiz_type: QuizType, place_id: PlaceId): QuizAnswer | null => {
    const found_answer: QuizAnswer | undefined = answers.find((answer: QuizAnswer): boolean => {
        const is_match: boolean = answer.quiz_type === quiz_type && answer.place_id === place_id;
        return is_match;
    });
    const matching_answer: QuizAnswer | null = found_answer ?? null;
    return matching_answer;
};

const listPrefectureAnswers = (answers: QuizAnswer[], island_id: IslandId, region_id: RegionId): QuizAnswer[] => {
    const prefecture_answers: QuizAnswer[] = [];
    for (const prefecture of PREFECTURES_NORTH_TO_SOUTH) {
        const is_on_island: boolean = prefecture.island_id === island_id;
        const is_in_region: boolean = prefecture.region_id === region_id;
        const is_in_group = is_on_island === true && is_in_region === true;
        if (is_in_group === false) {
            continue;
        }
        const prefecture_answer: QuizAnswer | null = findAnswer(answers, "prefectures", prefecture.id);
        const has_answer = prefecture_answer !== null;
        if (has_answer === true) {
            prefecture_answers.push(prefecture_answer);
        }
    }
    return prefecture_answers;
};

const collectAnswers = (lead_answer: QuizAnswer | null, other_answers: QuizAnswer[]): QuizAnswer[] => {
    const has_lead_answer = lead_answer !== null;
    const answers: QuizAnswer[] = has_lead_answer === true ? [lead_answer, ...other_answers] : [...other_answers];
    return answers;
};

const buildIslandScore = (answers: QuizAnswer[], island_id: IslandId): IslandScore => {
    const loose_prefecture_answers: QuizAnswer[] = [];
    const region_scores: RegionScore[] = [];
    for (const region_id of listRegionIds()) {
        const prefecture_answers: QuizAnswer[] = listPrefectureAnswers(answers, island_id, region_id);
        const is_home_region: boolean = findRegionHomeIsland(region_id) === island_id;
        if (is_home_region === false) {
            loose_prefecture_answers.push(...prefecture_answers);
            continue;
        }
        const region_answer: QuizAnswer | null = findAnswer(answers, "regions", region_id);
        const region_answers: QuizAnswer[] = collectAnswers(region_answer, prefecture_answers);
        const has_region_answers = region_answers.length > 0;
        if (has_region_answers === true) {
            region_scores.push({
                region_id: region_id,
                region_answer: region_answer,
                prefecture_answers: prefecture_answers,
                answers: region_answers
            });
        }
    }
    const island_answer: QuizAnswer | null = findAnswer(answers, "islands", island_id);
    const nested_answers: QuizAnswer[] = [...loose_prefecture_answers];
    for (const region_score of region_scores) {
        nested_answers.push(...region_score.answers);
    }
    const island_score: IslandScore = {
        island_id: island_id,
        island_answer: island_answer,
        loose_prefecture_answers: loose_prefecture_answers,
        region_scores: region_scores,
        answers: collectAnswers(island_answer, nested_answers)
    };
    return island_score;
};

export const buildIslandScores = (quiz_session: QuizSession): IslandScore[] => {
    const answers: QuizAnswer[] = listAllAnswers(quiz_session);
    const island_ids: IslandId[] = listIslandIds();
    const island_scores: IslandScore[] = island_ids.map((island_id: IslandId): IslandScore => {
        const island_score: IslandScore = buildIslandScore(answers, island_id);
        return island_score;
    });
    return island_scores;
};

export const isPerfectScore = (answers: QuizAnswer[]): boolean => {
    const is_perfect: boolean = answers.every((answer: QuizAnswer): boolean => {
        const is_first_try: boolean = answer.outcome === "first_try";
        return is_first_try;
    });
    return is_perfect;
};
