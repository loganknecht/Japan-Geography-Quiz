import type { JSX } from "react";

import { TranslatedText } from "../components/translated_text";
import styles from "./japan_map.module.css";

const MAP_SOURCE_URL: string = "https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2026.html";

export const MapSource = (): JSX.Element => {
    const source_element: JSX.Element = (
        <p className={styles.source}>
            <a href={MAP_SOURCE_URL} target="_blank" rel="noreferrer">
                <TranslatedText translation_key="map.source" />
            </a>
        </p>
    );
    return source_element;
};
