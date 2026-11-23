import type { IslandId, RegionId } from "../places/place_types";

export type PlayMode = "single" | "progressive";

export type QuizType = "islands" | "regions" | "prefectures";

export type ProgressionStyle = "area_by_area" | "total_area";

export type PrefectureGrouping = "none" | "island" | "region";

export type PrefectureScope =
    { kind: "all_japan" } | { kind: "island"; island_id: IslandId } | { kind: "region"; region_id: RegionId };

export type PrefectureScopeKind = PrefectureScope["kind"];

export interface SingleQuizSetup {
    play_mode: "single";
    quiz_type: QuizType;
    prefecture_scope: PrefectureScope;
}

export interface ProgressiveQuizSetup {
    play_mode: "progressive";
    stages: QuizType[];
    progression_style: ProgressionStyle;
    prefecture_grouping: PrefectureGrouping;
}

export type QuizSetup = SingleQuizSetup | ProgressiveQuizSetup;

export const QUIZ_TYPES_IN_ORDER: readonly QuizType[] = ["islands", "regions", "prefectures"];

export const MINIMUM_PROGRESSIVE_STAGE_COUNT: number = 2;
