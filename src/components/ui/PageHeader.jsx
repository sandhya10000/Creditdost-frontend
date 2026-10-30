import React from "react";
import { Box, Stack, Typography } from "@mui/material";

// Standard title row for admin / partner pages.
// `actions` renders on the right (buttons, filters) and wraps on small screens.
const PageHeader = ({ title, subtitle, actions, sx }) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    alignItems={{ xs: "flex-start", sm: "center" }}
    justifyContent="space-between"
    spacing={2}
    sx={{ mb: 3, ...sx }}
  >
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="h5" component="h1" sx={{ color: "text.primary" }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {actions && (
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {actions}
      </Stack>
    )}
  </Stack>
);

export default PageHeader;
