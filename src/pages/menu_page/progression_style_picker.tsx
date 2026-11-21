import type { Dispatch, JSX } from "react";

import { OptionButton } from "../../components/option_button";
import { OptionGroup } from "../../components/option_group";
import { TranslatedText } from "../../components/translated_text";
import {
    PROGRESSION_STYLE_DESCRIPTION_KEYS,
    PROGRESSION_STYLE_LABEL_KEYS,
    PROGRESSION_STYLE_TOOLTIP_KEYS
} from "../../quiz/quiz_setup_labels";
import type { ProgressionStyle } from "../../quiz/quiz_setup_types";
import { useMenuSelectionDispatch, useMenuSelectionState } from "./menu_selection_context";
import type { MenuSelectionAction } from "./menu_selection_types";

const PROGRESSION_STYLES: readonly ProgressionStyle[] = ["area_by_area", "total_area"];

export const ProgressionStylePicker = (): JSX.Element => {
    const { progression_style } = useMenuSelectionState();
    const dispatchMenuSelection: Dispatch<MenuSelectionAction> = useMenuSelectionDispatch();

    const progression_buttons: JSX.Element[] = PROGRESSION_STYLES.map((style: ProgressionStyle): JSX.Element => {
        const is_selected = style === progression_style;
        const selectProgressionStyle = (): void => {
            dispatchMenuSelection({ type: "setProgressionStyle", progression_style: style });
        };
        const progression_button: JSX.Element = (
            <OptionButton
                key={style}
                is_selected={is_selected}
                onSelect={selectProgressionStyle}
                label={<TranslatedText translation_key={PROGRESSION_STYLE_LABEL_KEYS[style]} />}
                description={<TranslatedText translation_key={PROGRESSION_STYLE_DESCRIPTION_KEYS[style]} />}
                tooltip={<TranslatedText translation_key={PROGRESSION_STYLE_TOOLTIP_KEYS[style]} />}
            />
        );
        return progression_button;
    });

    const picker_element: JSX.Element = (
        <OptionGroup heading_key="menu.progression_heading">{progression_buttons}</OptionGroup>
    );
    return picker_element;
};
