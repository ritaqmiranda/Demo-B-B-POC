import { expect, test } from "@playwright/test";
import { HomePage } from "../../pages/HomePage.js";
import { validBookingDates } from "../../src/fixtures/booking-data.js";

test("@ui @smoke availability checker is visible on the landing page", async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.open();

  await expect(homePage.availabilityHeading).toBeVisible();
});

test("@ui availability widget renders correctly", async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.open();

  await expect(homePage.checkInInput).toBeVisible();
  await expect(homePage.checkOutInput).toBeVisible();
  await expect(homePage.checkAvailabilityButton).toBeVisible();
  await expect(homePage.checkAvailabilityButton).toBeEnabled();
});