import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Grid,
  Divider,
} from "@mui/material";
import {
  Visibility,
  Delete,
  Search as SearchIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { adminAPI } from "../../../services/api";

const STATUS_COLORS = {
  New: "error",
  Contacted: "warning",
  "In Progress": "info",
  Resolved: "success",
};

const PROBLEM_TYPES = [
  "Loan Rejection",
  "Settlement Update",
  "Report Error",
  "DPD",
  "Low Score",
  "Suit File",
  "Other",
];

const CreditScoreRepair = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [problemTypeFilter, setProblemTypeFilter] = useState("all");
  const [enquiryTypeFilter, setEnquiryTypeFilter] = useState("all");

  // Modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        page,
        limit: 10,
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(problemTypeFilter !== "all" && { problemType: problemTypeFilter }),
        ...(enquiryTypeFilter !== "all" && { enquiryType: enquiryTypeFilter }),
      };
      const response = await adminAPI.getCreditRepairEnquiries(params);
      setEnquiries(response.data.enquiries || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
      setError("Failed to fetch enquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, problemTypeFilter, enquiryTypeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEnquiries();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminAPI.updateCreditRepairEnquiryStatus(id, newStatus);
      // Optimistically update the local list
      setEnquiries((prev) =>
        prev.map((enq) =>
          enq._id === id ? { ...enq, status: newStatus } : enq
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await adminAPI.deleteCreditRepairEnquiry(enquiryToDelete._id);
      setDeleteDialogOpen(false);
      setEnquiryToDelete(null);
      fetchEnquiries();
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
      alert("Failed to delete enquiry. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const downloadCSV = () => {
    if (enquiries.length === 0) {
      alert("No data to export.");
      return;
    }
    const headers = [
      "Created Date",
      "Full Name",
      "Mobile Number",
      "Email ID",
      "Current Credit Score",
      "City",
      "State",
      "Problem Type",
      "Occupation",
      "Monthly Income",
      "Language",
      "Status",
    ];

    const rows = enquiries.map((item) => [
      new Date(item.createdAt).toLocaleDateString(),
      `"${item.fullName || ""}"`,
      `"${item.mobileNumber || ""}"`,
      `"${item.email || ""}"`,
      `"${item.creditScore || ""}"`,
      `"${item.city || ""}"`,
      `"${item.state || ""}"`,
      `"${item.problemType || ""}"`,
      `"${item.occupation || ""}"`,
      `"${item.income || ""}"`,
      `"${item.language || ""}"`,
      `"${item.status || "New"}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Credit_Repair_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Credit Score Repair Inquiries
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<DownloadIcon />}
          onClick={downloadCSV}
          sx={{ color: "#fff", minWidth: 160 }}
        >
          Download CSV
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px" }}>
              <TextField
                fullWidth
                size="small"
                label="Search by name, mobile, email, or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="contained" sx={{ px: 2, minWidth: "auto" }}>
                <SearchIcon />
              </Button>
            </form>
          </Grid>
          <Grid item xs={12} sm={4} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={enquiryTypeFilter}
                label="Type"
                onChange={(e) => {
                  setEnquiryTypeFilter(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="individual">Individual Customer</MenuItem>
                <MenuItem value="corporate">Corporate CMR</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Problem Type</InputLabel>
              <Select
                value={problemTypeFilter}
                label="Problem Type"
                onChange={(e) => {
                  setProblemTypeFilter(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="all">All Types</MenuItem>
                {PROBLEM_TYPES.map((pt) => (
                  <MenuItem key={pt} value={pt}>{pt}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 1100 }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Client / Company</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Score / CMR</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Problem Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Occupation / Entity</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Income / Turnover</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 6, color: "error.main" }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : enquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
                  <Typography color="textSecondary">
                    No pending inquiries found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              enquiries.map((enq) => (
                <TableRow key={enq._id} hover>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {enq.enquiryType === "corporate" ? (
                      <Chip
                        label="Corporate CMR"
                        size="small"
                        sx={{
                          bgcolor: "rgba(16, 185, 129, 0.15)",
                          color: "#10b981",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          border: "1px solid rgba(16, 185, 129, 0.4)",
                        }}
                      />
                    ) : (
                      <Chip
                        label="Individual"
                        size="small"
                        sx={{
                          bgcolor: "rgba(14, 165, 233, 0.15)",
                          color: "#0ea5e9",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          border: "1px solid rgba(14, 165, 233, 0.4)",
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    <div>{enq.fullName}</div>
                    {enq.companyName && (
                      <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 600, display: "block" }}>
                        {enq.companyName} {enq.designation ? `(${enq.designation})` : ""}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{enq.mobileNumber}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {enq.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {enq.enquiryType === "corporate"
                      ? (enq.cmrRank ? `Rank ${enq.cmrRank}` : "—")
                      : (enq.creditScore || "—")}
                  </TableCell>
                  <TableCell>{enq.problemType}</TableCell>
                  <TableCell>
                    {enq.city ? `${enq.city}, ` : ""}
                    {enq.state}
                  </TableCell>
                  <TableCell>
                    {enq.enquiryType === "corporate"
                      ? (enq.entityType || "—")
                      : (enq.occupation || "—")}
                  </TableCell>
                  <TableCell>
                    {enq.enquiryType === "corporate"
                      ? (enq.turnoverRange || "—")
                      : (enq.income ? `₹${enq.income}` : "—")}
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
                      <Select
                        value={enq.status || "New"}
                        onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                        sx={{ fontSize: "0.8rem" }}
                        renderValue={(val) => (
                          <Chip
                            label={val}
                            color={STATUS_COLORS[val] || "default"}
                            size="small"
                            sx={{ height: 22, fontSize: "0.72rem", cursor: "pointer" }}
                          />
                        )}
                      >
                        <MenuItem value="New">New</MenuItem>
                        <MenuItem value="Contacted">Contacted</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Resolved">Resolved</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedEnquiry(enq);
                        setViewModalOpen(true);
                      }}
                      title="View Details"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setEnquiryToDelete(enq);
                        setDeleteDialogOpen(true);
                      }}
                      title="Delete"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, v) => setPage(v)}
            color="primary"
          />
        </Box>
      )}

      {/* View Details Modal */}
      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Inquiry Details — {selectedEnquiry?.fullName}
          <Chip
            label={selectedEnquiry?.enquiryType === "corporate" ? "Corporate CMR" : "Individual"}
            color={selectedEnquiry?.enquiryType === "corporate" ? "success" : "info"}
            size="small"
            sx={{ ml: 1.5, verticalAlign: "middle" }}
          />
          <Chip
            label={selectedEnquiry?.status || "New"}
            color={STATUS_COLORS[selectedEnquiry?.status] || "default"}
            size="small"
            sx={{ ml: 1, verticalAlign: "middle" }}
          />
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedEnquiry && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              {selectedEnquiry.enquiryType === "corporate" && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">Company / Business Name</Typography>
                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 700, color: "primary.main" }}>
                      {selectedEnquiry.companyName || "—"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">Entity Constitution</Typography>
                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                      {selectedEnquiry.entityType || "—"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">Authorized Person & Role</Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedEnquiry.fullName} {selectedEnquiry.designation ? `(${selectedEnquiry.designation})` : ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">Annual Turnover Range</Typography>
                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 600 }}>
                      {selectedEnquiry.turnoverRange || "—"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">Reported CMR Rank</Typography>
                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 700, color: "warning.main" }}>
                      {selectedEnquiry.cmrRank ? `Rank ${selectedEnquiry.cmrRank}` : "Not provided"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">GSTIN / Company PAN</Typography>
                    <Typography variant="body1" gutterBottom sx={{ fontFamily: "monospace" }}>
                      {selectedEnquiry.gstNumber || "—"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}><Divider /></Grid>
                </>
              )}

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Contact Person</Typography>
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                  {selectedEnquiry.fullName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Mobile Number</Typography>
                <Typography variant="body1" gutterBottom>{selectedEnquiry.mobileNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Email ID</Typography>
                <Typography variant="body1" gutterBottom>{selectedEnquiry.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Current Credit Score</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedEnquiry.creditScore || "Not provided"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">City</Typography>
                <Typography variant="body1" gutterBottom>{selectedEnquiry.city || "—"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">State</Typography>
                <Typography variant="body1" gutterBottom>{selectedEnquiry.state}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Problem Type</Typography>
                <Typography variant="body1" gutterBottom>{selectedEnquiry.problemType}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Language Preference</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedEnquiry.language || "Not specified"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Occupation</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedEnquiry.occupation || "—"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Monthly Income</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedEnquiry.income ? `₹${selectedEnquiry.income}` : "—"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" color="textSecondary">
                  Additional Information / Message
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, mt: 1, backgroundColor: "#fafafa", minHeight: 80 }}
                >
                  <Typography variant="body2" style={{ whiteSpace: "pre-wrap" }}>
                    {selectedEnquiry.message || "No additional information provided."}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  Submitted on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the inquiry from{" "}
            <strong>{enquiryToDelete?.fullName}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreditScoreRepair;
