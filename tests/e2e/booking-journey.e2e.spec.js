import { expect, test } from "@playwright/test";
import { HomePage } from "../../pages/HomePage.js";
import { validBookingDates } from "../../src/fixtures/booking-data.js";

test("@e2e new user can discover available rooms from the homepage", async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.open();

  await expect(homePage.availabilityHeading).toBeVisible();

 await homePage.searchAvailability(
  validBookingDates.checkIn,
  validBookingDates.checkOut  
);

  await expect(homePage.bookNowLinks.first()).toBeVisible();
});