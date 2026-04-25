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
  AppBar,
  Tabs,
  Tab,
  Divider,
  Checkbox,
  ListItemText,
  Snackbar,
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
  Info,
} from "@mui/icons-material";
import { adminAPI } from "../../services/api";

const ManageFranchises = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [franchises, setFranchises] = useState([]);
  const [filteredFranchises, setFilteredFranchises] = useState([]);
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
  const [newFranchise, setNewFranchise] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    pincode: "",
    language: "english",
    businessName: "",
    ownerName: "",
  });
  const [tabValue, setTabValue] = useState(0);

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
  const [selectedPackages, setSelectedPackages] = useState([]); // For create franchise dialog
  const [approvalPackages, setApprovalPackages] = useState([]); // For registration approval dialog

  // Fetch all franchises and packages on component mount
  useEffect(() => {
    fetchFranchises();
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await adminAPI.getAllPackages();
      setPackages(response.data);
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  const fetchFranchises = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminAPI.getAllFranchises();
      setFranchises(response.data);
      setFilteredFranchises(response.data);
    } catch (err) {
      setError("Failed to fetch franchises. Please try again later.");
      console.error("Error fetching franchises:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilteredFranchises(franchises);
      return;
    }

    const filtered = franchises.filter(
      (franchise) =>
        franchise.businessName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        franchise.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        franchise.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        franchise.phone.includes(searchTerm),
    );

    setFilteredFranchises(filtered);
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
        totalCreditsPurchased:
          parseInt(editFranchiseData.totalCreditsPurchased) || 0,
      };

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

      // Call the delete franchise API endpoint
      await adminAPI.deleteFranchise(franchiseToDelete._id);
      setSuccess("Franchise deleted successfully!");
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

  // Handle close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setFranchiseToDelete(null);
  };

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
    setNewFranchise({
      name: "",
      email: "",
      phone: "",
      state: "",
      pincode: "",
      language: "english",
      businessName: "",
      ownerName: "",
    });
    setSelectedPackages([]); // Reset selected packages
  };

  const handleCreateFranchiseChange = (e) => {
    const { name, value } = e.target;
    setNewFranchise((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateFranchise = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Validate required fields
      if (!newFranchise.name || !newFranchise.email) {
        setError("Please fill in all required fields.");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newFranchise.email)) {
        setError("Please enter a valid email address.");
        return;
      }

      // Include assigned packages in the request
      const franchiseData = {
        name: newFranchise.name,
        email: newFranchise.email,
        assignedPackages: selectedPackages,
      };

      await adminAPI.createFranchiseUser(franchiseData);
      setSuccess(
        "Franchise user created successfully! Login credentials sent to user email.",
      );
      handleCloseCreateDialog();
      fetchFranchises();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create franchise user. Please try again.",
      );
      console.error("Error creating franchise user:", err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Franchise Partners
      </Typography>

      <AppBar position="static" color="default" sx={{ mb: 3, borderRadius: 1 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Franchise List" />
          <Tab label="Create New Franchise" />
        </Tabs>
      </AppBar>

      {tabValue === 0 && (
        <>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={10}>
                    <TextField
                      fullWidth
                      placeholder="Search franchises by business name, owner name, or email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <Search sx={{ mr: 1, color: "text.secondary" }} />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : "Search"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenCreateDialog}
                sx={{ mb: 2 }}
              >
                Create New Franchise
              </Button>

              {loading && filteredFranchises.length === 0 ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="franchises table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Business Name</TableCell>
                        <TableCell>Owner</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>KYC Status</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Credits</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredFranchises.map((franchise) => (
                        <TableRow
                          key={franchise._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {franchise.businessName}
                          </TableCell>
                          <TableCell>{franchise.ownerName}</TableCell>
                          <TableCell
                            style={{
                              minWidth: "170px",
                              wordBreak: "break-word",
                            }}
                          >
                            {franchise.email}
                          </TableCell>
                          <TableCell>{franchise.phone}</TableCell>
                          <TableCell>
                            {getStatusChip(franchise.kycStatus)}
                          </TableCell>
                          <TableCell>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={franchise.isActive}
                                  onChange={() =>
                                    handleToggleStatus(
                                      franchise._id,
                                      franchise.isActive,
                                    )
                                  }
                                  color="primary"
                                />
                              }
                              label={franchise.isActive ? "Active" : "Inactive"}
                              labelPlacement="end"
                            />
                          </TableCell>
                          <TableCell>{franchise.credits}</TableCell>
                          <TableCell>
                            {formatDate(franchise.createdAt)}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleViewKyc(franchise)}
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleEditFranchiseClick(franchise)
                              }
                            >
                              <Edit />
                            </IconButton>
                            {/* Registration Details Icon - Show for self-registered users */}
                            {franchise.kycStatus === "pending" &&
                              !franchise.isActive && (
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleViewRegistrationDetails(franchise)
                                  }
                                  sx={{ color: "info.main" }}
                                  title="View Registration Details"
                                >
                                  <Info />
                                </IconButton>
                              )}
                            {/* Registration Approval Buttons - Show for new registrations that need approval */}
                            {franchise.kycStatus === "pending" &&
                              !franchise.isActive && (
                                <>
                                  {/* Removed direct approval buttons - only allow approval through registration details dialog */}
                                </>
                              )}
                            {/* KYC Approval Buttons - Only show for submitted KYC */}
                            {franchise.kycStatus === "submitted" && (
                              <>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleApproveKyc(franchise._id)
                                  }
                                  sx={{ color: "success.main" }}
                                  title="Approve KYC"
                                >
                                  <Check />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleRejectKycClick(franchise)
                                  }
                                  sx={{ color: "error.main" }}
                                  title="Reject KYC"
                                >
                                  <Close />
                                </IconButton>
                              </>
                            )}
                            {/* Certificate Name Button - Show for all franchises */}
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleCertificateNameClick(franchise)
                              }
                              sx={{ color: "primary.main" }}
                              title="Update Certificate Name"
                            >
                              <PictureAsPdfIcon />
                            </IconButton>
                            {/* Delete Button - Show for all franchises */}
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDeleteFranchiseClick(franchise)
                              }
                              sx={{ color: "error.main" }}
                              title="Delete Franchise"
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {tabValue === 1 && (
        <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Create New Franchise User
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleCreateFranchise}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Full Name"
                    name="name"
                    value={newFranchise.name}
                    onChange={handleCreateFranchiseChange}
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Email Address"
                    name="email"
                    type="email"
                    value={newFranchise.email}
                    onChange={handleCreateFranchiseChange}
                    margin="normal"
                  />
                </Grid>

                {/* Package Selection */}
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    style={{ minWidth: "200px" }}
                  >
                    <InputLabel>Assign Packages (Optional)</InputLabel>
                    <Select
                      multiple
                      value={selectedPackages}
                      onChange={(e) => setSelectedPackages(e.target.value)}
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
                            checked={selectedPackages.indexOf(pkg._id) > -1}
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

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                  >
                    <Button
                      onClick={handleCloseCreateDialog}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Create Franchise User"
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* KYC Documents Dialog */}
      <Dialog
        open={kycDialogOpen}
        onClose={handleCloseKycDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          sx={{ bgcolor: "primary.main", color: "white", fontWeight: "bold" }}
        >
          KYC Documents - {selectedFranchise?.businessName}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#f5f5f5" }}>
          {kycLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : kycData ? (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "primary.main", fontWeight: "bold" }}
                  >
                    Personal Information
                  </Typography>
                  <Card
                    variant="outlined"
                    sx={{ boxShadow: 3, borderRadius: 2, bgcolor: "white" }}
                  >
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} style={{ minWidth: "200px" }}>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Aadhaar Number:</strong>
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {kycData.aadhaarNumber || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ minWidth: "200px" }}>
                          <Typography variant="body2" color="textSecondary">
                            <strong>PAN Number:</strong>
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {kycData.panNumber || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ minWidth: "200px" }}>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Submitted At:</strong>
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {formatDate(kycData.submittedAt)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Status:</strong>
                          </Typography>
                          <Box sx={{ mt: 0.5 }}>
                            {getStatusChip(kycData.status)}
                          </Box>
                        </Grid>
                        {kycData.isDigiLockerSubmission ? (
                          <Grid item xs={12}>
                            <Alert severity="info" sx={{ mt: 1 }}>
                              <strong>DigiLocker Submission:</strong> Documents
                              were fetched directly from DigiLocker. No file
                              uploads were provided as part of this submission.
                            </Alert>
                          </Grid>
                        ) : (
                          <Grid item xs={12}>
                            <Alert severity="info" sx={{ mt: 1 }}>
                              <strong>Manual Submission:</strong> Documents were
                              provided as Google Drive links. Please verify the
                              links are accessible.
                            </Alert>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Typography>No KYC data available</Typography>
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
            Are you sure you want to delete the franchise{" "}
            <strong>{franchiseToDelete?.businessName}</strong>? This action
            cannot be undone and will permanently remove all associated data.
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

      {/* Create Franchise Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Franchise User</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreateFranchise}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  name="name"
                  value={newFranchise.name}
                  onChange={handleCreateFranchiseChange}
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
                  value={newFranchise.email}
                  onChange={handleCreateFranchiseChange}
                  margin="normal"
                />
              </Grid>

              {/* Package Selection */}
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  margin="normal"
                  style={{ minWidth: "200px" }}
                >
                  <InputLabel>Assign Packages (Optional)</InputLabel>
                  <Select
                    multiple
                    value={selectedPackages}
                    onChange={(e) => setSelectedPackages(e.target.value)}
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
                          checked={selectedPackages.indexOf(pkg._id) > -1}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateFranchise}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Create Franchise User"}
          </Button>
        </DialogActions>
      </Dialog>

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
                  onChange={handleEditFranchiseChange}
                  margin="normal"
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
                        {editFranchiseData.allPackages.assigned.map(
                          (pkg, index) => (
                            <Box
                              key={pkg._id || `assigned-${index}`}
                              sx={{
                                mb: 1,
                                p: 2,
                                bgcolor: "lightblue",
                                borderRadius: 1,
                                border: "1px solid #b3d9ff",
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
