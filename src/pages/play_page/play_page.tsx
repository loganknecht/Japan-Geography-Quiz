import type { Dispatch, JSX } from "react";
import { Navigate, type NavigateFunction, useNavigate } from "react-router";

import { TranslatedText } from "../../components/translated_text";
import { isPrefectureQuiz } from "../../quiz/build_question_ids";
import { useQuizDispatch, useQuizState } from "../../quiz/quiz_context";
import type { QuizAction } from "../../quiz/quiz_types";
import styles from "./play_page.module.css";
import { PrefectureQuiz } from "./prefecture_quiz";
import { QuizSetupSummary } from "./quiz_setup_summary";

const MENU_PATH: string = "/";

export const PlayPage = (): JSX.Element => {
    const { quiz_setup, quiz_session } = useQuizState();
    const dispatchQuiz: Dispatch<QuizAction> = useQuizDispatch();
    const navigate: NavigateFunction = useNavigate();
    const has_no_quiz_setup = quiz_setup === null;

    if (has_no_quiz_setup === true) {
        const redirect_element: JSX.Element = <Navigate to={MENU_PATH} replace />;
        return redirect_element;
    }

    const has_quiz_session = quiz_session !== null;
    const is_playable_quiz = isPrefectureQuiz(quiz_setup) === true && has_quiz_session === true;
    if (is_playable_quiz === true) {
        const quiz_element: JSX.Element = <PrefectureQuiz quiz_setup={quiz_setup} quiz_session={quiz_session} />;
        return quiz_element;
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
