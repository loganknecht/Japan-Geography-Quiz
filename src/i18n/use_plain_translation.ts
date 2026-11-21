import { useTranslation } from "react-i18next";

import { removeFuriganaMarkup } from "./furigana_markup";
import type { TranslationKey } from "./translation_key";

export const usePlainTranslation = (translation_key: TranslationKey): string => {
    const { t } = useTranslation();
    const translated_text: string = t(translation_key);
    const plain_text: string = removeFuriganaMarkup(translated_text);
    return plain_text;
};
