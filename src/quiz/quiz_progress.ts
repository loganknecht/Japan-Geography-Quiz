import type { PlaceId } from "../places/place_types";
import type { QuizSectionLabel, QuizSession, QuizStep } from "./quiz_types";

export const findCurrentStep = (quiz_session: QuizSession): QuizStep | undefined => {
    const current_step: QuizStep | undefined = quiz_session.steps.at(quiz_session.current_step_index);
    return current_step;
};

export const findAnswerId = (quiz_session: QuizSession): PlaceId | undefined => {
    const current_step: QuizStep | undefined = findCurrentStep(quiz_session);
    const answer_id: PlaceId | undefined = current_step?.question_ids.at(quiz_session.current_question_index);
    return answer_id;
};

export const listSectionSteps = (quiz_session: QuizSession, section_index: number): QuizStep[] => {
    const section_steps: QuizStep[] = quiz_session.steps.filter((step: QuizStep): boolean => {
        const is_in_section: boolean = step.section_index === section_index;
        return is_in_section;
    });
    return section_steps;
};

export interface SectionProgress {
    question_number: number;
    question_count: number;
}

export const findSectionProgress = (quiz_session: QuizSession, current_step: QuizStep): SectionProgress => {
    let question_number: number = quiz_session.current_question_index + 1;
    let question_count: number = 0;
    for (const [step_index, step] of quiz_session.steps.entries()) {
        const is_in_section = step.section_index === current_step.section_index;
        if (is_in_section === false) {
            continue;
        }
        question_count += step.question_ids.length;
        const is_earlier_step = step_index < quiz_session.current_step_index;
        if (is_earlier_step === true) {
            question_number += step.question_ids.length;
        }
    }
    const section_progress: SectionProgress = { question_number: question_number, question_count: question_count };
    return section_progress;
};

export const isAskingSectionArea = (section_label: QuizSectionLabel, quiz_step: QuizStep): boolean => {
    let is_asking_area: boolean = false;
    switch (section_label.kind) {
        case "area": {
            const is_area_layer: boolean = section_label.quiz_type === quiz_step.quiz_type;
            const has_area_question: boolean = quiz_step.question_ids.includes(section_label.place_id);
            is_asking_area = is_area_layer === true && has_area_question === true;
            break;
        }
        case "stage": {
            break;
        }
    }
    return is_asking_area;
};
