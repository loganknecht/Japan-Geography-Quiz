import type { Dispatch, JSX } from "react";
import { type NavigateFunction, useNavigate } from "react-router";

import { TranslatedText } from "../../components/translated_text";
import { useQuizDispatch } from "../../quiz/quiz_context";
import type { QuizSetup } from "../../quiz/quiz_setup_types";
import type { QuizAction } from "../../quiz/quiz_types";
import { buildQuizSetup } from "./build_quiz_setup";
import styles from "./menu_page.module.css";
import { useMenuSelectionState } from "./menu_selection_context";
import type { MenuSelectionState } from "./menu_selection_types";

const PLAY_PATH: string = "/play";

export const StartButton = (): JSX.Element => {
    const menu_selection: MenuSelectionState = useMenuSelectionState();
    const dispatchQuiz: Dispatch<QuizAction> = useQuizDispatch();
    const navigate: NavigateFunction = useNavigate();

    const startQuiz = (): void => {
        const quiz_setup: QuizSetup = buildQuizSetup(menu_selection);
        dispatchQuiz({ type: "startQuiz", quiz_setup: quiz_setup });
        void navigate(PLAY_PATH);
    };

    const start_button: JSX.Element = (
        <button type="button" className={styles.start_button} onClick={startQuiz}>
            <TranslatedText translation_key="menu.start" />
        </button>
    );
    return start_button;
};
