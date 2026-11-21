import type { TranslationKey } from "../i18n/translation_key";
import type { PlayMode, PrefectureGrouping, ProgressionStyle, QuizType } from "./quiz_setup_types";

export const PLAY_MODE_LABEL_KEYS: Record<PlayMode, TranslationKey> = {
    single: "play_mode.single",
    progressive: "play_mode.progressive"
};

export const PLAY_MODE_DESCRIPTION_KEYS: Record<PlayMode, TranslationKey> = {
    single: "play_mode.single.description",
    progressive: "play_mode.progressive.description"
};

export const QUIZ_TYPE_LABEL_KEYS: Record<QuizType, TranslationKey> = {
    islands: "quiz_type.islands",
    regions: "quiz_type.regions",
    prefectures: "quiz_type.prefectures"
};

export const QUIZ_TYPE_DESCRIPTION_KEYS: Record<QuizType, TranslationKey> = {
    islands: "quiz_type.islands.description",
    regions: "quiz_type.regions.description",
    prefectures: "quiz_type.prefectures.description"
};

export const PROGRESSION_STYLE_LABEL_KEYS: Record<ProgressionStyle, TranslationKey> = {
    area_by_area: "progression.area_by_area",
    total_area: "progression.total_area"
};

export const PROGRESSION_STYLE_DESCRIPTION_KEYS: Record<ProgressionStyle, TranslationKey> = {
    area_by_area: "progression.area_by_area.description",
    total_area: "progression.total_area.description"
};

export const PROGRESSION_STYLE_TOOLTIP_KEYS: Record<ProgressionStyle, TranslationKey> = {
    area_by_area: "progression.area_by_area.tooltip",
    total_area: "progression.total_area.tooltip"
};

export const PREFECTURE_GROUPING_LABEL_KEYS: Record<PrefectureGrouping, TranslationKey> = {
    none: "grouping.none",
    island: "grouping.island",
    region: "grouping.region"
};
