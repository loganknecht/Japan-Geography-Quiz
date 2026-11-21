import type { JSX } from "react";

import type { PlaceName } from "../places/place_types";
import { useSettingsState } from "../settings/settings_context";
import { FuriganaText } from "./furigana_text";

interface PlaceNameTextProps {
    place_name: PlaceName;
}

export const PlaceNameText = ({ place_name }: PlaceNameTextProps): JSX.Element => {
    const { language } = useSettingsState();
    const is_japanese = language === "ja";
    const furigana_markup: string = `[${place_name.kanji}|${place_name.reading}]`;
    const display_text: string = is_japanese === true ? furigana_markup : place_name.romaji;
    const place_name_element: JSX.Element = <FuriganaText text={display_text} />;
    return place_name_element;
};
