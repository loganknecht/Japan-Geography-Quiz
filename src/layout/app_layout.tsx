import type { JSX } from "react";
import { Outlet } from "react-router";

import styles from "./app_layout.module.css";
import { SiteHeader } from "./site_header";

export const AppLayout = (): JSX.Element => {
    const layout_element: JSX.Element = (
        <div className={styles.layout}>
            <SiteHeader />
            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
    return layout_element;
};
