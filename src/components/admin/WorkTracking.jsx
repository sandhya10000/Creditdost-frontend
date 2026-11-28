import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  AccountBalanceWalletOutlined,
  AddOutlined,
  DeleteOutline,
  EditOutlined,
  ReceiptLongOutlined,
  SavingsOutlined,
  StorefrontOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { format } from "date-fns";
import { adminAPI, workTrackingAPI } from "../../services/api";
import { useAuth } from "../../hooks/useAuth.jsx";
import { isStaff } from "../../config/adminPermissions";

// Incentives Tracking. One shared component for every staff role that has the
// "work_tracking" section. Staff log and manage their own entries. Full administrators
// review the monthly totals (filtered by staff role and person) and cannot add entries.

const GST_RATE = 0.18;
const MAX_AMOUNT = 100000000; // keep in sync with config/workTracking.js on the backend

const CATEGORIES = [
  { value: "franchise", label: "Franchise", usesGst: false, color: "#7c3aed" },
  { value: "credit_score_repair", label: "Credit Score Repair", usesGst: true, color: "#0891b2" },
  { value: "business", label: "Business", usesGst: true, color: "#16a34a" },
];
const CATEGORY_BY_VALUE = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));
const usesGst = (category) => Boolean(CATEGORY_BY_VALUE[category]?.usesGst);

const TIERS = [
  { value: "silver", label: "Silver", color: "#64748b" },
  { value: "platinum", label: "Platinum", color: "#0ea5e9" },
  { value: "diamond", label: "Diamond", color: "#a855f7" },
];
const TIER_BY_VALUE = Object.fromEntries(TIERS.map((t) => [t.value, t]));

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const formatMoney = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Same split the server applies. Only used for the live preview; the server saves its own numbers.
const splitAmount = (category, amount, gstMode) => {
  const value = round2(Number(amount));
  if (!usesGst(category)) return { base: value, gst: 0, total: value };
  if (gstMode === "with_gst") {
    const base = round2(value / (1 + GST_RATE));
    return { base, gst: round2(value - base), total: value };
  }
  const gst = round2(value * GST_RATE);
  return { base: value, gst, total: round2(value + gst) };
};

// Entry dates are stored as UTC midnight of the chosen day; read the calendar date back
// from the string so the picker never shows the previous day.
const dateFromEntry = (isoDate) => {
  const [year, month, day] = String(isoDate).slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
};

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";

const emptyForm = () => ({
  entryDate: new Date(),
  category: "",
  franchiseTier: "",
  amount: "",
  gstMode: "",
  notes: "",
});

const formFromEntry = (entry) => ({
  entryDate: dateFromEntry(entry.entryDate),
  category: entry.category,
  franchiseTier: entry.franchiseTier || "",
  amount: String(entry.amount),
  gstMode: entry.gstMode || "",
  notes: entry.notes || "",
});

const validateForm = (form) => {
  const errors = {};
  const date = form.entryDate;
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) errors.entryDate = "Choose a date";
  if (!form.category) errors.category = "Choose a category";
  if (form.category === "franchise" && !form.franchiseTier) {
    errors.franchiseTier = "Choose a franchise tier";
  }
  const amount = Number(form.amount);
  if (form.amount === "" || !Number.isFinite(amount)) errors.amount = "Enter an amount";
  else if (amount <= 0) errors.amount = "Amount must be greater than zero";
  else if (amount > MAX_AMOUNT) errors.amount = "Amount is too large";
  else if (round2(amount) !== amount) errors.amount = "Use at most two decimal places";
  if (usesGst(form.category) && !form.gstMode) {
    errors.gstMode = "Choose With GST or Without GST";
  }
  return errors;
};

const buildPayload = (form) => ({
  entryDate: format(form.entryDate, "yyyy-MM-dd"),
  category: form.category,
  franchiseTier: form.category === "franchise" ? form.franchiseTier : null,
  amount: Number(form.amount),
  gstMode: usesGst(form.category) ? form.gstMode : null,
  notes: form.notes.trim(),
});

const pad = (value) => String(value).padStart(2, "0");

