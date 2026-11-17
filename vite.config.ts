import react from "@vitejs/plugin-react";
import { defineConfig, type UserConfig } from "vite";

const GITHUB_PAGES_BASE_PATH: string = "/Japan-Geography-Quiz/";

const vite_config: UserConfig = defineConfig({
    base: GITHUB_PAGES_BASE_PATH,
    plugins: [react()]
});

export default vite_config;
