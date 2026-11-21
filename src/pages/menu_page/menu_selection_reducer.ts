import type { IslandId, RegionId } from "../../places/place_types";
import {
    MINIMUM_PROGRESSIVE_STAGE_COUNT,
    type PrefectureGrouping,
    type PrefectureScope,
    type PrefectureScopeKind,
    QUIZ_TYPES_IN_ORDER,
    type QuizType
} from "../../quiz/quiz_setup_types";
import type { MenuSelectionAction, MenuSelectionState } from "./menu_selection_types";

export const INITIAL_MENU_SELECTION_STATE: MenuSelectionState = {
    play_mode: "single",
    single_quiz_type: "prefectures",
    prefecture_scope: { kind: "all_japan" },
    last_island_id: "okinawa",
    last_region_id: "kyushu",
    progressive_stages: ["islands", "regions", "prefectures"],
    progression_style: "area_by_area",
    prefecture_grouping: "region"
};

const toggleStage = (selected_stages: QuizType[], toggled_stage: QuizType): QuizType[] => {
    const is_toggled_stage_selected: boolean = selected_stages.includes(toggled_stage);
    const is_at_minimum_stage_count = selected_stages.length <= MINIMUM_PROGRESSIVE_STAGE_COUNT;
    const is_dropping_below_minimum = is_toggled_stage_selected === true && is_at_minimum_stage_count === true;
    if (is_dropping_below_minimum === true) {
        return selected_stages;
    }
    const stages_after_toggle: QuizType[] = QUIZ_TYPES_IN_ORDER.filter((quiz_type: QuizType): boolean => {
        const is_toggled_quiz_type = quiz_type === toggled_stage;
        const is_currently_selected: boolean = selected_stages.includes(quiz_type);
        const is_selected_after_toggle: boolean =
            is_toggled_quiz_type === true ? is_currently_selected === false : is_currently_selected;
        return is_selected_after_toggle;
    });
    return stages_after_toggle;
};

const createScopeForKind = (scope_kind: PrefectureScopeKind, state: MenuSelectionState): PrefectureScope => {
    let scope_for_kind: PrefectureScope = { kind: "all_japan" };
    switch (scope_kind) {
        case "island": {
            scope_for_kind = { kind: "island", island_id: state.last_island_id };
            break;
        }
        case "region": {
            scope_for_kind = { kind: "region", region_id: state.last_region_id };
            break;
        }
        case "all_japan": {
            break;
        }
    }
    return scope_for_kind;
};

const rememberScopePick = (state: MenuSelectionState, prefecture_scope: PrefectureScope): MenuSelectionState => {
    let last_island_id: IslandId = state.last_island_id;
    let last_region_id: RegionId = state.last_region_id;
    switch (prefecture_scope.kind) {
        case "island": {
            last_island_id = prefecture_scope.island_id;
            break;
        }
        case "region": {
            last_region_id = prefecture_scope.region_id;
            break;
        }
        case "all_japan": {
            break;
        }
    }
    const remembered_state: MenuSelectionState = {
        ...state,
        prefecture_scope: prefecture_scope,
        last_island_id: last_island_id,
        last_region_id: last_region_id
    };
    return remembered_state;
};

export const menuSelectionReducer = (state: MenuSelectionState, action: MenuSelectionAction): MenuSelectionState => {
    let next_state: MenuSelectionState = state;
    switch (action.type) {
        case "setPlayMode": {
            next_state = { ...state, play_mode: action.play_mode };
            break;
        }
        case "setSingleQuizType": {
            next_state = { ...state, single_quiz_type: action.quiz_type };
            break;
        }
        case "setPrefectureScopeKind": {
            const scope_for_kind: PrefectureScope = createScopeForKind(action.scope_kind, state);
            next_state = { ...state, prefecture_scope: scope_for_kind };
            break;
        }
        case "setPrefectureScope": {
            next_state = rememberScopePick(state, action.prefecture_scope);
            break;
        }
        case "toggleProgressiveStage": {
            const next_stages: QuizType[] = toggleStage(state.progressive_stages, action.stage);
            next_state = { ...state, progressive_stages: next_stages };
            break;
        }
        case "setProgressionStyle": {
            const is_area_by_area = action.progression_style === "area_by_area";
            const is_ungrouped = state.prefecture_grouping === "none";
            const is_grouping_required = is_area_by_area === true && is_ungrouped === true;
            const next_grouping: PrefectureGrouping =
                is_grouping_required === true ? "region" : state.prefecture_grouping;
            next_state = { ...state, progression_style: action.progression_style, prefecture_grouping: next_grouping };
            break;
        }
        case "setPrefectureGrouping": {
            next_state = { ...state, prefecture_grouping: action.prefecture_grouping };
            break;
        }
    }
    return next_state;
};
