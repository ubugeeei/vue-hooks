import { createRequire } from "node:module";
import { dirname, join } from "node:path";
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
  // Library build (`vp pack`)
  pack: {
    dts: {
      tsgo: { path: tsgoPath },
    },
  },

  // Vitest configuration
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.ts"],
  },

  // Oxlint configuration
  lint: {
    ignorePatterns: ["dist/**"],
  },

  // Oxfmt configuration
  fmt: {
    semi: true,
    singleQuote: false,
  },
});
