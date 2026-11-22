import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { RegionId } from "../src/places/place_types.ts";
import { PREFECTURES_NORTH_TO_SOUTH } from "../src/places/prefectures.ts";

type Position = [number, number];

type Ring = Position[];

type PolygonCoordinates = Ring[];

type MapArea = "main" | "inset";

interface PolygonGeometry {
    type: "Polygon";
    coordinates: PolygonCoordinates;
}

interface MultiPolygonGeometry {
    type: "MultiPolygon";
    coordinates: PolygonCoordinates[];
}

interface PrefectureFeature {
    properties: Record<string, string>;
    geometry: PolygonGeometry | MultiPolygonGeometry;
}

interface PrefectureFeatureCollection {
    features: PrefectureFeature[];
}

interface LineStringGeometry {
    type: "LineString";
    coordinates: Ring;
}

interface MultiLineStringGeometry {
    type: "MultiLineString";
    coordinates: Ring[];
}

interface LineFeature {
    geometry: LineStringGeometry | MultiLineStringGeometry;
}

interface LineFeatureCollection {
    features: LineFeature[];
}

interface ProjectedPolygon {
    prefecture_code: string;
    map_area: MapArea;
    rings: Ring[];
}

interface Bounds {
    min_x: number;
    min_y: number;
    max_x: number;
    max_y: number;
}

interface InsetData {
    width: number;
    height: number;
    paths: Record<string, string>;
}

interface Placement {
    origin_x: number;
    origin_y: number;
    scale: number;
    offset_x: number;
    offset_y: number;
}

interface Pointer {
    x: number;
    y: number;
    angle: number;
    length: number;
}

interface PrefectureMapData {
    width: number;
    height: number;
    inset: InsetData;
    pointer: Pointer;
    paths: Record<string, string>;
    region_lines: string;
}

const OUTPUT_PATH: string = "src/map/prefecture_map_data.json";
const SIMPLIFY_PERCENTAGE: string = "1%";
const MAIN_MAP_WIDTH: number = 1000;
const COORDINATE_SCALE: number = 10;
const INSET_FRAME_PADDING: number = 8;
const INSET_SCALE: number = 0.975;
const CANVAS_MARGIN: number = 12;
const POINTER_LENGTH: number = 50;
const POINTER_GAP: number = 14;
const POINTER_FROM: Position = [130.5, 30.3];
const POINTER_TOWARD: Position = [127.8, 26.5];
const INSET_MIN_LONGITUDE: number = 122.5;
const INSET_MAX_LONGITUDE: number = 130.6;
const INSET_MIN_LATITUDE: number = 23.9;
const INSET_MAX_LATITUDE: number = 30.05;
const MAIN_MIN_LONGITUDE: number = 128;
const MAIN_MAX_LONGITUDE: number = 149.5;
const MAIN_MIN_LATITUDE: number = 30.05;
const MAIN_MAX_LATITUDE: number = 46;
const DEGREES_TO_RADIANS: number = Math.PI / 180;

const PREFECTURE_CODE_PROPERTY: string = "N03_007";

const throwMissingCodeError = (): never => {
    const missing_code_error: Error = new Error(`A feature has no ${PREFECTURE_CODE_PROPERTY} property`);
    throw missing_code_error;
};

const throwUsageError = (): never => {
    const usage_error: Error = new Error("Usage: yarn map:build <path to N03 prefecture .shp file>");
    throw usage_error;
};

const buildRegionExpression = (): string => {
    const region_by_code: Record<string, RegionId> = {};
    for (const prefecture of PREFECTURES_NORTH_TO_SOUTH) {
        region_by_code[prefecture.code] = prefecture.region_id;
    }
    const region_table_text: string = JSON.stringify(region_by_code);
    const region_expression: string = `region_id = (${region_table_text})[N03_007.slice(0, 2)]`;
    return region_expression;
};

