/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    root: "src/renderer",
    base: "./",
    server: {
        port: 3000,
    },
    build: {
        outDir: path.resolve(__dirname, "dist/renderer"),
        emptyOutDir: true,
    },
    resolve: {
        alias: [
            {
                find: "@",
                replacement: path.resolve(__dirname, "src/renderer/src"),
            },
            {
                find: "@tests",
                replacement: path.resolve(__dirname, "src/renderer/tests"),
            },
            {
                find: "@common",
                replacement: path.resolve(__dirname, "src/common"),
            },
        ],
    },
    test: {
        globals: true,
        setupFiles: "tests/setup.ts",
        environment: "jsdom",
        coverage: {
            reporter: ["text"],
        },
    },
});
