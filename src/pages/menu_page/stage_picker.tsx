import type { Dispatch, JSX } from "react";

import { TranslatedText } from "../../components/translated_text";
import { QUIZ_TYPE_LABEL_KEYS } from "../../quiz/quiz_setup_labels";
import { MINIMUM_PROGRESSIVE_STAGE_COUNT, QUIZ_TYPES_IN_ORDER, type QuizType } from "../../quiz/quiz_setup_types";
import styles from "./menu_page.module.css";
import { useMenuSelectionDispatch, useMenuSelectionState } from "./menu_selection_context";
import type { MenuSelectionAction } from "./menu_selection_types";

export const StagePicker = (): JSX.Element => {
    const { progressive_stages } = useMenuSelectionState();
    const dispatchMenuSelection: Dispatch<MenuSelectionAction> = useMenuSelectionDispatch();
    const is_at_minimum_stage_count = progressive_stages.length <= MINIMUM_PROGRESSIVE_STAGE_COUNT;

    const stage_checkboxes: JSX.Element[] = QUIZ_TYPES_IN_ORDER.map((stage: QuizType): JSX.Element => {
        const is_stage_selected: boolean = progressive_stages.includes(stage);
        const is_locked = is_stage_selected === true && is_at_minimum_stage_count === true;
        const toggleStage = (): void => {
            dispatchMenuSelection({ type: "toggleProgressiveStage", stage: stage });
        };
        const stage_checkbox: JSX.Element = (
            <label key={stage} className={styles.stage_checkbox}>
                <input type="checkbox" checked={is_stage_selected} disabled={is_locked} onChange={toggleStage} />
                <TranslatedText translation_key={QUIZ_TYPE_LABEL_KEYS[stage]} />
            </label>
        );
        return stage_checkbox;
    });

    const picker_element: JSX.Element = (
        <fieldset className={styles.stage_group}>
            <legend className={styles.group_heading}>
                <TranslatedText translation_key="menu.stages_heading" />
                <span className={styles.heading_hint}>
                    <TranslatedText translation_key="menu.stages_hint" />
                </span>
            </legend>
            <div className={styles.stage_row}>{stage_checkboxes}</div>
        </fieldset>
    );
    return picker_element;
};