const simplifyShapefile = (shapefile_path: string, output_directory: string): void => {
    const mapshaper_arguments: string[] = [
        "mapshaper",
        "-i",
        shapefile_path,
        "-dissolve",
        "N03_001",
        "copy-fields=N03_007",
        "name=prefectures",
        "-simplify",
        SIMPLIFY_PERCENTAGE,
        "keep-shapes",
        "weighted",
        "-each",
        buildRegionExpression(),
        "-dissolve",
        "region_id",
        "+",
        "name=regions",
        "-innerlines",
        "+",
        "name=region_lines",
        "-o",
        output_directory,
        "target=prefectures,region_lines",
        "format=geojson",
        "geojson-type=FeatureCollection",
        "precision=0.0001"
    ];
    execFileSync("yarn", mapshaper_arguments, { stdio: "inherit" });
};

const findRingBounds = (ring: Ring): Bounds => {
    const x_values: number[] = ring.map((position: Position): number => {
        const x_value: number = position[0];
        return x_value;
    });
    const y_values: number[] = ring.map((position: Position): number => {
        const y_value: number = position[1];
        return y_value;
    });
    const ring_bounds: Bounds = {
        min_x: Math.min(...x_values),
        min_y: Math.min(...y_values),
        max_x: Math.max(...x_values),
        max_y: Math.max(...y_values)
    };
    return ring_bounds;
};

const mergeBounds = (first_bounds: Bounds, second_bounds: Bounds): Bounds => {
    const merged_bounds: Bounds = {
        min_x: Math.min(first_bounds.min_x, second_bounds.min_x),
        min_y: Math.min(first_bounds.min_y, second_bounds.min_y),
        max_x: Math.max(first_bounds.max_x, second_bounds.max_x),
        max_y: Math.max(first_bounds.max_y, second_bounds.max_y)
    };
    return merged_bounds;
};

const findMapArea = (outer_ring: Ring): MapArea | null => {
    const ring_bounds: Bounds = findRingBounds(outer_ring);
    const center_longitude: number = (ring_bounds.min_x + ring_bounds.max_x) / 2;
    const center_latitude: number = (ring_bounds.min_y + ring_bounds.max_y) / 2;
    const is_inside_inset_longitudes =
        center_longitude >= INSET_MIN_LONGITUDE && center_longitude <= INSET_MAX_LONGITUDE;
    const is_inside_inset_latitudes = center_latitude >= INSET_MIN_LATITUDE && center_latitude < INSET_MAX_LATITUDE;
    const is_inside_main_longitudes = center_longitude >= MAIN_MIN_LONGITUDE && center_longitude <= MAIN_MAX_LONGITUDE;
    const is_inside_main_latitudes = center_latitude >= MAIN_MIN_LATITUDE && center_latitude <= MAIN_MAX_LATITUDE;
    const is_inset_polygon = is_inside_inset_longitudes === true && is_inside_inset_latitudes === true;
    const is_main_polygon = is_inside_main_longitudes === true && is_inside_main_latitudes === true;
    let map_area: MapArea | null = null;
    if (is_inset_polygon === true) {
        map_area = "inset";
    } else if (is_main_polygon === true) {
        map_area = "main";
    }
    return map_area;
};

const projectPosition = (position: Position): Position => {
    const longitude_radians: number = position[0] * DEGREES_TO_RADIANS;
    const latitude_radians: number = position[1] * DEGREES_TO_RADIANS;
    const mercator_y: number = Math.log(Math.tan(Math.PI / 4 + latitude_radians / 2));
    const projected_position: Position = [longitude_radians, -mercator_y];
    return projected_position;
};

const projectRing = (ring: Ring): Ring => {
    const projected_ring: Ring = ring.map(projectPosition);
    return projected_ring;
};

const listPolygons = (feature: PrefectureFeature): PolygonCoordinates[] => {
    const is_single_polygon = feature.geometry.type === "Polygon";
    const polygons: PolygonCoordinates[] =
        is_single_polygon === true
            ? [feature.geometry.coordinates as PolygonCoordinates]
            : (feature.geometry.coordinates as PolygonCoordinates[]);
    return polygons;
};

