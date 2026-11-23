import { listHomeRegionIds, listIslandIds, listRegionIds } from "../places/place_lists";
import type { IslandId, PlaceId, Prefecture, PrefectureId, RegionId } from "../places/place_types";
import { PREFECTURES_NORTH_TO_SOUTH } from "../places/prefectures";
import { shuffle } from "../utilities/shuffle";
import type {
    PrefectureGrouping,
    PrefectureScope,
    ProgressiveQuizSetup,
    QuizSetup,
    QuizType,
    SingleQuizSetup
} from "./quiz_setup_types";
import type { QuizSectionLabel, QuizStart, QuizStep } from "./quiz_types";

type PrefectureFilter = (prefecture: Prefecture) => boolean;

const matchesAllPrefectures: PrefectureFilter = (): boolean => {
    const is_included: boolean = true;
    return is_included;
};

const buildScopeFilter = (prefecture_scope: PrefectureScope): PrefectureFilter => {
    let matchesPrefecture: PrefectureFilter = matchesAllPrefectures;
    switch (prefecture_scope.kind) {
        case "island": {
            matchesPrefecture = (prefecture: Prefecture): boolean => {
                const is_on_island: boolean = prefecture.island_id === prefecture_scope.island_id;
                return is_on_island;
            };
            break;
        }
        case "region": {
            matchesPrefecture = (prefecture: Prefecture): boolean => {
                const is_in_region: boolean = prefecture.region_id === prefecture_scope.region_id;
                return is_in_region;
            };
            break;
        }
        case "all_japan": {
            break;
        }
    }
    return matchesPrefecture;
};

const listBoardPrefectureIds = (matchesPrefecture: PrefectureFilter): PrefectureId[] => {
    const board_prefectures: Prefecture[] = PREFECTURES_NORTH_TO_SOUTH.filter(matchesPrefecture);
    const board_prefecture_ids: PrefectureId[] = board_prefectures.map((prefecture: Prefecture): PrefectureId => {
        const prefecture_id: PrefectureId = prefecture.id;
        return prefecture_id;
    });
    return board_prefecture_ids;
};

const buildStep = (
    quiz_type: QuizType,
    section_index: number,
    matchesPrefecture: PrefectureFilter,
    question_ids: PlaceId[]
): QuizStep => {
    const quiz_step: QuizStep = {
        quiz_type: quiz_type,
        section_index: section_index,
        board_prefecture_ids: listBoardPrefectureIds(matchesPrefecture),
        question_ids: question_ids
    };
    return quiz_step;
};

const buildPrefectureStep = (section_index: number, matchesPrefecture: PrefectureFilter): QuizStep | null => {
    const prefecture_ids: PrefectureId[] = listBoardPrefectureIds(matchesPrefecture);
    const has_no_prefectures = prefecture_ids.length === 0;
    if (has_no_prefectures === true) {
        const empty_step: null = null;
        return empty_step;
    }
    const prefecture_step: QuizStep = buildStep(
        "prefectures",
        section_index,
        matchesPrefecture,
        shuffle(prefecture_ids)
    );
    return prefecture_step;
};

const buildGroupFilters = (
    prefecture_grouping: PrefectureGrouping,
    matchesOuterArea: PrefectureFilter
): PrefectureFilter[] => {
    let group_scopes: PrefectureScope[] = [{ kind: "all_japan" }];
    switch (prefecture_grouping) {
        case "island": {
            const island_ids: IslandId[] = listIslandIds();
            group_scopes = island_ids.map((island_id: IslandId): PrefectureScope => {
                const island_scope: PrefectureScope = { kind: "island", island_id: island_id };
                return island_scope;
            });
            break;
        }
        case "region": {
            const region_ids: RegionId[] = listRegionIds();
            group_scopes = region_ids.map((region_id: RegionId): PrefectureScope => {
                const region_scope: PrefectureScope = { kind: "region", region_id: region_id };
                return region_scope;
            });
            break;
        }
        case "none": {
            break;
        }
    }
    const group_matchers: PrefectureFilter[] = group_scopes.map((group_scope: PrefectureScope): PrefectureFilter => {
        const matchesScope: PrefectureFilter = buildScopeFilter(group_scope);
        const matchesGroup: PrefectureFilter = (prefecture: Prefecture): boolean => {
            const is_in_group: boolean = matchesOuterArea(prefecture) === true && matchesScope(prefecture) === true;
            return is_in_group;
        };
        return matchesGroup;
    });
    return group_matchers;
};

const buildPrefectureSteps = (
    section_index: number,
    prefecture_grouping: PrefectureGrouping,
    matchesOuterArea: PrefectureFilter
): QuizStep[] => {
    const prefecture_steps: QuizStep[] = [];
    for (const matchesGroup of buildGroupFilters(prefecture_grouping, matchesOuterArea)) {
        const prefecture_step: QuizStep | null = buildPrefectureStep(section_index, matchesGroup);
        const has_step = prefecture_step !== null;
        if (has_step === true) {
            prefecture_steps.push(prefecture_step);
        }
    }
    return prefecture_steps;
};

