import type ja_translations from "./locales/ja.json";

export type TranslationKey = keyof typeof ja_translations;

export type Translations = Record<TranslationKey, string>;
