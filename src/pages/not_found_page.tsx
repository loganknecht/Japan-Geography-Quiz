import type { JSX } from "react";
import { Link } from "react-router";

import { TranslatedText } from "../components/translated_text";
import styles from "./not_found_page.module.css";

const MENU_PATH: string = "/";

export const NotFoundPage = (): JSX.Element => {
    const page_element: JSX.Element = (
        <section className={styles.panel}>
            <h2 className={styles.heading}>
                <TranslatedText translation_key="not_found.heading" />
            </h2>
            <Link to={MENU_PATH} className={styles.link}>
                <TranslatedText translation_key="not_found.home_link" />
            </Link>
        </section>
    );
    return page_element;
};