const buildSingleQuizStart = (quiz_setup: SingleQuizSetup): QuizStart => {
    const sections: QuizSectionLabel[] = [{ kind: "stage", quiz_type: quiz_setup.quiz_type }];
    let quiz_step: QuizStep = buildStep("islands", 0, matchesAllPrefectures, shuffle(listIslandIds()));
    switch (quiz_setup.quiz_type) {
        case "islands": {
            break;
        }
        case "regions": {
            quiz_step = buildStep("regions", 0, matchesAllPrefectures, shuffle(listRegionIds()));
            break;
        }
        case "prefectures": {
            const matchesScope: PrefectureFilter = buildScopeFilter(quiz_setup.prefecture_scope);
            const prefecture_ids: PrefectureId[] = listBoardPrefectureIds(matchesScope);
            quiz_step = buildStep("prefectures", 0, matchesScope, shuffle(prefecture_ids));
            break;
        }
    }
    const quiz_start: QuizStart = { sections: sections, steps: [quiz_step] };
    return quiz_start;
};

const buildTotalAreaQuizStart = (quiz_setup: ProgressiveQuizSetup): QuizStart => {
    const sections: QuizSectionLabel[] = [];
    const steps: QuizStep[] = [];
    for (const [section_index, stage] of quiz_setup.stages.entries()) {
        sections.push({ kind: "stage", quiz_type: stage });
        switch (stage) {
            case "islands": {
                steps.push(buildStep("islands", section_index, matchesAllPrefectures, shuffle(listIslandIds())));
                break;
            }
            case "regions": {
                steps.push(buildStep("regions", section_index, matchesAllPrefectures, shuffle(listRegionIds())));
                break;
            }
            case "prefectures": {
                const prefecture_steps: QuizStep[] = buildPrefectureSteps(
                    section_index,
                    quiz_setup.prefecture_grouping,
                    matchesAllPrefectures
                );
                steps.push(...prefecture_steps);
                break;
            }
        }
    }
    const quiz_start: QuizStart = { sections: sections, steps: steps };
    return quiz_start;
};

const buildIslandAreaSteps = (
    quiz_setup: ProgressiveQuizSetup,
    island_id: IslandId,
    section_index: number
): QuizStep[] => {
    const matchesIsland: PrefectureFilter = buildScopeFilter({ kind: "island", island_id: island_id });
    const steps: QuizStep[] = [buildStep("islands", section_index, matchesAllPrefectures, [island_id])];
    const has_region_stage: boolean = quiz_setup.stages.includes("regions");
    const has_prefecture_stage: boolean = quiz_setup.stages.includes("prefectures");
    const home_region_ids: RegionId[] = listHomeRegionIds(island_id);
    const has_home_regions = home_region_ids.length > 0;
    const should_ask_regions = has_region_stage === true && has_home_regions === true;
    if (should_ask_regions === true) {
        steps.push(buildStep("regions", section_index, matchesIsland, shuffle(home_region_ids)));
    }
    if (has_prefecture_stage === true) {
        const prefecture_steps: QuizStep[] = buildPrefectureSteps(
            section_index,
            quiz_setup.prefecture_grouping,
            matchesIsland
        );
        steps.push(...prefecture_steps);
    }
    return steps;
};

const buildRegionAreaSteps = (region_id: RegionId, section_index: number): QuizStep[] => {
    const matchesRegion: PrefectureFilter = buildScopeFilter({ kind: "region", region_id: region_id });
    const region_step: QuizStep = buildStep("regions", section_index, matchesAllPrefectures, [region_id]);
    const prefecture_step: QuizStep | null = buildPrefectureStep(section_index, matchesRegion);
    const has_prefecture_step = prefecture_step !== null;
    const steps: QuizStep[] = has_prefecture_step === true ? [region_step, prefecture_step] : [region_step];
    return steps;
};

const buildAreaByAreaQuizStart = (quiz_setup: ProgressiveQuizSetup): QuizStart => {
    const sections: QuizSectionLabel[] = [];
    const steps: QuizStep[] = [];
    const has_island_stage: boolean = quiz_setup.stages.includes("islands");
    if (has_island_stage === true) {
        const island_ids: IslandId[] = listIslandIds();
        for (const [section_index, island_id] of island_ids.entries()) {
            sections.push({ kind: "area", quiz_type: "islands", place_id: island_id });
            steps.push(...buildIslandAreaSteps(quiz_setup, island_id, section_index));
        }
    } else {
        const region_ids: RegionId[] = listRegionIds();
        for (const [section_index, region_id] of region_ids.entries()) {
            sections.push({ kind: "area", quiz_type: "regions", place_id: region_id });
            steps.push(...buildRegionAreaSteps(region_id, section_index));
        }
    }
    const quiz_start: QuizStart = { sections: sections, steps: steps };
    return quiz_start;
};

export const buildQuizStart = (quiz_setup: QuizSetup): QuizStart => {
    let quiz_start: QuizStart;
    const is_single_mode = quiz_setup.play_mode === "single";
    if (is_single_mode === true) {
        quiz_start = buildSingleQuizStart(quiz_setup);
        return quiz_start;
    }
    const is_total_area = quiz_setup.progression_style === "total_area";
    if (is_total_area === true) {
        quiz_start = buildTotalAreaQuizStart(quiz_setup);
    } else {
        quiz_start = buildAreaByAreaQuizStart(quiz_setup);
    }
    return quiz_start;
};
