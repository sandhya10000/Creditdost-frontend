import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./providers/AuthProvider";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ScrollToTop from "./components/common/ScrollToTop";
import AnalyticsTracker from "./components/common/AnalyticsTracker";
import "./App.css";
// Home is above-the-fold: keep eager so LCP is fast.
// Everything else is code-split so homepage visitors don't download
// admin/franchise editors (tinymce/tiptap), charts (recharts), pdf libs, etc.
import Home from "./components/homepage/HomePage";
const Login = lazy(() => import("./components/auth/Login"));
const Register = lazy(() => import("./components/auth/Register"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));
const FranchiseRoutes = lazy(() => import("./components/franchise/Routes"));
const AdminRoutes = lazy(() => import("./components/admin/Routes"));
const PackagesPage = lazy(() => import("./components/PackagesPage"));
const AboutPage = lazy(() => import("./components/About/AboutPage"));
const BlogsPage = lazy(() => import("./components/BlogsPage"));
const BlogDetailPage = lazy(() => import("./components/BlogDetailPage"));
const ContactPage = lazy(() => import("./components/ContactPage"));
const CreditCheckPage = lazy(() => import("./components/CreditCheckPage"));
const EmiCalculatorPage = lazy(() => import("./components/EmiCalculatorPage"));
const IfscFinder = lazy(() => import("./components/homepage/IfscFinder"));
const CreditScoreRepairPage = lazy(
  () => import("./components/CreditScoreRepairPage"),
);
const FranchiseOpportunityPage = lazy(
  () => import("./components/FranchiseOpportunityPage"),
);
const TermsAndConditionsPage = lazy(
  () => import("./components/TermsAndConditionsPage"),
);
const PrivacyPolicyPage = lazy(() => import("./components/PrivacyPolicyPage"));
const DisclaimerPage = lazy(() => import("./components/DisclaimerPage"));
const RefundPolicyPage = lazy(() => import("./components/RefundPolicyPage"));
const ApplyForLoanPage = lazy(() => import("./components/ApplyForLoanPage"));
const SuvidhaCentrePage = lazy(() => import("./components/SuvidhaCentrePage"));
const CareersPage = lazy(() => import("./components/CareersPage"));

const RouteFallback = () => (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#757575",
    }}
  >
    Loading...
  </div>
);

