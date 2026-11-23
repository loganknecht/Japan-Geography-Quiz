import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { TranslationKey } from "../i18n/translation_key";
import type { PlaceName } from "../places/place_types";
import { useSettingsState } from "../settings/settings_context";
import { FuriganaText } from "./furigana_text";

interface LayerPlaceNameTextProps {
    place_name: PlaceName;
    template_key: TranslationKey;
}

export const LayerPlaceNameText = ({ place_name, template_key }: LayerPlaceNameTextProps): JSX.Element => {
    const { t } = useTranslation();
    const { language } = useSettingsState();
    const is_japanese = language === "ja";
    const furigana_markup: string = `[${place_name.kanji}|${place_name.reading}]`;
    const display_name: string = is_japanese === true ? furigana_markup : place_name.romaji;
    const display_text: string = t(template_key, { name: display_name });
    const name_element: JSX.Element = <FuriganaText text={display_text} />;
    return name_element;
};
