import type { Dispatch, JSX } from "react";

import { OptionButton } from "../../components/option_button";
import { TranslatedText } from "../../components/translated_text";
import {
    PROGRESSION_STYLE_DESCRIPTION_KEYS,
    PROGRESSION_STYLE_LABEL_KEYS,
    PROGRESSION_STYLE_TOOLTIP_KEYS
} from "../../quiz/quiz_setup_labels";
import type { ProgressionStyle } from "../../quiz/quiz_setup_types";
import styles from "./menu_page.module.css";
import { useMenuSelectionDispatch, useMenuSelectionState } from "./menu_selection_context";
import type { MenuSelectionAction } from "./menu_selection_types";
import { PrefectureGroupingPicker } from "./prefecture_grouping_picker";

const PROGRESSION_STYLES: readonly ProgressionStyle[] = ["area_by_area", "total_area"];

export const ProgressionStylePicker = (): JSX.Element => {
    const { progression_style, progressive_stages } = useMenuSelectionState();
    const dispatchMenuSelection: Dispatch<MenuSelectionAction> = useMenuSelectionDispatch();
    const has_prefecture_stage: boolean = progressive_stages.includes("prefectures");

    const progression_buttons: JSX.Element[] = PROGRESSION_STYLES.map((style: ProgressionStyle): JSX.Element => {
        const is_selected = style === progression_style;
        const selectProgressionStyle = (): void => {
            dispatchMenuSelection({ type: "setProgressionStyle", progression_style: style });
        };
        const progression_button: JSX.Element = (
            <OptionButton
                key={style}
                is_selected={is_selected}
                onSelect={selectProgressionStyle}
                label={<TranslatedText translation_key={PROGRESSION_STYLE_LABEL_KEYS[style]} />}
                description={<TranslatedText translation_key={PROGRESSION_STYLE_DESCRIPTION_KEYS[style]} />}
                tooltip={<TranslatedText translation_key={PROGRESSION_STYLE_TOOLTIP_KEYS[style]} />}
                layout="card"
            />
        );
        return progression_button;
    });

    const grouping_drawer_element: JSX.Element | null =
        has_prefecture_stage === true ? <PrefectureGroupingPicker /> : null;

    const picker_element: JSX.Element = (
        <fieldset className={styles.quiz_type_group}>
            <legend className={styles.group_heading}>
                <TranslatedText translation_key="menu.progression_heading" />
            </legend>
            <div className={styles.progression_grid}>
                {progression_buttons}
                {grouping_drawer_element}
            </div>
        </fieldset>
    );
    return picker_element;
};
