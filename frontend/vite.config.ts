/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // Component tests live beside the components they cover. jsdom because Testing
  // Library needs a DOM; globals so a test file reads the way every Vitest
  // example does.
  test: {
    // Component tests only. Scoped to `src/` so the Playwright specs in `e2e/`
    // -- which match the default `*.spec.ts` pattern -- are left to Playwright;
    // collected here they fail on Playwright's own fixtures.
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    css: false,
    // A JUnit XML report on every run, in the fixed folder the platform reads to fill the
    // test case sheet (see TESTING.md). A command-line --reporter replaces these.
    reporters: ["default", "junit"],
    outputFile: { junit: "reports/junit/vitest.xml" },
    // Coverage is measured by the sprint's test check and reported as a
    // json-summary the platform reads back for the development dashboard.
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      reportsDirectory: "./coverage",
    },
  },
});
