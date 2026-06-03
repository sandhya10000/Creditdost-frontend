import React, { useState, useEffect } from "react";
import { adminAPI, franchiseAPI } from "../../services/api";
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
  const [items, setItems] = useState([]);

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
  useEffect(() => {
    fetchMarketingMaterials();
    console.log("Fetching API...");
  }, []);

  const fetchMarketingMaterials = async () => {
    try {
      const response = await franchiseAPI.getMarketingMaterials();

      const data =
        response.data.data || response.data.items || response.data || [];

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch marketing materials:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this file?")) return;

    try {
      await adminAPI.deleteMarketingMaterial(id);

      setSuccess("Material deleted successfully");

      fetchMarketingMaterials();
    } catch (error) {
      setError("Delete failed");
    }
  };
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
    ? import.meta.env.VITE_REACT_APP_API_URL.replace("/api", "")
    : "https://reactbackend.creditdost.co.in";

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
      <Card sx={{ maxWidth: 700, mx: "auto", mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Uploaded Materials
          </Typography>

          {items.length === 0 ? (
            <Typography>No materials found</Typography>
          ) : (
            items.map((item) => (
              <Box
                key={item._id}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography>
                    {item.fileName || "Marketing Material"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  {/* Preview */}
                  <Button
                    size="small"
                    variant="outlined"
                    href={`${API_URL}${item.fileUrl}`}
                    target="_blank"
                  >
                    Preview
                  </Button>

                  {/* Delete */}
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminMarketing;
