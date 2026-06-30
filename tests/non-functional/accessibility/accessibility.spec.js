import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("@accessibility @ui landing page has no unexpected critical accessibility violations", async ({ page }) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  const knownCriticalViolationIds = new Set(["label"]);
  const criticalViolations = results.violations.filter(
    (violation) => violation.impact === "critical"
  );
  const unexpectedCriticalViolations = criticalViolations.filter(
    (violation) => !knownCriticalViolationIds.has(violation.id)
  );

  expect(unexpectedCriticalViolations).toEqual([]);
});
