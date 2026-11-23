import type { ChangeEvent, Dispatch, JSX } from "react";

import { TranslatedText } from "../../components/translated_text";
import { useSettingsDispatch, useSettingsState } from "../settings_context";
import { type Language, LANGUAGES, type SettingsAction } from "../settings_types";
import styles from "./settings_form.module.css";

const LANGUAGE_NATIVE_NAMES: Record<Language, string> = {
    ja: "日本語",
    en: "English",
    es: "Español"
};

const isLanguage = (value: string): value is Language => {
    const language_values: readonly string[] = LANGUAGES;
    const is_language: boolean = language_values.includes(value);
    return is_language;
};

export const LanguageSetting = (): JSX.Element => {
    const { language } = useSettingsState();
    const dispatchSettings: Dispatch<SettingsAction> = useSettingsDispatch();

    const changeLanguage = (change_event: ChangeEvent<HTMLSelectElement>): void => {
        const selected_value: string = change_event.target.value;
        const is_known_language = isLanguage(selected_value);
        if (is_known_language === true) {
            dispatchSettings({ type: "setLanguage", language: selected_value });
        }
    };

    const language_options: JSX.Element[] = LANGUAGES.map((option_language: Language): JSX.Element => {
        const option_element: JSX.Element = (
            <option key={option_language} value={option_language}>
                {LANGUAGE_NATIVE_NAMES[option_language]}
            </option>
        );
        return option_element;
    });

    const setting_element: JSX.Element = (
        <label className={styles.setting_row}>
            <span className={styles.setting_label}>
                <TranslatedText translation_key="settings.language" />
            </span>
            <select className={styles.select} value={language} onChange={changeLanguage}>
                {language_options}
            </select>
        </label>
    );
    return setting_element;
};
