// AMC dates are stored as UTC midnight of the chosen day, so always format in UTC
export const formatAmcDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-IN", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// "YYYY-MM-DD" for <input type="date">
export const toDateInput = (value) => (value ? String(value).slice(0, 10) : "");

// Adds days / years to a "YYYY-MM-DD" string, returns "YYYY-MM-DD"
export const shiftDateInput = (ymd, { days = 0, years = 0 } = {}) => {
  if (!ymd) return "";
  const date = new Date(`${ymd}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return "";
  date.setUTCFullYear(date.getUTCFullYear() + years);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

// Default one-year term: From + 1 year − 1 day
export const defaultAmcEndDate = (startYmd) =>
  shiftDateInput(startYmd, { years: 1, days: -1 });

export const todayDateInput = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

export const AMC_STATUS_CONFIG = {
  active: { label: "Active", color: "success" },
  expiring: { label: "Expiring Soon", color: "warning" },
  expired: { label: "Expired", color: "error" },
  upcoming: { label: "Upcoming", color: "default" },
};

export const formatDaysLeft = (days) => {
  if (days === null || days === undefined) return "N/A";
  if (days < 0) return `Expired ${Math.abs(days)} day${days === -1 ? "" : "s"} ago`;
  if (days === 0) return "Ends today";
  return `${days} day${days === 1 ? "" : "s"}`;
};

export const formatAmount = (amount) =>
  amount === null || amount === undefined
    ? "N/A"
    : `₹${Number(amount).toLocaleString("en-IN")}`;

// Same CSV approach as Business MIS (quoted values, data: URI download)
export const downloadCsv = (filename, headers, rows) => {
  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const link = document.createElement("a");
  link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
