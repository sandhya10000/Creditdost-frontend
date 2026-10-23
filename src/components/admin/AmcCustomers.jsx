import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
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
  Typography,
} from "@mui/material";
import {
  Edit,
  Autorenew,
  History,
  CheckCircle,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { adminAPI } from "../../services/api";
import AmcDialog from "./AmcDialog";
import {
  AMC_STATUS_CONFIG,
  downloadCsv,
  formatAmcDate,
  formatAmount,
  formatDaysLeft,
} from "../../utils/amc";
import { AmcPaymentChip, AmcStatusChip } from "./AmcChips";

const WORK_STATUS_COLORS = {
  in_progress: { bg: "#0288d1", color: "#fff" },
  closed: { bg: "#2e7d32", color: "#fff" },
  on_hold: { bg: "#ed6c02", color: "#fff" },
};

const rowsPerPage = 20;

const AmcCustomers = () => {
  const [records, setRecords] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [amcStatus, setAmcStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const [dialog, setDialog] = useState({ open: false, mode: "edit", customer: null });
  const [historyCustomer, setHistoryCustomer] = useState(null);
  const [cancelCustomer, setCancelCustomer] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  // Debounce search so we don't fetch on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm, amcStatus, paymentStatus]);

  const buildParams = (overrides = {}) => ({
    page,
    limit: rowsPerPage,
    search: searchTerm,
    amcStatus: amcStatus || undefined,
    paymentStatus: paymentStatus || undefined,
    ...overrides,
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminAPI.getAmcCustomers(buildParams());
      setRecords(response.data.amcData || []);
      setTotalRecords(response.data.total || 0);
      setCounts(response.data.counts || {});
    } catch (err) {
      console.error("Error fetching AMC customers:", err);
      setError("Failed to fetch AMC customers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChipClick = (status) => {
    setAmcStatus((prev) => (prev === status ? "" : status));
    setPage(1);
  };

  const updateWorkStatus = async (id, newStatus) => {
    try {
      await adminAPI.updateBusinessWorkStatus(id, { workStatus: newStatus });
      showToast("Work status has been updated.");
      fetchRecords();
    } catch (err) {
      console.error(err);
      showToast("Failed to update status. Please try again.", "error");
    }
  };

  const handleMarkPaid = async (record) => {
    try {
      setActionLoading(true);
      const response = await adminAPI.upsertAmc(record._id, { paymentStatus: "paid" });
      showToast(response.data.message || "AMC marked as paid");
      fetchRecords();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update payment", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelCustomer) return;
    try {
      setActionLoading(true);
      const response = await adminAPI.cancelAmc(cancelCustomer._id, {
        reason: cancelReason,
      });
      showToast(response.data.message || "AMC cancelled");
      setCancelCustomer(null);
      fetchRecords();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to cancel AMC", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAmcCustomers(
        buildParams({ page: 1, limit: 1000000 }),
      );
      const all = response.data.amcData || [];
      const headers = [
        "Customer ID",
        "Customer Name",
        "Email",
        "Phone",
        "Franchise",
        "Package",
        "AMC From",
        "AMC To",
        "Days Left",
        "AMC Amount",
        "AMC Payment",
        "AMC Status",
        "Work Status",
        "Remarks",
      ];
      const rows = all.map((r) => [
        r.customerId || "",
        r.customerName || "",
        r.customerEmail || "",
        r.customerPhone || "",
        r.franchiseId?.businessName || "Direct",
        r.selectedPackage?.name || "N/A",
        formatAmcDate(r.amc?.startDate),
        formatAmcDate(r.amc?.endDate),
        r.amcDaysLeft ?? "",
        r.amc?.amount ?? "",
        r.amc?.paymentStatus || "",
        AMC_STATUS_CONFIG[r.amcStatus]?.label || "",
        r.workStatus || "",
        r.amc?.remarks || "",
      ]);
      downloadCsv("amc_customers.csv", headers, rows);
    } catch (err) {
      console.error("Error downloading CSV:", err);
      showToast("Failed to download CSV", "error");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(Math.ceil(totalRecords / rowsPerPage), 1);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontSize: { xs: "1.5rem", md: "2rem" } }}>
        AMC Customers
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Status summary — click to filter */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", rowGap: 1 }}>
        {Object.entries(AMC_STATUS_CONFIG).map(([key, config]) => (
          <Chip
            key={key}
            label={`${config.label}: ${counts[key] ?? 0}`}
            color={config.color}
            variant={amcStatus === key ? "filled" : "outlined"}
            onClick={() => handleStatusChipClick(key)}
          />
        ))}
      </Stack>

      <Card sx={{ mt: 2, borderRadius: 2, overflow: "visible" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, flex: 1 }}>
              <TextField
                fullWidth
                placeholder="Search by customer name, email, phone, ID or franchise"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                sx={{ maxWidth: { xs: "100%", sm: 400 } }}
              />
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>AMC Status</InputLabel>
                <Select
                  label="AMC Status"
                  value={amcStatus}
                  onChange={(e) => {
                    setAmcStatus(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {Object.entries(AMC_STATUS_CONFIG).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      {config.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>AMC Payment</InputLabel>
                <Select
                  label="AMC Payment"
                  value={paymentStatus}
                  onChange={(e) => {
                    setPaymentStatus(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button
              variant="contained"
              color="success"
              onClick={handleDownloadCSV}
              sx={{ color: "#fff", width: { xs: "100%", md: "auto" } }}
            >
              Download CSV
            </Button>
          </Box>

          {loading && records.length === 0 ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 1500 }} aria-label="amc customers table">
                <TableHead
                  sx={{
                    "& .MuiTableCell-root": {
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                >
                  <TableRow>
                    <TableCell>Customer ID</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Franchise</TableCell>
                    <TableCell>AMC From</TableCell>
                    <TableCell>AMC To</TableCell>
                    <TableCell>Days Left</TableCell>
                    <TableCell>AMC Amount</TableCell>
                    <TableCell>AMC Payment</TableCell>
                    <TableCell>AMC Status</TableCell>
                    <TableCell>Work Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ "& td": { padding: "6px 8px" } }}>
                  {records.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={13} align="center" sx={{ py: 4 }}>
                        No AMC customers found
                      </TableCell>
                    </TableRow>
                  )}
                  {records.map((record) => {
                    const currentWork = record.workStatus || "in_progress";
                    const workColors = WORK_STATUS_COLORS[currentWork] || {
                      bg: "#757575",
                      color: "#fff",
                    };
                    const needsRenewal =
                      record.amcStatus === "expiring" || record.amcStatus === "expired";
                    return (
                      <TableRow key={record._id}>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          <a href={`customer/${record.customerId}`}>{record.customerId}</a>
                        </TableCell>
                        <TableCell>{record.customerName}</TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 180,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {record.customerEmail}
                        </TableCell>
                        <TableCell>{record.customerPhone}</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>
                          {record.franchiseId?.businessName || "Direct"}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {formatAmcDate(record.amc?.startDate)}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {formatAmcDate(record.amc?.endDate)}
                        </TableCell>
                        <TableCell
                          sx={{
                            whiteSpace: "nowrap",
                            color: record.amcDaysLeft < 0 ? "error.main" : undefined,
                          }}
                        >
                          {formatDaysLeft(record.amcDaysLeft)}
                        </TableCell>
                        <TableCell>{formatAmount(record.amc?.amount)}</TableCell>
                        <TableCell>
                          <AmcPaymentChip status={record.amc?.paymentStatus} />
                        </TableCell>
                        <TableCell>
                          <AmcStatusChip status={record.amcStatus} />
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 130 }}>
                            <Select
                              value={currentWork}
                              onChange={(e) => updateWorkStatus(record._id, e.target.value)}
                              sx={{
                                backgroundColor: workColors.bg,
                                color: workColors.color,
                                fontWeight: 600,
                                fontSize: "0.78rem",
                                borderRadius: "6px",
                                "& .MuiSelect-icon": { color: workColors.color },
                                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                              }}
                            >
                              <MenuItem value="in_progress">In Progress</MenuItem>
                              <MenuItem value="closed">Closed</MenuItem>
                              <MenuItem value="on_hold">On Hold</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                          <IconButton
                            size="small"
                            title="Edit AMC"
                            onClick={() => setDialog({ open: true, mode: "edit", customer: record })}
                          >
                            <Edit />
                          </IconButton>
                          {record.amc?.paymentStatus !== "paid" && (
                            <IconButton
                              size="small"
                              title="Mark AMC as paid"
                              sx={{ color: "success.main" }}
                              disabled={actionLoading}
                              onClick={() => handleMarkPaid(record)}
                            >
                              <CheckCircle />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            title="Renew AMC"
                            sx={{ color: needsRenewal ? "warning.main" : "primary.main" }}
                            onClick={() => setDialog({ open: true, mode: "renew", customer: record })}
                          >
                            <Autorenew />
                          </IconButton>
                          <IconButton
                            size="small"
                            title="AMC history"
                            onClick={() => setHistoryCustomer(record)}
                          >
                            <History />
                          </IconButton>
                          <IconButton
                            size="small"
                            title="Cancel AMC"
                            sx={{ color: "error.main" }}
                            onClick={() => {
                              setCancelReason("");
                              setCancelCustomer(record);
                            }}
                          >
                            <CancelIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  p: 3,
                }}
              >
                <Typography>Total Records: {totalRecords}</Typography>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
                <Typography>
                  Page {page} of {totalPages}
                </Typography>
              </Box>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <AmcDialog
        open={dialog.open}
        mode={dialog.mode}
        customer={dialog.customer}
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
        onSaved={(message) => {
          setDialog((prev) => ({ ...prev, open: false }));
          showToast(message || "AMC saved");
          fetchRecords();
        }}
      />

      {/* AMC History Dialog */}
      <Dialog
        open={Boolean(historyCustomer)}
        onClose={() => setHistoryCustomer(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          AMC History — {historyCustomer?.customerName} ({historyCustomer?.customerId})
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Current term
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {formatAmcDate(historyCustomer?.amc?.startDate)} –{" "}
            {formatAmcDate(historyCustomer?.amc?.endDate)} ·{" "}
            {formatAmount(historyCustomer?.amc?.amount)} ·{" "}
            {historyCustomer?.amc?.paymentStatus === "paid" ? "Paid" : "Pending"}
            {historyCustomer?.amc?.remarks ? ` · ${historyCustomer.amc.remarks}` : ""}
          </Typography>
          <Typography variant="subtitle2">Previous terms</Typography>
          {historyCustomer?.amcHistory?.length ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Ended</TableCell>
                  <TableCell>On</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...historyCustomer.amcHistory].reverse().map((term, index) => (
                  <TableRow key={term._id || index}>
                    <TableCell>{formatAmcDate(term.startDate)}</TableCell>
                    <TableCell>{formatAmcDate(term.endDate)}</TableCell>
                    <TableCell>{formatAmount(term.amount)}</TableCell>
                    <TableCell>{term.paymentStatus === "paid" ? "Paid" : "Pending"}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={term.endedReason === "cancelled" ? "Cancelled" : "Renewed"}
                        color={term.endedReason === "cancelled" ? "error" : "info"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {term.closedAt ? new Date(term.closedAt).toLocaleDateString("en-IN") : "N/A"}
                    </TableCell>
                    <TableCell>
                      {[term.remarks, term.cancelReason].filter(Boolean).join(" · ") || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No previous terms.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryCustomer(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Cancel AMC Dialog */}
      <Dialog
        open={Boolean(cancelCustomer)}
        onClose={() => !actionLoading && setCancelCustomer(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel AMC</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Cancel the AMC for <strong>{cancelCustomer?.customerName}</strong>? The current
            term is kept in history and the customer stays in Business MIS.
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Reason (optional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            inputProps={{ maxLength: 500 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelCustomer(null)} disabled={actionLoading}>
            Keep AMC
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancel}
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={22} /> : "Cancel AMC"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AmcCustomers;
