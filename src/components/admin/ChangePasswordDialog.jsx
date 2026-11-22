import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { authAPI } from "../../services/api";

const MIN_LENGTH = 6;
const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };

// Lets the signed-in user (staff or admin) change their own password
const ChangePasswordDialog = ({ open, onClose }) => {
  const [form, setForm] = useState(EMPTY);
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setShow(false);
      setError("");
      setSuccess("");
    }
  }, [open]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const mismatch = form.confirmPassword !== "" && form.confirmPassword !== form.newPassword;
  const tooShort = form.newPassword !== "" && form.newPassword.length < MIN_LENGTH;
  const canSubmit =
    form.currentPassword && form.newPassword && form.confirmPassword && !mismatch && !tooShort;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || saving) return;
    setSaving(true);
    setError("");
    try {
      const res = await authAPI.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(res.data?.message || "Password changed successfully");
      setForm(EMPTY);
    } catch (err) {
      setError(err.response?.data?.message || "Could not change password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = (
    <InputAdornment position="end">
      <IconButton
        aria-label={show ? "Hide passwords" : "Show passwords"}
        onClick={() => setShow((s) => !s)}
        edge="end"
        size="small"
      >
        {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>Change password</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <TextField
              label="Current password"
              name="currentPassword"
              type={show ? "text" : "password"}
              value={form.currentPassword}
              onChange={handleChange}
              autoComplete="current-password"
              autoFocus
              fullWidth
              InputProps={{ endAdornment: toggle }}
            />
            <TextField
              label="New password"
              name="newPassword"
              type={show ? "text" : "password"}
              value={form.newPassword}
              onChange={handleChange}
              autoComplete="new-password"
              error={tooShort}
              helperText={tooShort ? `At least ${MIN_LENGTH} characters` : " "}
              fullWidth
            />
            <TextField
              label="Confirm new password"
              name="confirmPassword"
              type={show ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              error={mismatch}
              helperText={mismatch ? "Passwords do not match" : " "}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={saving}>
            {success ? "Close" : "Cancel"}
          </Button>
          <Button type="submit" variant="contained" disabled={!canSubmit || saving}>
            {saving ? <CircularProgress size={20} /> : "Update password"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChangePasswordDialog;
