import type { Dispatch, JSX } from "react";

import { OptionButton } from "../../components/option_button";
import { TranslatedText } from "../../components/translated_text";
import { QUIZ_TYPE_DESCRIPTION_KEYS, QUIZ_TYPE_LABEL_KEYS } from "../../quiz/quiz_setup_labels";
import { QUIZ_TYPES_IN_ORDER, type QuizType } from "../../quiz/quiz_setup_types";
import styles from "./menu_page.module.css";
import { useMenuSelectionDispatch, useMenuSelectionState } from "./menu_selection_context";
import type { MenuSelectionAction } from "./menu_selection_types";
import { PrefectureScopePicker } from "./prefecture_scope_picker";

export const QuizTypePicker = (): JSX.Element => {
    const { single_quiz_type } = useMenuSelectionState();
    const dispatchMenuSelection: Dispatch<MenuSelectionAction> = useMenuSelectionDispatch();
    const is_prefecture_quiz = single_quiz_type === "prefectures";

    const quiz_type_buttons: JSX.Element[] = QUIZ_TYPES_IN_ORDER.map((quiz_type: QuizType): JSX.Element => {
        const is_selected = quiz_type === single_quiz_type;
        const selectQuizType = (): void => {
            dispatchMenuSelection({ type: "setSingleQuizType", quiz_type: quiz_type });
        };
        const quiz_type_button: JSX.Element = (
            <OptionButton
                key={quiz_type}
                is_selected={is_selected}
                onSelect={selectQuizType}
                label={<TranslatedText translation_key={QUIZ_TYPE_LABEL_KEYS[quiz_type]} />}
                description={<TranslatedText translation_key={QUIZ_TYPE_DESCRIPTION_KEYS[quiz_type]} />}
                layout="card"
            />
        );
        return quiz_type_button;
    });

    const scope_drawer_element: JSX.Element | null = is_prefecture_quiz === true ? <PrefectureScopePicker /> : null;

    const picker_element: JSX.Element = (
        <fieldset className={styles.quiz_type_group}>
            <legend className={styles.group_heading}>
                <TranslatedText translation_key="menu.quiz_type_heading" />
            </legend>
            <div className={styles.quiz_type_grid}>
                {quiz_type_buttons}
                {scope_drawer_element}
            </div>
        </fieldset>
    );
    return picker_element;
};
