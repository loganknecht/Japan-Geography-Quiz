import type { JSX } from "react";

import styles from "./hello_world_page.module.css";

export const HelloWorldPage = (): JSX.Element => {
    const page_title: string = "こんにちは、世界！";
    const page_subtitle: string = "日本の地理クイズ";

    const page_element: JSX.Element = (
        <main className={styles.page}>
            <h1 className={styles.title}>{page_title}</h1>
            <p className={styles.subtitle}>{page_subtitle}</p>
        </main>
    );
    return page_element;
};
