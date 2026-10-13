import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { adminAPI } from "../../services/api";

// Shared dialog to add or deduct franchise credits.
// Props: open, onClose, franchise ({ _id, businessName, credits }), mode ("add" | "deduct"), onSuccess(message)
const CreditAdjustDialog = ({ open, onClose, franchise, mode = "add", onSuccess }) => {
  const isDeduct = mode === "deduct";
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setAmount("");
      setRemarks("");
      setError("");
    }
  }, [open, franchise, mode]);

  const handleConfirm = async () => {
    const value = parseInt(amount, 10);
    if (!value || value <= 0) {
      setError("Please enter a valid number of credits");
      return;
    }
    if (isDeduct && franchise && value > (franchise.credits || 0)) {
      setError(`Insufficient balance. Available: ${franchise.credits || 0}`);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await adminAPI.rechargeFranchiseCredits({
        franchiseId: franchise._id,
        credits: value,
        remarks,
        type: mode,
      });
      if (onSuccess) {
        onSuccess(
          response.data?.message ||
            (isDeduct ? "Credits deducted successfully" : "Credits added successfully"),
        );
      }
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (isDeduct ? "Failed to deduct credits" : "Failed to add credits"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isDeduct ? "Deduct Funds" : "Add Funds"}</DialogTitle>
      <DialogContent>
        {franchise && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              <strong>{franchise.businessName}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current balance: {franchise.credits ?? 0} credits
            </Typography>
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          label={isDeduct ? "Credits to Deduct" : "Credits to Add"}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
          inputProps={{ min: 1, max: isDeduct ? franchise?.credits || 0 : undefined }}
        />
        <TextField
          fullWidth
          label="Remarks (Optional)"
          multiline
          rows={2}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={isDeduct ? "error" : "success"}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : isDeduct ? "Deduct" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreditAdjustDialog;