// Compact stat tile with a coloured accent
const StatCard = ({ label, value, caption, icon, color }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2.5,
      height: "100%",
      borderRadius: 3,
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        bgcolor: color,
      },
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
          {value}
        </Typography>
        {caption && (
          <Typography variant="caption" color="text.secondary">
            {caption}
          </Typography>
        )}
      </Box>
      <Avatar sx={{ bgcolor: `${color}1a`, color, width: 40, height: 40 }}>{icon}</Avatar>
    </Stack>
  </Paper>
);

const SectionCard = ({ title, subtitle, action, children, sx }) => (
  <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden", ...sx }}>
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ px: 2.5, pt: 2, pb: 1.5 }}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Stack>
    {children}
  </Paper>
);

const headCellSx = {
  fontWeight: 600,
  color: "text.secondary",
  bgcolor: "grey.50",
  whiteSpace: "nowrap",
};

const IncentivesTracking = () => {
  const { user } = useAuth();
  // Full administrators review everyone's entries; staff see and log only their own
  const manager = !isStaff(user);
  const myId = user?._id || user?.id;

  const now = new Date();
  const thisYear = now.getFullYear();
  const [year, setYear] = useState(thisYear);
  const [monthNumber, setMonthNumber] = useState(now.getMonth() + 1);
  const [roleFilter, setRoleFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [roles, setRoles] = useState([]);
  const [staff, setStaff] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [notice, setNotice] = useState({ open: false, message: "", severity: "success" });

  const month = `${year}-${pad(monthNumber)}`;
  const monthLabel = `${MONTHS[monthNumber - 1]} ${year}`;
  const years = useMemo(() => [thisYear - 2, thisYear - 1, thisYear, thisYear + 1], [thisYear]);

  const notify = (message, severity = "success") => setNotice({ open: true, message, severity });

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const params = { month };
    if (manager && roleFilter) params.roleId = roleFilter;
    if (manager && userFilter) params.userId = userFilter;
    try {
      const [entriesRes, summaryRes] = await Promise.all([
        workTrackingAPI.getEntries(params),
        workTrackingAPI.getSummary(params),
      ]);
      setEntries(entriesRes.data?.data ?? []);
      setSummary(summaryRes.data?.data ?? null);
    } catch (err) {
      setLoadError(err.response?.data?.message || "Could not load entries");
    } finally {
      setLoading(false);
    }
  }, [month, manager, roleFilter, userFilter]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    if (!manager) return;
    let active = true;
    Promise.all([adminAPI.getStaffRoles(), adminAPI.getStaffMembers()])
      .then(([rolesRes, staffRes]) => {
        if (!active) return;
        setRoles(rolesRes.data?.data ?? []);
        setStaff(staffRes.data?.data ?? []);
      })
      .catch(() => notify("Could not load roles and staff", "error"));
    return () => {
      active = false;
    };
  }, [manager]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setFormErrors({});
    setFormError("");
    setDialogOpen(true);
  };

  const openEdit = (entry) => {
    setEditing(entry);
    setForm(formFromEntry(entry));
    setFormErrors({});
    setFormError("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setDialogOpen(false);
  };

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSave = async () => {
    const errors = validateForm(form);
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    setSaving(true);
    setFormError("");
    try {
      const payload = buildPayload(form);
      if (editing) {
        await workTrackingAPI.updateEntry(editing._id, payload);
        notify("Entry updated");
      } else {
        await workTrackingAPI.createEntry(payload);
        notify("Entry added");
      }
      setDialogOpen(false);
      await loadEntries();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not save the entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entry) => {
    if (!window.confirm("Delete this entry? This cannot be undone.")) return;
    try {
      await workTrackingAPI.deleteEntry(entry._id);
      notify("Entry deleted");
      await loadEntries();
    } catch (err) {
      notify(err.response?.data?.message || "Could not delete the entry", "error");
    }
  };

  const preview = useMemo(() => {
    const amount = Number(form.amount);
    if (!form.category || form.amount === "" || !Number.isFinite(amount) || amount <= 0) return null;
    if (usesGst(form.category) && !form.gstMode) return { needsChoice: true };
    return splitAmount(form.category, amount, form.gstMode);
  }, [form.category, form.amount, form.gstMode]);

  const roleOptions = roles.filter((role) => role.isActive !== false);
  const personOptions = staff.filter((member) => member.staffRole);
  const filtersActive = Boolean(roleFilter || userFilter);
  const totalWithGst = summary?.totalWithGst || 0;
  // Eight columns for both views (admin: "Logged by"; staff: "Actions")
  const colSpan = 8;

  return (
    <Box>
      {/* Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Incentives Tracking
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {manager
              ? "Monthly working and business totals for all staff, used to calculate incentives."
              : "Log your working and business entries. These totals are used to calculate your incentive."}
          </Typography>
        </Box>
        {manager ? (
          <Chip
            icon={<VisibilityOutlined />}
            label="Admin view · read only"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        ) : (
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={openCreate}
            sx={{ borderRadius: 2, px: 2.5 }}
          >
            Add Entry
          </Button>
        )}
      </Stack>

      {/* Filters */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="it-month">Month</InputLabel>
              <Select
                labelId="it-month"
                label="Month"
                value={monthNumber}
                onChange={(e) => setMonthNumber(e.target.value)}
              >
                {MONTHS.map((name, index) => (
                  <MenuItem key={name} value={index + 1}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="it-year">Year</InputLabel>
              <Select
                labelId="it-year"
                label="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {manager && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="it-role">Staff role</InputLabel>
                  <Select
                    labelId="it-role"
                    label="Staff role"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <MenuItem value="">All roles</MenuItem>
                    {roleOptions.map((role) => (
                      <MenuItem key={role._id} value={role._id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="it-user">Person</InputLabel>
                  <Select
                    labelId="it-user"
                    label="Person"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  >
                    <MenuItem value="">All people</MenuItem>
                    {personOptions.map((member) => (
                      <MenuItem key={member._id} value={member._id}>
                        {member.name}
                        {member.staffRole?.name ? ` · ${member.staffRole.name}` : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
          {manager && filtersActive && (
            <Grid item xs={12} md="auto">
              <Button
                size="small"
                onClick={() => {
                  setRoleFilter("");
                  setUserFilter("");
                }}
              >
                Clear filters
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>

      {loadError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {loadError}
        </Alert>
      )}

      {loading && !summary ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        summary && (
          <>
            {/* Headline numbers */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                  label="Total without GST"
                  value={formatMoney(summary.totalWithoutGst)}
                  caption={monthLabel}
                  icon={<AccountBalanceWalletOutlined />}
                  color="#4f46e5"
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                  label="Total with GST"
                  value={formatMoney(summary.totalWithGst)}
                  caption="Used for incentive calculation"
                  icon={<SavingsOutlined />}
                  color="#16a34a"
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                  label={`GST collected (${Math.round(GST_RATE * 100)}%)`}
                  value={formatMoney(summary.totalGst)}
                  caption="Included in the with-GST total"
                  icon={<ReceiptLongOutlined />}
                  color="#d97706"
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                  label="Entries"
                  value={summary.count}
                  caption={manager ? "Across the selected filters" : "Your entries this month"}
                  icon={<StorefrontOutlined />}
                  color="#0891b2"
                />
              </Grid>
            </Grid>

            {/* Category and tier breakdown */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={7}>
                <SectionCard title="By category" subtitle="Share of the with-GST total">
                  <Stack spacing={2.5} sx={{ px: 2.5, pb: 2.5 }}>
                    {CATEGORIES.map((category) => {
                      const row = summary.byCategory?.[category.value] || {};
                      const share = totalWithGst ? (row.totalAmount / totalWithGst) * 100 : 0;
                      return (
                        <Box key={category.value}>
                          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box
                                sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: category.color }}
                              />
                              <Typography fontWeight={600}>{category.label}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.count || 0} {row.count === 1 ? "entry" : "entries"}
                              </Typography>
                            </Stack>
                            <Typography fontWeight={700}>{formatMoney(row.totalAmount)}</Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(share, 100)}
                            sx={{
                              mt: 1,
                              height: 8,
                              borderRadius: 4,
                              bgcolor: "grey.100",
                              "& .MuiLinearProgress-bar": { bgcolor: category.color, borderRadius: 4 },
                            }}
                          />
                          <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.75 }}>
                            <Typography variant="caption" color="text.secondary">
                              Without GST {formatMoney(row.baseAmount)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {share.toFixed(0)}% of total
                            </Typography>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                </SectionCard>
              </Grid>
              <Grid item xs={12} md={5}>
                <SectionCard title="Franchise tiers" subtitle="Franchise entries by tier">
                  <Stack spacing={1.5} sx={{ px: 2.5, pb: 2.5 }}>
                    {TIERS.map((tier) => {
                      const row = summary.byTier?.[tier.value] || {};
                      return (
                        <Stack
                          key={tier.value}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Chip
                              size="small"
                              label={tier.label}
                              sx={{ bgcolor: `${tier.color}1a`, color: tier.color, fontWeight: 700 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {row.count || 0} {row.count === 1 ? "entry" : "entries"}
                            </Typography>
                          </Stack>
                          <Typography fontWeight={700}>{formatMoney(row.totalAmount)}</Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </SectionCard>
              </Grid>
            </Grid>

            {/* Per-person totals (admin view) */}
            {manager && (
              <SectionCard title="By person" subtitle={`Totals for ${monthLabel}`} sx={{ mb: 3 }}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={headCellSx}>Name</TableCell>
                        <TableCell sx={headCellSx}>Role</TableCell>
                        <TableCell align="right" sx={headCellSx}>Entries</TableCell>
                        <TableCell align="right" sx={headCellSx}>Without GST</TableCell>
                        <TableCell align="right" sx={headCellSx}>With GST</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(summary.byUser || []).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                            No entries for this month
                          </TableCell>
                        </TableRow>
                      )}
                      {(summary.byUser || []).map((row) => (
                        <TableRow key={String(row.userId)} hover>
                          <TableCell>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: "primary.light" }}>
                                {initials(row.userName)}
                              </Avatar>
                              <Typography fontWeight={600}>{row.userName || "—"}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip size="small" variant="outlined" label={row.roleName || "—"} />
                          </TableCell>
                          <TableCell align="right">{row.count}</TableCell>
                          <TableCell align="right">{formatMoney(row.totalWithoutGst)}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>
                            {formatMoney(row.totalWithGst)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </SectionCard>
            )}
          </>
        )
      )}

      {/* Itemised entries */}
      <SectionCard
        title="Entries"
        subtitle={`${monthLabel} · ${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}
      >
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={headCellSx}>Date</TableCell>
                {manager && <TableCell sx={headCellSx}>Logged by</TableCell>}
                <TableCell sx={headCellSx}>Category</TableCell>
                <TableCell sx={headCellSx}>Tier</TableCell>
                <TableCell align="right" sx={headCellSx}>Without GST</TableCell>
                <TableCell align="right" sx={headCellSx}>GST</TableCell>
                <TableCell align="right" sx={headCellSx}>With GST</TableCell>
                <TableCell sx={headCellSx}>Notes</TableCell>
                {!manager && <TableCell align="center" sx={headCellSx}>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={colSpan} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    {loading ? "Loading…" : "No entries for this month yet"}
                  </TableCell>
                </TableRow>
              )}
              {entries.map((entry) => {
                const mine = String(entry.user) === String(myId);
                const category = CATEGORY_BY_VALUE[entry.category];
                const tier = TIER_BY_VALUE[entry.franchiseTier];
                return (
                  <TableRow key={entry._id} hover>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {format(dateFromEntry(entry.entryDate), "dd MMM yyyy")}
                    </TableCell>
                    {manager && (
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {entry.userName || "—"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {entry.roleName}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Chip
                        size="small"
                        label={category?.label || entry.category}
                        sx={{
                          bgcolor: `${category?.color || "#64748b"}1a`,
                          color: category?.color || "text.primary",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>{tier ? tier.label : "—"}</TableCell>
                    <TableCell align="right">{formatMoney(entry.baseAmount)}</TableCell>
                    <TableCell align="right" sx={{ color: "text.secondary" }}>
                      {entry.gstAmount ? formatMoney(entry.gstAmount) : "—"}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {formatMoney(entry.totalAmount)}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap title={entry.notes || ""}>
                        {entry.notes || "—"}
                      </Typography>
                    </TableCell>
                    {!manager && (
                      <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                        {mine && (
                          <>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => openEdit(entry)}>
                                <EditOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error" onClick={() => handleDelete(entry)}>
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </SectionCard>

      {/* Add / edit entry (staff only) */}
      {!manager && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>
              {editing ? "Edit entry" : "Add entry"}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2.5} sx={{ mt: 1 }}>
                {formError && <Alert severity="error">{formError}</Alert>}

                <DatePicker
                  label="Date"
                  value={form.entryDate}
                  onChange={(value) => setField("entryDate", value)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: Boolean(formErrors.entryDate),
                      helperText: formErrors.entryDate || "Pick the date the work was done",
                    },
                  }}
                />

                <FormControl fullWidth error={Boolean(formErrors.category)}>
                  <InputLabel id="it-category">Category</InputLabel>
                  <Select
                    labelId="it-category"
                    label="Category"
                    value={form.category}
                    onChange={(e) => setField("category", e.target.value)}
                  >
                    {CATEGORIES.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.category && <FormHelperText>{formErrors.category}</FormHelperText>}
                </FormControl>

                {form.category === "franchise" && (
                  <FormControl fullWidth error={Boolean(formErrors.franchiseTier)}>
                    <InputLabel id="it-tier">Franchise tier</InputLabel>
                    <Select
                      labelId="it-tier"
                      label="Franchise tier"
                      value={form.franchiseTier}
                      onChange={(e) => setField("franchiseTier", e.target.value)}
                    >
                      {TIERS.map((tier) => (
                        <MenuItem key={tier.value} value={tier.value}>
                          {tier.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.franchiseTier && (
                      <FormHelperText>{formErrors.franchiseTier}</FormHelperText>
                    )}
                  </FormControl>
                )}

                <TextField
                  label={usesGst(form.category) ? "Amount" : "Amount (no GST applies)"}
                  type="number"
                  fullWidth
                  value={form.amount}
                  onChange={(e) => setField("amount", e.target.value)}
                  error={Boolean(formErrors.amount)}
                  helperText={formErrors.amount || " "}
                  inputProps={{ min: 0, step: "0.01" }}
                />

                {usesGst(form.category) && (
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                      Is this amount with or without GST ({Math.round(GST_RATE * 100)}%)?
                    </Typography>
                    <ToggleButtonGroup
                      exclusive
                      fullWidth
                      color="primary"
                      value={form.gstMode || null}
                      onChange={(_, value) => value && setField("gstMode", value)}
                    >
                      <ToggleButton value="with_gst">With GST</ToggleButton>
                      <ToggleButton value="without_gst">Without GST</ToggleButton>
                    </ToggleButtonGroup>
                    {formErrors.gstMode && (
                      <FormHelperText error>{formErrors.gstMode}</FormHelperText>
                    )}
                  </Box>
                )}

                {preview && (
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                    {preview.needsChoice ? (
                      <Typography variant="body2" color="text.secondary">
                        Choose With GST or Without GST to see the breakdown.
                      </Typography>
                    ) : (
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Without GST
                          </Typography>
                          <Typography fontWeight={700}>{formatMoney(preview.base)}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            GST ({Math.round(GST_RATE * 100)}%)
                          </Typography>
                          <Typography fontWeight={700}>{formatMoney(preview.gst)}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            With GST
                          </Typography>
                          <Typography fontWeight={700}>{formatMoney(preview.total)}</Typography>
                        </Grid>
                      </Grid>
                    )}
                  </Paper>
                )}

                <TextField
                  label="Notes (optional)"
                  fullWidth
                  multiline
                  minRows={2}
                  value={form.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                  inputProps={{ maxLength: 300 }}
                  helperText={`${form.notes.length}/300`}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={closeDialog} disabled={saving}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : editing ? "Save changes" : "Add entry"}
              </Button>
            </DialogActions>
          </Dialog>
        </LocalizationProvider>
      )}

      <Snackbar
        open={notice.open}
        autoHideDuration={4000}
        onClose={() => setNotice((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={notice.severity}
          onClose={() => setNotice((prev) => ({ ...prev, open: false }))}
          variant="filled"
        >
          {notice.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default IncentivesTracking;
