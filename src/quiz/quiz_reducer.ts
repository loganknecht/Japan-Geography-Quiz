import type { QuizAction, QuizState } from "./quiz_types";

export const INITIAL_QUIZ_STATE: QuizState = { quiz_setup: null };

export const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
    let next_state: QuizState = state;
    switch (action.type) {
        case "startQuiz": {
            next_state = { ...state, quiz_setup: action.quiz_setup };
            break;
        }
        case "endQuiz": {
            next_state = INITIAL_QUIZ_STATE;
            break;
        }
    }
    return next_state;
};
