import type { TranslationKey } from "../i18n/translation_key";
import { listSectionSteps } from "./quiz_progress";
import type { AnswerOutcome, QuizAnswer, QuizSession, QuizStep } from "./quiz_types";

export const OUTCOME_LABEL_KEYS: Record<AnswerOutcome, TranslationKey> = {
    first_try: "outcome.first_try",
    retry: "outcome.retry",
    failed: "outcome.failed"
};

export const OUTCOME_POINTS: Record<AnswerOutcome, number> = { first_try: 1, retry: 0.5, failed: 0 };

const listStepAnswers = (quiz_session: QuizSession, steps: QuizStep[]): QuizAnswer[] => {
    const answers: QuizAnswer[] = [];
    for (const step of steps) {
        for (const question_id of step.question_ids) {
            answers.push({
                quiz_type: step.quiz_type,
                place_id: question_id,
                outcome: quiz_session.outcomes[step.quiz_type][question_id]
            });
        }
    }
    return answers;
};

export const listAllAnswers = (quiz_session: QuizSession): QuizAnswer[] => {
    const answers: QuizAnswer[] = listStepAnswers(quiz_session, quiz_session.steps);
    return answers;
};

export const listSectionAnswers = (quiz_session: QuizSession, section_index: number): QuizAnswer[] => {
    const section_steps: QuizStep[] = listSectionSteps(quiz_session, section_index);
    const answers: QuizAnswer[] = listStepAnswers(quiz_session, section_steps);
    return answers;
};

export const countOutcomes = (answers: QuizAnswer[]): Record<AnswerOutcome, number> => {
    const outcome_counts: Record<AnswerOutcome, number> = { first_try: 0, retry: 0, failed: 0 };
    for (const answer of answers) {
        const outcome: AnswerOutcome | undefined = answer.outcome;
        const has_outcome = outcome !== undefined;
        if (has_outcome === true) {
            outcome_counts[outcome] += 1;
        }
    }
    return outcome_counts;
};

export const listAnswersWithOutcome = (answers: QuizAnswer[], outcome: AnswerOutcome): QuizAnswer[] => {
    const matching_answers: QuizAnswer[] = answers.filter((answer: QuizAnswer): boolean => {
        const has_outcome: boolean = answer.outcome === outcome;
        return has_outcome;
    });
    return matching_answers;
};

export const sumPoints = (answers: QuizAnswer[]): number => {
    let points: number = 0;
    for (const answer of answers) {
        const outcome: AnswerOutcome | undefined = answer.outcome;
        const has_outcome = outcome !== undefined;
        if (has_outcome === true) {
            points += OUTCOME_POINTS[outcome];
        }
    }
    return points;
};

export const calculateScorePercent = (answers: QuizAnswer[]): number => {
    const question_count: number = Math.max(answers.length, 1);
    const points: number = sumPoints(answers);
    const score_percent: number = Math.round((points / question_count) * 100);
    return score_percent;
};
