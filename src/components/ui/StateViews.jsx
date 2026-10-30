import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

// Shown inside a list/table when there is nothing to display.
export const EmptyState = ({ title = "No records found", description, action }) => (
  <Box
    sx={{
      py: 6,
      px: 2,
      textAlign: "center",
      color: "text.secondary",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
    }}
  >
    <InboxOutlinedIcon sx={{ fontSize: 40, color: "text.disabled" }} />
    <Typography variant="subtitle1" sx={{ color: "text.primary", fontWeight: 600 }}>
      {title}
    </Typography>
    {description && <Typography variant="body2">{description}</Typography>}
    {action}
  </Box>
);

// Centered spinner for page or section loading.
export const LoadingState = ({ label = "Loading..." }) => (
  <Box
    role="status"
    aria-live="polite"
    sx={{ py: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}
  >
    <CircularProgress size={28} />
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Box>
);
