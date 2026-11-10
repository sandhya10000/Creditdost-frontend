import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import {
  CheckCircle,
  Star,
  WorkspacePremium,
  Diamond,
  EmojiEvents,
  ArrowForward,
  TrendingUp,
} from "@mui/icons-material";
import { franchiseAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const PURPLE = "#6200ea";
const DEEP_PURPLE = "#2d0a6e";
const RECOMMENDED_NAME = "Platinum";

// Icon per tier name; falls back to a generic badge for unknown tiers
const TIER_ICONS = {
  Silver: EmojiEvents,
  Platinum: WorkspacePremium,
  Diamond: Diamond,
};

const UpgradePackage = () => {
  const navigate = useNavigate();
  const [purchasedPackage, setPurchasedPackage] = useState(null);
  const [assignedPackages, setAssignedPackages] = useState([]);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

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
      setProcessingId(pkg._id);
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
          color: PURPLE,
        },
        modal: {
          ondismiss: function () {
            setUpgradeLoading(false);
            setProcessingId(null);
            setError("Payment cancelled by user.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        setUpgradeLoading(false);
        setProcessingId(null);
        setError(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err) {
      console.error("Error initiating payment:", err);
      setError(
        err.message || "Failed to initiate payment. Please try again.",
      );
      setUpgradeLoading(false);
      setProcessingId(null);
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
      setProcessingId(null);
    }
  };

  // Gold is temporarily hidden from the UI
  const visiblePackages = useMemo(
    () => availablePackages.filter((pkg) => pkg.name !== "Gold"),
    [availablePackages],
  );

  const currentName =
    purchasedPackage?.name ||
    assignedPackages
      .map((p) => p.name)
      .filter(Boolean)
      .join(", ");

  return (
    <Box
      sx={{
        minHeight: "100%",
        px: { xs: 1.5, sm: 3 },
        py: { xs: 2.5, sm: 4 },
        borderRadius: 4,
        background:
          "linear-gradient(160deg, #f7f4ff 0%, #ffffff 55%, #efe9ff 100%)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Chip
            icon={<WorkspacePremium sx={{ fontSize: 18, color: "#fff !important" }} />}
            label="Choose Your Plan"
            sx={{
              mb: 2,
              bgcolor: PURPLE,
              color: "#fff",
              fontWeight: 700,
              px: 0.5,
              boxShadow: "0 6px 16px rgba(98,0,234,0.25)",
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "1.9rem", sm: "2.6rem" },
              fontWeight: 800,
              color: DEEP_PURPLE,
              lineHeight: 1.15,
            }}
          >
            Upgrade Your Package
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 1, color: "text.secondary", fontSize: { xs: "0.95rem", sm: "1.05rem" } }}
          >
            Unlock more features and take your business to the next level.
          </Typography>
        </Box>

        {currentName && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              px: 2,
              py: 1,
              borderRadius: 10,
              bgcolor: "#fff",
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              Current Plan:
            </Typography>
            <Chip
              label={currentName}
              size="small"
              sx={{ bgcolor: PURPLE, color: "#fff", fontWeight: 700 }}
            />
          </Box>
        )}
      </Box>

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
          <Typography sx={{ mt: 2, color: "text.secondary" }}>
            Loading upgrade packages...
          </Typography>
        </Box>
      ) : visiblePackages.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: 1,
          }}
        >
          <Typography color="text.secondary">
            No upgrade packages available at this time.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {visiblePackages.map((pkg) => {
            const isRecommended = pkg.name === RECOMMENDED_NAME;
            const isCurrent = purchasedPackage?.name === pkg.name;
            const gst = pkg.gstPercentage || 0;
            const gstAmount = (pkg.price * gst) / 100;
            const totalAmount = pkg.price + gstAmount;
            const isProcessing = upgradeLoading && processingId === pkg._id;
            const TierIcon = TIER_ICONS[pkg.name] || TrendingUp;
            const savings =
              pkg.originalPrice && pkg.originalPrice > pkg.price
                ? Math.round(
                    ((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100,
                  )
                : null;
            const description = pkg.description
              ? pkg.description.replace(
                  new RegExp(`^${pkg.name}\\s+Package\\s*[-–—]\\s*`, "i"),
                  "",
                )
              : "";

            return (
              <Grid item xs={12} sm={6} md={5} lg={4} key={pkg._id}>
                <Card
                  sx={{
                    position: "relative",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    overflow: "visible",
                    bgcolor: "#fff",
                    border: isRecommended
                      ? `2px solid ${PURPLE}`
                      : "1px solid rgba(98,0,234,0.12)",
                    boxShadow: isRecommended
                      ? "0 16px 40px rgba(98,0,234,0.2)"
                      : "0 8px 24px rgba(0,0,0,0.06)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 18px 40px rgba(98,0,234,0.16)",
                    },
                  }}
                >
                  {isRecommended && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.6,
                        px: 1.4,
                        py: 0.5,
                        borderRadius: 10,
                        bgcolor: PURPLE,
                        color: "#fff",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      <Star sx={{ fontSize: 15 }} /> Recommended
                    </Box>
                  )}

                  <Box sx={{ p: { xs: 2.5, sm: 3.5 }, pb: 2 }}>
                    <Box sx={{ display: "flex", gap: 2.5, alignItems: "center", mb: 2.5, pt: isRecommended ? 3 : 0 }}>
                      <Box
                        sx={{
                          width: 92,
                          height: 92,
                          flexShrink: 0,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "radial-gradient(circle at 30% 30%, #ffffff 0%, #ece6ff 60%, #d9ccff 100%)",
                          boxShadow: "inset 0 -6px 14px rgba(98,0,234,0.12)",
                        }}
                      >
                        <TierIcon sx={{ fontSize: 46, color: PURPLE }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h5" fontWeight={800} color={DEEP_PURPLE}>
                          {pkg.name}
                        </Typography>
                        {description && (
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary", lineHeight: 1.45, mt: 0.5 }}
                          >
                            {description}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 1.2 }}>
                      <Typography
                        sx={{ fontSize: { xs: "2rem", sm: "2.3rem" }, fontWeight: 800, color: DEEP_PURPLE, lineHeight: 1 }}
                      >
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </Typography>
                      {pkg.originalPrice > pkg.price && (
                        <Typography
                          sx={{ color: "text.disabled", textDecoration: "line-through", fontWeight: 600 }}
                        >
                          ₹{pkg.originalPrice.toLocaleString("en-IN")}
                        </Typography>
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8 }}>
                      + GST ({gst}%) = ₹{totalAmount.toLocaleString("en-IN")} total
                    </Typography>

                    {savings !== null && (
                      <Chip
                        icon={<TrendingUp sx={{ fontSize: 16, color: "#2e7d32 !important" }} />}
                        label={`${savings}% Savings`}
                        size="small"
                        sx={{ mt: 1.5, bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 700 }}
                      />
                    )}
                  </Box>

                  <Box sx={{ borderTop: "1px solid #eee", mx: { xs: 2.5, sm: 3.5 } }} />

                  <Box sx={{ p: { xs: 2.5, sm: 3.5 }, pt: 2.5, flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1.5 }}>
                      <CheckCircle sx={{ fontSize: 20, color: PURPLE }} />
                      <Typography variant="body2" fontWeight={600}>
                        {Number(pkg.creditsIncluded) === 1000000 ||
                        pkg.creditsIncluded === "Unlimited"
                          ? "Unlimited Credits"
                          : `${pkg.creditsIncluded} credits included`}
                      </Typography>
                    </Box>
                    {pkg.features?.map((feature, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "flex-start", gap: 1.2, mb: 1.1 }}
                      >
                        <CheckCircle sx={{ fontSize: 20, color: PURPLE, mt: "1px" }} />
                        <Typography variant="body2" sx={{ lineHeight: 1.45 }}>
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ p: { xs: 2.5, sm: 3.5 }, pt: 0 }}>
                    <Button
                      fullWidth
                      size="large"
                      disabled={upgradeLoading || isCurrent}
                      onClick={() => handlePackageSelection(pkg)}
                      endIcon={!isProcessing && !isCurrent ? <ArrowForward /> : null}
                      variant={isRecommended ? "contained" : "outlined"}
                      sx={{
                        py: 1.4,
                        borderRadius: 3,
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "1rem",
                        ...(isRecommended
                          ? {
                              background: `linear-gradient(90deg, ${PURPLE} 0%, #8e2de2 100%)`,
                              boxShadow: "0 10px 24px rgba(98,0,234,0.3)",
                              "&:hover": { background: "linear-gradient(90deg, #5000c8 0%, #7b1fd1 100%)" },
                            }
                          : {
                              borderWidth: 2,
                              borderColor: PURPLE,
                              color: PURPLE,
                              "&:hover": { borderWidth: 2, borderColor: PURPLE, bgcolor: "#f3e8ff" },
                            }),
                      }}
                    >
                      {isProcessing ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1, color: "inherit" }} />
                          Processing...
                        </>
                      ) : isCurrent ? (
                        "Current Plan"
                      ) : (
                        `Upgrade to ${pkg.name}`
                      )}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default UpgradePackage;
