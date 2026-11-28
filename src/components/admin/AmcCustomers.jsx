import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
  Tooltip,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Edit,
  Autorenew,
  History,
  CheckCircle,
  Cancel as CancelIcon,
  Download as DownloadIcon,
  MoreVert,
} from "@mui/icons-material";
import { adminAPI } from "../../services/api";
import { useAuth } from "../../hooks/useAuth.jsx";
import AmcDialog from "./AmcDialog";
import {
  AMC_STATUS_CONFIG,
  downloadCsv,
  formatAmcDate,
  formatAmount,
  formatDaysLeft,
} from "../../utils/amc";
import { AmcPaymentChip, AmcStatusChip } from "./AmcChips";
import {
  CardAlerts,
  CellText,
  EmptyRow,
  FilterChips,
  LoadingBar,
  SearchField,
  SectionCard,
  TableFooter,
  TableToolbar,
} from "./ui/AdminTable";
import { bodyRowSx, headRowSx, statusSelectSx } from "./ui/tableStyles";

const WORK_STATUS_COLORS = {
  newly_logged: { bg: "#ef6c00", color: "#fff" },
  in_progress: { bg: "#0288d1", color: "#fff" },
  closed: { bg: "#2e7d32", color: "#fff" },
  refunded: { bg: "#c62828", color: "#fff" }, // set or changed only by a full admin
};
const WORK_STATUS_LABELS = {
  newly_logged: "Newly Logged",
  in_progress: "In Progress",
  pending: "Pending",
  closed: "Closed",
  refunded: "Refunded",
};

const rowsPerPage = 20;

