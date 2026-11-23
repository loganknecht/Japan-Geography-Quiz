import type { JSX } from "react";

import { PlaceNameText } from "../../components/place_name_text";
import { TranslatedText } from "../../components/translated_text";
import type { PlaceName } from "../../places/place_types";
import {
    calculateScorePercent,
    countOutcomes,
    listAnswersWithOutcome,
    OUTCOME_LABEL_KEYS
} from "../../quiz/quiz_outcomes";
import { findQuizPlaceName } from "../../quiz/quiz_places";
import { ANSWER_OUTCOMES, type AnswerOutcome, type QuizAnswer } from "../../quiz/quiz_types";
import styles from "./place_quiz.module.css";

interface AnswersProps {
    answers: QuizAnswer[];
}

interface OutcomeRowProps {
    outcome: AnswerOutcome;
    count: number;
    listed_answers: QuizAnswer[];
}

const OutcomeRow = ({ outcome, count, listed_answers }: OutcomeRowProps): JSX.Element => {
    const name_elements: JSX.Element[] = listed_answers.map((answer: QuizAnswer): JSX.Element => {
        const place_name: PlaceName = findQuizPlaceName(answer.place_id, answer.quiz_type);
        const name_element: JSX.Element = (
            <li key={`${answer.quiz_type}_${answer.place_id}`} className={styles.result_name}>
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

export const OutcomeRows = ({ answers }: AnswersProps): JSX.Element => {
    const outcome_counts: Record<AnswerOutcome, number> = countOutcomes(answers);
    const row_elements: JSX.Element[] = ANSWER_OUTCOMES.map((outcome: AnswerOutcome): JSX.Element => {
        const matching_answers: QuizAnswer[] = listAnswersWithOutcome(answers, outcome);
        const is_first_try_row = outcome === "first_try";
        const listed_answers: QuizAnswer[] = is_first_try_row === true ? [] : matching_answers;
        const row_element: JSX.Element = (
            <OutcomeRow
                key={outcome}
                outcome={outcome}
                count={outcome_counts[outcome]}
                listed_answers={listed_answers}
            />
        );
        return row_element;
    });
    const rows_element: JSX.Element = <ul className={styles.result_rows}>{row_elements}</ul>;
    return rows_element;
};

export const ScoreBlock = ({ answers }: AnswersProps): JSX.Element => {
    const score_percent: number = calculateScorePercent(answers);
    const score_element: JSX.Element = (
        <p className={styles.score}>
            <span className={styles.score_label}>
                <TranslatedText translation_key="results.score" />
            </span>
            <span className={styles.score_value}>{`${String(score_percent)}%`}</span>
            <span className={styles.score_rule}>
                <TranslatedText translation_key="results.score_rule" />
            </span>
        </p>
    );
    return score_element;
};