const projectFeature = (feature: PrefectureFeature): ProjectedPolygon[] => {
    const municipality_code: string = feature.properties[PREFECTURE_CODE_PROPERTY] ?? throwMissingCodeError();
    const prefecture_code: string = municipality_code.slice(0, 2);
    const projected_polygons: ProjectedPolygon[] = [];
    for (const polygon of listPolygons(feature)) {
        const outer_ring: Ring = polygon[0] ?? [];
        const map_area: MapArea | null = findMapArea(outer_ring);
        const is_drawn_polygon = map_area !== null;
        if (is_drawn_polygon === true) {
            const projected_rings: Ring[] = polygon.map(projectRing);
            projected_polygons.push({ prefecture_code: prefecture_code, map_area: map_area, rings: projected_rings });
        }
    }
    return projected_polygons;
};

const findAreaBounds = (polygons: ProjectedPolygon[]): Bounds => {
    const outer_ring_bounds: Bounds[] = polygons.map((polygon: ProjectedPolygon): Bounds => {
        const outer_ring: Ring = polygon.rings[0] ?? [];
        const ring_bounds: Bounds = findRingBounds(outer_ring);
        return ring_bounds;
    });
    const first_bounds: Bounds = outer_ring_bounds[0] ?? { min_x: 0, min_y: 0, max_x: 0, max_y: 0 };
    const area_bounds: Bounds = outer_ring_bounds.reduce(mergeBounds, first_bounds);
    return area_bounds;
};

const roundCoordinate = (coordinate: number): number => {
    const rounded_coordinate: number = Math.round(coordinate * COORDINATE_SCALE) / COORDINATE_SCALE;
    return rounded_coordinate;
};

const placePosition = (position: Position, placement: Placement): Position => {
    const x: number = (position[0] - placement.origin_x) * placement.scale + placement.offset_x;
    const y: number = (position[1] - placement.origin_y) * placement.scale + placement.offset_y;
    const placed_position: Position = [x, y];
    return placed_position;
};

const buildRingPath = (ring: Ring, placement: Placement): string => {
    const point_texts: string[] = [];
    let previous_point_text: string = "";
    for (const position of ring) {
        const placed_position: Position = placePosition(position, placement);
        const x: number = roundCoordinate(placed_position[0]);
        const y: number = roundCoordinate(placed_position[1]);
        const point_text: string = `${String(x)} ${String(y)}`;
        const is_repeated_point = point_text === previous_point_text;
        if (is_repeated_point === false) {
            point_texts.push(point_text);
        }
        previous_point_text = point_text;
    }
    const ring_path: string = `M${point_texts.join("L")}Z`;
    return ring_path;
};

const addPaths = (paths: Record<string, string>, polygons: ProjectedPolygon[], placement: Placement): void => {
    for (const polygon of polygons) {
        const ring_paths: string[] = polygon.rings.map((ring: Ring): string => {
            const ring_path: string = buildRingPath(ring, placement);
            return ring_path;
        });
        const existing_path: string = paths[polygon.prefecture_code] ?? "";
        paths[polygon.prefecture_code] = `${existing_path}${ring_paths.join("")}`;
    }
};

const listLines = (feature: LineFeature): Ring[] => {
    const is_single_line = feature.geometry.type === "LineString";
    const lines: Ring[] =
        is_single_line === true ? [feature.geometry.coordinates as Ring] : (feature.geometry.coordinates as Ring[]);
    return lines;
};

const buildLinePath = (line: Ring, placement: Placement): string => {
    const point_texts: string[] = line.map((position: Position): string => {
        const placed_position: Position = placePosition(projectPosition(position), placement);
        const point_text: string = `${String(roundCoordinate(placed_position[0]))} ${String(roundCoordinate(placed_position[1]))}`;
        return point_text;
    });
    const line_path: string = `M${point_texts.join("L")}`;
    return line_path;
};

const buildRegionLines = (line_collection: LineFeatureCollection, placement: Placement): string => {
    const lines: Ring[] = line_collection.features.flatMap(listLines);
    const line_paths: string[] = lines.map((line: Ring): string => {
        const line_path: string = buildLinePath(line, placement);
        return line_path;
    });
    const region_lines: string = line_paths.join("");
    return region_lines;
};

