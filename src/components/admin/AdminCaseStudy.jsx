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
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";

const AdminCaseStudies = () => {
  // const { category } = useParams();
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
  const [category, setCategory] = useState("");
  // const [category, setCategory] = useState("");

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
    if (!category.trim()) {
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
    formData.append("category", category);
    formData.append("beforeWorking", beforeWorkingFile);
    formData.append("afterWorking", afterWorkingFile);

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await adminAPI.createCaseStudy(formData);
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
  const fetchCaseStudies = async () => {
    try {
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
      formData.append("category", category);

      if (beforeWorkingFile) {
        formData.append("beforeWorking", beforeWorkingFile);
      }

      if (afterWorkingFile) {
        formData.append("afterWorking", afterWorkingFile);
      }

      await adminAPI.updateCaseStudy(editingId, formData);

      setEditMode(false);
      setEditingId(null);

      fetchCaseStudies();
    } catch (err) {
      console.log(err);
    }
  };
  const handleEdit = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setEditingId(item._id);
    setCategory(item.category);
    setEditMode(true);
  };

  const groupedCases = caseStudies.reduce((acc, item) => {
    const category = item.category || "uncategorized";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(item);
    return acc;
  }, {});

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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="dpd">DPD</MenuItem>
            <MenuItem value="inquiries">Inquiries</MenuItem>
            <MenuItem value="score_increase">Score Increase</MenuItem>
            <MenuItem value="settlement">Settlement</MenuItem>
            <MenuItem value="write_off">Write Off</MenuItem>
            <MenuItem value="suit_filed">Suit Filed</MenuItem>
            <MenuItem value="post_write_off_closed">
              Post Write Off Closed
            </MenuItem>
            <MenuItem value="fake_loans">Fake Loans</MenuItem>
            <MenuItem value="sma_removed">SMA Removed</MenuItem>
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
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          All Case Studies
        </Typography>

        {caseStudies.length === 0 ? (
          <Typography>No case studies found</Typography>
        ) : (
          Object.entries(groupedCases).map(([category, cases]) => (
            <Box key={category} sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  bgcolor: "#f5f5f5",
                  p: 1,
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                {category.replace(/_/g, " ").toUpperCase()}
              </Typography>

              {cases.map((item) => (
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
          ))
        )}
      </Box>
    </Box>
  );
};

export default AdminCaseStudies;
