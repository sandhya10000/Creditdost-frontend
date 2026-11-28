import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth.jsx";
import { authAPI } from "../../services/api.jsx";
import { trackEvent, trackException } from "../../hooks/useAnalytics";
import Header from "../homepage/Header.jsx";
import HomePageFooter from "../homepage/HomePageFooter.jsx";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const Login = () => {
  const location = useLocation();
  const selectedPackage = location.state?.selectedPackage;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // A notice left by a forced sign-out (e.g. account suspended) is shown once
  const [error, setError] = useState(() => sessionStorage.getItem("loginNotice") || "");
  useEffect(() => {
    sessionStorage.removeItem("loginNotice");
  }, []);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setSubmitting(true);
      trackEvent("User Authentication", "Login Attempt", "Login Page");

      const response = await login({ email, password });
      localStorage.setItem("user", JSON.stringify(response.user));
      trackEvent("User Authentication", "Login Successful", "Login Page");

      if (response.user?.role === "admin") {
        navigate("/admin");
      } else if (selectedPackage) {
        navigate("/franchise/payment", { state: { package: selectedPackage } });
      } else {
        navigate("/franchise");
      }
    } catch (err) {
      console.error("Login component error:", err);
      trackException(
        `Login failed: ${err.response?.data?.message || err.message}`,
        false
      );
      trackEvent("User Authentication", "Login Failed", "Login Page");

      if (err.response) {
        setError(
          err.response.data?.message ||
            err.response.data?.details ||
            "Invalid email or password. Please verify and try again."
        );
      } else if (err.request) {
        setError(
          "Unable to connect to server. Please check your internet connection."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
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
      setForgotSuccess(response.data.message || "Password reset link sent to your email.");
    } catch (err) {
      console.error("Forgot password error:", err);
      if (err.response) {
        setForgotError(
          err.response.data?.message || "Failed to reset password. Email not found."
        );
      } else {
        setForgotError("Unable to connect to server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#080E1B] font-body-md text-slate-100 antialiased min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      <Header />

      <main className="relative flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 overflow-hidden min-h-[calc(100vh-80px)]">
        {/* Full-width Background Cover Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/login_cover.jpg"
            alt="Login Background"
            className="w-full h-full object-cover object-center filter brightness-[0.80] contrast-[1.05]"
          />
          {/* Subtle gradient overlays to ensure page background merges smoothly while keeping the photo fully visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080E1B] via-[#080E1B]/35 to-[#080E1B]/60" />
          <div className="absolute inset-0 bg-[#080E1B]/20" />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-[1]" />
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[350px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none z-[1]" />

        <div className="w-full max-w-5xl relative z-10 my-auto">
          <div className="rounded-[28px] overflow-hidden border border-cyan-500/35 bg-[#0a1426]/90 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,210,255,0.18),0_30px_70px_rgba(0,0,0,0.85)] grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Brand Showcase Column */}
            <div className="lg:col-span-5 relative p-8 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0c2242] via-[#09172e] to-[#060c18] border-b lg:border-b-0 lg:border-r border-cyan-500/20">
              {/* Inner Decorative Background Rings */}
              <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full border border-cyan-500/20 animate-[spin_60s_linear_infinite]" />
              <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full border border-sky-400/10" />

              <div className="relative z-10">
                <Link to="/" className="inline-block mb-8 group">
                  <img
                    src="/images/white-logo.png"
                    alt="Credit Dost"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/cred.png";
                    }}
                    className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                  />
                </Link>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-mono text-xs mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#3afaac]" />
                  <span>SECURE PARTNER PORTAL</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Sora'] tracking-tight leading-snug mb-3">
                  Welcome to Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                    Partner Workspace.
                  </span>
                </h2>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Sign in to manage client disputes, track bureau resolution status, and access real-time performance analytics.
                </p>

                {/* Trust Badges List */}
                <div className="space-y-3 pt-2 text-xs font-mono">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <span className="w-5 h-5 rounded-md bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
                      ✓
                    </span>
                    <span>256-Bit Bank-Grade Data Vault</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <span className="w-5 h-5 rounded-md bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      ✓
                    </span>
                    <span>Direct CICRA 2005 Dispute Sync</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <span className="w-5 h-5 rounded-md bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30">
                      ✓
                    </span>
                    <span>All 4 National Bureaus Integrated</span>
                  </div>
                </div>
              </div>

              {/* Bottom Support Callout */}
              <div className="relative z-10 pt-8 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Need support?</span>
                <a href="tel:+919217469202" className="text-cyan-400 font-bold hover:underline">
                  +91 92174-69202
                </a>
              </div>
            </div>

            {/* Right Login Form Column */}
            <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
              <div className="max-w-md w-full mx-auto">
                <div className="mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold font-['Sora'] text-white tracking-tight mb-2">
                    Login to Your Account
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Enter your authorized credentials to access your dashboard.
                  </p>
                </div>

                {selectedPackage && (
                  <div className="mb-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span>
                      Package: <strong>{selectedPackage.name}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200">
                      {selectedPackage.creditsIncluded} Credits
                    </span>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-400 text-lg shrink-0">error</span>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1.5 font-semibold">
                      Email Address *
                    </label>
                    <TextField
                      fullWidth
                      required
                      id="email"
                      placeholder="name@example.com"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: "#00d2ff", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "#ffffff !important",
                          backgroundColor: "#071120 !important",
                          borderRadius: "12px",
                          fontFamily: "'Inter', sans-serif",
                          "& fieldset": {
                            borderColor: "rgba(0, 210, 255, 0.3)",
                            borderWidth: "1.5px",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0, 210, 255, 0.65)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#00d2ff !important",
                            boxShadow: "0 0 16px rgba(0, 210, 255, 0.35)",
                            borderWidth: "2px",
                          },
                          "& input": {
                            color: "#ffffff !important",
                            backgroundColor: "transparent !important",
                            fontSize: "0.95rem",
                            WebkitTextFillColor: "#ffffff !important",
                            "&:-webkit-autofill": {
                              WebkitBoxShadow: "0 0 0 1000px #071120 inset !important",
                              WebkitTextFillColor: "#ffffff !important",
                              caretColor: "#ffffff",
                              borderRadius: "12px",
                            },
                          },
                        },
                      }}
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono uppercase text-slate-300 tracking-wider font-semibold">
                        Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => setOpenForgotPassword(true)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <TextField
                      fullWidth
                      required
                      name="password"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: "#00d2ff", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: "rgba(148, 163, 184, 0.8)" }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "#ffffff !important",
                          backgroundColor: "#071120 !important",
                          borderRadius: "12px",
                          fontFamily: "'Inter', sans-serif",
                          "& fieldset": {
                            borderColor: "rgba(0, 210, 255, 0.3)",
                            borderWidth: "1.5px",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0, 210, 255, 0.65)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#00d2ff !important",
                            boxShadow: "0 0 16px rgba(0, 210, 255, 0.35)",
                            borderWidth: "2px",
                          },
                          "& input": {
                            color: "#ffffff !important",
                            backgroundColor: "transparent !important",
                            fontSize: "0.95rem",
                            WebkitTextFillColor: "#ffffff !important",
                            "&:-webkit-autofill": {
                              WebkitBoxShadow: "0 0 0 1000px #071120 inset !important",
                              WebkitTextFillColor: "#ffffff !important",
                              caretColor: "#ffffff",
                              borderRadius: "12px",
                            },
                          },
                        },
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-slate-950 font-bold text-base shadow-[0_0_30px_rgba(0,210,255,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <CircularProgress size={20} sx={{ color: "#080E1B" }} />
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to Dashboard</span>
                          <span className="material-symbols-outlined text-xl">login</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Franchise Partnership Link */}
                <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs font-mono text-slate-400">
                  <span>Want to become a Credit Dost partner? </span>
                  <Link
                    to="/franchise-opportunity"
                    className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors ml-1"
                  >
                    Apply for Franchise →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Forgot Password Dialog */}
        <Dialog
          open={openForgotPassword}
          onClose={() => setOpenForgotPassword(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: "#0a1426",
              color: "#ffffff",
              border: "1px solid rgba(0, 210, 255, 0.3)",
              borderRadius: "20px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
              p: 2,
            },
          }}
        >
          <DialogTitle sx={{ color: "#ffffff", fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
            Reset Password
          </DialogTitle>
          <DialogContent>
            {forgotSuccess ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 text-sm">
                {forgotSuccess}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-300 text-sm">
                  Enter your registered partner email address and we will dispatch a password recovery link.
                </p>
                {forgotError && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                    {forgotError}
                  </div>
                )}
                <TextField
                  fullWidth
                  required
                  label="Registered Email Address"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#ffffff",
                      backgroundColor: "rgba(10, 20, 38, 0.75)",
                      borderRadius: "12px",
                      "& fieldset": { borderColor: "rgba(0, 210, 255, 0.3)" },
                      "&.Mui-focused fieldset": { borderColor: "#00d2ff !important" },
                    },
                    "& .MuiInputLabel-root": { color: "rgba(203, 213, 225, 0.8)" },
                  }}
                />
              </div>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            {forgotSuccess ? (
              <button
                onClick={() => {
                  setOpenForgotPassword(false);
                  setForgotEmail("");
                  setForgotSuccess("");
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-sm font-semibold hover:bg-cyan-500/30 transition-all"
              >
                Close
              </button>
            ) : (
              <>
                <button
                  onClick={() => setOpenForgotPassword(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 text-sm font-bold shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:scale-105 transition-all disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </main>

      <HomePageFooter />
    </div>
  );
};

export default Login;