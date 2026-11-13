import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

import site from "./config/site.ts";

// Runs after bin/build.ts, adding the search island and styles to the built site.
export default defineConfig({
  plugins: [preact()],
  publicDir: false,
  build: {
    outDir: site.directories.output,
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: "./resources/js/main.tsx",
        index: "./resources/css/index.css",
      },
      output: {
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: (asset) =>
          asset.names.some((name) => name.endsWith(".css"))
            ? "css/[name][extname]"
            : "assets/[name][extname]",
      },
    },
  },
});
