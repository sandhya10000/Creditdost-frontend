import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";

// Indian states list
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// Common reusable MUI sx styling for Obsidian Lumina Dark Theme
const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: "#ffffff",
    backgroundColor: "rgba(10, 20, 38, 0.75)",
    backdropFilter: "blur(8px)",
    borderRadius: "12px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.95rem",
    transition: "all 0.2s ease-in-out",
    "& fieldset": {
      borderColor: "rgba(0, 210, 255, 0.22)",
      borderWidth: "1.5px",
    },
    "&:hover fieldset": {
      borderColor: "rgba(0, 210, 255, 0.55)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#00d2ff !important",
      boxShadow: "0 0 16px rgba(0, 210, 255, 0.25)",
      borderWidth: "2px",
    },
    "& input::placeholder": {
      color: "rgba(148, 163, 184, 0.7)",
      opacity: 1,
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(203, 213, 225, 0.9)", // slate-300 high contrast
    fontSize: "0.9rem",
    fontWeight: 500,
    "&.Mui-focused": {
      color: "#00d2ff !important",
      fontWeight: 600,
    },
  },
  "& .MuiInputAdornment-root": {
    color: "#38bdf8", // electric sky/cyan icon
  },
};

const RegistrationForm = ({
  onSubmit,
  successMessage = "Registration successful! Please check your email for further instructions.",
  submitButtonText = "Register",
  formTitle = "Create Your Account",
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [language, setLanguage] = useState("english");
  const [otherLanguage, setOtherLanguage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    // Validation
    if (!name || !email || !phone || !state || !pincode || !language) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit phone number");
      setLoading(false);
      return;
    }

    // Pincode validation (6 digits)
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(pincode)) {
      setError("Please enter a valid 6-digit pincode");
      setLoading(false);
      return;
    }

    // Language validation
    const selectedLanguage = language === "other" ? otherLanguage : language;
    if (language === "other" && !otherLanguage.trim()) {
      setError("Please specify your preferred language");
      setLoading(false);
      return;
    }

    try {
      // Prepare registration data
      const registrationData = {
        name,
        email,
        phone,
        state,
        pincode,
        language: selectedLanguage,
        password: "temp_password", // Placeholder password
      };

      // Call the onSubmit function passed as prop
      await onSubmit(registrationData);

      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2.5,
            borderRadius: "12px",
            backgroundColor: "rgba(153, 27, 27, 0.4)",
            border: "1px solid rgba(248, 113, 113, 0.4)",
            color: "#fca5a5",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 2.5,
            borderRadius: "12px",
            backgroundColor: "rgba(6, 78, 59, 0.4)",
            border: "1px solid rgba(52, 211, 153, 0.4)",
            color: "#6ee7b7",
            fontSize: "0.875rem",
          }}
        >
          {successMessage}
        </Alert>
      )}

      <Typography
        component="h2"
        variant="h6"
        mb={3}
        fontWeight="700"
        sx={{
          color: "#f8fafc",
          fontFamily: "'Sora', sans-serif",
          letterSpacing: "-0.01em",
        }}
      >
        {formTitle}
      </Typography>

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "#00d2ff" }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#00d2ff" }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon sx={{ color: "#00d2ff" }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            id="pincode"
            label="Pincode"
            name="pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon sx={{ color: "#00d2ff" }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth required sx={inputSx}>
            <InputLabel
              id="state-label"
              sx={{
                color: "rgba(203, 213, 225, 0.9)",
                "&.Mui-focused": { color: "#00d2ff !important" },
              }}
            >
              State / Union Territory
            </InputLabel>
            <Select
              labelId="state-label"
              id="state"
              value={state}
              label="State / Union Territory"
              onChange={(e) => setState(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <LocationIcon sx={{ color: "#00d2ff", ml: 0.5 }} />
                </InputAdornment>
              }
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#0a1426",
                    color: "#f8fafc",
                    border: "1px solid rgba(0, 210, 255, 0.3)",
                    borderRadius: "12px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
                    maxHeight: 320,
                    "& .MuiMenuItem-root": {
                      fontSize: "0.9rem",
                      py: 1,
                      "&:hover": {
                        bgcolor: "rgba(0, 210, 255, 0.12)",
                        color: "#38bdf8",
                      },
                      "&.Mui-selected": {
                        bgcolor: "rgba(0, 210, 255, 0.2)",
                        color: "#00d2ff",
                        fontWeight: 600,
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>Select State</em>
              </MenuItem>
              {indianStates.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset" fullWidth sx={{ mt: 1 }}>
            <Typography
              component="legend"
              variant="body2"
              sx={{
                mb: 1,
                color: "rgba(203, 213, 225, 0.9)",
                fontWeight: 600,
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontFamily: "monospace",
              }}
            >
              Preferred Communication Language
            </Typography>
            <RadioGroup
              row
              aria-label="language"
              name="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              sx={{ gap: 2 }}
            >
              {[
                { val: "english", label: "English" },
                { val: "hindi", label: "Hindi" },
                { val: "other", label: "Other" },
              ].map((item) => (
                <FormControlLabel
                  key={item.val}
                  value={item.val}
                  control={
                    <Radio
                      sx={{
                        color: "rgba(148, 163, 184, 0.6)",
                        "&.Mui-checked": {
                          color: "#00d2ff !important",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: language === item.val ? "#ffffff" : "rgba(203, 213, 225, 0.8)",
                        fontSize: "0.9rem",
                        fontWeight: language === item.val ? 600 : 400,
                      }}
                    >
                      {item.label}
                    </Typography>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>

        {language === "other" && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="other-language"
              label="Specify Language"
              value={otherLanguage}
              onChange={(e) => setOtherLanguage(e.target.value)}
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LanguageIcon sx={{ color: "#00d2ff" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                required
                sx={{
                  color: "#00e599",
                  "&.Mui-checked": {
                    color: "#00e599 !important",
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: "rgba(203, 213, 225, 0.8)", fontSize: "0.85rem" }}>
                I agree to receive franchise communication & updates from Credit Dost. *
              </Typography>
            }
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        sx={{
          mt: 3.5,
          mb: 1.5,
          py: 1.6,
          borderRadius: "14px",
          fontWeight: 700,
          fontSize: "1rem",
          letterSpacing: "0.02em",
          color: "#040d1a",
          background: "linear-gradient(135deg, #00d2ff 0%, #0099ff 50%, #00e599 100%)",
          boxShadow: "0 0 25px rgba(0, 210, 255, 0.4)",
          textTransform: "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            background: "linear-gradient(135deg, #38bdf8 0%, #0284c7 50%, #10b981 100%)",
            boxShadow: "0 0 35px rgba(0, 210, 255, 0.6)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(1px)",
          },
        }}
        disabled={loading}
      >
        {loading ? (
          <>
            <CircularProgress size={22} sx={{ mr: 1.5, color: "#040d1a" }} />
            Submitting Application...
          </>
        ) : (
          submitButtonText
        )}
      </Button>
    </Box>
  );
};

export default RegistrationForm;