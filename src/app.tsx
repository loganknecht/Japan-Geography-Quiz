import type { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import { HelloWorldPage } from "./pages/hello_world_page";
import { NotFoundPage } from "./pages/not_found_page";

const ROUTER_BASE_PATH: string = import.meta.env.BASE_URL;

export const App = (): JSX.Element => {
    const app_element: JSX.Element = (
        <BrowserRouter basename={ROUTER_BASE_PATH}>
            <Routes>
                <Route path="/" element={<HelloWorldPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
    return app_element;
};
