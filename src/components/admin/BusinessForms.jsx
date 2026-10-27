import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Pagination,
  Stack,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { adminAPI } from "../../services/api";
import { formatAmcDate } from "../../utils/amc";
import { useNavigate } from "react-router-dom";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

// Work status: label, select/chip background, and the Customer ID text color
const WORK_STATUS = {
  in_progress: { label: "In Progress", bg: "#0288d1", text: "#1565c0" },
  pending: { label: "Pending", bg: "#7b1fa2", text: "#7b1fa2" },
  hold: { label: "Hold", bg: "#d32f2f", text: "#d32f2f" },
  on_hold: { label: "On Hold", bg: "#ed6c02", text: "#e65100" },
  closed: { label: "Closed", bg: "#2e7d32", text: "#2e7d32" },
};
const getWorkStatus = (status) => WORK_STATUS[status] || WORK_STATUS.in_progress;

const BusinessForms = ({ status = "paid", customerType }) => {
  const isBusinessView = customerType === "business";
  const navigate = useNavigate();
  const [businessForms, setBusinessForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState(null);

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return;
    setToast({ ...toast, open: false });
  };
  //const navigate = useNavigate();

  useEffect(() => {
    setPage(1);
  }, [status, customerType]);

  // Fetch all business forms on component mount or dependency change
  useEffect(() => {
    fetchBusinessForms();
  }, [status, customerType, page, searchTerm]);

  const fetchBusinessForms = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminAPI.getAllBusinessForms({
        page: page,
        limit: rowsPerPage,
        search: searchTerm,
        paymentStatus: status,
        ...(customerType && { customerType }),
      });
      // console.log("fetch all documents with details----", response);
      setBusinessForms(response.data.businessData || []);
      setTotalRecords(response.data.total || 0);
    } catch (err) {
      setError("Failed to fetch business forms. Please try again later.");
      console.error("Error fetching business forms:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBusinessForms();
  };
  //function for case close update from admin api
  const closeCase = async (id) => {
    try {
      setLoading(true);
      setError("");
      const response = await adminAPI.closeBusinessCase(id);
      alert(response.message || "Case Closed Successfully");
      // Refress update list
      fetchBusinessForms();
    } catch (err) {
      setError("Failed to close case. Please try again later.");
      console.error("Error closing case:", err);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getPaymentStatusChip = (status) => {
    const statusConfig = {
      pending: { label: "Pending", color: "warning" },
      paid: { label: "Paid", color: "success" },
      failed: { label: "Failed", color: "error" },
    };

    const config = statusConfig[status] || { label: status, color: "default" };

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const updateWorkStatus = async (id, newStatus) => {
    try {
      await adminAPI.updateBusinessWorkStatus(id, {
        workStatus: newStatus,
      });
      setToast({ open: true, message: "User status has been updated.", severity: "success" });
      fetchBusinessForms();
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: "Failed to update status. Please try again.", severity: "error" });
    }
  };

  // Removed client-side filter
  console.log(businessForms, "businessForms----------------"); //Download bussiness mis users data function
  const handleDownloadCSV = async () => {
    try {
      setLoading(true);
      
      // Fetch all matching records ignoring pagination limits
      const response = await adminAPI.getAllBusinessForms({
        page: 1,
        limit: 1000000, // Large number to fetch all records
        search: searchTerm,
        paymentStatus: status,
        ...(customerType && { customerType }),
      });
      
      const allBusinessForms = response.data.businessData || [];
      
      // Removed frontend search filter since backend already filters by search and paymentStatus
      const exportData = allBusinessForms;

      const headers = [
        "Customer ID",
        "Customer Name",
        "Email",
        "Phone",
        "Franchise",
        "Package",
        "Amount",
        "Payment Status",
        "Role",
        "Document",
        "Date",
        "Work Status",
        "AMC",
        ...(isBusinessView
          ? [
              "Director Name",
              "GST Username",
              "GST Number",
              "Company Type",
              "Company PAN Number",
            ]
          : []),
      ];

      const rows = exportData.map((form) => [
        form.customerId || "",
        form.customerName || "",
        form.customerEmail || "",
        form.customerPhone || "",
        form.franchiseId?.businessName || "N/A",
        form.selectedPackage?.name || "N/A",
        form.manualAmount ? form.manualAmount : form.selectedPackage?.price || "N/A",
        form.paymentStatus || "",
        form.createdByRole || "franchise",
        Object.values(form.documents || {}).some(Boolean) ? "Yes" : "No",
        formatDate(form.createdAt),
        form.workStatus || "",
        form.amc?.isEnrolled
          ? `${formatAmcDate(form.amc.startDate)} to ${formatAmcDate(form.amc.endDate)}`
          : "No",
        ...(isBusinessView
          ? [
              form.businessDetails?.directorName || "",
              form.businessDetails?.gstUsername || "",
              form.businessDetails?.gstNumber || "",
              form.businessDetails?.companyType || "",
              form.businessDetails?.companyPanNumber || "",
            ]
          : []),
      ]);

      // Enclose fields in double quotes to handle commas in data
      const csvContent = [headers, ...rows]
        .map((row) => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
        .join("\n");

      const encodedUri =
        "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);

      const link = document.createElement("a");
      link.href = encodedUri;
      link.download = customerType
        ? `business_mis_${customerType}.csv`
        : "business_mis.csv";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading CSV:", err);
      setToast({ open: true, message: "Failed to download CSV", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
    ? import.meta.env.VITE_REACT_APP_API_URL.replace("/api", "")
    : "https://reactbackend.creditdost.co.in";

  //Windows backslash problem fix (\\ → /)
  // const getFileUrl = (path) => {
  //   if (!path) return "";

  //   return `${API_URL}/${path.replace(/\\/g, "/")}`;
  // };

  const handleDeleteClick = (form) => {
    setBusinessToDelete(form);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setBusinessToDelete(null);
  };

  const confirmDeleteBusinessForm = async () => {
    if (!businessToDelete) return;
    try {
      setLoading(true);
      await adminAPI.deleteBusinessForm(businessToDelete._id);
      setToast({ open: true, message: "Business deleted successfully", severity: "success" });
      setDeleteDialogOpen(false);
      setBusinessToDelete(null);
      fetchBusinessForms();
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || "Failed to delete business. Please try again.",
        severity: "error",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          fontSize: { xs: "1.5rem", md: "2rem" },
        }}
      >
        {status === "pending"
          ? "Business MIS Pending"
          : customerType === "business"
            ? "Business MIS – Business Customers"
            : customerType === "individual"
              ? "Business MIS – Individual Customers"
              : "Business MIS"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card
        sx={{
          mt: 2,
          borderRadius: 2,
          overflow: "visible",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "space-between",
              mb: 3,
            }}
            onSubmit={handleSearch}
          >
            <TextField
              fullWidth
              placeholder="Search by customer name, email, phone, or franchise"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                maxWidth: { xs: "100%", sm: 400 },
              }}
            />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EventAvailableIcon />}
                onClick={() => navigate("/admin/business-forms/follow-ups")}
                sx={{ width: { xs: "100%", sm: "auto" }, whiteSpace: "nowrap" }}
              >
                Follow Up
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleDownloadCSV}
                sx={{ color: "#fff", width: { xs: "100%", sm: "auto" } }}
              >
                Download CSV
              </Button>
            </Stack>
          </Box>
          {loading && businessForms.length === 0 ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                width: "100%",
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                  height: 8,
                },
              }}
            >
              <Table
                size="small"
                sx={{
                  minWidth: 1400,
                  tableLayout: "auto",
                }}
                aria-label="business forms table"
              >
                <TableHead
                  sx={{
                    "& .MuiTableCell-root": {
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                >
                  <TableRow
                    sx={{
                      "& td, & th": {
                        py: 0.8,
                      },
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell>Customer ID</TableCell>

                    <TableCell>Customer Name</TableCell>
                    {isBusinessView && <TableCell>Company Type</TableCell>}
                    {isBusinessView && <TableCell>GST Number</TableCell>}
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Franchise</TableCell>
                    <TableCell>Package</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Document</TableCell>

                    <TableCell>Date</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    "& td": {
                      padding: "6px 8px",
                    },
                  }}
                >
                  {businessForms.map((form) => (
                    <TableRow
                      key={form._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        <a
                          href={`/admin/customer/${form.customerId}`}
                          style={{
                            color: getWorkStatus(form.workStatus).text,
                            textDecoration: "none",
                          }}
                        >
                          {form.customerId}
                        </a>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {form.customerName}
                      </TableCell>
                      {isBusinessView && (
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {form.businessDetails?.companyType || "N/A"}
                        </TableCell>
                      )}
                      {isBusinessView && (
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {form.businessDetails?.gstNumber || "N/A"}
                        </TableCell>
                      )}
                      <TableCell
                        sx={{
                          maxWidth: 180,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {form.customerEmail}
                      </TableCell>
                      <TableCell>{form.customerPhone}</TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        {form.franchiseId?.businessName || "N/A"}
                      </TableCell>
                      <TableCell sx={{ minWidth: 100 }}>
                        {form.selectedPackage?.name || "N/A"}
                      </TableCell>
                      {/* <TableCell>
                        ₹{form.selectedPackage?.price || "N/A"}
                      </TableCell> */}
                      <TableCell>
                        ₹
                        {form.manualAmount
                          ? form.manualAmount
                          : form.selectedPackage?.price || "N/A"}
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusChip(form.paymentStatus)}
                      </TableCell>
                      <TableCell>{form.createdByRole || "franchise"}</TableCell>
                      <TableCell
                        sx={{
                          width: 60,
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {Object.values(form.documents || {}).some(Boolean)
                          ? "Yes"
                          : "No"}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {new Date(form.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </TableCell>
                      <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                          {status !== "pending" && (() => {
                            const current = form.workStatus || "in_progress";
                            const { bg } = getWorkStatus(current);
                            const color = "#fff";
                            return (
                              <FormControl size="small" sx={{ minWidth: 130 }}>
                                <Select
                                  value={current}
                                  onChange={(e) => updateWorkStatus(form._id, e.target.value)}
                                  sx={{
                                    backgroundColor: bg,
                                    color: color,
                                    fontWeight: 600,
                                    fontSize: "0.78rem",
                                    borderRadius: "6px",
                                    "& .MuiSelect-icon": { color: color },
                                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                    "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "1px solid rgba(255,255,255,0.5)" },
                                  }}
                                >
                                  <MenuItem value="in_progress">In Progress</MenuItem>
                                  <MenuItem value="pending">Pending</MenuItem>
                                  <MenuItem value="hold">Hold</MenuItem>
                                  <MenuItem value="on_hold">On Hold</MenuItem>
                                  <MenuItem value="closed">Closed</MenuItem>
                                </Select>
                              </FormControl>
                            );
                          })()}
                          {status === "paid" && form.customerId && form.amc?.isEnrolled && (
                            <Chip
                              label={`AMC till ${formatAmcDate(form.amc.endDate)}`}
                              color="secondary"
                              size="small"
                              component="a"
                              href="/admin/amc-customers"
                              clickable
                            />
                          )}
                          {status !== "paid" && (
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleDeleteClick(form)}
                            >
                              Delete
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" }, // Stacks on mobile, side-by-side on desktop
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  p: 3,
                }}
              >
                <Typography>Total Records: {totalRecords}</Typography>

                <Pagination
                  count={Math.ceil(totalRecords / rowsPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />

                <Typography>
                  Page {page} of {Math.ceil(totalRecords / rowsPerPage)}
                </Typography>
              </Box>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Delete Business Confirmation Dialog (pending MIS only) */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            <strong>{businessToDelete?.customerName || "This business"}</strong> — business
            will be deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={confirmDeleteBusinessForm}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BusinessForms;
