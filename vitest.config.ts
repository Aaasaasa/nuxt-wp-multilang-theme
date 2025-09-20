import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    include: ["tests/**/*.{test,spec}.ts"],
    exclude: [
      "node_modules/**",
      ".nuxt/**",
      "dist/**",
      "coverage/**",
      "tests/e2e/**"
    ],
    globals: true
  }
});
