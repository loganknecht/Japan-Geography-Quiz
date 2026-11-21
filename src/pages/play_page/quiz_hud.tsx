import type { JSX } from "react";

import { PlaceNameText } from "../../components/place_name_text";
import { TranslatedText } from "../../components/translated_text";
import { findPrefecture } from "../../places/find_place";
import type { Prefecture, PrefectureId } from "../../places/place_types";
import { countOutcomes } from "../../quiz/quiz_outcomes";
import { ANSWER_OUTCOMES, type AnswerOutcome, type QuizSession, TRIES_PER_QUESTION } from "../../quiz/quiz_types";
import styles from "./prefecture_quiz.module.css";

interface QuizHudProps {
    quiz_session: QuizSession;
    answer_id: PrefectureId;
}

const TryPips = ({ miss_count }: { miss_count: number }): JSX.Element => {
    const pip_elements: JSX.Element[] = [];
    for (let try_number: number = 1; try_number <= TRIES_PER_QUESTION; try_number += 1) {
        const is_try_used = try_number <= miss_count;
        const pip_class_name: string = is_try_used === true ? `${styles.pip} ${styles.pip_used}` : styles.pip;
        pip_elements.push(<span key={try_number} className={pip_class_name} />);
    }
    const tries_left: number = TRIES_PER_QUESTION - miss_count;
    const pips_element: JSX.Element = (
        <span className={styles.stat}>
            <span className={styles.stat_label}>
                <TranslatedText translation_key="quiz.tries_left" />
            </span>
            <span className={styles.pips} role="img" aria-label={String(tries_left)}>
                {pip_elements}
            </span>
        </span>
    );
    return pips_element;
};

const OutcomeTally = ({ quiz_session }: { quiz_session: QuizSession }): JSX.Element => {
    const outcome_counts: Record<AnswerOutcome, number> = countOutcomes(quiz_session);
    const tally_elements: JSX.Element[] = ANSWER_OUTCOMES.map((outcome: AnswerOutcome): JSX.Element => {
        const tally_element: JSX.Element = (
            <span key={outcome} className={`${styles.tally} ${styles[`tally_${outcome}`]}`}>
                {outcome_counts[outcome]}
            </span>
        );
        return tally_element;
    });
    const tally_row: JSX.Element = <span className={styles.tally_row}>{tally_elements}</span>;
    return tally_row;
};

export const QuizHud = ({ quiz_session, answer_id }: QuizHudProps): JSX.Element => {
    const answer_prefecture: Prefecture = findPrefecture(answer_id);
    const question_number: number = quiz_session.current_question_index + 1;
    const progress_text: string = `${String(question_number)} / ${String(quiz_session.question_ids.length)}`;
    const is_revealing_answer: boolean = quiz_session.is_revealing_answer;
    const status_element: JSX.Element =
        is_revealing_answer === true ? (
            <span className={styles.reveal_hint}>
                <TranslatedText translation_key="quiz.reveal_hint" />
            </span>
        ) : (
            <TryPips miss_count={quiz_session.miss_count} />
        );

    const hud_element: JSX.Element = (
        <section className={styles.hud} aria-live="polite">
            <div className={styles.prompt}>
                <span className={styles.prompt_label}>
                    <TranslatedText translation_key="quiz.find" />
                </span>
                <span className={styles.prompt_name}>
                    <PlaceNameText place_name={answer_prefecture.name} />
                </span>
            </div>
            <div className={styles.stats}>
                <span className={styles.stat}>
                    <span className={styles.stat_label}>
                        <TranslatedText translation_key="quiz.question" />
                    </span>
                    <span className={styles.stat_value}>{progress_text}</span>
                </span>
                {status_element}
                <OutcomeTally quiz_session={quiz_session} />
            </div>
        </section>
    );
    return hud_element;
};
