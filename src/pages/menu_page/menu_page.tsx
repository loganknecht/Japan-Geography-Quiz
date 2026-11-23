import type { JSX } from "react";

import styles from "./menu_page.module.css";
import { useMenuSelectionState } from "./menu_selection_context";
import { MenuSelectionProvider } from "./menu_selection_provider";
import { PlayModePicker } from "./play_mode_picker";
import { ProgressiveModeOptions } from "./progressive_mode_options";
import { QuizTypePicker } from "./quiz_type_picker";
import { StartButton } from "./start_button";

const MenuPanel = (): JSX.Element => {
    const { play_mode } = useMenuSelectionState();
    const is_single_mode = play_mode === "single";
    const mode_options_element: JSX.Element = is_single_mode === true ? <QuizTypePicker /> : <ProgressiveModeOptions />;

    const panel_element: JSX.Element = (
        <section className={styles.panel}>
            <PlayModePicker />
            <hr className={styles.divider} />
            {mode_options_element}
            <StartButton />
        </section>
    );
    return panel_element;
};

export const MenuPage = (): JSX.Element => {
    const page_element: JSX.Element = (
        <MenuSelectionProvider>
            <MenuPanel />
        </MenuSelectionProvider>
    );
    return page_element;
};
