// Follow-up dates are stored as YYYY-MM-DD strings (local calendar day).

// Local calendar day as YYYY-MM-DD (en-CA gives that format)
export const toDayString = (date = new Date()) =>
  date.toLocaleDateString("en-CA");

export const addDays = (days, from = new Date()) => {
  const next = new Date(from);
  next.setDate(next.getDate() + days);
  return toDayString(next);
};

// "27 Oct 2026" from "2026-10-27" without timezone shifting
export const formatDay = (dayString) => {
  if (!dayString) return "—";
  const [year, month, day] = dayString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Overdue / due today / upcoming, relative to the local today
export const getFollowUpStatus = (dayString) => {
  if (!dayString) return { key: "none", label: "Not set", color: "default" };
  const today = toDayString();
  if (dayString < today) return { key: "overdue", label: "Overdue", color: "error" };
  if (dayString === today) return { key: "today", label: "Due today", color: "warning" };
  return { key: "upcoming", label: "Upcoming", color: "success" };
};

// Newest history entry, or null
export const latestFollowUp = (history = []) =>
  history.length ? history[history.length - 1] : null;
