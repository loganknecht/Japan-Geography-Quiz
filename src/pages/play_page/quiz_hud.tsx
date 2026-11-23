import type { JSX } from "react";

import { PlaceNameText } from "../../components/place_name_text";
import { TranslatedText } from "../../components/translated_text";
import type { TranslationKey } from "../../i18n/translation_key";
import type { PlaceId, PlaceName } from "../../places/place_types";
import { countOutcomes, listSectionAnswers } from "../../quiz/quiz_outcomes";
import { findQuizPlaceName } from "../../quiz/quiz_places";
import { findSectionProgress, isAskingSectionArea, type SectionProgress } from "../../quiz/quiz_progress";
import type { QuizType } from "../../quiz/quiz_setup_types";
import {
    ANSWER_OUTCOMES,
    type AnswerOutcome,
    type QuizAnswer,
    type QuizSectionLabel,
    type QuizSession,
    type QuizStep,
    TRIES_PER_QUESTION
} from "../../quiz/quiz_types";
import styles from "./place_quiz.module.css";
import { SectionLabelText } from "./section_label_text";

interface QuizHudProps {
    quiz_session: QuizSession;
    current_step: QuizStep;
    answer_id: PlaceId;
}

const LAYER_LABEL_KEYS: Record<QuizType, TranslationKey> = {
    islands: "quiz.layer.islands",
    regions: "quiz.layer.regions",
    prefectures: "quiz.layer.prefectures"
};

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

const OutcomeTally = ({ answers }: { answers: QuizAnswer[] }): JSX.Element => {
    const outcome_counts: Record<AnswerOutcome, number> = countOutcomes(answers);
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

interface SectionStatProps {
    quiz_session: QuizSession;
    current_step: QuizStep;
}

const SectionStat = ({ quiz_session, current_step }: SectionStatProps): JSX.Element | null => {
    const section_count: number = quiz_session.sections.length;
    const has_one_section = section_count <= 1;
    const section_label: QuizSectionLabel | undefined = quiz_session.sections.at(current_step.section_index);
    const has_no_section_label = section_label === undefined;
    const should_hide_stat = has_one_section === true || has_no_section_label === true;
    if (should_hide_stat === true) {
        const no_stat: null = null;
        return no_stat;
    }
    const section_number: number = current_step.section_index + 1;
    const section_text: string = `${String(section_number)} / ${String(section_count)}`;
    const is_area_question: boolean = isAskingSectionArea(section_label, current_step);
    const label_element: JSX.Element | null =
        is_area_question === true ? null : <SectionLabelText section_label={section_label} />;
    const stat_element: JSX.Element = (
        <span className={styles.stat}>
            <span className={styles.stat_label}>
                <TranslatedText translation_key="quiz.section" />
            </span>
            <span className={styles.stat_value}>
                {label_element}
                <span className={styles.stat_detail}>{section_text}</span>
            </span>
        </span>
    );
    return stat_element;
};

export const QuizHud = ({ quiz_session, current_step, answer_id }: QuizHudProps): JSX.Element => {
    const answer_name: PlaceName = findQuizPlaceName(answer_id, current_step.quiz_type);
    const section_progress: SectionProgress = findSectionProgress(quiz_session, current_step);
    const progress_text: string = `${String(section_progress.question_number)} / ${String(section_progress.question_count)}`;
    const section_answers: QuizAnswer[] = listSectionAnswers(quiz_session, current_step.section_index);
    const is_progressive_session = quiz_session.sections.length > 1;
    const layer_element: JSX.Element | null =
        is_progressive_session === true ? (
            <span className={styles.layer_chip}>
                <TranslatedText translation_key={LAYER_LABEL_KEYS[current_step.quiz_type]} />
            </span>
        ) : null;
    const is_revealing_answer: boolean = quiz_session.is_revealing_answer;
    const status_element: JSX.Element =
        is_revealing_answer === true ? (
            <span className={styles.reveal_hint}>
                <TranslatedText translation_key="quiz.reveal_hint" />
            </span>
        ) : (
            <TryPips miss_count={quiz_session.miss_count} />
        );

    const hud_class_name: string = `${styles.hud} ${styles[`hud_${current_step.quiz_type}`]}`;

    const hud_element: JSX.Element = (
        <section className={hud_class_name} aria-live="polite">
            <div className={styles.prompt}>
                <span className={styles.prompt_label}>
                    <TranslatedText translation_key="quiz.find" />
                </span>
                {layer_element}
                <span className={styles.prompt_name}>
                    <PlaceNameText place_name={answer_name} />
                </span>
            </div>
            <div className={styles.stats}>
                <SectionStat quiz_session={quiz_session} current_step={current_step} />
                <span className={styles.stat}>
                    <span className={styles.stat_label}>
                        <TranslatedText translation_key="quiz.question" />
                    </span>
                    <span className={styles.stat_value}>{progress_text}</span>
                </span>
                {status_element}
                <OutcomeTally answers={section_answers} />
            </div>
        </section>
    );
    return hud_element;
};
