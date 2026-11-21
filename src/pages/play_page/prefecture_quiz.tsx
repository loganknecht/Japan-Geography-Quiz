import { type Dispatch, type JSX, useState } from "react";

import { PlaceNameText } from "../../components/place_name_text";
import { JapanMap } from "../../map/japan_map";
import { MapSource } from "../../map/map_source";
import type { MapLabel, MapPoint, PrefectureFill } from "../../map/prefecture_map_types";
import { findPrefecture } from "../../places/find_place";
import type { Prefecture, PrefectureId } from "../../places/place_types";
import { buildPrefectureFills } from "../../quiz/build_prefecture_fills";
import { useQuizDispatch } from "../../quiz/quiz_context";
import type { QuizSetup } from "../../quiz/quiz_setup_types";
import type { QuizAction, QuizSession } from "../../quiz/quiz_types";
import { useSettingsState } from "../../settings/settings_context";
import styles from "./prefecture_quiz.module.css";
import { QuizHud } from "./quiz_hud";
import { QuizResults } from "./quiz_results";

interface PrefectureQuizProps {
    quiz_setup: QuizSetup;
    quiz_session: QuizSession;
}

export const PrefectureQuiz = ({ quiz_setup, quiz_session }: PrefectureQuizProps): JSX.Element => {
    const { should_skip_failed_answer_confirmation } = useSettingsState();
    const dispatchQuiz: Dispatch<QuizAction> = useQuizDispatch();
    const [map_label, setMapLabel] = useState<MapLabel | null>(null);
    const [label_count, setLabelCount] = useState<number>(0);
    const answer_id: PrefectureId | undefined = quiz_session.question_ids.at(quiz_session.current_question_index);

    const is_quiz_finished = answer_id === undefined;
    if (is_quiz_finished === true) {
        const results_element: JSX.Element = <QuizResults quiz_setup={quiz_setup} quiz_session={quiz_session} />;
        return results_element;
    }

    const showClickedName = (prefecture_id: PrefectureId, click_point: MapPoint): void => {
        const clicked_prefecture: Prefecture = findPrefecture(prefecture_id);
        const next_label_count: number = label_count + 1;
        setLabelCount(next_label_count);
        setMapLabel({
            label_key: next_label_count,
            point: click_point,
            content: <PlaceNameText place_name={clicked_prefecture.name} />
        });
    };

    const handlePrefectureClick = (prefecture_id: PrefectureId, click_point: MapPoint): void => {
        const is_question_prefecture: boolean = quiz_session.question_ids.includes(prefecture_id);
        if (is_question_prefecture === false) {
            return;
        }
        const is_wrong_click = prefecture_id !== answer_id;
        if (is_wrong_click === true) {
            showClickedName(prefecture_id, click_point);
        } else {
            setMapLabel(null);
        }
        dispatchQuiz({
            type: "clickPrefecture",
            prefecture_id: prefecture_id,
            should_skip_failed_answer_confirmation: should_skip_failed_answer_confirmation
        });
    };

    const prefecture_fills: Partial<Record<PrefectureId, PrefectureFill>> = buildPrefectureFills(quiz_session);

    const quiz_element: JSX.Element = (
        <div className={styles.quiz}>
            <QuizHud quiz_session={quiz_session} answer_id={answer_id} />
            <JapanMap
                prefecture_fills={prefecture_fills}
                map_label={map_label}
                onPrefectureClick={handlePrefectureClick}
            />
            <MapSource />
        </div>
    );
    return quiz_element;
};
