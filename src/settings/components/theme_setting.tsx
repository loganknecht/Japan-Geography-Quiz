import type { Dispatch, JSX } from "react";

import { OptionButton } from "../../components/option_button";
import { TranslatedText } from "../../components/translated_text";
import type { TranslationKey } from "../../i18n/translation_key";
import { useSettingsDispatch, useSettingsState } from "../settings_context";
import { type SettingsAction, THEME_PREFERENCES, type ThemePreference } from "../settings_types";
import styles from "./settings_form.module.css";

const THEME_LABEL_KEYS: Record<ThemePreference, TranslationKey> = {
    system: "theme.system",
    light: "theme.light",
    dark: "theme.dark"
};

export const ThemeSetting = (): JSX.Element => {
    const { theme_preference } = useSettingsState();
    const dispatchSettings: Dispatch<SettingsAction> = useSettingsDispatch();

    const theme_buttons: JSX.Element[] = THEME_PREFERENCES.map((theme: ThemePreference): JSX.Element => {
        const is_selected = theme === theme_preference;
        const selectTheme = (): void => {
            dispatchSettings({ type: "setThemePreference", theme_preference: theme });
        };
        const theme_button: JSX.Element = (
            <OptionButton
                key={theme}
                is_selected={is_selected}
                onSelect={selectTheme}
                label={<TranslatedText translation_key={THEME_LABEL_KEYS[theme]} />}
            />
        );
        return theme_button;
    });

    const setting_element: JSX.Element = (
        <div className={styles.setting_row}>
            <span className={styles.setting_label}>
                <TranslatedText translation_key="settings.theme" />
            </span>
            <div className={styles.compact_options}>{theme_buttons}</div>
        </div>
    );
    return setting_element;
};
