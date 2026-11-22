import type { PlaceId } from "../places/place_types";
import {
    type AnswerOutcome,
    type QuizAction,
    type QuizSession,
    type QuizStart,
    type QuizState,
    TRIES_PER_QUESTION
} from "./quiz_types";

export const INITIAL_QUIZ_STATE: QuizState = { quiz_setup: null, quiz_session: null };

const createQuizSession = (quiz_start: QuizStart): QuizSession => {
    const quiz_session: QuizSession = {
        quiz_type: quiz_start.quiz_type,
        question_ids: quiz_start.question_ids,
        current_question_index: 0,
        miss_count: 0,
        is_revealing_answer: false,
        outcomes: {}
    };
    return quiz_session;
};

const moveToNextQuestion = (quiz_session: QuizSession): QuizSession => {
    const next_session: QuizSession = {
        ...quiz_session,
        current_question_index: quiz_session.current_question_index + 1,
        miss_count: 0,
        is_revealing_answer: false
    };
    return next_session;
};

const recordOutcome = (quiz_session: QuizSession, place_id: PlaceId, outcome: AnswerOutcome): QuizSession => {
    const recorded_session: QuizSession = {
        ...quiz_session,
        outcomes: { ...quiz_session.outcomes, [place_id]: outcome }
    };
    return recorded_session;
};

const recordMiss = (
    quiz_session: QuizSession,
    answer_id: PlaceId,
    should_skip_failed_answer_confirmation: boolean
): QuizSession => {
    const miss_count: number = quiz_session.miss_count + 1;
    const missed_session: QuizSession = { ...quiz_session, miss_count: miss_count };
    const has_used_every_try = miss_count >= TRIES_PER_QUESTION;
    let next_session: QuizSession = missed_session;
    if (has_used_every_try === true) {
        const failed_session: QuizSession = recordOutcome(missed_session, answer_id, "failed");
        const revealing_session: QuizSession = { ...failed_session, is_revealing_answer: true };
        next_session =
            should_skip_failed_answer_confirmation === true ? moveToNextQuestion(failed_session) : revealing_session;
    }
    return next_session;
};

const answerQuestion = (
    quiz_session: QuizSession,
    clicked_id: PlaceId,
    should_skip_failed_answer_confirmation: boolean
): QuizSession => {
    const answer_id: PlaceId | undefined = quiz_session.question_ids.at(quiz_session.current_question_index);
    let next_session: QuizSession = quiz_session;
    const is_quiz_finished = answer_id === undefined;
    if (is_quiz_finished === true) {
        return next_session;
    }
    const is_correct_click = clicked_id === answer_id;
    const is_answered_place = quiz_session.outcomes[clicked_id] !== undefined;
    const is_answered_place_click = is_answered_place === true && is_correct_click === false;
    if (is_answered_place_click === true) {
        return next_session;
    }
    const has_missed_before = quiz_session.miss_count > 0;
    const is_revealing_answer: boolean = quiz_session.is_revealing_answer;
    if (is_revealing_answer === true) {
        next_session = is_correct_click === true ? moveToNextQuestion(quiz_session) : quiz_session;
    } else if (is_correct_click === true) {
        const outcome: AnswerOutcome = has_missed_before === true ? "retry" : "first_try";
        const answered_session: QuizSession = recordOutcome(quiz_session, answer_id, outcome);
        next_session = moveToNextQuestion(answered_session);
    } else {
        next_session = recordMiss(quiz_session, answer_id, should_skip_failed_answer_confirmation);
    }
    return next_session;
};

export const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
    let next_state: QuizState = state;
    switch (action.type) {
        case "startQuiz": {
            next_state = { quiz_setup: action.quiz_setup, quiz_session: createQuizSession(action.quiz_start) };
            break;
        }
        case "restartQuiz": {
            next_state = { ...state, quiz_session: createQuizSession(action.quiz_start) };
            break;
        }
        case "clickPlace": {
            const quiz_session: QuizSession | null = state.quiz_session;
            const has_no_quiz_session = quiz_session === null;
            if (has_no_quiz_session === true) {
                break;
            }
            const answered_session: QuizSession = answerQuestion(
                quiz_session,
                action.place_id,
                action.should_skip_failed_answer_confirmation
            );
            next_state = { ...state, quiz_session: answered_session };
            break;
        }
        case "endQuiz": {
            next_state = INITIAL_QUIZ_STATE;
            break;
        }
    }
    return next_state;
};
