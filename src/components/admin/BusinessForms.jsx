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
} from "@mui/material";
import { adminAPI } from "../../services/api";
//import { useNavigate } from "react-router-dom";

const BusinessForms = ({ status = "paid" }) => {
  const [businessForms, setBusinessForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return;
    setToast({ ...toast, open: false });
  };
  //const navigate = useNavigate();

  // Fetch all business forms on component mount
  useEffect(() => {
    fetchBusinessForms();
  }, [page, searchTerm]);

  const fetchBusinessForms = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminAPI.getAllBusinessForms({
        page: page,
        limit: rowsPerPage,
        search: searchTerm,
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

  const filteredBusinessForms = businessForms.filter(
    (form) =>
      form.paymentStatus === status &&
      (form.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.customerPhone?.includes(searchTerm) ||
        form.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (form.franchiseId?.businessName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())),
  );

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
  console.log(filteredBusinessForms, "filteredBusinessForms----------------"); //Download bussiness mis users data function
  const handleDownloadCSV = async () => {
    try {
      setLoading(true);
      
      // Fetch all matching records ignoring pagination limits
      const response = await adminAPI.getAllBusinessForms({
        page: 1,
        limit: 1000000, // Large number to fetch all records
        search: searchTerm,
      });
      
      const allBusinessForms = response.data.businessData || [];
      
      // Apply the frontend search filter to the full dataset (ignoring paymentStatus so it matches the Total Records count)
      const exportData = allBusinessForms.filter(
        (form) =>
          form.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          form.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          form.customerPhone?.includes(searchTerm) ||
          form.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (form.franchiseId?.businessName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );

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
      ]);

      // Enclose fields in double quotes to handle commas in data
      const csvContent = [headers, ...rows]
        .map((row) => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
        .join("\n");

      const encodedUri =
        "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);

      const link = document.createElement("a");
      link.href = encodedUri;
      link.download = "business_mis.csv";

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

  const deleteBusinessForm = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await adminAPI.deleteBusinessForm(id);
      fetchBusinessForms();
    } catch (err) {
      console.error(err);
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
        {status === "pending" ? "Business MIS Pending" : "Business MIS"}
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
            <Button
              variant="contained"
              color="success"
              onClick={handleDownloadCSV}
              sx={{ color: "#fff", width: { xs: "100%", sm: "auto" } }}
            >
              Download CSV
            </Button>
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
                  {filteredBusinessForms.map((form) => (
                    <TableRow
                      key={form._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          color: "blue",
                          fontWeight: "bold",
                        }}
                      >
                        <a href={`customer/${form.customerId}`}>
                          {form.customerId}
                        </a>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {form.customerName}
                      </TableCell>
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
                            const workStatusColorMap = {
                              in_progress: { bg: "#0288d1", color: "#fff" },
                              closed:      { bg: "#2e7d32", color: "#fff" },
                              on_hold:     { bg: "#ed6c02", color: "#fff" },
                            };
                            const current = form.workStatus || "in_progress";
                            const { bg, color } = workStatusColorMap[current] || { bg: "#757575", color: "#fff" };
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
                                  <MenuItem value="closed">Closed</MenuItem>
                                  <MenuItem value="on_hold">On Hold</MenuItem>
                                </Select>
                              </FormControl>
                            );
                          })()}
                          {status !== "paid" && (
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => deleteBusinessForm(form._id)}
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
