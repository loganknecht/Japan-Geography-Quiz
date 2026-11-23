import { type Context, createContext, type Dispatch, useContext } from "react";

import { throwMissingProviderError } from "../utilities/throw_missing_provider_error";
import type { SettingsAction, SettingsState } from "./settings_types";

export const SettingsStateContext: Context<SettingsState | null> = createContext<SettingsState | null>(null);

export const SettingsDispatchContext: Context<Dispatch<SettingsAction> | null> =
    createContext<Dispatch<SettingsAction> | null>(null);

export const useSettingsState = (): SettingsState => {
    const settings_state: SettingsState | null = useContext(SettingsStateContext);
    const provided_settings_state: SettingsState = settings_state ?? throwMissingProviderError("SettingsProvider");
    return provided_settings_state;
};

export const useSettingsDispatch = (): Dispatch<SettingsAction> => {
    const dispatchSettings: Dispatch<SettingsAction> | null = useContext(SettingsDispatchContext);
    const providedDispatchSettings: Dispatch<SettingsAction> =
        dispatchSettings ?? throwMissingProviderError("SettingsProvider");
    return providedDispatchSettings;
};
