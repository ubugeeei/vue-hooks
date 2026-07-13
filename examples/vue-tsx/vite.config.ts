import { defineConfig } from "vite-plus";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  resolve: {
    alias: {
      "vue-hooks": new URL("../../src", import.meta.url).pathname,
    },
  },
  plugins: [vueJsx()],
});
