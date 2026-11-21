import type { Prefecture } from "./place_types";

export const PREFECTURES_NORTH_TO_SOUTH: readonly Prefecture[] = [
    {
        id: "hokkaido",
        code: "01",
        name: { kanji: "北海道", reading: "ほっかいどう", romaji: "Hokkaidō" },
        island_id: "hokkaido",
        region_id: "hokkaido"
    },
    {
        id: "aomori",
        code: "02",
        name: { kanji: "青森県", reading: "あおもりけん", romaji: "Aomori-ken" },
        island_id: "honshu",
        region_id: "tohoku"
    },
    {
        id: "iwate",
        code: "03",
        name: { kanji: "岩手県", reading: "いわてけん", romaji: "Iwate-ken" },
        island_id: "honshu",
        region_id: "tohoku"
    },
    {
        id: "miyagi",
        code: "04",
        name: { kanji: "宮城県", reading: "みやぎけん", romaji: "Miyagi-ken" },
        island_id: "honshu",
        region_id: "tohoku"
    },
    {
        id: "akita",
        code: "05",
        name: { kanji: "秋田県", reading: "あきたけん", romaji: "Akita-ken" },
        island_id: "honshu",
        region_id: "tohoku"
    },
    {
        id: "yamagata",
        code: "06",
        name: { kanji: "山形県", reading: "やまがたけん", romaji: "Yamagata-ken" },
        island_id: "honshu",
        region_id: "tohoku"
    },
    {
        id: "fukushima",
        code: "07",
        name: { kanji: "福島県", reading: "ふくしまけん", romaji: "Fukushima-ken" },
        island_id: "honshu",
        region_id: "tohoku"
    },
    {
        id: "ibaraki",
        code: "08",
        name: { kanji: "茨城県", reading: "いばらきけん", romaji: "Ibaraki-ken" },
        island_id: "honshu",
        region_id: "kanto"
    },
    {
        id: "tochigi",
        code: "09",
        name: { kanji: "栃木県", reading: "とちぎけん", romaji: "Tochigi-ken" },
        island_id: "honshu",
        region_id: "kanto"
    },
    {
        id: "gunma",
        code: "10",
        name: { kanji: "群馬県", reading: "ぐんまけん", romaji: "Gunma-ken" },
        island_id: "honshu",
        region_id: "kanto"
    },
    {
        id: "saitama",
        code: "11",
        name: { kanji: "埼玉県", reading: "さいたまけん", romaji: "Saitama-ken" },
        island_id: "honshu",
        region_id: "kanto"
    },
    {
        id: "chiba",
        code: "12",
        name: { kanji: "千葉県", reading: "ちばけん", romaji: "Chiba-ken" },
        island_id: "honshu",
        region_id: "kanto"
    },
    {
        id: "tokyo",
        code: "13",
        name: { kanji: "東京都", reading: "とうきょうと", romaji: "Tōkyō-to" },
        island_id: "honshu",
        region_id: "kanto"
    },
    {
        id: "kanagawa",
        code: "14",
        name: { kanji: "神奈川県", reading: "かながわけん", romaji: "Kanagawa-ken" },
        island_id: "honshu",
        region_id: "kanto"
    },
    {
        id: "niigata",
        code: "15",
        name: { kanji: "新潟県", reading: "にいがたけん", romaji: "Niigata-ken" },
        island_id: "honshu",
        region_id: "chubu"
    },
    {
        id: "toyama",
        code: "16",
        name: { kanji: "富山県", reading: "とやまけん", romaji: "Toyama-ken" },
        island_id: "honshu",
        region_id: "chubu"
    },
    {
        id: "ishikawa",
        code: "17",
        name: { kanji: "石川県", reading: "いしかわけん", romaji: "Ishikawa-ken" },
        island_id: "honshu",
        region_id: "chubu"
    },
    {
        id: "fukui",
        code: "18",
        name: { kanji: "福井県", reading: "ふくいけん", romaji: "Fukui-ken" },
        island_id: "honshu",
        region_id: "chubu"
    },
    {
        id: "yamanashi",
        code: "19",
        name: { kanji: "山梨県", reading: "やまなしけん", romaji: "Yamanashi-ken" },
        island_id: "honshu",
        region_id: "chubu"
    },
    {
        id: "nagano",
        code: "20",
        name: { kanji: "長野県", reading: "ながのけん", romaji: "Nagano-ken" },
        island_id: "honshu",
        region_id: "chubu"
    },
    {
        id: "gifu",
        code: "21",
        name: { kanji: "岐阜県", reading: "ぎふけん", romaji: "Gifu-ken" },
        island_id: "honshu",
        region_id: "chubu"
    },
    {
        id: "shizuoka",
        code: "22",
        name: { kanji: "静岡県", reading: "しずおかけん", romaji: "Shizuoka-ken" },
        island_id: "honshu",
        region_id: "chubu"
    },
    {
        id: "aichi",
        code: "23",
        name: { kanji: "愛知県", reading: "あいちけん", romaji: "Aichi-ken" },
        island_id: "honshu",
        region_id: "chubu"
    },
    {
        id: "mie",
        code: "24",
        name: { kanji: "三重県", reading: "みえけん", romaji: "Mie-ken" },
        island_id: "honshu",
        region_id: "kinki"
    },
    {
        id: "shiga",
        code: "25",
        name: { kanji: "滋賀県", reading: "しがけん", romaji: "Shiga-ken" },
        island_id: "honshu",
        region_id: "kinki"
    },
    {
        id: "kyoto",
        code: "26",
        name: { kanji: "京都府", reading: "きょうとふ", romaji: "Kyōto-fu" },
        island_id: "honshu",
        region_id: "kinki"
    },
    {
        id: "osaka",
        code: "27",
        name: { kanji: "大阪府", reading: "おおさかふ", romaji: "Ōsaka-fu" },
        island_id: "honshu",
        region_id: "kinki"
    },
    {
        id: "hyogo",
        code: "28",
        name: { kanji: "兵庫県", reading: "ひょうごけん", romaji: "Hyōgo-ken" },
        island_id: "honshu",
        region_id: "kinki"
    },
    {
        id: "nara",
        code: "29",
        name: { kanji: "奈良県", reading: "ならけん", romaji: "Nara-ken" },
        island_id: "honshu",
        region_id: "kinki"
    },
    {
        id: "wakayama",
        code: "30",
        name: { kanji: "和歌山県", reading: "わかやまけん", romaji: "Wakayama-ken" },
        island_id: "honshu",
        region_id: "kinki"
    },
    {
        id: "tottori",
        code: "31",
        name: { kanji: "鳥取県", reading: "とっとりけん", romaji: "Tottori-ken" },
        island_id: "honshu",
        region_id: "chugoku"
    },
    {
        id: "shimane",
        code: "32",
        name: { kanji: "島根県", reading: "しまねけん", romaji: "Shimane-ken" },
        island_id: "honshu",
        region_id: "chugoku"
    },
    {
        id: "okayama",
        code: "33",
        name: { kanji: "岡山県", reading: "おかやまけん", romaji: "Okayama-ken" },
        island_id: "honshu",
        region_id: "chugoku"
    },
    {
        id: "hiroshima",
        code: "34",
        name: { kanji: "広島県", reading: "ひろしまけん", romaji: "Hiroshima-ken" },
        island_id: "honshu",
        region_id: "chugoku"
    },
    {
        id: "yamaguchi",
        code: "35",
        name: { kanji: "山口県", reading: "やまぐちけん", romaji: "Yamaguchi-ken" },
        island_id: "honshu",
        region_id: "chugoku"
    },
    {
        id: "tokushima",
        code: "36",
        name: { kanji: "徳島県", reading: "とくしまけん", romaji: "Tokushima-ken" },
        island_id: "shikoku",
        region_id: "shikoku"
    },
    {
        id: "kagawa",
        code: "37",
        name: { kanji: "香川県", reading: "かがわけん", romaji: "Kagawa-ken" },
        island_id: "shikoku",
        region_id: "shikoku"
    },
    {
        id: "ehime",
        code: "38",
        name: { kanji: "愛媛県", reading: "えひめけん", romaji: "Ehime-ken" },
        island_id: "shikoku",
        region_id: "shikoku"
    },
    {
        id: "kochi",
        code: "39",
        name: { kanji: "高知県", reading: "こうちけん", romaji: "Kōchi-ken" },
        island_id: "shikoku",
        region_id: "shikoku"
    },
    {
        id: "fukuoka",
        code: "40",
        name: { kanji: "福岡県", reading: "ふくおかけん", romaji: "Fukuoka-ken" },
        island_id: "kyushu",
        region_id: "kyushu"
    },
    {
        id: "saga",
        code: "41",
        name: { kanji: "佐賀県", reading: "さがけん", romaji: "Saga-ken" },
        island_id: "kyushu",
        region_id: "kyushu"
    },
    {
        id: "nagasaki",
        code: "42",
        name: { kanji: "長崎県", reading: "ながさきけん", romaji: "Nagasaki-ken" },
        island_id: "kyushu",
        region_id: "kyushu"
    },
    {
        id: "kumamoto",
        code: "43",
        name: { kanji: "熊本県", reading: "くまもとけん", romaji: "Kumamoto-ken" },
        island_id: "kyushu",
        region_id: "kyushu"
    },
    {
        id: "oita",
        code: "44",
        name: { kanji: "大分県", reading: "おおいたけん", romaji: "Ōita-ken" },
        island_id: "kyushu",
        region_id: "kyushu"
    },
    {
        id: "miyazaki",
        code: "45",
        name: { kanji: "宮崎県", reading: "みやざきけん", romaji: "Miyazaki-ken" },
        island_id: "kyushu",
        region_id: "kyushu"
    },
    {
        id: "kagoshima",
        code: "46",
        name: { kanji: "鹿児島県", reading: "かごしまけん", romaji: "Kagoshima-ken" },
        island_id: "kyushu",
        region_id: "kyushu"
    },
    {
        id: "okinawa",
        code: "47",
        name: { kanji: "沖縄県", reading: "おきなわけん", romaji: "Okinawa-ken" },
        island_id: "okinawa",
        region_id: "kyushu"
    }
];
