import type { Dispatch, JSX } from "react";
import { Navigate, type NavigateFunction, useNavigate } from "react-router";

import { TranslatedText } from "../../components/translated_text";
import { useQuizDispatch, useQuizState } from "../../quiz/quiz_context";
import type { QuizAction } from "../../quiz/quiz_types";
import styles from "./play_page.module.css";
import { QuizSetupSummary } from "./quiz_setup_summary";

const MENU_PATH: string = "/";

export const PlayPage = (): JSX.Element => {
    const { quiz_setup } = useQuizState();
    const dispatchQuiz: Dispatch<QuizAction> = useQuizDispatch();
    const navigate: NavigateFunction = useNavigate();
    const has_no_quiz_setup = quiz_setup === null;

    if (has_no_quiz_setup === true) {
        const redirect_element: JSX.Element = <Navigate to={MENU_PATH} replace />;
        return redirect_element;
    }

    const returnToMenu = (): void => {
        dispatchQuiz({ type: "endQuiz" });
        void navigate(MENU_PATH);
    };

    const page_element: JSX.Element = (
        <section className={styles.panel}>
            <h2 className={styles.heading}>
                <TranslatedText translation_key="play.heading" />
            </h2>
            <QuizSetupSummary quiz_setup={quiz_setup} />
            <p>
                <TranslatedText translation_key="play.coming_soon" />
            </p>
            <button type="button" className={styles.back_button} onClick={returnToMenu}>
                <TranslatedText translation_key="play.back_to_menu" />
            </button>
        </section>
    );
    return page_element;
};
