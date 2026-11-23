import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { adminAPI } from "../../services/api";

const formatAddress = (address) => {
  if (!address) return "—";
  if (typeof address === "string") return address;
  return Object.values(address).filter(Boolean).join(", ") || "—";
};

const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const DetailRow = ({ label, value }) => (
  <Box sx={{ display: "flex", py: 1, borderBottom: "1px solid #f1f5f9" }}>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ width: 180, flexShrink: 0 }}
    >
      {label}
    </Typography>
    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
      {value ?? "—"}
    </Typography>
  </Box>
);

// Admin-only franchise details popup. Pass the franchise code to open it,
// or leave it null to keep it closed.
const FranchiseDetailsDialog = ({ franchiseCode, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!franchiseCode) return;
    let cancelled = false;
    setLoading(true);
    setData(null);
    setError("");
    adminAPI
      .getSingleFranchise(franchiseCode)
      .then((res) => {
        if (!cancelled) setData(res.data.data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Failed to load franchise details",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [franchiseCode]);

  const f = data;

  return (
    <Dialog
      open={Boolean(franchiseCode)}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={700}>
          Franchise Details
        </Typography>
        {f && (
          <Typography variant="body2" color="text.secondary">
            {f.franchiseCode} • {f.businessName || "—"}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : f ? (
          <>
            <DetailRow label="Franchise ID" value={f.franchiseCode} />
            <DetailRow label="Business name" value={f.businessName} />
            <DetailRow label="Owner name" value={f.ownerName || f.userId?.name} />
            <DetailRow label="Email" value={f.email || f.userId?.email} />
            <DetailRow label="Phone" value={f.phone || f.userId?.phone} />
            <DetailRow label="Alternate phone" value={f.alternatePhone} />
            <DetailRow label="Address" value={formatAddress(f.address)} />
            <DetailRow label="Status" value={f.isActive ? "Active" : "Inactive"} />
            <DetailRow label="KYC status" value={f.kycStatus} />
            <DetailRow
              label="Agreement signed"
              value={f.agreementSigned ? "Yes" : "No"}
            />
            <DetailRow label="Credits available" value={f.credits} />
            <DetailRow
              label="Total credits purchased"
              value={f.totalCreditsPurchased}
            />
            <DetailRow label="Credit hold" value={f.creditHold ? "On hold" : "No"} />
            <DetailRow
              label="Last login"
              value={
                f.lastLoginCreditAt || f.userId?.lastLoginAt
                  ? formatDateTime(f.lastLoginCreditAt || f.userId.lastLoginAt)
                  : null
              }
            />
          </>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FranchiseDetailsDialog;
