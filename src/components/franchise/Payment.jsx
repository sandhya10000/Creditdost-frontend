import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Snackbar, // Add Snackbar for toast notifications
  Alert as MuiAlert, // Rename to avoid conflict
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api"; // Use the configured API instance instead of raw axios
import { openCashfreeCheckout, useCashfreeReturn } from "../../utils/cashfree";

// Toast notification component
const ToastAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" }); // Toast state
  const pkg = location.state?.package;
  // Set when Cashfree redirected back here (?cf_order_id=...); location.state may be gone then
  const [returning] = useState(() =>
    new URLSearchParams(location.search).has("cf_order_id"),
  );
  const [returnStatus, setReturnStatus] = useState("verifying"); // verifying | success | error

  // Calculate total price with GST
  const totalPrice = pkg ? Number(pkg.price) + (Number(pkg.price) * (pkg.gstPercentage || 0) / 100) : 0;

  // Handle toast close
  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

  useEffect(() => {
    if (!pkg && !returning) {
      navigate("/franchise/packages");
    }
  }, [pkg, returning, navigate]);

  // Redirect-based payment methods come back with ?cf_order_id=...
  useCashfreeReturn((orderId) => handlePaymentSuccess(orderId));

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Create order on backend (amount incl. GST is computed server-side)
      const response = await api.post("/payments/create-order", {
        packageId: pkg._id,
        returnPath: "/franchise/payment",
      });

      const { orderId, paymentSessionId } = response.data;

      const result = await openCashfreeCheckout(paymentSessionId);
      if (result.status !== "done") {
        setError(result.message);
        return;
      }
      await handlePaymentSuccess(orderId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initiate payment. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };
 
  const handlePaymentSuccess = async (orderId) => {
    try {
      // Show processing message
      setLoading(true);  
      
      // Show toast notification that payment is being processed
      setToast({
        open: true,
        message: "Payment successful! Processing your order...",
        severity: "info"
      });

      // Verify payment on backend (backend checks the order with Cashfree)
      await api.post("/payments/verify-payment", { orderId });

      // Move to success step
      setActiveStep(2);
      setReturnStatus("success");

      // Show success toast notification
      setToast({
        open: true,
        message: "Payment processed successfully! Your credits have been added to your account.",
        severity: "success"
      });
    } catch (err) {
      setReturnStatus("error");
      setError(
        err.response?.data?.message === "Payment not completed"
          ? "Payment was not completed. If money was deducted, it will update automatically within a few minutes."
          : "Payment verification failed. Please contact support.",
      );
      console.error("Payment verification error:", err);

      // Show error toast notification
      setToast({
        open: true,
        message: "Payment verification failed. Please contact support.",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    // Redirect to dashboard after successful payment
    navigate("/franchise/dashboard");
  };

  if (!pkg) {
    if (!returning) return null;
    // Back from a Cashfree redirect: the package details are no longer in router state
    return (
      <Container maxWidth="sm" sx={{ py: 6, textAlign: "center" }}>
        {returnStatus === "verifying" && (
          <>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">Confirming your payment...</Typography>
          </>
        )}
        {returnStatus === "success" && (
          <Alert severity="success" sx={{ mb: 2, textAlign: "left" }}>
            Your payment has been processed successfully! Your credits have been added to your account.
          </Alert>
        )}
        {returnStatus === "error" && (
          <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
            {error}
          </Alert>
        )}
        {returnStatus !== "verifying" && (
          <Button variant="contained" onClick={handleContinue}>
            Continue to Dashboard
          </Button>
        )}
      </Container>
    );
  }

  const steps = [
    {
      label: "Review Package",
      description: `You've selected the ${pkg.name} package for ₹${totalPrice}`
    },
    {
      label: "Make Payment",
      description: "Complete your payment securely via Cashfree"
    },
    {
      label: "Confirmation",
      description: "Your payment has been processed successfully"
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Complete Your Purchase
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Follow the steps below to complete your package purchase
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label} completed={index < activeStep}>
                <StepLabel>
                  <Typography variant="h6">{step.label}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography sx={{ mb: 2 }}>{step.description}</Typography>
                  
                  {index === 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h5" fontWeight="bold" color="primary.main">
                            {pkg.name}
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            {pkg.description}
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="h4" component="div" fontWeight="bold">
                              ₹{totalPrice}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {pkg.creditsIncluded} credits for {pkg.validityDays} days
                              {pkg.gstPercentage > 0 && (
                                <span> (₹{pkg.price} + {pkg.gstPercentage}% GST)</span>
                              )}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                      
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={() => setActiveStep(1)}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Continue
                        </Button>
                      </Box>
                    </Box>
                  )}
                  
                  {index === 1 && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handlePayment}
                        disabled={loading}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {loading ? (
                          <>
                            <CircularProgress size={24} sx={{ mr: 1 }} />
                            Processing...
                          </>
                        ) : (
                          "Pay Now"
                        )}
                      </Button>
                      <Button
                        onClick={() => setActiveStep(0)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </Box>
                  )}
                  
                  {index === 2 && (
                    <Box sx={{ mt: 2 }}>
                      <Alert severity="success" sx={{ mb: 2 }}>
                        Your payment has been processed successfully! Your {pkg.creditsIncluded} credits 
                        have been added to your account.
                      </Alert>
                      <Button
                        variant="contained"
                        onClick={handleContinue}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Continue to Dashboard
                      </Button>
                    </Box>
                  )}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <ToastAlert
          onClose={handleToastClose}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </ToastAlert>
      </Snackbar>
    </Container>
  );
};

export default Payment;