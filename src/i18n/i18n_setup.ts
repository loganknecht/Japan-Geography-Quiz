import i18next, { type i18n } from "i18next";
import { initReactI18next } from "react-i18next";

import { loadStoredSettings } from "../settings/settings_storage";
import type { SettingsState } from "../settings/settings_types";
import en_translations from "./locales/en.json";
import es_translations from "./locales/es.json";
import ja_translations from "./locales/ja.json";
import type { Translations } from "./translation_key";

const JAPANESE_TRANSLATIONS: Translations = ja_translations;
const ENGLISH_TRANSLATIONS: Translations = en_translations;
const SPANISH_TRANSLATIONS: Translations = es_translations;

const stored_settings: SettingsState = loadStoredSettings();
const react_i18n_instance: i18n = i18next.use(initReactI18next);

void react_i18n_instance.init({
    lng: stored_settings.language,
    fallbackLng: "ja",
    keySeparator: false,
    interpolation: { escapeValue: false },
    resources: {
        ja: { translation: JAPANESE_TRANSLATIONS },
        en: { translation: ENGLISH_TRANSLATIONS },
        es: { translation: SPANISH_TRANSLATIONS }
    }
});
