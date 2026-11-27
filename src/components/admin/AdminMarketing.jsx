import React, { useState, useEffect } from "react";
import { adminAPI, franchiseAPI } from "../../services/api";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloudUpload from "@mui/icons-material/CloudUpload";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import OpenInNew from "@mui/icons-material/OpenInNew";
import { PageHeader, SectionCard, SectionHeader, EmptyRow } from "./ui/AdminTable";
import { primaryButtonSx } from "./ui/tableStyles";

const LANGUAGES = [
  "Hindi",
  "English",
  "Tamil",
  "Telugu",
  "Bengali",
  "Malayalam",
  "Marathi",
  "Gujarati",
  "Kannada",
  "Punjabi",
];

const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  ? import.meta.env.VITE_REACT_APP_API_URL.replace("/api", "")
  : "https://reactbackend.creditdost.co.in";

const outlinedSx = { textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "divider", color: "text.primary" };

const AdminMarketing = () => {
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [items, setItems] = useState([]);
  const [language, setLanguage] = useState("");

  const fetchMarketingMaterials = async () => {
    try {
      const response = await franchiseAPI.getMarketingMaterials();

      const data =
        response.data.data || response.data.items || response.data || [];

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch marketing materials:", error);
    } finally {
      setListLoading(false);
    }
  };

  // Upload a file for partners in one language
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
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this file?")) return;

    try {
      await adminAPI.deleteMarketingMaterial(id);

      setSuccess("Material deleted successfully");

      fetchMarketingMaterials();
    } catch {
      setError("Delete failed");
    }
  };

  return (
    <Box>
      <PageHeader
        title="Marketing materials"
        subtitle="Images and videos shared with partners, grouped by language."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <SectionCard>
            <SectionHeader title="Upload" subtitle="JPG, PNG, MP4 or MP3" />
            <Stack spacing={2} sx={{ p: 2.5 }}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUpload />}
                sx={{ ...outlinedSx, justifyContent: "flex-start", py: 1.25, color: file ? "text.primary" : "text.secondary" }}
              >
                {file ? file.name : "Choose file"}
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
                size="small"
                label="Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                fullWidth
                variant="contained"
                disableElevation
                onClick={handleUpload}
                disabled={loading}
                sx={primaryButtonSx}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : "Upload material"}
              </Button>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={8}>
          <SectionCard>
            <SectionHeader
              title="Library"
              subtitle={`${items.length} ${items.length === 1 ? "file" : "files"}`}
            />
            {listLoading || items.length === 0 ? (
              <Box sx={{ p: 2 }}>
                <EmptyRow
                  colSpan={1}
                  loading={listLoading}
                  title="No materials found"
                  hint="Uploaded files appear here."
                />
              </Box>
            ) : (
              <Grid container spacing={2} sx={{ p: 2 }}>
                {items.map((item) => (
                  <Grid item xs={12} sm={6} key={item._id}>
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        border: 1,
                        borderColor: "divider",
                        overflow: "hidden",
                        bgcolor: "background.paper",
                      }}
                    >
                      <Box
                        sx={{
                          height: 170,
                          bgcolor: "grey.50",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderBottom: 1,
                          borderColor: "divider",
                        }}
                      >
                        {item.fileType?.includes("image") ? (
                          <Box
                            component="img"
                            src={`${API_URL}${item.fileUrl}`}
                            alt="marketing-material"
                            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        ) : item.fileType?.includes("video") ? (
                          <Box
                            component="video"
                            src={`${API_URL}${item.fileUrl}`}
                            controls
                            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {item.fileType?.split("/")[0] || "Media file"}
                          </Typography>
                        )}
                      </Box>

                      <Stack spacing={1} sx={{ p: 2, flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight={600} noWrap title={item.fileName || "Marketing material"}>
                          {item.fileName || "Marketing material"}
                        </Typography>
                        <Chip size="small" variant="outlined" label={item.language} sx={{ alignSelf: "flex-start" }} />
                      </Stack>

                      <Stack direction="row" spacing={1} sx={{ px: 2, pb: 2 }}>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          startIcon={<OpenInNew sx={{ fontSize: 16 }} />}
                          onClick={() => window.open(`${API_URL}${item.fileUrl}`, "_blank", "noopener,noreferrer")}
                          sx={outlinedSx}
                        >
                          Preview
                        </Button>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteOutline sx={{ fontSize: 16 }} />}
                          onClick={() => handleDelete(item._id)}
                          sx={{ ...outlinedSx, color: "error.main" }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminMarketing;
