import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    outExtension({ format }) {
        return {
            js: format === "cjs" ? ".cjs" : ".mjs",
        };
    },
    dts: true,
    clean: true,
    external: ["react", "react-dom", "react/jsx-runtime"],
    minify: true,
    treeshake: true,
});
