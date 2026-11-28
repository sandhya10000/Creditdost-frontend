import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  LinearProgress,
} from "@mui/material";
import {
  UploadFile as UploadIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HourglassEmpty as HourglassIcon,
  CloudUpload as CloudUploadIcon,
  Analytics as AnalyticsIcon,
  Translate as TranslateIcon,
  Lock as LockIcon,
  Upgrade as UpgradeIcon,
  AllInclusive as UnlimitedIcon,
} from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { franchiseAPI } from "../../services/api";
import LanguageIcon from "@mui/icons-material/Language";
import { EMBEDDED_FORM_SX } from "./creditBureau/embeddedFormSx";
import { SectionCard, SectionHeader, TableToolbar, SearchField, FilterChips, EmptyRow, LoadingBar } from "../admin/ui/AdminTable";
import { headRowSx, bodyRowSx } from "../admin/ui/tableStyles";

const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi (हिन्दी)" },
  { code: "bn", label: "Bengali (বাংলা)" },
  { code: "mr", label: "Marathi (मराठी)" },
  { code: "gu", label: "Gujarati (ગુજરાતી)" },
  { code: "ta", label: "Tamil (தமிழ்)" },
  { code: "te", label: "Telugu (తెలుగు)" },
  { code: "kn", label: "Kannada (ಕನ್ನಡ)" },
  { code: "ml", label: "Malayalam (മലയാളം)" },
  { code: "pa", label: "Punjabi (ਪੰਜਾਬੀ)" },
];

