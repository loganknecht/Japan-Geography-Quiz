import type { JSX } from "react";

import { FURIGANA_MARKUP_SPLIT_PATTERN, FURIGANA_SEGMENT_PATTERN } from "../i18n/furigana_markup";
import { useSettingsState } from "../settings/settings_context";

interface FuriganaTextProps {
    text: string;
}

export const FuriganaText = ({ text }: FuriganaTextProps): JSX.Element => {
    const { is_furigana_enabled, language } = useSettingsState();
    const should_show_furigana = is_furigana_enabled === true && language === "ja";
    const text_segments: string[] = text.split(FURIGANA_MARKUP_SPLIT_PATTERN);

    const segment_elements: JSX.Element[] = text_segments.map((segment: string, segment_index: number): JSX.Element => {
        const furigana_match: RegExpExecArray | null = FURIGANA_SEGMENT_PATTERN.exec(segment);
        const is_plain_segment = furigana_match === null;
        if (is_plain_segment === true) {
            const plain_element: JSX.Element = <span key={segment_index}>{segment}</span>;
            return plain_element;
        }
        const kanji_text: string = furigana_match[1];
        const reading_text: string = furigana_match[2];
        const ruby_element: JSX.Element =
            should_show_furigana === true ? (
                <ruby key={segment_index}>
                    {kanji_text}
                    <rt>{reading_text}</rt>
                </ruby>
            ) : (
                <span key={segment_index}>{kanji_text}</span>
            );
        return ruby_element;
    });

    const furigana_element: JSX.Element = <>{segment_elements}</>;
    return furigana_element;
};
