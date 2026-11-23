import type { JSX } from "react";
import { Link } from "react-router";

import { TranslatedText } from "../components/translated_text";
import { SettingsMenu } from "../settings/components/settings_menu";
import styles from "./site_header.module.css";

const MENU_PATH: string = "/";

export const SiteHeader = (): JSX.Element => {
    const header_element: JSX.Element = (
        <header className={styles.header}>
            <Link to={MENU_PATH} className={styles.title_plaque}>
                <h1 className={styles.title}>
                    <TranslatedText translation_key="site.title" />
                </h1>
            </Link>
            <div className={styles.settings_slot}>
                <SettingsMenu />
            </div>
        </header>
    );
    return header_element;
};
