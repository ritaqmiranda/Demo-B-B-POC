import path from "node:path";
import { expect, test } from "@playwright/test";
import { MatchersV3, PactV3 } from "@pact-foundation/pact";
import { RestfulBookerClient } from "../../src/clients/restful-booker-client.js";

const pact = new PactV3({
  consumer: "B&B Demo availability client",
  provider: "Restful Booker API",
  dir: path.resolve("pacts"),
  logLevel: "warn"
});

test("@contract Restful Booker booking list contract", async () => {
  await pact
    .addInteraction({
      states: [{ description: "bookings exist" }],
      uponReceiving: "a request for booking identifiers",
      withRequest: {
        method: "GET",
        path: "/booking",
        headers: { Accept: "application/json" }
      },
      willRespondWith: {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: MatchersV3.eachLike({
          bookingid: MatchersV3.integer(1)
        })
      }
    })
    .executeTest(async (mockServer) => {
      const client = new RestfulBookerClient({ baseUrl: mockServer.url });
      const bookings = await client.getBookings();

      expect(bookings[0]).toEqual(
        expect.objectContaining({
          bookingid: expect.any(Number)
        })
      );
    });
});

test("@contract Restful Booker booking detail contract", async () => {
  await pact
    .addInteraction({
      states: [{ description: "a booking with id 1 exists" }],
      uponReceiving: "a request for booking detail",
      withRequest: {
        method: "GET",
        path: "/booking/1",
        headers: { Accept: "application/json" }
      },
      willRespondWith: {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: {
          firstname: MatchersV3.string("Sally"),
          lastname: MatchersV3.string("Brown"),
          totalprice: MatchersV3.integer(120),
          depositpaid: MatchersV3.boolean(true),
          bookingdates: {
            checkin: MatchersV3.date("yyyy-MM-dd", "2026-07-01"),
            checkout: MatchersV3.date("yyyy-MM-dd", "2026-07-03")
          },
          additionalneeds: MatchersV3.string("Breakfast")
        }
      }
    })
    .executeTest(async (mockServer) => {
      const client = new RestfulBookerClient({ baseUrl: mockServer.url });
      const booking = await client.getBooking(1);

      expect(booking.bookingdates).toEqual(
        expect.objectContaining({
          checkin: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
          checkout: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/)
        })
      );
    });
});
