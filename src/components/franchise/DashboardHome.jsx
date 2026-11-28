import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CardActions,
} from "@mui/material";
import {
  People,
  CreditScore,
  AccountBalance,
  TrendingUp,
  Assessment,
  GroupAdd,
  ShoppingCart,
  PersonSearch,
  Star,
} from "@mui/icons-material";
import { franchiseAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { EMBEDDED_FORM_SX } from "./creditBureau/embeddedFormSx";
import { headRowSx } from "../admin/ui/tableStyles";
import { ArrowForward, Storefront } from "@mui/icons-material";

// Charts load on demand so the dashboard does not download Recharts up front
const ScoreTrend = lazy(() =>
  import("./PartnerCharts").then((m) => ({ default: m.ScoreTrendChart })),
);
const Usage = lazy(() =>
  import("./PartnerCharts").then((m) => ({ default: m.UsageChart })),
);

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    credits: {
      used: 0,
      available: 0,
    },
    ai: {
      used: 0,
      available: 0,
    },
    business: {
      manual: 0,
      dashboard: 0,
      total: 0,
    },
    // totalLeads: 0,
    // newLeads: 0,
    // totalCreditReports: 0,
    // totalReferrals: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchasedPackage, setPurchasedPackage] = useState(null);
  const [assignedPackages, setAssignedPackages] = useState([]);
  const [kycStatus, setKycStatus] = useState(null);
  const [kycRejectedReason, setKycRejectedReason] = useState("");
  const [franchiseCode, setFranchiseCode] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch KYC status
        const kycResponse = await franchiseAPI.getKycStatus();
        setKycStatus(kycResponse.data.kycStatus);
        if (
          kycResponse.data.kycRequest &&
          kycResponse.data.kycRequest.rejectionReason
        ) {
          setKycRejectedReason(kycResponse.data.kycRequest.rejectionReason);
        }

        // Fetch franchise profile for the franchise ID
        franchiseAPI
          .getProfile()
          .then((res) => setFranchiseCode(res.data?.franchiseCode || ""))
          .catch((err) => console.error("Error fetching franchise ID:", err));

        // Fetch dashboard stats
        const dashboardResponse = await franchiseAPI.getDashboardStats();

        // Fetch recent credit reports
        const reportsResponse = await franchiseAPI.getCreditReports({
          page: 1,
          limit: 5,
        });
        const recentReports = reportsResponse.data.reports.slice(0, 5); // Get last 5 reports

        // Fetch transactions to get purchased package
        const transactionsResponse = await franchiseAPI.getTransactions();
        const paidTransactions = transactionsResponse.data.filter(
          (tx) => tx.status === "paid",
        );
        const latestTransaction =
          paidTransactions.length > 0 ? paidTransactions[0] : null;

        console.log("Full Response:", dashboardResponse.data);
        console.log("Stats:", dashboardResponse.data.stats);
        console.log(
          "Credit Details:",
          dashboardResponse.data.stats?.creditDetails,
        );
        console.log("AI Details:", dashboardResponse.data.stats?.aiDetails);
        console.log("Business:", dashboardResponse.data.stats?.business);
        setStats({
          credits: dashboardResponse.data.stats.creditDetails,
          ai: dashboardResponse.data.stats.aiDetails,
          business: dashboardResponse.data.stats.business,
          totalCases: dashboardResponse.data.stats.totalCases,
          // totalLeads: dashboardResponse.data.stats.totalLeads,
          // newLeads: dashboardResponse.data.stats.newLeads,
          // totalCreditReports: dashboardResponse.data.stats.totalCreditReports,
          // totalReferrals: dashboardResponse.data.stats.totalReferrals,
        });

        setRecentReports(recentReports);

        // Set purchased package from latest transaction
        if (latestTransaction && latestTransaction.packageId) {
          setPurchasedPackage({
            name: latestTransaction.packageId.name,
            credits: latestTransaction.packageId.creditsIncluded || 0,
            price: latestTransaction.packageId.price || 0,
            purchaseDate: latestTransaction.createdAt,
            sortOrder: latestTransaction.packageId.sortOrder || 0,
          });
        }

        // Set assigned packages from franchise data
        if (
          dashboardResponse.data.franchise.assignedPackages &&
          dashboardResponse.data.franchise.assignedPackages.length > 0
        ) {
          setAssignedPackages(
            dashboardResponse.data.franchise.assignedPackages,
          );
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load Razorpay script
  // useEffect(() => {
  //   const loadRazorpayScript = () => {
  //     if (window.Razorpay) return Promise.resolve(true);

  //     return new Promise((resolve) => {
  //       const script = document.createElement("script");
  //       script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //       script.onload = () => resolve(true);
  //       script.onerror = () => resolve(false);
  //       document.body.appendChild(script);
  //     });
  //   };

  //   loadRazorpayScript();
  // }, []);

  // // Function to fetch packages with higher tiers
  // const fetchUpgradePackages = async () => {
  //   try {
  //     setUpgradeLoading(true);
  //     setUpgradeError("");

  //     // Get all packages
  //     const response = await franchiseAPI.getCreditPackages();

  //     // Filter packages with higher price (higher tier) than current package
  //     let filteredPackages = [];
  //     if (purchasedPackage) {
  //       filteredPackages = response.data.filter((pkg) => {
  //         const result = pkg.price > (purchasedPackage.price || 0);
  //         return result;
  //       });
  //     } else if (assignedPackages.length > 0) {
  //       // If no purchased package, check assigned packages
  //       // Use credits as a proxy for tier level since price isn't available in assigned packages
  //       const highestCredits = Math.max(
  //         ...assignedPackages.map((pkg) => pkg.creditsIncluded || 0),
  //       );
  //       filteredPackages = response.data.filter((pkg) => {
  //         const result =
  //           pkg.creditsIncluded > highestCredits ||
  //           pkg.creditsIncluded === "Unlimited";
  //         return result;
  //       });
  //     }

  //     // Sort packages by price in ascending order (lowest to highest)
  //     const sortedPackages = [...filteredPackages].sort(
  //       (a, b) => a.price - b.price,
  //     );
  //     setAvailablePackages(sortedPackages);

  //     // Show error if no packages available for upgrade
  //     if (sortedPackages.length === 0) {
  //       setUpgradeError("No upgrade packages available at this time.");
  //     }

  //     setUpgradeDialogOpen(true);
  //   } catch (err) {
  //     console.error("Error fetching upgrade packages:", err);
  //     setUpgradeError(
  //       err.response?.data?.message ||
  //         "Failed to load upgrade packages. Please try again.",
  //     );
  //   } finally {
  //     setUpgradeLoading(false);
  //   }
  // };

  // // Function to handle package selection and initiate payment
  // const handlePackageSelection = async (pkg) => {
  //   try {
  //     setUpgradeLoading(true);
  //     setUpgradeError("");

  //     // Check if Razorpay is loaded
  //     if (!window.Razorpay) {
  //       throw new Error("Payment gateway not loaded. Please try again.");
  //     }

  //     // Create order on backend
  //     const response = await franchiseAPI.initiatePayment(pkg._id);

  //     const { orderId } = response.data;

  //     // Initialize Razorpay
  //     const options = {
  //       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  //       amount: pkg.price * 100,
  //       currency: "INR",
  //       name: "Credit Dost",
  //       description: `Upgrade to ${pkg.name} package`,
  //       order_id: orderId,
  //       handler: function (response) {
  //         // Payment successful - verify payment with backend
  //         verifyPayment(response);
  //       },
  //       prefill: {
  //         // You can add user details here if available
  //       },
  //       notes: {
  //         packageId: pkg._id,
  //         packageName: pkg.name,
  //       },
  //       theme: {
  //         color: "#6200ea",
  //       },
  //       modal: {
  //         ondismiss: function () {
  //           setUpgradeLoading(false);
  //           setUpgradeError("Payment cancelled by user.");
  //         },
  //       },
  //     };

  //     const rzp = new window.Razorpay(options);
  //     rzp.on("payment.failed", function (response) {
  //       console.error("Payment failed:", response.error);
  //       setUpgradeLoading(false);
  //       setUpgradeError(`Payment failed: ${response.error.description}`);
  //     });

  //     rzp.open();
  //   } catch (err) {
  //     console.error("Error initiating payment:", err);
  //     setUpgradeError(
  //       err.message || "Failed to initiate payment. Please try again.",
  //     );
  //   } finally {
  //     setUpgradeLoading(false);
  //   }
  // };

  // // Function to verify payment with backend
  // const verifyPayment = async (response) => {
  //   try {
  //     setUpgradeLoading(true);

  //     // Verify payment with backend
  //     await franchiseAPI.verifyPayment({
  //       razorpay_order_id: response.razorpay_order_id,
  //       razorpay_payment_id: response.razorpay_payment_id,
  //       razorpay_signature: response.razorpay_signature,
  //     });

  //     // Payment verified successfully
  //     setUpgradeDialogOpen(false);
  //     alert("Payment successful! Your package has been upgraded.");

  //     // Refresh the page to show updated package information
  //     window.location.reload();
  //   } catch (err) {
  //     console.error("Error verifying payment:", err);
  //     setUpgradeError("Payment verification failed. Please contact support.");
  //     setUpgradeLoading(false);
  //   }
  // };

  const statCards = [
    {
      title: "Credits",

      value: `${stats.credits?.used ?? 0}`,
      icon: <CreditScore sx={{ fontSize: 40 }} />,
      color: "#6200ea",
    },
    {
      title: "AI Usage",
      value: `${stats.ai?.used ?? 0}`,
      icon: <People sx={{ fontSize: 40 }} />,
      color: "#03dac6",
    },
    {
      title: "Total Business",
      value: `₹ ${stats.business?.total ?? 0}`,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: "#00c853",
    },

    {
      title: "Total Cases",
      value: stats.totalCases ?? 0,
      icon: <People sx={{ fontSize: 40 }} />,
      color: "#03dac6",
    },
  ];

  const quickActions = [
    {
      title: "Generate Credit Report",
      icon: <Assessment sx={{ fontSize: 30 }} />,
      color: "#6200ea",
      path: "/franchise/credit-check",
      description: "Check customer credit scores",
    },
    {
      title: "View Reports",
      icon: <CreditScore sx={{ fontSize: 30 }} />,
      color: "#ff4081",
      path: "/franchise/reports",
      description: "View generated credit reports",
    },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  // 👇 return ke just upar

  const KycpendingText = {
    pending: {
      heading: "KYC Pending",
      desc: "Please complete your KYC to access dashboard features",
    },
    rejected: {
      heading: "KYC Rejected",
      desc: "Your KYC verification was rejected. Please check the details and try again.",
    },
    submitted: {
      heading: "KYC Approval Submited",
      desc: "Please wait while the admin reviews and approves your profile.",
    },
  };

  if (kycStatus !== "approved") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#ff9800",
            fontWeight: "bold",
            mb: 2,
          }}
        >
          {KycpendingText[kycStatus]?.heading || "KYC Pending"}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {kycRejectedReason || KycpendingText[kycStatus]?.desc || ""}
        </Typography>
      </Box>
    );
  }
  const packageName =
    purchasedPackage?.name || assignedPackages[0]?.name || "No package assigned";

  // Score trend: latest reports with a score, oldest first
  const scoreSeries = [...recentReports]
    .filter((report) => report.score)
    .reverse()
    .map((report) => ({
      date: new Date(report.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      score: report.score,
    }));

  // Usage: used against available for credits and AI reports
  const usageSeries = [
    {
      name: "Credits",
      used: stats.credits?.used ?? 0,
      available: stats.credits?.available ?? 0,
    },
    {
      name: "AI reports",
      used: stats.ai?.used ?? 0,
      available: stats.ai?.available ?? 0,
    },
  ];

  return (
    <Box sx={{ ...EMBEDDED_FORM_SX, "& .MuiCard-root": { borderRadius: 2 } }}>
      {/* Header: package on the left; Franchise ID and quick actions on the right */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "flex-start" }}
        spacing={3}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            Your assigned package
          </Typography>
          <Typography variant="h4" fontWeight={700} letterSpacing="-0.02em" sx={{ mt: 0.5 }}>
            {packageName}
          </Typography>
          <Box sx={{ mt: 1.5, width: 48, height: 3, borderRadius: 2, bgcolor: "primary.main" }} />
        </Box>

        <Stack spacing={1.5} alignItems={{ xs: "flex-start", md: "flex-end" }}>
          {franchiseCode && (
            <Chip
              icon={<Storefront fontSize="small" />}
              label={`Franchise ID: ${franchiseCode}`}
              sx={{
                height: 36,
                px: 0.5,
                fontWeight: 700,
                bgcolor: "rgba(98, 0, 234, 0.08)",
                color: "primary.main",
                "& .MuiChip-icon": { color: "primary.main" },
              }}
            />
          )}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {quickActions.map((action, index) => (
              <Button
                key={action.title}
                variant={index === 0 ? "contained" : "outlined"}
                disableElevation
                onClick={() => navigate(action.path)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                  ...(index === 0 ? {} : { borderColor: "divider", color: "text.primary" }),
                }}
              >
                {action.title}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Stack>

      {/* Headline numbers */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: `${card.color}1A`,
                    color: card.color,
                  }}
                >
                  {React.cloneElement(card.icon, { sx: { fontSize: 24 } })}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.title}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent reports and score trend */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Recent credit reports
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward fontSize="small" />}
                  onClick={() => navigate("/franchise/reports")}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  View all
                </Button>
              </Stack>

              {recentReports.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 8 }}>
                  No credit reports generated yet
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={headRowSx}>
                        <TableCell>Name</TableCell>
                        <TableCell>Bureau</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentReports.map((report) => (
                        <TableRow key={report._id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {report.name}
                            </Typography>
                          </TableCell>
                          <TableCell>{report.bureau ? report.bureau.toUpperCase() : "—"}</TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              sx={{
                                color: !report.score
                                  ? "text.disabled"
                                  : report.score >= 700
                                    ? "success.main"
                                    : report.score >= 650
                                      ? "warning.main"
                                      : "error.main",
                              }}
                            >
                              {report.score || "—"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            {new Date(report.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Score trend
              </Typography>
              <Suspense fallback={<Box sx={{ height: 260 }} />}>
                <ScoreTrend data={scoreSeries} />
              </Suspense>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Usage */}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            Credits and AI usage
          </Typography>
          <Suspense fallback={<Box sx={{ height: 260 }} />}>
            <Usage data={usageSeries} />
          </Suspense>
        </CardContent>
      </Card>
    </Box>
  );

};

export default DashboardHome;