const buildPointer = (main_placement: Placement, main_bottom: number): Pointer => {
    const from_position: Position = placePosition(projectPosition(POINTER_FROM), main_placement);
    const toward_position: Position = placePosition(projectPosition(POINTER_TOWARD), main_placement);
    const angle_radians: number = Math.atan2(
        toward_position[1] - from_position[1],
        toward_position[0] - from_position[0]
    );
    const pointer: Pointer = {
        x: roundCoordinate(from_position[0]),
        y: roundCoordinate(main_bottom + POINTER_GAP),
        angle: roundCoordinate(angle_radians / DEGREES_TO_RADIANS),
        length: POINTER_LENGTH
    };
    return pointer;
};

const buildPrefectureMap = (): void => {
    const shapefile_path: string = process.argv[2] ?? throwUsageError();
    const temporary_directory: string = mkdtempSync(join(tmpdir(), "prefecture-map-"));
    simplifyShapefile(shapefile_path, temporary_directory);

    const prefectures_text: string = readFileSync(join(temporary_directory, "prefectures.json"), "utf8");
    const region_lines_text: string = readFileSync(join(temporary_directory, "region_lines.json"), "utf8");
    const feature_collection: PrefectureFeatureCollection = JSON.parse(prefectures_text) as PrefectureFeatureCollection;
    const region_line_collection: LineFeatureCollection = JSON.parse(region_lines_text) as LineFeatureCollection;
    rmSync(temporary_directory, { recursive: true });

    const projected_polygons: ProjectedPolygon[] = feature_collection.features.flatMap(projectFeature);
    const main_polygons: ProjectedPolygon[] = projected_polygons.filter((polygon: ProjectedPolygon): boolean => {
        const is_main_polygon: boolean = polygon.map_area === "main";
        return is_main_polygon;
    });
    const inset_polygons: ProjectedPolygon[] = projected_polygons.filter((polygon: ProjectedPolygon): boolean => {
        const is_inset_polygon: boolean = polygon.map_area === "inset";
        return is_inset_polygon;
    });

    const main_bounds: Bounds = findAreaBounds(main_polygons);
    const inset_bounds: Bounds = findAreaBounds(inset_polygons);
    const main_scale: number = MAIN_MAP_WIDTH / (main_bounds.max_x - main_bounds.min_x);
    const main_height: number = (main_bounds.max_y - main_bounds.min_y) * main_scale;
    const main_placement: Placement = {
        origin_x: main_bounds.min_x,
        origin_y: main_bounds.min_y,
        scale: main_scale,
        offset_x: CANVAS_MARGIN,
        offset_y: CANVAS_MARGIN
    };

    const inset_scale: number = main_scale * INSET_SCALE;
    const inset_padding: number = INSET_FRAME_PADDING * INSET_SCALE;
    const inset_placement: Placement = {
        origin_x: inset_bounds.min_x,
        origin_y: inset_bounds.min_y,
        scale: inset_scale,
        offset_x: inset_padding,
        offset_y: inset_padding
    };
    const inset_paths: Record<string, string> = {};
    addPaths(inset_paths, inset_polygons, inset_placement);
    const inset: InsetData = {
        width: roundCoordinate((inset_bounds.max_x - inset_bounds.min_x) * inset_scale + inset_padding * 2),
        height: roundCoordinate((inset_bounds.max_y - inset_bounds.min_y) * inset_scale + inset_padding * 2),
        paths: inset_paths
    };

    const main_bottom: number = CANVAS_MARGIN + main_height;
    const pointer: Pointer = buildPointer(main_placement, main_bottom);
    const pointer_bottom: number = pointer.y + Math.sin(pointer.angle * DEGREES_TO_RADIANS) * POINTER_LENGTH;
    const canvas_bottom: number = Math.max(main_bottom, pointer_bottom) + CANVAS_MARGIN;

    const paths: Record<string, string> = {};
    addPaths(paths, main_polygons, main_placement);
    const prefecture_map_data: PrefectureMapData = {
        width: roundCoordinate(MAIN_MAP_WIDTH + CANVAS_MARGIN * 2),
        height: roundCoordinate(canvas_bottom),
        inset: inset,
        pointer: pointer,
        paths: paths,
        region_lines: buildRegionLines(region_line_collection, main_placement)
    };
    const output_text: string = JSON.stringify(prefecture_map_data);
    writeFileSync(OUTPUT_PATH, output_text);
};

buildPrefectureMap();
