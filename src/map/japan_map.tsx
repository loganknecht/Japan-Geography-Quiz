import { type JSX, type MouseEvent, type PointerEvent, type RefObject, useRef, useState } from "react";

import { usePlainTranslation } from "../i18n/use_plain_translation";
import type { PrefectureId } from "../places/place_types";
import { PREFECTURES_NORTH_TO_SOUTH } from "../places/prefectures";
import type { QuizType } from "../quiz/quiz_setup_types";
import styles from "./japan_map.module.css";
import { PREFECTURE_MAP_DATA } from "./prefecture_map_data";
import type {
    InsetData,
    MapLabel,
    MapPoint,
    MapPointer,
    PrefectureFill,
    PrefectureMapData,
    ViewBox
} from "./prefecture_map_types";
import { useMapViewBox } from "./use_map_view_box";

interface InsetPointerProps {
    pointer: MapPointer;
    label_text: string;
}

const INSET_LABEL_INSET_X: number = 14;
const INSET_LABEL_INSET_Y: number = 34;
const POINTER_HEAD_LENGTH: number = 24;
const POINTER_HEAD_HALF_WIDTH: number = 15;
const POINTER_SHAFT_HALF_WIDTH: number = 6;
const POINTER_LABEL_GAP: number = 18;
const POINTER_LABEL_DROP: number = 8;
const POINTER_LABEL_POSITION: number = 0.6;
const DEGREES_TO_RADIANS: number = Math.PI / 180;

const InsetPointer = ({ pointer, label_text }: InsetPointerProps): JSX.Element => {
    const shaft_end: number = pointer.length - POINTER_HEAD_LENGTH;
    const arrow_points: string = [
        `0,${String(-POINTER_SHAFT_HALF_WIDTH)}`,
        `${String(shaft_end)},${String(-POINTER_SHAFT_HALF_WIDTH)}`,
        `${String(shaft_end)},${String(-POINTER_HEAD_HALF_WIDTH)}`,
        `${String(pointer.length)},0`,
        `${String(shaft_end)},${String(POINTER_HEAD_HALF_WIDTH)}`,
        `${String(shaft_end)},${String(POINTER_SHAFT_HALF_WIDTH)}`,
        `0,${String(POINTER_SHAFT_HALF_WIDTH)}`
    ].join(" ");
    const pointer_drop: number = Math.sin(pointer.angle * DEGREES_TO_RADIANS) * pointer.length;
    const label_x: number = pointer.x + POINTER_LABEL_GAP;
    const label_y: number = pointer.y + pointer_drop * POINTER_LABEL_POSITION + POINTER_LABEL_DROP;
    const arrow_transform: string = `translate(${String(pointer.x)} ${String(pointer.y)}) rotate(${String(pointer.angle)})`;

    const pointer_element: JSX.Element = (
        <g className={styles.annotation} aria-hidden="true">
            <polygon className={styles.pointer} points={arrow_points} transform={arrow_transform} />
            <text className={styles.pointer_label} x={label_x} y={label_y}>
                {label_text}
            </text>
        </g>
    );
    return pointer_element;
};

interface PrefecturePathsProps {
    paths: PrefectureMapData["paths"];
    key_suffix: string;
    prefecture_fills: Partial<Record<PrefectureId, PrefectureFill>>;
    prefecture_groups: Partial<Record<PrefectureId, string>>;
    hovered_group: string | null;
    onPathClick: (prefecture_id: PrefectureId, event: MouseEvent<SVGPathElement>) => void;
    onGroupHover: (group: string | null) => void;
}

const MOUSE_POINTER_TYPE: string = "mouse";

const INSET_MARGIN: number = 12;
const INSET_CORNER_RADIUS: number = 8;

const PrefecturePaths = ({
    paths,
    key_suffix,
    prefecture_fills,
    prefecture_groups,
    hovered_group,
    onPathClick,
    onGroupHover
}: PrefecturePathsProps): JSX.Element => {
    const path_elements: JSX.Element[] = [];
    for (const prefecture of PREFECTURES_NORTH_TO_SOUTH) {
        const path_data: string | undefined = paths[prefecture.code];
        const has_no_path = path_data === undefined;
        if (has_no_path === true) {
            continue;
        }
        const prefecture_fill: PrefectureFill = prefecture_fills[prefecture.id] ?? "untouched";
        const group: string = prefecture_groups[prefecture.id] ?? prefecture.id;
        const is_hovered = hovered_group === group;
        const hovered_class_name: string = is_hovered === true ? styles.hovered : "";
        const handleClick = (event: MouseEvent<SVGPathElement>): void => {
            onPathClick(prefecture.id, event);
        };
        const handlePointerEnter = (event: PointerEvent<SVGPathElement>): void => {
            const is_mouse_pointer = event.pointerType === MOUSE_POINTER_TYPE;
            if (is_mouse_pointer === true) {
                onGroupHover(group);
            }
        };
        const handlePointerLeave = (): void => {
            onGroupHover(null);
        };
        const path_element: JSX.Element = (
            <path
                key={`${prefecture.id}_${key_suffix}`}
                d={path_data}
                className={`${styles.prefecture} ${styles[prefecture_fill]} ${hovered_class_name}`}
                onClick={handleClick}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
            />
        );
        path_elements.push(path_element);
    }
    const paths_element: JSX.Element = <>{path_elements}</>;
    return paths_element;
};

