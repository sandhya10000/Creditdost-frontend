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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Snackbar,
} from "@mui/material";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import api, { franchiseAPI } from "../../services/api";
import IconButton from "@mui/material/IconButton";
//import FileUploadField from "./FileUploadField";

const Business = () => {
  const [customerPackages, setCustomerPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeStep, setActiveStep] = useState(0); // For step navigation
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    panNumber: "",
    aadharNumber: "",
    pincode: "",
    state: "",
    language: "",
    occupation: "",
    monthlyIncome: "",
    fullAddress: "",
    dob: "",
    gender: "",
    bankAccountNumber: "",
    ifscCode: "",
  });
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [razorpayOrderId, setRazorpayOrderId] = useState("");
  const [businessFormId, setBusinessFormId] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch customer packages
  useEffect(() => {
    fetchCustomerPackages();
  }, []);

  const fetchCustomerPackages = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch customer packages
      const packagesResponse = await api.get("/customer-packages");
      const allPackages = packagesResponse.data;

      // Fetch franchise details to get assigned packages
      const franchiseResponse = await franchiseAPI.getDashboardStats();
      const franchiseData = franchiseResponse.data.franchise;

      // Get the franchise's assigned packages
      const assignedPackageIds = franchiseData.assignedPackages.map(
        (pkg) => pkg._id,
      );

      // Get packages purchased through transactions (only the most recent paid transaction)
      const transactionsResponse = await franchiseAPI.getTransactions();
      const paidTransactions = transactionsResponse.data
        .filter((tx) => tx.status === "paid")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by most recent first

      // Find the most recent transaction with a package
      const latestTransaction = paidTransactions.find((tx) => tx.packageId);

      let accessiblePackageIds = [];

      // Use either the purchased package (if exists) or fall back to assigned packages
      if (latestTransaction && latestTransaction.packageId) {
        // Use only the most recently purchased package
        accessiblePackageIds = [latestTransaction.packageId._id];
      } else {
        // Fall back to assigned packages if no purchase history
        accessiblePackageIds = assignedPackageIds;
      }

      // Filter customer packages based on availableForPackages
      const filtered = allPackages.filter((pkg) => {
        if (
          !pkg.availableForPackages ||
          pkg.availableForPackages.length === 0
        ) {
          // If no restrictions, make available to all
          return true;
        }

        // Check if any of the accessible packages match the allowed packages
        return pkg.availableForPackages.some((allowedPackageId) =>
          accessiblePackageIds.includes(allowedPackageId),
        );
      });

      setCustomerPackages(allPackages);
      setFilteredPackages(filtered);
    } catch (err) {
      setError("Failed to fetch customer packages. Please try again later.");
      console.error("Error fetching customer packages:", err);

      // Fallback to original behavior
      try {
        const response = await api.get("/customer-packages");
        setCustomerPackages(response.data);
        setFilteredPackages(response.data); // Show all if filtering fails
      } catch (fallbackErr) {
        console.error("Error in fallback fetch:", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleSubmitForm = async () => {
    if (!selectedPackage) {
      setError("Please select a package before proceeding.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Include selected package in the form data
      const formDataWithPackage = {
        ...formData,
        selectedPackage: selectedPackage._id,
      };

      const response =
        await franchiseAPI.submitBusinessForm(formDataWithPackage);
      setRazorpayOrderId(response.data.orderId);
      setBusinessFormId(response.data.businessFormId);
      setSuccess("Form submitted successfully. Please proceed with payment.");
      handleNext(); // Move to payment step
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit form. Please try again.",
      );
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPackage) {
      setError("Please select a package.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use the correct variable
      amount:
        (selectedPackage.price +
          (selectedPackage.price * (selectedPackage.gstPercentage || 0)) /
            100) *
        100,
      currency: "INR",
      name: "Credit Dost",
      description: selectedPackage.name,
      order_id: razorpayOrderId,
      handler: async function (response) {
        // Show loader after payment completion
        setPaymentProcessing(true);

        try {
          // Verify payment
          await franchiseAPI.verifyBusinessPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            businessFormId: businessFormId,
          });

          setSuccess("Payment successful! Business form has been submitted.");
          resetForm();
          setActiveStep(0); // Reset to first step

          // Show success toast
          setSnackbarMessage("Payment completed successfully!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        } catch (err) {
          setError("Payment verification failed. Please contact support.");
          console.error("Error verifying payment:", err);

          // Show error toast
          setSnackbarMessage(
            "Payment verification failed. Please contact support.",
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        } finally {
          // Hide loader after verification is complete
          setPaymentProcessing(false);
        }
      },
      prefill: {
        name: formData.customerName,
        email: formData.customerEmail,
        contact: formData.customerPhone,
      },
      theme: {
        color: "#6200ea",
      },
    };

    // Check if Razorpay key is available
    if (!options.key) {
      setError("Razorpay key is not configured. Please contact administrator.");
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      panNumber: "",
      aadharNumber: "",
      pincode: "",
      state: "",
      language: "",
      occupation: "",
      monthlyIncome: "",
      fullAddress: "",
      dob: "",
      gender: "",
      bankAccountNumber: "",
      ifscCode: "",
    });
    setSelectedPackage(null);
  };

  const states = [
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
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry",
  ];

  const languages = [
    "English",
    "Hindi",
    "Bengali",
    "Telugu",
    "Marathi",
    "Tamil",
    "Urdu",
    "Gujarati",
    "Kannada",
    "Odia",
    "Punjabi",
    "Malayalam",
    "Assamese",
  ];

  const occupations = [
    "Salaried",
    "Self Employed",
    "Business Owner",
    "Student",
    "Retired",
    "Homemaker",
    "Others",
  ];

  const steps = ["Customer Information", "Package Selection", "Payment"];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Business Form Hello sandhya
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

      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
                <StepContent>
                  {index === 0 && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Customer Information
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <TextField
                            required
                            fullWidth
                            label="Customer Name"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleInputChange}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <TextField
                            required
                            fullWidth
                            label="Customer Email"
                            name="customerEmail"
                            type="email"
                            value={formData.customerEmail}
                            onChange={handleInputChange}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <TextField
                            required
                            fullWidth
                            label="Customer Phone"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleInputChange}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <TextField
                            required
                            fullWidth
                            label="PAN Number"
                            name="panNumber"
                            value={formData.panNumber}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 10 }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <TextField
                            required
                            fullWidth
                            label="Aadhar Number"
                            name="aadharNumber"
                            value={formData.aadharNumber}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 12 }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <TextField
                            required
                            fullWidth
                            label="Pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <FormControl
                            fullWidth
                            required
                            style={{ minWidth: "200px" }}
                          >
                            <InputLabel>State</InputLabel>
                            <Select
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              label="State"
                            >
                              {states.map((state) => (
                                <MenuItem key={state} value={state}>
                                  {state}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <FormControl
                            fullWidth
                            required
                            style={{ minWidth: "200px" }}
                          >
                            <InputLabel>Language</InputLabel>
                            <Select
                              name="language"
                              value={formData.language}
                              onChange={handleInputChange}
                              label="Language"
                            >
                              {languages.map((language) => (
                                <MenuItem key={language} value={language}>
                                  {language}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <FormControl
                            fullWidth
                            required
                            style={{ minWidth: "200px" }}
                          >
                            <InputLabel>Occupation</InputLabel>
                            <Select
                              name="occupation"
                              value={formData.occupation}
                              onChange={handleInputChange}
                              label="Occupation"
                            >
                              {occupations.map((occupation) => (
                                <MenuItem key={occupation} value={occupation}>
                                  {occupation}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <TextField
                            required
                            fullWidth
                            label="Monthly Income"
                            name="monthlyIncome"
                            type="number"
                            value={formData.monthlyIncome}
                            onChange={handleInputChange}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <TextField
                            required
                            fullWidth
                            label="Full Address"
                            name="fullAddress"
                            value={formData.fullAddress}
                            onChange={handleInputChange}
                            multiline
                            rows={3}
                            sx={{ minWidth: { xs: "0px", md: "280px" } }}
                          />
                        </Grid>
                        {/* DOB */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <TextField
                            required
                            fullWidth
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>

                        {/* Gender */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <FormControl fullWidth required>
                            <InputLabel>Gender</InputLabel>
                            <Select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              label="Gender"
                            >
                              <MenuItem value="Male">Male</MenuItem>
                              <MenuItem value="Female">Female</MenuItem>
                              <MenuItem value="Other">Other</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Bank Account Number */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <TextField
                            required
                            fullWidth
                            label="Bank Account Number"
                            name="bankAccountNumber"
                            value={formData.bankAccountNumber}
                            onChange={handleInputChange}
                          />
                        </Grid>

                        {/* IFSC Code */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <TextField
                            required
                            fullWidth
                            label="IFSC Code"
                            name="ifscCode"
                            value={formData.ifscCode}
                            onChange={handleInputChange}
                            inputProps={{
                              style: { textTransform: "uppercase" },
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sx={{ minWidth: { xs: "0px", md: "350px" } }}
                        >
                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Button
                              variant="contained"
                              onClick={handleNext}
                              disabled={loading}
                            >
                              {loading ? (
                                <CircularProgress size={24} />
                              ) : (
                                "Next"
                              )}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  {index === 1 && (
                    <Box>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          pb: 1,
                          borderBottom: "2px solid #6200ea",
                          display: "inline-block",
                          mb: 2,
                        }}
                      >
                        Select Package for Customer
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        Choose the best package for your customer's credit needs
                      </Typography>

                      {filteredPackages.length === 0 ? (
                        <Alert severity="info">
                          No packages available at the moment.
                        </Alert>
                      ) : (
                        <Grid container spacing={3}>
                          {filteredPackages.map((pkg) => (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              key={pkg._id}
                              sx={{
                                minWidth: { xs: "265px", md: "350px" },
                                maxWidth: { xs: "265px", md: "350px" },
                              }}
                            >
                              <Card
                                sx={{
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  cursor: "pointer",
                                  border:
                                    selectedPackage?._id === pkg._id
                                      ? "2px solid #6200ea"
                                      : "1px solid #e0e0e0",
                                  borderRadius: "12px",
                                  boxShadow:
                                    selectedPackage?._id === pkg._id
                                      ? "0 8px 16px rgba(98, 0, 234, 0.2)"
                                      : "0 2px 8px rgba(0, 0, 0, 0.1)",
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                                    transform: "translateY(-4px)",
                                  },
                                }}
                                onClick={() => handlePackageSelect(pkg)}
                              >
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "flex-start",
                                      mb: 2,
                                    }}
                                  >
                                    <Box>
                                      <Typography
                                        variant="h6"
                                        component="h3"
                                        fontWeight="bold"
                                        sx={{
                                          color:
                                            selectedPackage?._id === pkg._id
                                              ? "#6200ea"
                                              : "text.primary",
                                          mb: 0.5,
                                        }}
                                      >
                                        {pkg.name}
                                      </Typography>
                                    </Box>
                                    {selectedPackage?._id === pkg._id && (
                                      <Chip
                                        label="Selected"
                                        color="primary"
                                        size="small"
                                        sx={{
                                          fontWeight: "bold",
                                          height: "24px",
                                        }}
                                      />
                                    )}
                                  </Box>

                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      mb: 3,
                                      minHeight: 30,
                                      lineHeight: 1.5,
                                    }}
                                  >
                                    {pkg.description}
                                  </Typography>

                                  <Box
                                    sx={{
                                      mb: 3,
                                      textAlign: "center",
                                      py: 2,
                                      backgroundColor:
                                        selectedPackage?._id === pkg._id
                                          ? "rgba(98, 0, 234, 0.05)"
                                          : "rgba(0, 0, 0, 0.02)",
                                      borderRadius: "8px",
                                      border:
                                        selectedPackage?._id === pkg._id
                                          ? "1px solid rgba(98, 0, 234, 0.2)"
                                          : "1px solid rgba(0, 0, 0, 0.05)",
                                    }}
                                  >
                                    <Typography
                                      variant="h3"
                                      component="div"
                                      color="primary.main"
                                      fontWeight="bold"
                                      sx={{
                                        mb: 0.5,
                                        fontSize: "2rem",
                                      }}
                                    >
                                      ₹
                                      {pkg.price +
                                        (pkg.price * (pkg.gstPercentage || 0)) /
                                          100}
                                    </Typography>
                                    <p>(Inclusive of GST)</p>
                                  </Box>

                                  <Box sx={{ mb: 2 }}>
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight="bold"
                                      sx={{
                                        mb: 1,
                                        color: "text.secondary",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      What's Included:
                                    </Typography>
                                    <List dense sx={{ py: 0 }}>
                                      {pkg.features &&
                                        pkg.features.map((feature, index) => (
                                          <ListItem
                                            key={index}
                                            sx={{ py: 0.5, px: 0 }}
                                          >
                                            <ListItemIcon sx={{ minWidth: 24 }}>
                                              <CheckIcon
                                                color="primary"
                                                fontSize="small"
                                                sx={{
                                                  width: "18px",
                                                  height: "18px",
                                                }}
                                              />
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={feature}
                                              primaryTypographyProps={{
                                                variant: "body2",
                                                fontSize: "0.875rem",
                                              }}
                                            />
                                          </ListItem>
                                        ))}
                                    </List>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 3,
                        }}
                      >
                        <Button onClick={handleBack}>Back</Button>
                        <Button
                          variant="contained"
                          onClick={handleSubmitForm}
                          disabled={loading}
                        >
                          {loading ? (
                            <CircularProgress size={24} />
                          ) : (
                            "Proceed to Payment"
                          )}
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {index === 2 && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Payment Confirmation
                      </Typography>

                      {selectedPackage && (
                        <Card sx={{ mb: 3 }}>
                          <CardContent>
                            <Typography variant="h5" gutterBottom>
                              {selectedPackage.name}
                            </Typography>
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{ mb: 2 }}
                            >
                              {selectedPackage.description}
                            </Typography>
                            <Typography
                              variant="h6"
                              color="text.secondary"
                              sx={{ mb: 1, fontSize: "1rem" }}
                            >
                              Base Price: ₹{selectedPackage.price}
                            </Typography>
                            {selectedPackage.gstPercentage > 0 && (
                              <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ mb: 1, fontSize: "1rem" }}
                              >
                                GST ({selectedPackage.gstPercentage}%): ₹
                                {(
                                  (selectedPackage.price *
                                    selectedPackage.gstPercentage) /
                                  100
                                ).toFixed(2)}
                              </Typography>
                            )}
                            <Typography
                              variant="h4"
                              color="primary.main"
                              sx={{ mt: 2, fontSize: "1.5rem" }}
                            >
                              Total (with GST): ₹
                              {selectedPackage.price +
                                (selectedPackage.price *
                                  (selectedPackage.gstPercentage || 0)) /
                                  100}
                            </Typography>
                          </CardContent>
                        </Card>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button onClick={handleBack}>Back</Button>
                        <Button
                          variant="contained"
                          onClick={handlePayment}
                          disabled={loading || paymentProcessing}
                        >
                          {paymentProcessing ? (
                            <>
                              <CircularProgress size={24} sx={{ mr: 1 }} />
                              Processing...
                            </>
                          ) : loading ? (
                            <CircularProgress size={24} />
                          ) : (
                            "Pay Now"
                          )}
                        </Button>
                      </Box>
                    </Box>
                  )}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default Business;
