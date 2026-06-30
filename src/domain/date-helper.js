export const getRelativeDateISO = (baseDate, daysFromToday) => {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
};