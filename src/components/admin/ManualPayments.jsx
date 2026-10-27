import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import ManualPaymentDialog from "./ManualPaymentDialog";
import { adminAPI } from "../../services/api";

const PAGE_SIZE = 20;
const AUTO_REFRESH_MS = 15 * 1000;

const STATUS_META = {
  created: { label: "Link sent", color: "info" },
  paid: { label: "Paid", color: "success" },
  partially_paid: { label: "Partially paid", color: "warning" },
  expired: { label: "Expired", color: "default" },
  cancelled: { label: "Cancelled", color: "error" },
};

// Clipboard API needs a secure context; fall back to execCommand for plain http
const copyToClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to the textarea method
    }
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(area);
  return ok;
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

const ManualPayments = () => {
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  // Debounce search so we do not hit the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchPayments = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const { data } = await adminAPI.getManualPayments({
        page,
        limit: PAGE_SIZE,
        search,
        status,
      });
      setPayments(data.payments || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load manual payments");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Auto-update: while any link is still open, refresh the table every 15s (silently).
  // The backend syncs open links with Razorpay every 30s, so changes show up here.
  const hasOpenLinks = payments.some((p) => p.status === "created");
  useEffect(() => {
    if (!hasOpenLinks) return undefined;
    const id = setInterval(() => {
      fetchPayments({ silent: true });
    }, AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [hasOpenLinks, fetchPayments]);

  const handleCreated = async (data) => {
    setDialogOpen(false);
    const copied = await copyToClipboard(data.payment.shortUrl);
    showToast(
      copied ? "Payment link created and copied to clipboard" : "Payment link created. Could not copy, use the copy icon",
      copied ? "success" : "warning",
    );
    setPage(1);
    fetchPayments();
  };

  const handleCopy = async (url) => {
    const copied = await copyToClipboard(url);
    showToast(copied ? "Link copied to clipboard" : "Could not copy link", copied ? "success" : "error");
  };

  const handleRefresh = async (id) => {
    setBusyId(id);
    try {
      await adminAPI.refreshManualPayment(id);
      showToast("Status refreshed from Razorpay");
      fetchPayments();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to refresh status", "error");
    } finally {
      setBusyId("");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this payment link? The customer will no longer be able to pay with it.")) {
      return;
    }
    setBusyId(id);
    try {
      await adminAPI.cancelManualPayment(id);
      showToast("Payment link cancelled");
      fetchPayments();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to cancel link", "error");
    } finally {
      setBusyId("");
    }
  };

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ md: "center" }} sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Manual Payments
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {hasOpenLinks && (
            <Typography variant="caption" color="text.secondary">
              Auto-updating
            </Typography>
          )}
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
            Create Payment
          </Button>
        </Stack>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="Search name, mobile, email, city"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <TextField
          select
          size="small"
          label="Status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.entries(STATUS_META).map(([value, meta]) => (
            <MenuItem key={value} value={value}>
              {meta.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>City</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No manual payments yet
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => {
                const meta = STATUS_META[p.status] || { label: p.status, color: "default" };
                const isOpen = p.status === "created";
                const busy = busyId === p._id;
                return (
                  <TableRow key={p._id} hover>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.mobile}</TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>{p.city || "-"}</TableCell>
                    <TableCell align="right">₹{p.amount}</TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>{p.remarks || "-"}</TableCell>
                    <TableCell>
                      <Chip size="small" label={meta.label} color={meta.color} />
                      {p.status === "paid" && p.paidAt && (
                        <Typography variant="caption" display="block">
                          {formatDate(p.paidAt)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(p.createdAt)}</TableCell>
                    <TableCell>{formatDate(p.expireBy)}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      <Tooltip title="Copy link">
                        <span>
                          <IconButton size="small" onClick={() => handleCopy(p.shortUrl)} disabled={!isOpen}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Refresh status from Razorpay">
                        <span>
                          <IconButton size="small" onClick={() => handleRefresh(p._id)} disabled={busy}>
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Cancel link">
                        <span>
                          <IconButton size="small" onClick={() => handleCancel(p._id)} disabled={!isOpen || busy}>
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="center" sx={{ mt: 2 }}>
        <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} />
      </Stack>

      <ManualPaymentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={handleCreated}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManualPayments;
