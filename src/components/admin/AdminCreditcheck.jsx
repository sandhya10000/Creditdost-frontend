import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Chip,
  Link,
  Stack,
  ButtonBase,
  Divider,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  CreditScore,
  PictureAsPdf,
  Download,
  Info,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import { franchiseAPI, adminAPI } from "../../services/api";
import {
  CardAlerts,
  CellText,
  DateCell,
  EmptyRow,
  FilterChips,
  LoadingBar,
  ScoreChip,
  SectionCard,
  SectionHeader,
  TableFooter,
} from "./ui/AdminTable";
import { bodyRowSx, headRowSx } from "./ui/tableStyles";

// Bureaus the admin can pull, and the provider(s) each one goes through.
// Every Finpass option calls the same Finpass multi-bureau API; only `bureau` differs.
const BUREAUS = [
  {
    key: "cibil",
    label: "CIBIL",
    description: "TransUnion CIBIL",
    providers: [{ value: "cibil-finpass", label: "Finpass" }],
  },
  {
    key: "crif",
    label: "CRIF",
    description: "CRIF High Mark",
    providers: [
      { value: "crif-indiconnect", label: "IndiConnect" },
      { value: "crif-finpass", label: "Finpass" },
    ],
  },
  {
    key: "experian",
    label: "Experian",
    description: "Experian India",
    providers: [
      { value: "experian-indiconnect", label: "IndiConnect" },
      { value: "experian-finpass", label: "Finpass" },
    ],
  },
  {
    key: "equifax",
    label: "Equifax",
    description: "Equifax India",
    providers: [{ value: "equifax", label: "Equifax" }],
  },
];

// Every selectable option with a readable label, e.g. "CRIF (Finpass)"
const BUREAU_OPTIONS = BUREAUS.flatMap((bureau) =>
  bureau.providers.map((provider) => ({
    ...provider,
    bureau,
    label:
      bureau.providers.length > 1 || provider.label !== bureau.label
        ? `${bureau.label} (${provider.label})`
        : bureau.label,
  })),
);
const DEFAULT_OPTION = "cibil-finpass";

// Options sent to the admin V2 endpoint (/credit/credit-check-v2)
const V2_PROVIDER_MAP = {
  "cibil-finpass": { bureau: "cibil", key: "cibilApiType", value: "finpass" },
  "crif-finpass": { bureau: "crif", key: "crifApiType", value: "finpass" },
  "experian-finpass": { bureau: "experian", key: "experianApiType", value: "finpass" },
};
// V1 (/credit/check) bureau values for the IndiConnect variants
const V1_BUREAU_MAP = {
  "crif-indiconnect": "crif",
  "experian-indiconnect": "experian",
};

const StepLabel = ({ number, children }) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
    <Box
      sx={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        fontSize: 12,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {number}
    </Box>
    <Typography variant="subtitle2" fontWeight={700}>
      {children}
    </Typography>
  </Stack>
);

