import React, { useState } from "react";
import { adminAPI } from "../../services/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloudUpload from "@mui/icons-material/CloudUpload";

const AdminMarketing = () => {
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //this post function to handle upload material from admin
  const handleUpload = async () => {
    if (!file) {
      setError("Please select file");
      return;
    }
    const formData = new FormData();

    formData.append("file", file);
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await adminAPI.UploadDocument(formData);

      setSuccess(
        response?.data.message || "Marketing material uploaded successfully",
      );

      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);

      setError(
        error?.response?.data?.message || "Failed to upload marketing material",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Upload Marketing Material
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

          <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
            {file ? file.name : "Choose File"}
            <input
              hidden
              type="file"
              accept=".jpg,.jpeg,.png,.mp4,.mp3"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>

          <Button
            fullWidth
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Upload Material"
            )}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminMarketing;
