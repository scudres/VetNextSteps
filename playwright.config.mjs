import { defineConfig } from "@playwright/test";

/**
 * Smoke tests run against the CRA dev server, which serves the real React app
 * and — via frontend/src/setupProxy.js — invokes the actual Netlify function
 * handlers in-process. This exercises the full stack except SMTP (the contact
 * endpoint is stubbed in dev) and Turnstile (widget hidden without a site key).
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm start",
    cwd: "./frontend",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: { BROWSER: "none" },
  },
});
