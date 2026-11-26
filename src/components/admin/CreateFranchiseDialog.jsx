import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { adminAPI } from "../../services/api";

const EMPTY_FORM = { name: "", email: "", packages: [], businessManagerId: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SectionLabel = ({ children }) => (
  <Typography
    variant="overline"
    color="text.secondary"
    sx={{ display: "block", fontWeight: 700, letterSpacing: 0.8, mb: 1 }}
  >
    {children}
  </Typography>
);

// Creates a franchise partner account. The backend emails the login credentials.
// Full admins may pick the Business Manager; otherwise the backend assigns one.
const CreateFranchiseDialog = ({
  open,
  onClose,
  onCreated,
  packages = [],
  canPickManager = false,
}) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [managers, setManagers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !canPickManager) return;
    adminAPI
      .getStaffMembers()
      .then((res) =>
        setManagers(
          (res.data?.data ?? []).filter(
            (m) => m.isActive && m.staffRole?.limitToOwnFranchises,
          ),
        ),
      )
      .catch(() => setManagers([]));
  }, [open, canPickManager]);

  const selectedPackages = packages.filter((p) => form.packages.includes(p._id));
  const totalCredits = selectedPackages.reduce(
    (sum, p) => sum + (p.creditsIncluded || 0),
    0,
  );

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleClose = () => {
    if (submitting) return;
    setForm(EMPTY_FORM);
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    if (name.length < 2) {
      setError("Enter the partner's full name");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await adminAPI.createFranchiseUser({
        name,
        email,
        role: "franchise_user",
        subRole: "franchise",
        assignedPackages: form.packages,
        ...(form.businessManagerId && { businessManagerId: form.businessManagerId }),
      });
      setForm(EMPTY_FORM);
      onCreated(
        `Franchise created and login credentials emailed to ${email}. It is listed under Pending Franchise.`,
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create franchise. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ component: "form", onSubmit: handleSubmit, sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 0.5 }}>
        <Typography variant="h6" component="span" fontWeight={700}>
          Create Franchise
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The partner gets an email with their login details right away.
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: "16px !important" }}>
        <SectionLabel>Partner details</SectionLabel>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoFocus
              fullWidth
              required
              label="Full name"
              value={form.name}
              onChange={handleChange("name")}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              type="email"
              label="Email address"
              value={form.email}
              onChange={handleChange("email")}
              helperText="Used to sign in"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <SectionLabel>Packages (optional)</SectionLabel>
          <FormControl fullWidth>
            <InputLabel id="create-franchise-packages">Assign packages</InputLabel>
            <Select
              labelId="create-franchise-packages"
              multiple
              value={form.packages}
              onChange={handleChange("packages")}
              label="Assign packages"
              MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
              renderValue={() => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selectedPackages.map((pkg) => (
                    <Chip key={pkg._id} size="small" label={pkg.name} />
                  ))}
                </Box>
              )}
            >
              {packages.length === 0 && (
                <MenuItem disabled>No packages available</MenuItem>
              )}
              {packages.map((pkg) => (
                <MenuItem key={pkg._id} value={pkg._id}>
                  <Checkbox checked={form.packages.includes(pkg._id)} />
                  <ListItemText
                    primary={pkg.name}
                    secondary={`₹${pkg.price} · ${pkg.creditsIncluded} credits`}
                  />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {selectedPackages.length
                ? `${totalCredits} credits will be added to the partner's account`
                : "You can assign packages later from Edit"}
            </FormHelperText>
          </FormControl>
        </Box>

        {canPickManager && (
          <Box sx={{ mt: 3 }}>
            <SectionLabel>Business Manager</SectionLabel>
            <TextField
              select
              fullWidth
              label="Business Manager (RM)"
              value={form.businessManagerId}
              onChange={handleChange("businessManagerId")}
              SelectProps={{ displayEmpty: true }}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">Auto-assign (next in rotation)</MenuItem>
              {managers.map((m) => (
                <MenuItem key={m._id} value={m._id}>
                  {m.name}
                  {m.staffCode ? ` (${m.staffCode})` : ""}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {submitting ? "Creating..." : "Create Franchise"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFranchiseDialog;
