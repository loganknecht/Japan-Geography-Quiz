import type { Region } from "./place_types";

export const REGIONS_SOUTH_TO_NORTH: readonly Region[] = [
    { id: "kyushu", name: { kanji: "九州地方", reading: "きゅうしゅうちほう", romaji: "Kyūshū" } },
    { id: "shikoku", name: { kanji: "四国地方", reading: "しこくちほう", romaji: "Shikoku" } },
    { id: "chugoku", name: { kanji: "中国地方", reading: "ちゅうごくちほう", romaji: "Chūgoku" } },
    { id: "kinki", name: { kanji: "近畿地方", reading: "きんきちほう", romaji: "Kinki" } },
    { id: "chubu", name: { kanji: "中部地方", reading: "ちゅうぶちほう", romaji: "Chūbu" } },
    { id: "kanto", name: { kanji: "関東地方", reading: "かんとうちほう", romaji: "Kantō" } },
    { id: "tohoku", name: { kanji: "東北地方", reading: "とうほくちほう", romaji: "Tōhoku" } },
    { id: "hokkaido", name: { kanji: "北海道地方", reading: "ほっかいどうちほう", romaji: "Hokkaidō" } }
];
