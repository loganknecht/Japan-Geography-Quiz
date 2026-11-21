export type IslandId = "okinawa" | "kyushu" | "shikoku" | "honshu" | "hokkaido";

export type RegionId = "kyushu" | "shikoku" | "chugoku" | "kinki" | "chubu" | "kanto" | "tohoku" | "hokkaido";

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
