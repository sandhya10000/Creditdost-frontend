import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Chip,
} from "@mui/material";
import {
  Lock,
  Payment,
  ArrowUpward,
  CheckCircle,
  FiberManualRecord,
  CalendarMonth,
  CurrencyRupee,
  Description,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { franchiseAPI } from "../../services/api";

const PURPLE = "#6200ea";

const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const WhiteLabelReports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", mobile: "" });

  const fetchStatus = async () => {
    try {
      const res = await franchiseAPI.getWhiteLabelStatus();
      setStatus(res.data);
    } catch (err) {
      console.error("Failed to load White Label status:", err);
      setError("Could not load White Label Reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRazorpayScript();
    fetchStatus();
  }, []);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const verifyPayment = async (response) => {
    try {
      await franchiseAPI.verifyWhiteLabelPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });
      await fetchStatus();
    } catch (err) {
      console.error("White label verify error:", err);
      setError(
        err.response?.data?.message ||
          "Payment verification failed. Please contact support.",
      );
    } finally {
      setPaying(false);
    }
  };

  const handlePayment = async () => {
    if (!contact.name.trim() || !contact.email.trim() || !contact.mobile.trim()) {
      setError("Please enter your name, email and mobile number.");
      return;
    }
    try {
      setPaying(true);
      setError("");

      const scriptReady = await loadRazorpayScript();
      if (!scriptReady || !window.Razorpay) {
        throw new Error("Payment gateway not loaded. Please try again.");
      }

      const res = await franchiseAPI.createWhiteLabelOrder({
        name: contact.name.trim(),
        email: contact.email.trim(),
        mobile: contact.mobile.trim(),
      });
      const { orderId, keyId, amount, currency, prefill } = res.data;

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: "Credit Dost",
        description: "White Label Reports",
        order_id: orderId,
        prefill,
        theme: { color: PURPLE },
        handler: (response) => verifyPayment(response),
        modal: {
          ondismiss: () => {
            setPaying(false);
            setError("Payment cancelled.");
          },
        },
      });
      rzp.on("payment.failed", (response) => {
        setPaying(false);
        setError(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      console.error("White label payment error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to start payment. Please try again.",
      );
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const paid = status?.request;
  const eligible = status?.eligible;

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, py: { xs: 2, sm: 3 }, maxWidth: 900 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 3 }}>
        <Box sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: "#ede7ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Description sx={{ fontSize: 32, color: PURPLE }} />
        </Box>
        <Box>
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: "1.75rem", sm: "2.1rem" }, fontWeight: 800, color: "#1e1148", lineHeight: 1.2 }}
          >
            White Label Reports
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mt: 0.5 }}>
            Get reports under your own brand. One-time payment of ₹{(status?.price || 10000).toLocaleString("en-IN")}.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
          {paid ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, sm: 4 }, flexDirection: { xs: "column", sm: "row" }, textAlign: { xs: "center", sm: "left" } }}>
              <Box sx={{ position: "relative", width: 150, height: 150, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box sx={{ position: "absolute", inset: 0, borderRadius: "50%", bgcolor: "#e8f8ef" }} />
                <Box sx={{ position: "absolute", inset: 22, borderRadius: "50%", bgcolor: "#d0f2de" }} />
                <Box sx={{ position: "relative", width: 76, height: 76, borderRadius: "50%", bgcolor: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(22,163,74,0.35)" }}>
                  <CheckCircle sx={{ fontSize: 46, color: "#fff" }} />
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", justifyContent: { xs: "center", sm: "flex-start" } }}>
                  <Typography variant="h5" fontWeight={800} color="#1e1148">
                    White Label Reports Active
                  </Typography>
                  <Chip
                    icon={<FiberManualRecord sx={{ fontSize: 10, color: "#16a34a !important" }} />}
                    label="Active"
                    size="small"
                    sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 700 }}
                  />
                </Box>
                <Typography variant="body1" sx={{ mt: 1 }} color="text.secondary">
                  Request ID: <strong style={{ color: PURPLE }}>{paid.requestId}</strong>
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1, flexWrap: "wrap", justifyContent: { xs: "center", sm: "flex-start" }, color: "text.secondary" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <CalendarMonth sx={{ fontSize: 18 }} />
                    Paid on {new Date(paid.updatedAt || paid.createdAt).toLocaleDateString("en-IN")}
                  </Box>
                  <Typography color="divider">|</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <CurrencyRupee sx={{ fontSize: 18 }} />
                    ₹{(paid.amount || status?.price || 10000).toLocaleString("en-IN")}
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : eligible ? (
            <>
              <Payment sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
              <Typography variant="h5" fontWeight={800} gutterBottom>
                ₹{(status?.price || 10000).toLocaleString("en-IN")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter your contact details, then pay with Razorpay.
              </Typography>

              <Box sx={{ display: "grid", gap: 2, textAlign: "left", mb: 3 }}>
                <TextField label="Full Name" name="name" value={contact.name} onChange={handleContactChange} required fullWidth />
                <TextField label="Email" name="email" type="email" value={contact.email} onChange={handleContactChange} required fullWidth />
                <TextField
                  label="Mobile Number"
                  name="mobile"
                  value={contact.mobile}
                  onChange={handleContactChange}
                  inputProps={{ maxLength: 15 }}
                  helperText="10-digit mobile number"
                  required
                  fullWidth
                />
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={handlePayment}
                disabled={paying}
                sx={{ borderRadius: 3, px: 4, py: 1.2, fontWeight: 700, textTransform: "none" }}
              >
                {paying ? (
                  <>
                    <CircularProgress size={18} sx={{ mr: 1, color: "inherit" }} />
                    Processing...
                  </>
                ) : (
                  "Pay with Razorpay"
                )}
              </Button>
            </>
          ) : (
            <>
              <Lock sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
              <Typography variant="h6" fontWeight={700} gutterBottom>
                This service is only applicable for higher packages
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                White Label Reports are available for Platinum and Diamond partners.
              </Typography>
              <Button
                variant="contained"
                startIcon={<ArrowUpward />}
                onClick={() => navigate("/franchise/upgrade-package")}
                sx={{ borderRadius: 3, px: 4, py: 1.2, fontWeight: 700, textTransform: "none" }}
              >
                Upgrade Now
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default WhiteLabelReports;
