import { defineConfig } from "tsdown";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    outExtensions({ format }) {
        return {
            js: format === "cjs" ? ".cjs" : ".mjs",
        };
    },
    dts: { sourcemap: false },
    minify: true,
    sourcemap: false,
    deps: {
        neverBundle: ["react", "react-dom", "react-router", "keepalive-for-react"],
    },
});
