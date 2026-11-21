import { detectBrowserLanguage } from "./detect_browser_language";
import { INSET_SIDES, LANGUAGES, type SettingsState, THEME_PREFERENCES } from "./settings_types";

const SETTINGS_STORAGE_KEY: string = "japan-geography-quiz.settings";

const BOOLEAN_VALUES: readonly boolean[] = [true, false];

export const createDefaultSettings = (): SettingsState => {
    const default_settings: SettingsState = {
        language: detectBrowserLanguage(),
        theme_preference: "system",
        inset_side: "left",
        is_furigana_enabled: false,
        is_sound_enabled: true,
        should_skip_failed_answer_confirmation: false,
        is_island_border_visible: true,
        is_region_border_visible: true,
        is_prefecture_border_visible: true,
        is_flag_visible: true,
        is_local_flavor_visible: false
    };
    return default_settings;
};

const readStoredSettingValues = (): Record<string, unknown> => {
    const empty_setting_values: Record<string, unknown> = {};
    try {
        const stored_settings_text: string | null = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
        const is_nothing_stored = stored_settings_text === null;
        if (is_nothing_stored === true) {
            return empty_setting_values;
        }
        const parsed_settings: unknown = JSON.parse(stored_settings_text);
        const is_settings_object = typeof parsed_settings === "object" && parsed_settings !== null;
        if (is_settings_object === false) {
            return empty_setting_values;
        }
        const stored_setting_values: Record<string, unknown> = parsed_settings as Record<string, unknown>;
        return stored_setting_values;
    } catch {
        return empty_setting_values;
    }
};

const pickAllowedValue = <TValue>(
    stored_value: unknown,
    allowed_values: readonly TValue[],
    default_value: TValue
): TValue => {
    const is_allowed_value: boolean = allowed_values.includes(stored_value as TValue);
    const picked_value: TValue = is_allowed_value === true ? (stored_value as TValue) : default_value;
    return picked_value;
};

export const loadStoredSettings = (): SettingsState => {
    const default_settings: SettingsState = createDefaultSettings();
    const stored_values: Record<string, unknown> = readStoredSettingValues();
    const loaded_settings: SettingsState = {
        language: pickAllowedValue(stored_values.language, LANGUAGES, default_settings.language),
        theme_preference: pickAllowedValue(
            stored_values.theme_preference,
            THEME_PREFERENCES,
            default_settings.theme_preference
        ),
        inset_side: pickAllowedValue(stored_values.inset_side, INSET_SIDES, default_settings.inset_side),
        is_furigana_enabled: pickAllowedValue(
            stored_values.is_furigana_enabled,
            BOOLEAN_VALUES,
            default_settings.is_furigana_enabled
        ),
        is_sound_enabled: pickAllowedValue(
            stored_values.is_sound_enabled,
            BOOLEAN_VALUES,
            default_settings.is_sound_enabled
        ),
        should_skip_failed_answer_confirmation: pickAllowedValue(
            stored_values.should_skip_failed_answer_confirmation,
            BOOLEAN_VALUES,
            default_settings.should_skip_failed_answer_confirmation
        ),
        is_island_border_visible: pickAllowedValue(
            stored_values.is_island_border_visible,
            BOOLEAN_VALUES,
            default_settings.is_island_border_visible
        ),
        is_region_border_visible: pickAllowedValue(
            stored_values.is_region_border_visible,
            BOOLEAN_VALUES,
            default_settings.is_region_border_visible
        ),
        is_prefecture_border_visible: pickAllowedValue(
            stored_values.is_prefecture_border_visible,
            BOOLEAN_VALUES,
            default_settings.is_prefecture_border_visible
        ),
        is_flag_visible: pickAllowedValue(
            stored_values.is_flag_visible,
            BOOLEAN_VALUES,
            default_settings.is_flag_visible
        ),
        is_local_flavor_visible: pickAllowedValue(
            stored_values.is_local_flavor_visible,
            BOOLEAN_VALUES,
            default_settings.is_local_flavor_visible
        )
    };
    return loaded_settings;
};

export const saveSettings = (settings: SettingsState): boolean => {
    let was_saved: boolean = true;
    try {
        const settings_text: string = JSON.stringify(settings);
        window.localStorage.setItem(SETTINGS_STORAGE_KEY, settings_text);
    } catch {
        was_saved = false;
    }
    return was_saved;
};
