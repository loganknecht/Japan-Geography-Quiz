import type { JSX } from "react";

import { PlaceNameText } from "../../components/place_name_text";
import { TranslatedText } from "../../components/translated_text";
import { findIsland, findRegion } from "../../places/find_place";
import type { Island, Region } from "../../places/place_types";
import {
    PLAY_MODE_LABEL_KEYS,
    PREFECTURE_GROUPING_LABEL_KEYS,
    PROGRESSION_STYLE_LABEL_KEYS,
    QUIZ_TYPE_LABEL_KEYS
} from "../../quiz/quiz_setup_labels";
import type { PrefectureScope, QuizSetup, QuizType } from "../../quiz/quiz_setup_types";
import styles from "./play_page.module.css";

interface QuizSetupSummaryProps {
    quiz_setup: QuizSetup;
}

const PrefectureScopeText = ({ prefecture_scope }: { prefecture_scope: PrefectureScope }): JSX.Element => {
    let scope_element: JSX.Element = <TranslatedText translation_key="prefecture_scope.all_japan" />;
    switch (prefecture_scope.kind) {
        case "island": {
            const scope_island: Island = findIsland(prefecture_scope.island_id);
            scope_element = <PlaceNameText place_name={scope_island.name} />;
            break;
        }
        case "region": {
            const scope_region: Region = findRegion(prefecture_scope.region_id);
            scope_element = <PlaceNameText place_name={scope_region.name} />;
            break;
        }
        case "all_japan": {
            break;
        }
    }
    return scope_element;
};

export const QuizSetupSummary = ({ quiz_setup }: QuizSetupSummaryProps): JSX.Element => {
    const play_mode_element: JSX.Element = (
        <TranslatedText translation_key={PLAY_MODE_LABEL_KEYS[quiz_setup.play_mode]} />
    );
    let detail_elements: JSX.Element[] = [];

    switch (quiz_setup.play_mode) {
        case "single": {
            const is_prefecture_quiz = quiz_setup.quiz_type === "prefectures";
            const quiz_type_element: JSX.Element = (
                <li key="quiz_type">
                    <TranslatedText translation_key={QUIZ_TYPE_LABEL_KEYS[quiz_setup.quiz_type]} />
                </li>
            );
            const scope_element: JSX.Element = (
                <li key="scope">
                    <PrefectureScopeText prefecture_scope={quiz_setup.prefecture_scope} />
                </li>
            );
            detail_elements = is_prefecture_quiz === true ? [quiz_type_element, scope_element] : [quiz_type_element];
            break;
        }
        case "progressive": {
            const stage_elements: JSX.Element[] = quiz_setup.stages.map((stage: QuizType): JSX.Element => {
                const stage_element: JSX.Element = (
                    <li key={stage}>
                        <TranslatedText translation_key={QUIZ_TYPE_LABEL_KEYS[stage]} />
                    </li>
                );
                return stage_element;
            });
            const has_prefecture_stage: boolean = quiz_setup.stages.includes("prefectures");
            const style_element: JSX.Element = (
                <li key="style">
                    <TranslatedText translation_key={PROGRESSION_STYLE_LABEL_KEYS[quiz_setup.progression_style]} />
                </li>
            );
            const grouping_element: JSX.Element = (
                <li key="grouping">
                    <TranslatedText translation_key="menu.grouping_heading" />
                    {": "}
                    <TranslatedText translation_key={PREFECTURE_GROUPING_LABEL_KEYS[quiz_setup.prefecture_grouping]} />
                </li>
            );
            const setting_elements: JSX.Element[] =
                has_prefecture_stage === true ? [style_element, grouping_element] : [style_element];
            detail_elements = [...stage_elements, ...setting_elements];
            break;
        }
    }

    const summary_element: JSX.Element = (
        <div className={styles.summary}>
            <p className={styles.mode}>{play_mode_element}</p>
            <ul className={styles.details}>{detail_elements}</ul>
        </div>
    );
    return summary_element;
};