const AmcCustomers = ({ embedded = false }) => {
  // Same rule as Business MIS: only a full admin can set or undo Refunded
  const { user } = useAuth();
  const isFullAdmin = user?.subRole === "super_admin";
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
  // Row "more actions" menu; the record is kept while the menu animates closed
  const [rowMenu, setRowMenu] = useState({ anchor: null, record: null });

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

  const updateWorkStatus = async (id, newStatus) => {
    if (
      newStatus === "refunded" &&
      !window.confirm(
        "Mark this case as Refunded? It will be removed from customer package revenue, and only Admin can change it afterwards.",
      )
    ) {
      return;
    }
    try {
      await adminAPI.updateBusinessWorkStatus(id, { workStatus: newStatus });
      showToast("Work status has been updated.");
      fetchRecords();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to update status. Please try again.", "error");
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

  const closeRowMenu = () => setRowMenu((prev) => ({ ...prev, anchor: null }));
  const menuRecord = rowMenu.record;

  return (
    <Box>
      {!embedded && (
        <Typography variant="h4" sx={{ mb: 2, fontSize: { xs: "1.5rem", md: "2rem" } }}>
          AMC
        </Typography>
      )}

      <SectionCard>
        <TableToolbar>
          <SearchField
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search by customer name, email, phone, ID or franchise"
          />
          <Button
            variant="outlined"
            color="success"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadCSV}
            sx={{ whiteSpace: "nowrap" }}
          >
            Download CSV
          </Button>
        </TableToolbar>

        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          justifyContent="space-between"
          sx={{ px: 2, pb: 2 }}
        >
          <FilterChips
            label="Status:"
            options={[
              { value: "", label: "All" },
              ...Object.entries(AMC_STATUS_CONFIG).map(([key, config]) => ({
                value: key,
                label: config.label,
                count: counts[key] ?? 0,
                color: config.color === "default" ? undefined : config.color,
              })),
            ]}
            value={amcStatus}
            onChange={(value) => {
              setAmcStatus(value);
              setPage(1);
            }}
          />
          <FilterChips
            label="Payment:"
            options={[
              { value: "", label: "All" },
              { value: "paid", label: "Paid" },
              { value: "pending", label: "Pending" },
            ]}
            value={paymentStatus}
            onChange={(value) => {
              setPaymentStatus(value);
              setPage(1);
            }}
          />
        </Stack>

        <CardAlerts error={error} onCloseError={() => setError("")} />
        <LoadingBar loading={loading} />

        <TableContainer>
          <Table size="small" sx={{ minWidth: 1200 }} aria-label="amc customers table">
            <TableHead>
              <TableRow sx={headRowSx}>
                <TableCell>Customer ID</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Franchise</TableCell>
                <TableCell>AMC Term</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>AMC Status</TableCell>
                <TableCell>Work Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.length === 0 ? (
                <EmptyRow
                  colSpan={9}
                  loading={loading}
                  title="No AMC customers found"
                  hint={
                    searchTerm || amcStatus || paymentStatus
                      ? "Try a different search or filter."
                      : "Customers enrolled in AMC appear here."
                  }
                />
              ) : (
                records.map((record) => {
                  const currentWork = record.workStatus || "newly_logged";
                  const workColors = WORK_STATUS_COLORS[currentWork] || {
                    bg: "#757575",
                    color: "#fff",
                  };
                  const needsRenewal =
                    record.amcStatus === "expiring" || record.amcStatus === "expired";
                  return (
                    <TableRow key={record._id} hover sx={bodyRowSx}>
                      {/* Customer ID; the name shows on hover */}
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Tooltip title={record.customerName || ""} placement="top-start" arrow>
                          <Typography
                            component={RouterLink}
                            to={`/admin/customer/${record.customerId}`}
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: "primary.main",
                              textDecoration: "none",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            {record.customerId}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 220 }}>
                        <CellText variant="body2">{record.customerEmail}</CellText>
                        <Typography variant="caption" color="text.secondary">
                          {record.customerPhone}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 180 }}>
                        <CellText variant="body2">
                          {record.franchiseId?.businessName || "Direct"}
                        </CellText>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography variant="body2">
                          {formatAmcDate(record.amc?.startDate)} →{" "}
                          {formatAmcDate(record.amc?.endDate)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={record.amcDaysLeft < 0 ? "error.main" : "text.secondary"}
                        >
                          {formatDaysLeft(record.amcDaysLeft)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                        {formatAmount(record.amc?.amount)}
                      </TableCell>
                      <TableCell>
                        <AmcPaymentChip status={record.amc?.paymentStatus} />
                      </TableCell>
                      <TableCell>
                        <AmcStatusChip status={record.amcStatus} />
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={currentWork}
                          disabled={currentWork === "refunded" && !isFullAdmin}
                          renderValue={(value) => WORK_STATUS_LABELS[value] || value}
                          onChange={(e) => updateWorkStatus(record._id, e.target.value)}
                          sx={{ minWidth: 140, ...statusSelectSx(workColors.bg, workColors.color) }}
                        >
                          <MenuItem value="newly_logged">Newly Logged</MenuItem>
                          <MenuItem value="in_progress">In Progress</MenuItem>
                          <MenuItem value="closed">Closed</MenuItem>
                          <MenuItem value="refunded" disabled={!isFullAdmin}>
                            Refunded{!isFullAdmin ? " (Admin only)" : ""}
                          </MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        <Tooltip title="Edit AMC">
                          <IconButton
                            size="small"
                            onClick={() => setDialog({ open: true, mode: "edit", customer: record })}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={needsRenewal ? "Renew AMC (due)" : "Renew AMC"}>
                          <IconButton
                            size="small"
                            sx={{ color: needsRenewal ? "warning.main" : "primary.main" }}
                            onClick={() => setDialog({ open: true, mode: "renew", customer: record })}
                          >
                            <Autorenew fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More actions">
                          <IconButton
                            size="small"
                            aria-label="More actions"
                            onClick={(e) => setRowMenu({ anchor: e.currentTarget, record })}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TableFooter
          page={page}
          rowsPerPage={rowsPerPage}
          total={totalRecords}
          onPageChange={setPage}
        />
      </SectionCard>

      {/* Row "more actions" menu */}
      <Menu
        anchorEl={rowMenu.anchor}
        open={Boolean(rowMenu.anchor)}
        onClose={closeRowMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { minWidth: 210 } }}
      >
        {menuRecord?.amc?.paymentStatus !== "paid" && (
          <MenuItem
            disabled={actionLoading}
            onClick={() => {
              closeRowMenu();
              handleMarkPaid(menuRecord);
            }}
          >
            <ListItemIcon>
              <CheckCircle fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Mark AMC as paid</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            closeRowMenu();
            setHistoryCustomer(menuRecord);
          }}
        >
          <ListItemIcon>
            <History fontSize="small" />
          </ListItemIcon>
          <ListItemText>AMC history</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            closeRowMenu();
            setCancelReason("");
            setCancelCustomer(menuRecord);
          }}
        >
          <ListItemIcon>
            <CancelIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Cancel AMC</ListItemText>
        </MenuItem>
      </Menu>

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
        PaperProps={{ sx: { borderRadius: 3 } }}
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
            <Table size="small" sx={{ mt: 1 }}>
              <TableHead>
                <TableRow sx={headRowSx}>
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
        PaperProps={{ sx: { borderRadius: 3 } }}
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
