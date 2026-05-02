import React, { useState } from "react";
import { franchiseAPI } from "../../services/api";

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

import UploadFileIcon from "@mui/icons-material/UploadFile";

const FranchiseCaseStudies = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [beforeWorkingFile, setBeforeWorkingFile] = useState(null);
  const [afterWorkingFile, setAfterWorkingFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    console.log("API response...");
    if (!title.trim()) {
      setError("Please enter title");
      return;
    }

    if (!description.trim()) {
      setError("Please enter description");
      return;
    }

    if (!beforeWorkingFile) {
      setError("Please upload Before Working PDF");
      return;
    }

    if (!afterWorkingFile) {
      setError("Please upload After Working PDF");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("beforeWorking", beforeWorkingFile);
    formData.append("afterWorking", afterWorkingFile);

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await franchiseAPI.createCaseStudy(formData);
      console.log(response, "response.....");
      setSuccess(response?.data?.message || "Case Study uploaded successfully");

      setTitle("");
      setDescription("");
      setBeforeWorkingFile(null);
      setAfterWorkingFile(null);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to upload case study");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 700, mx: "auto", boxShadow: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            Upload Case Study
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

          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Before Working PDF */}
          <Button
            fullWidth
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{ mb: 2 }}
          >
            {beforeWorkingFile
              ? beforeWorkingFile.name
              : "Upload Before Working PDF"}
            <input
              hidden
              type="file"
              accept=".pdf"
              onChange={(e) => setBeforeWorkingFile(e.target.files[0])}
            />
          </Button>

          {/* After Working PDF */}
          <Button
            fullWidth
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{ mb: 3 }}
          >
            {afterWorkingFile
              ? afterWorkingFile.name
              : "Upload After Working PDF"}
            <input
              hidden
              type="file"
              accept=".pdf"
              onChange={(e) => setAfterWorkingFile(e.target.files[0])}
            />
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit Case Study"
            )}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FranchiseCaseStudies;