// Filter chips for the AI Reports table
const REPORT_FILTERS = [
  { value: "", label: "All" },
  { value: "ready", label: "Ready" },
  { value: "processing", label: "In progress" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Not analyzed" },
];

// One status per document, from its analysis status
const documentStatus = (doc) => {
  const status = doc.claudeAnalysisStatus || "pending";
  const emailSent = status === "email_sent";
  const ready = status === "completed" || emailSent;
  if (emailSent) return { label: "Report sent", color: "success", icon: <CheckCircleIcon />, ready };
  if (ready) return { label: "Ready", color: "success", icon: <CheckCircleIcon />, ready };
  if (status === "processing") return { label: "In progress", color: "warning", icon: <HourglassIcon />, ready };
  if (status === "failed") {
    return {
      label: "Failed",
      color: "error",
      icon: <ErrorIcon />,
      ready,
      failed: true,
    };
  }
  return { label: "Not analyzed", color: "default", icon: null, ready };
};

const AIAnalysis = ({ section = "generate" } = {}) => {
  const isMultiLangEnabled = import.meta.env.VITE_MULTILANG_ENABLED === "true";

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    try {
      return localStorage.getItem("cd_report_lang") || "en";
    } catch {
      return "en";
    }
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [analyzingDocId, setAnalyzingDocId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("pending"); // Track actual backend status
  const [uploadError, setUploadError] = useState("");
  // AI Reports table: search by name and status filter
  const [reportSearch, setReportSearch] = useState("");
  const [reportFilter, setReportFilter] = useState("");
  const visibleDocuments = documents.filter((doc) => {
    const meta = documentStatus(doc);
    const matchesSearch = (doc.uploadedDocumentName || "")
      .toLowerCase()
      .includes(reportSearch.trim().toLowerCase());
    const matchesStatus =
      !reportFilter ||
      (reportFilter === "ready" && meta.ready) ||
      (reportFilter === "processing" && doc.claudeAnalysisStatus === "processing") ||
      (reportFilter === "failed" && meta.failed) ||
      (reportFilter === "pending" && meta.label === "Not analyzed");
    return matchesSearch && matchesStatus;
  });
  // Diamond fair-use cap reached (hidden from UI — no numbers exposed)
  const [fairUseLimitReached, setFairUseLimitReached] = useState(false);

  // Snackbar state for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // 'success', 'error', 'warning', 'info'
  });

  // Show snackbar notification
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "text/html" ||
        file.name.toLowerCase().endsWith(".html"))
    ) {
      setSelectedFile(file);
      setUploadError("");
    } else {
      setUploadError("Please select a PDF or HTML file");
      setSelectedFile(null);
    }
  };

  // Upload document with progress tracking
  const handleUpload = async () => {
    if (!selectedFile) {
      showSnackbar("Please select a file to upload", "warning");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setShowProgressDialog(true);
    setIsAnalyzing(false);
    setCurrentStatus("pending"); // Reset status

    try {
      const formData = new FormData();
      if (isMultiLangEnabled && selectedLanguage && selectedLanguage !== "en") {
        formData.append("language", selectedLanguage);
      }
      formData.append("document", selectedFile);

      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 60) return prev + 10; // Progress up to 60% during upload
          return prev;
        });
      }, 200);

      const response = await franchiseAPI.uploadAIAnalysisDocument(formData);

      clearInterval(progressInterval);
      setUploadProgress(70); // Upload complete
      setCurrentStatus("processing"); // Update status based on backend response

      if (response.data) {
        // Start analyzing phase
        setIsAnalyzing(true);
        setUploadProgress(80);

        // Poll for analysis completion with real-time status updates
        const pollInterval = setInterval(async () => {
          try {
            const docsResponse = await franchiseAPI.getAIAnalysisDocuments();
            const uploadedDoc = docsResponse.data.find(
              (d) => d._id === response.data.document._id,
            );

            if (uploadedDoc) {
              const backendStatus = uploadedDoc.claudeAnalysisStatus;
              setCurrentStatus(backendStatus); // Sync with backend status

              // Update progress based on actual status
              if (backendStatus === "processing") {
                setUploadProgress(85);
              } else if (backendStatus === "completed") {
                setUploadProgress(95);
              } else if (backendStatus === "email_sent") {
                setUploadProgress(100);
                clearInterval(pollInterval);
                showSnackbar(
                  "✅ Analysis complete! Report sent to your email.",
                  "success",
                );
                setTimeout(() => {
                  setShowProgressDialog(false);
                }, 1500);
                setSelectedFile(null);
                fetchDocuments();
                fetchUsage();
                return;
              } else if (backendStatus === "failed") {
                clearInterval(pollInterval);
                showSnackbar(
                  "⚠️ Analysis failed. You can retry manually.",
                  "warning",
                );
                setTimeout(() => {
                  setShowProgressDialog(false);
                }, 2000);
                setSelectedFile(null);
                fetchDocuments();
                fetchUsage();
                return;
              }
            }
          } catch (error) {
            console.error("Polling error:", error);
          }
        }, 2000); // Poll every 2 seconds for faster updates

        // Timeout: 3 minutes (180,000ms) for English; 4.5 minutes (270,000ms) for non-English Indic scripts
        const timeoutDuration = (isMultiLangEnabled && selectedLanguage !== "en") ? 270000 : 180000;
        setTimeout(() => {
          clearInterval(pollInterval);
          const finalStatus = currentStatus;
          if (finalStatus !== "email_sent" && finalStatus !== "failed") {
            setUploadProgress(100);
            showSnackbar(
              "📧 Upload successful! Analysis in progress. You will receive the report via email.",
              "info",
            );
            setTimeout(() => {
              setShowProgressDialog(false);
            }, 2000);
            setSelectedFile(null);
            fetchDocuments();
            fetchUsage();
          }
        }, timeoutDuration);
      }
    } catch (error) {
      const errCode = error.response?.data?.code;
      const errorMsg =
        error.response?.data?.message || "Failed to upload document";

      if (errCode === "AI_FAIR_USE_LIMIT_REACHED") {
        // Hidden Diamond cap — never expose the number
        setFairUseLimitReached(true);
        showSnackbar(
          "You have reached the maximum AI analysis usage for your plan. Please contact your Relationship Manager.",
          "error",
        );
      } else {
        showSnackbar(errorMsg, "error");
      }
      // Refresh usage in case limit was reached
      fetchUsage();
      setTimeout(() => {
        setShowProgressDialog(false);
      }, 2000);
    } finally {
      setUploading(false);
      setIsAnalyzing(false);
    }
  };

  const navigate = useNavigate();
  const [usage, setUsage] = useState({
    hasActivePackage: true,
    packageName: "",
    used: 0,
    limit: 10,
    isUnlimited: false,
    remaining: 10,
    loading: true,
  });

  // Fetch AI usage limits
  const fetchUsage = async () => {
    try {
      const res = await franchiseAPI.getAIAnalysisUsage();
      if (res.data && res.data.success) {
        const newUsage = {
          hasActivePackage: res.data.hasActivePackage,
          packageName: res.data.packageName || "Unknown",
          used: res.data.used ?? 0,
          limit: res.data.limit,
          isUnlimited: res.data.isUnlimited || false,
          remaining: res.data.remaining,
          loading: false,
        };
        setUsage(newUsage);
      }
    } catch (err) {
      console.error("[AI-CREDITS] Failed to fetch AI usage:", err);
      setUsage((prev) => ({ ...prev, loading: false }));
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const response = await franchiseAPI.getAIAnalysisDocuments();
      setDocuments(response.data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  // Trigger AI analysis manually
  const handleAnalyze = async (docId, docLang) => {
    setAnalyzingDocId(docId);
    try {
      const analyzePayload = {};
      if (isMultiLangEnabled) {
        analyzePayload.language = docLang || selectedLanguage || "en";
      }
      await franchiseAPI.analyzeWithClaude(docId, analyzePayload);
      showSnackbar("AI analysis started successfully.", "info");
      // Refresh documents and usage after a delay to show processing status
      setTimeout(() => {
        fetchDocuments();
        fetchUsage();
      }, 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to trigger AI analysis";
      setUploadError(errorMsg);
      showSnackbar(errorMsg, "error");
      fetchUsage();
    } finally {
      setAnalyzingDocId(null);
    }
  };

  // Download Claude analysis report
  const handleDownloadAnalysis = async (docId, fileName) => {
    try {
      const response = await franchiseAPI.downloadClaudeAnalysis(docId, {
        responseType: "blob",
      });

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
      alert("Failed to download analysis report. Please try again.");
    }
  };

  // Load documents and usage on component mount
  useEffect(() => {
    fetchDocuments();
    fetchUsage();
  }, []);

  const isDiamond = usage.packageName?.trim().toLowerCase() === 'diamond';

  // Keep these as they are. They still use the real numbers, so the block works at 1000.
  const isLimitReached =
    usage.limit !== null && usage.limit !== undefined &&
    (usage.remaining <= 0 || usage.used >= usage.limit);
  const isBlocked = !usage.hasActivePackage || isLimitReached || fairUseLimitReached;

  const progressPercent = usage.limit > 0
    ? Math.min(100, Math.round((usage.used / usage.limit) * 100))
    : (usage.hasActivePackage ? 0 : 100);


  return (
    <Box sx={EMBEDDED_FORM_SX}>
      {section === "generate" && (
        <>
      {/* Usage Overview */}
      <Box
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 3,
          border: 1,
          borderColor: isLimitReached ? "error.main" : "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              {usage.packageName || "No active plan"}
            </Typography>
            <Typography variant="h5" fontWeight={600} letterSpacing="-0.02em" lineHeight={1.2}>
              {isDiamond ? "Unlimited" : `${usage.used} / ${usage.limit ?? 0}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI reports used
            </Typography>
          </Box>
          {usage.hasActivePackage && (
            <Chip
              size="small"
              label={isDiamond ? "Unlimited analyses" : `${usage.remaining} remaining`}
              color={isLimitReached ? "error" : progressPercent >= 80 ? "warning" : "primary"}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Stack>

        {!isDiamond && (
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            color={progressPercent >= 100 ? "error" : progressPercent >= 80 ? "warning" : "primary"}
            sx={{ mt: 2, height: 6, borderRadius: 3, bgcolor: "grey.100" }}
          />
        )}
      </Box>

      {/* Warning/Blocking Alerts */}
      {!usage.hasActivePackage && (
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate("/franchise/upgrade-package")}
            >
              Get Package
            </Button>
          }
        >
          You do not have an active package assigned. Please purchase or activate a package to perform AI report analyses.
        </Alert>
      )}

      {isLimitReached && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate("/franchise/business")}
            >
              Upgrade Now
            </Button>
          }
        >
          Your AI Analysis limit has been reached. Please connect with your RM for further assistance.
        </Alert>
      )}

      {fairUseLimitReached && (
        <Alert severity="error" sx={{ mb: 3 }}>
          You have reached the maximum AI analysis usage for your plan. Please contact your Relationship Manager for assistance.
        </Alert>
      )}

      {/* Upload */}
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Upload a document
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>
          Upload a credit report or any PDF or HTML document. The AI report is emailed to you, usually within 1 to 2 minutes.
        </Typography>

        {isMultiLangEnabled && (
          <Box sx={{ mb: 2.5, maxWidth: 280 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="report-language-select-label">Report language</InputLabel>
              <Select
                labelId="report-language-select-label"
                id="report-language-select"
                value={selectedLanguage}
                label="Report language"
                disabled={uploading || isBlocked}
                startAdornment={<LanguageIcon sx={{ mr: 1, color: "action.active" }} />}
                onChange={(e) => {
                  const newLang = e.target.value;
                  setSelectedLanguage(newLang);
                  try {
                    localStorage.setItem("cd_report_lang", newLang);
                  } catch (err) {
                    console.warn("Could not save language to localStorage", err);
                  }
                }}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <input
          accept="application/pdf,.html,text/html"
          style={{ display: "none" }}
          id="pdf-upload"
          type="file"
          disabled={isBlocked || uploading}
          onChange={handleFileChange}
        />
        <Box
          component="label"
          htmlFor={isBlocked || uploading ? undefined : "pdf-upload"}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            p: 3,
            borderRadius: 2,
            border: "1px dashed",
            borderColor: selectedFile ? "primary.main" : "divider",
            bgcolor: "grey.50",
            textAlign: "center",
            cursor: isBlocked || uploading ? "not-allowed" : "pointer",
            opacity: isBlocked || uploading ? 0.6 : 1,
            transition: "border-color 0.2s",
            "&:hover": { borderColor: isBlocked || uploading ? "divider" : "primary.main" },
          }}
        >
          <CloudUploadIcon color={selectedFile ? "primary" : "action"} />
          <Typography variant="body2" fontWeight={600}>
            {selectedFile ? selectedFile.name : "Choose a PDF or HTML file"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedFile
              ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
              : "Click to browse your files"}
          </Typography>
        </Box>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2.5 }}>
          <Button
            variant="contained"
            disableElevation
            onClick={handleUpload}
            disabled={!selectedFile || uploading || isBlocked}
            startIcon={uploading ? null : isBlocked ? <LockIcon /> : <UploadIcon />}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3, boxShadow: "none" }}
          >
            {uploading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={18} color="inherit" />
                Uploading...
              </Box>
            ) : isBlocked ? (
              "Limit reached"
            ) : (
              "Upload and analyze"
            )}
          </Button>
        </Stack>
      </Box>

      {/* Progress Dialog */}
      <Dialog
        open={showProgressDialog}
        onClose={() => !uploading && setShowProgressDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {currentStatus === "pending" && <CloudUploadIcon color="primary" />}
            {(currentStatus === "processing" ||
              currentStatus === "completed") && (
                <AnalyticsIcon color="action" />
              )}
            {currentStatus === "email_sent" && (
              <CheckCircleIcon color="success" />
            )}
            {currentStatus === "failed" && <ErrorIcon color="error" />}
            {currentStatus === "pending" && "Uploading Document..."}
            {currentStatus === "processing" && "AI Analysis in Progress..."}
            {currentStatus === "completed" && "Analysis Complete!"}
            {currentStatus === "email_sent" && "Report Sent to Email!"}
            {currentStatus === "failed" && "Analysis Failed"}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 3 }}>
            {/* Status-specific messages */}
            {currentStatus === "pending" && (
              <>
                <Typography variant="body2" gutterBottom>
                  Uploading your document to the server...
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Please wait while we upload your file securely.
                </Typography>
              </>
            )}

            {currentStatus === "processing" && (
              <>
                <Typography variant="body2" gutterBottom>
                  AI is analyzing your document. This typically takes 1-2
                  minutes.
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Extracting insights and generating comprehensive report...
                </Typography>
              </>
            )}

            {currentStatus === "completed" && (
              <>
                <Typography variant="body2" gutterBottom>
                  ✅ AI analysis completed successfully!
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Preparing email with HTML report attachment...
                </Typography>
              </>
            )}

            {currentStatus === "email_sent" && (
              <>
                <Typography variant="body2" gutterBottom>
                  📧 Report successfully sent to your email!
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Check your inbox for the comprehensive HTML analysis report.
                </Typography>
              </>
            )}

            {currentStatus === "failed" && (
              <>
                <Typography variant="body2" gutterBottom color="error">
                  ⚠️ Analysis failed to complete.
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  You can retry the analysis from the documents list.
                </Typography>
              </>
            )}

            <Box sx={{ mt: 3 }}>
              <CircularProgress
                variant="determinate"
                value={uploadProgress}
                size={60}
                thickness={4}
                sx={{ display: "block", mx: "auto", mb: 2 }}
              />

              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
                display="block"
              >
                {uploadProgress}% Complete
              </Typography>
            </Box>

            {/* Additional info box for processing status */}
            {currentStatus === "processing" && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="caption">
                  📊 Generating comprehensive HTML report with charts, risk
                  analysis, and action plan...
                </Typography>
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowProgressDialog(false)}
            disabled={
              uploading ||
              currentStatus === "processing" ||
              currentStatus === "completed"
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

        </>
      )}

      {/* AI reports table */}
      {section === "reports" && (
        <SectionCard>
          <SectionHeader
            title="AI reports"
            subtitle={`${documents.length} ${documents.length === 1 ? "document" : "documents"} uploaded`}
          />

          <TableToolbar>
            <SearchField
              value={reportSearch}
              onChange={setReportSearch}
              placeholder="Search by document name"
            />
            <FilterChips
              value={reportFilter}
              onChange={setReportFilter}
              options={REPORT_FILTERS}
            />
          </TableToolbar>
          <LoadingBar loading={loadingDocuments} />

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={headRowSx}>
                  <TableCell>Document</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Analyzed</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loadingDocuments && visibleDocuments.length === 0 && (
                  <EmptyRow
                    colSpan={5}
                    title={
                      documents.length === 0
                        ? "No documents yet"
                        : "No documents match your search"
                    }
                    hint={
                      documents.length === 0
                        ? "Upload a document in Generate AI Report to see it here."
                        : "Try a different name or filter."
                    }
                  />
                )}
                {visibleDocuments.map((doc) => {
                  const meta = documentStatus(doc);
                  const isAnalyzing = analyzingDocId === doc._id;
                  const isProcessing = doc.claudeAnalysisStatus === "processing";

                  return (
                    <TableRow key={doc._id} hover sx={bodyRowSx}>
                      <TableCell sx={{ maxWidth: 360 }}>
                        <Typography variant="body2" fontWeight={600} noWrap title={doc.uploadedDocumentName}>
                          {doc.uploadedDocumentName}
                        </Typography>
                        {doc.language && doc.language !== "en" && (
                          <Chip
                            label={doc.languageName || doc.language.toUpperCase()}
                            size="small"
                            variant="outlined"
                            sx={{ mt: 0.5, height: 20, fontSize: 11 }}
                          />
                        )}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {new Date(doc.uploadedAt).toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          icon={meta.icon}
                          label={meta.label}
                          color={meta.color}
                        />
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {doc.analyzedAt ? new Date(doc.analyzedAt).toLocaleString() : "N/A"}
                        {doc.emailSentAt && (
                          <Typography variant="caption" color="success.main" display="block">
                            Emailed {new Date(doc.emailSentAt).toLocaleDateString()}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {meta.ready && doc.claudeAnalysisFileName && (
                          <Tooltip title="Download AI analysis report">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleDownloadAnalysis(doc._id, doc.claudeAnalysisFileName)}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {!meta.ready && !isAnalyzing && !isProcessing && (
                          <Tooltip
                            title={
                              isBlocked
                                ? "AI report limit reached. Upgrade package to analyze."
                                : meta.failed
                                  ? "Retry AI analysis"
                                  : "Run AI analysis"
                            }
                          >
                            <span>
                              <IconButton
                                size="small"
                                color={isBlocked ? "default" : "primary"}
                                disabled={isProcessing || isBlocked}
                                onClick={() => handleAnalyze(doc._id, doc.language)}
                              >
                                {isBlocked ? <LockIcon fontSize="small" /> : <RefreshIcon fontSize="small" />}
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}

                        {isAnalyzing && <CircularProgress size={20} />}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </SectionCard>
      )}
    </Box>
  );
};

export default AIAnalysis;
