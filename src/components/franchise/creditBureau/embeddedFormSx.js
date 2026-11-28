// Minimal look for the bureau check forms when they sit inside the Credit Check tabs.
// Applied to the root box, so every card, field and button inside picks it up.
export const EMBEDDED_FORM_SX = {
  "& .MuiCard-root": {
    boxShadow: "none",
    border: 1,
    borderColor: "divider",
    borderRadius: 3,
  },
  "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "background.paper" },
  "& .MuiInputLabel-root": { fontSize: "0.9rem" },
  "& .MuiButton-root": { textTransform: "none", fontWeight: 600, borderRadius: 2 },
  "& .MuiButton-contained": { boxShadow: "none", "&:hover": { boxShadow: "none" } },
};
