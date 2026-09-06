import { defineConfig } from "@playwright/test";

/**
 * Hydration tests for the prerendered build.
 *
 * Unlike the main smoke suite (playwright.config.mjs), which runs against the
 * CRA dev server, these need the real react-snap output — hydration only happens
 * when React is handed prerendered HTML. Run `npm run test:prerender`, which
 * builds first.
 */
export default defineConfig({
  testDir: "./e2e-prerender",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://localhost:4173",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node tools/static-server.mjs 4173",
    url: "http://localhost:4173/",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
