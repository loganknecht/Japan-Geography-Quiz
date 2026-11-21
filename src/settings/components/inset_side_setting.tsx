import type { Dispatch, JSX } from "react";

import { OptionButton } from "../../components/option_button";
import { TranslatedText } from "../../components/translated_text";
import type { TranslationKey } from "../../i18n/translation_key";
import { useSettingsDispatch, useSettingsState } from "../settings_context";
import { INSET_SIDES, type InsetSide, type SettingsAction } from "../settings_types";
import styles from "./settings_form.module.css";

const INSET_SIDE_LABEL_KEYS: Record<InsetSide, TranslationKey> = {
    left: "inset_side.left",
    right: "inset_side.right"
};

export const InsetSideSetting = (): JSX.Element => {
    const { inset_side } = useSettingsState();
    const dispatchSettings: Dispatch<SettingsAction> = useSettingsDispatch();

    const side_buttons: JSX.Element[] = INSET_SIDES.map((side: InsetSide): JSX.Element => {
        const is_selected = side === inset_side;
        const selectSide = (): void => {
            dispatchSettings({ type: "setInsetSide", inset_side: side });
        };
        const side_button: JSX.Element = (
            <OptionButton
                key={side}
                is_selected={is_selected}
                onSelect={selectSide}
                label={<TranslatedText translation_key={INSET_SIDE_LABEL_KEYS[side]} />}
            />
        );
        return side_button;
    });

    const setting_element: JSX.Element = (
        <div className={styles.setting_row}>
            <span className={styles.setting_label}>
                <TranslatedText translation_key="settings.inset_side" />
            </span>
            <div className={styles.compact_options}>{side_buttons}</div>
        </div>
    );
    return setting_element;
};
