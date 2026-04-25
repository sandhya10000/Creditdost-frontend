import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  styled,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar, // Add Snackbar for toast notifications
  Alert as MuiAlert, // Rename to avoid conflict
} from "@mui/material";
import {
  Check as CheckIcon,
  CreditScore as CreditScoreIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import axios from "axios";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Header from "./homepage/Header";
import HomePageFooter from "./homepage/HomePageFooter";
import { useAuth } from "../hooks/useAuth";

// Toast notification component
const ToastAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Styled components for enhanced UI
const GradientHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: "white",
  padding: theme.spacing(6, 0),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
}));

const PackageCard = styled(Card)(({ theme, popular }) => ({
  height: "100%",
  minWidth: "300px",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  borderRadius: theme.shape.borderRadius * 2,
  border: `2px solid ${
    popular ? theme.palette.primary.main : theme.palette.divider
  }`,
  position: "relative",
  overflow: "visible",
  boxShadow: theme.shadows[4],
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: theme.shadows[12],
    borderColor: theme.palette.primary.main,
  },
}));

const PackageHeader = styled(Box)(({ theme, popular }) => ({
  padding: theme.spacing(3, 2, 2),
  textAlign: "center",
  backgroundColor: popular
    ? theme.palette.primary.light
    : theme.palette.grey[50],
  position: "relative",
}));

const PriceDisplay = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end",
  margin: theme.spacing(2, 0),
  "& .currency": {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: theme.palette.primary.main,
  },
  "& .amount": {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: theme.palette.primary.main,
    lineHeight: 1,
  },
  "& .period": {
    fontSize: "1rem",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  },
}));

const FeatureItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  "& .MuiListItemIcon-root": {
    minWidth: 32,
  },
}));

const FeatureText = styled(ListItemText)(({ theme }) => ({
  "& .MuiListItemText-primary": {
    fontWeight: 500,
  },
  "& .MuiListItemText-secondary": {
    fontSize: "0.8rem",
  },
}));

const CtaButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 4px 12px rgba(98, 0, 234, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 6px 16px rgba(98, 0, 234, 0.3)",
    transform: "translateY(-2px)",
  },
}));

