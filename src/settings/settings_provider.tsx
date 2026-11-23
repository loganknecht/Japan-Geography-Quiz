import { type JSX, type ReactNode, useEffect, useReducer } from "react";

import { applyLanguage, applyThemePreference } from "./apply_settings_to_page";
import { SettingsDispatchContext, SettingsStateContext } from "./settings_context";
import { settingsReducer } from "./settings_reducer";
import { loadStoredSettings, saveSettings } from "./settings_storage";

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps): JSX.Element => {
    const [settings_state, dispatchSettings] = useReducer(settingsReducer, null, loadStoredSettings);

    useEffect((): void => {
        saveSettings(settings_state);
        applyThemePreference(settings_state.theme_preference);
        applyLanguage(settings_state.language);
    }, [settings_state]);

    const provider_element: JSX.Element = (
        <SettingsStateContext value={settings_state}>
            <SettingsDispatchContext value={dispatchSettings}>{children}</SettingsDispatchContext>
        </SettingsStateContext>
    );
    return provider_element;
};
