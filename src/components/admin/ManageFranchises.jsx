import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useAuth } from "../../hooks/useAuth.jsx";
import ReassignRmDialog from "./ReassignRmDialog";
import CreateFranchiseDialog from "./CreateFranchiseDialog";
import {
  Box,
  Stack,
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
  IconButton,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Tabs,
  Tab,
  Divider,
  Checkbox,
  ListItemText,
  ListItemIcon,
  Snackbar,
  Menu,
  Pagination,
  LinearProgress,
  Tooltip,
  InputAdornment,
  Avatar,
} from "@mui/material";
import {
  Search,
  Visibility,
  Edit,
  Check,
  Close,
  CheckCircle,
  Cancel,
  Pending,
  Download,
  PictureAsPdf as PictureAsPdfIcon,
  Add as AddIcon,
  Delete,
  Password,
  Restore,
  AddCircle,
  RemoveCircle,
  Send,
  AlternateEmail,
  Block,
  MoreVert,
  CheckCircleOutline,
  HourglassEmpty,
  DeleteOutline,
  SupervisorAccount,
  PauseCircleOutline,
  PlayCircleOutline,
} from "@mui/icons-material";
import { adminAPI } from "../../services/api";
import CreditAdjustDialog from "./CreditAdjustDialog";
import BlacklistPartnerDialog from "./BlacklistPartnerDialog";
import { canBlacklistPartners } from "../../utils/blacklist";

const DetailItem = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="caption" color="textSecondary" display="block">
      {label}
    </Typography>
    <Box sx={{ mt: 0.25, wordBreak: "break-word", fontSize: "0.875rem" }}>
      {value === null || value === undefined || value === "" ? "N/A" : value}
    </Box>
  </Grid>
);

const DetailSection = ({ title, children }) => (
  <Card
    variant="outlined"
    sx={{ mb: 2, boxShadow: 2, borderRadius: 2, bgcolor: "white" }}
  >
    <CardContent>
      <Typography
        variant="subtitle1"
        sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}
      >
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {children}
      </Grid>
    </CardContent>
  </Card>
);

// Tabs on the Franchises page (?tab=active|pending|deleted)
const VIEWS = {
  active: {
    label: "Active Franchise",
    icon: <CheckCircleOutline fontSize="small" />,
    emptyTitle: "No franchises found",
    emptyHint: "Nothing matches the selected KYC filter.",
  },
  pending: {
    label: "Pending Franchise",
    icon: <HourglassEmpty fontSize="small" />,
    emptyTitle: "All caught up",
    emptyHint: "No registrations are waiting for review.",
  },
  deleted: {
    label: "Deleted Franchise",
    icon: <DeleteOutline fontSize="small" />,
    emptyTitle: "No deleted franchises",
    emptyHint: "Deleted franchises show up here and can be restored.",
  },
};
const VIEW_KEYS = Object.keys(VIEWS);

// KYC filters per tab (?status=). "all" on Active means every status except pending.
const STATUS_FILTERS = {
  active: [
    { value: "approved", label: "Approved" },
    { value: "submitted", label: "KYC Submitted" },
    { value: "rejected", label: "Rejected" },
    { value: "all", label: "All" },
  ],
  pending: null,
  deleted: [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "submitted", label: "KYC Submitted" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ],
};
const DEFAULT_STATUS = { active: "approved", pending: "pending", deleted: "all" };

// List / CSV query for a tab and KYC filter
const queryFor = (view, status) => {
  if (view === "pending") return { kycStatus: "pending" };
  if (view === "deleted") {
    return { showDeleted: "true", kycStatus: status === "all" ? "" : status };
  }
  return status === "all" ? { excludeStatus: "pending" } : { kycStatus: status };
};

// ---- Franchise table display helpers ----
const COLUMNS = [
  { key: "partner", label: "Partner", width: 230 },
  { key: "owner", label: "Owner", width: 170 },
  { key: "email", label: "Email & Login", width: 240 },
  { key: "kyc", label: "KYC", width: 125 },
  { key: "status", label: "Status", width: 120 },
  { key: "credits", label: "Credits", width: 90 },
  { key: "rm", label: "RM", width: 140 },
  { key: "created", label: "Created", width: 110 },
  { key: "actions", label: "Actions", width: 175, align: "right" },
];
const TABLE_MIN_WIDTH = COLUMNS.reduce((sum, col) => sum + col.width, 0);

const AVATAR_COLORS = ["#6200ea", "#00897b", "#e65100", "#1565c0", "#ad1457", "#2e7d32", "#6d4c41", "#c62828"];
const avatarColor = (text = "") =>
  AVATAR_COLORS[[...text].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % AVATAR_COLORS.length];

const initialsOf = (text = "") =>
  text
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "?";

// Owner names often arrive in capitals (from PAN records); show them in title case
const displayName = (name = "") =>
  name && name === name.toUpperCase()
    ? name
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : name;

// e.g. "23 Nov 2026"
const shortDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

// One line cut with "…"; the full text shows on hover
const CellText = ({ children, ...props }) => (
  <Tooltip title={children || ""} placement="top-start" enterDelay={600}>
    <Typography noWrap {...props}>
      {children}
    </Typography>
  </Tooltip>
);

