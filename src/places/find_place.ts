import { ISLANDS_SOUTH_TO_NORTH } from "./islands";
import type { Island, IslandId, Region, RegionId } from "./place_types";
import { REGIONS_SOUTH_TO_NORTH } from "./regions";

const throwUnknownPlaceError = (place_id: string): never => {
    const unknown_place_error: Error = new Error(`No place exists with id "${place_id}"`);
    throw unknown_place_error;
};

export const findIsland = (island_id: IslandId): Island => {
    const matching_island: Island | undefined = ISLANDS_SOUTH_TO_NORTH.find((island: Island): boolean => {
        const is_matching_island: boolean = island.id === island_id;
        return is_matching_island;
    });
    const found_island: Island = matching_island ?? throwUnknownPlaceError(island_id);
    return found_island;
};

export const findRegion = (region_id: RegionId): Region => {
    const matching_region: Region | undefined = REGIONS_SOUTH_TO_NORTH.find((region: Region): boolean => {
        const is_matching_region: boolean = region.id === region_id;
        return is_matching_region;
    });
    const found_region: Region = matching_region ?? throwUnknownPlaceError(region_id);
    return found_region;
};
