import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import ManualPaymentDialog from "./ManualPaymentDialog";
import { adminAPI } from "../../services/api";
import {
  PageHeader,
  SectionCard,
  TableToolbar,
  SearchField,
  FilterChips,
  EmptyRow,
  LoadingBar,
  TableFooter,
} from "./ui/AdminTable";
import { headRowSx, bodyRowSx, primaryButtonSx } from "./ui/tableStyles";

const PAGE_SIZE = 20;
const COLUMN_COUNT = 9;
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
  // The backend syncs open links with the payment gateway every 30s, so changes show up here.
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
      showToast("Status refreshed from payment gateway");
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

  return (
    <Box>
      <PageHeader
        title="Manual Payments"
        subtitle="Payment links created for customers who pay outside the partner flow."
        actions={
          <>
            {hasOpenLinks && (
              <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "center", mr: 1 }}>
                Auto-updating
              </Typography>
            )}
            <Button
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={primaryButtonSx}
            >
              Create payment
            </Button>
          </>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <SectionCard>
        <TableToolbar>
          <SearchField value={searchInput} onChange={setSearchInput} placeholder="Search name or city" />
          <FilterChips
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={[
              { value: "", label: "All" },
              ...Object.entries(STATUS_META).map(([value, meta]) => ({
                value,
                label: meta.label,
                color: meta.color === "default" ? undefined : meta.color,
              })),
            ]}
          />
        </TableToolbar>
        <LoadingBar loading={loading} />

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={headRowSx}>
                <TableCell>Name</TableCell>
                <TableCell>City</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created by</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && payments.length === 0 && (
                <EmptyRow colSpan={COLUMN_COUNT} title="No manual payments yet" hint="Create a payment link to get started." />
              )}
              {payments.map((p) => {
                const meta = STATUS_META[p.status] || { label: p.status, color: "default" };
                const isOpen = p.status === "created";
                const busy = busyId === p._id;
                return (
                  <TableRow key={p._id} hover sx={bodyRowSx}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {p.name}
                      </Typography>
                      {/* Older links were created with a mobile number */}
                      {p.mobile && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {p.mobile}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{p.city || "-"}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                      ₹{p.amount}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap title={p.remarks || ""}>
                        {p.remarks || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip size="small" variant="outlined" label={meta.label} color={meta.color} />
                      {p.status === "paid" && p.paidAt && (
                        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                          {formatDate(p.paidAt)}
                        </Typography>
                      )}
                      {/* New links are Razorpay-only; flag the older Cashfree ones */}
                      {p.gateway === "cashfree" && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          via Cashfree
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {p.createdBy ? (
                        <>
                          {p.createdBy.name || "-"}
                          {p.createdBy.roleLabel && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {p.createdBy.roleLabel}
                            </Typography>
                          )}
                        </>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{formatDate(p.createdAt)}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{formatDate(p.expireBy)}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      <Tooltip title="Copy link">
                        <span>
                          <IconButton size="small" onClick={() => handleCopy(p.shortUrl)} disabled={!isOpen}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Refresh status from payment gateway">
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
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TableFooter page={page} rowsPerPage={PAGE_SIZE} total={total} onPageChange={setPage} />
      </SectionCard>

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