const BenefitCard = styled(Card)(({ theme }) => ({
  height: "100%",
  textAlign: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const PackagesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" }); // Toast state
  const navigate = useNavigate();
  const { user } = useAuth();

  // Handle toast close
  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL || "https://reactbackend.creditdost.co.in/api"
        }/packages`
      );
      setPackages(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load packages. Please try again later.");
      console.error("Error fetching packages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPackage = (pkg) => {
    const totalPrice = Number(pkg.price) + (Number(pkg.price) * (pkg.gstPercentage || 0) / 100);
    setSelectedPackage({
      ...pkg,
      totalPrice // Store total price for payment
    });
    setPaymentDialogOpen(true);
    setActiveStep(0);
    setPaymentError("");
  };

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      setPaymentError("");

      // If user is not logged in, redirect to login with selected package
      if (!user) {
        navigate("/login", { state: { selectedPackage } });
        return;
      }

      // Create order on backend
      const response = await api.post("/payments/create-order", {
        packageId: selectedPackage._id,
        amount: selectedPackage.totalPrice, // Use total price including GST
      });

      const { orderId } = response.data;

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: selectedPackage.totalPrice * 100, // Use total price in paise
        currency: "INR",
        name: "Credit Dost",
        description: `Purchase of ${selectedPackage.name} package`,
        order_id: orderId,
        handler: function (response) {
          // Payment successful
          handlePaymentSuccess(response);
        },
        prefill: {
          name: user.name || "User Name",
          email: user.email || "user@example.com",
        },
        notes: {
          packageId: selectedPackage._id,
          packageName: selectedPackage.name,
        },
        theme: {
          color: "#6200ea",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setPaymentError("Failed to initiate payment. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      // Show processing message
      setPaymentLoading(true);
      
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
        razorpay_signature: response.razorpay_signature,
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
      setPaymentError("Payment verification failed. Please contact support.");
      console.error("Payment verification error:", err);
      
      // Show error toast notification
      setToast({
        open: true,
        message: "Payment verification failed. Please contact support.",
        severity: "error"
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleContinue = () => {
    // Close dialog and redirect to dashboard
    setPaymentDialogOpen(false);
    if (user) {
      navigate("/franchise");
    } else {
      navigate("/login");
    }
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setSelectedPackage(null);
    setActiveStep(0);
    setPaymentError("");
  };

  const steps = [
    {
      label: "Review Package",
      description: selectedPackage
        ? `You've selected the ${selectedPackage.name} package for ₹${selectedPackage.totalPrice}`
        : "",
    },
    {
      label: "Make Payment",
      description: "Complete your payment using Razorpay",
    },
    {
      label: "Confirmation",
      description: "Your payment has been processed successfully",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      <Header />

      {/* Hero Section */}
      <GradientHeader>
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? "h3" : "h2"}
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Franchise Packages
          </Typography>
          <Typography
            variant="h6"
            sx={{ maxWidth: 600, mx: "auto", mb: 3, opacity: 0.9 }}
          >
            Choose the perfect package to grow your credit verification business
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: 800, mx: "auto", opacity: 0.8 }}
          >
            All packages include unlimited access to our platform, dedicated
            support, and regular updates. Select the package that best fits your
            business needs.
          </Typography>
        </Container>
      </GradientHeader>

      <Container sx={{ py: 6 }} style={{ maxWidth: "1400px" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
            <CircularProgress size={80} thickness={3} />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{ maxWidth: 600, mx: "auto", borderRadius: 2 }}
          >
            {error}
          </Alert>
        ) : packages.length === 0 ? (
          <Alert
            severity="info"
            sx={{ maxWidth: 600, mx: "auto", borderRadius: 2 }}
          >
            No packages available at the moment. Please check back later.
          </Alert>
        ) : (
          <>
            <Grid
              container
              spacing={4}
              sx={{ mb: 8 }}
              style={{ flexWrap: "nowrap" }}
            >
              {packages.map((pkg) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={pkg._id}
                  style={{ flex: "1" }}
                >
                  <PackageCard popular={pkg.mostPopular}>
                    {pkg.mostPopular && (
                      <Chip
                        icon={<StarIcon />}
                        label="Most Popular"
                        color="primary"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: -16,
                          right: 16,
                          fontWeight: "bold",
                          height: 32,
                          zIndex: 10,
                          boxShadow: 3,
                        }}
                      />
                    )}

                    <PackageHeader popular={pkg.mostPopular}>
                      <Typography
                        variant="h5"
                        component="h2"
                        fontWeight="bold"
                        color="primary.main"
                      >
                        {pkg.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {pkg.description}
                      </Typography>
                    </PackageHeader>

                    <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        <PriceDisplay>
                          <span className="currency">₹</span>
                          <span className="amount">{pkg.price}</span>
                          {pkg.gstPercentage > 0 && (
                            <span className="period" style={{ fontSize: '1rem', marginLeft: '8px' }}>
                              + {pkg.gstPercentage}% GST
                            </span>
                          )}
                        </PriceDisplay>
                        {pkg.gstPercentage > 0 && (
                          <Typography variant="body2" color="text.secondary" align="center">
                            Total: ₹{Number(pkg.price) + (Number(pkg.price) * pkg.gstPercentage / 100)}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ textAlign: "center", mb: 3 }}>
                        <Typography
                          variant="h4"
                          component="div"
                          fontWeight="bold"
                          color="primary.main"
                        >
                          {pkg.creditsIncluded}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Credit Reports
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <List disablePadding>
                        <FeatureItem>
                          <ListItemIcon>
                            <CheckIcon color="primary" />
                          </ListItemIcon>
                          <FeatureText
                            primary={`${pkg.creditsIncluded} Credit Checks`}
                            secondary="Valid for business use"
                          />
                        </FeatureItem>

                        {pkg.features &&
                          pkg.features.map((feature, index) => (
                            <FeatureItem key={index}>
                              <ListItemIcon>
                                <CheckIcon color="primary" />
                              </ListItemIcon>
                              <FeatureText primary={feature} />
                            </FeatureItem>
                          ))}
                      </List>
                    </CardContent>

                    <CardActions sx={{ justifyContent: "center", p: 3, pt: 0 }}>
                      <CtaButton
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={() => handleSelectPackage(pkg)}
                      >
                        Get Started
                      </CtaButton>
                    </CardActions>
                  </PackageCard>
                </Grid>
              ))}
            </Grid>

            {/* Features Section */}
            <Box sx={{ mb: 8, textAlign: "center" }}>
              <Typography
                variant="h3"
                gutterBottom
                fontWeight="bold"
                color="primary.main"
                sx={{ mb: 1 }}
              >
                Why Choose Our Packages?
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 6, maxWidth: 700, mx: "auto" }}
              >
                Everything you need to build and grow your credit verification
                business
              </Typography>

              <Grid container spacing={4} style={{ flexWrap: "nowrap" }}>
                <Grid item xs={12} md={4}>
                  <BenefitCard variant="outlined" sx={{ p: 4, height: "100%" }}>
                    <Box sx={{ color: "primary.main", mb: 2 }}>
                      <CreditScoreIcon sx={{ fontSize: 50 }} />
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Instant Credit Reports
                    </Typography>
                    <Typography color="text.secondary">
                      Get real-time credit reports from all major bureaus with
                      just a few clicks
                    </Typography>
                  </BenefitCard>
                </Grid>
                <Grid item xs={12} md={4}>
                  <BenefitCard variant="outlined" sx={{ p: 4, height: "100%" }}>
                    <Box sx={{ color: "primary.main", mb: 2 }}>
                      <TrendingUpIcon sx={{ fontSize: 50 }} />
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Business Growth
                    </Typography>
                    <Typography color="text.secondary">
                      Scale your business with our powerful tools and
                      comprehensive reporting
                    </Typography>
                  </BenefitCard>
                </Grid>
                <Grid item xs={12} md={4}>
                  <BenefitCard variant="outlined" sx={{ p: 4, height: "100%" }}>
                    <Box sx={{ color: "primary.main", mb: 2 }}>
                      <SecurityIcon sx={{ fontSize: 50 }} />
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Secure & Compliant
                    </Typography>
                    <Typography color="text.secondary">
                      Bank-level security with full compliance to data
                      protection regulations
                    </Typography>
                  </BenefitCard>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Container>

      {/* Payment Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={handleClosePaymentDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Complete Your Purchase</Typography>
            <IconButton onClick={handleClosePaymentDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {paymentError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {paymentError}
            </Alert>
          )}

          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label} completed={index < activeStep}>
                <StepLabel>
                  <Typography variant="h6">{step.label}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography sx={{ mb: 2 }}>{step.description}</Typography>

                  {index === 0 && selectedPackage && (
                    <Box sx={{ mt: 2 }}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            color="primary.main"
                          >
                            {selectedPackage.name}
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            {selectedPackage.description}
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="h4"
                              component="div"
                              fontWeight="bold"
                            >
                              ₹{selectedPackage.totalPrice}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedPackage.creditsIncluded} credits
                              {selectedPackage.gstPercentage > 0 && (
                                <span> (₹{selectedPackage.price} + {selectedPackage.gstPercentage}% GST)</span>
                              )}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>

                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => setActiveStep(1)}
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
                        disabled={paymentLoading}
                        sx={{ mr: 1 }}
                      >
                        {paymentLoading ? (
                          <>
                            <CircularProgress size={24} sx={{ mr: 1 }} />
                            Processing...
                          </>
                        ) : (
                          "Pay Now"
                        )}
                      </Button>
                      <Button onClick={() => setActiveStep(0)}>Back</Button>
                    </Box>
                  )}

                  {index === 2 && (
                    <Box sx={{ mt: 2 }}>
                      <Alert severity="success" sx={{ mb: 2 }}>
                        Your payment has been processed successfully! Your{" "}
                        {selectedPackage?.creditsIncluded} credits have been
                        added to your account.
                      </Alert>
                      <Button variant="contained" onClick={handleContinue}>
                        Continue
                      </Button>
                    </Box>
                  )}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Close</Button>
        </DialogActions>
      </Dialog>

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

      <HomePageFooter />
    </Box>
  );
};

export default PackagesPage;