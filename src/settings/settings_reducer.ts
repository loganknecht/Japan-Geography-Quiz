import type { SettingsAction, SettingsState } from "./settings_types";

export const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
    let next_state: SettingsState = state;
    switch (action.type) {
        case "setLanguage": {
            next_state = { ...state, language: action.language };
            break;
        }
        case "setThemePreference": {
            next_state = { ...state, theme_preference: action.theme_preference };
            break;
        }
        case "setToggle": {
            next_state = { ...state, [action.setting_name]: action.is_enabled };
            break;
        }
    }
    return next_state;
};
