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
  background: "url('/images/reg.jpg')",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: theme.shadows[15],
  overflow: "visible",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: theme.shape.borderRadius * 3.5,
    zIndex: -1,
  },
}));

const IllustrationSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
  backgroundSize: "400% 400%",
  animation: "gradientShift 8s ease infinite",
  minHeight: "100%",
  borderRadius: `${theme.shape.borderRadius * 3}px 0 0 ${
    theme.shape.borderRadius * 3
  }px`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
  color: "white",
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    borderRadius: `${theme.shape.borderRadius * 3}px ${
      theme.shape.borderRadius * 3
    }px 0 0`,
  },
  "&::before": {
    content: '""',
    position: "absolute",
    width: "200px",
    height: "200px",
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "50%",
    top: "20%",
    left: "10%",
    filter: "blur(20px)",
    animation: "blobOne 12s ease-in-out infinite",
    zIndex: 0,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    width: "150px",
    height: "150px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
    top: "60%",
    right: "15%",
    filter: "blur(20px)",
    animation: "blobTwo 15s ease-in-out infinite",
    zIndex: 0,
  },
}));

const LogoBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(3),
  "& svg": {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "50%",
    padding: theme.spacing(2),
    color: "white",
    position: "relative",
    zIndex: 1,
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3),
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