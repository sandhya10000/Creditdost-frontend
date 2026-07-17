import React, { useState, useEffect, useRef } from "react";
import { adminAPI, franchiseAPI } from "../../services/api";
import { useParams, Navigate } from "react-router-dom";

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
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";

import CASE_STUDY_CATEGORIES from "../../config/caseStudyCategories";

const mapCategory = (item) => {
  const validCategories = CASE_STUDY_CATEGORIES.map(c => c.value);
  // If item already has a valid category from the new system, use it
  if (item.category && validCategories.includes(item.category)) {
    return item.category;
  }
  
  // Legacy fallback based on title parsing
  const t = (item.title || "").toLowerCase();
  if (t.includes("dpd")) return "dpd-removal";
  if (t.includes("write off")) return "write-off";
  if (t.includes("settlement")) return "settlement";
  if (t.includes("suit filed") || t.includes("suit")) return "suit-filed";
  if (t.includes("score")) return "score-increase";
  if (t.includes("inquires") || t.includes("inquiries")) return "credit-inquiries";
  return "multiple-issues";
};

const AdminCaseStudies = () => {
  const { category: routeCategory } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [beforeWorkingFile, setBeforeWorkingFile] = useState(null);
  const [afterWorkingFile, setAfterWorkingFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [caseStudies, setCaseStudies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formCategory, setFormCategory] = useState("");
  const successTimerRef = useRef(null);

  // Clear the auto-dismiss timer when the component unmounts
  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  useEffect(() => {
    // Auto-select the category based on the current route tab if we are not editing
    if (!editMode && routeCategory) {
      setFormCategory(routeCategory);
    }
  }, [routeCategory, editMode]);

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
    if (!formCategory.trim()) {
      setError("Please enter category");
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
    formData.append("category", formCategory);
    formData.append("beforeWorking", beforeWorkingFile);
    formData.append("afterWorking", afterWorkingFile);

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await adminAPI.createCaseStudy(formData);
      console.log(response, "response.....");
      const successMsg = response?.data?.message || "Case Study uploaded successfully";
      setSuccess(successMsg);
      // Auto-dismiss the success banner after 5 seconds
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setSuccess(""), 5000);

      setTitle("");
      setDescription("");
      setBeforeWorkingFile(null);
      setAfterWorkingFile(null);
      // Keep formCategory as is (auto-filled by route)
      
      // Refresh the list immediately
      fetchCaseStudies();
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to upload case study");
    } finally {
      setLoading(false);
    }
  };
  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      const res = await franchiseAPI.getCaseStudies();
      setCaseStudies(res.data.data);
    } catch (err) {
      setError("Failed to load case studies");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteCaseStudy(id);
      fetchCaseStudies(); // refresh list
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", formCategory);

      if (beforeWorkingFile) {
        formData.append("beforeWorking", beforeWorkingFile);
      }

      if (afterWorkingFile) {
        formData.append("afterWorking", afterWorkingFile);
      }

      await adminAPI.updateCaseStudy(editingId, formData);

      setEditMode(false);
      setEditingId(null);
      setTitle("");
      setDescription("");
      setBeforeWorkingFile(null);
      setAfterWorkingFile(null);
      
      if (routeCategory) {
        setFormCategory(routeCategory);
      }

      fetchCaseStudies();
    } catch (err) {
      console.log(err);
    }
  };
  const handleEdit = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setEditingId(item._id);
    // Use the normalized category to ensure it matches the dropdown options
    setFormCategory(mapCategory(item));
    setEditMode(true);
  };

  if (!routeCategory) {
    return <Navigate to="dpd-removal" replace />;
  }

  const displayCategory = CASE_STUDY_CATEGORIES.find(c => c.value === routeCategory)?.label || routeCategory.replace(/-/g, " ");

  const filteredCases = caseStudies.filter((item) => {
    return mapCategory(item) === routeCategory;
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* ==============FORM card========== */}
      <Card sx={{ maxWidth: 700, mx: "auto", boxShadow: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            {editMode ? "Update Case Study" : "Upload Case Study"}
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
          <TextField
            select
            fullWidth
            label="Case Type"
            value={formCategory}
            onChange={(e) => setFormCategory(e.target.value)}
            sx={{ mb: 2 }}
          >
            {CASE_STUDY_CATEGORIES.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </TextField>

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
            onClick={editMode ? handleUpdate : handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : editMode ? (
              "Update Case Study"
            ) : (
              "Submit Case Study"
            )}
          </Button>
          {/* Cancel Edit */}
          {editMode && (
            <Button
              fullWidth
              variant="text"
              color="error"
              onClick={() => {
                setEditMode(false);
                setEditingId(null);
                setTitle("");
                setDescription("");
                setBeforeWorkingFile(null);
                setAfterWorkingFile(null);
                setFormCategory(routeCategory || "");
              }}
              sx={{ mt: 1 }}
            >
              Cancel Edit
            </Button>
          )}
        </CardContent>
      </Card>
      {/* ================= LIST SECTION ================= */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ textTransform: "capitalize" }}>
          Case Studies — {displayCategory}
        </Typography>

        {filteredCases.length === 0 ? (
          <Typography>No case studies found for this category</Typography>
        ) : (
          <Box sx={{ mb: 4 }}>
            {filteredCases.map((item) => (
              <Card key={item._id} sx={{ mb: 2, p: 2 }}>
                <Typography fontWeight="bold">{item.title}</Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  {item.description}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    href={item.beforeWorking}
                    target="_blank"
                  >
                    Before PDF
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    href={item.afterWorking}
                    target="_blank"
                  >
                    After PDF
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminCaseStudies;