interface JapanMapProps {
    place_layer: QuizType;
    prefecture_fills: Partial<Record<PrefectureId, PrefectureFill>>;
    prefecture_groups: Partial<Record<PrefectureId, string>>;
    map_label: MapLabel | null;
    onPrefectureClick: (prefecture_id: PrefectureId, click_point: MapPoint) => void;
}

export const JapanMap = ({
    place_layer,
    prefecture_fills,
    prefecture_groups,
    map_label,
    onPrefectureClick
}: JapanMapProps): JSX.Element => {
    const [hovered_group, setHoveredGroup] = useState<string | null>(null);
    const is_prefecture_layer = place_layer === "prefectures";
    const is_region_layer = place_layer === "regions";
    const svg_class_name: string = is_prefecture_layer === true ? styles.svg : `${styles.svg} ${styles.grouped}`;
    const map_name: string = usePlainTranslation("map.label");
    const inset_label_text: string = usePlainTranslation("map.inset_label");
    const container_ref: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const view_box: ViewBox = useMapViewBox(container_ref);
    const view_box_text: string = `${String(view_box.x)} ${String(view_box.y)} ${String(view_box.width)} ${String(view_box.height)}`;
    const inset: InsetData = PREFECTURE_MAP_DATA.inset;
    const inset_transform: string = `translate(${String(view_box.x + INSET_MARGIN)} ${String(view_box.y + INSET_MARGIN)})`;
    const map_aspect_ratio: string = `${String(PREFECTURE_MAP_DATA.width)} / ${String(PREFECTURE_MAP_DATA.height)}`;

    const handlePathClick = (prefecture_id: PrefectureId, event: MouseEvent<SVGPathElement>): void => {
        const container_element: HTMLDivElement | null = container_ref.current;
        const has_no_container = container_element === null;
        if (has_no_container === true) {
            return;
        }
        const container_bounds: DOMRect = container_element.getBoundingClientRect();
        const click_point: MapPoint = {
            x: event.clientX - container_bounds.left,
            y: event.clientY - container_bounds.top
        };
        onPrefectureClick(prefecture_id, click_point);
    };

    const region_lines_element: JSX.Element | null =
        is_region_layer === true ? <path className={styles.region_lines} d={PREFECTURE_MAP_DATA.region_lines} /> : null;

    const has_label = map_label !== null;
    const label_element: JSX.Element | null =
        has_label === true ? (
            <span
                key={map_label.label_key}
                className={styles.label}
                style={{ left: map_label.point.x, top: map_label.point.y }}>
                {map_label.content}
            </span>
        ) : null;

    const map_element: JSX.Element = (
        <div ref={container_ref} className={styles.map} style={{ aspectRatio: map_aspect_ratio }}>
            <svg className={svg_class_name} viewBox={view_box_text} role="img" aria-label={map_name}>
                <PrefecturePaths
                    paths={PREFECTURE_MAP_DATA.paths}
                    key_suffix="main"
                    prefecture_fills={prefecture_fills}
                    prefecture_groups={prefecture_groups}
                    hovered_group={hovered_group}
                    onPathClick={handlePathClick}
                    onGroupHover={setHoveredGroup}
                />
                {region_lines_element}
                <InsetPointer pointer={PREFECTURE_MAP_DATA.pointer} label_text={inset_label_text} />
                <g transform={inset_transform}>
                    <rect
                        className={styles.inset_frame}
                        width={inset.width}
                        height={inset.height}
                        rx={INSET_CORNER_RADIUS}
                    />
                    <text className={styles.inset_label} x={INSET_LABEL_INSET_X} y={INSET_LABEL_INSET_Y}>
                        {inset_label_text}
                    </text>
                    <PrefecturePaths
                        paths={inset.paths}
                        key_suffix="inset"
                        prefecture_fills={prefecture_fills}
                        prefecture_groups={prefecture_groups}
                        hovered_group={hovered_group}
                        onPathClick={handlePathClick}
                        onGroupHover={setHoveredGroup}
                    />
                </g>
            </svg>
            {label_element}
        </div>
    );
    return map_element;
};
