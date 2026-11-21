import type { JSX } from "react";

import styles from "./menu_page.module.css";
import { ProgressionStylePicker } from "./progression_style_picker";
import { StagePicker } from "./stage_picker";

export const ProgressiveModeOptions = (): JSX.Element => {
    const options_element: JSX.Element = (
        <div className={styles.stack}>
            <StagePicker />
            <ProgressionStylePicker />
        </div>
    );
    return options_element;
};
