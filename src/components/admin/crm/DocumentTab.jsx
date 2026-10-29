import React, { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { adminAPI } from "../../../services/api";

const documentFields = [
  { label: "PAN Card", key: "panCard" },
  { label: "Aadhar Front", key: "aadharFront" },
  { label: "Aadhar Back", key: "aadharBack" },
  { label: "Cancel Cheque", key: "cancelCheque" },
  { label: "Bank Proof (Settlement letter)", key: "bankProof" },
  { label: "Extra Bank Document", key: "extraBankDoc" },
];

const ACCEPTED_TYPES = "image/*,application/pdf";
const MAX_FILE_MB = 10;

const DocumentTab = ({ customerId, documents = {}, onUpdated }) => {
  const [uploadingKey, setUploadingKey] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const inputRefs = useRef({});

  const getDocumentUrl = (path) => {
    if (!path) return "";

    const normalizedPath = path.replace(/\\/g, "/");

    const baseUrl = import.meta.env.VITE_REACT_APP_API_URL
      ? import.meta.env.VITE_REACT_APP_API_URL.replace("/api", "")
      : "https://reactbackend.creditdost.co.in";

    return `${baseUrl}/${normalizedPath}`;
  };

  const handleFileChange = async (key, event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow picking the same file again later
    if (!file || !customerId) return;

    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFeedback({ severity: "error", message: `File must be under ${MAX_FILE_MB} MB` });
      return;
    }

    try {
      setUploadingKey(key);
      setFeedback(null);
      const formData = new FormData();
      formData.append(key, file);
      await adminAPI.uploadBusinessDocuments(customerId, formData);
      setFeedback({ severity: "success", message: "Document uploaded" });
      onUpdated?.();
    } catch (err) {
      setFeedback({
        severity: "error",
        message: err.response?.data?.message || "Upload failed. Please try again.",
      });
    } finally {
      setUploadingKey(null);
    }
  };

  const uploadedCount = documentFields.filter((doc) => documents?.[doc.key]).length;

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Documents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {uploadedCount} of {documentFields.length} uploaded · PDF or image, up to {MAX_FILE_MB} MB
          </Typography>
        </Box>
      </Stack>

      {feedback && (
        <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        {uploadingKey && <LinearProgress />}
        <Stack divider={<Divider flexItem />}>
          {documentFields.map((doc) => {
            const path = documents?.[doc.key];
            const busy = uploadingKey === doc.key;
            return (
              <Stack
                key={doc.key}
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
                sx={{ px: 2, py: 1.5 }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Typography variant="body2" fontWeight={600}>
                    {doc.label}
                  </Typography>
                  {path ? (
                    <Chip size="small" color="success" variant="outlined" label="Uploaded" />
                  ) : (
                    <Chip size="small" variant="outlined" label="Not uploaded" />
                  )}
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  {path && (
                    <Link
                      href={getDocumentUrl(path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{ mr: 1 }}
                    >
                      View
                    </Link>
                  )}
                  <input
                    ref={(el) => (inputRefs.current[doc.key] = el)}
                    type="file"
                    accept={ACCEPTED_TYPES}
                    hidden
                    onChange={(e) => handleFileChange(doc.key, e)}
                  />
                  <Button
                    size="small"
                    variant={path ? "outlined" : "contained"}
                    startIcon={<UploadFileIcon />}
                    disabled={Boolean(uploadingKey)}
                    onClick={() => inputRefs.current[doc.key]?.click()}
                  >
                    {busy ? "Uploading..." : path ? "Replace" : "Upload"}
                  </Button>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default DocumentTab;
