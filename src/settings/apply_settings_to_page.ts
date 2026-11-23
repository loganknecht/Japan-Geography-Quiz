import i18next from "i18next";

import type { Language, ThemePreference } from "./settings_types";

const THEME_ATTRIBUTE_NAME: string = "data-theme";

export const applyThemePreference = (theme_preference: ThemePreference): void => {
    const root_element: HTMLElement = document.documentElement;
    const is_following_system_theme = theme_preference === "system";
    if (is_following_system_theme === true) {
        root_element.removeAttribute(THEME_ATTRIBUTE_NAME);
        return;
    }
    root_element.setAttribute(THEME_ATTRIBUTE_NAME, theme_preference);
};

export const applyLanguage = (language: Language): void => {
    const root_element: HTMLElement = document.documentElement;
    root_element.lang = language;
    void i18next.changeLanguage(language);
};
