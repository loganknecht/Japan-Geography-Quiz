import type { Dispatch, JSX } from "react";
import { type NavigateFunction, useNavigate } from "react-router";

import { PlaceNameText } from "../../components/place_name_text";
import { TranslatedText } from "../../components/translated_text";
import type { PlaceId, PlaceName } from "../../places/place_types";
import { buildQuizStart } from "../../quiz/build_quiz_start";
import { useQuizDispatch } from "../../quiz/quiz_context";
import {
    calculateScorePercent,
    countOutcomes,
    listPlacesWithOutcome,
    OUTCOME_LABEL_KEYS
} from "../../quiz/quiz_outcomes";
import { findQuizPlaceName } from "../../quiz/quiz_places";
import type { QuizSetup, QuizType } from "../../quiz/quiz_setup_types";
import {
    ANSWER_OUTCOMES,
    type AnswerOutcome,
    type QuizAction,
    type QuizSession,
    type QuizStart
} from "../../quiz/quiz_types";
import styles from "./place_quiz.module.css";
import play_styles from "./play_page.module.css";

interface QuizResultsProps {
    quiz_setup: QuizSetup;
    quiz_session: QuizSession;
}

interface OutcomeRowProps {
    outcome: AnswerOutcome;
    count: number;
    quiz_type: QuizType;
    place_ids: PlaceId[];
}

const MENU_PATH: string = "/";

const OutcomeRow = ({ outcome, count, quiz_type, place_ids }: OutcomeRowProps): JSX.Element => {
    const name_elements: JSX.Element[] = place_ids.map((place_id: PlaceId): JSX.Element => {
        const place_name: PlaceName = findQuizPlaceName(place_id, quiz_type);
        const name_element: JSX.Element = (
            <li key={place_id} className={styles.result_name}>
                <PlaceNameText place_name={place_name} />
            </li>
        );
        return name_element;
    });
    const row_element: JSX.Element = (
        <li className={styles.result_row}>
            <span className={`${styles.tally} ${styles[`tally_${outcome}`]}`}>{count}</span>
            <span className={styles.result_label}>
                <TranslatedText translation_key={OUTCOME_LABEL_KEYS[outcome]} />
            </span>
            <ul className={styles.result_names}>{name_elements}</ul>
        </li>
    );
    return row_element;
};

export const QuizResults = ({ quiz_setup, quiz_session }: QuizResultsProps): JSX.Element => {
    const dispatchQuiz: Dispatch<QuizAction> = useQuizDispatch();
    const navigate: NavigateFunction = useNavigate();
    const outcome_counts: Record<AnswerOutcome, number> = countOutcomes(quiz_session);
    const score_percent: number = calculateScorePercent(quiz_session);

    const playAgain = (): void => {
        const quiz_start: QuizStart = buildQuizStart(quiz_setup);
        dispatchQuiz({ type: "restartQuiz", quiz_start: quiz_start });
    };

    const returnToMenu = (): void => {
        dispatchQuiz({ type: "endQuiz" });
        void navigate(MENU_PATH);
    };

    const row_elements: JSX.Element[] = ANSWER_OUTCOMES.map((outcome: AnswerOutcome): JSX.Element => {
        const place_ids: PlaceId[] = listPlacesWithOutcome(quiz_session, outcome);
        const is_first_try_row = outcome === "first_try";
        const listed_ids: PlaceId[] = is_first_try_row === true ? [] : place_ids;
        const row_element: JSX.Element = (
            <OutcomeRow
                key={outcome}
                outcome={outcome}
                count={outcome_counts[outcome]}
                quiz_type={quiz_session.quiz_type}
                place_ids={listed_ids}
            />
        );
        return row_element;
    });

    const results_element: JSX.Element = (
        <section className={play_styles.panel}>
            <h2 className={play_styles.heading}>
                <TranslatedText translation_key="results.heading" />
            </h2>
            <p className={styles.score}>
                <span className={styles.score_label}>
                    <TranslatedText translation_key="results.score" />
                </span>
                <span className={styles.score_value}>{`${String(score_percent)}%`}</span>
                <span className={styles.score_rule}>
                    <TranslatedText translation_key="results.score_rule" />
                </span>
            </p>
            <ul className={styles.result_rows}>{row_elements}</ul>
            <div className={styles.result_buttons}>
                <button type="button" className={play_styles.back_button} onClick={playAgain}>
                    <TranslatedText translation_key="results.play_again" />
                </button>
                <button type="button" className={styles.secondary_button} onClick={returnToMenu}>
                    <TranslatedText translation_key="play.back_to_menu" />
                </button>
            </div>
        </section>
    );
    return results_element;
};
