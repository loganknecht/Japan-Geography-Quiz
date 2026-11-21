import { type Context, createContext, type Dispatch, useContext } from "react";

import { throwMissingProviderError } from "../utilities/throw_missing_provider_error";
import type { QuizAction, QuizState } from "./quiz_types";

export const QuizStateContext: Context<QuizState | null> = createContext<QuizState | null>(null);

export const QuizDispatchContext: Context<Dispatch<QuizAction> | null> = createContext<Dispatch<QuizAction> | null>(
    null
);

export const useQuizState = (): QuizState => {
    const quiz_state: QuizState | null = useContext(QuizStateContext);
    const provided_quiz_state: QuizState = quiz_state ?? throwMissingProviderError("QuizProvider");
    return provided_quiz_state;
};

export const useQuizDispatch = (): Dispatch<QuizAction> => {
    const dispatchQuiz: Dispatch<QuizAction> | null = useContext(QuizDispatchContext);
    const providedDispatchQuiz: Dispatch<QuizAction> = dispatchQuiz ?? throwMissingProviderError("QuizProvider");
    return providedDispatchQuiz;
};
