import { type RefObject, useLayoutEffect, useState } from "react";

import { PREFECTURE_MAP_DATA } from "./prefecture_map_data";
import type { ViewBox } from "./prefecture_map_types";

const MAP_VIEW_BOX: ViewBox = { x: 0, y: 0, width: PREFECTURE_MAP_DATA.width, height: PREFECTURE_MAP_DATA.height };
const MAP_ASPECT_RATIO: number = PREFECTURE_MAP_DATA.width / PREFECTURE_MAP_DATA.height;

const fitViewBox = (container_width: number, container_height: number): ViewBox => {
    const has_no_size = container_width <= 0 || container_height <= 0;
    if (has_no_size === true) {
        return MAP_VIEW_BOX;
    }
    const container_aspect_ratio: number = container_width / container_height;
    const is_wider_than_map = container_aspect_ratio > MAP_ASPECT_RATIO;
    let fitted_view_box: ViewBox = MAP_VIEW_BOX;
    if (is_wider_than_map === true) {
        const width: number = MAP_VIEW_BOX.height * container_aspect_ratio;
        fitted_view_box = { x: (MAP_VIEW_BOX.width - width) / 2, y: 0, width: width, height: MAP_VIEW_BOX.height };
    } else {
        const height: number = MAP_VIEW_BOX.width / container_aspect_ratio;
        fitted_view_box = { x: 0, y: (MAP_VIEW_BOX.height - height) / 2, width: MAP_VIEW_BOX.width, height: height };
    }
    return fitted_view_box;
};

export const useMapViewBox = (container_ref: RefObject<HTMLElement | null>): ViewBox => {
    const [view_box, setViewBox] = useState<ViewBox>(MAP_VIEW_BOX);

    useLayoutEffect((): (() => void) | undefined => {
        const container_element: HTMLElement | null = container_ref.current;
        const has_no_container = container_element === null;
        if (has_no_container === true) {
            return undefined;
        }
        const updateViewBox = (): void => {
            const container_bounds: DOMRect = container_element.getBoundingClientRect();
            const fitted_view_box: ViewBox = fitViewBox(container_bounds.width, container_bounds.height);
            setViewBox(fitted_view_box);
        };
        const resize_observer: ResizeObserver = new ResizeObserver(updateViewBox);
        resize_observer.observe(container_element);
        const stopObserving = (): void => {
            resize_observer.disconnect();
        };
        return stopObserving;
    }, [container_ref]);

    return view_box;
};
