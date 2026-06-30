import { defineConfig } from "@playwright/test";
import { config } from "./src/fixtures/env.js";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "on-failure" }],
    ["junit", { outputFile: "test-results/playwright-results.xml" }]
  ],

  use: {
    baseURL: config.bAndBBaseUrl,
    headless: true,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  }
});