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
  MenuItem,
  Grid,
} from "@mui/material";
import CloudUpload from "@mui/icons-material/CloudUpload";

const AdminMarketing = () => {
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [items, setItems] = useState([]);
  const [language, setLanguage] = useState("");
  //this post function to handle upload material from admin
  const handleUpload = async () => {
    if (!file) {
      setError("Please select file");
      return;
    }
    if (!language) {
      setError("Please select language");
      return;
    }
    const formData = new FormData();

    formData.append("file", file);
    formData.append("language", language);
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await adminAPI.UploadDocument(formData);

      setSuccess(
        response?.data.message || "Marketing material uploaded successfully",
      );

      setFile(null);
      fetchMarketingMaterials();
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
          <TextField
            select
            fullWidth
            label="Select Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="Hindi">Hindi</MenuItem>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Tamil">Tamil</MenuItem>
            <MenuItem value="Telugu">Telugu</MenuItem>
            <MenuItem value="Bengali">Bengali</MenuItem>
            <MenuItem value="Malayalam">Malayalam</MenuItem>
            <MenuItem value="Marathi">Marathi</MenuItem>
            <MenuItem value="Gujarati">Gujarati</MenuItem>
            <MenuItem value="Kannada">Kannada</MenuItem>
            <MenuItem value="Punjabi">Punjabi</MenuItem>
          </TextField>
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
            <Grid container spacing={3}>
              {items.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card
                    sx={{
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      border: "1px solid #eaeaea",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: 200,
                        bgcolor: "#f9f9f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderBottom: "1px solid #eaeaea",
                      }}
                    >
                      {item.fileType?.includes("image") ? (
                        <Box
                          component="img"
                          src={`${API_URL}${item.fileUrl}`}
                          alt="marketing-material"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ) : item.fileType?.includes("video") ? (
                        <Box
                          component="video"
                          src={`${API_URL}${item.fileUrl}`}
                          controls
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <Typography variant="body1" color="text.secondary">
                          {item.fileType?.split("/")[0] || "Media File"}
                        </Typography>
                      )}
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography fontWeight="bold" noWrap title={item.fileName || "Marketing Material"}>
                        {item.fileName || "Marketing Material"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: "#e0f7fa",
                          color: "#006064",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "16px",
                          display: "inline-block",
                          mt: 1,
                          fontWeight: "medium",
                        }}
                      >
                        {item.language}
                      </Typography>
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0, mt: "auto" }}>
                      <Button
                        fullWidth
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminMarketing;
