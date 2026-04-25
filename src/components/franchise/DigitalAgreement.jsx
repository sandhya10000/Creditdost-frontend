import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { franchiseAPI } from "../../services/api";

const DigitalAgreement = () => {
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openEsignDialog, setOpenEsignDialog] = useState(false);
  const [initiatingEsign, setInitiatingEsign] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [requireProfileUpdate, setRequireProfileUpdate] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [downloading, setDownloading] = useState(false);
  
  const [esignData, setEsignData] = useState({
    signerName: "",
    signerEmail: "",
    signerPhone: "",
  });

  // Fetch digital agreement on component mount
  useEffect(() => {
    fetchDigitalAgreement();
  }, []);

  const fetchDigitalAgreement = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      const response = await franchiseAPI.getDigitalAgreement();
      setAgreement(response.data);
      setRequireProfileUpdate(false);
      setMissingFields([]);
      
      // Pre-fill eSign data
      setEsignData({
        signerName: response.data.userId?.name || "",
        signerEmail: response.data.userId?.email || "",
        signerPhone: "",
      });
    } catch (err) {
      // Check if profile update is required
      if (err.response?.data?.requireProfileUpdate) {
        setRequireProfileUpdate(true);
        setMissingFields(err.response.data.missingFields || []);
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch digital agreement");
        console.error("Error fetching digital agreement:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAgreement = async () => {
    try {
      setDownloading(true);
      setError("");
      
      const response = await franchiseAPI.downloadDigitalAgreement();
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Digital_Agreement_${agreement.userName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setSuccess("Agreement downloaded successfully!");
    } catch (err) {
      setError("Failed to download agreement");
      console.error("Error downloading agreement:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleOpenEsignDialog = () => {
    setOpenEsignDialog(true);
  };

  const handleCloseEsignDialog = () => {
    setOpenEsignDialog(false);
    setEsignData({
      signerName: agreement?.userId?.name || "",
      signerEmail: agreement?.userId?.email || "",
      signerPhone: "",
    });
    setAgreeToTerms(false);
  };

  const handleEsignDataChange = (field, value) => {
    setEsignData({
      ...esignData,
      [field]: value,
    });
  };

  const handleInitiateEsign = async () => {
    try {
      setInitiatingEsign(true);
      setError("");

      // Validate required fields
      if (!esignData.signerName || !esignData.signerEmail || !esignData.signerPhone) {
        setError("Please fill in all required fields");
        return;
      }

      if (!agreeToTerms) {
        setError("Please agree to the terms and conditions");
        return;
      }

      // Prepare the request data according to Surepass API specification
      const requestData = {
        ...esignData,
      };

      const response = await franchiseAPI.initiateEsign(requestData);
      
      // Log the response for debugging
      console.log('eSign initiation response:', response);

      // Show appropriate success message based on PDF upload status
      if (response.data.pdfUploadSuccess) {
        setSuccess("eSign process initiated successfully! Your document was automatically uploaded. The system will track the signing status.");
      } else {
        setSuccess("eSign process initiated successfully! Please upload your agreement when prompted in the SurePass interface.");
      }
      
      // Redirect user to Surepass eSign portal
      if (response.data.redirectUrl) {
        // Open in a new tab/window instead of the same tab
        window.open(response.data.redirectUrl, '_blank');   
        if (response.data.pdfUploadSuccess) {
          setSuccess("eSign process opened in a new tab. Your document was auto-uploaded. The system will automatically track the signing status.");
        } else {
          setSuccess("eSign process opened in a new tab. Please upload your agreement when prompted in the SurePass interface. The system will track the signing status.");
        }
      } else {
        setError("Failed to get redirect URL from Surepass");
      }
      
      handleCloseEsignDialog();
    } catch (err) {
      setError("Failed to initiate eSign process");
      console.error("Error initiating eSign:", err);
    } finally {
      setInitiatingEsign(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
      case "completed":
        return "success";
      case "rejected":
        return "error";
      case "submitted":
        return "warning";
      default:
        return "info";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "downloaded":
        return "Downloaded";
      case "signed":
        return "Signed";
      case "completed":
        return "Completed";
      case "submitted":
        return "Submitted for Review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  if (loading) {
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
        Digital Agreement
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

      {requireProfileUpdate && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Profile Update Required
          </Typography>
          <Typography variant="body2" paragraph>
            Please complete your profile with verified data from SurePass PAN and Bank APIs before generating the digital agreement.
          </Typography>
          {missingFields.length > 0 && (
            <Typography variant="body2" paragraph>
              <strong>Missing Fields:</strong> {missingFields.join(', ')}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // Navigate to profile update page
              window.location.href = "/franchise/profile";
            }}
            sx={{ mt: 1 }}
          >
            Update Profile
          </Button>
        </Alert>
      )}

      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          {agreement ? (
            <>
              <Typography variant="h6" gutterBottom>
                Franchise Agreement for {agreement.userName}
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Typography variant="body1">
                  Status: <strong>{getStatusText(agreement.status)}</strong>
                </Typography>
                <Box
                  sx={{
                    bgcolor: `${getStatusColor(agreement.status)}.light`,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    color={`${getStatusColor(agreement.status)}.dark`}
                  >
                    {agreement.status.toUpperCase()}
                  </Typography>
                </Box>
              </Box>

              {agreement.status === "rejected" && agreement.rejectionReason && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Rejection Reason:</Typography>
                  <Typography variant="body2">
                    {agreement.rejectionReason}
                  </Typography>
                </Alert>
              )}

              <Typography variant="body1" paragraph>
                Your franchise agreement has been prepared. Click "eSign Agreement" to 
                sign it electronically using Surepass. The system will attempt to 
                automatically upload the document, or prompt you to upload it manually if needed.
              </Typography>
              <small>Note: Reload page after completing the Surepass Esign process</small>

              <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
                {(agreement.status === "pending" || agreement.status === "downloaded") && (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleOpenEsignDialog}
                    >
                      eSign Agreement
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={handleDownloadAgreement}
                      disabled={downloading}
                    >
                      {downloading ? "Downloading..." : "Download Agreement"}
                    </Button>
                  </>
                )}
                
                {(agreement.status === "signed" || agreement.status === "completed") && (
                  <>
                    <Button
                      variant="outlined"
                      onClick={handleOpenEsignDialog}
                      disabled
                    >
                      eSign Agreement (In Progress)
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={handleDownloadAgreement}
                      disabled={downloading}
                    >
                      {downloading ? "Downloading..." : "Download Agreement"}
                    </Button>
                  </>
                )}
                
                {agreement.status === "submitted" && (
                  <>
                    <Button
                      variant="outlined"
                      onClick={handleOpenEsignDialog}
                      disabled
                    >
                      eSign Agreement (Submitted)
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={handleDownloadAgreement}
                      disabled={downloading}
                    >
                      {downloading ? "Downloading..." : "Download Agreement"}
                    </Button>
                  </>
                )}
              </Box>
            </>
          ) : !requireProfileUpdate && (
            <>
              <Typography variant="h6" gutterBottom>
                No Agreement Found
              </Typography>
              <Typography variant="body1" paragraph>
                You don't have a digital agreement yet. Please contact support.
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* eSign Agreement Dialog */}
      <Dialog
        open={openEsignDialog}
        onClose={handleCloseEsignDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Electronic Signature (eSign)</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Please provide your details to initiate the electronic signing
            process with Surepass:
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            fullWidth
            variant="outlined"
            value={esignData.signerName}
            onChange={(e) => handleEsignDataChange("signerName", e.target.value)}
            required
          />
          
          <TextField
            margin="dense"
            label="Email Address"
            fullWidth
            variant="outlined"
            value={esignData.signerEmail}
            onChange={(e) => handleEsignDataChange("signerEmail", e.target.value)}
            required
          />
          
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            variant="outlined"
            value={esignData.signerPhone}
            onChange={(e) => handleEsignDataChange("signerPhone", e.target.value)}
            required
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                color="primary"
              />
            }
            label="I agree to the terms and conditions for electronic signing"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEsignDialog}>Cancel</Button>
          <Button
            onClick={handleInitiateEsign}
            variant="contained"
            disabled={initiatingEsign || !agreeToTerms}
            startIcon={initiatingEsign ? <CircularProgress size={20} /> : null}
          >
            {initiatingEsign ? "Initiating..." : "Start eSign Process"}
          </Button>
        </DialogActions>
      </Dialog>

      
    </Box>
  );
};

export default DigitalAgreement;