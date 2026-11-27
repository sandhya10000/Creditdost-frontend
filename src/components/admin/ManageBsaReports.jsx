import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Tooltip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  TablePagination,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { PageHeader, SectionCard, TableToolbar, SearchField, EmptyRow, LoadingBar } from "./ui/AdminTable";
import { headRowSx, bodyRowSx, primaryButtonSx } from "./ui/tableStyles";

const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

const fmtDateTime = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? String(v)
    : d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const formatName = (name = "") =>
  String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const ManageBsaReports = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // 0-based for MUI TablePagination
  const [limit, setLimit] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [openingOriginalId, setOpeningOriginalId] = useState(null);

  // Tabs: 0: All, 1: Success, 2: Failed, 3: Processing
  const [activeTab, setActiveTab] = useState(0);
  const tabStatus =
    activeTab === 1 ? "Success" : activeTab === 2 ? "Failed" : activeTab === 3 ? "Processing" : "All";

  const [filters, setFilters] = useState({ search: "", partnerSearch: "", startDate: "", endDate: "" });
  const [debounced, setDebounced] = useState({ search: "", partnerSearch: "" });

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced({ search: filters.search, partnerSearch: filters.partnerSearch });
      setPage(0);
    }, 350);
    return () => clearTimeout(t);
  }, [filters.search, filters.partnerSearch]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      const params = new URLSearchParams({
        page: page + 1,
        limit,
        status: tabStatus,
        ...(debounced.search && { search: debounced.search }),
        ...(debounced.partnerSearch && { partnerSearch: debounced.partnerSearch }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      }).toString();

      const res = await axios.get(`${API_BASE}/admin/bsa-reports?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        setRows(res.data.data || []);
        setTotalCount(res.data.total ?? 0);
      } else {
        setError("Failed to load bank statement reports.");
      }
    } catch (err) {
      console.error("Failed to load admin bank statement reports:", err);
      setError(err.response?.data?.message || "Failed to load bank statement reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, limit, debounced, activeTab, filters.startDate, filters.endDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const openPdf = async (row) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      const res = await axios.get(`${API_BASE}/admin/bsa-reports/${row.id}/report`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    } catch (err) {
      console.error("[BSA] admin open PDF failed:", err);
      alert("Could not open the report PDF.");
    }
  };

  const downloadPdf = async (row) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      const res = await axios.get(`${API_BASE}/admin/bsa-reports/${row.id}/report?download=1`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `bank-statement-analysis-${row.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    } catch (err) {
      console.error("[BSA] admin download PDF failed:", err);
      alert("Could not download the report PDF.");
    }
  };

  const openOriginalStatement = async (row) => {
    try {
      setOpeningOriginalId(row.id);
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      const res = await axios.get(`${API_BASE}/admin/bsa-reports/${row.id}/original-statement`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    } catch (err) {
      console.error("[BSA] admin open original statement failed:", err);
      alert("Original statement file is not available on disk for this record.");
    } finally {
      setOpeningOriginalId(null);
    }
  };

  const renderStatus = (status) => {
    const color = status === "Success" ? "success" : status === "Failed" ? "error" : "info";
    return <Chip label={status} size="small" color={color} variant="outlined" sx={{ fontWeight: 600 }} />;
  };

  return (
    <Box>
      <PageHeader
        title={`Bank statement analyzer (${totalCount})`}
        subtitle="Analyses from all franchise partners, with PDF inspection and verification."
      />

      <Tabs
        value={activeTab}
        onChange={(_, v) => {
          setActiveTab(v);
          setPage(0);
        }}
        sx={{
          mb: 3,
          minHeight: 40,
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600 },
        }}
      >
        <Tab label="All" />
        <Tab label="Successful" />
        <Tab label="Failed" />
        <Tab label="Processing" />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <SectionCard>
        <TableToolbar>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ md: "center" }} flexWrap="wrap" useFlexGap sx={{ width: "100%" }}>
            <SearchField
              value={filters.search}
              onChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
              placeholder="Search file, account holder or bank"
              sx={{ maxWidth: { md: 320 } }}
            />
            <SearchField
              value={filters.partnerSearch}
              onChange={(value) => setFilters((prev) => ({ ...prev, partnerSearch: value }))}
              placeholder="Search partner or ID"
              sx={{ maxWidth: { md: 240 } }}
            />
            <TextField
              size="small"
              type="date"
              label="From"
              InputLabelProps={{ shrink: true }}
              value={filters.startDate}
              onChange={(e) => {
                setFilters((p) => ({ ...p, startDate: e.target.value }));
                setPage(0);
              }}
              sx={{ width: { xs: "48%", sm: 160 } }}
            />
            <TextField
              size="small"
              type="date"
              label="To"
              InputLabelProps={{ shrink: true }}
              value={filters.endDate}
              onChange={(e) => {
                setFilters((p) => ({ ...p, endDate: e.target.value }));
                setPage(0);
              }}
              sx={{ width: { xs: "48%", sm: 160 } }}
            />
            {(filters.search || filters.partnerSearch || filters.startDate || filters.endDate) && (
              <Button
                size="small"
                onClick={() => {
                  setFilters({ search: "", partnerSearch: "", startDate: "", endDate: "" });
                  setPage(0);
                }}
                sx={{ textTransform: "none", fontWeight: 600, alignSelf: { md: "center" } }}
              >
                Clear filters
              </Button>
            )}
          </Stack>
        </TableToolbar>
        <LoadingBar loading={loading} />

        <TableContainer>
          <Table size="small" sx={{ minWidth: 950 }}>
            <TableHead>
              <TableRow sx={headRowSx}>
                <TableCell>Date</TableCell>
                <TableCell>Partner ID</TableCell>
                <TableCell>Partner</TableCell>
                <TableCell>Account holder</TableCell>
                <TableCell>Bank</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Statement</TableCell>
                <TableCell align="right">Report</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(loading || rows.length === 0) && (
                <EmptyRow
                  colSpan={8}
                  loading={loading}
                  title="No bank statement analyses found"
                  hint="Try adjusting your search criteria or date filters."
                />
              )}
              {!loading &&
                rows.map((row) => {
                  const partnerId = row.userId?.partner_id || "—";
                  const partnerName = formatName(row.userId?.name || "Partner");
                  const isOpening = openingOriginalId === row.id;

                  return (
                    <TableRow key={row.id} hover sx={bodyRowSx}>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{fmtDateTime(row.createdAt)}</TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap", fontFamily: "monospace", fontWeight: 700 }}>
                        {partnerId}
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {partnerName}
                        </Typography>
                      </TableCell>

                      <TableCell>{row.accountHolderName || "—"}</TableCell>

                      <TableCell>{row.bankName || "—"}</TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {renderStatus(row.status)}
                          {row.status === "Failed" && row.failureReason && (
                            <Tooltip title={row.failureReason}>
                              <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 160, cursor: "pointer" }}>
                                {row.failureReason}
                              </Typography>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>

                      <TableCell align="center">
                        {row.hasOriginalStatement ? (
                          <Tooltip title={`View original statement: ${row.fileName || "statement.pdf"}`}>
                            <span>
                              <IconButton size="small" onClick={() => openOriginalStatement(row)} disabled={isOpening}>
                                {isOpening ? <CircularProgress size={16} /> : <VisibilityIcon fontSize="small" />}
                              </IconButton>
                            </span>
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" color="text.disabled">
                            —
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {row.status === "Success" ? (
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<PictureAsPdfIcon sx={{ fontSize: 16 }} />}
                              onClick={() => openPdf(row)}
                              sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "divider", color: "text.primary" }}
                            >
                              PDF
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              disableElevation
                              startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                              onClick={() => downloadPdf(row)}
                              sx={primaryButtonSx}
                            >
                              Download
                            </Button>
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.disabled">
                            —
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={totalCount}
          rowsPerPage={limit}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setLimit(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ borderTop: 1, borderColor: "divider" }}
        />
      </SectionCard>
    </Box>
  );
};

export default ManageBsaReports;
