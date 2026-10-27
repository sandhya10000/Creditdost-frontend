import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";
import {
  addDays,
  formatDay,
  getFollowUpStatus,
  toDayString,
} from "../../utils/followUp";

const monthStart = () => {
  const now = new Date();
  return toDayString(new Date(now.getFullYear(), now.getMonth(), 1));
};
const monthEnd = () => {
  const now = new Date();
  return toDayString(new Date(now.getFullYear(), now.getMonth() + 1, 0));
};

// Quick presets set the from/to range in one click
const PRESETS = [
  { key: "all", label: "All scheduled", range: () => ({ from: "", to: "" }) },
  { key: "overdue", label: "Overdue", range: () => ({ from: "", to: addDays(-1) }) },
  { key: "today", label: "Due today", range: () => ({ from: toDayString(), to: toDayString() }) },
  { key: "week", label: "Next 7 days", range: () => ({ from: toDayString(), to: addDays(7) }) },
  { key: "month", label: "This month", range: () => ({ from: monthStart(), to: monthEnd() }) },
];

const EMPTY_FILTERS = { search: "", from: "", to: "", customerType: "" };

const BusinessFollowUps = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const [activePreset, setActivePreset] = useState("all");

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [busyId, setBusyId] = useState(null);

  // Debounce search so typing does not fire a request per key
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) =>
        prev.search === searchInput.trim() ? prev : { ...prev, search: searchInput.trim() },
      );
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminAPI.getBusinessFollowUps({
        page: page + 1,
        limit: rowsPerPage,
        search: filters.search,
        fromDate: filters.from,
        toDate: filters.to,
        customerType: filters.customerType,
      });
      setRows(res.data.businessData || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching follow-ups:", err);
      setError("Failed to load follow-ups. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [page, rowsPerPage, filters]);

  const applyPreset = (preset) => {
    const { from, to } = preset.range();
    setActivePreset(preset.key);
    setFilters((prev) => ({ ...prev, from, to }));
    setPage(0);
  };

  const updateFilter = (key, value) => {
    setActivePreset("custom");
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const resetFilters = () => {
    setSearchInput("");
    setActivePreset("all");
    setFilters(EMPTY_FILTERS);
    setPage(0);
  };

  const hasActiveFilters = useMemo(
    () => Boolean(filters.search || filters.from || filters.to || filters.customerType),
    [filters],
  );

  const handleMarkDone = async (form) => {
    try {
      setBusyId(form._id);
      await adminAPI.clearBusinessFollowUp(form._id);
      setFeedback({ severity: "success", message: `Follow-up for ${form.customerName} marked as done` });
      fetchFollowUps();
    } catch (err) {
      setFeedback({
        severity: "error",
        message: err.response?.data?.message || "Failed to mark follow-up as done",
      });
    } finally {
      setBusyId(null);
    }
  };

  // Note that belongs to the scheduled date (falls back to the latest one)
  const noteFor = (form) => {
    const history = form.followUpHistory || [];
    const match = [...history].reverse().find((h) => h.followUpDate === form.nextFollowUpDate);
    return (match || history[history.length - 1])?.note || "";
  };

  const workStatusChip = (status) => {
    const map = {
      closed: { label: "Closed", color: "success" },
      on_hold: { label: "On Hold", color: "warning" },
      hold: { label: "Hold", color: "error" },
      pending: { label: "Pending", color: "secondary" },
    };
    const config = map[status] || { label: "In Progress", color: "info" };
    return <Chip size="small" label={config.label} color={config.color} sx={{ color: "#fff" }} />;
  };

  return (
    <Box>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, fontWeight: 700 }}>
            Follow-ups
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Customers scheduled for a follow-up call, soonest first
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/business-forms/individual")}
        >
          Back to Business MIS
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {feedback && (
        <Alert severity={feedback.severity} sx={{ mb: 2 }} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: "visible" }}>
        <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: "1px solid", borderColor: "divider" }}>
          {/* Quick presets */}
          <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
            {PRESETS.map((preset) => (
              <Chip
                key={preset.key}
                label={preset.label}
                clickable
                color={activePreset === preset.key ? "primary" : "default"}
                variant={activePreset === preset.key ? "filled" : "outlined"}
                onClick={() => applyPreset(preset)}
              />
            ))}
          </Stack>

          {/* Filters */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
            <TextField
              size="small"
              placeholder="Search name, phone, email, customer ID or franchise"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ flex: 2, minWidth: { md: 280 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              size="small"
              type="date"
              label="From"
              value={filters.from}
              onChange={(e) => updateFilter("from", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 160 }}
            />
            <TextField
              size="small"
              type="date"
              label="To"
              value={filters.to}
              onChange={(e) => updateFilter("to", e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: filters.from || undefined }}
              sx={{ minWidth: 160 }}
            />
            <Select
              size="small"
              displayEmpty
              value={filters.customerType}
              onChange={(e) => updateFilter("customerType", e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">All customers</MenuItem>
              <MenuItem value="individual">Individual</MenuItem>
              <MenuItem value="business">Business</MenuItem>
            </Select>
            {hasActiveFilters && (
              <Button startIcon={<ClearIcon />} onClick={resetFilters} sx={{ whiteSpace: "nowrap" }}>
                Reset
              </Button>
            )}
          </Stack>
        </Box>

        {loading && <LinearProgress />}

        <TableContainer component={Paper} elevation={0} sx={{ overflowX: "auto", borderRadius: 0 }}>
          <Table size="small" sx={{ minWidth: 1100 }} aria-label="follow-up table">
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: 700, backgroundColor: "#f8f9fa", whiteSpace: "nowrap" } }}>
                <TableCell>Follow-up date</TableCell>
                <TableCell>Customer ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Franchise</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Work status</TableCell>
                <TableCell sx={{ minWidth: 220 }}>Latest note</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography fontWeight={600}>No follow-ups found</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {hasActiveFilters
                        ? "Try a different date range or search."
                        : "Schedule a follow-up from a customer's Follow Up tab."}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {rows.map((form) => {
                const status = getFollowUpStatus(form.nextFollowUpDate);
                const note = noteFor(form);
                return (
                  <TableRow
                    key={form._id}
                    hover
                    sx={{
                      "& td": { py: 1 },
                      backgroundColor: status.key === "overdue" ? "rgba(211, 47, 47, 0.04)" : undefined,
                    }}
                  >
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight={600}>
                          {formatDay(form.nextFollowUpDate)}
                        </Typography>
                        <Chip
                          size="small"
                          label={status.label}
                          color={status.color}
                          variant="outlined"
                          sx={{ width: "fit-content" }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Box
                        component="a"
                        href={`/admin/customer/${form.customerId}`}
                        sx={{ color: "primary.main", fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                      >
                        {form.customerId || "-"}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {form.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {form.customerEmail}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{form.customerPhone}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{form.franchiseId?.businessName || "N/A"}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{form.selectedPackage?.name || "N/A"}</TableCell>
                    <TableCell>{workStatusChip(form.workStatus)}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={note ? "text.primary" : "text.disabled"}
                        sx={{
                          maxWidth: 260,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {note || "No note"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      <Tooltip title="Mark as done (history is kept)">
                        <span>
                          <IconButton
                            color="success"
                            onClick={() => handleMarkDone(form)}
                            disabled={busyId === form._id}
                          >
                            {busyId === form._id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <CheckCircleOutlineIcon />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50, 100]}
            labelRowsPerPage="Rows"
          />
        </TableContainer>
      </Card>
    </Box>
  );
};

export default BusinessFollowUps;
