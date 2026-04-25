import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth.jsx";
import { authAPI } from "../../services/api.jsx";
import { trackEvent, trackException } from "../../hooks/useAnalytics";
import Header from "../homepage/Header.jsx";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
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

const Login = () => {
  const location = useLocation();
  const selectedPackage = location.state?.selectedPackage;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      // Track login attempt
      trackEvent("User Authentication", "Login Attempt", "Login Page");

      const response = await login({ email, password });

      // Track successful login
      trackEvent("User Authentication", "Login Successful", "Login Page");

      // Redirect based on user role from the response
      if (response.user?.role === "admin") {
        navigate("/admin");
      } else if (selectedPackage) {
        // If user came from packages page, redirect to payment with selected package
        navigate("/franchise/payment", { state: { package: selectedPackage } });
      } else {
        navigate("/franchise");
      }
    } catch (err) {
      console.error("Login component error:", err);

      // Track login failure
      trackException(
        `Login failed: ${err.response?.data?.message || err.message}`,
        false
      );
      trackEvent("User Authentication", "Login Failed", "Login Page");

      if (err.response) {
        // Server responded with error status
        setError(
          err.response.data?.message ||
            err.response.data?.details ||
            "Login failed. Please check your credentials."
        );
      } else if (err.request) {
        // Request was made but no response received
        setError(
          "Unable to connect to server. Please check your internet connection."
        );
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleForgotPassword = async () => {
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setForgotError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setForgotError("");
    setForgotSuccess("");

    try {
      const response = await authAPI.forgotPassword(forgotEmail);
      setForgotSuccess(response.data.message);
    } catch (err) {
      console.error("Forgot password error:", err);
      if (err.response) {
        setForgotError(
          err.response.data?.message || "Failed to reset password"
        );
      } else {
        setForgotError("Unable to connect to server. Please try again.");
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
            <Grid
              container
              style={{ flexWrap: "nowrap", minHeight: "60vh" }}
              sx={{ flexDirection: { xs: "column", md: "row" } }}
            >
              <Grid item xs={12} md={5} flex={1}>
                <IllustrationSection>
                  <LogoBox>
                    <img
                      src="/images/cred.png"
                      alt="Logo"
                      style={{ width: "290px" }}
                    />
                  </LogoBox>
                  <Typography
                    variant="h4"
                    fontWeight="700"
                    textAlign="center"
                    mb={2}
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      fontSize: { xs: "1.9rem", md: "2.2rem" },
                    }}
                  >
                    Welcome Back
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
                    Sign in to access your franchise dashboard and manage your
                    business
                  </Typography>
                </IllustrationSection>
              </Grid>
              <Grid item xs={12} md={7} flex={1}>
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
                    sx={{ fontSize: { xs: "1.9rem", md: "2.1rem" } }}
                  >
                    Login to Your Account
                  </Typography>

                  {selectedPackage && (
                    <Alert
                      severity="info"
                      sx={{ mb: 2, borderRadius: 2 }}
                      action={
                        <Chip
                          label={`${selectedPackage.creditsIncluded} Credits - ₹${selectedPackage.price}`}
                          color="primary"
                          size="small"
                        />
                      }
                    >
                      <strong>{selectedPackage.name}</strong> package selected
                    </Alert>
                  )}

                  {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                      <Grid item xs={12} width={"100%"}>
                        <TextField
                          fullWidth
                          required
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          autoFocus
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

                      <Grid item xs={12} width={"100%"}>
                        <TextField
                          fullWidth
                          required
                          name="password"
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          id="password"
                          autoComplete="current-password"
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
                        boxShadow: "0 4px 12px rgba(98, 0, 234, 0.3)",
                      }}
                    >
                      Sign In
                    </Button>

                    <Box textAlign="center" sx={{ mt: 1 }}>
                      <Button
                        onClick={() => setOpenForgotPassword(true)}
                        sx={{ textTransform: "none" }}
                      >
                        <Typography
                          variant="body2"
                          color="primary.main"
                          fontWeight="500"
                        >
                          Forgot Password?
                        </Typography>
                      </Button>
                    </Box>

                    <Box textAlign="center">
                      <Link to="/register" style={{ textDecoration: "none" }}>
                        <Typography
                          variant="body2"
                          color="primary.main"
                          fontWeight="500"
                        >
                          {"Don't have an account? Register"}
                        </Typography>
                      </Link>
                    </Box>
                  </Box>
                </FormSection>
              </Grid>
            </Grid>
          </StyledCard>
        </Container>

        {/* Forgot Password Dialog */}
        <Dialog
          open={openForgotPassword}
          onClose={() => setOpenForgotPassword(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogContent>
            {forgotSuccess ? (
              <Alert severity="success">{forgotSuccess}</Alert>
            ) : (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Enter your email address and we'll send you a new password.
                </Typography>
                {forgotError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {forgotError}
                  </Alert>
                )}
                <TextField
                  fullWidth
                  required
                  label="Email Address"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  sx={{ mt: 1 }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            {forgotSuccess ? (
              <Button
                onClick={() => {
                  setOpenForgotPassword(false);
                  setForgotEmail("");
                  setForgotSuccess("");
                }}
              >
                Close
              </Button>
            ) : (
              <>
                <Button onClick={() => setOpenForgotPassword(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleForgotPassword}
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Password"}
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </GradientBackground>
      <HomePageFooter />
    </>
  );
};

export default Login;
