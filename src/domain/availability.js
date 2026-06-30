export function isValidDateRange(checkIn, checkOut, today = new Date()) {
  const start = parseIsoDate(checkIn);
  const end = parseIsoDate(checkOut);
  const floor = startOfDay(today);

  return Boolean(start && end && start >= floor && end > start);
}

export function rangesOverlap(firstRange, secondRange) {
  return firstRange.start < secondRange.end && secondRange.start < firstRange.end;
}

export function filterAvailableRooms(rooms, bookings, checkIn, checkOut, today = new Date()) {
  if (!isValidDateRange(checkIn, checkOut, today)) {
    throw new Error("Invalid date range");
  }

  const requestedRange = {
    start: parseIsoDate(checkIn),
    end: parseIsoDate(checkOut)
  };

  return rooms.filter((room) =>
    bookings
      .filter((booking) => booking.roomId === room.id)
      .every((booking) =>
        !rangesOverlap(requestedRange, {
          start: parseIsoDate(booking.checkIn),
          end: parseIsoDate(booking.checkOut)
        })
      )
  );
}

function parseIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return null;

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(value) {
  return new Date(Date.UTC(
    value.getUTCFullYear(),
    value.getUTCMonth(),
    value.getUTCDate()
  ));
}
