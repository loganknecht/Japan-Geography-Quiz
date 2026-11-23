import "./global.css";
import "./i18n/i18n_setup";

import { type JSX, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";

import { App } from "./app";
import { blockClicksThatSelectText } from "./utilities/block_clicks_that_select_text";

const ROOT_ELEMENT_ID: string = "root";

const throwMissingRootElementError = (): never => {
    const missing_root_element_error: Error = new Error(`No element with id "${ROOT_ELEMENT_ID}" exists in index.html`);
    throw missing_root_element_error;
};

const found_root_element: HTMLElement | null = document.getElementById(ROOT_ELEMENT_ID);
const root_element: HTMLElement = found_root_element ?? throwMissingRootElementError();

const react_root: Root = createRoot(root_element);
const app_element: JSX.Element = (
    <StrictMode>
        <App />
    </StrictMode>
);

blockClicksThatSelectText();
react_root.render(app_element);
