import type { ReactNode } from "react";

export type PrefectureFill = "untouched" | "inactive" | "first_try" | "retry" | "failed" | "revealing";

export interface InsetData {
    width: number;
    height: number;
    paths: Partial<Record<string, string>>;
}

export interface ViewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface MapPointer {
    x: number;
    y: number;
    angle: number;
    length: number;
}

export interface PrefectureMapData {
    width: number;
    height: number;
    inset: InsetData;
    pointer: MapPointer;
    paths: Partial<Record<string, string>>;
}

export interface MapPoint {
    x: number;
    y: number;
}

export interface MapLabel {
    label_key: number;
    point: MapPoint;
    content: ReactNode;
}
