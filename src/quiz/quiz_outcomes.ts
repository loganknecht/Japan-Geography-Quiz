import type { TranslationKey } from "../i18n/translation_key";
import type { PrefectureId } from "../places/place_types";
import type { AnswerOutcome, QuizSession } from "./quiz_types";

export const OUTCOME_LABEL_KEYS: Record<AnswerOutcome, TranslationKey> = {
    first_try: "outcome.first_try",
    retry: "outcome.retry",
    failed: "outcome.failed"
};

const RETRY_POINTS: number = 0.5;

export const countOutcomes = (quiz_session: QuizSession): Record<AnswerOutcome, number> => {
    const outcome_counts: Record<AnswerOutcome, number> = { first_try: 0, retry: 0, failed: 0 };
    for (const question_id of quiz_session.question_ids) {
        const outcome: AnswerOutcome | undefined = quiz_session.outcomes[question_id];
        const has_outcome = outcome !== undefined;
        if (has_outcome === true) {
            outcome_counts[outcome] += 1;
        }
    }
    return outcome_counts;
};

export const listPrefecturesWithOutcome = (quiz_session: QuizSession, outcome: AnswerOutcome): PrefectureId[] => {
    const matching_ids: PrefectureId[] = quiz_session.question_ids.filter((question_id: PrefectureId): boolean => {
        const has_outcome: boolean = quiz_session.outcomes[question_id] === outcome;
        return has_outcome;
    });
    return matching_ids;
};

export const calculateScorePercent = (quiz_session: QuizSession): number => {
    const outcome_counts: Record<AnswerOutcome, number> = countOutcomes(quiz_session);
    const question_count: number = Math.max(quiz_session.question_ids.length, 1);
    const points: number = outcome_counts.first_try + outcome_counts.retry * RETRY_POINTS;
    const score_percent: number = Math.round((points / question_count) * 100);
    return score_percent;
};
