import type { Island } from "./place_types";

export const ISLANDS_SOUTH_TO_NORTH: readonly Island[] = [
    {
        id: "okinawa",
        name: { kanji: "沖縄", reading: "おきなわ", romaji: "Okinawa" },
        region_ids: ["kyushu"]
    },
    {
        id: "kyushu",
        name: { kanji: "九州", reading: "きゅうしゅう", romaji: "Kyūshū" },
        region_ids: ["kyushu"]
    },
    {
        id: "shikoku",
        name: { kanji: "四国", reading: "しこく", romaji: "Shikoku" },
        region_ids: ["shikoku"]
    },
    {
        id: "honshu",
        name: { kanji: "本州", reading: "ほんしゅう", romaji: "Honshū" },
        region_ids: ["chugoku", "kinki", "chubu", "kanto", "tohoku"]
    },
    {
        id: "hokkaido",
        name: { kanji: "北海道", reading: "ほっかいどう", romaji: "Hokkaidō" },
        region_ids: ["hokkaido"]
    }
];
