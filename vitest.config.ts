import { defineConfig } from "vitest/config";
/// <reference types="vitest" />
export default defineConfig({
  test: {
    includeSource: ["src/**/*.{js,ts,tsx}"],
    reporters: "verbose",
    include: ["src/**/*.test.{js,ts,tsx}"],
    exclude: ["src/**/*.spec.{js,ts,tsx}"],
  },
  define: {
    "import.meta.vitest": "undefined",
  },
});