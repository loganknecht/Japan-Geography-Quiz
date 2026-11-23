import type { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import { AppLayout } from "./layout/app_layout";
import { MenuPage } from "./pages/menu_page/menu_page";
import { NotFoundPage } from "./pages/not_found_page";
import { PlayPage } from "./pages/play_page/play_page";
import { QuizProvider } from "./quiz/quiz_provider";
import { SettingsProvider } from "./settings/settings_provider";

const ROUTER_BASE_PATH: string = import.meta.env.BASE_URL;

export const App = (): JSX.Element => {
    const app_element: JSX.Element = (
        <SettingsProvider>
            <QuizProvider>
                <BrowserRouter basename={ROUTER_BASE_PATH}>
                    <Routes>
                        <Route element={<AppLayout />}>
                            <Route path="/" element={<MenuPage />} />
                            <Route path="/play" element={<PlayPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </QuizProvider>
        </SettingsProvider>
    );
    return app_element;
};
