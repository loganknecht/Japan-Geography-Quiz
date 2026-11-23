import type { JSX } from "react";
import { Navigate } from "react-router";

import { useQuizState } from "../../quiz/quiz_context";
import { PlaceQuiz } from "./place_quiz";

const MENU_PATH: string = "/";

export const PlayPage = (): JSX.Element => {
    const { quiz_setup, quiz_session } = useQuizState();

    const has_no_quiz = quiz_setup === null || quiz_session === null;
    if (has_no_quiz === true) {
        const redirect_element: JSX.Element = <Navigate to={MENU_PATH} replace />;
        return redirect_element;
    }

    const quiz_element: JSX.Element = <PlaceQuiz quiz_setup={quiz_setup} quiz_session={quiz_session} />;
    return quiz_element;
};
