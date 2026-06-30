export {
  filterAvailableRooms,
  isValidDateRange,
  rangesOverlap
} from "../domain/availability.js";

export const validBookingDates = {
  checkIn: "2026-07-01",
  checkOut: "2026-07-03"
};

export const rooms = [
  { id: 1, name: "101" },
  { id: 2, name: "102" }
];

export const existingBookings = [
  {
    roomId: 1,
    checkIn: "2026-07-02",
    checkOut: "2026-07-04"
  }
];
