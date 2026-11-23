import type { IslandId, RegionId } from "../../places/place_types";
import type {
    PlayMode,
    PrefectureGrouping,
    PrefectureScope,
    PrefectureScopeKind,
    ProgressionStyle,
    QuizType
} from "../../quiz/quiz_setup_types";

export interface MenuSelectionState {
    play_mode: PlayMode;
    single_quiz_type: QuizType;
    prefecture_scope: PrefectureScope;
    last_island_id: IslandId;
    last_region_id: RegionId;
    progressive_stages: QuizType[];
    progression_style: ProgressionStyle;
    prefecture_grouping: PrefectureGrouping;
}

export type MenuSelectionAction =
    | { type: "setPlayMode"; play_mode: PlayMode }
    | { type: "setSingleQuizType"; quiz_type: QuizType }
    | { type: "setPrefectureScopeKind"; scope_kind: PrefectureScopeKind }
    | { type: "setPrefectureScope"; prefecture_scope: PrefectureScope }
    | { type: "toggleProgressiveStage"; stage: QuizType }
    | { type: "setProgressionStyle"; progression_style: ProgressionStyle }
    | { type: "setPrefectureGrouping"; prefecture_grouping: PrefectureGrouping };
