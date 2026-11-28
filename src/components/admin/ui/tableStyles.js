// Style constants and formatters shared by admin list pages (see AdminTable.jsx).
// Kept apart from the components so React fast refresh keeps working.

export const headRowSx = {
  "& th": {
    bgcolor: "grey.50",
    color: "text.secondary",
    fontWeight: 600,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    whiteSpace: "nowrap",
    py: 1.25,
  },
};

export const bodyRowSx = {
  "& td": { py: 1.25 },
  "&:last-child td": { borderBottom: 0 },
};

// e.g. "23 Nov 2026"
export const formatShortDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";


export const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "";


// Pill-shaped coloured dropdown for work status (Business MIS, AMC)
export const statusSelectSx = (bg, color = "#fff") => ({
  height: 30,
  backgroundColor: bg,
  color,
  fontWeight: 600,
  fontSize: "0.78rem",
  borderRadius: 15,
  "& .MuiSelect-select": { py: 0.5, pl: 1.5 },
  "& .MuiSelect-icon": { color },
  "& .MuiSelect-select.Mui-disabled": { WebkitTextFillColor: color, color },
  "& .MuiSelect-icon.Mui-disabled": { color },
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "1px solid rgba(255,255,255,0.5)" },
});

// Primary action button used on every admin page (flat, rounded, sentence case)
export const primaryButtonSx = {
  borderRadius: 2,
  textTransform: "none",
  fontWeight: 600,
  px: 2,
  boxShadow: "none",
  "&:hover": { boxShadow: "none" },
};