const ManageFranchises = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // The term the list is actually filtered by (typed text is applied after a short pause or on submit)
  const [appliedSearch, setAppliedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filteredFranchises, setFilteredFranchises] = useState([]);
  const [counts, setCounts] = useState(null);
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [kycData, setKycData] = useState(null);
  const [kycLoading, setKycLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [franchiseToReject, setFranchiseToReject] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [franchiseToDelete, setFranchiseToDelete] = useState(null);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [creditFranchise, setCreditFranchise] = useState(null);
  const [creditMode, setCreditMode] = useState("add");
  // Resend invite / change email
  const [resendTarget, setResendTarget] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [emailChangeTarget, setEmailChangeTarget] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [sendCredentialsOnEmailChange, setSendCredentialsOnEmailChange] =
    useState(true);
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);
  const [emailChangeError, setEmailChangeError] = useState("");

  // Active tab and KYC filter live in the URL so they can be linked to
  const [searchParams, setSearchParams] = useSearchParams();
  const view = VIEW_KEYS.includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "active";
  const statusOptions = STATUS_FILTERS[view];
  const requestedStatus = searchParams.get("status");
  const status = statusOptions?.some((o) => o.value === requestedStatus)
    ? requestedStatus
    : DEFAULT_STATUS[view];
  const isDeletedView = view === "deleted";

  // Certificate name update state
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [certificateFranchise, setCertificateFranchise] = useState(null);
  const [certificateName, setCertificateName] = useState("");
  const [certificateSuccess, setCertificateSuccess] = useState("");
  const [certificateSnackbarOpen, setCertificateSnackbarOpen] = useState(false);

  // New state variables for edit and registration details dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFranchiseData, setEditFranchiseData] = useState({});
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);

  // State for packages
  const [packages, setPackages] = useState([]);
  const [approvalPackages, setApprovalPackages] = useState([]); // For registration approval dialog

  const [newPackage, setNewPackage] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;
  const [csvExporting, setCsvExporting] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);
  // Row "more actions" menu; franchise is kept while the menu animates closed
  const [rowMenu, setRowMenu] = useState({ anchor: null, franchise: null });
  // Ignores responses from older requests when tabs/filters change quickly
  const requestRef = useRef(0);

  // Search as you type: apply the term after a short pause, back to page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reload data when page, search, tab or KYC filter changes
  useEffect(() => {
    fetchFranchises();
  }, [page, view, status, appliedSearch]);

  // Fetch all franchises and packages on component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  const handlePackageChange = (index, field, value) => {
    const updatedPackages = [...editFranchiseData.allPackages.assigned];

    updatedPackages[index][field] = value;

    setEditFranchiseData({
      ...editFranchiseData,
      allPackages: {
        ...editFranchiseData.allPackages,
        assigned: updatedPackages,
      },
    });
  };

  const fetchPackages = async () => {
    try {
      const response = await adminAPI.getPackageOptions();
      setPackages(response.data);
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  // RM column: full admins can open a manager's profile; managers see the code only
  const { user: currentUser } = useAuth();
  const [rmFranchise, setRmFranchise] = useState(null);
  const [blacklistTarget, setBlacklistTarget] = useState(null);

  const fetchCounts = async () => {
    try {
      const response = await adminAPI.getFranchiseCounts();
      setCounts(response.data);
    } catch (err) {
      console.error("Error fetching franchise counts:", err);
    }
  };

  const fetchFranchises = async () => {
    const requestId = ++requestRef.current;
    fetchCounts();
    try {
      setLoading(true);
      setError("");

      const response = await adminAPI.getAllFranchises({
        page,
        limit: rowsPerPage,
        search: appliedSearch,
        ...queryFor(view, status),
      });
      if (requestId !== requestRef.current) return;

      setFilteredFranchises(response.data.franchises || []);
      setTotalRecords(response.data.total || 0);
    } catch (err) {
      if (requestId !== requestRef.current) return;
      setError("Failed to fetch franchises. Please try again later.");
      console.error("Error fetching franchises:", err);
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  };

  // Rows are cleared on tab/filter change so actions never run on the previous tab's rows
  const changeView = (next) => {
    if (next === view) return;
    setSearchParams({ tab: next });
    setPage(1);
    setFilteredFranchises([]);
    setTotalRecords(0);
    setError("");
    setSuccess("");
  };

  const changeStatus = (next) => {
    if (next === status) return;
    setSearchParams({ tab: view, status: next }, { replace: true });
    setPage(1);
    setFilteredFranchises([]);
    setTotalRecords(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(searchTerm.trim());
    setPage(1);
  };

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   if (!searchTerm.trim()) {
  //     setFilteredFranchises(franchises);
  //     return;
  //   }

  //   const filtered = franchises.filter(
  //     (franchise) =>
  //       franchise.businessName
  //         .toLowerCase()
  //         .includes(searchTerm.toLowerCase()) ||
  //       franchise.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       franchise.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       franchise.phone.includes(searchTerm),
  //   );

  //   setFilteredFranchises(filtered);
  // };

  const handleToggleCreditHold = async (franchise) => {
    const hold = !franchise.creditHold;
    const confirmed = window.confirm(
      hold
        ? `Put credits on hold for ${franchise.businessName}? They cannot use bureau or AI credits until released.`
        : `Release credit hold for ${franchise.businessName}?`,
    );
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");
      await adminAPI.setFranchiseCreditHold(franchise._id, hold);
      setSuccess(hold ? "Credits are now on hold." : "Credit hold released.");
      fetchFranchises();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update credit hold.");
      console.error("Error updating credit hold:", err);
    }
  };

  const handleApproveKyc = async (franchiseId) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // First, get the KYC request for this franchise
      const kycResponse = await adminAPI.getKycByFranchiseId(franchiseId);
      const kycRequestId = kycResponse.data._id;

      // Then approve the KYC request using its ID
      await adminAPI.approveKyc(kycRequestId);
      setSuccess(
        "KYC approved successfully! Email notification sent to franchise partner.",
      );

      // Refresh the franchise list
      fetchFranchises();
    } catch (err) {
      setError("Failed to approve KYC. Please try again.");
      console.error("Error approving KYC:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectKycClick = (franchise) => {
    setFranchiseToReject(franchise);
    setRejectDialogOpen(true);
  };

  // Certificate name update functions
  const handleCertificateNameClick = (franchise) => {
    setCertificateFranchise(franchise);
    setCertificateName(
      franchise.certificateName || franchise.businessName || "",
    );
    setCertificateDialogOpen(true);
  };

  const handleCertificateNameChange = (e) => {
    setCertificateName(e.target.value);
  };

  const handleCertificateNameSubmit = async () => {
    try {
      await adminAPI.updateFranchiseCertificateName({
        franchiseId: certificateFranchise._id,
        certificateName: certificateName,
      });

      setCertificateSuccess("Certificate name updated successfully!");
      setCertificateSnackbarOpen(true);
      setCertificateDialogOpen(false);

      // Refresh the franchise list
      fetchFranchises();
    } catch (err) {
      setError("Failed to update certificate name. Please try again.");
      console.error("Error updating certificate name:", err);
    }
  };

  const handleCertificateDialogClose = () => {
    setCertificateDialogOpen(false);
    setCertificateFranchise(null);
    setCertificateName("");
  };

  const handleCertificateSnackbarClose = () => {
    setCertificateSnackbarOpen(false);
    setCertificateSuccess("");
  };

  const handleRejectKyc = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // First, get the KYC request for this franchise
      const kycResponse = await adminAPI.getKycByFranchiseId(
        franchiseToReject._id,
      );
      const kycRequestId = kycResponse.data._id;

      // Then reject the KYC request using its ID
      await adminAPI.rejectKyc(kycRequestId, rejectionReason);
      setSuccess(
        "KYC rejected successfully! Email notification sent to franchise partner.",
      );
      setRejectDialogOpen(false);
      setRejectionReason("");
      setFranchiseToReject(null);

      // Refresh the franchise list
      fetchFranchises();
    } catch (err) {
      setError("Failed to reject KYC. Please try again.");
      console.error("Error rejecting KYC:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (franchiseId, currentStatus) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (currentStatus) {
        await adminAPI.deactivateFranchise(franchiseId);
        setSuccess("Franchise deactivated successfully!");
      } else {
        await adminAPI.activateFranchise(franchiseId);
        setSuccess("Franchise activated successfully!");
      }

      // Refresh the franchise list
      fetchFranchises();
    } catch (err) {
      setError("Failed to update franchise status. Please try again.");
      console.error("Error updating franchise status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewKyc = async (franchise) => {
    try {
      setKycLoading(true);
      setSelectedFranchise(franchise);

      // Fetch the actual KYC documents
      const response = await adminAPI.getKycByFranchiseId(franchise._id);
      setKycData(response.data);

      setKycDialogOpen(true);
    } catch (err) {
      setError("Failed to load KYC details. Please try again.");
      console.error("Error loading KYC details:", err);
    } finally {
      setKycLoading(false);
    }
  };

  const handleCloseKycDialog = () => {
    setKycDialogOpen(false);
    setSelectedFranchise(null);
    setKycData(null);
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setRejectionReason("");
    setFranchiseToReject(null);
  };

  // Handle opening the edit franchise dialog
  const handleEditFranchiseClick = (franchise) => {
    setEditFranchiseData({
      ...franchise,
      businessName: franchise.businessName || "",
      ownerName: franchise.ownerName || "",
      email: franchise.email || "",
      phone: franchise.phone || "",
      "address.street": franchise.address?.street || "",
      "address.city": franchise.address?.city || "",
      "address.state": franchise.address?.state || "",
      "address.pincode": franchise.address?.pincode || "",
      "address.country": franchise.address?.country || "India",
      panNumber: franchise.panNumber || "",
      bankAccountNumber: franchise.bankAccountNumber || "",
      bankIfscCode: franchise.bankIfscCode || "",
      certificateName: franchise.certificateName || "",
      credits: franchise.credits || 0,
      totalCreditsPurchased: franchise.totalCreditsPurchased || 0,
      kycStatus: franchise.kycStatus || "pending",
      isActive: franchise.isActive !== undefined ? franchise.isActive : true,
      // Handle both old structure (assignedPackages) and new structure (allPackages)
      assignedPackages: franchise.assignedPackages || [],
      allPackages: franchise.allPackages || {
        assigned: franchise.assignedPackages || [],
        purchased: [],
        all: franchise.assignedPackages || [],
      },
    });
    setNewPackage(null);
    setEditDialogOpen(true);
  };

  // Handle closing the edit franchise dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditFranchiseData({});
  };

  // Handle changes in the edit franchise form
  const handleEditFranchiseChange = (e) => {
    const { name, value } = e.target;

    // Handle nested address properties
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setEditFranchiseData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setEditFranchiseData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle updating the franchise
  const handleUpdateFranchise = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      // return;
      // Prepare data for update (exclude fields that shouldn't be updated by admin)
      const updateData = {
        businessName: editFranchiseData.businessName,
        ownerName: editFranchiseData.ownerName,
        email: editFranchiseData.email,
        phone: editFranchiseData.phone,
        address: {
          street: editFranchiseData.address?.street || "",
          city: editFranchiseData.address?.city || "",
          state: editFranchiseData.address?.state || "",
          pincode: editFranchiseData.address?.pincode || "",
          country: editFranchiseData.address?.country || "India",
        },
        panNumber: editFranchiseData.panNumber,
        bankAccountNumber: editFranchiseData.bankAccountNumber,
        bankIfscCode: editFranchiseData.bankIfscCode,
        certificateName: editFranchiseData.certificateName,
        kycStatus: editFranchiseData.kycStatus,
        isActive: editFranchiseData.isActive,
        credits: parseInt(editFranchiseData.credits) || 0,
        // assignedPackages: editFranchiseData.assignedPackages,
        totalCreditsPurchased:
          parseInt(editFranchiseData.totalCreditsPurchased) || 0,

        allPackages: {
          assigned: editFranchiseData.allPackages.assigned,
        },
      };

      if (
        newPackage &&
        newPackage !== editFranchiseData.assignedPackages[0]._id
      ) {
        updateData.assignedPackages = [newPackage];
        // updateData.credits = packages.find(
        //   (pkg) => pkg._id === newPackage,
        // )?.creditsIncluded;
      }

      await adminAPI.updateFranchise(editFranchiseData._id, updateData);
      setSuccess("Franchise updated successfully!");
      handleCloseEditDialog();
      fetchFranchises();
    } catch (err) {
      setError("Failed to update franchise. Please try again.");
      console.error("Error updating franchise:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle opening the registration details dialog
  const handleViewRegistrationDetails = (franchise) => {
    setSelectedFranchise(franchise);
    setRegistrationDialogOpen(true);
  };

  // Handle closing the registration details dialog
  const handleCloseRegistrationDialog = () => {
    setRegistrationDialogOpen(false);
    setSelectedFranchise(null);
    setApprovalPackages([]); // Reset approval packages
  };

  // Handle registration approval
  const handleApproveRegistration = async (franchiseId) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Include assigned packages in the request
      const approvalData = {
        assignedPackages: approvalPackages,
      };

      // Call the approve registration API endpoint with package data
      await adminAPI.approveRegistration(franchiseId, approvalData);
      setSuccess(
        "Registration approved successfully! Email notification sent to franchise partner.",
      );
      handleCloseRegistrationDialog();

      // Refresh the franchise list
      fetchFranchises();
    } catch (err) {
      setError("Failed to approve registration. Please try again.");
      console.error("Error approving registration:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle registration rejection click
  const handleRejectRegistrationClick = (franchise) => {
    setFranchiseToReject(franchise);
    setRejectDialogOpen(true);
  };

  // Handle registration rejection
  const handleRejectRegistration = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Call the reject registration API endpoint
      await adminAPI.rejectRegistration(franchiseToReject._id, rejectionReason);
      setSuccess(
        "Registration rejected successfully! Email notification sent to franchise partner.",
      );
      handleCloseRegistrationDialog();
      setRejectDialogOpen(false);
      setRejectionReason("");
      setFranchiseToReject(null);

      // Refresh the franchise list
      fetchFranchises();
    } catch (err) {
      setError("Failed to reject registration. Please try again.");
      console.error("Error rejecting registration:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete franchise click
  const handleDeleteFranchiseClick = (franchise) => {
    setFranchiseToDelete(franchise);
    setDeleteDialogOpen(true);
  };

  // Handle delete franchise confirmation
  const handleDeleteFranchise = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Call the delete franchise API endpoint (soft-delete, data preserved)
      await adminAPI.deleteFranchise(franchiseToDelete._id);
      setSuccess("Franchise is deleted");
      setDeleteDialogOpen(false);
      setFranchiseToDelete(null);

      // Refresh the franchise list
      fetchFranchises();
    } catch (err) {
      setError("Failed to delete franchise. Please try again.");
      console.error("Error deleting franchise:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle restore franchise
  const handleRestoreFranchise = async (franchiseId) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await adminAPI.restoreFranchise(franchiseId);
      setSuccess("Franchise restored successfully!");

      // Refresh the franchise list
      fetchFranchises();
    } catch (err) {
      setError("Failed to restore franchise. Please try again.");
      console.error("Error restoring franchise:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setFranchiseToDelete(null);
  };

  // Handle add/deduct funds dialog
  const handleCreditClick = (franchise, mode) => {
    setCreditFranchise(franchise);
    setCreditMode(mode);
    setCreditDialogOpen(true);
  };

  const handleCloseCreditDialog = () => {
    setCreditDialogOpen(false);
    setCreditFranchise(null);
  };

  const handleCreditSuccess = (message) => {
    showSnackbar(message, "success");
    fetchFranchises();
  };

  const handleFranchiseCreated = (message) => {
    setCreateDialogOpen(false);
    showSnackbar(message, "success");
    fetchFranchises();
  };

  const openRowMenu = (event, franchise) =>
    setRowMenu({ anchor: event.currentTarget, franchise });
  const closeRowMenu = () => setRowMenu((prev) => ({ ...prev, anchor: null }));

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      approved: { label: "Approved", color: "success", icon: <CheckCircle /> },
      pending: { label: "Pending", color: "warning", icon: <Pending /> },
      rejected: { label: "Rejected", color: "error", icon: <Cancel /> },
      submitted: { label: "Submitted", color: "info", icon: <Pending /> },
    };

    const config = statusConfig[status.toLowerCase()] || {
      label: status,
      color: "default",
    };

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const handleViewDocument = (documentUrl, documentName) => {
    // Open the document in a new tab
    if (documentUrl) {
      window.open(documentUrl, "_blank");
    } else {
      alert(`Document not available: ${documentName}`);
    }
  };

  // Function to determine if a file is an image based on its URL
  const isImageFile = (url) => {
    if (!url) return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    return imageExtensions.some((ext) => url.toLowerCase().includes(ext));
  };

  // Function to render document preview
  const renderDocumentPreview = (documentUrl, documentName) => {
    if (!documentUrl) {
      return (
        <Box
          sx={{
            width: "100%",
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fafafa",
            borderRadius: 1,
            border: "1px dashed #ccc",
          }}
        >
          <Typography color="textSecondary" variant="body2">
            No document
          </Typography>
        </Box>
      );
    }

    if (isImageFile(documentUrl)) {
      return (
        <Box
          sx={{
            width: "100%",
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderRadius: 1,
            border: "1px solid #ddd",
            bgcolor: "#fff",
          }}
        >
          <img
            src={documentUrl}
            alt={documentName}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      );
    } else {
      // For PDF or other documents, show a placeholder
      return (
        <Box
          sx={{
            width: "100%",
            height: 140,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fafafa",
            borderRadius: 1,
            border: "1px solid #ddd",
          }}
        >
          <PictureAsPdfIcon sx={{ fontSize: 40, color: "#d32f2f" }} />
          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            PDF Document
          </Typography>
        </Box>
      );
    }
  };

  // Indian states list
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Resend invite / change email are only for live franchise partner accounts
  const isFranchisePartnerRow = (franchise) =>
    !isDeletedView &&
    !franchise.isDeleted &&
    franchise.userId &&
    typeof franchise.userId === "object" &&
    !franchise.userId.isDeleted &&
    (franchise.userId.subRole || "franchise") === "franchise";

  const handleResendInvite = async () => {
    if (!resendTarget) return;
    setResendLoading(true);
    try {
      const response = await adminAPI.resendFranchiseInvite(resendTarget._id);
      showSnackbar(response.data.message || "Credentials sent", "success");
      setResendTarget(null);
      fetchFranchises();
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to resend credentials",
        "error",
      );
    } finally {
      setResendLoading(false);
    }
  };

  const handleChangeEmailClick = (franchise) => {
    setEmailChangeTarget(franchise);
    setNewEmail("");
    setSendCredentialsOnEmailChange(true);
    setEmailChangeError("");
  };

  const handleCloseChangeEmail = () => {
    if (emailChangeLoading) return;
    setEmailChangeTarget(null);
    setEmailChangeError("");
  };

  const handleChangeEmail = async () => {
    if (!emailChangeTarget) return;
    const trimmed = newEmail.trim().toLowerCase();
    const currentEmail = (
      emailChangeTarget.userId?.email ||
      emailChangeTarget.email ||
      ""
    ).toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailChangeError("Please enter a valid email address");
      return;
    }
    if (trimmed === currentEmail) {
      setEmailChangeError("New email is the same as the current email");
      return;
    }

    setEmailChangeLoading(true);
    setEmailChangeError("");
    try {
      const response = await adminAPI.changeFranchiseEmail(
        emailChangeTarget._id,
        { newEmail: trimmed, sendCredentials: sendCredentialsOnEmailChange },
      );
      const { warning, message } = response.data;
      showSnackbar(warning || message, warning ? "warning" : "success");
      setEmailChangeTarget(null);
      fetchFranchises();
    } catch (err) {
      setEmailChangeError(
        err.response?.data?.message || "Failed to change email",
      );
    } finally {
      setEmailChangeLoading(false);
    }
  };

  // Gives every partner without a Business Manager a turn in the rotation
  const handleAssignBusinessManagers = async () => {
    try {
      setAssigning(true);
      const res = await adminAPI.assignBusinessManagersToPartners();
      const { assigned, managers = [] } = res.data.data;
      const breakdown = managers.map((m) => `${m.staffCode || m.name}: ${m.count}`).join(", ");
      showSnackbar(
        assigned ? `Assigned ${assigned} partner(s). ${breakdown}` : "No unassigned partners found",
        "success",
      );
      setAssignDialogOpen(false);
      fetchFranchises();
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Failed to assign Business Managers", "error");
    } finally {
      setAssigning(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      setCsvExporting(true);

      // Same tab, KYC filter and search as the list view
      const params = { search: appliedSearch, ...queryFor(view, status) };

      const response = await adminAPI.exportFranchisesCSV(params);

      // response.data is a Blob (because we requested responseType: "blob")
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      link.href = url;
      link.download = `franchise_export_${timestamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release the object URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 10000);

      showSnackbar("CSV exported successfully!", "success");
    } catch (err) {
      console.error("CSV export failed:", err);
      showSnackbar("Failed to export CSV. Please try again.", "error");
    } finally {
      setCsvExporting(false);
    }
  };

  const isFullAdmin = !currentUser?.staffRoleName;
  const canManageCredits = !currentUser?.scopedToOwnFranchises;
  const firstRecord = totalRecords ? (page - 1) * rowsPerPage + 1 : 0;
  const lastRecord = Math.min(page * rowsPerPage, totalRecords);

  // Count on a KYC filter chip (Active tab only; the counts endpoint has no per-status deleted split)
  const statusCount = (value) => {
    if (!counts || view !== "active") return null;
    return value === "all" ? counts.active : counts.byStatus?.[value] ?? null;
  };

  // Shown under "⋮" so the row keeps only its main actions inline
  const rowMenuItems = (franchise) => {
    if (!franchise) return [];
    const run = (action) => () => {
      closeRowMenu();
      action();
    };
    const items = [
      <MenuItem key="certificate" onClick={run(() => handleCertificateNameClick(franchise))}>
        <ListItemIcon>
          <PictureAsPdfIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Update certificate name</ListItemText>
      </MenuItem>,
    ];

    if (isFranchisePartnerRow(franchise)) {
      if (franchise.isActive) {
        items.push(
          <MenuItem key="resend" onClick={run(() => setResendTarget(franchise))}>
            <ListItemIcon>
              <Send fontSize="small" />
            </ListItemIcon>
            <ListItemText>Resend invite / credentials</ListItemText>
          </MenuItem>,
        );
      }
      items.push(
        <MenuItem key="email" onClick={run(() => handleChangeEmailClick(franchise))}>
          <ListItemIcon>
            <AlternateEmail fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change email</ListItemText>
        </MenuItem>,
      );
    }

    // Deleted records are read-only apart from Restore
    if (!isDeletedView) {
      items.push(<Divider key="divider-funds" />);
      if (!currentUser?.scopedToOwnFranchises) {
        items.push(
          <MenuItem key="change-rm" onClick={run(() => setRmFranchise(franchise))}>
            <ListItemIcon>
              <SwapHorizIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Change RM</ListItemText>
          </MenuItem>,
        );
      }
      if (canManageCredits) {
        items.push(
          <MenuItem key="credit-hold" onClick={run(() => handleToggleCreditHold(franchise))}>
            <ListItemIcon>
              {franchise.creditHold ? (
                <PlayCircleOutline fontSize="small" color="success" />
              ) : (
                <PauseCircleOutline fontSize="small" color="warning" />
              )}
            </ListItemIcon>
            <ListItemText>
              {franchise.creditHold ? "Release credit hold" : "Put credits on hold"}
            </ListItemText>
          </MenuItem>,
        );
      }
      items.push(
        <MenuItem key="add-funds" onClick={run(() => handleCreditClick(franchise, "add"))}>
          <ListItemIcon>
            <AddCircle fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Add funds</ListItemText>
        </MenuItem>,
        <MenuItem key="deduct-funds" onClick={run(() => handleCreditClick(franchise, "deduct"))}>
          <ListItemIcon>
            <RemoveCircle fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText>Deduct funds</ListItemText>
        </MenuItem>,
      );
      if (canBlacklistPartners(currentUser)) {
        items.push(
          <MenuItem key="blacklist" onClick={run(() => setBlacklistTarget(franchise))}>
            <ListItemIcon>
              <Block fontSize="small" color={franchise.isBlacklisted ? "success" : "error"} />
            </ListItemIcon>
            <ListItemText>
              {franchise.isBlacklisted ? "Remove from blacklist" : "Blacklist partner"}
            </ListItemText>
          </MenuItem>,
        );
      }
      items.push(
        <Divider key="divider-delete" />,
        <MenuItem
          key="delete"
          onClick={run(() => handleDeleteFranchiseClick(franchise))}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete franchise</ListItemText>
        </MenuItem>,
      );
    }
    return items;
  };

  return (
    <Box>
      {/* Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Franchises
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Review new registrations, manage active partners and restore deleted ones.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {isFullAdmin && (
            <Button
              variant="outlined"
              startIcon={<SupervisorAccount />}
              onClick={() => setAssignDialogOpen(true)}
            >
              Assign BM to Partners
            </Button>
          )}
          <Button
            variant="outlined"
            color="success"
            startIcon={
              csvExporting ? <CircularProgress size={16} color="inherit" /> : <Download />
            }
            onClick={handleDownloadCSV}
            disabled={csvExporting}
          >
            {csvExporting ? "Exporting..." : "Download CSV"}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Franchise
          </Button>
        </Stack>
      </Stack>

      <Dialog open={assignDialogOpen} onClose={() => !assigning && setAssignDialogOpen(false)}>
        <DialogTitle>Assign Business Managers</DialogTitle>
        <DialogContent>
          <Typography>
            Assign every partner without a Business Manager to the active Business Managers, one
            after another in serial order? Partners that already have one are not changed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)} disabled={assigning}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAssignBusinessManagers} disabled={assigning}>
            {assigning ? "Assigning..." : "Assign"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() =>
          setSnackbar({
            ...snackbar,
            open: false,
          })
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar({
              ...snackbar,
              open: false,
            })
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Paper
        elevation={0}
        sx={{ borderRadius: 3, border: 1, borderColor: "divider", overflow: "hidden" }}
      >
        <Tabs
          value={view}
          onChange={(_, next) => changeView(next)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 1,
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600, minHeight: 60 },
          }}
        >
          {VIEW_KEYS.map((key) => {
            const count = counts ? counts[key] : null;
            const selected = view === key;
            return (
              <Tab
                key={key}
                value={key}
                icon={VIEWS[key].icon}
                iconPosition="start"
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>{VIEWS[key].label}</span>
                    {count !== null && count !== undefined && (
                      <Chip
                        size="small"
                        label={count}
                        sx={{
                          height: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          bgcolor: selected
                            ? "primary.main"
                            : key === "pending" && count > 0
                              ? "warning.light"
                              : "grey.200",
                          color: selected ? "primary.contrastText" : "text.primary",
                        }}
                      />
                    )}
                  </Stack>
                }
              />
            );
          })}
        </Tabs>

        {/* Search + KYC filter */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
          sx={{ p: 2 }}
        >
          <Box component="form" onSubmit={handleSearch} sx={{ flex: 1, maxWidth: { md: 520 } }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by partner ID, business name, owner, email or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label="Clear search"
                      onClick={() => setSearchTerm("")}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Box>

          {statusOptions && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
              <Typography variant="body2" color="text.secondary">
                KYC:
              </Typography>
              {statusOptions.map((option) => {
                const selected = status === option.value;
                const count = statusCount(option.value);
                return (
                  <Chip
                    key={option.value}
                    clickable
                    onClick={() => changeStatus(option.value)}
                    color={selected ? "primary" : "default"}
                    variant={selected ? "filled" : "outlined"}
                    label={count === null ? option.label : `${option.label} (${count})`}
                  />
                );
              })}
            </Stack>
          )}
        </Stack>

        {(error || success) && (
          <Stack spacing={1} sx={{ px: 2, pb: 2 }}>
            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" onClose={() => setSuccess("")}>
                {success}
              </Alert>
            )}
          </Stack>
        )}

        <Box sx={{ height: 4 }}>{loading && <LinearProgress />}</Box>

        <TableContainer>
          <Table
            size="small"
            sx={{ tableLayout: "fixed", minWidth: TABLE_MIN_WIDTH }}
            aria-label="franchises table"
          >
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    bgcolor: "grey.50",
                    color: "text.secondary",
                    fontWeight: 600,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                    whiteSpace: "nowrap",
                    py: 1.25,
                  },
                }}
              >
                {COLUMNS.map((col) => (
                  <TableCell key={col.key} align={col.align} sx={{ width: col.width }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFranchises.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={COLUMNS.length}
                    sx={{ py: 8, textAlign: "center", borderBottom: 0 }}
                  >
                    {loading ? (
                      <CircularProgress size={28} />
                    ) : (
                      <>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {VIEWS[view].emptyTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {appliedSearch ? "Try a different search term." : VIEWS[view].emptyHint}
                        </Typography>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredFranchises.map((franchise) => {
                  const user = isFranchisePartnerRow(franchise) ? franchise.userId : null;
                  const manager = franchise.businessManager;
                  const color = avatarColor(franchise.businessName || franchise.email);
                  return (
                    <TableRow
                      key={franchise._id}
                      hover
                      sx={{
                        "& td": { py: 1.25, verticalAlign: "middle" },
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      {/* Partner */}
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              fontSize: 13,
                              fontWeight: 700,
                              bgcolor: `${color}1f`,
                              color,
                            }}
                          >
                            {initialsOf(franchise.businessName)}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <CellText variant="body2" fontWeight={600}>
                              {franchise.businessName || "—"}
                            </CellText>
                            {franchise.franchiseCode ? (
                              <Typography
                                component={Link}
                                to={`/admin/franchise/${franchise.franchiseCode}`}
                                variant="caption"
                                sx={{
                                  color: "primary.main",
                                  fontWeight: 600,
                                  textDecoration: "none",
                                  "&:hover": { textDecoration: "underline" },
                                }}
                              >
                                {franchise.franchiseCode}
                              </Typography>
                            ) : (
                              <Typography variant="caption" color="text.secondary">
                                No partner ID yet
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Owner */}
                      <TableCell>
                        <CellText variant="body2">{displayName(franchise.ownerName) || "—"}</CellText>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {franchise.phone || "No phone"}
                        </Typography>
                      </TableCell>

                      {/* Email & login */}
                      <TableCell>
                        <CellText variant="body2">{franchise.email || "—"}</CellText>
                        {user && (
                          <Tooltip
                            placement="bottom-start"
                            title={
                              user.credentialsSentAt
                                ? `Invite sent ${shortDate(user.credentialsSentAt)} (×${user.credentialsSentCount || 1})`
                                : "No invite sent yet"
                            }
                          >
                            <Stack
                              direction="row"
                              spacing={0.75}
                              alignItems="center"
                              sx={{ width: "fit-content", maxWidth: "100%" }}
                            >
                              <Box
                                sx={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                  bgcolor: user.lastLoginAt ? "success.main" : "warning.main",
                                }}
                              />
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {user.lastLoginAt
                                  ? `Last login ${shortDate(user.lastLoginAt)}`
                                  : "Never logged in"}
                              </Typography>
                            </Stack>
                          </Tooltip>
                        )}
                      </TableCell>

                      {/* KYC */}
                      <TableCell>{getStatusChip(franchise.kycStatus || "pending")}</TableCell>

                      {/* Status */}
                      <TableCell>
                        {isDeletedView ? (
                          <Chip size="small" label="Deleted" variant="outlined" />
                        ) : (
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Switch
                              size="small"
                              checked={Boolean(franchise.isActive)}
                              onChange={() =>
                                handleToggleStatus(franchise._id, franchise.isActive)
                              }
                              inputProps={{ "aria-label": "Active" }}
                            />
                            <Typography
                              variant="body2"
                              color={franchise.isActive ? "text.primary" : "text.secondary"}
                            >
                              {franchise.isActive ? "Active" : "Inactive"}
                            </Typography>
                          </Stack>
                        )}
                        {franchise.isBlacklisted && (
                          <Tooltip title={franchise.blacklistReason || ""}>
                            <Chip
                              label="Blacklisted"
                              color="error"
                              size="small"
                              icon={<Block />}
                              sx={{ mt: 0.5 }}
                            />
                          </Tooltip>
                        )}
                      </TableCell>

                      {/* Credits */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          sx={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {franchise.credits ?? 0}
                        </Typography>
                        {franchise.creditHold && (
                          <Chip
                            label="On hold"
                            color="warning"
                            size="small"
                            variant="outlined"
                            sx={{ mt: 0.25, height: 20, fontSize: 11 }}
                          />
                        )}
                      </TableCell>

                      {/* RM */}
                      <TableCell>
                        {manager ? (
                          <>
                            {currentUser?.scopedToOwnFranchises ? (
                              <CellText variant="body2">{manager.name}</CellText>
                            ) : (
                              <CellText
                                variant="body2"
                                component={Link}
                                to={`/admin/staff/${manager._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  display: "block",
                                  color: "text.primary",
                                  textDecoration: "none",
                                  "&:hover": { color: "primary.main", textDecoration: "underline" },
                                }}
                              >
                                {manager.name}
                              </CellText>
                            )}
                            {manager.staffCode && (
                              <Typography variant="caption" color="text.secondary">
                                {manager.staffCode}
                              </Typography>
                            )}
                          </>
                        ) : (
                          <Chip size="small" variant="outlined" label="Unassigned" />
                        )}
                      </TableCell>

                      {/* Created */}
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {shortDate(franchise.createdAt)}
                        </Typography>
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {/* Self-registered partners waiting for approval */}
                        {!isDeletedView &&
                          franchise.kycStatus === "pending" &&
                          !franchise.isActive && (
                            <Button
                              size="small"
                              variant="contained"
                              disableElevation
                              onClick={() => handleViewRegistrationDetails(franchise)}
                              sx={{ mr: 0.5, minWidth: 0, px: 1.25 }}
                            >
                              Review
                            </Button>
                          )}
                        {!isDeletedView && franchise.kycStatus === "submitted" && (
                          <>
                            <Tooltip title="Approve KYC">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleApproveKyc(franchise._id)}
                              >
                                <Check fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject KYC">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRejectKycClick(franchise)}
                              >
                                <Close fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {isDeletedView && (
                          <Tooltip title="Restore franchise">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleRestoreFranchise(franchise._id)}
                            >
                              <Restore fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="View details">
                          <IconButton size="small" onClick={() => handleViewKyc(franchise)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditFranchiseClick(franchise)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More actions">
                          <IconButton
                            size="small"
                            aria-label="More actions"
                            onClick={(e) => openRowMenu(e, franchise)}
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

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: "divider" }}
        >
          <Typography variant="body2" color="text.secondary">
            {totalRecords
              ? `Showing ${firstRecord}–${lastRecord} of ${totalRecords}`
              : "No records"}
          </Typography>
          <Pagination
            count={Math.max(1, Math.ceil(totalRecords / rowsPerPage))}
            page={page}
            onChange={handleChangePage}
            color="primary"
            shape="rounded"
            size="small"
            showFirstButton
            showLastButton
          />
        </Stack>
      </Paper>

      {/* Franchise Details Dialog */}
      <Dialog
        open={kycDialogOpen}
        onClose={handleCloseKycDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          sx={{ bgcolor: "primary.main", color: "white", fontWeight: "bold" }}
        >
          Franchise Details - {selectedFranchise?.businessName}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#f5f5f5" }}>
          {kycLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              {(() => {
                const franchise = selectedFranchise || {};
                const user =
                  franchise.userId && typeof franchise.userId === "object"
                    ? franchise.userId
                    : {};
                const kyc = kycData || {};
                const address = franchise.address || {};

                return (
                  <>
                    <DetailSection title="User Details">
                      <DetailItem label="User Name" value={user.name} />
                      <DetailItem
                        label="Owner Name"
                        value={franchise.ownerName}
                      />
                      <DetailItem
                        label="Email"
                        value={user.email || franchise.email}
                      />
                      <DetailItem
                        label="Phone"
                        value={user.phone || franchise.phone}
                      />
                      <DetailItem
                        label="Business Name"
                        value={franchise.businessName}
                      />
                      <DetailItem
                        label="Franchise ID"
                        value={franchise.franchiseCode}
                      />
                      <DetailItem
                        label="Created On"
                        value={formatDate(franchise.createdAt)}
                      />
                      <DetailItem
                        label="Account Status"
                        value={
                          franchise.isDeleted
                            ? "Deleted"
                            : franchise.isActive
                              ? "Active"
                              : "Inactive"
                        }
                      />
                    </DetailSection>

                    <DetailSection title="Business & Address Details">
                      <DetailItem
                        label="Business Name"
                        value={franchise.businessName}
                      />
                      <DetailItem
                        label="Certificate Name"
                        value={franchise.certificateName}
                      />
                      <DetailItem label="Street" value={address.street} />
                      <DetailItem label="City" value={address.city} />
                      <DetailItem label="State" value={address.state} />
                      <DetailItem label="Pincode" value={address.pincode} />
                      <DetailItem
                        label="Country"
                        value={address.country || "India"}
                      />
                    </DetailSection>

                    <DetailSection title="KYC Details">
                      <DetailItem
                        label="KYC Status"
                        value={getStatusChip(
                          kyc.status || franchise.kycStatus || "pending",
                        )}
                      />
                      <DetailItem
                        label="PAN Number"
                        value={kyc.panNumber || franchise.panNumber}
                      />
                      <DetailItem
                        label="Aadhaar Number"
                        value={kyc.aadhaarNumber}
                      />
                      <DetailItem
                        label="Submitted At"
                        value={formatDate(
                          kyc.submittedAt || franchise.kycSubmittedAt,
                        )}
                      />
                      <DetailItem
                        label="Approved At"
                        value={formatDate(franchise.kycApprovedAt)}
                      />
                      {kyc.source === "franchise-profile" && (
                        <Grid item xs={12}>
                          <Alert severity="info">
                            No KYC submission on record for this franchise.
                            Showing details from the franchise profile instead.
                          </Alert>
                        </Grid>
                      )}
                    </DetailSection>

                    <DetailSection title="Bank Details">
                      <DetailItem
                        label="Bank Account Number"
                        value={franchise.bankAccountNumber}
                      />
                      <DetailItem
                        label="IFSC Code"
                        value={franchise.bankIfscCode}
                      />
                    </DetailSection>

                    <DetailSection title="KYC Documents">
                      {[
                        { label: "Aadhaar Front", url: kyc.aadhaarFrontDocument },
                        { label: "Aadhaar Back", url: kyc.aadhaarBackDocument },
                        { label: "PAN Card", url: kyc.panDocument },
                        {
                          label: "Business Registration",
                          url: kyc.businessRegistrationDocument,
                        },
                      ].map((doc) => (
                        <Grid item xs={12} sm={6} md={3} key={doc.label}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mb: 0.5 }}
                          >
                            <strong>{doc.label}</strong>
                          </Typography>
                          <Box
                            onClick={() =>
                              handleViewDocument(doc.url, doc.label)
                            }
                            sx={{ cursor: doc.url ? "pointer" : "default" }}
                          >
                            {renderDocumentPreview(doc.url, doc.label)}
                          </Box>
                        </Grid>
                      ))}
                    </DetailSection>
                  </>
                );
              })()}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#f5f5f5", p: 2 }}>
          <Button
            onClick={handleCloseKycDialog}
            variant="contained"
            color="primary"
            sx={{
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
              fontWeight: "bold",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* KYC Rejection Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={handleCloseRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {franchiseToReject?.kycStatus === "submitted"
            ? "Reject KYC Request"
            : "Reject Registration"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Please provide a reason for rejecting the{" "}
            {franchiseToReject?.kycStatus === "submitted"
              ? "KYC request"
              : "registration"}{" "}
            for {franchiseToReject?.businessName}.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>Cancel</Button>
          <Button
            onClick={
              franchiseToReject?.kycStatus === "submitted"
                ? handleRejectKyc
                : handleRejectRegistration
            }
            variant="contained"
            color="error"
            disabled={!rejectionReason.trim() || loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              `Reject ${
                franchiseToReject?.kycStatus === "submitted"
                  ? "KYC"
                  : "Registration"
              }`
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Franchise Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            <strong>{franchiseToDelete?.businessName}</strong> — Franchise
            will be deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteFranchise}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add / Deduct Funds Dialog */}
      <CreditAdjustDialog
        open={creditDialogOpen}
        onClose={handleCloseCreditDialog}
        franchise={creditFranchise}
        mode={creditMode}
        onSuccess={handleCreditSuccess}
      />

      {/* Blacklist / remove from blacklist (Admin and Business Managers) */}
      <BlacklistPartnerDialog
        franchise={blacklistTarget}
        onClose={() => setBlacklistTarget(null)}
        onSaved={(message) => {
          setBlacklistTarget(null);
          setError("");
          setSuccess(message);
          fetchFranchises();
        }}
      />

      {/* Row "more actions" menu */}
      <Menu
        anchorEl={rowMenu.anchor}
        open={Boolean(rowMenu.anchor)}
        onClose={closeRowMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { minWidth: 240 } }}
      >
        {rowMenuItems(rowMenu.franchise)}
      </Menu>

      {/* Change Business Manager (RM) */}
      {rmFranchise && (
        <ReassignRmDialog
          franchise={rmFranchise}
          onClose={() => setRmFranchise(null)}
          onSaved={() => {
            setRmFranchise(null);
            fetchFranchises();
          }}
        />
      )}

      {/* Create Franchise modal */}
      <CreateFranchiseDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreated={handleFranchiseCreated}
        packages={packages}
        canPickManager={isFullAdmin}
      />

      {/* Edit Franchise Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Franchise Details</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleUpdateFranchise}>
            {/* Basic Information Section */}
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    textAlign: "left",
                  }}
                >
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Business Name"
                  name="businessName"
                  value={editFranchiseData.businessName || ""}
                  onChange={handleEditFranchiseChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Owner Name"
                  name="ownerName"
                  value={editFranchiseData.ownerName || ""}
                  onChange={handleEditFranchiseChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Email Address"
                  name="email"
                  type="email"
                  value={editFranchiseData.email || ""}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                  helperText="Use the 'Change email' action in the list to update the login email"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Phone Number"
                  name="phone"
                  value={editFranchiseData.phone || ""}
                  onChange={handleEditFranchiseChange}
                  margin="normal"
                />
              </Grid>
            </Grid>

            {/* Address Information Section */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    textAlign: "left",
                  }}
                >
                  Address Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Street"
                  name="address.street"
                  value={editFranchiseData.address?.street || ""}
                  onChange={handleEditFranchiseChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="address.city"
                  value={editFranchiseData.address?.city || ""}
                  onChange={handleEditFranchiseChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="address.state"
                  value={editFranchiseData.address?.state || ""}
                  onChange={handleEditFranchiseChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="address.pincode"
                  value={editFranchiseData.address?.pincode || ""}
                  onChange={handleEditFranchiseChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="address.country"
                  value={editFranchiseData.address?.country || "India"}
                  onChange={handleEditFranchiseChange}
                  margin="normal"
                />
              </Grid>
            </Grid>

            {/* Financial Information Section */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    textAlign: "left",
                  }}
                >
                  Financial Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="PAN Number"
                  name="panNumber"
                  value={editFranchiseData.panNumber || ""}
                  onChange={handleEditFranchiseChange}
                  margin="normal"
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bank Account Number"
                  name="bankAccountNumber"
                  value={editFranchiseData.bankAccountNumber || ""}
                  onChange={handleEditFranchiseChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bank IFSC Code"
                  name="bankIfscCode"
                  value={editFranchiseData.bankIfscCode || ""}
                  onChange={handleEditFranchiseChange}
                  margin="normal"
                  inputProps={{ maxLength: 11 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Certificate Name"
                  name="certificateName"
                  value={editFranchiseData.certificateName || ""}
                  onChange={handleEditFranchiseChange}
                  margin="normal"
                  helperText="Custom name to appear on certificates"
                />
              </Grid>
            </Grid>

            {/* Credits Section */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    textAlign: "left",
                  }}
                >
                  Credits Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Credits"
                  disabled="true"
                  name="credits"
                  type="number"
                  value={editFranchiseData.credits || 0}
                  onChange={handleEditFranchiseChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Credits Purchased"
                  name="totalCreditsPurchased"
                  type="number"
                  disabled="true"
                  value={editFranchiseData.totalCreditsPurchased || 0}
                  onChange={handleEditFranchiseChange}
                  margin="normal"
                />
              </Grid>
            </Grid>

            {/* Status Section */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    textAlign: "left",
                  }}
                >
                  Status Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>KYC Status</InputLabel>
                  <Select
                    name="kycStatus"
                    value={editFranchiseData.kycStatus || "pending"}
                    onChange={handleEditFranchiseChange}
                    label="KYC Status"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="submitted">Submitted</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        editFranchiseData.isActive !== undefined
                          ? editFranchiseData.isActive
                          : true
                      }
                      onChange={(e) =>
                        setEditFranchiseData((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      name="isActive"
                      color="primary"
                    />
                  }
                  label={editFranchiseData.isActive ? "Active" : "Inactive"}
                  sx={{ mt: 3 }}
                />
              </Grid>
            </Grid>
          </Box>
          {/* Packages Information Section */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  textAlign: "left",
                }}
              >
                Package History
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12}>
              {/* Display both assigned and purchased packages */}
              {(editFranchiseData.allPackages &&
                editFranchiseData.allPackages.assigned &&
                editFranchiseData.allPackages.assigned.length > 0) ||
              (editFranchiseData.allPackages &&
                editFranchiseData.allPackages.purchased &&
                editFranchiseData.allPackages.purchased.length > 0) ||
              (editFranchiseData.packageHistory &&
                editFranchiseData.packageHistory.length > 0) ? (
                <Box>
                  {/* Package History Section */}
                  {editFranchiseData.packageHistory &&
                    editFranchiseData.packageHistory.length > 0 && (
                      <Box>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="primary.main"
                          gutterBottom
                        >
                          Package History:
                        </Typography>
                        {editFranchiseData.packageHistory.map((pkg, index) => (
                          <Box
                            key={pkg._id || `history-${index}`}
                            sx={{
                              mb: 1,
                              p: 2,
                              bgcolor: "#e3f2fd",
                              borderRadius: 1,
                              border: "1px solid #2196f3",
                            }}
                          >
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              gutterBottom
                            >
                              {pkg.packageName}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              gutterBottom
                            >
                              Price: ₹{pkg.price}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              gutterBottom
                            >
                              Credits Included: {pkg.creditsIncluded}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Upgrade Date:{" "}
                              {new Date(pkg.upgradeDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}

                  {/* Assigned Packages Section */}
                  {editFranchiseData.allPackages &&
                    editFranchiseData.allPackages.assigned &&
                    editFranchiseData.allPackages.assigned.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="primary.main"
                          gutterBottom
                        >
                          Current Assigned Packages:
                        </Typography>
                        <Grid item xs={12} sm={12}>
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Select New Package</InputLabel>
                            <Select
                              fullWidth
                              name="assignedPackages"
                              value={
                                newPackage ||
                                editFranchiseData.assignedPackages[0]._id
                              }
                              onChange={(e) => {
                                setNewPackage(e.target.value);
                              }}
                              label="Select Package"
                              sx={{ mb: 2 }}
                            >
                              {packages.map((packageOption) => (
                                <MenuItem value={packageOption._id}>
                                  {packageOption.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Box>
                    )}

                  {/* Purchased Packages Section */}
                  {editFranchiseData.allPackages &&
                    editFranchiseData.allPackages.purchased &&
                    editFranchiseData.allPackages.purchased.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="secondary.main"
                          gutterBottom
                        >
                          Purchased Packages:
                        </Typography>
                        {editFranchiseData.allPackages.purchased.map(
                          (pkg, index) => (
                            <Box
                              key={pkg._id || `purchased-${index}`}
                              sx={{
                                mb: 1,
                                p: 2,
                                bgcolor: "lightgreen",
                                borderRadius: 1,
                                border: "1px solid #90ee90",
                              }}
                            >
                              <Typography
                                variant="body1"
                                fontWeight="bold"
                                gutterBottom
                              >
                                {pkg.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                gutterBottom
                              >
                                Price: ₹{pkg.price}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Credits Included: {pkg.creditsIncluded}
                              </Typography>
                            </Box>
                          ),
                        )}
                      </Box>
                    )}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No package history available
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateFranchise}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update Franchise"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Registration Details Dialog */}
      <Dialog
        open={registrationDialogOpen}
        onClose={handleCloseRegistrationDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Registration Details</DialogTitle>
        <DialogContent>
          {selectedFranchise && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Business Information
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Business Name
                  </Typography>
                  <Typography variant="body1">
                    {selectedFranchise.businessName || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Owner Name
                  </Typography>
                  <Typography variant="body1">
                    {selectedFranchise.ownerName || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mt: 2 }}
                  >
                    Contact Information
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {selectedFranchise.email || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {selectedFranchise.phone || "N/A"}
                  </Typography>
                </Grid>

                {selectedFranchise.address && (
                  <>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mt: 2 }}
                      >
                        Address Information
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Street
                      </Typography>
                      <Typography variant="body1">
                        {selectedFranchise.address.street || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        City
                      </Typography>
                      <Typography variant="body1">
                        {selectedFranchise.address.city || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        State
                      </Typography>
                      <Typography variant="body1">
                        {selectedFranchise.address.state || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Pincode
                      </Typography>
                      <Typography variant="body1">
                        {selectedFranchise.address.pincode || "N/A"}
                      </Typography>
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mt: 2 }}
                  >
                    Registration Status
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    KYC Status
                  </Typography>
                  <Typography variant="body1">
                    {selectedFranchise.kycStatus || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Account Status
                  </Typography>
                  <Typography variant="body1">
                    {selectedFranchise.isActive ? "Active" : "Inactive"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Registration Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedFranchise.createdAt)}
                  </Typography>
                </Grid>

                {/* PAN Details */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mt: 2 }}
                  >
                    PAN Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    PAN Number
                  </Typography>
                  <Typography variant="body1">
                    {selectedFranchise.panNumber || "N/A"}
                  </Typography>
                </Grid>
                {selectedFranchise.panDetails &&
                  selectedFranchise.panDetails.data && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Full Name
                        </Typography>
                        <Typography variant="body1">
                          {selectedFranchise.panDetails.data.full_name || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Masked Aadhaar
                        </Typography>
                        <Typography variant="body1">
                          {selectedFranchise.panDetails.data.masked_aadhaar ||
                            "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Gender
                        </Typography>
                        <Typography variant="body1">
                          {selectedFranchise.panDetails.data.gender || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Date of Birth
                        </Typography>
                        <Typography variant="body1">
                          {selectedFranchise.panDetails.data.dob || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Category
                        </Typography>
                        <Typography variant="body1">
                          {selectedFranchise.panDetails.data.category || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Status
                        </Typography>
                        <Typography variant="body1">
                          {selectedFranchise.panDetails.data.status || "N/A"}
                        </Typography>
                      </Grid>

                      {/* Address Information from PAN */}
                      {selectedFranchise.panDetails.data.address && (
                        <>
                          <Grid item xs={12}>
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              sx={{ mt: 2 }}
                            >
                              Address from PAN
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="textSecondary">
                              Address Line 1
                            </Typography>
                            <Typography variant="body1">
                              {selectedFranchise.panDetails.data.address
                                .line_1 || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="textSecondary">
                              City
                            </Typography>
                            <Typography variant="body1">
                              {selectedFranchise.panDetails.data.address.city ||
                                "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="textSecondary">
                              State
                            </Typography>
                            <Typography variant="body1">
                              {selectedFranchise.panDetails.data.address
                                .state || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="textSecondary">
                              Zip Code
                            </Typography>
                            <Typography variant="body1">
                              {selectedFranchise.panDetails.data.address.zip ||
                                "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary">
                              Full Address
                            </Typography>
                            <Typography variant="body1">
                              {selectedFranchise.panDetails.data.address.full ||
                                "N/A"}
                            </Typography>
                          </Grid>
                        </>
                      )}
                    </>
                  )}
                {/* Bank Details */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mt: 2 }}
                  >
                    Bank Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Bank Account Number
                  </Typography>
                  <Typography variant="body1">
                    {selectedFranchise.bankAccountNumber
                      ? `XXXXXX${selectedFranchise.bankAccountNumber.slice(-4)}`
                      : "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    IFSC Code
                  </Typography>
                  <Typography variant="body1">
                    {selectedFranchise.bankIfscCode || "N/A"}
                  </Typography>
                </Grid>
                {selectedFranchise.bankDetails &&
                  selectedFranchise.bankDetails.data && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Account Holder Name
                        </Typography>
                        <Typography variant="body1">
                          {selectedFranchise.bankDetails.data.full_name ||
                            "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Account Exists
                        </Typography>
                        <Typography variant="body1">
                          {selectedFranchise.bankDetails.data.account_exists
                            ? "Yes"
                            : "No"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Bank Name
                        </Typography>
                        <Typography variant="body1">
                          {selectedFranchise.bankDetails.data.ifsc_details
                            ?.bank_name || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Branch
                        </Typography>
                        <Typography variant="body1">
                          {selectedFranchise.bankDetails.data.ifsc_details
                            ?.branch || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          RTGS Enabled
                        </Typography>
                        <Typography variant="body1">
                          {selectedFranchise.bankDetails.data.ifsc_details?.rtgs
                            ? "Yes"
                            : "No"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          NEFT Enabled
                        </Typography>
                        <Typography variant="body1">
                          {selectedFranchise.bankDetails.data.ifsc_details?.neft
                            ? "Yes"
                            : "No"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          MICR Check
                        </Typography>
                        <Typography variant="body1">
                          {selectedFranchise.bankDetails.data.ifsc_details
                            ?.micr_check
                            ? "Yes"
                            : "No"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Status
                        </Typography>
                        <Typography variant="body1">
                          {selectedFranchise.bankDetails.data.status || "N/A"}
                        </Typography>
                      </Grid>
                    </>
                  )}
                {/* Package Assignment for Approval */}
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    style={{ minWidth: "200px" }}
                  >
                    <InputLabel>Assign Packages (Optional)</InputLabel>
                    <Select
                      multiple
                      value={approvalPackages}
                      onChange={(e) => setApprovalPackages(e.target.value)}
                      label="Assign Packages (Optional)"
                      renderValue={(selected) =>
                        selected
                          .map((id) => {
                            const pkg = packages.find((p) => p._id === id);
                            return pkg ? pkg.name : "";
                          })
                          .join(", ")
                      }
                    >
                      {packages.map((pkg) => (
                        <MenuItem key={pkg._id} value={pkg._id}>
                          <Checkbox
                            checked={approvalPackages.indexOf(pkg._id) > -1}
                          />
                          <ListItemText
                            primary={pkg.name}
                            secondary={`₹${pkg.price} - ${pkg.creditsIncluded} credits`}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 3,
                }}
              >
                <Button
                  onClick={() =>
                    handleRejectRegistrationClick(selectedFranchise)
                  }
                  variant="outlined"
                  color="error"
                  startIcon={<Close />}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Reject Registration"
                  )}
                </Button>
                <Button
                  onClick={() =>
                    handleApproveRegistration(selectedFranchise._id)
                  }
                  variant="contained"
                  color="success"
                  startIcon={<Check />}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Approve Registration"
                  )}
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRegistrationDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Certificate Name Update Dialog */}
      <Dialog
        open={certificateDialogOpen}
        onClose={handleCertificateDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Update Certificate Name
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" paragraph>
              Update the certificate name for{" "}
              {certificateFranchise?.businessName}
            </Typography>
            <TextField
              fullWidth
              label="Certificate Name"
              value={certificateName}
              onChange={handleCertificateNameChange}
              variant="outlined"
              sx={{ mt: 2 }}
              helperText="This name will appear on the franchise's certificate"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCertificateDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleCertificateNameSubmit}
            variant="contained"
            color="primary"
            disabled={loading || !certificateName.trim()}
          >
            {loading ? <CircularProgress size={24} /> : "Update Name"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resend Invite Dialog */}
      <Dialog
        open={Boolean(resendTarget)}
        onClose={() => !resendLoading && setResendTarget(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Resend Invite / Credentials</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>
            Send new login credentials to{" "}
            <strong>{resendTarget?.userId?.email || resendTarget?.email}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            A new password will be generated and emailed. If the email cannot
            be sent, the current password stays unchanged.
          </Typography>
          {resendTarget?.userId?.lastLoginAt && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This partner has already logged in (last login{" "}
              {formatDate(resendTarget.userId.lastLoginAt)}). Their current
              password will stop working.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setResendTarget(null)}
            disabled={resendLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleResendInvite}
            disabled={resendLoading}
            startIcon={
              resendLoading ? <CircularProgress size={18} /> : <Send />
            }
          >
            {resendLoading ? "Sending..." : "Send Credentials"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Email Dialog */}
      <Dialog
        open={Boolean(emailChangeTarget)}
        onClose={handleCloseChangeEmail}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Franchise Email</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Current Email"
            value={emailChangeTarget?.userId?.email || emailChangeTarget?.email || ""}
            margin="normal"
            InputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth
            autoFocus
            label="New Email"
            type="email"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              setEmailChangeError("");
            }}
            margin="normal"
            error={Boolean(emailChangeError)}
            helperText={
              emailChangeError ||
              "This becomes the partner's login email as well"
            }
            disabled={emailChangeLoading}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={sendCredentialsOnEmailChange}
                onChange={(e) =>
                  setSendCredentialsOnEmailChange(e.target.checked)
                }
                disabled={emailChangeLoading}
              />
            }
            label="Send new login credentials to the new email"
          />
          {!sendCredentialsOnEmailChange && (
            <Alert severity="info" sx={{ mt: 1 }}>
              The password will stay the same. Inform the partner that they
              must log in with the new email.
            </Alert>
          )}
          {sendCredentialsOnEmailChange && emailChangeTarget && !emailChangeTarget.isActive && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              This franchise is inactive, so credentials will not be sent
              until it is activated.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChangeEmail} disabled={emailChangeLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleChangeEmail}
            disabled={emailChangeLoading || !newEmail.trim()}
            startIcon={
              emailChangeLoading ? <CircularProgress size={18} /> : <AlternateEmail />
            }
          >
            {emailChangeLoading ? "Saving..." : "Change Email"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Certificate Success Snackbar */}
      <Snackbar
        open={certificateSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCertificateSnackbarClose}
        message={certificateSuccess}
      />
    </Box>
  );
};

export default ManageFranchises;
