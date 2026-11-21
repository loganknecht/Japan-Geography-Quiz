import type { JSX } from "react";

import { TranslatedText } from "../../components/translated_text";
import { useSettingsState } from "../settings_context";
import { InsetSideSetting } from "./inset_side_setting";
import { LanguageSetting } from "./language_setting";
import styles from "./settings_form.module.css";
import { ThemeSetting } from "./theme_setting";
import { ToggleSetting } from "./toggle_setting";

export const SettingsForm = (): JSX.Element => {
    const { language } = useSettingsState();
    const is_furigana_unavailable = language !== "ja";

    const form_element: JSX.Element = (
        <div className={styles.form}>
            <LanguageSetting />
            <ToggleSetting
                setting_name="is_furigana_enabled"
                label_key="settings.furigana"
                hint_key="settings.furigana_japanese_only"
                is_disabled={is_furigana_unavailable}
            />
            <ToggleSetting setting_name="is_sound_enabled" label_key="settings.sound" />
            <ThemeSetting />
            <ToggleSetting
                setting_name="should_skip_failed_answer_confirmation"
                label_key="settings.skip_failed_answer_confirmation"
            />
            <InsetSideSetting />
            <div className={styles.setting_row}>
                <span className={styles.setting_label}>
                    <TranslatedText translation_key="settings.borders" />
                </span>
                <div className={styles.border_toggles}>
                    <ToggleSetting setting_name="is_island_border_visible" label_key="settings.island_borders" />
                    <ToggleSetting setting_name="is_region_border_visible" label_key="settings.region_borders" />
                    <ToggleSetting
                        setting_name="is_prefecture_border_visible"
                        label_key="settings.prefecture_borders"
                    />
                </div>
            </div>
            <ToggleSetting setting_name="is_flag_visible" label_key="settings.flags" />
            <ToggleSetting setting_name="is_local_flavor_visible" label_key="settings.local_flavor" />
        </div>
    );
    return form_element;
};
