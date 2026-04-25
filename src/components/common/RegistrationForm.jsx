import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  styled,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
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

const RegistrationForm = ({ onSubmit, successMessage = "Registration successful! Please check your email for further instructions.", submitButtonText = "Register", formTitle = "Create Your Account" }) => {
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
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Typography
        component="h2"
        variant="h6"
        mb={3}
        fontWeight="700"
      >
        {formTitle}
      </Typography>

      <Grid container spacing={2}>
        <div
          style={{ display: "flex", gap: "16px", width: "100%" }}
        >
          <Grid item xs={12} sm={6} style={{ width: "100%" }}>
            <TextField
              fullWidth
              required
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} style={{ width: "100%" }}>
            <TextField
              fullWidth
              required
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </div>

        <div
          style={{ display: "flex", gap: "16px", width: "100%" }}
        >
          <Grid item xs={12} sm={6} style={{ width: "100%" }}>
            <TextField
              fullWidth
              required
              id="phone"
              label="Phone Number"
              name="phone"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} style={{ width: "100%" }}>
            <TextField
              fullWidth
              required
              id="pincode"
              label="Pincode"
              name="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </div>

        <Grid item xs={12} sm={6} style={{ width: "100%" }}>
          <FormControl fullWidth required>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              id="state"
              value={state}
              label="State"
              onChange={(e) => setState(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <LocationIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="">
                <em>Select State</em>
              </MenuItem>
              {indianStates.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl
            component="fieldset"
            fullWidth
            margin="normal"
            required
          >
            <Typography
              component="legend"
              variant="body1"
              sx={{ mb: 1 }}
            >
              Preferred Language
            </Typography>
            <RadioGroup
              row
              aria-label="language"
              name="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <FormControlLabel
                value="english"
                control={<Radio />}
                label="English"
              />
              <FormControlLabel
                value="hindi"
                control={<Radio />}
                label="Hindi"
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        {language === "other" && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              id="other-language"
              label="Specify Language"
              value={otherLanguage}
              onChange={(e) => setOtherLanguage(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LanguageIcon />
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
                checked={true} // Consent is always true by default
                required
                sx={{
                  color: "#4caf50",
                  "&.Mui-checked": {
                    color: "#4caf50",
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: "#666" }}>
                I agree to receive communication from Credit Dost.
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
          mt: 3,
          mb: 2,
          py: 1.5,
          borderRadius: 3,
          fontWeight: 600,
          background: "linear-gradient(135deg, #4caf50, #2196f3)",
        }}
        disabled={loading}
      >
        {loading ? (
          <>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            Submitting...
          </>
        ) : (
          submitButtonText
        )}
      </Button>
    </Box>
  );
};

export default RegistrationForm;