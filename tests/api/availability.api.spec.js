import { expect, test } from "@playwright/test";
import { config } from "../../src/fixtures/env.js";

test.use({
  baseURL: config.restfulBookerBaseUrl
});

test("@api @smoke Restful Booker API exposes booking data", async ({ request }) => {
  const response = await request.get("/booking");

  expect(response.status()).toBe(200);

  const bookings = await response.json();

  expect(bookings).toEqual(expect.any(Array));

  test.skip(bookings.length === 0, "No public bookings available in the shared demo API.");

  expect(bookings[0]).toEqual(
    expect.objectContaining({
      bookingid: expect.any(Number)
    })
  );
});

test("@api @regression booking details include date boundaries", async ({ request }) => {
  const listResponse = await request.get("/booking");

  expect(listResponse.status()).toBe(200);

  const bookings = await listResponse.json();

  test.skip(bookings.length === 0, "No public bookings available in the shared demo API.");

  const detailResponse = await request.get(`/booking/${bookings[0].bookingid}`);

  expect(detailResponse.status()).toBe(200);

  const details = await detailResponse.json();

  expect(details.bookingdates).toEqual(
    expect.objectContaining({
      checkin: expect.any(String),
      checkout: expect.any(String)
    })
  );
  expect(details.bookingdates.checkin).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(details.bookingdates.checkout).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});
