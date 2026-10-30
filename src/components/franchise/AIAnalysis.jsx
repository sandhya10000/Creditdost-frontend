import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
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

const AIAnalysis = () => {
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
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h4">AI Analysis</Typography>
      </Box>

      {/* Usage Overview Banner */}
      <Card
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 2,
          boxShadow: 2,
          border: isLimitReached
            ? "1px solid #d32f2f"
            : !usage.hasActivePackage
              ? "1px solid #ed6c02"
              : "1px solid #e0e0e0",
          background: isLimitReached
            ? "linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)"
            : "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: isLimitReached
                  ? "error.light"
                  : progressPercent >= 80
                    ? "warning.light"
                    : "primary.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isLimitReached
                  ? "error.main"
                  : progressPercent >= 80
                    ? "warning.main"
                    : "primary.main",
              }}
            >
              {isLimitReached ? (
                <LockIcon />
              ) : (
                <AnalyticsIcon />
              )}
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Active Plan: <strong>{usage.packageName || "No Active Plan"}</strong>
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {isDiamond
                  ? 'AI Reports Used: Unlimited'
                  : `AI Reports Used: ${usage.used} / ${usage.limit ?? 0}`}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {usage.hasActivePackage && (
              <Chip
                label={isDiamond ? 'Unlimited Analyses' : `${usage.remaining} remaining`}
                color={isLimitReached ? "error" : progressPercent >= 80 ? "warning" : "primary"}
                variant={isLimitReached ? "filled" : "outlined"}
                size="medium"
              />
            )}
          </Box>
        </Box>

        {!isDiamond && (
          <Box sx={{ mt: 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              color={progressPercent >= 100 ? "error" : progressPercent >= 80 ? "warning" : "primary"}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  bgcolor:
                    progressPercent >= 100
                      ? "#d32f2f"
                      : progressPercent >= 80
                        ? "#ed6c02"
                        : "#1976d2",
                },
              }}
            />
          </Box>
        )}
      </Card>

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

      {/* Upload Section */}
      <Card sx={{ mt: 2, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upload Document for AI Analysis
          </Typography>
          <Typography variant="body2" paragraph>
            Upload your credit report or any PDF/HTML document for AI-powered
            analysis. The AI will analyze your document and send a comprehensive
            HTML report to your email. <br />
            Analysis typically completes within 1-2 minutes.
          </Typography>

          {isMultiLangEnabled && (
            <Box sx={{ mb: 2, maxWidth: 300 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="report-language-select-label">Report Language</InputLabel>
                <Select
                  labelId="report-language-select-label"
                  id="report-language-select"
                  value={selectedLanguage}
                  label="Report Language"
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
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mt: 2,
            }}
          >
            <label htmlFor="pdf-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                disabled={uploading || isBlocked}
              >
                Select PDF/HTML File
              </Button>
            </label>

            {selectedFile && (
              <Alert
                severity="info"
                icon={<CloudUploadIcon />}
                sx={{ flexBasis: "100%" }}
              >
                <Typography variant="body2">
                  Selected: <strong>{selectedFile.name}</strong>
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Alert>
            )}

            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFile || uploading || isBlocked}
              startIcon={uploading ? null : isBlocked ? <LockIcon /> : <UploadIcon />}
              color={isBlocked ? "inherit" : "primary"}
            >
              {uploading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Uploading...
                </Box>
              ) : isBlocked ? (
                "Limit Reached - Upgrade to Analyze"
              ) : (
                "Upload & Analyze Document"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>

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

      {/* Documents List */}
      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Documents
          </Typography>

          {loadingDocuments ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : documents.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ py: 3 }}
            >
              No documents uploaded yet
            </Typography>
          ) : (
            <List>
              {documents.map((doc) => {
                const isAnalyzing = analyzingDocId === doc._id;
                const analysisStatus = doc.claudeAnalysisStatus || "pending";
                const hasAnalysis =
                  doc.claudeAnalysisStatus === "completed" ||
                  doc.claudeAnalysisStatus === "email_sent";
                const analysisFailed = doc.claudeAnalysisStatus === "failed";
                const isProcessing = doc.claudeAnalysisStatus === "processing";
                const emailSent = doc.claudeAnalysisStatus === "email_sent";

                return (
                  <React.Fragment key={doc._id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "flex-start" },
                        gap: { xs: 1, sm: 0 },
                      }}
                    >
                      <ListItemText component="div"
                        sx={{ pr: { sm: 2 } }}
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            <Box
                              component="span"
                              sx={{ wordBreak: "break-word" }}
                            >
                              {doc.uploadedDocumentName}
                            </Box>
                            {hasAnalysis && (
                              <Chip
                                icon={<CheckCircleIcon />}
                                label={
                                  emailSent ? "Report Sent" : "AI Analyzed"
                                }
                                color="success"
                                size="small"
                                variant="outlined"
                              />
                            )}
                            {isProcessing && (
                              <Chip
                                icon={<HourglassIcon />}
                                label="Analyzing..."
                                color="warning"
                                size="small"
                                variant="outlined"
                              />
                            )}
                            {analysisFailed && (
                              <Chip
                                icon={<ErrorIcon />}
                                label="Analysis Failed"
                                color="error"
                                size="small"
                                variant="outlined"
                              />
                            )}
                            {doc.language && doc.language !== "en" && (
                              <Chip
                                label={doc.languageName || doc.language.toUpperCase()}
                                color="primary"
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" component="div">
                              Uploaded:{" "}
                              {new Date(doc.uploadedAt).toLocaleString()}
                            </Typography>
                            <Typography
                              variant="body2"
                              component="div"
                              sx={{ textTransform: "capitalize" }}
                            >
                              Status: {analysisStatus.replace("_", " ")}
                            </Typography>
                            {doc.analyzedAt && (
                              <Typography variant="body2" component="div">
                                Analyzed:{" "}
                                {new Date(doc.analyzedAt).toLocaleString()}
                              </Typography>
                            )}
                            {doc.emailSentAt && (
                              <Typography
                                variant="body2"
                                component="div"
                                color="success.main"
                              >
                                Email Sent:{" "}
                                {new Date(doc.emailSentAt).toLocaleString()}
                              </Typography>
                            )}
                            {analysisFailed && doc.claudeAnalysisError && (
                              <Typography
                                variant="body2"
                                color="error"
                                component="div"
                                sx={{ mt: 1 }}
                              >
                                Error: {doc.claudeAnalysisError}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          ml: { xs: 0, sm: 2 },
                          alignSelf: { xs: "flex-end", sm: "center" },
                          flexShrink: 0,
                        }}
                      >
                        {/* Download Analysis Button */}
                        {hasAnalysis && doc.claudeAnalysisFileName && (
                          <Tooltip title="Download AI Analysis Report">
                            <IconButton
                              onClick={() =>
                                handleDownloadAnalysis(
                                  doc._id,
                                  doc.claudeAnalysisFileName,
                                )
                              }
                              color="success"
                              size="small"
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* Re-analyze Button */}
                        {!hasAnalysis && !isAnalyzing && !isProcessing && (
                          <Tooltip
                            title={
                              isBlocked
                                ? "AI report limit reached. Upgrade package to analyze."
                                : analysisFailed
                                  ? "Retry AI Analysis"
                                  : "Trigger AI Analysis"
                            }
                          >
                            <span>
                              <IconButton
                                onClick={() => handleAnalyze(doc._id, doc.language)}
                                disabled={isProcessing || isBlocked}
                                color={isBlocked ? "default" : "primary"}
                                size="small"
                              >
                                {isBlocked ? <LockIcon fontSize="small" /> : <RefreshIcon />}
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}

                        {/* Analyzing Indicator */}
                        {isAnalyzing && <CircularProgress size={24} />}
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AIAnalysis;
