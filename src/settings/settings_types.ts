export type Language = "ja" | "en" | "es";

export type ThemePreference = "system" | "light" | "dark";

export type InsetSide = "left" | "right";

export type ToggleSettingName =
    | "is_furigana_enabled"
    | "is_sound_enabled"
    | "should_skip_failed_answer_confirmation"
    | "is_island_border_visible"
    | "is_region_border_visible"
    | "is_prefecture_border_visible"
    | "is_flag_visible"
    | "is_local_flavor_visible";

export interface SettingsState {
    language: Language;
    theme_preference: ThemePreference;
    inset_side: InsetSide;
    is_furigana_enabled: boolean;
    is_sound_enabled: boolean;
    should_skip_failed_answer_confirmation: boolean;
    is_island_border_visible: boolean;
    is_region_border_visible: boolean;
    is_prefecture_border_visible: boolean;
    is_flag_visible: boolean;
    is_local_flavor_visible: boolean;
}

export type SettingsAction =
    | { type: "setLanguage"; language: Language }
    | { type: "setThemePreference"; theme_preference: ThemePreference }
    | { type: "setInsetSide"; inset_side: InsetSide }
    | { type: "setToggle"; setting_name: ToggleSettingName; is_enabled: boolean };

export const LANGUAGES: readonly Language[] = ["ja", "en", "es"];

export const THEME_PREFERENCES: readonly ThemePreference[] = ["system", "light", "dark"];

export const INSET_SIDES: readonly InsetSide[] = ["left", "right"];
