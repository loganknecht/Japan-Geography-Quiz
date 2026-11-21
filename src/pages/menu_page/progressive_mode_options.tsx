import type { JSX } from "react";

import styles from "./menu_page.module.css";
import { useMenuSelectionState } from "./menu_selection_context";
import { PrefectureGroupingPicker } from "./prefecture_grouping_picker";
import { ProgressionStylePicker } from "./progression_style_picker";
import { StagePicker } from "./stage_picker";

export const ProgressiveModeOptions = (): JSX.Element => {
    const { progressive_stages } = useMenuSelectionState();
    const has_prefecture_stage: boolean = progressive_stages.includes("prefectures");
    const grouping_element: JSX.Element | null = has_prefecture_stage === true ? <PrefectureGroupingPicker /> : null;

    const options_element: JSX.Element = (
        <div className={styles.stack}>
            <StagePicker />
            <ProgressionStylePicker />
            {grouping_element}
        </div>
    );
    return options_element;
};