const AdminCreditBureau = ({ defaultBureau = "", embedded = false }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    pan: "",
    aadhaar: "",
    dob: "",
    gender: "",
    pincode: "",
    // Falls back to CIBIL (Finpass) if the requested option no longer exists
    bureau: BUREAU_OPTIONS.some((o) => o.value === defaultBureau) ? defaultBureau : DEFAULT_OPTION,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [creditReports, setCreditReports] = useState([]);
  const [recentReport, setRecentReport] = useState(null);
  const [availableCredits, setAvailableCredits] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Load recent credit reports and available credits on component mount
  useEffect(() => {
    loadDashboardStats();
  }, []);

  useEffect(() => {
    loadCreditReports();
  }, [page]);

  const loadDashboardStats = async () => {
    try {
      const response = await franchiseAPI.getDashboardStats();
      setAvailableCredits(response.data.stats.credits);
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
    }
  };

  const loadCreditReports = async () => {
    try {
      setLoading(true);
      const response = await franchiseAPI.getCreditReports({
        page: page,
        limit: rowsPerPage,
      });
      console.log("Credit reports loaded:", response.data);

      setCreditReports(response.data.reports || []);
      setTotalRecords(response.data.total || 0);
      setLoading(false);
    } catch (err) {
      console.error("Error loading credit reports:", err);
      setError("Failed to load credit reports");
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const selectOption = (value) => setFormData((prev) => ({ ...prev, bureau: value }));

  // Keeps the current provider when it belongs to the bureau, else picks the bureau's first
  const selectBureau = (bureau) => {
    if (bureau.providers.some((p) => p.value === formData.bureau)) return;
    selectOption(bureau.providers[0].value);
  };

  const selectedOption =
    BUREAU_OPTIONS.find((o) => o.value === formData.bureau) || BUREAU_OPTIONS[0];
  const selectedBureau = selectedOption.bureau;
  const isFinpass = formData.bureau.endsWith("-finpass");
  const isExperianIndiconnect = formData.bureau === "experian-indiconnect";

  // Fields the chosen bureau/provider insists on (mirrors the checks in handleCheckCredit)
  const needs = {
    pan: isFinpass || isExperianIndiconnect || formData.bureau === "equifax",
    dob: isExperianIndiconnect,
    pincode: isExperianIndiconnect,
    fullName: isExperianIndiconnect,
  };
  const checklist = [
    { label: "Customer name", ok: formData.name.trim().length >= 2 },
    ...(needs.fullName
      ? [{ label: "First and last name", ok: formData.name.trim().split(/\s+/).length >= 2 }]
      : []),
    { label: "10-digit mobile number", ok: /^[0-9]{10}$/.test(formData.mobile) },
    ...(needs.pan
      ? [{ label: "PAN number", ok: /^[A-Za-z0-9]{10}$/.test(formData.pan) }]
      : []),
    ...(needs.dob ? [{ label: "Date of birth", ok: Boolean(formData.dob) }] : []),
    ...(needs.pincode ? [{ label: "6-digit pincode", ok: /^[0-9]{6}$/.test(formData.pincode) }] : []),
  ];

  const handleCheckCredit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    // Validate form data before sending
    if (!formData.name || formData.name.trim().length < 2) {
      setError("Please enter a valid customer name (at least 2 characters)");
      setSaving(false);
      return;
    }

    // Validate mobile number (exactly 10 digits)
    if (!formData.mobile || !/^[0-9]{10}$/.test(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      setSaving(false);
      return;
    }

    // Validate PAN if provided (alphanumeric, 10 characters)
    if (formData.pan && !/^[A-Za-z0-9]{10}$/.test(formData.pan)) {
      setError("Please enter a valid PAN number (10 alphanumeric characters)");
      setSaving(false);
      return;
    }

    // Validate Aadhaar if provided (exactly 12 digits)
    if (formData.aadhaar && !/^[0-9]{12}$/.test(formData.aadhaar)) {
      setError("Please enter a valid 12-digit Aadhaar number");
      setSaving(false);
      return;
    }

    // Special validation for Equifax - requires either PAN or Aadhaar
    if (formData.bureau === "equifax" && !formData.pan && !formData.aadhaar) {
      setError(
        "For Equifax credit check, either PAN or Aadhaar number is required",
      );
      setSaving(false);
      return;
    }

    // Experian Soft-Pull (IndiConnect) requires PAN + pincode + DOB + two-word name.
    // Experian via Finpass only needs PAN (checked below with the other Finpass options).
    if (formData.bureau === "experian-indiconnect") {
      if (!formData.pan || !/^[A-Za-z0-9]{10}$/.test(formData.pan)) {
        setError("PAN number is required for Experian (10 characters)");
        setSaving(false);
        return;
      }
      if (!formData.pincode || !/^[0-9]{6}$/.test(formData.pincode)) {
        setError("Pincode is required for Experian (6 digits)");
        setSaving(false);
        return;
      }
      if (!formData.dob) {
        setError("Date of birth is required for Experian");
        setSaving(false);
        return;
      }
      if (formData.name.trim().split(/\s+/).length < 2) {
        setError("Full name must contain first and last name for Experian");
        setSaving(false);
        return;
      }
    }

    // Retry mechanism
    const maxRetries = 2;
    let retries = 0;

    const attemptRequest = async () => {
      try {
        // Finpass options (CIBIL / CRIF / Experian) go through the admin V2 endpoint
        const v2Route = V2_PROVIDER_MAP[formData.bureau];
        if (v2Route) {
          const v2Payload = {
            name: formData.name.trim(),
            mobile: formData.mobile.trim(),
            bureau: v2Route.bureau,
            [v2Route.key]: v2Route.value,
          };
          if (formData.pan) v2Payload.pan = formData.pan.trim().toUpperCase();
          if (v2Route.value === "finpass") {
            // Finpass requires PAN and takes gender (optional on our side)
            if (!v2Payload.pan) {
              setError(`PAN is required for ${selectedOption.label}`);
              setSaving(false);
              return;
            }
            if (formData.gender) v2Payload.gender = formData.gender;
          }
          const v2Response = await adminAPI.checkCreditV2(v2Payload);
          const v2Report = v2Response.data.creditReport || {};
          setSuccess(
            v2Response.data.message ||
              `Credit check completed successfully from ${v2Route.bureau.toUpperCase()} (${v2Route.value.toUpperCase()})!`,
          );
          console.log("Credit report response:", v2Response.data);
          setRecentReport(v2Report);
          await loadCreditReports();
          return;
        }

        // V1 (/credit/check) bureau for the IndiConnect variants
        const v1Bureau = V1_BUREAU_MAP[formData.bureau] || formData.bureau;

        // Prepare data for API call
        const requestData = {
          name: formData.name.trim(),
          mobile: formData.mobile.trim(),
          bureau: v1Bureau,
        };

        // Add bureau-specific fields
        if (v1Bureau === "equifax") {
          // For Equifax, we need id_number and id_type instead of separate PAN/Aadhaar
          if (formData.pan) {
            requestData.id_number = formData.pan.trim().toUpperCase();
            requestData.id_type = "pan";
          } else if (formData.aadhaar) {
            requestData.id_number = formData.aadhaar.trim();
            requestData.id_type = "aadhaar";
          }
        } else {
          // Add optional fields for other bureaus if provided
          if (formData.pan) requestData.pan = formData.pan.trim().toUpperCase();
          if (formData.aadhaar) requestData.aadhaar = formData.aadhaar.trim();
          if (formData.dob) requestData.dob = formData.dob;
          if (formData.gender) requestData.gender = formData.gender;
          if (v1Bureau === "experian" && formData.pincode)
            requestData.pincode = formData.pincode.trim();
        }

        // Call the API to check credit
        const response = await franchiseAPI.getCreditReport(requestData);

        setSuccess(
          `Credit check completed successfully from ${v1Bureau.toUpperCase()}! ${
            response.data.remainingCredits
          } credits remaining.`,
        );
        console.log("Credit report response:", response.data);
        console.log("Credit report data:", response.data.creditReport);
        setRecentReport(response.data.creditReport);
        setAvailableCredits(response.data.remainingCredits);

        // Reload reports to include the new one
        await loadCreditReports();
      } catch (err) {
        console.error("Credit check error:", err);

        // Handle specific error types
        if (
          err.response?.data?.error === "TIMEOUT_ERROR" ||
          err.response?.status === 504
        ) {
          if (retries < maxRetries) {
            retries++;
            // Wait 2 seconds before retry
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return attemptRequest();
          } else {
            setError(
              "Request timeout when connecting to credit bureau after multiple attempts. Please try again later.",
            );
          }
        } else if (
          err.response?.data?.error === "NETWORK_ERROR" ||
          err.response?.status === 502
        ) {
          if (retries < maxRetries) {
            retries++;
            // Wait 2 seconds before retry
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return attemptRequest();
          } else {
            setError(
              "Network error when connecting to credit bureau after multiple attempts. Please check your internet connection and try again.",
            );
          }
        } else if (err.response?.data?.message) {
          // Show specific error message from backend
          let errorMessage = err.response.data.message;
          // If there are detailed validation errors, include them
          if (
            err.response.data.details &&
            Array.isArray(err.response.data.details)
          ) {
            errorMessage += ": " + err.response.data.details.join(", ");
          }
          // setError(errorMessage);
          setError(errorMessage || "Something went wrong");
        } else if (err.response?.status === 400) {
          setError(
            "Invalid request data. Please check all fields and try again.",
          );
        } else if (err.response?.status === 401) {
          setError("Authentication failed. Please log in again.");
        } else if (err.response?.status === 403) {
          setError(
            "Access denied. You do not have permission to perform this action.",
          );
        } else if (err.response?.status === 404) {
          setError("Resource not found. Please try again or contact support.");
        } else if (err.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to check credit score. Please try again.");
        }
      }
    };

    await attemptRequest();
    setSaving(false);
  };

  const getReportUrl = (report) => {
    // Use local path if available, otherwise use the original report URL
    if (report.localPath) {
      // For local paths, use the base server URL without /api prefix
      const baseUrl = import.meta.env.VITE_REACT_APP_API_URL
        ? import.meta.env.VITE_REACT_APP_API_URL.replace("/api", "")
        : "https://reactbackend.creditdost.co.in";
      return `${baseUrl}${report.localPath}`;
    }
    return report.reportUrl;
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    console.log("Typing:", value); //  check typing

    setFormData((prev) => ({ ...prev, mobile: value }));

    if (value.length === 10) {
      console.log("Calling API..."); //  MUST print
    }
  };
  // Label above a value in the "Latest result" strip
  const ResultField = ({ label, children }) => (
    <Grid item xs={6} md={3}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Box sx={{ mt: 0.25 }}>{children}</Box>
    </Grid>
  );

  return (
    <Box>
      {!embedded && (
        <Typography variant="h4" gutterBottom>
          Credit Check
        </Typography>
      )}

      <Box sx={{ mb: 2 }}>
        <FilterChips
          options={[
            { value: "check", label: "Check credit" },
            { value: "recent", label: "Recent reports" },
          ]}
          value={activeTab === 0 ? "check" : "recent"}
          onChange={(value) => handleTabChange(null, value === "check" ? 0 : 1)}
        />
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SectionCard>
              <SectionHeader
                title="Check customer credit"
                subtitle="Choose a bureau, fill in the customer's details and pull a fresh report."
              />
              <Box component="form" onSubmit={handleCheckCredit} sx={{ p: 2.5 }}>
                {error && (
                  <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" onClose={() => setSuccess("")} sx={{ mb: 2 }}>
                    {success}
                  </Alert>
                )}

                {/* 1. Bureau */}
                <StepLabel number={1}>Credit bureau</StepLabel>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
                    gap: 1.5,
                  }}
                >
                  {BUREAUS.map((bureau) => {
                    const selected = selectedBureau.key === bureau.key;
                    return (
                      <ButtonBase
                        key={bureau.key}
                        onClick={() => selectBureau(bureau)}
                        aria-pressed={selected}
                        sx={(theme) => ({
                          display: "block",
                          textAlign: "left",
                          p: 1.75,
                          borderRadius: 2,
                          border: `1.5px solid ${
                            selected ? theme.palette.primary.main : theme.palette.divider
                          }`,
                          bgcolor: selected
                            ? alpha(theme.palette.primary.main, 0.06)
                            : "background.paper",
                          transition: "border-color 0.15s, background-color 0.15s",
                          "&:hover": {
                            borderColor: selected
                              ? theme.palette.primary.main
                              : theme.palette.grey[400],
                          },
                        })}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography fontWeight={700} color={selected ? "primary.main" : "text.primary"}>
                            {bureau.label}
                          </Typography>
                          {selected && <CheckCircle color="primary" sx={{ fontSize: 18 }} />}
                        </Stack>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {bureau.description}
                        </Typography>
                      </ButtonBase>
                    );
                  })}
                </Box>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Provider:
                  </Typography>
                  {selectedBureau.providers.length > 1 ? (
                    <ToggleButtonGroup
                      exclusive
                      size="small"
                      color="primary"
                      value={formData.bureau}
                      onChange={(_, value) => value && selectOption(value)}
                    >
                      {selectedBureau.providers.map((provider) => (
                        <ToggleButton
                          key={provider.value}
                          value={provider.value}
                          sx={{ px: 2, textTransform: "none", fontWeight: 600 }}
                        >
                          {provider.label}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  ) : (
                    <Chip
                      size="small"
                      color="primary"
                      variant="outlined"
                      label={selectedBureau.providers[0].label}
                    />
                  )}
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* 2. Customer */}
                <StepLabel number={2}>Customer details</StepLabel>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      id="name"
                      name="name"
                      label="Customer Name"
                      fullWidth
                      value={formData.name}
                      onChange={handleInputChange}
                      helperText={
                        needs.fullName ? "First and last name, as on PAN" : "Full name as on PAN"
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      id="mobile"
                      name="mobile"
                      label="Mobile Number"
                      fullWidth
                      value={formData.mobile}
                      onChange={handleMobileChange}
                      inputProps={{ maxLength: 10, pattern: "[0-9]{10}", inputMode: "numeric" }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                      }}
                      helperText="10 digits, no spaces or dashes"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      required={needs.pan}
                      id="pan"
                      name="pan"
                      label={needs.pan ? "PAN Number" : "PAN Number (optional)"}
                      fullWidth
                      value={formData.pan}
                      onChange={handleInputChange}
                      inputProps={{
                        style: { textTransform: "uppercase" },
                        maxLength: 10,
                        pattern: "[A-Za-z0-9]{10}",
                      }}
                      helperText={
                        needs.pan ? `Required for ${selectedOption.label}` : "e.g. ABCDE1234F"
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      required={needs.dob}
                      id="dob"
                      name="dob"
                      label={needs.dob ? "Date of Birth" : "Date of Birth (optional)"}
                      type="date"
                      fullWidth
                      value={formData.dob}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      id="gender"
                      name="gender"
                      label="Gender (optional)"
                      fullWidth
                      value={formData.gender}
                      onChange={handleInputChange}
                      helperText={isFinpass ? "Sent to Finpass when provided" : " "}
                    >
                      <MenuItem value="">
                        <em>Not specified</em>
                      </MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  </Grid>
                  {needs.pincode && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        required
                        id="pincode"
                        name="pincode"
                        label="Pincode"
                        fullWidth
                        value={formData.pincode}
                        onChange={handleInputChange}
                        inputProps={{ maxLength: 6, pattern: "[0-9]{6}", inputMode: "numeric" }}
                        helperText="6-digit pincode (required for Experian IndiConnect)"
                      />
                    </Grid>
                  )}
                </Grid>

                <Stack
                  direction={{ xs: "column-reverse", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", sm: "center" }}
                  spacing={2}
                  sx={{ mt: 3 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Pulling from <strong>{selectedOption.label}</strong>
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disableElevation
                    startIcon={
                      saving ? <CircularProgress size={18} color="inherit" /> : <CreditScore />
                    }
                    disabled={saving}
                    sx={{ px: 4 }}
                  >
                    {saving ? "Checking..." : "Check credit"}
                  </Button>
                </Stack>
              </Box>

              {recentReport && (
                <Box sx={{ p: 2.5, borderTop: 1, borderColor: "divider", bgcolor: "grey.50" }}>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ fontWeight: 700, letterSpacing: 0.8 }}
                  >
                    Latest result
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 0 }}>
                    <ResultField label="Name">
                      <Typography variant="body2" fontWeight={600}>
                        {recentReport.name}
                      </Typography>
                    </ResultField>
                    <ResultField label="Mobile">
                      <Typography variant="body2">{recentReport.mobile}</Typography>
                    </ResultField>
                    <ResultField label="Bureau">
                      <Chip
                        size="small"
                        variant="outlined"
                        label={recentReport.bureau ? recentReport.bureau.toUpperCase() : "N/A"}
                      />
                    </ResultField>
                    <ResultField label="Credit Score">
                      <ScoreChip score={recentReport.score} emptyLabel="No Credit History" />
                    </ResultField>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    {getReportUrl(recentReport) ? (
                      <Button
                        variant="outlined"
                        startIcon={<PictureAsPdf />}
                        endIcon={<Download />}
                        component={Link}
                        href={getReportUrl(recentReport)}
                        target="_blank"
                      >
                        Download PDF report
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No PDF report available for this credit check
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </SectionCard>
          </Grid>

          {/* Live checklist for the chosen bureau and provider */}
          <Grid item xs={12} lg={4}>
            <SectionCard sx={{ position: { lg: "sticky" }, top: { lg: 88 } }}>
              <SectionHeader title="Before you check" subtitle={selectedOption.label} />
              <Stack spacing={1.25} sx={{ p: 2.5 }}>
                {checklist.map((item) => (
                  <Stack key={item.label} direction="row" spacing={1.25} alignItems="center">
                    {item.ok ? (
                      <CheckCircle color="success" sx={{ fontSize: 20 }} />
                    ) : (
                      <RadioButtonUnchecked sx={{ fontSize: 20, color: "text.disabled" }} />
                    )}
                    <Typography
                      variant="body2"
                      color={item.ok ? "text.primary" : "text.secondary"}
                    >
                      {item.label}
                    </Typography>
                  </Stack>
                ))}
                <Alert severity="info" icon={<Info fontSize="small" />} sx={{ mt: 1 }}>
                  {isFinpass
                    ? "Finpass pulls the report from the selected bureau using the customer's PAN."
                    : "Adding PAN, date of birth and gender improves the accuracy of the report."}
                </Alert>
              </Stack>
            </SectionCard>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <SectionCard>
          <SectionHeader
            title="Recent credit reports"
            subtitle="Credit checks run from this account."
          />
          <CardAlerts error={error} onCloseError={() => setError("")} />
          <LoadingBar loading={loading} />

          <TableContainer>
            <Table size="small" sx={{ minWidth: 800 }} aria-label="credit reports table">
              <TableHead>
                <TableRow sx={headRowSx}>
                  <TableCell>Customer</TableCell>
                  <TableCell>Bureau</TableCell>
                  <TableCell>Credit Score</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Report</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {creditReports.length === 0 ? (
                  <EmptyRow
                    colSpan={5}
                    loading={loading}
                    title="No credit reports yet"
                    hint="Check a customer's credit to see reports here."
                  />
                ) : (
                  creditReports.map((report) => (
                    <TableRow key={report.id || report._id} hover sx={bodyRowSx}>
                      <TableCell sx={{ maxWidth: 260 }}>
                        <CellText variant="body2" fontWeight={600}>
                          {report.name}
                        </CellText>
                        <Typography variant="caption" color="text.secondary">
                          {report.mobile || "No mobile"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={report.bureau ? report.bureau.toUpperCase() : "N/A"}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <ScoreChip score={report.score} emptyLabel="No Credit History" />
                      </TableCell>
                      <TableCell>
                        <DateCell value={report.createdAt} />
                      </TableCell>
                      <TableCell align="right">
                        {getReportUrl(report) ? (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<PictureAsPdf fontSize="small" />}
                            component={Link}
                            href={getReportUrl(report)}
                            target="_blank"
                          >
                            PDF
                          </Button>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            No PDF
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
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
      )}
    </Box>
  );
};

export default AdminCreditBureau;
