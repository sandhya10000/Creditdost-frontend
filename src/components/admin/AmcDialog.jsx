import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { adminAPI } from "../../services/api";
import {
  defaultAmcEndDate,
  formatAmcDate,
  shiftDateInput,
  toDateInput,
  todayDateInput,
} from "../../utils/amc";

const TITLES = {
  enroll: "Enroll in AMC",
  edit: "Edit AMC",
  renew: "Renew AMC",
};

// mode: "enroll" | "edit" | "renew"; customer: BusinessForm record
const AmcDialog = ({ open, mode, customer, onClose, onSaved }) => {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    amount: "",
    paymentStatus: "pending",
    remarks: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !customer) return;
    const amc = customer.amc || {};
    let startDate;
    let endDate;
    let amount = amc.amount ?? "";
    let paymentStatus = "pending";
    let remarks = "";

    if (mode === "edit") {
      startDate = toDateInput(amc.startDate);
      endDate = toDateInput(amc.endDate);
      paymentStatus = amc.paymentStatus || "pending";
      remarks = amc.remarks || "";
    } else if (mode === "renew") {
      // New term starts the day after the current one ends
      startDate = shiftDateInput(toDateInput(amc.endDate), { days: 1 });
      endDate = defaultAmcEndDate(startDate);
    } else {
      startDate = todayDateInput();
      endDate = defaultAmcEndDate(startDate);
      amount = "";
    }

    setForm({ startDate, endDate, amount, paymentStatus, remarks });
    setError("");
  }, [open, mode, customer]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setError("");
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Keep the default one-year term in step with From date (not in edit mode)
      if (field === "startDate" && mode !== "edit" && value) {
        next.endDate = defaultAmcEndDate(value);
      }
      return next;
    });
  };

  const validate = () => {
    if (!form.startDate || !form.endDate) return "Please select AMC From and To dates";
    if (form.endDate <= form.startDate) return "AMC To date must be after the From date";
    if (form.amount === "" || Number.isNaN(Number(form.amount)) || Number(form.amount) < 0) {
      return "Please enter a valid AMC amount (0 or more)";
    }
    if (
      mode === "renew" &&
      customer?.amc?.startDate &&
      form.startDate <= toDateInput(customer.amc.startDate)
    ) {
      return "Renewal From date must be after the current AMC From date";
    }
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      const response =
        mode === "renew"
          ? await adminAPI.renewAmc(customer._id, payload)
          : await adminAPI.upsertAmc(customer._id, payload);
      onSaved?.(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save AMC. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => !saving && onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{TITLES[mode] || "AMC"}</DialogTitle>
      <DialogContent>
        {customer && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {customer.customerName} ({customer.customerId})
            {mode === "renew" && customer.amc?.endDate && (
              <> · current AMC ends {formatAmcDate(customer.amc.endDate)}</>
            )}
          </Typography>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="AMC From"
              value={form.startDate}
              onChange={handleChange("startDate")}
              InputLabelProps={{ shrink: true }}
              disabled={saving}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="AMC To"
              value={form.endDate}
              onChange={handleChange("endDate")}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: form.startDate || undefined }}
              disabled={saving}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="AMC Amount (₹)"
              value={form.amount}
              onChange={handleChange("amount")}
              inputProps={{ min: 0, step: "0.01" }}
              disabled={saving}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={saving}>
              <InputLabel>Payment Status</InputLabel>
              <Select
                label="Payment Status"
                value={form.paymentStatus}
                onChange={handleChange("paymentStatus")}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Remarks (optional)"
              value={form.remarks}
              onChange={handleChange("remarks")}
              inputProps={{ maxLength: 500 }}
              disabled={saving}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? <CircularProgress size={22} /> : TITLES[mode]}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AmcDialog;
