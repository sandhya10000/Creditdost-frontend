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
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Divider,
} from "@mui/material";
import { franchiseAPI } from "../../services/api";

const KycVerification = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [verificationMethod, setVerificationMethod] = useState("manual");
  const [formData, setFormData] = useState({
    aadhaarNumber: "",
    panNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [kycStatus, setKycStatus] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch KYC status when component mounts
  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const response = await franchiseAPI.getKycStatus();
        setKycStatus(response.data.kycStatus);
        if (
          response.data.kycRequest &&
          response.data.kycRequest.rejectionReason
        ) {
          setRejectionReason(response.data.kycRequest.rejectionReason);
        }
      } catch (err) {
        console.error("Failed to fetch KYC status:", err);
      }
    };

    fetchKycStatus();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format Aadhaar number (only digits, max 12 characters)
    if (name === "aadhaarNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 12);
    }

    // Format PAN number (uppercase letters and digits, max 10 characters)
    if (name === "panNumber") {
      formattedValue = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 10);
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    // Validate required fields before submission
    if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    if (!formData.panNumber || formData.panNumber.length !== 10) {
      setError("Please enter a valid 10-character PAN number");
      return;
    }

    // Additional PAN format validation (5 uppercase letters, 4 digits, 1 uppercase letter)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.panNumber)) {
      setError("Please enter a valid PAN number format (e.g., ABCDE1234F)");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Create object for KYC submission
    const kycData = {
      aadhaarNumber: formData.aadhaarNumber,
      panNumber: formData.panNumber,
    };

    try {
      const response = await franchiseAPI.submitKyc(kycData);

      setSuccess("KYC documents submitted successfully! Awaiting approval.");
      setActiveStep(0);
      setFormData({
        aadhaarNumber: "",
        panNumber: "",
      });

      // Update local KYC status
      setKycStatus("submitted");
      setRejectionReason("");
    } catch (err) {
      console.error("KYC submission error:", err);
      const errorMessage = err.response?.data?.details
        ? Array.isArray(err.response.data.details)
          ? err.response.data.details.join(", ")
          : err.response.data.details
        : err.response?.data?.message ||
          "Failed to submit KYC documents. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Provide Details", "Review & Submit"];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Manual KYC Verification
            </Typography>
            <Typography variant="body1" paragraph>
              Please provide accurate info from your documents. Make sure to
              verify it before submitting.
            </Typography>
            <Grid container spacing={3} sx={{ flexDirection: { xs: "column", md: "row" } }}>
              <Grid item xs={12} style={{ flex: "1" }}>
                <TextField
                  required
                  id="aadhaarNumber"
                  name="aadhaarNumber"
                  label="Aadhaar Number"
                  fullWidth
                  value={formData.aadhaarNumber}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 12 }}
                />
              </Grid>
              <Grid item xs={12} style={{ flex: "1" }}>
                <TextField
                  required
                  id="panNumber"
                  name="panNumber"
                  label="PAN Number"
                  fullWidth
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Please review your information before submitting:
            </Typography>
            <Typography>
              <strong>Aadhaar Number:</strong> {formData.aadhaarNumber}
            </Typography>
            <Typography>
              <strong>PAN Number:</strong> {formData.panNumber}
            </Typography>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        KYC Verification
      </Typography>

      {/* Show rejection reason if KYC is rejected */}
      {kycStatus === "rejected" && rejectionReason && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle1">KYC Rejected</Typography>
          <Typography variant="body2">{rejectionReason}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please correct the issues and resubmit your KYC documents.
          </Typography>
        </Alert>
      )}

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

      {kycStatus === "approved" ? (
        <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              KYC Already Approved
            </Typography>
            <Typography variant="body1">
              Your KYC verification has been approved. You can now access all
              features of the platform.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 4 }}>{getStepContent(activeStep)}</Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
              )}
              <Box sx={{ flex: "1 1 auto" }} />
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{ py: 1.5, px: 4 }}
                >
                  {loading ? <CircularProgress size={24} /> : "Submit KYC"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ py: 1.5, px: 4 }}
                >
                  Next
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default KycVerification;
