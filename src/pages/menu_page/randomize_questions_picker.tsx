import type { Dispatch, JSX } from "react";

import { TranslatedText } from "../../components/translated_text";
import styles from "./menu_page.module.css";
import { useMenuSelectionDispatch, useMenuSelectionState } from "./menu_selection_context";
import type { MenuSelectionAction } from "./menu_selection_types";

export const RandomizeQuestionsPicker = (): JSX.Element => {
    const { should_randomize_questions } = useMenuSelectionState();
    const dispatchMenuSelection: Dispatch<MenuSelectionAction> = useMenuSelectionDispatch();

    const toggleRandomizeQuestions = (): void => {
        dispatchMenuSelection({ type: "toggleRandomizeQuestions" });
    };

    const picker_element: JSX.Element = (
        <label className={`${styles.stage_checkbox} ${styles.randomize_checkbox}`}>
            <input type="checkbox" checked={should_randomize_questions} onChange={toggleRandomizeQuestions} />
            <span className={styles.randomize_text}>
                <TranslatedText translation_key="menu.randomize_questions" />
                <span className={styles.randomize_explanation}>
                    <TranslatedText translation_key="menu.randomize_questions_explanation" />
                </span>
            </span>
        </label>
    );
    return picker_element;
};
