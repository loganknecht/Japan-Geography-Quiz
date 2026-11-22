import { findIsland, findPrefecture, findRegion } from "../places/find_place";
import type {
    Island,
    IslandId,
    PlaceId,
    PlaceName,
    Prefecture,
    PrefectureId,
    Region,
    RegionId
} from "../places/place_types";
import type { QuizType } from "./quiz_setup_types";

export const findQuizPlaceId = (prefecture: Prefecture, quiz_type: QuizType): PlaceId => {
    let place_id: PlaceId = prefecture.id;
    switch (quiz_type) {
        case "islands": {
            place_id = prefecture.island_id;
            break;
        }
        case "regions": {
            place_id = prefecture.region_id;
            break;
        }
        case "prefectures": {
            break;
        }
    }
    return place_id;
};

export const findQuizPlaceName = (place_id: PlaceId, quiz_type: QuizType): PlaceName => {
    let place_name: PlaceName;
    switch (quiz_type) {
        case "islands": {
            const island: Island = findIsland(place_id as IslandId);
            place_name = island.name;
            break;
        }
        case "regions": {
            const region: Region = findRegion(place_id as RegionId);
            place_name = region.name;
            break;
        }
        case "prefectures": {
            const prefecture: Prefecture = findPrefecture(place_id as PrefectureId);
            place_name = prefecture.name;
            break;
        }
    }
    return place_name;
};
