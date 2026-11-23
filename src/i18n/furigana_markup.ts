export const FURIGANA_MARKUP_SPLIT_PATTERN: RegExp = /(\[[^\]|]+\|[^\]]+\])/g;

export const FURIGANA_SEGMENT_PATTERN: RegExp = /^\[([^\]|]+)\|([^\]]+)\]$/;

const FURIGANA_MARKUP_REPLACE_PATTERN: RegExp = /\[([^\]|]+)\|[^\]]+\]/g;

export const removeFuriganaMarkup = (marked_up_text: string): string => {
    const plain_text: string = marked_up_text.replace(FURIGANA_MARKUP_REPLACE_PATTERN, "$1");
    return plain_text;
};
