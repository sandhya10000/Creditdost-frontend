import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { franchiseAPI } from "../../services/api";
import html2canvas from "html2canvas";

const Certificate = () => {
  const [certificateData, setCertificateData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const certificateRef = useRef(null);

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        setLoading(true);
        const [certificateResponse, profileResponse] = await Promise.all([
          franchiseAPI.getCertificateData(),
          franchiseAPI.getProfile(),
        ]);

        setCertificateData(certificateResponse.data);
        setUserData(profileResponse.data);
        setNewName(certificateResponse.data.franchiseName);
      } catch (err) {
        setError("Failed to load certificate data");
        console.error("Error fetching certificate data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, []);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 1, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: null,
        quality: 1,
        pixelRatio: 5,
        width: certificateRef.current.offsetWidth,
        height: certificateRef.current.offsetHeight,
      });

      const link = document.createElement("a");
      link.download = `certificate-${certificateData.certificateId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Error generating certificate image:", err);
      setError("Failed to generate certificate image");
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleSubmitNameUpdate = async () => {
    try {
      const response = await franchiseAPI.requestCertificateNameUpdate({
        requestedName: newName,
      });

      setCertificateData({
        ...certificateData,
        franchiseName: response.data.certificateName,
      });

      setSuccess("Certificate name updated successfully!");
      setSnackbarOpen(true);
      handleCloseDialog();
    } catch (err) {
      setError("Failed to update certificate name");
      console.error("Error updating certificate name:", err);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Function to format date as dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Certificate of Authority
      </Typography>

      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems={{ xs: "start", md: "center" }}
            mb={2}
            sx={{ flexDirection: { xs: "column", md: "row" } }}
          >
            <Typography variant="h6" gutterBottom>
              Your Certificate
            </Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleOpenDialog}
                sx={{ mr: 2 }}
              >
                Update Name
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={downloadCertificate}
              >
                Download Certificate
              </Button>
            </Box>
          </Box>

          <Box
            ref={certificateRef}
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 3,
              textAlign: "center",
              backgroundColor: "#f9f9f9",
              position: "relative",
              minHeight: "500px",
              backgroundImage: "url(/images/credit-copy.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              // width: { xs: "auto", md: "718px" },
              width: "718px",
              margin: "0 auto",
            }}
          >
            {/* Overlay content on top of the certificate template */}
            {/* <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#000', mb: 2, textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>
              CERTIFICATE OF AUTHORITY
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 3, color: '#333' }}>
              This certifies that
            </Typography> */}

            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#000",
                textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
                maxWidth: "500px",
                fontSize: "1.4rem",
              }}
              style={{ marginTop: "22px" }}
            >
              {certificateData?.franchiseName}
            </Typography>

            {/* Issued Date in bottom left corner */}
            <Typography
              variant="body2"
              sx={{
                position: "absolute",
                bottom: "90px",
                left: "210px",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              {userData?.createdAt ? formatDate(userData.createdAt) : "N/A"}
            </Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" paragraph>
              This certificate confirms that {certificateData?.franchiseName} is
              an authorized franchise partner of Credit Dost.
            </Typography>
            <Typography variant="body1" paragraph>
              Certificate Status:{" "}
              {certificateData?.isValid ? "Valid" : "Invalid"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Note: To update the name displayed on your certificate, click the
              "Update Name" button above. After updating, you can download the
              new certificate.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Name Update Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Certificate Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Certificate Name"
            type="text"
            fullWidth
            variant="standard"
            value={newName}
            onChange={handleNameChange}
            helperText="Enter the name you want to appear on your certificate"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitNameUpdate} variant="contained">
            Update Name
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={success}
      />
    </Box>
  );
};

export default Certificate;
