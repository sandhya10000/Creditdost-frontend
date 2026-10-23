import React from "react";
import { Chip } from "@mui/material";
import { AMC_STATUS_CONFIG } from "../../utils/amc";

export const AmcStatusChip = ({ status }) => {
  const config = AMC_STATUS_CONFIG[status] || { label: status || "N/A", color: "default" };
  return <Chip label={config.label} color={config.color} size="small" />;
};

export const AmcPaymentChip = ({ status }) => (
  <Chip
    label={status === "paid" ? "Paid" : "Pending"}
    color={status === "paid" ? "success" : "warning"}
    size="small"
    variant="outlined"
  />
);
