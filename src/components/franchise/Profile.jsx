import React, { useState, useEffect, useRef } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { franchiseAPI, authAPI } from "../../services/api";

const Profile = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const [panData, setPanData] = useState({
    panNumber: "",
  });

  const [bankData, setBankData] = useState({
    bankAccountNumber: "",
    bankIfscCode: "",
  });

  const [panDetails, setPanDetails] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [panLoading, setPanLoading] = useState(false);
  const [bankLoading, setBankLoading] = useState(false);
  const [panError, setPanError] = useState("");
  const [bankError, setBankError] = useState("");
  const [panSuccess, setPanSuccess] = useState("");
  const [bankSuccess, setBankSuccess] = useState("");
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState("");

  //function for button disable
  const isFormValid = () => {
    return (
      // Business Info
      formData.businessName.trim() !== "" &&
      formData.ownerName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim().length === 10 &&
      // Address
      formData.address.street.trim() !== "" &&
      formData.address.city.trim() !== "" &&
      formData.address.state.trim() !== "" &&
      formData.address.pincode.trim().length === 6 &&
      // PAN
      panData.panNumber.trim().length === 10 &&
      panDetails !== null && // fetch Succesfully
      // Bank
      bankData.bankAccountNumber.trim() !== "" &&
      bankData.bankIfscCode.trim().length === 11 &&
      bankDetails !== null //  verified successfully
    );
  };
  // Refs for debouncing API calls
  const panTimeoutRef = useRef(null);
  const bankTimeoutRef = useRef(null);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);

        // Fetch profile data
        const profileResponse = await franchiseAPI.getProfile();
        const profileData = profileResponse.data;

        setFormData({
          businessName: profileData.businessName || "",
          ownerName: profileData.ownerName || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          address: {
            street: profileData.address?.street || "",
            city: profileData.address?.city || "",
            state: profileData.address?.state || "",
            pincode: profileData.address?.pincode || "",
          },
        });

        // Fetch PAN details
        try {
          const panResponse = await franchiseAPI.getPanDetails();
          setPanData({
            panNumber: panResponse.data.panNumber || "",
          });
          setPanDetails(panResponse.data.panDetails);
        } catch (err) {
          console.error("Error fetching PAN details:", err);
        }

        // Fetch bank details
        try {
          const bankResponse = await franchiseAPI.getBankDetails();
          setBankData({
            bankAccountNumber: bankResponse.data.bankAccountNumber || "",
            bankIfscCode: bankResponse.data.bankIfscCode || "",
          });
          setBankDetails(bankResponse.data.bankDetails);
        } catch (err) {
          console.error("Error fetching bank details:", err);
        }
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error fetching profile:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchData();

    // Cleanup function to clear timeouts when component unmounts
    return () => {
      if (panTimeoutRef.current) {
        clearTimeout(panTimeoutRef.current);
      }
      if (bankTimeoutRef.current) {
        clearTimeout(bankTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // Handle nested address fields
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handlePanChange = (e) => {
    const value = e.target.value.toUpperCase();
    // Allow only alphanumeric characters and limit to 10 characters
    if (value.length <= 10 && /^[A-Z0-9]*$/.test(value)) {
      setPanData({
        ...panData,
        panNumber: value,
      });
    }
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    if (name === "bankAccountNumber") {
      // Allow only numeric characters for bank account number
      if (/^\d*$/.test(value)) {
        setBankData({
          ...bankData,
          [name]: value,
        });
      }
    } else if (name === "bankIfscCode") {
      // Allow alphanumeric characters and limit to 11 characters
      if (value.length <= 11 && /^[A-Z0-9]*$/.test(value)) {
        setBankData({
          ...bankData,
          [name]: value.toUpperCase(),
        });
      }
    } else {
      setBankData({
        ...bankData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await franchiseAPI.updateProfile(formData);
      setSuccess(response.data.message || "Profile updated successfully!");

      // Update form data with response data
      const updatedProfile = response.data.franchise;
      setFormData({
        businessName: updatedProfile.businessName || "",
        ownerName: updatedProfile.ownerName || "",
        email: updatedProfile.email || "",
        phone: updatedProfile.phone || "",
        address: {
          street: updatedProfile.address?.street || "",
          city: updatedProfile.address?.city || "",
          state: updatedProfile.address?.state || "",
          pincode: updatedProfile.address?.pincode || "",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.details ||
          "Failed to update profile",
      );
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // Unified save function for all sections
  const handleSaveAll = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Save business and address information
      const profileResponse = await franchiseAPI.updateProfile(formData);

      // Save PAN information
      const panResponse = await franchiseAPI.updatePanDetails(panData);

      // Save bank information
      const bankResponse = await franchiseAPI.updateBankDetails(bankData);

      setSuccess("All profile information saved successfully!");

      // Update form data with response data
      const updatedProfile = profileResponse.data.franchise;
      setFormData({
        businessName: updatedProfile.businessName || "",
        ownerName: updatedProfile.ownerName || "",
        email: updatedProfile.email || "",
        phone: updatedProfile.phone || "",
        address: {
          street: updatedProfile.address?.street || "",
          city: updatedProfile.address?.city || "",
          state: updatedProfile.address?.state || "",
          pincode: updatedProfile.address?.pincode || "",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.details ||
          "Failed to save profile information",
      );
      console.error("Error saving profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePanSubmit = async (e) => {
    e.preventDefault();
    setPanLoading(true);
    setPanError("");
    setPanSuccess("");

    try {
      const response = await franchiseAPI.updatePanDetails(panData);
      setPanSuccess(
        response.data.message || "PAN number updated successfully!",
      );
    } catch (err) {
      setPanError(err.response?.data?.message || "Failed to update PAN number");
      console.error("Error updating PAN:", err);
    } finally {
      setPanLoading(false);
    }
  };

  const handleFetchPanDetails = async () => {
    // Clear any existing timeout
    if (panTimeoutRef.current) {
      clearTimeout(panTimeoutRef.current);
    }

    // Check if already loading to prevent multiple clicks
    if (panLoading) {
      return;
    }

    if (!panData.panNumber) {
      setPanError("Please enter a PAN number first");
      return;
    }

    // Validate PAN format before submitting
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panData.panNumber)) {
      setPanError(
        "Invalid PAN number format. Please enter a valid PAN number (e.g., ABCDE1234F)",
      );
      return;
    }

    // Set a small delay to prevent multiple rapid clicks
    panTimeoutRef.current = setTimeout(async () => {
      setPanLoading(true);
      setPanError("");
      setPanSuccess("");

      try {
        const response = await franchiseAPI.fetchPanComprehensive({
          panNumber: panData.panNumber,
        });
        setPanSuccess(
          response.data.message || "PAN details fetched successfully!",
        );
        setPanDetails(response.data.panDetails);

        // Auto-fill form fields with PAN data
        if (response.data.panDetails && response.data.panDetails.data) {
          const panData = response.data.panDetails.data;

          // Update form data with PAN information
          setFormData((prevFormData) => ({
            ...prevFormData,
            ownerName: panData.full_name || prevFormData.ownerName,
            // Update address if available
            address: {
              ...prevFormData.address,
              street: panData.address?.line_1 || prevFormData.address.street,
              city: panData.address?.city || prevFormData.address.city,
              state: panData.address?.state || prevFormData.address.state,
              pincode: panData.address?.zip || prevFormData.address.pincode,
            },
          }));
        }
      } catch (err) {
        setPanError(
          err.response?.data?.message || "Failed to fetch PAN details",
        );
        console.error("Error fetching PAN details:", err);
      } finally {
        setPanLoading(false);
      }
    }, 500); // 500ms delay to prevent rapid clicks
  };
  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setBankLoading(true);
    setBankError("");
    setBankSuccess("");

    try {
      const response = await franchiseAPI.updateBankDetails(bankData);
      setBankSuccess(
        response.data.message || "Bank details updated successfully!",
      );
    } catch (err) {
      setBankError(
        err.response?.data?.message || "Failed to update bank details",
      );
      console.error("Error updating bank details:", err);
    } finally {
      setBankLoading(false);
    }
  };

  const handleVerifyBankDetails = async () => {
    // Clear any existing timeout
    if (bankTimeoutRef.current) {
      clearTimeout(bankTimeoutRef.current);
    }

    // Check if already loading to prevent multiple clicks
    if (bankLoading) {
      return;
    }

    if (!bankData.bankAccountNumber || !bankData.bankIfscCode) {
      setBankError("Please enter both bank account number and IFSC code");
      return;
    }

    // Validate bank account number (should be numeric)
    if (!/^\d+$/.test(bankData.bankAccountNumber)) {
      setBankError("Invalid bank account number. Please enter only digits.");
      return;
    }

    // Validate IFSC code format
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(bankData.bankIfscCode)) {
      setBankError(
        "Invalid IFSC code format. Please enter a valid IFSC code (e.g., SBIN0002499)",
      );
      return;
    }

    // Set a small delay to prevent multiple rapid clicks
    bankTimeoutRef.current = setTimeout(async () => {
      setBankLoading(true);
      setBankError("");
      setBankSuccess("");

      try {
        const response = await franchiseAPI.verifyBankDetails(bankData);
        setBankSuccess(
          response.data.message || "Bank details verified successfully!",
        );
        setBankDetails(response.data.bankDetails);

        // Auto-fill form fields with bank data
        if (response.data.bankDetails && response.data.bankDetails.data) {
          const bankData = response.data.bankDetails.data;

          // Update form data with bank account holder name
          if (bankData.full_name) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              ownerName: bankData.full_name,
            }));
          }
        }
      } catch (err) {
        setBankError(
          err.response?.data?.message || "Failed to verify bank details",
        );
        console.error("Error verifying bank details:", err);
      } finally {
        setBankLoading(false);
      }
    }, 500); // 500ms delay to prevent rapid clicks
  };

  // Reset password function
  const handleResetPassword = async () => {
    setResetPasswordLoading(true);
    setResetPasswordError("");
    setResetPasswordSuccess("");

    try {
      // Using the new requestPasswordReset endpoint
      const response = await authAPI.requestPasswordReset({
        email: formData.email,
      });
      setResetPasswordSuccess(
        response.data.message || "Password reset link sent to your email!",
      );
    } catch (err) {
      setResetPasswordError(
        err.response?.data?.message || "Failed to reset password",
      );
      console.error("Error resetting password:", err);
    } finally {
      setResetPasswordLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      {/* Scrollable Content Container */}
      <Box sx={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto", pr: 1 }}>
        {/* Basic Business Information Section */}
        <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Business Information
            </Typography>
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="businessName"
                    name="businessName"
                    label="Business Name"
                    fullWidth
                    value={formData.businessName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="ownerName"
                    name="ownerName"
                    label="Owner Name"
                    fullWidth
                    value={formData.ownerName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="email"
                    name="email"
                    label="Email Address"
                    fullWidth
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="phone"
                    name="phone"
                    label="Phone Number"
                    fullWidth
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Address Details Section */}
        <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Address Details
            </Typography>
            <small>Kindly Provide Full Address</small>
            <Box style={{ marginTop: "20px" }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="address.street"
                    name="address.street"
                    label="Street Address"
                    fullWidth
                    value={formData.address.street}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="address.city"
                    name="address.city"
                    label="City"
                    fullWidth
                    value={formData.address.city}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="address.state"
                    name="address.state"
                    label="State"
                    fullWidth
                    value={formData.address.state}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="address.pincode"
                    name="address.pincode"
                    label="Pincode"
                    fullWidth
                    value={formData.address.pincode}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* PAN Details Section */}
        <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">PAN Details</Typography>

                <small>
                  Note: Retry entering PAN details if there are any errors or
                  doesn't work in the first attempt
                </small>
              </AccordionSummary>
              <AccordionDetails>
                {panError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {panError}
                  </Alert>
                )}

                {panSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {panSuccess}
                  </Alert>
                )}

                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="panNumber"
                        name="panNumber"
                        label="PAN Number"
                        fullWidth
                        value={panData.panNumber}
                        onChange={handlePanChange}
                        inputProps={{ maxLength: 10 }}
                        helperText="Format: ABCDE1234F"
                        placeholder="ABCDE1234F"
                        error={!!panError && panError.includes("PAN")}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        {!panDetails || !panDetails.data ? (
                          <Button
                            variant="outlined"
                            onClick={handleFetchPanDetails}
                            disabled={panLoading}
                            sx={{ py: 1.5, px: 4 }}
                          >
                            {panLoading ? (
                              <CircularProgress size={24} />
                            ) : (
                              "Fetch PAN Details"
                            )}
                          </Button>
                        ) : null}
                      </Box>
                    </Grid>

                    {panDetails && panDetails.data && (
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                          PAN Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Full Name"
                              value={panDetails.data.full_name || ""}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Masked Aadhaar"
                              value={panDetails.data.masked_aadhaar || ""}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Gender"
                              value={panDetails.data.gender || ""}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Date of Birth"
                              value={panDetails.data.dob || ""}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>

        {/* Bank Details Section */}
        <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Bank Details</Typography>
                <small>
                  Note: Retry entering bank details if there are any errors or
                  doesn't work in the first attempt
                </small>
              </AccordionSummary>
              <AccordionDetails>
                {bankError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {bankError}
                  </Alert>
                )}

                {bankSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {bankSuccess}
                  </Alert>
                )}

                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="bankAccountNumber"
                        name="bankAccountNumber"
                        label="Bank Account Number"
                        fullWidth
                        value={bankData.bankAccountNumber}
                        onChange={handleBankChange}
                        helperText="Enter your 9-18 digit bank account number"
                        placeholder="123456789012"
                        error={!!bankError && bankError.includes("account")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="bankIfscCode"
                        name="bankIfscCode"
                        label="IFSC Code"
                        fullWidth
                        value={bankData.bankIfscCode}
                        onChange={handleBankChange}
                        inputProps={{ maxLength: 11 }}
                        helperText="Format: BBBB0XXXXXX (11 characters)"
                        placeholder="SBIN0002499"
                        error={!!bankError && bankError.includes("IFSC")}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={handleVerifyBankDetails}
                          disabled={bankLoading}
                          sx={{ py: 1.5, px: 4 }}
                        >
                          {bankLoading ? (
                            <CircularProgress size={24} />
                          ) : (
                            "Verify Bank Details"
                          )}
                        </Button>
                      </Box>
                    </Grid>

                    {bankDetails && bankDetails.data && (
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                          Bank Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Account Holder Name"
                              value={bankDetails.data.full_name || ""}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Bank Name"
                              value={
                                bankDetails.data.ifsc_details?.bank_name || ""
                              }
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Branch"
                              value={
                                bankDetails.data.ifsc_details?.branch || ""
                              }
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="IFSC Code"
                              value={bankDetails.data.ifsc_details?.ifsc || ""}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>

        {/* Reset Password Section */}
        <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Reset Password
            </Typography>

            {resetPasswordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {resetPasswordError}
              </Alert>
            )}

            {resetPasswordSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {resetPasswordSuccess}
              </Alert>
            )}

            <Typography variant="body1" paragraph>
              Click the button below to receive a secure password reset link via
              email. You will receive an email with instructions to set a new
              password. The link will expire in 1 hour for security purposes.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleResetPassword}
                disabled={resetPasswordLoading}
                sx={{ py: 1.5, px: 4 }}
              >
                {resetPasswordLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Send Password Reset Link"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
        {/* Sticky Save Button Container */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "white",
            p: 2,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          &nbsp;&nbsp;
          <small>
            Click "Save Profile" to save your profile information after entering
            all details.
          </small>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAll}
            disabled={loading || !isFormValid()} //  main logic
            sx={{ py: 1.5, px: 4 }}
          >
            {loading ? <CircularProgress size={24} /> : "Save Profile"}
          </Button>
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
        </Box>
      </Box>{" "}
      {/* Closing tag for scrollable content container */}
    </Box>
  );
};

export default Profile;
