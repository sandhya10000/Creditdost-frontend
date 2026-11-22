import React, { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { adminAPI } from "../../services/api";

// Razorpay is the default while Cashfree's Payment Links API is pending approval
const DEFAULT_GATEWAY = "razorpay";

const GATEWAYS = [
  { value: "razorpay", label: "Razorpay" },
  { value: "cashfree", label: "Cashfree" },
];

const EMPTY_FORM = {
  name: "",
  mobile: "",
  amount: "",
  remarks: "",
  gateway: DEFAULT_GATEWAY,
};

const validate = (form) => {
  if (form.name.trim().length < 2) return "Enter the customer name";
  if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) return "Enter a valid 10-digit mobile number";
const amount = Number(form.amount);
  if (!amount || amount < 1) return "Enter a payment amount of at least ₹1";
  return "";
};

// Creates a payment link on the chosen gateway. Calls onCreated with the server response.
const ManualPaymentDialog = ({ open, onClose, onCreated }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleClose = () => {
    if (submitting) return;
    setForm(EMPTY_FORM);
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const { data } = await adminAPI.createManualPayment({
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        amount: Number(form.amount),
        remarks: form.remarks.trim(),
        gateway: form.gateway,
      });
      setForm(EMPTY_FORM);
      onCreated(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create payment link");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Payment Link</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            select
            label="Payment gateway"
            value={form.gateway}
            onChange={handleChange("gateway")}
            required
            fullWidth
          >
            {GATEWAYS.map((g) => (
              <MenuItem key={g.value} value={g.value}>
                {g.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Name"
            value={form.name}
            onChange={handleChange("name")}
            required
            fullWidth
          />
          <TextField
            label="Mobile"
            value={form.mobile}
            onChange={handleChange("mobile")}
            required
            fullWidth
            inputProps={{ maxLength: 10, inputMode: "numeric" }}
          />
<TextField
            label="Payment Amount (₹)"
            type="number"
            value={form.amount}
            onChange={handleChange("amount")}
            required
            fullWidth
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Remarks"
            value={form.remarks}
            onChange={handleChange("remarks")}
            multiline
            minRows={2}
            fullWidth
            helperText="Shown to the customer on the payment page"
          />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Creating..." : "Create Payment Link"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManualPaymentDialog;
