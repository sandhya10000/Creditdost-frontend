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
  Paper,
  TablePagination,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

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
    if (status === "Success") {
      return (
        <Chip
          label="• Success"
          size="small"
          sx={{
            bgcolor: "#ECFDF5",
            color: "#059669",
            fontWeight: 700,
            fontSize: "0.78rem",
            borderRadius: "16px",
            height: 24,
          }}
        />
      );
    }
    if (status === "Failed") {
      return (
        <Chip
          label="• Failed"
          size="small"
          sx={{
            bgcolor: "#FEF2F2",
            color: "#DC2626",
            fontWeight: 700,
            fontSize: "0.78rem",
            borderRadius: "16px",
            height: 24,
          }}
        />
      );
    }
    return (
      <Chip
        label={`• ${status}`}
        size="small"
        sx={{
          bgcolor: "#EFF6FF",
          color: "#2563EB",
          fontWeight: 700,
          fontSize: "0.78rem",
          borderRadius: "16px",
          height: 24,
        }}
      />
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Title & Stats */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", mb: 0.5 }}>
          Bank Statement Analyses ({totalCount})
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B" }}>
          Every bank statement analysis processed across all franchise partners with instant PDF inspection and verification.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => {
            setActiveTab(v);
            setPage(0);
          }}
          sx={{
            minHeight: 40,
            "& .MuiTab-root": {
              minHeight: 40,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              px: 2,
            },
          }}
        >
          <Tab label="All" />
          <Tab label="Successful" />
          <Tab label="Failed" />
          <Tab label="Processing" />
        </Tabs>
      </Box>

      {/* Filter Toolbar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2.5,
          border: "1px solid #E2E8F0",
          borderRadius: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "center",
          bgcolor: "#fff",
        }}
      >
        <TextField
          size="small"
          placeholder="Search file, account holder or bank…"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          sx={{
            minWidth: { xs: "100%", sm: 260 },
            flexGrow: 1,
            "& .MuiOutlinedInput-root": { borderRadius: 1.5, fontSize: "0.85rem" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          size="small"
          placeholder="Search partner / ID…"
          value={filters.partnerSearch}
          onChange={(e) => setFilters((prev) => ({ ...prev, partnerSearch: e.target.value }))}
          sx={{
            width: { xs: "100%", sm: 200 },
            "& .MuiOutlinedInput-root": { borderRadius: 1.5, fontSize: "0.85rem" },
          }}
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
          sx={{ width: { xs: "48%", sm: 150 }, "& .MuiOutlinedInput-root": { borderRadius: 1.5, fontSize: "0.82rem" } }}
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
          sx={{ width: { xs: "48%", sm: 150 }, "& .MuiOutlinedInput-root": { borderRadius: 1.5, fontSize: "0.82rem" } }}
        />

        {(filters.search || filters.partnerSearch || filters.startDate || filters.endDate) && (
          <Button
            size="small"
            onClick={() => {
              setFilters({ search: "", partnerSearch: "", startDate: "", endDate: "" });
              setPage(0);
            }}
            sx={{ textTransform: "none", color: "#64748B", fontWeight: 600 }}
          >
            Clear Filters
          </Button>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 1.5 }}>
          {error}
        </Alert>
      )}

      {/* Main Table Paper */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #E2E8F0",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 950 }} size="medium">
            <TableHead sx={{ bgcolor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "#64748B", letterSpacing: "0.5px" }}>
                  DATE
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "#64748B", letterSpacing: "0.5px" }}>
                  PARTNER ID
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "#64748B", letterSpacing: "0.5px" }}>
                  PARTNER
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "#64748B", letterSpacing: "0.5px" }}>
                  ACCOUNT HOLDER
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "#64748B", letterSpacing: "0.5px" }}>
                  BANK
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "#64748B", letterSpacing: "0.5px" }}>
                  STATUS
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, fontSize: "0.75rem", color: "#64748B", letterSpacing: "0.5px" }}
                >
                  UPLOADED STATEMENT
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 700, fontSize: "0.75rem", color: "#64748B", letterSpacing: "0.5px", pr: 3 }}
                >
                  REPORT
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={32} sx={{ color: "#2563EB" }} />
                    <Typography variant="body2" sx={{ mt: 1.5, color: "#64748B" }}>
                      Loading bank statement analyses...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: "#334155" }}>
                      No bank statement analyses found
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
                      Try adjusting your search criteria or date filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  const partnerId = row.userId?.partner_id || "—";
                  const partnerName = formatName(row.userId?.name || "Partner");
                  const isOpening = openingOriginalId === row.id;

                  return (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { bgcolor: "#F8FAFC" },
                      }}
                    >
                      {/* Date */}
                      <TableCell sx={{ fontSize: "0.82rem", color: "#334155", whiteSpace: "nowrap" }}>
                        {fmtDateTime(row.createdAt)}
                      </TableCell>

                      {/* Partner ID */}
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            color: "#1D4ED8",
                            fontFamily: "monospace",
                          }}
                        >
                          {partnerId}
                        </Typography>
                      </TableCell>

                      {/* Partner Name */}
                      <TableCell sx={{ fontSize: "0.82rem", color: "#1E293B", fontWeight: 500 }}>
                        {partnerName}
                      </TableCell>

                      {/* Account Holder */}
                      <TableCell sx={{ fontSize: "0.82rem", color: "#334155" }}>
                        {row.accountHolderName || "—"}
                      </TableCell>

                      {/* Bank */}
                      <TableCell sx={{ fontSize: "0.82rem", color: "#334155", fontWeight: 500 }}>
                        {row.bankName || "—"}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {renderStatus(row.status)}
                          {row.status === "Failed" && row.failureReason && (
                            <Tooltip title={row.failureReason}>
                              <Typography
                                sx={{
                                  fontSize: "0.72rem",
                                  color: "#94A3B8",
                                  maxWidth: 160,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  cursor: "pointer",
                                }}
                              >
                                {row.failureReason}
                              </Typography>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>

                      {/* Uploaded Statement Action */}
                      <TableCell align="center">
                        {row.hasOriginalStatement ? (
                          <Tooltip title={`View original statement: ${row.fileName || "statement.pdf"}`}>
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => openOriginalStatement(row)}
                                disabled={isOpening}
                                sx={{
                                  color: "#2563EB",
                                  bgcolor: "#EFF6FF",
                                  "&:hover": { bgcolor: "#DBEAFE" },
                                }}
                              >
                                {isOpening ? (
                                  <CircularProgress size={16} color="inherit" />
                                ) : (
                                  <VisibilityIcon sx={{ fontSize: 18 }} />
                                )}
                              </IconButton>
                            </span>
                          </Tooltip>
                        ) : (
                          <Typography sx={{ color: "#CBD5E1", fontSize: "0.75rem" }}>—</Typography>
                        )}
                      </TableCell>

                      {/* Report Actions */}
                      <TableCell align="right" sx={{ pr: 3 }}>
                        {row.status === "Success" ? (
                          <Box sx={{ display: "inline-flex", gap: 1, alignItems: "center" }}>
                            {/* PDF Button */}
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<PictureAsPdfIcon sx={{ color: "#DC2626", fontSize: 16 }} />}
                              onClick={() => openPdf(row)}
                              sx={{
                                borderColor: "#E2E8F0",
                                color: "#1E293B",
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "none",
                                py: 0.4,
                                px: 1.2,
                                borderRadius: 1.5,
                                bgcolor: "#fff",
                                "&:hover": { bgcolor: "#F8FAFC", borderColor: "#CBD5E1" },
                              }}
                            >
                              PDF
                            </Button>

                            {/* Download Button */}
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                              onClick={() => downloadPdf(row)}
                              sx={{
                                bgcolor: "#2563EB",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "none",
                                py: 0.4,
                                px: 1.4,
                                borderRadius: 1.5,
                                boxShadow: "none",
                                "&:hover": { bgcolor: "#1D4ED8", boxShadow: "none" },
                              }}
                            >
                              Download
                            </Button>
                          </Box>
                        ) : (
                          <Typography sx={{ color: "#CBD5E1", fontSize: "0.75rem" }}>—</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
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
          sx={{
            borderTop: "1px solid #E2E8F0",
          }}
        />
      </Paper>
    </Box>
  );
};

export default ManageBsaReports;
