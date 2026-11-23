import type { Dispatch, JSX } from "react";
import { type NavigateFunction, useNavigate } from "react-router";

import { TextButton } from "../../components/text_button";
import { TranslatedText } from "../../components/translated_text";
import { buildQuizStart } from "../../quiz/build_quiz_start";
import { useQuizDispatch } from "../../quiz/quiz_context";
import { listAllAnswers } from "../../quiz/quiz_outcomes";
import type { QuizSetup } from "../../quiz/quiz_setup_types";
import type { QuizAction, QuizAnswer, QuizSession, QuizStart } from "../../quiz/quiz_types";
import styles from "./place_quiz.module.css";
import play_styles from "./play_page.module.css";
import { ProgressiveResults } from "./progressive_results";
import { OutcomeRows, ScoreBlock } from "./result_parts";

interface QuizResultsProps {
    quiz_setup: QuizSetup;
    quiz_session: QuizSession;
}

const MENU_PATH: string = "/";

const SingleResults = ({ quiz_session }: { quiz_session: QuizSession }): JSX.Element => {
    const all_answers: QuizAnswer[] = listAllAnswers(quiz_session);
    const results_element: JSX.Element = (
        <>
            <h2 className={play_styles.heading}>
                <TranslatedText translation_key="results.heading" />
            </h2>
            <ScoreBlock answers={all_answers} />
            <OutcomeRows answers={all_answers} />
        </>
    );
    return results_element;
};

export const QuizResults = ({ quiz_setup, quiz_session }: QuizResultsProps): JSX.Element => {
    const dispatchQuiz: Dispatch<QuizAction> = useQuizDispatch();
    const navigate: NavigateFunction = useNavigate();
    const is_progressive_mode = quiz_setup.play_mode === "progressive";
    const panel_class_name: string =
        is_progressive_mode === true ? `${play_styles.panel} ${play_styles.wide_panel}` : play_styles.panel;
    const body_element: JSX.Element =
        is_progressive_mode === true ? (
            <ProgressiveResults quiz_session={quiz_session} />
        ) : (
            <SingleResults quiz_session={quiz_session} />
        );

    const playAgain = (): void => {
        const quiz_start: QuizStart = buildQuizStart(quiz_setup);
        dispatchQuiz({ type: "restartQuiz", quiz_start: quiz_start });
    };

    const returnToMenu = (): void => {
        dispatchQuiz({ type: "endQuiz" });
        void navigate(MENU_PATH);
    };

    const results_element: JSX.Element = (
        <section className={panel_class_name}>
            {body_element}
            <div className={styles.result_buttons}>
                <TextButton class_name={play_styles.back_button} onPress={playAgain}>
                    <TranslatedText translation_key="results.play_again" />
                </TextButton>
                <TextButton class_name={styles.secondary_button} onPress={returnToMenu}>
                    <TranslatedText translation_key="play.back_to_menu" />
                </TextButton>
            </div>
        </section>
    );
    return results_element;
};
