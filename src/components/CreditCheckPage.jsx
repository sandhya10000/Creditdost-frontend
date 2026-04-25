import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  styled,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { CheckCircle, Download, Sms } from "@mui/icons-material";
import { creditAPI, smsAPI } from "../services/api";
import Header from "./homepage/Header";
import HomePageFooter from "./homepage/HomePageFooter";

// Indian states list
const IndianStates = [
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

const CreditCheckBackground = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #0a1929 0%, #1a2744 50%, #0d2847 100%)",
  minHeight: "100vh",
  padding: theme.spacing(4, 0),
  display: "flex",
  alignItems: "center",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "1rem",
  textTransform: "none",
  transition: "all 0.3s ease",
  background: "linear-gradient(90deg, #0ea5e9, #06b6d4, #0ea5e9)",
  backgroundSize: "200% 200%",
  animation: "gradientShift 3s ease infinite",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(14, 165, 233, 0.4)",
  },
}));

const CreditCheckPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    pan: "",
    email: "", // Add email field
    occupation: "",
    city: "",
    state: "",
    language: "",
  });
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [reportData, setReportData] = useState(null);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-capitalize PAN number
    let newValue = value;
    if (name === 'pan') {
      newValue = value.toUpperCase();
    }
    
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const validateForm = () => {
    if (!formData.name || formData.name.length < 2) {
      setError("Please enter a valid name");
      return false;
    }
    if (!formData.mobile || !/^[0-9]{10}$/.test(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return false;
    }
    if (!formData.pan || formData.pan.length !== 10) {
      setError("Please enter a valid PAN number");
      return false;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.state) {
      setError("Please select your state");
      return false;
    }
    if (!formData.occupation) {
      setError("Please select your occupation");
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateForm()) {
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const response = await smsAPI.sendOTP({
        mobile: formData.mobile,
        purpose: "credit report generation",
      });

      if (response.data.success) {
        setShowOtpDialog(true);
        setError("");
      } else {
        setOtpError(
          response.data.message || "Failed to send OTP. Please try again."
        );
      }
    } catch (err) {
      setOtpError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setOtpLoading(true);
    setOtpError("");

    try {
      const response = await smsAPI.verifyOTP({
        mobile: formData.mobile,
        otp: otp,
      });

      if (response.data.success) {
        setOtpVerified(true);
        setShowOtpDialog(false);

        // Now proceed with the credit report generation
        setLoading(true);
        const creditResponse = await creditAPI.checkCreditScorePublic({
          ...formData,
          bureau: "experian",
        });

        setReportData(creditResponse.data);
        setSuccess(true);
        setOtp("");
      } else {
        setOtpError(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setOtpError(
        err.response?.data?.message || "Failed to verify OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpLoading(true);
    setOtpError("");

    try {
      const response = await smsAPI.resendOTP({
        mobile: formData.mobile,
        purpose: "credit report generation",
      });

      if (response.data.success) {
        setOtpError("OTP has been resent successfully.");
      } else {
        setOtpError(
          response.data.message || "Failed to resend OTP. Please try again."
        );
      }
    } catch (err) {
      setOtpError(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    // Instead of directly submitting, send OTP first
    handleSendOTP();
  };

  return (
    <>
      <Header />
      <CreditCheckBackground>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: "white",
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Free Credit Report
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Get your credit report instantly. Check your credit score and
              financial health for free.
            </Typography>
          </Box>

          <StyledCard>
            <CardContent sx={{ p: 4 }}>
              {success ? (
                <Box sx={{ textAlign: "center" }}>
                  <Box sx={{ mb: 3 }}>
                    <CheckCircle sx={{ fontSize: 60, color: "success.main" }} />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{ mb: 2, fontWeight: 600, color: "white" }}
                  >
                    Report Generated Successfully!
                  </Typography>
                  <Typography sx={{ mb: 3, color: "white" }}>
                    Your Experian credit report has been generated and sent to
                    your email. Please check your inbox (and spam folder) for
                    the report.
                  </Typography>
                  {reportData?.reportUrl && (
                    <StyledButton
                      variant="contained"
                      startIcon={<Download />}
                      href={reportData.reportUrl}
                      target="_blank"
                      sx={{ mt: 2 }}
                    >
                      Download Report
                    </StyledButton>
                  )}
                </Box>
              ) : (
                <>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      mb: 3,
                      textAlign: "center",
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    Enter Your Details
                  </Typography>

                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}

                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(14, 165, 233, 0.5)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0ea5e9",
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: "rgba(255, 255, 255, 0.7)",
                          "&.Mui-focused": {
                            color: "#0ea5e9",
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                        "& .MuiFormLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Mobile Number"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      inputProps={{ maxLength: 10 }}
                      InputProps={{
                        sx: {
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(14, 165, 233, 0.5)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0ea5e9",
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: "rgba(255, 255, 255, 0.7)",
                          "&.Mui-focused": {
                            color: "#0ea5e9",
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                        "& .MuiFormLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="PAN Number"
                      name="pan"
                      value={formData.pan}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      inputProps={{
                        maxLength: 10,
                        style: { textTransform: "uppercase" },
                      }}
                      InputProps={{
                        sx: {
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(14, 165, 233, 0.5)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0ea5e9",
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: "rgba(255, 255, 255, 0.7)",
                          "&.Mui-focused": {
                            color: "#0ea5e9",
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                        "& .MuiFormLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      type="email"
                      InputProps={{
                        sx: {
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(14, 165, 233, 0.5)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0ea5e9",
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: "rgba(255, 255, 255, 0.7)",
                          "&.Mui-focused": {
                            color: "#0ea5e9",
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                        "& .MuiFormLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      }}
                    />

                    {/* New Fields */}
                    <TextField
                      select
                      fullWidth
                      label="Occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(14, 165, 233, 0.5)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0ea5e9",
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: "rgba(255, 255, 255, 0.7)",
                          "&.Mui-focused": {
                            color: "#0ea5e9",
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                        "& .MuiFormLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      }}
                    >
                      <MenuItem value="">Select Occupation</MenuItem>
                      <MenuItem value="salaried">Salaried Employee</MenuItem>
                      <MenuItem value="self_employed">Self Employed</MenuItem>
                    </TextField>

                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(14, 165, 233, 0.5)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0ea5e9",
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: "rgba(255, 255, 255, 0.7)",
                          "&.Mui-focused": {
                            color: "#0ea5e9",
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                        "& .MuiFormLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      }}
                    />

                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(14, 165, 233, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#0ea5e9",
                          },
                        },
                      }}
                    >
                      <InputLabel
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          "&.Mui-focused": {
                            color: "#0ea5e9",
                          },
                        }}
                      >
                        State
                      </InputLabel>
                      <Select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        label="State"
                        sx={{
                          "& .MuiInputBase-input": {
                            color: "white",
                          },
                          "& .MuiSelect-select": {
                            color: "white",
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>Select State</em>
                        </MenuItem>
                        {IndianStates.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      select
                      fullWidth
                      label="Preferred Language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(14, 165, 233, 0.5)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0ea5e9",
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: "rgba(255, 255, 255, 0.7)",
                          "&.Mui-focused": {
                            color: "#0ea5e9",
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                        "& .MuiFormLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      }}
                    >
                      <MenuItem value="">Select Language</MenuItem>
                      <MenuItem value="english">English</MenuItem>
                      <MenuItem value="hindi">Hindi</MenuItem>
                      <MenuItem value="telugu">Telugu</MenuItem>
                      <MenuItem value="tamil">Tamil</MenuItem>
                      <MenuItem value="punjabi">Punjabi</MenuItem>
                      <MenuItem value="marathi">Marathi</MenuItem>
                      <MenuItem value="gujarati">Gujarati</MenuItem>
                      <MenuItem value="bengali">Bengali</MenuItem>
                      <MenuItem value="kannada">Kannada</MenuItem>
                      <MenuItem value="malayalam">Malayalam</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextField>

                    <StyledButton
                      type="submit"
                      variant="contained"
                      disabled={loading || otpLoading}
                      fullWidth
                      sx={{ mt: 2, py: 1.5 }}
                    >
                      {loading || otpLoading ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                      ) : (
                        "Get Free Credit Report"
                      )}
                    </StyledButton>
                  </Box>

                  <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                    >
                      Your information is secure and will only be used to
                      generate your credit report.
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </StyledCard>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.6)" }}
            >
              © {new Date().getFullYear()} Credit Dost. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </CreditCheckBackground>

      {/* OTP Verification Dialog */}
      <Dialog
        open={showOtpDialog}
        onClose={() => !otpLoading && setShowOtpDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
          Verify Your Mobile Number
        </DialogTitle>
        <DialogContent
          sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)", pt: 2 }}
        >
          <Typography sx={{ mb: 2, color: "white" }}>
            We've sent a 6-digit OTP to <strong>{formData.mobile}</strong>.
            Please enter it below to proceed.
          </Typography>

          {otpError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {otpError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="6-digit OTP"
            inputProps={{
              maxLength: 6,
              style: {
                color: "black",
                textAlign: "center",
                fontSize: "1.2rem",
                border: "1px solid #0ea5e9",
              },
            }}
            sx={{
              "& .MuiInputBase-input": {
                color: "white",
                fontSize: "1.2rem",
                padding: "14px",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "#0ea5e9",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0ea5e9",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
                "&.Mui-focused": {
                  color: "#0ea5e9",
                },
              },
            }}
            InputLabelProps={{
              style: { color: "rgba(255, 255, 255, 0.7)" },
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)", p: 2 }}
        >
          <Button
            onClick={handleResendOTP}
            disabled={otpLoading}
            startIcon={<Sms />}
            sx={{ color: "#0ea5e9" }}
          >
            Resend OTP
          </Button>
          <Button
            onClick={() => setShowOtpDialog(false)}
            disabled={otpLoading}
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerifyOTP}
            disabled={otpLoading || otp.length !== 6}
            variant="contained"
            startIcon={<CheckCircle />}
            sx={{
              background: "linear-gradient(90deg, #0ea5e9, #06b6d4)",
              "&:hover": {
                background: "linear-gradient(90deg, #06b6d4, #0ea5e9)",
              },
            }}
          >
            {otpLoading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Verify & Proceed"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <HomePageFooter />
    </>
  );
};

export default CreditCheckPage;
