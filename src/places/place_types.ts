export type IslandId = "okinawa" | "kyushu" | "shikoku" | "honshu" | "hokkaido";

export type RegionId = "kyushu" | "shikoku" | "chugoku" | "kinki" | "chubu" | "kanto" | "tohoku" | "hokkaido";

export type PrefectureId =
    | "hokkaido"
    | "aomori"
    | "iwate"
    | "miyagi"
    | "akita"
    | "yamagata"
    | "fukushima"
    | "ibaraki"
    | "tochigi"
    | "gunma"
    | "saitama"
    | "chiba"
    | "tokyo"
    | "kanagawa"
    | "niigata"
    | "toyama"
    | "ishikawa"
    | "fukui"
    | "yamanashi"
    | "nagano"
    | "gifu"
    | "shizuoka"
    | "aichi"
    | "mie"
    | "shiga"
    | "kyoto"
    | "osaka"
    | "hyogo"
    | "nara"
    | "wakayama"
    | "tottori"
    | "shimane"
    | "okayama"
    | "hiroshima"
    | "yamaguchi"
    | "tokushima"
    | "kagawa"
    | "ehime"
    | "kochi"
    | "fukuoka"
    | "saga"
    | "nagasaki"
    | "kumamoto"
    | "oita"
    | "miyazaki"
    | "kagoshima"
    | "okinawa";

export interface PlaceName {
    kanji: string;
    reading: string;
    romaji: string;
}

export interface Island {
    id: IslandId;
    name: PlaceName;
    region_ids: RegionId[];
}

export interface Region {
    id: RegionId;
    name: PlaceName;
}

export interface Prefecture {
    id: PrefectureId;
    code: string;
    name: PlaceName;
    island_id: IslandId;
    region_id: RegionId;
}
