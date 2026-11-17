import type { JSX } from "react";
import { Link } from "react-router";

import styles from "./not_found_page.module.css";

export const NotFoundPage = (): JSX.Element => {
    const page_title: string = "ページが見つかりません";
    const home_link_text: string = "ホームに戻る";
    const home_path: string = "/";

    const page_element: JSX.Element = (
        <main className={styles.page}>
            <h1>{page_title}</h1>
            <Link to={home_path}>{home_link_text}</Link>
        </main>
    );
    return page_element;
};
