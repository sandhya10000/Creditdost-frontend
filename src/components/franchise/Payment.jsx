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
    if (!pkg) {
      navigate("/franchise/packages");
    }
  }, [pkg, navigate]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Create order on backend
      const response = await api.post("/payments/create-order", {
        packageId: pkg._id,
        amount: totalPrice, // Use total price including GST
      });
      
      const { orderId } = response.data;
      
      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalPrice * 100, // Use total price in paise
        currency: "INR",
        name: "Credit Dost",
        description: `Purchase of ${pkg.name} package`,
        order_id: orderId,
        handler: function (response) {
          // Payment successful
          handlePaymentSuccess(response);
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999"
        },
        notes: {
          packageId: pkg._id,
          packageName: pkg.name
        },
        theme: {
          color: "#6200ea"
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError("Failed to initiate payment. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };
 
  const handlePaymentSuccess = async (response) => {
    try {
      // Show processing message
      setLoading(true);  
      
      // Show toast notification that payment is being processed
      setToast({
        open: true,
        message: "Payment successful! Processing your order...",
        severity: "info"
      });

      // Verify payment on backend
      await api.post("/payments/verify-payment", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      });
      
      // Move to success step
      setActiveStep(2);
      
      // Show success toast notification
      setToast({
        open: true,
        message: "Payment processed successfully! Your credits have been added to your account.",
        severity: "success"
      });
    } catch (err) {
      setError("Payment verification failed. Please contact support.");
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
    return null;
  }

  const steps = [
    {
      label: "Review Package",
      description: `You've selected the ${pkg.name} package for ₹${totalPrice}`
    },
    {
      label: "Make Payment",
      description: "Complete your payment using Razorpay"
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