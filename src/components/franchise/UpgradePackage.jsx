import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import {
  CheckCircle,
  ArrowBack,
} from "@mui/icons-material";
import { franchiseAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const UpgradePackage = () => {
  const navigate = useNavigate();
  const [purchasedPackage, setPurchasedPackage] = useState(null);
  const [assignedPackages, setAssignedPackages] = useState([]);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  // Load Razorpay script
  useEffect(() => {
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

    loadRazorpayScript();
  }, []);

  // Fetch package data and filter for upgradeable packages
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch transactions to check purchased package
        const transactionsResponse = await franchiseAPI.getTransactions();
        const paidTransactions = transactionsResponse.data.filter(
          (tx) => tx.status === "paid",
        );
        const latestTransaction =
          paidTransactions.length > 0 ? paidTransactions[0] : null;

        let curPurchased = null;
        if (latestTransaction && latestTransaction.packageId) {
          curPurchased = {
            name: latestTransaction.packageId.name,
            credits: latestTransaction.packageId.creditsIncluded || 0,
            price: latestTransaction.packageId.price || 0,
            purchaseDate: latestTransaction.createdAt,
            sortOrder: latestTransaction.packageId.sortOrder || 0,
          };
          setPurchasedPackage(curPurchased);
        }

        // 2. Fetch dashboard stats to check assigned packages
        const dashboardResponse = await franchiseAPI.getDashboardStats();
        let curAssigned = [];
        if (
          dashboardResponse.data.franchise.assignedPackages &&
          dashboardResponse.data.franchise.assignedPackages.length > 0
        ) {
          curAssigned = dashboardResponse.data.franchise.assignedPackages;
          setAssignedPackages(curAssigned);
        }

        // 3. Fetch all packages
        const packagesResponse = await franchiseAPI.getCreditPackages();

        // 4. Filter packages with higher price (higher tier) than current package
        let filteredPackages = [];
        if (curPurchased) {
          filteredPackages = packagesResponse.data.filter((pkg) => {
            return pkg.price > (curPurchased.price || 0);
          });
        } else if (curAssigned.length > 0) {
          const highestCredits = Math.max(
            ...curAssigned.map((pkg) => pkg.creditsIncluded || 0),
          );
          filteredPackages = packagesResponse.data.filter((pkg) => {
            return (
              pkg.creditsIncluded > highestCredits ||
              pkg.creditsIncluded === "Unlimited"
            );
          });
        } else {
          // If no package is assigned or purchased, show all packages
          filteredPackages = packagesResponse.data;
        }

        // Sort packages by price in ascending order
        const sortedPackages = [...filteredPackages].sort(
          (a, b) => a.price - b.price,
        );
        setAvailablePackages(sortedPackages);

        if (sortedPackages.length === 0) {
          setError("No upgrade packages available at this time.");
        }
      } catch (err) {
        console.error("Error loading packages:", err);
        setError("Failed to load upgrade packages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle package selection and initiate payment
  const handlePackageSelection = async (pkg) => {
    try {
      setUpgradeLoading(true);
      setError("");

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error("Payment gateway not loaded. Please try again.");
      }

      // Create order on backend
      const response = await franchiseAPI.initiatePayment(pkg._id);
      const { orderId } = response.data;

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: pkg.price * 100,
        currency: "INR",
        name: "Credit Dost",
        description: `Upgrade to ${pkg.name} package`,
        order_id: orderId,
        handler: function (response) {
          // Payment successful - verify payment with backend
          verifyPayment(response);
        },
        prefill: {
          // You can add user details here if available
        },
        notes: {
          packageId: pkg._id,
          packageName: pkg.name,
        },
        theme: {
          color: "#6200ea",
        },
        modal: {
          ondismiss: function () {
            setUpgradeLoading(false);
            setError("Payment cancelled by user.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        setUpgradeLoading(false);
        setError(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err) {
      console.error("Error initiating payment:", err);
      setError(
        err.message || "Failed to initiate payment. Please try again.",
      );
      setUpgradeLoading(false);
    }
  };

  // Function to verify payment with backend
  const verifyPayment = async (response) => {
    try {
      setUpgradeLoading(true);

      // Verify payment with backend
      await franchiseAPI.verifyPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });

      // Payment verified successfully
      alert("Payment successful! Your package has been upgraded.");
      navigate("/franchise");
    } catch (err) {
      console.error("Error verifying payment:", err);
      setError("Payment verification failed. Please contact support.");
    } finally {
      setUpgradeLoading(false);
    }
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, py: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        {/* <IconButton onClick={() => navigate("/franchise")} sx={{ bgcolor: "background.paper", boxShadow: 1 }}>
          <ArrowBack />
        </IconButton> */}
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.75rem", sm: "2.25rem" },
            fontWeight: 800,
            color: "primary.main",
          }}
        >
          Upgrade Your Package
        </Typography>
      </Box>

      <Typography
        variant="body1"
        sx={{
          mb: 4,
          color: "text.secondary",
          fontSize: { xs: "0.95rem", sm: "1rem" },
        }}
      >
        Choose a plan below to upgrade your credit package and access premium features.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress size={45} />
          <Typography sx={{ mt: 2, color: "text.secondary" }}>Loading upgrade packages...</Typography>
        </Box>
      ) : (
        <>
          {availablePackages.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6, bgcolor: "background.paper", borderRadius: 3, boxShadow: 1 }}>
              <Typography color="text.secondary">
                No upgrade packages available at this time.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {availablePackages.map((pkg) => {
                // Gold card is temporarily disabled in UI (see commented-out block above)
                if (pkg.name === "Gold") return null;

                const basePrice = pkg.price;
                const gst = pkg.gstPercentage || 0;
                const gstAmount = (basePrice * gst) / 100;
                const totalAmount = basePrice + gstAmount;
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={pkg._id}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 4,
                        border:
                          selectedPackage?._id === pkg._id
                            ? "2px solid #6200ea"
                            : "1px solid #e0e0e0",
                        boxShadow:
                          selectedPackage?._id === pkg._id
                            ? "0 8px 20px rgba(98,0,234,0.18)"
                            : "0 4px 10px rgba(0,0,0,0.08)",
                        transition: "0.3s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
                        },
                      }}
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          p: { xs: 2.5, sm: 3.5 },
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          gutterBottom
                        >
                          {pkg.name}
                        </Typography>
                        <Box 
                          sx={{ 
                            mb: 2, 
                            minHeight: 45,
                            pl: 1.5,
                            borderLeft: "3px solid",
                            display: "flex",
                            alignItems: "center",
                            "@keyframes darkPulse": {
                              "0%, 100%": { 
                                borderColor: "#6200ea",
                                color: "#6200ea"
                              },
                              "50%": { 
                                borderColor: "#1a0033",
                                color: "#1a0033"
                              }
                            },
                            animation: "darkPulse 1.5s ease-in-out infinite",
                            "@media (prefers-reduced-motion: reduce)": {
                              animation: "none",
                              borderColor: "primary.main",
                              color: "primary.main"
                            }
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "inherit",
                              fontWeight: "600",
                              lineHeight: 1.4
                            }}
                          >
                            {pkg.description ? pkg.description.replace(new RegExp(`^${pkg.name}\\s+Package\\s*[-–—]\\s*`, 'i'), '') : ""}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            textAlign: "center",
                            py: 2,
                            mb: 2,
                            borderRadius: 3,
                            bgcolor: "#f8f5ff",
                          }}
                        >
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            color="primary.main"
                          >
                            ₹{basePrice}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            + GST ({gst}%) = ₹{gstAmount}
                          </Typography>

                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="success.main"
                          >
                            Total: ₹{totalAmount}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {pkg.creditsIncluded} credits included
                          </Typography>
                        </Box>
                        <List dense>
                          {pkg.features?.map((feature, index) => (
                            <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 26 }}>
                                <CheckCircle
                                  sx={{ fontSize: 18 }}
                                  color="success"
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={feature}
                                primaryTypographyProps={{
                                  variant: "body2",
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          size="large"
                          sx={{
                            borderRadius: 3,
                            py: 1.2,
                            fontWeight: "bold",
                            textTransform: "none",
                          }}
                          disabled={upgradeLoading}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePackageSelection(pkg);
                          }}
                        >
                          {upgradeLoading &&
                          selectedPackage?._id === pkg._id ? (
                            <>
                              <CircularProgress
                                size={20}
                                sx={{ mr: 1, color: "#fff" }}
                              />
                              Processing...
                            </>
                          ) : (
                            "Select Package"
                          )}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default UpgradePackage;
