import assert from "node:assert/strict";
import test from "node:test";
import {
  existingBookings,
  filterAvailableRooms,
  isValidDateRange,
  rangesOverlap,
  rooms
} from "../../src/fixtures/booking-data.js";

const today = new Date("2026-06-29T12:00:00.000Z");

test("@unit validates date range boundaries", () => {
  const examples = [
    ["2026-07-01", "2026-07-03", true],
    ["2026-06-29", "2026-06-30", true],
    ["2026-06-01", "2026-06-03", false],
    ["01/07/2026", "2026-07-03", false],
    ["2026-07-03", "2026-07-03", false],
    ["2026-07-03", "2026-07-01", false]
  ];

  for (const [checkIn, checkOut, expected] of examples) {
    assert.equal(isValidDateRange(checkIn, checkOut, today), expected);
  }
});

test("@unit detects overlapping half-open booking ranges", () => {
  const examples = [
    ["2026-07-01", "2026-07-03", "2026-07-02", "2026-07-05", true],
    ["2026-07-01", "2026-07-03", "2026-07-03", "2026-07-05", false],
    ["2026-07-01", "2026-07-03", "2026-07-01", "2026-07-03", true],
    ["2026-07-04", "2026-07-06", "2026-07-01", "2026-07-04", false]
  ];

  for (const [firstStart, firstEnd, secondStart, secondEnd, expected] of examples) {
    assert.equal(
      rangesOverlap(
        { start: new Date(firstStart), end: new Date(firstEnd) },
        { start: new Date(secondStart), end: new Date(secondEnd) }
      ),
      expected
    );
  }
});

test("@unit returns only rooms without conflicting bookings", () => {
  const availableRoomIds = filterAvailableRooms(
    rooms,
    existingBookings,
    "2026-07-01",
    "2026-07-03",
    today
  ).map((room) => room.id);

  assert.deepEqual(availableRoomIds, [2]);
});

test("@unit treats checkout day as available for another booking", () => {
  const availableRoomIds = filterAvailableRooms(
    rooms,
    existingBookings,
    "2026-07-04",
    "2026-07-06",
    today
  ).map((room) => room.id);

  assert.deepEqual(availableRoomIds, [1, 2]);
});

test("@unit returns an empty list when every room has a conflicting booking", () => {
  const fullyBooked = [
    ...existingBookings,
    {
      roomId: 2,
      checkIn: "2026-07-01",
      checkOut: "2026-07-03"
    }
  ];

  const availableRooms = filterAvailableRooms(
    rooms,
    fullyBooked,
    "2026-07-01",
    "2026-07-03",
    today
  );

  assert.deepEqual(availableRooms, []);
});

test("@unit throws an error when filtering with an invalid date range", () => {
  assert.throws(
    () =>
      filterAvailableRooms(
        rooms,
        existingBookings,
        "2026-07-03",
        "2026-07-03",
        today
      ),
    /Invalid date range/
  );
});
