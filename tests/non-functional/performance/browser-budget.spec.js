import { expect, test } from "@playwright/test";

test("@performance homepage returns usable response within agreed budget", async ({ page }) => {
  const startedAt = Date.now();

  const response = await page.goto("/");

  const elapsedMs = Date.now() - startedAt;

  expect(response?.ok()).toBeTruthy();
  expect(elapsedMs).toBeLessThan(5_000);
});
