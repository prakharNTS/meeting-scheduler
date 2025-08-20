export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const addMonths = (d, n) => {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);

export const startOfWeek = (d) => {
  // Monday as first day
  const x = new Date(d);
  const wd = (x.getDay() + 6) % 7; // 0..6 with Mon=0
  x.setDate(x.getDate() - wd);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const toISO = (d) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate())
    .toISOString()
    .slice(0, 10);

export const monthLabel = (d) =>
  d.toLocaleString(undefined, { month: "long", year: "numeric" });

export function daysOfMonthMatrix(base) {
  const start = startOfWeek(startOfMonth(base));
  const cells = [];
  let cur = start;
  while (cells.length < 42) {
    cells.push(cur);
    cur = addDays(cur, 1);
  }
  return cells;
}
