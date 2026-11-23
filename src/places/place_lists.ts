import { ISLANDS_SOUTH_TO_NORTH } from "./islands";
import type { Island, IslandId, Region, RegionId } from "./place_types";
import { PREFECTURES_NORTH_TO_SOUTH } from "./prefectures";
import { REGIONS_SOUTH_TO_NORTH } from "./regions";

export const listIslandIds = (): IslandId[] => {
    const island_ids: IslandId[] = ISLANDS_SOUTH_TO_NORTH.map((island: Island): IslandId => {
        const island_id: IslandId = island.id;
        return island_id;
    });
    return island_ids;
};

export const listRegionIds = (): RegionId[] => {
    const region_ids: RegionId[] = REGIONS_SOUTH_TO_NORTH.map((region: Region): RegionId => {
        const region_id: RegionId = region.id;
        return region_id;
    });
    return region_ids;
};

export const findRegionHomeIsland = (region_id: RegionId): IslandId => {
    const prefecture_counts: Partial<Record<IslandId, number>> = {};
    let home_island_id: IslandId = "honshu";
    let home_island_count: number = 0;
    for (const prefecture of PREFECTURES_NORTH_TO_SOUTH) {
        const is_in_region = prefecture.region_id === region_id;
        if (is_in_region === false) {
            continue;
        }
        const island_count: number = (prefecture_counts[prefecture.island_id] ?? 0) + 1;
        prefecture_counts[prefecture.island_id] = island_count;
        const is_new_home = island_count > home_island_count;
        if (is_new_home === true) {
            home_island_id = prefecture.island_id;
            home_island_count = island_count;
        }
    }
    return home_island_id;
};

export const listHomeRegionIds = (island_id: IslandId): RegionId[] => {
    const region_ids: RegionId[] = listRegionIds();
    const home_region_ids: RegionId[] = region_ids.filter((region_id: RegionId): boolean => {
        const is_home_region: boolean = findRegionHomeIsland(region_id) === island_id;
        return is_home_region;
    });
    return home_region_ids;
};
