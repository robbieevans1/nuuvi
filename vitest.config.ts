import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {

    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: ["**/*.{test,spec}.{ts,tsx}"],
  },
});