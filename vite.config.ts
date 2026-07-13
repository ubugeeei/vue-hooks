import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite-plus";

// resolve the native tsc (tsgo) binary shipped with typescript@7 for dts generation
const require = createRequire(import.meta.url);
const tsRequire = createRequire(require.resolve("typescript/package.json"));
const tsgoPath = join(
  dirname(
    tsRequire.resolve(`@typescript/typescript-${process.platform}-${process.arch}/package.json`),
  ),
  "lib/tsc",
);

export default defineConfig({
  define: {
    __VUE_OPTIONS_API__: "true",
    __VUE_PROD_DEVTOOLS__: "false",
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
  },

  // Library build (`vp pack`)
  pack: {
    dts: {
      tsgo: { path: tsgoPath },
    },
  },

  // Vitest configuration (`vp test`, Browser Mode)
  test: {
    include: ["tests/**/*.test.ts"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
      screenshotFailures: false,
    },
  },

  // Oxlint configuration (`vp lint` / `vp check`, incl. type checking)
  lint: {
    ignorePatterns: ["dist/**"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },

  // Oxfmt configuration (`vp fmt`)
  fmt: {
    semi: true,
    singleQuote: false,
  },

  // Vite Task definitions (`vpr <task>`)
  run: {
    tasks: {
      dev: { command: "vp dev", cwd: "examples/vue-tsx" },
    },
  },
});
