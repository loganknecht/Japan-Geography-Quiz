import { type Dispatch, type JSX, useState } from "react";

import { type PlaySoundEffect, useSoundEffect } from "../../audio/use_sound_effect";
import { PlaceNameText } from "../../components/place_name_text";
import { JapanMap } from "../../map/japan_map";
import { MapSource } from "../../map/map_source";
import type { MapLabel, MapPoint, PrefectureFill } from "../../map/prefecture_map_types";
import { findPrefecture } from "../../places/find_place";
import type { PlaceId, PlaceName, Prefecture, PrefectureId } from "../../places/place_types";
import { buildPrefectureFills, buildPrefectureGroups } from "../../quiz/build_prefecture_fills";
import { useQuizDispatch } from "../../quiz/quiz_context";
import { findQuizPlaceId, findQuizPlaceName } from "../../quiz/quiz_places";
import { findAnswerId, findCurrentStep } from "../../quiz/quiz_progress";
import type { QuizSetup } from "../../quiz/quiz_setup_types";
import type { QuizAction, QuizSession, QuizStep } from "../../quiz/quiz_types";
import { useSettingsState } from "../../settings/settings_context";
import styles from "./place_quiz.module.css";
import { QuizHud } from "./quiz_hud";
import { QuizResults } from "./quiz_results";

interface PlaceQuizProps {
    quiz_setup: QuizSetup;
    quiz_session: QuizSession;
}

export const PlaceQuiz = ({ quiz_setup, quiz_session }: PlaceQuizProps): JSX.Element => {
    const { should_skip_failed_answer_confirmation } = useSettingsState();
    const dispatchQuiz: Dispatch<QuizAction> = useQuizDispatch();
    const playSound: PlaySoundEffect = useSoundEffect();
    const [map_label, setMapLabel] = useState<MapLabel | null>(null);
    const [label_count, setLabelCount] = useState<number>(0);
    const current_step: QuizStep | undefined = findCurrentStep(quiz_session);
    const answer_id: PlaceId | undefined = findAnswerId(quiz_session);

    const is_quiz_finished = current_step === undefined || answer_id === undefined;
    if (is_quiz_finished === true) {
        const results_element: JSX.Element = <QuizResults quiz_setup={quiz_setup} quiz_session={quiz_session} />;
        return results_element;
    }

    const showClickedName = (place_id: PlaceId, click_point: MapPoint): void => {
        const place_name: PlaceName = findQuizPlaceName(place_id, current_step.quiz_type);
        const next_label_count: number = label_count + 1;
        setLabelCount(next_label_count);
        setMapLabel({
            label_key: next_label_count,
            point: click_point,
            content: <PlaceNameText place_name={place_name} />
        });
    };

    const handlePrefectureClick = (prefecture_id: PrefectureId, click_point: MapPoint): void => {
        const is_on_board: boolean = current_step.board_prefecture_ids.includes(prefecture_id);
        if (is_on_board === false) {
            return;
        }
        const clicked_prefecture: Prefecture = findPrefecture(prefecture_id);
        const place_id: PlaceId = findQuizPlaceId(clicked_prefecture, current_step.quiz_type);
        const is_wrong_click = place_id !== answer_id;
        const is_answered_place = quiz_session.outcomes[current_step.quiz_type][place_id] !== undefined;
        const is_answered_place_click = is_answered_place === true && is_wrong_click === true;
        if (is_answered_place_click === true) {
            return;
        }
        const is_revealing_answer: boolean = quiz_session.is_revealing_answer;
        if (is_wrong_click === true) {
            showClickedName(place_id, click_point);
            playSound("wrong_answer");
        } else if (is_revealing_answer === true) {
            setMapLabel(null);
            playSound("highlight_answer");
        } else {
            setMapLabel(null);
            playSound("correct_answer");
        }
        dispatchQuiz({
            type: "clickPlace",
            place_id: place_id,
            should_skip_failed_answer_confirmation: should_skip_failed_answer_confirmation
        });
    };

    const prefecture_fills: Partial<Record<PrefectureId, PrefectureFill>> = buildPrefectureFills(
        quiz_session,
        current_step
    );
    const prefecture_groups: Partial<Record<PrefectureId, PlaceId>> = buildPrefectureGroups(current_step.quiz_type);

    const quiz_element: JSX.Element = (
        <div className={styles.quiz}>
            <QuizHud quiz_session={quiz_session} current_step={current_step} answer_id={answer_id} />
            <JapanMap
                place_layer={current_step.quiz_type}
                prefecture_fills={prefecture_fills}
                prefecture_groups={prefecture_groups}
                map_label={map_label}
                onPrefectureClick={handlePrefectureClick}
            />
            <MapSource />
        </div>
    );
    return quiz_element;
};
