import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { TranslationKey } from "../i18n/translation_key";
import { FuriganaText } from "./furigana_text";

interface TranslatedTextProps {
    translation_key: TranslationKey;
}

export const TranslatedText = ({ translation_key }: TranslatedTextProps): JSX.Element => {
    const { t } = useTranslation();
    const translated_text: string = t(translation_key);
    const text_element: JSX.Element = <FuriganaText text={translated_text} />;
    return text_element;
};
