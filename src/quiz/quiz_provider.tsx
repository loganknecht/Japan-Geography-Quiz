import { type JSX, type ReactNode, useReducer } from "react";

import { QuizDispatchContext, QuizStateContext } from "./quiz_context";
import { INITIAL_QUIZ_STATE, quizReducer } from "./quiz_reducer";

interface QuizProviderProps {
    children: ReactNode;
}

export const QuizProvider = ({ children }: QuizProviderProps): JSX.Element => {
    const [quiz_state, dispatchQuiz] = useReducer(quizReducer, INITIAL_QUIZ_STATE);

    const provider_element: JSX.Element = (
        <QuizStateContext value={quiz_state}>
            <QuizDispatchContext value={dispatchQuiz}>{children}</QuizDispatchContext>
        </QuizStateContext>
    );
    return provider_element;
};
