import type { JSX } from "react";

import { LayerPlaceNameText } from "../../components/layer_place_name_text";
import { PlaceNameText } from "../../components/place_name_text";
import { TranslatedText } from "../../components/translated_text";
import { findIsland, findPrefecture, findRegion } from "../../places/find_place";
import type { Island, Prefecture, PrefectureId, Region } from "../../places/place_types";
import { buildIslandScores, type IslandScore, isPerfectScore, type RegionScore } from "../../quiz/build_island_scores";
import { calculateScorePercent, listAllAnswers, OUTCOME_POINTS, sumPoints } from "../../quiz/quiz_outcomes";
import { ANSWER_OUTCOMES, type AnswerOutcome, type QuizAnswer, type QuizSession } from "../../quiz/quiz_types";
import { useSettingsState } from "../../settings/settings_context";
import styles from "./progressive_results.module.css";

const OUTCOME_SYMBOLS: Record<AnswerOutcome, string> = { first_try: "✓", retry: "△", failed: "✗" };

const formatPercent = (answers: QuizAnswer[]): string => {
    const score_percent: number = calculateScorePercent(answers);
    const percent_text: string = `${String(score_percent)}%`;
    return percent_text;
};

const OutcomeMark = ({ outcome }: { outcome: AnswerOutcome }): JSX.Element => {
    const mark_element: JSX.Element = (
        <span className={`${styles.mark} ${styles[`mark_${outcome}`]}`}>{OUTCOME_SYMBOLS[outcome]}</span>
    );
    return mark_element;
};

interface ScoreCellProps {
    answer: QuizAnswer | null;
    percent_answers?: QuizAnswer[];
}

const ScoreCell = ({ answer, percent_answers }: ScoreCellProps): JSX.Element => {
    const has_percent = percent_answers !== undefined;
    const percent_element: JSX.Element | null =
        has_percent === true ? <span className={styles.percent}>{formatPercent(percent_answers)}</span> : null;
    const outcome: AnswerOutcome | undefined = answer?.outcome;
    const has_outcome = outcome !== undefined;
    const points_element: JSX.Element | null =
        has_outcome === true ? (
            <>
                <span className={styles.points}>{String(OUTCOME_POINTS[outcome])}</span>
                <OutcomeMark outcome={outcome} />
            </>
        ) : null;
    const cell_element: JSX.Element = (
        <span className={styles.score_cell}>
            {percent_element}
            {points_element}
        </span>
    );
    return cell_element;
};

const PrefectureRow = ({ answer }: { answer: QuizAnswer }): JSX.Element => {
    const prefecture: Prefecture = findPrefecture(answer.place_id as PrefectureId);
    const row_element: JSX.Element = (
        <li className={styles.prefecture_row}>
            <span className={styles.row_name}>
                <PlaceNameText place_name={prefecture.name} />
            </span>
            <ScoreCell answer={answer} />
        </li>
    );
    return row_element;
};

const PrefectureRows = ({ answers }: { answers: QuizAnswer[] }): JSX.Element => {
    const row_elements: JSX.Element[] = answers.map((answer: QuizAnswer): JSX.Element => {
        const row_element: JSX.Element = <PrefectureRow key={answer.place_id} answer={answer} />;
        return row_element;
    });
    const rows_element: JSX.Element = <>{row_elements}</>;
    return rows_element;
};

const RegionGroup = ({ region_score }: { region_score: RegionScore }): JSX.Element => {
    const region: Region = findRegion(region_score.region_id);
    const group_element: JSX.Element = (
        <>
            <li className={styles.region_row}>
                <span className={styles.row_name}>
                    <LayerPlaceNameText place_name={region.name} template_key="results.region_name" />
                </span>
                <ScoreCell answer={region_score.region_answer} percent_answers={region_score.answers} />
            </li>
            <PrefectureRows answers={region_score.prefecture_answers} />
        </>
    );
    return group_element;
};

interface IslandColumnProps {
    island_score: IslandScore;
    should_collapse_perfect_sections: boolean;
}

const IslandColumn = ({ island_score, should_collapse_perfect_sections }: IslandColumnProps): JSX.Element => {
    const island: Island = findIsland(island_score.island_id);
    const is_perfect: boolean = isPerfectScore(island_score.answers);
    const is_collapsed = should_collapse_perfect_sections === true && is_perfect === true;
    const region_elements: JSX.Element[] = island_score.region_scores.map((region_score: RegionScore): JSX.Element => {
        const region_element: JSX.Element = <RegionGroup key={region_score.region_id} region_score={region_score} />;
        return region_element;
    });
    const column_element: JSX.Element = (
        <details className={styles.island_column} open={is_collapsed === false}>
            <summary className={styles.island_header}>
                <span className={`${styles.island_name} ${styles.row_name}`}>
                    <LayerPlaceNameText place_name={island.name} template_key="results.island_name" />
                </span>
                <ScoreCell answer={island_score.island_answer} percent_answers={island_score.answers} />
            </summary>
            <ul className={styles.island_rows}>
                <PrefectureRows answers={island_score.loose_prefecture_answers} />
                {region_elements}
            </ul>
        </details>
    );
    return column_element;
};

const OutcomeLegend = (): JSX.Element => {
    const legend_elements: JSX.Element[] = ANSWER_OUTCOMES.map((outcome: AnswerOutcome): JSX.Element => {
        const legend_element: JSX.Element = (
            <span key={outcome} className={styles.legend_item}>
                <OutcomeMark outcome={outcome} />
                {String(OUTCOME_POINTS[outcome])}
            </span>
        );
        return legend_element;
    });
    const legend_row: JSX.Element = <span className={styles.legend}>{legend_elements}</span>;
    return legend_row;
};

interface ProgressiveResultsProps {
    quiz_session: QuizSession;
}

export const ProgressiveResults = ({ quiz_session }: ProgressiveResultsProps): JSX.Element => {
    const { should_collapse_perfect_sections } = useSettingsState();
    const all_answers: QuizAnswer[] = listAllAnswers(quiz_session);
    const total_points: number = sumPoints(all_answers);
    const points_text: string = `${String(total_points)} / ${String(all_answers.length)}`;
    const island_scores: IslandScore[] = buildIslandScores(quiz_session);
    const column_elements: JSX.Element[] = island_scores.map((island_score: IslandScore): JSX.Element => {
        const column_element: JSX.Element = (
            <IslandColumn
                key={island_score.island_id}
                island_score={island_score}
                should_collapse_perfect_sections={should_collapse_perfect_sections}
            />
        );
        return column_element;
    });

    const results_element: JSX.Element = (
        <>
            <div className={styles.summary}>
                <h2 className={styles.heading}>
                    <TranslatedText translation_key="results.heading" />
                </h2>
                <span className={styles.total_percent}>{formatPercent(all_answers)}</span>
                <span className={styles.total_points}>{points_text}</span>
                <OutcomeLegend />
            </div>
            <div className={styles.columns_frame}>
                <div className={styles.columns}>{column_elements}</div>
            </div>
        </>
    );
    return results_element;
};
