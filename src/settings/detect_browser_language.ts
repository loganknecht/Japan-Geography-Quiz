import { type Language, LANGUAGES } from "./settings_types";

const FALLBACK_LANGUAGE: Language = "ja";

const toPrimaryLanguage = (language_tag: string): string => {
    const lowercase_language_tag: string = language_tag.toLowerCase();
    const language_tag_parts: string[] = lowercase_language_tag.split("-");
    const primary_language: string = language_tag_parts[0];
    return primary_language;
};

const isSupportedLanguage = (language: string): language is Language => {
    const supported_languages: readonly string[] = LANGUAGES;
    const is_supported_language: boolean = supported_languages.includes(language);
    return is_supported_language;
};

export const detectBrowserLanguage = (): Language => {
    const browser_language_tags: readonly string[] = navigator.languages;
    const primary_languages: string[] = browser_language_tags.map((language_tag: string): string => {
        const primary_language: string = toPrimaryLanguage(language_tag);
        return primary_language;
    });
    const first_supported_language: Language | undefined = primary_languages.find(isSupportedLanguage);
    const detected_language: Language = first_supported_language ?? FALLBACK_LANGUAGE;
    return detected_language;
};
