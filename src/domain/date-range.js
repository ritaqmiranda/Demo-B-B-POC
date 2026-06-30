const toDate = (value) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return date;
};

const toMidnight = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export class DateRange {
  constructor(start, end) {
    this.start = toMidnight(toDate(start));
    this.end = toMidnight(toDate(end));

    if (this.start >= this.end) {
      throw new Error("Invalid date range");
    }
  }

  overlaps(other) {
    return this.start < other.end && this.end > other.start;
  }
}