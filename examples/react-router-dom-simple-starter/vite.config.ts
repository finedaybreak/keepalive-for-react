import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // resolve: {
    //     alias: {
    //         "keepalive-for-react": path.resolve(__dirname, "../../packages/core/src/index.ts"),
    //         "keepalive-for-react-router": path.resolve(__dirname, "../../packages/router/src/index.ts"),
    //     },
    //     dedupe: ["react", "react-dom"],
    // },
});
