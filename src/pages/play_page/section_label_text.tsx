import type { JSX } from "react";

import { PlaceNameText } from "../../components/place_name_text";
import { TranslatedText } from "../../components/translated_text";
import type { PlaceName } from "../../places/place_types";
import { findQuizPlaceName } from "../../quiz/quiz_places";
import { QUIZ_TYPE_LABEL_KEYS } from "../../quiz/quiz_setup_labels";
import type { QuizSectionLabel } from "../../quiz/quiz_types";

interface SectionLabelTextProps {
    section_label: QuizSectionLabel;
}

export const SectionLabelText = ({ section_label }: SectionLabelTextProps): JSX.Element => {
    let label_element: JSX.Element = <TranslatedText translation_key={QUIZ_TYPE_LABEL_KEYS[section_label.quiz_type]} />;
    const is_area_label = section_label.kind === "area";
    if (is_area_label === true) {
        const place_name: PlaceName = findQuizPlaceName(section_label.place_id, section_label.quiz_type);
        label_element = <PlaceNameText place_name={place_name} />;
    }
    return label_element;
};
