import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";
import {
  UploadFile as UploadIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { adminAPI } from "../../services/api";
import {
  CellText,
  DateCell,
  EmptyRow,
  LoadingBar,
  SectionCard,
  SectionHeader,
  TableFooter,
} from "./ui/AdminTable";
import { bodyRowSx, headRowSx } from "./ui/tableStyles";

const ManageAIAnalysis = ({ embedded = false }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [responseFile, setResponseFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  // Fetch all AI analysis documents
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAIAnalysisDocuments({
        page: page,
        limit: rowsPerPage,
      });
      setDocuments(response.data.documents || []);
      setTotalRecords(response.data.total || 0);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, [page]);


  // Handle response file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "text/html" ||
        file.name.toLowerCase().endsWith(".html"))
    ) {
      setResponseFile(file);
      setUploadError("");
    } else {
      setUploadError("Please select a PDF or HTML file");
      setResponseFile(null);
    }
  };

  // Open dialog for responding to a document
  const handleOpenDialog = (document) => {
    setSelectedDocument(document);
    setOpenDialog(true);
    setResponseFile(null);
    setNotes("");
    setUploadError("");
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDocument(null);
    setResponseFile(null);
    setNotes("");
    setUploadError("");
  };

  // Submit response
  const handleSubmitResponse = async () => {
    if (!responseFile) {
      setUploadError("Please select a response file");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("document", responseFile);
      if (notes) {
        formData.append("notes", notes);
      }

      const response = await adminAPI.respondToAIAnalysisDocument(
        selectedDocument._id,
        formData,
      );

      if (response.data) {
        // Refresh documents list
        fetchDocuments();
        handleCloseDialog();
      }
    } catch (error) {
      setUploadError(
        error.response?.data?.message || "Failed to submit response",
      );
    } finally {
      setUploading(false);
    }
  };

  // Get status chip color based on Claude analysis status
  const getStatusChip = (doc) => {
    const claudeStatus = doc.claudeAnalysisStatus;
    const hasAdminResponse = doc.status === "responded";

    if (claudeStatus === "email_sent") {
      return {
        label: "AI Analyzed & Sent",
        color: "success",
        icon: <CheckCircleIcon />,
      };
    } else if (claudeStatus === "completed") {
      return {
        label: "AI Analyzed",
        color: "success",
        icon: <CheckCircleIcon />,
      };
    } else if (claudeStatus === "processing") {
      return {
        label: "Analyzing...",
        color: "warning",
        icon: <HourglassIcon />,
      };
    } else if (claudeStatus === "failed") {
      return { label: "Analysis Failed", color: "error" };
    } else if (hasAdminResponse) {
      return { label: "Admin Responded", color: "success" };
    } else {
      return { label: "Uploaded", color: "primary" };
    }
  };

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [downloadingOriginal, setDownloadingOriginal] = useState(false);

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // View original document (PDF only in new browser tab, revoked on unload)
  const handleViewOriginalDocument = async (doc) => {
    if (!doc || !doc._id) return;
    const fileName = doc.uploadedDocumentName || "original_document.pdf";
    const isHtml = fileName.toLowerCase().endsWith(".html") || fileName.toLowerCase().endsWith(".htm");

    if (isHtml) {
      showToast("HTML files cannot be viewed inline for security. Please use Download Original.", "warning");
      return;
    }

    try {
      setDownloadingOriginal(true);
      const response = await adminAPI.downloadOriginalDocument(doc._id, { disposition: "inline" });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const newTab = window.open(url, "_blank");

      if (!newTab) {
        showToast("Popup blocked by browser. Please allow popups to view document.", "warning");
      }

      // Revoke object URL after delay to prevent memory leak
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 60000);
    } catch (error) {
      console.error("Failed to view original document:", error);
      const errMsg = error.response?.data?.message || "Original file not found";
      showToast(errMsg, "error");
    } finally {
      setDownloadingOriginal(false);
    }
  };

  // Download original uploaded document
  const handleDownloadOriginalDocument = async (doc) => {
    if (!doc || !doc._id) return;
    const fileName = doc.uploadedDocumentName || "original_document";
    const fileExt = fileName.toLowerCase().endsWith(".html") || fileName.toLowerCase().endsWith(".htm")
      ? "text/html"
      : "application/pdf";

    try {
      setDownloadingOriginal(true);
      const response = await adminAPI.downloadOriginalDocument(doc._id, { disposition: "attachment" });
      const blob = new Blob([response.data], { type: fileExt });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("Download started", "success");
    } catch (error) {
      console.error("Failed to download original document:", error);
      const errMsg = error.response?.data?.message || "Original file not found";
      showToast(errMsg, "error");
    } finally {
      setDownloadingOriginal(false);
    }
  };

  // Download AI analysis report
  const handleDownloadAnalysis = async (docId, fileName) => {
    try {
      const response = await adminAPI.downloadClaudeAnalysis(docId);

      // Create blob and download
      const blob = new Blob([response.data], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || `analysis_${docId}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download analysis:", error);
      showToast("Failed to download analysis report. Please try again.", "error");
    }
  };

  return (
    <Box>
      {!embedded && (
        <Typography variant="h4" gutterBottom>
          AI Analysis Documents
        </Typography>
      )}

      <SectionCard>
        <SectionHeader
          title="Documents for AI analysis"
          subtitle="Credit reports uploaded by partners, with their AI analysis status."
        />
        <LoadingBar loading={loading} />

        <TableContainer>
          <Table size="small" sx={{ minWidth: 900 }} aria-label="AI analysis documents table">
            <TableHead>
              <TableRow sx={headRowSx}>
                <TableCell>Partner</TableCell>
                <TableCell>Document</TableCell>
                <TableCell>Uploaded</TableCell>
                <TableCell>AI Analysis</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.length === 0 ? (
                <EmptyRow
                  colSpan={5}
                  loading={loading}
                  title="No documents yet"
                  hint="Documents uploaded by partners for AI analysis show up here."
                />
              ) : (
                documents.map((doc) => {
                  const statusChip = getStatusChip(doc);
                  const hasAnalysis =
                    doc.claudeAnalysisStatus === "completed" ||
                    doc.claudeAnalysisStatus === "email_sent";

                  return (
                    <TableRow key={doc._id} hover sx={bodyRowSx}>
                      <TableCell sx={{ maxWidth: 240 }}>
                        <CellText variant="body2" fontWeight={600}>
                          {doc.franchiseName}
                        </CellText>
                        <CellText variant="caption" color="text.secondary" display="block">
                          {doc.franchiseEmail}
                        </CellText>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 280 }}>
                        <CellText variant="body2">{doc.uploadedDocumentName}</CellText>
                      </TableCell>
                      <TableCell>
                        <DateCell value={doc.uploadedAt} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
                          <Chip
                            label={statusChip.label}
                            color={statusChip.color}
                            icon={statusChip.icon}
                            size="small"
                            variant="outlined"
                          />
                          {doc.language && doc.language !== "en" && (
                            <Chip
                              label={doc.languageName || doc.language.toUpperCase()}
                              color="primary"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {hasAnalysis && doc.claudeAnalysisFileName && (
                          <Tooltip title="Download AI analysis report">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() =>
                                handleDownloadAnalysis(doc._id, doc.claudeAnalysisFileName)
                              }
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="View details">
                          <IconButton size="small" onClick={() => handleOpenDialog(doc)}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TableFooter
          page={page}
          rowsPerPage={rowsPerPage}
          total={totalRecords}
          onPageChange={setPage}
        />
      </SectionCard>

      {/* Response Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="h6">Document Details</Typography>
            {selectedDocument && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {/* View Original (PDF only) */}
                {selectedDocument.uploadedDocument &&
                  !selectedDocument.uploadedDocumentName?.toLowerCase().endsWith(".html") &&
                  !selectedDocument.uploadedDocumentName?.toLowerCase().endsWith(".htm") && (
                    <Button
                      startIcon={<OpenInNewIcon />}
                      onClick={() => handleViewOriginalDocument(selectedDocument)}
                      color="primary"
                      variant="outlined"
                      size="small"
                      disabled={downloadingOriginal}
                    >
                      View Original
                    </Button>
                  )}

                {/* Download Original */}
                {selectedDocument.uploadedDocument && (
                  <Button
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadOriginalDocument(selectedDocument)}
                    color="primary"
                    variant="outlined"
                    size="small"
                    disabled={downloadingOriginal}
                  >
                    Download Original
                  </Button>
                )}

                {/* Download AI Report */}
                {(selectedDocument.claudeAnalysisStatus === "completed" ||
                  selectedDocument.claudeAnalysisStatus === "email_sent") && (
                  <Button
                    startIcon={<DownloadIcon />}
                    onClick={() =>
                      handleDownloadAnalysis(
                        selectedDocument._id,
                        selectedDocument.claudeAnalysisFileName,
                      )
                    }
                    color="success"
                    variant="outlined"
                    size="small"
                  >
                    Download AI Report
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Franchise:</strong> {selectedDocument.franchiseName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Email: {selectedDocument.franchiseEmail}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Document Information
                </Typography>
                <Box sx={{ ml: 2, mt: 1 }}>
                  <Typography variant="body2">
                    Original File: {selectedDocument.uploadedDocumentName}
                  </Typography>
                  <Typography variant="body2">
                    Uploaded:{" "}
                    {new Date(selectedDocument.uploadedAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {/* AI Analysis Status Section */}
              <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                >
                  AI Analysis Status
                </Typography>
                <Box sx={{ ml: 2, mt: 1 }}>
                  <Typography variant="body2">
                    Status:{" "}
                    <Chip
                      label={selectedDocument.claudeAnalysisStatus || "pending"}
                      size="small"
                      color={
                        selectedDocument.claudeAnalysisStatus === "completed" ||
                        selectedDocument.claudeAnalysisStatus === "email_sent"
                          ? "success"
                          : "default"
                      }
                    />
                  </Typography>
                  {selectedDocument.analyzedAt && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Analyzed At:{" "}
                      {new Date(selectedDocument.analyzedAt).toLocaleString()}
                    </Typography>
                  )}
                  {selectedDocument.emailSentAt && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 0.5 }}
                      color="success.main"
                    >
                      Email Sent:{" "}
                      {new Date(selectedDocument.emailSentAt).toLocaleString()}
                    </Typography>
                  )}
                  {selectedDocument.claudeAnalysisError && (
                    <Typography variant="body2" sx={{ mt: 1 }} color="error">
                      Error: {selectedDocument.claudeAnalysisError}
                    </Typography>
                  )}
                  {!selectedDocument.claudeAnalysisHtml &&
                    selectedDocument.claudeAnalysisStatus !== "processing" && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1 }}
                        color="warning.main"
                      >
                        ⚠️ AI analysis not yet completed. Franchise user can
                        trigger it manually.
                      </Typography>
                    )}
                </Box>
              </Box>

              {/* Admin Response Section */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Admin Response (Optional)
                </Typography>

                {selectedDocument.adminResponseDocumentName && (
                  <Alert severity="success" sx={{ mt: 1, mb: 2 }}>
                    Response already submitted:{" "}
                    {selectedDocument.adminResponseDocumentName}
                  </Alert>
                )}

                <input
                  accept="application/pdf,.html,text/html"
                  style={{ display: "none" }}
                  id="response-upload"
                  type="file"
                  onChange={handleFileChange}
                  disabled={uploading}
                />

                <label htmlFor="response-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    sx={{ mt: 1 }}
                    disabled={
                      uploading || !!selectedDocument.adminResponseDocumentName
                    }
                  >
                    Upload Response PDF/HTML
                  </Button>
                </label>

                {responseFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected: {responseFile.name}
                  </Typography>
                )}

                {uploadError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {uploadError}
                  </Alert>
                )}

                <TextField
                  label="Notes (Optional)"
                  multiline
                  rows={3}
                  fullWidth
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{ mt: 2 }}
                  placeholder="Add any notes or comments for the franchise user..."
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitResponse}
            variant="contained"
            disabled={
              !responseFile ||
              uploading ||
              !!selectedDocument?.adminResponseDocumentName
            }
          >
            {uploading ? <CircularProgress size={24} /> : "Submit Response"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageAIAnalysis;