// Create enhanced theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#6200ea",
      light: "#bb86fc",
      dark: "#3700b3",
    },
    secondary: {
      main: "#03dac6",
      light: "#66fff9",
      dark: "#00a896",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
    success: {
      main: "#4caf50",
      light: "#80e27e",
      dark: "#087f23",
    },
    warning: {
      main: "#ff9800",
      light: "#ffc947",
      dark: "#c66900",
    },
    error: {
      main: "#f44336",
      light: "#ff7961",
      dark: "#ba000d",
    },
  },
  typography: {
    fontFamily: ["Inter", "Poppins", "DM Sans", "Roboto", "sans-serif"].join(
      ",",
    ),
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "4px 8px",
        },
      },
    },
  },
  shadows: [
    "none",
    "0px 2px 4px -1px rgba(0,0,0,0.08),0px 4px 5px 0px rgba(0,0,0,0.08),0px 1px 10px 0px rgba(0,0,0,0.08)",
    "0px 3px 5px -1px rgba(0,0,0,0.08),0px 5px 8px 0px rgba(0,0,0,0.08),0px 1px 14px 0px rgba(0,0,0,0.08)",
    "0px 3px 5px -1px rgba(0,0,0,0.08),0px 6px 10px 0px rgba(0,0,0,0.08),0px 1px 18px 0px rgba(0,0,0,0.08)",
    "0px 2px 4px -1px rgba(0,0,0,0.08),0px 4px 5px 0px rgba(0,0,0,0.08),0px 1px 10px 0px rgba(0,0,0,0.08)",
    "0px 3px 5px -1px rgba(0,0,0,0.08),0px 5px 8px 0px rgba(0,0,0,0.08),0px 1px 14px 0px rgba(0,0,0,0.08)",
    "0px 3px 5px -1px rgba(0,0,0,0.08),0px 6px 10px 0px rgba(0,0,0,0.08),0px 1px 18px 0px rgba(0,0,0,0.08)",
    "0px 4px 5px -2px rgba(0,0,0,0.08),0px 7px 10px 1px rgba(0,0,0,0.08),0px 2px 16px 1px rgba(0,0,0,0.08)",
    "0px 5px 5px -3px rgba(0,0,0,0.08),0px 8px 10px 1px rgba(0,0,0,0.08),0px 3px 14px 2px rgba(0,0,0,0.08)",
    "0px 5px 6px -3px rgba(0,0,0,0.08),0px 9px 12px 1px rgba(0,0,0,0.08),0px 3px 16px 2px rgba(0,0,0,0.08)",
    "0px 6px 6px -3px rgba(0,0,0,0.08),0px 10px 14px 1px rgba(0,0,0,0.08),0px 4px 18px 3px rgba(0,0,0,0.08)",
    "0px 6px 7px -4px rgba(0,0,0,0.08),0px 11px 15px 1px rgba(0,0,0,0.08),0px 4px 20px 3px rgba(0,0,0,0.08)",
    "0px 7px 8px -4px rgba(0,0,0,0.08),0px 12px 17px 2px rgba(0,0,0,0.08),0px 5px 22px 4px rgba(0,0,0,0.08)",
    "0px 7px 8px -4px rgba(0,0,0,0.08),0px 13px 19px 2px rgba(0,0,0,0.08),0px 5px 24px 4px rgba(0,0,0,0.08)",
    "0px 7px 9px -4px rgba(0,0,0,0.08),0px 14px 21px 2px rgba(0,0,0,0.08),0px 5px 26px 4px rgba(0,0,0,0.08)",
    "0px 8px 9px -5px rgba(0,0,0,0.08),0px 15px 22px 2px rgba(0,0,0,0.08),0px 6px 28px 5px rgba(0,0,0,0.08)",
    "0px 8px 10px -5px rgba(0,0,0,0.08),0px 16px 24px 2px rgba(0,0,0,0.08),0px 6px 30px 5px rgba(0,0,0,0.08)",
    "0px 8px 11px -5px rgba(0,0,0,0.08),0px 17px 26px 2px rgba(0,0,0,0.08),0px 6px 32px 5px rgba(0,0,0,0.08)",
    "0px 9px 11px -5px rgba(0,0,0,0.08),0px 18px 28px 2px rgba(0,0,0,0.08),0px 7px 34px 6px rgba(0,0,0,0.08)",
    "0px 9px 12px -6px rgba(0,0,0,0.08),0px 19px 29px 2px rgba(0,0,0,0.08),0px 7px 36px 6px rgba(0,0,0,0.08)",
    "0px 10px 13px -6px rgba(0,0,0,0.08),0px 20px 31px 3px rgba(0,0,0,0.08),0px 8px 38px 7px rgba(0,0,0,0.08)",
    "0px 10px 13px -6px rgba(0,0,0,0.08),0px 21px 33px 3px rgba(0,0,0,0.08),0px 8px 40px 7px rgba(0,0,0,0.08)",
    "0px 10px 14px -6px rgba(0,0,0,0.08),0px 22px 35px 3px rgba(0,0,0,0.08),0px 8px 42px 7px rgba(0,0,0,0.08)",
    "0px 11px 14px -7px rgba(0,0,0,0.08),0px 23px 36px 3px rgba(0,0,0,0.08),0px 9px 44px 8px rgba(0,0,0,0.08)",
  ],
});

// Admin + partner (franchise) panel only. Extends the site theme so the
// public marketing pages keep their current look.
const portalTheme = createTheme(theme, {
  typography: {
    fontFamily: ["Poppins", "Roboto", "Helvetica", "Arial", "sans-serif"].join(
      ",",
    ),
    h4: { fontSize: "1.75rem", lineHeight: 1.25 },
    h5: { fontSize: "1.375rem", lineHeight: 1.3 },
    h6: { fontSize: "1.125rem", lineHeight: 1.35 },
    subtitle2: { fontWeight: 600 },
    body2: { fontSize: "0.875rem", lineHeight: 1.5 },
    button: { textTransform: "none", fontWeight: 500, letterSpacing: 0 },
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { borderRadius: 12, border: "1px solid #e0e0e0" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, minHeight: 36 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8, backgroundColor: "#ffffff" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, borderRadius: 8 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 12 },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontWeight: 600, paddingTop: 20 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: "#757575",
          backgroundColor: "#f8f9fa",
          whiteSpace: "nowrap",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": { backgroundColor: "rgba(98, 0, 234, 0.04)" },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { height: 3, borderRadius: 3 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500 },
      },
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AnalyticsTracker />
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/credit-check" element={<CreditCheckPage />} />
            <Route path="/emi-calculator" element={<EmiCalculatorPage />} />
            <Route path="/ifsc-finder" element={<IfscFinder />} />
            <Route
              path="/credit-score-repair"
              element={<CreditScoreRepairPage />}
            />
            <Route
              path="/franchise-opportunity"
              element={<FranchiseOpportunityPage />}
            />
            <Route path="/apply-for-loan" element={<ApplyForLoanPage />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditionsPage />}
            />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/suvidha-centre" element={<SuvidhaCentrePage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route
              path="/franchise/*"
              element={
                <ThemeProvider theme={portalTheme}>
                  <ProtectedRoute allowedRoles={["franchise_user", "admin"]}>
                    <FranchiseRoutes />
                  </ProtectedRoute>
                </ThemeProvider>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ThemeProvider theme={portalTheme}>
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminRoutes />
                  </ProtectedRoute>
                </ThemeProvider>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
