import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

// KPI tile. `color` must be one of the existing palette keys so the
// brand colors stay the same: "primary" | "secondary" | "success" | "warning" | "error".
const StatCard = ({ label, value, icon, color = "primary", helper }) => (
  <Card>
    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
      {icon && (
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: `${color}.main`,
            bgcolor: (theme) => `${theme.palette[color].main}14`,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" noWrap>
          {label}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {value}
        </Typography>
        {helper && (
          <Typography variant="caption" color="text.secondary">
            {helper}
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;
