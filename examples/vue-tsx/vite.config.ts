import { defineConfig } from "vite-plus";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  resolve: {
    alias: {
      "vue-hooks": new URL("../../src", import.meta.url).pathname,
    },
  },
  // resolveType infers runtime `props` from the TS type annotations,
  // so components don't need a runtime `props` declaration
  plugins: [vueJsx({ resolveType: true })],

  // Vite Task definitions (`vpr <task>`)
  run: {
    tasks: {
      dev: "vp dev",
      build: "vp build",
      preview: "vp preview",
    },
  },
});
