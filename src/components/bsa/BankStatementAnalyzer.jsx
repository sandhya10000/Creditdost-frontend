import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { EMBEDDED_FORM_SX } from "../franchise/creditBureau/embeddedFormSx";
import { SectionCard, SectionHeader, TableToolbar, SearchField, FilterChips, EmptyRow, LoadingBar } from "../admin/ui/AdminTable";
import { headRowSx, bodyRowSx } from "../admin/ui/tableStyles";
import { PDFDocument } from "pdf-lib";
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
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HourglassEmpty as HourglassIcon,
  AccountBalance as AccountBalanceIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PictureAsPdf as PdfIcon,
  Check as CheckIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000/api";

const HISTORY_FILTERS = [
  { value: "", label: "All" },
  { value: "Success", label: "Successful" },
  { value: "Processing", label: "Processing" },
  { value: "Failed", label: "Failed" },
];

const BankStatementAnalyzer = ({ section = "analyze" } = {}) => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [consent, setConsent] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, processing, finalizing, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [analyses, setAnalyses] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  // Analyses table: search by file, holder or bank, and status filter
  const [historySearch, setHistorySearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState("");
  const visibleAnalyses = analyses.filter((item) => {
    const query = historySearch.trim().toLowerCase();
    const matchesSearch = [item.fileName, item.accountHolderName, item.bankName].some((value) =>
      (value || "").toLowerCase().includes(query),
    );
    const matchesStatus = !historyFilter || item.status === historyFilter;
    return matchesSearch && matchesStatus;
  });
  const [isDragOver, setIsDragOver] = useState(false);

  // Snackbar notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const pollTimerRef = useRef(null);

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Fetch past analyses
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/bsa/my-analyses?limit=25`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && res.data.success) {
        setAnalyses(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load BSA history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  // Poll analysis status
  useEffect(() => {
    if (!currentJobId || status === "success" || status === "error") {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      return;
    }

    const poll = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/bsa/${currentJobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.success) {
          const doc = res.data.data;
          setJobData(doc);
          if (doc.status === "Success") {
            setStatus("success");
            setUploading(false);
            showSnackbar("Bank statement analyzed and reconciled successfully!", "success");
            fetchHistory();
          } else if (doc.status === "Failed") {
            setStatus("error");
            setErrorMessage(doc.failureReason || "Analysis failed. Please check the statement file.");
            setUploading(false);
            showSnackbar(doc.failureReason || "Analysis failed.", "error");
          } else if (doc.status === "Finalizing") {
            setStatus("finalizing");
          } else {
            setStatus("processing");
          }
        }
      } catch (err) {
        console.error("Error polling status", err);
      }
    };

    pollTimerRef.current = setInterval(poll, 3500);
    poll();

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [currentJobId, status]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    validateAndSetFile(selected);
  };

  const validateAndSetFile = async (selected) => {
    if (selected) {
      if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
        setErrorMessage("Please select a valid PDF bank statement file.");
        showSnackbar("Invalid file type. Only PDF statements are supported.", "error");
        return;
      }
      if (selected.size > 15 * 1024 * 1024) {
        setErrorMessage("File size exceeds 15 MB limit.");
        showSnackbar("File size exceeds 15 MB limit.", "error");
        return;
      }
      setFile(selected);
      setErrorMessage("");
      setPassword("");
      setStatus("idle");

      // Instantly check client-side if PDF is password-protected
      try {
        const buffer = await selected.arrayBuffer();
        try {
          await PDFDocument.load(buffer, { ignoreEncryption: false });
          setRequiresPassword(false);
        } catch (pdfErr) {
          const errMsg = String(pdfErr.message || "").toLowerCase();
          if (errMsg.includes("encrypt") || errMsg.includes("password")) {
            setRequiresPassword(true);
            showSnackbar("This statement is password-protected. Please enter password before analyzing.", "info");
          } else {
            setRequiresPassword(false);
          }
        }
      } catch (err) {
        console.warn("Could not pre-check PDF encryption:", err);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!file) {
      setErrorMessage("Please select a bank statement PDF.");
      return;
    }
    if (!consent) {
      setErrorMessage("Please confirm customer consent to proceed with credit underwriting.");
      return;
    }
    if (requiresPassword && !password.trim()) {
      setErrorMessage("Please enter the password for this protected PDF statement.");
      showSnackbar("Password is required to unlock this bank statement.", "warning");
      return;
    }

    try {
      setUploading(true);
      setErrorMessage("");
      setStatus("processing");

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      if (password) {
        formData.append("password", password);
      }

      const res = await axios.post(`${API_BASE_URL}/bsa/analyze`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data && res.data.success) {
        setCurrentJobId(res.data.id);
        setStatus("processing");
        showSnackbar("Statement uploaded! Processing mathematical reconciliation...", "info");
      }
    } catch (err) {
      setUploading(false);
      setStatus("error");
      const resp = err.response?.data;
      if (resp?.requiresPassword) {
        setRequiresPassword(true);
        setErrorMessage(resp.message || "This statement is password-protected. Please enter password.");
      } else {
        setErrorMessage(resp?.message || "Failed to start analysis. Please try again.");
      }
    }
  };

  const handleDownloadReport = async (id, fileName, download = true) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/bsa/${id}/report${download ? "?download=1" : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      if (download) {
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName ? `Statement_Report_${fileName}` : `CreditDost_Report_${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(url, "_blank");
      }
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error("Failed to fetch report PDF", err);
      showSnackbar("Could not load report PDF. Please try again.", "error");
    }
  };

  return (
    <Box sx={EMBEDDED_FORM_SX}>
      {/* Analyze statement: upload and live status */}
      {section === "analyze" && (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Upload Card */}
        <Grid item xs={12} md={7}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <CloudUploadIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Upload Bank Statement
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Upload customer bank statement in PDF format (up to 15 MB). Password-protected statements are automatically supported.
              </Typography>

              {/* Drag & Drop Zone */}
              <Box
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                component="label"
                htmlFor="statement-pdf-upload"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 4,
                  px: 2,
                  borderRadius: 2,
                  border: "2px dashed",
                  borderColor: isDragOver ? "primary.main" : file ? "success.main" : "grey.300",
                  bgcolor: isDragOver ? "primary.50" : file ? "success.50" : "grey.50",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                  mb: 2,
                }}
              >
                <input
                  id="statement-pdf-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  disabled={uploading}
                />
                <PdfIcon
                  sx={{
                    fontSize: 48,
                    color: file ? "success.main" : "primary.main",
                    mb: 1.5,
                  }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary", textAlign: "center" }}>
                  {file ? file.name : "Choose PDF Statement or Drag & Drop Here"}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze` : "Supported: Official PDF e-Statements (Max 15 MB)"}
                </Typography>
              </Box>

              {/* Password Input if Statement is Protected */}
              {requiresPassword && (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type={showPassword ? "text" : "password"}
                    label="Statement Password"
                    placeholder="Enter statement PDF password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              )}

              {/* Customer Consent Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    I confirm that I have obtained customer consent to analyze this bank statement for credit underwriting purposes.
                  </Typography>
                }
                sx={{ mb: 2, alignItems: "flex-start", mt: 0.5 }}
              />

              {/* Error Alert */}
              {errorMessage && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>
                  {errorMessage}
                </Alert>
              )}

              {/* Submit Button */}
              <Box sx={{ mt: "auto", pt: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={uploading || !file || !consent}
                  startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <AssessmentIcon />}
                  sx={{
                    py: 1.4,
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 1.5,
                  }}
                >
                  {uploading
                    ? status === "finalizing"
                      ? "Generating Report..."
                      : "Reconciling Statement..."
                    : "Analyse Statement"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Live Analysis Status Card */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <AccountBalanceIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Analysis Status
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Real-time tracking of statement parsing, transaction verification, and PDF compilation.
              </Typography>

              {status === "idle" && (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 6,
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  <AccountBalanceIcon sx={{ fontSize: 56, color: "grey.300", mb: 1.5 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary" }}>
                    No Active Analysis
                  </Typography>
                  <Typography variant="caption" sx={{ maxWidth: 280, mt: 0.5 }}>
                    Select and submit a bank statement PDF to view running balance audit and credit intelligence KPIs.
                  </Typography>
                </Box>
              )}

              {(status === "processing" || status === "finalizing") && (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 5,
                    textAlign: "center",
                  }}
                >
                  <CircularProgress size={52} thickness={4} sx={{ mb: 2.5 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {status === "processing"
                      ? "Reconciling Statement Rows..."
                      : "Generating Credit Intelligence Report..."}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 300, mt: 1 }}>
                    Verifying chronological balances, calculating cash flow velocity, detecting loan liabilities, and building risk scorecard.
                  </Typography>
                </Box>
              )}

              {status === "success" && jobData && (
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <Alert
                    icon={<CheckCircleIcon fontSize="inherit" />}
                    severity="success"
                    sx={{ mb: 2, borderRadius: 1.5 }}
                  >
                    Statement Successfully Reconciled & Generated!
                  </Alert>

                  <Card variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 1.5, bgcolor: "grey.50" }}>
                    <Grid container spacing={1.5}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Detected Bank
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {jobData.bankName || "Detected Bank"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Account Holder
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {jobData.accountHolderName || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Account Number
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {jobData.accountNumberMasked || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Reconciliation
                        </Typography>
                        <Chip
                          label={jobData.reconciliationStatus || "VERIFIED"}
                          color="success"
                          size="small"
                          sx={{ fontWeight: 600, height: 22, fontSize: "0.75rem" }}
                        />
                      </Grid>
                    </Grid>
                  </Card>

                  <Box sx={{ mt: "auto", display: "flex", gap: 1.5 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleDownloadReport(jobData.id, jobData.fileName, false)}
                      sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5 }}
                    >
                      View PDF
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownloadReport(jobData.id, jobData.fileName, true)}
                      sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5 }}
                    >
                      Download PDF
                    </Button>
                  </Box>
                </Box>
              )}

              {status === "error" && (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 5,
                    textAlign: "center",
                  }}
                >
                  <ErrorIcon color="error" sx={{ fontSize: 48, mb: 1.5 }} />
                  <Typography variant="subtitle1" color="error" sx={{ fontWeight: 600 }}>
                    Analysis Failed
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 300, mt: 1 }}>
                    {errorMessage || "We encountered an issue processing this statement. Please verify the statement PDF."}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      )}

      {/* Analyses table */}
      {section === "analyses" && (
        <SectionCard>
          <SectionHeader
            title="Statement analyses"
            subtitle={`${analyses.length} ${analyses.length === 1 ? "statement" : "statements"} analysed`}
            actions={
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={fetchHistory}
                disabled={loadingHistory}
                sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "divider", color: "text.primary" }}
              >
                Refresh
              </Button>
            }
          />

          <TableToolbar>
            <SearchField
              value={historySearch}
              onChange={setHistorySearch}
              placeholder="Search by file, holder or bank"
            />
            <FilterChips value={historyFilter} onChange={setHistoryFilter} options={HISTORY_FILTERS} />
          </TableToolbar>
          <LoadingBar loading={loadingHistory} />

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={headRowSx}>
                  <TableCell>Statement</TableCell>
                  <TableCell>Account holder</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Report</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loadingHistory && visibleAnalyses.length === 0 && (
                  <EmptyRow
                    colSpan={5}
                    title={analyses.length === 0 ? "No statements analysed yet" : "No statements match your search"}
                    hint={
                      analyses.length === 0
                        ? "Upload a bank statement in Analyze Statement to see it here."
                        : "Try a different name or filter."
                    }
                  />
                )}
                {visibleAnalyses.map((item) => {
                  const isSuccess = item.status === "Success";
                  const isFailed = item.status === "Failed";
                  const isProcessing = item.status === "Processing" || item.status === "Finalizing";

                  return (
                    <TableRow key={item.id} hover sx={bodyRowSx}>
                      <TableCell sx={{ maxWidth: 320 }}>
                        <Typography variant="body2" fontWeight={600} noWrap title={item.fileName}>
                          {item.fileName || "Bank_Statement.pdf"}
                        </Typography>
                        {item.bankName && (
                          <Chip label={item.bankName} size="small" variant="outlined" sx={{ mt: 0.5, height: 20, fontSize: 11 }} />
                        )}
                      </TableCell>

                      <TableCell>{item.accountHolderName || "—"}</TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {new Date(item.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={item.status}
                          size="small"
                          variant="outlined"
                          color={isSuccess ? "success" : isFailed ? "error" : "warning"}
                        />
                        {isFailed && item.failureReason && (
                          <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5, maxWidth: 260 }}>
                            {item.failureReason}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {isSuccess && (
                          <>
                            <Tooltip title="View PDF">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleDownloadReport(item.id, item.fileName, false)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download PDF report">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleDownloadReport(item.id, item.fileName, true)}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {isProcessing && <CircularProgress size={20} />}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </SectionCard>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%", borderRadius: 1.5 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BankStatementAnalyzer;
