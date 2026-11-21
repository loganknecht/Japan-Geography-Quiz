import type { Dispatch, JSX } from "react";

import { TranslatedText } from "../../components/translated_text";
import type { TranslationKey } from "../../i18n/translation_key";
import { useSettingsDispatch, useSettingsState } from "../settings_context";
import type { SettingsAction, SettingsState, ToggleSettingName } from "../settings_types";
import styles from "./settings_form.module.css";

interface ToggleSettingProps {
    setting_name: ToggleSettingName;
    label_key: TranslationKey;
    hint_key?: TranslationKey;
    is_disabled?: boolean;
}

export const ToggleSetting = ({ setting_name, label_key, hint_key, is_disabled }: ToggleSettingProps): JSX.Element => {
    const settings_state: SettingsState = useSettingsState();
    const dispatchSettings: Dispatch<SettingsAction> = useSettingsDispatch();
    const is_enabled: boolean = settings_state[setting_name];
    const has_hint = hint_key !== undefined;

    const toggleSetting = (): void => {
        const is_enabled_next: boolean = is_enabled === false;
        dispatchSettings({ type: "setToggle", setting_name: setting_name, is_enabled: is_enabled_next });
    };

    const hint_element: JSX.Element | null =
        has_hint === true ? (
            <span className={styles.toggle_hint}>
                <TranslatedText translation_key={hint_key} />
            </span>
        ) : null;

    const toggle_element: JSX.Element = (
        <label className={styles.toggle}>
            <input type="checkbox" checked={is_enabled} disabled={is_disabled} onChange={toggleSetting} />
            <span>
                <TranslatedText translation_key={label_key} />
                {hint_element}
            </span>
        </label>
    );
    return toggle_element;
};
