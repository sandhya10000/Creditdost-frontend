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
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { adminAPI, franchiseAPI } from "../../services/api";
import { notifyInboxCountsChanged } from "./useInboxUnreadCounts";
import { useAuth } from "../../hooks/useAuth.jsx";
import { formatAmcDate } from "../../utils/amc";
import { downloadXlsx } from "../../utils/xlsxExport";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

// Work status: label, select/chip background, and the Customer ID text color
const WORK_STATUS = {
  newly_logged: { label: "Newly Logged", bg: "#ef6c00", text: "#ef6c00" },
  in_progress: { label: "In Progress", bg: "#0288d1", text: "#1565c0" },
  pending: { label: "Pending", bg: "#7b1fa2", text: "#7b1fa2" },
  closed: { label: "Closed", bg: "#2e7d32", text: "#2e7d32" },
  // Only a full admin can set it, or change a refunded case back
  refunded: { label: "Refunded", bg: "#c62828", text: "#c62828" },
};
const getWorkStatus = (status) => WORK_STATUS[status] || WORK_STATUS.newly_logged;

const BusinessForms = ({ status = "paid", customerType }) => {
  const isBusinessView = customerType === "business";
  const navigate = useNavigate();
  const [businessForms, setBusinessForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // The term the list is actually filtered by (typed text is applied after a short pause or on submit)
  const [appliedSearch, setAppliedSearch] = useState("");

  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("createdAt-desc");
  const rowsPerPage = 20;

  const SORT_OPTIONS = [
    { value: "createdAt-desc", label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
    { value: "createdAt-asc", label: "Oldest first", sortBy: "createdAt", sortOrder: "asc" },
    { value: "customerId-asc", label: "Customer ID (A → Z)", sortBy: "customerId", sortOrder: "asc" },
    { value: "customerId-desc", label: "Customer ID (Z → A)", sortBy: "customerId", sortOrder: "desc" },
    { value: "customerName-asc", label: "Name (A → Z)", sortBy: "customerName", sortOrder: "asc" },
    { value: "customerName-desc", label: "Name (Z → A)", sortBy: "customerName", sortOrder: "desc" },
  ];
  const activeSort = SORT_OPTIONS.find((o) => o.value === sortKey) || SORT_OPTIONS[0];
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState(null);
  // Only full admins can change the RM; BMs see it read-only
  const { user } = useAuth();
  // Credit analysts don't see amount / payment status
  // Staff carry a Role (staffRoleName, e.g. "Credit Analyst"); subRole is a fallback
  const hideAmountAndPayment =
    user?.subRole === "credit_analyst" ||
    /credit\s*analyst/i.test(user?.staffRoleName || "");
  const isFullAdmin = user?.subRole === "super_admin";
  const [rmList, setRmList] = useState([]);

  useEffect(() => {
    if (isBusinessView) return;
    franchiseAPI
      .getAssignableRms()
      .then((res) => setRmList(res.data || []))
      .catch((err) => console.error("Failed to load RMs:", err));
  }, [isBusinessView]);

  const assignRm = async (id, rmId) => {
    try {
      await adminAPI.assignBusinessRm(id, rmId);
      setToast({ open: true, message: "RM updated.", severity: "success" });
      fetchBusinessForms();
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: "Failed to update RM. Please try again.", severity: "error" });
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return;
    setToast({ ...toast, open: false });
  };
  //const navigate = useNavigate();

  useEffect(() => {
    setPage(1);
  }, [status, customerType]);

  // Search as you type: apply the term after a short pause, back to page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch all business forms on component mount or dependency change
  useEffect(() => {
    fetchBusinessForms();
  }, [status, customerType, page, appliedSearch]);

  // Opening a paid Individual / Business list clears that type's unread badge
  useEffect(() => {
    if (status !== "paid" || !customerType) return;
    adminAPI
      .markBusinessFormsListRead(customerType)
      .then(notifyInboxCountsChanged)
      .catch(() => {});
  }, [status, customerType]);

  const fetchBusinessForms = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminAPI.getAllBusinessForms({
        page: page,
        limit: rowsPerPage,
        search: appliedSearch,
        paymentStatus: status,
        sortBy: activeSort.sortBy,
        sortOrder: activeSort.sortOrder,
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
    setAppliedSearch(searchTerm.trim());
    setPage(1);
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
    if (
      newStatus === "refunded" &&
      !window.confirm(
        "Mark this case as Refunded? It will be removed from customer package revenue, and only Admin can change it afterwards.",
      )
    ) {
      return;
    }
    try {
      await adminAPI.updateBusinessWorkStatus(id, {
        workStatus: newStatus,
      });
      setToast({ open: true, message: "User status has been updated.", severity: "success" });
      fetchBusinessForms();
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: err.response?.data?.message || "Failed to update status. Please try again.",
        severity: "error",
      });
    }
  };

  // Removed client-side filter
  console.log(businessForms, "businessForms----------------"); //Download bussiness mis users data function
  const handleDownloadExcel = async () => {
    try {
      setLoading(true);
      
      // Fetch all matching records ignoring pagination limits
      const response = await adminAPI.getAllBusinessForms({
        page: 1,
        limit: 1000000, // Large number to fetch all records
        search: appliedSearch,
        paymentStatus: status,
        sortBy: activeSort.sortBy,
        sortOrder: activeSort.sortOrder,
        ...(customerType && { customerType }),
      });
      
      // Backend already filters by search, paymentStatus and customerType
      const exportData = response.data.businessData || [];

      const PAYMENT_LABELS = { pending: "Pending", paid: "Paid", failed: "Failed" };
      const formatDateTime = (value) =>
        value
          ? new Date(value).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "";
      const formatDob = (value) =>
        value ? new Date(value).toLocaleDateString("en-IN") : "";

      // One entry per column: [header, value for a form]. Mirrors the table first,
      // then the sections of the customer details page (Customer ID link).
      const columns = [
        // ----- Table columns -----
        ["Customer ID", (f) => f.customerId],
        ["Customer Name", (f) => f.customerName],
        ["Email", (f) => f.customerEmail],
        ["Phone", (f) => f.customerPhone],
        ...(isBusinessView
          ? []
          : [
              [
                "RM",
                (f) =>
                  f.assignedRm
                    ? `${f.assignedRm.name}${f.assignedRm.staffCode ? ` (${f.assignedRm.staffCode})` : ""}`
                    : "Unassigned",
              ],
            ]),
        ["Franchise Code", (f) => f.franchiseId?.franchiseCode],
        ["Franchise Name", (f) => f.franchiseId?.businessName],
        ...(hideAmountAndPayment
          ? []
          : [
              ["Amount", (f) => f.manualAmount || f.selectedPackage?.price],
              ["Payment Status", (f) => PAYMENT_LABELS[f.paymentStatus] || f.paymentStatus],
            ]),
        ["Document", (f) => (Object.values(f.documents || {}).some(Boolean) ? "Yes" : "No")],
        ["Date", (f) => formatDateTime(f.createdAt)],
        ["Work Status", (f) => getWorkStatus(f.workStatus).label],
        [
          "AMC",
          (f) =>
            f.amc?.isEnrolled
              ? `${formatAmcDate(f.amc.startDate)} to ${formatAmcDate(f.amc.endDate)}`
              : "No",
        ],

        // ----- Personal details -----
        ["WhatsApp Number", (f) => f.whatsappNumber],
        ["Father's Name", (f) => f.fatherName],
        ["PAN Number", (f) => f.panNumber],
        ["Aadhaar Number", (f) => f.aadharNumber],
        ["Date of Birth", (f) => formatDob(f.dob)],
        ["Gender", (f) => f.gender],
        ["Language", (f) => f.language],
        ["Occupation", (f) => f.occupation],

        // ----- Business details (business customers) -----
        ...(isBusinessView
          ? [
              ["Director Name", (f) => f.businessDetails?.directorName],
              ["GST Username", (f) => f.businessDetails?.gstUsername],
              ["GST Number", (f) => f.businessDetails?.gstNumber],
              ["Company Type", (f) => f.businessDetails?.companyType],
              ["Company PAN Number", (f) => f.businessDetails?.companyPanNumber],
            ]
          : []),

        // ----- Address details -----
        ["Full Address", (f) => f.fullAddress],
        ["City", (f) => f.city],
        ["State", (f) => f.state],
        ["Pincode", (f) => f.pincode],

        // ----- Financial details -----
        ["Monthly Income", (f) => f.monthlyIncome],
        ["Bank Account Number", (f) => f.bankAccountNumber],
        ["IFSC Code", (f) => f.ifscCode],

        // ----- Package details -----
        ["Selected Package", (f) => f.selectedPackage?.name],
        ...(hideAmountAndPayment
          ? []
          : [["Package Price (incl. GST)", (f) => f.selectedPackage?.totalPrice]]),

        // ----- Franchise / consultant details -----
        ["Franchise Phone", (f) => f.franchiseId?.phone],
        ...(isBusinessView
          ? []
          : [
              ["Consultant Name", (f) => f.consultant?.name],
              ["Consultant Number", (f) => f.consultant?.phone],
              ["Consultant Email", (f) => f.consultant?.email],
            ]),
      ];

      // Empty values show as N/A
      const cellValue = (value) =>
        value === undefined || value === null || String(value).trim() === "" ? "N/A" : value;

      // Excel file (not CSV) so the header row can be coloured
      downloadXlsx(
        customerType ? `business_mis_${customerType}.xlsx` : "business_mis.xlsx",
        {
          sheetName: "Business MIS",
          headers: columns.map(([header]) => header),
          rows: exportData.map((form) =>
            columns.map(([, getValue]) => cellValue(getValue(form))),
          ),
        },
      );
    } catch (err) {
      console.error("Error downloading Excel:", err);
      setToast({ open: true, message: "Failed to download Excel file", severity: "error" });
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
            <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
              <InputLabel id="business-sort-label">Sort by</InputLabel>
              <Select
                labelId="business-sort-label"
                label="Sort by"
                value={sortKey}
                onChange={(e) => {
                  setSortKey(e.target.value);
                  setPage(1);
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                onClick={handleDownloadExcel}
                sx={{ color: "#fff", width: { xs: "100%", sm: "auto" } }}
              >
                Download Excel
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
                    {!isBusinessView && <TableCell>RM</TableCell>}
                    <TableCell>Franchise</TableCell>
                    {!hideAmountAndPayment && <TableCell>Amount</TableCell>}
                    {!hideAmountAndPayment && <TableCell>Payment Status</TableCell>}
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
                      {!isBusinessView && (
                        <TableCell sx={{ minWidth: 150 }}>
                          {isFullAdmin ? (
                            <FormControl size="small" fullWidth>
                              <Select
                                displayEmpty
                                value={form.assignedRm?._id || ""}
                                onChange={(e) => assignRm(form._id, e.target.value)}
                              >
                                <MenuItem value="">
                                  <em>Unassigned</em>
                                </MenuItem>
                                {rmList.map((rm) => (
                                  <MenuItem key={rm._id} value={rm._id}>
                                    {rm.name}
                                    {rm.staffCode ? ` (${rm.staffCode})` : ""}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : form.assignedRm ? (
                            `${form.assignedRm.name}${form.assignedRm.staffCode ? ` (${form.assignedRm.staffCode})` : ""}`
                          ) : (
                            "Unassigned"
                          )}
                        </TableCell>
                      )}
                      <TableCell sx={{ minWidth: 120 }}>
                        {form.franchiseId?._id ? (
                          <Link
                            component={RouterLink}
                            to={`/admin/franchise/${form.franchiseId.franchiseCode || form.franchiseId._id}`}
                          >
                            {form.franchiseId.franchiseCode || form.franchiseId.businessName}
                          </Link>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      {/* <TableCell>
                        ₹{form.selectedPackage?.price || "N/A"}
                      </TableCell> */}
                      {!hideAmountAndPayment && (
                        <TableCell>
                          ₹
                          {form.manualAmount
                            ? form.manualAmount
                            : form.selectedPackage?.price || "N/A"}
                        </TableCell>
                      )}
                      {!hideAmountAndPayment && (
                        <TableCell>
                          {getPaymentStatusChip(form.paymentStatus)}
                        </TableCell>
                      )}
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
                            const current = form.workStatus || "newly_logged";
                            const { bg } = getWorkStatus(current);
                            const color = "#fff";
                            // Staff can't change a case once Admin has marked it Refunded
                            const locked = current === "refunded" && !isFullAdmin;
                            return (
                              <FormControl size="small" sx={{ minWidth: 130 }}>
                                <Select
                                  value={current}
                                  disabled={locked}
                                  title={locked ? "Only Admin can change a Refunded case" : undefined}
                                  renderValue={(value) => getWorkStatus(value).label}
                                  onChange={(e) => updateWorkStatus(form._id, e.target.value)}
                                  sx={{
                                    "& .MuiSelect-select.Mui-disabled": { WebkitTextFillColor: color, color },
                                    "& .MuiSelect-icon.Mui-disabled": { color },
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
                                  <MenuItem value="newly_logged">Newly Logged</MenuItem>
                                  <MenuItem value="in_progress">In Progress</MenuItem>
                                  <MenuItem value="pending">Pending</MenuItem>
                                  <MenuItem value="closed">Closed</MenuItem>
                                  {/* Kept in the list for everyone so a refunded case still shows its label */}
                                  <MenuItem value="refunded" disabled={!isFullAdmin}>
                                    Refunded{!isFullAdmin ? " (Admin only)" : ""}
                                  </MenuItem>
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
                          {isFullAdmin && (
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

      {/* Delete Business Confirmation Dialog (paid and pending MIS) */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            <strong>{businessToDelete?.customerName || "This business"}</strong> — this
            Business MIS entry will be permanently deleted.
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
