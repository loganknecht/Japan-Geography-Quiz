import type { Dispatch, JSX } from "react";

import { OptionButton } from "../../components/option_button";
import { OptionGroup } from "../../components/option_group";
import { TranslatedText } from "../../components/translated_text";
import { PLAY_MODE_DESCRIPTION_KEYS, PLAY_MODE_LABEL_KEYS } from "../../quiz/quiz_setup_labels";
import type { PlayMode } from "../../quiz/quiz_setup_types";
import { useMenuSelectionDispatch, useMenuSelectionState } from "./menu_selection_context";
import type { MenuSelectionAction } from "./menu_selection_types";

const PLAY_MODES: readonly PlayMode[] = ["single", "progressive"];

export const PlayModePicker = (): JSX.Element => {
    const { play_mode } = useMenuSelectionState();
    const dispatchMenuSelection: Dispatch<MenuSelectionAction> = useMenuSelectionDispatch();

    const play_mode_buttons: JSX.Element[] = PLAY_MODES.map((mode: PlayMode): JSX.Element => {
        const is_selected = mode === play_mode;
        const selectPlayMode = (): void => {
            dispatchMenuSelection({ type: "setPlayMode", play_mode: mode });
        };
        const play_mode_button: JSX.Element = (
            <OptionButton
                key={mode}
                is_selected={is_selected}
                onSelect={selectPlayMode}
                label={<TranslatedText translation_key={PLAY_MODE_LABEL_KEYS[mode]} />}
                description={<TranslatedText translation_key={PLAY_MODE_DESCRIPTION_KEYS[mode]} />}
            />
        );
        return play_mode_button;
    });

    const picker_element: JSX.Element = (
        <OptionGroup heading_key="menu.play_mode_heading">{play_mode_buttons}</OptionGroup>
    );
    return picker_element;
};
