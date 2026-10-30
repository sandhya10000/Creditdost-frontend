import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  Card,
  CardContent,
  styled,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { authAPI } from "../../services/api.jsx";
import Header from "../homepage/Header.jsx";
import { Lock as LockIcon, Visibility, VisibilityOff } from "@mui/icons-material";
import HomePageFooter from "../homepage/HomePageFooter.jsx";

const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: "80vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
}));

const IllustrationSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
  color: theme.palette.primary.contrastText,
}));

const LogoBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(3),
}));

const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 480,
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2.5),
  },
}));

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!password || !confirmPassword) {
      setError("Please enter both password fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.resetPassword({
        token,
        password,
      });
      
      setSuccess(response.data.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Reset password error:", err);
      if (err.response) {
        if (err.response.status === 400) {
          setIsValidToken(false);
          setError("Password reset link is invalid or has expired");
        } else {
          setError(
            err.response.data?.message || "Failed to reset password"
          );
        }
      } else if (err.request) {
        setError(
          "Unable to connect to server. Please check your internet connection."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <GradientBackground>
        <style>
          {`
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          
          @keyframes blobOne {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(130px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 120px) scale(0.9);
            }
            100% {
              transform: translate(10px, 0px) scale(1);
            }
          }
          
          @keyframes blobTwo {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(-40px, 30px) scale(1.2);
            }
            66% {
              transform: translate(20px, -20px) scale(0.8);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
        `}
        </style>
        <Container maxWidth="lg">
          <StyledCard>
            <Box display="flex" style={{ flexWrap: "nowrap", minHeight: "60vh" }}>
              <Box flex={1} display={{ xs: "none", md: "block" }}>
                <IllustrationSection>
                  <LogoBox>
                    <img
                      src="/images/cred.png"
                      alt="Logo"
                      style={{ width: "292px" }}
                    />
                  </LogoBox>
                  <Typography
                    variant="h4"
                    fontWeight="700"
                    textAlign="center"
                    mb={2}
                    sx={{ position: "relative", zIndex: 1 }}
                  >
                    Reset Your Password
                  </Typography>
                  <Typography
                    variant="body1"
                    textAlign="center"
                    sx={{
                      maxWidth: 300,
                      opacity: 0.9,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    Enter your new password to secure your account
                  </Typography>
                </IllustrationSection>
              </Box>
              <Box flex={1}>
                <FormSection
                  style={{
                    justifyItems: "center",
                    alignContent: "center",
                    height: "100%",
                  }}
                >
                  <Typography
                    component="h1"
                    variant="h4"
                    align="center"
                    mb={3}
                    fontWeight="700"
                  >
                    Reset Password
                  </Typography>

                  {!isValidToken ? (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                      Invalid or expired password reset link. Please request a new one.
                    </Alert>
                  ) : success ? (
                    <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                      {success}
                    </Alert>
                  ) : (
                    <>
                      {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                          {error}
                        </Alert>
                      )}

                      <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                          fullWidth
                          required
                          name="password"
                          label="New Password"
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: 2 }}
                        />

                        <TextField
                          fullWidth
                          required
                          name="confirmPassword"
                          label="Confirm New Password"
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  edge="end"
                                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                >
                                  {showConfirmPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: 3 }}
                        />

                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="large"
                          disabled={loading}
                          sx={{
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 600,
                            boxShadow: "0 4px 12px rgba(98, 0, 234, 0.3)",
                          }}
                        >
                          {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                      </Box>
                    </>
                  )}
                </FormSection>
              </Box>
            </Box>
          </StyledCard>
        </Container>
      </GradientBackground>
      <HomePageFooter />
    </>
  );
};

export default ResetPassword;