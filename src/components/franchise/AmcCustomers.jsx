import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
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
import { franchiseAPI } from "../../services/api";
import {
  AMC_STATUS_CONFIG,
  downloadCsv,
  formatAmcDate,
  formatAmount,
  formatDaysLeft,
} from "../../utils/amc";
import { AmcPaymentChip, AmcStatusChip } from "../admin/AmcChips";

const WORK_STATUS_CONFIG = {
  in_progress: { label: "In Progress", color: "info" },
  closed: { label: "Closed", color: "success" },
  on_hold: { label: "On Hold", color: "warning" },
};

const rowsPerPage = 20;

// Read-only list of this franchise's AMC customers
const AmcCustomers = () => {
  const [records, setRecords] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [amcStatus, setAmcStatus] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);

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
  }, [page, searchTerm, amcStatus]);

  const buildParams = (overrides = {}) => ({
    page,
    limit: rowsPerPage,
    search: searchTerm,
    amcStatus: amcStatus || undefined,
    ...overrides,
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await franchiseAPI.getAmcCustomers(buildParams());
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

  const handleDownloadCSV = async () => {
    try {
      setLoading(true);
      const response = await franchiseAPI.getAmcCustomers(
        buildParams({ page: 1, limit: 1000000 }),
      );
      const headers = [
        "Customer ID",
        "Customer Name",
        "Email",
        "Phone",
        "Package",
        "AMC From",
        "AMC To",
        "Days Left",
        "AMC Amount",
        "AMC Payment",
        "AMC Status",
        "Work Status",
      ];
      const rows = (response.data.amcData || []).map((r) => [
        r.customerId || "",
        r.customerName || "",
        r.customerEmail || "",
        r.customerPhone || "",
        r.selectedPackage?.name || "N/A",
        formatAmcDate(r.amc?.startDate),
        formatAmcDate(r.amc?.endDate),
        r.amcDaysLeft ?? "",
        r.amc?.amount ?? "",
        r.amc?.paymentStatus || "",
        AMC_STATUS_CONFIG[r.amcStatus]?.label || "",
        WORK_STATUS_CONFIG[r.workStatus]?.label || "",
      ]);
      downloadCsv("amc_customers.csv", headers, rows);
    } catch (err) {
      console.error("Error downloading CSV:", err);
      setError("Failed to download CSV");
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

      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", rowGap: 1 }}>
        {Object.entries(AMC_STATUS_CONFIG).map(([key, config]) => (
          <Chip
            key={key}
            label={`${config.label}: ${counts[key] ?? 0}`}
            color={config.color}
            variant={amcStatus === key ? "filled" : "outlined"}
            onClick={() => {
              setAmcStatus((prev) => (prev === key ? "" : key));
              setPage(1);
            }}
          />
        ))}
      </Stack>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, flex: 1 }}>
              <TextField
                fullWidth
                placeholder="Search by customer name, email, phone or ID"
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
            </Box>
            <Button variant="contained" color="success" onClick={handleDownloadCSV} sx={{ color: "#fff" }}>
              Download CSV
            </Button>
          </Box>

          {loading && records.length === 0 ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 1100 }}>
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
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>AMC From</TableCell>
                    <TableCell>AMC To</TableCell>
                    <TableCell>Days Left</TableCell>
                    <TableCell>AMC Amount</TableCell>
                    <TableCell>AMC Payment</TableCell>
                    <TableCell>AMC Status</TableCell>
                    <TableCell>Work Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                        No AMC customers found
                      </TableCell>
                    </TableRow>
                  )}
                  {records.map((record) => {
                    const work = WORK_STATUS_CONFIG[record.workStatus || "in_progress"];
                    return (
                      <TableRow key={record._id}>
                        <TableCell>{record.customerId}</TableCell>
                        <TableCell>{record.customerName}</TableCell>
                        <TableCell>{record.customerEmail}</TableCell>
                        <TableCell>{record.customerPhone}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {formatAmcDate(record.amc?.startDate)}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {formatAmcDate(record.amc?.endDate)}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
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
                          <Chip
                            label={work?.label || "N/A"}
                            color={work?.color || "default"}
                            size="small"
                          />
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
                />
                <Typography>
                  Page {page} of {totalPages}
                </Typography>
              </Box>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AmcCustomers;
