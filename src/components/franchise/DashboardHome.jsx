import React, { useState, useEffect } from "react";
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
import { useAuth } from "../../hooks/useAuth";

const DashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

      value: `${stats.credits?.used ?? 0} / ${stats.credits?.available ?? 0}`,
      icon: <CreditScore sx={{ fontSize: 40 }} />,
      color: "#6200ea",
    },
    {
      title: "AI Usage",
      value: `${stats.ai?.used ?? 0} / ${stats.ai?.available ?? 0}`,
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
      title: "Manage Leads",
      icon: <PersonSearch sx={{ fontSize: 30 }} />,
      color: "#03dac6",
      path: "/franchise/leads",
      description: "View and manage customer leads",
    },
    {
      title: "View Reports",
      icon: <CreditScore sx={{ fontSize: 30 }} />,
      color: "#ff4081",
      path: "/franchise/reports",
      description: "View generated credit reports",
    },
    {
      title: "Refer Franchise",
      icon: <GroupAdd sx={{ fontSize: 30 }} />,
      color: "#00c853",
      path: "/franchise/referrals",
      description: "Refer new franchise partners",
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
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Welcome{" "}
        <span style={{ color: "#6200ea", fontWeight: "bold" }}>
          {user?.name || "User"}
        </span>
      </Typography>

      {/* Purchased Package Section */}
      {purchasedPackage && (
        <Card
          sx={{
            mb: 3,
            boxShadow: 3,
            borderRadius: 2,
            background: "linear-gradient(135deg, #6200ea 0%, #03dac6 100%)",
            color: "white",
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}> {/* MOBILE FIX */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "start", md: "center" }, /* MOBILE FIX */
                flexDirection: { xs: "column", md: "row" }, /* MOBILE FIX */
                gap: { xs: 2, md: 0 }, /* MOBILE FIX */
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  component="div"
                  fontWeight="bold"
                  gutterBottom
                >
                  Your Current Package
                </Typography>
                <Typography
                  variant="h4"
                  component="div"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  {purchasedPackage.name}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{purchasedPackage.credits} Credits</strong> included
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Purchased on{" "}
                  {new Date(purchasedPackage.purchaseDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "start", md: "flex-end" }, /* MOBILE FIX */
                  gap: 1,
                  width: { xs: "100%", md: "auto" }, /* MOBILE FIX */
                }}
              >
                <Chip
                  icon={<Star />}
                  label="Active"
                  color="success"
                  sx={{
                    fontWeight: "bold",
                    height: 32,
                    "& .MuiChip-icon": {
                      color: "white !important",
                    },
                  }}
                />
                {/* <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<ArrowUpward />}
                  onClick={fetchUpgradePackages}
                  sx={{
                    mt: 1,
                    backgroundColor: "white",
                    color: "#6200ea",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  Upgrade Package
                </Button> */}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Assigned Packages Section */}
      {assignedPackages.length > 0 && !purchasedPackage && (
        <Card
          sx={{
            mb: 3,
            boxShadow: 3,
            borderRadius: 2,
            background: "linear-gradient(135deg, #03dac6 0%, #6200ea 100%)",
            color: "white",
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}> {/* MOBILE FIX */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "start", md: "center" },
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  component="div"
                  fontWeight="bold"
                  gutterBottom
                >
                  Your Assigned Package{assignedPackages.length > 1 ? "s" : ""}
                </Typography>
                {assignedPackages.map((pkg, index) => (
                  <Box
                    key={pkg._id}
                    sx={{ mb: index < assignedPackages.length - 1 ? 1 : 0 }}
                  >
                    <Typography
                      variant="h4"
                      component="div"
                      fontWeight="bold"
                      sx={{ mb: 1 }}
                    >
                      {pkg.name}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>
                        {pkg.creditsIncluded === "Unlimited"
                          ? "Unlimited"
                          : pkg.creditsIncluded}{" "}
                        Credits
                      </strong>{" "}
                      included
                    </Typography>
                  </Box>
                ))}
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Assigned by admin
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "start", md: "flex-end" },
                  gap: 1,
                  width: { xs: "100%", md: "auto" }, /* MOBILE FIX */
                }}
              >
                <Chip
                  icon={<Star />}
                  label="Active"
                  color="success"
                  sx={{
                    fontWeight: "bold",
                    marginTop: { xs: "0px", md: "0" }, /* MOBILE FIX */
                    height: 32,
                    "& .MuiChip-icon": {
                      color: "white !important",
                    },
                  }}
                />
                {/* <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<ArrowUpward />}
                  onClick={fetchUpgradePackages}
                  sx={{
                    mt: 1,
                    backgroundColor: "white",
                    color: "#6200ea",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  Upgrade Package
                </Button> */}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <Grid
        container
        spacing={3}
        mt={2}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} style={{ flex: "1" }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center", p: { xs: 2, sm: 3 } }}> {/* MOBILE FIX */}
                <Box sx={{ color: card.color, mb: 2 }}>{card.icon}</Box>
                <Typography variant="h5" component="div" gutterBottom>
                  {card.value}
                </Typography>
                <Typography color="text.secondary">{card.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid
        container
        spacing={3}
        mt={3}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <Grid item xs={12} md={8} style={{ flex: "1" }}>
          <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}> {/* MOBILE FIX */}
              <Typography variant="h6" gutterBottom>
                Recent Credit Reports
              </Typography>
              {recentReports.length === 0 ? (
                <Box sx={{ minHeight: 200 }}>
                  <Typography
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 8 }}
                  >
                    No credit reports generated yet
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ overflowX: "auto", width: "100%" }}> {/* MOBILE FIX */}
                  <Table
                    sx={{ minWidth: 400 }}
                    aria-label="recent reports table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Bureau</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentReports.map((report) => (
                        <TableRow
                          key={report._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {report.name}
                          </TableCell>
                          <TableCell>
                            {report.bureau
                              ? report.bureau.toUpperCase()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                color:
                                  report.score >= 700
                                    ? "success.main"
                                    : report.score >= 600
                                      ? "warning.main"
                                      : "error.main",
                                fontWeight: "bold",
                              }}
                            >
                              {report.score || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
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
        {/* Quick Actions Section - Only visible when KYC is approved */}
        {kycStatus === "approved" && (
          <Grid item xs={12} md={4} style={{ flex: "1" }}>
            <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}> {/* MOBILE FIX */}
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, /* MOBILE FIX */
                    gap: 2,
                    mt: 2,
                  }}
                >
                  {quickActions.map((action, index) => (
                    <Tooltip
                      key={index}
                      title={action.description}
                      placement="top"
                    >
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 2,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: 3,
                            bgcolor: "background.default",
                          },
                        }}
                        onClick={() => navigate(action.path)}
                      >
                        <Box
                          sx={{
                            color: action.color,
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            bgcolor: `${action.color}15`,
                          }}
                        >
                          {action.icon}
                        </Box>
                        <Typography
                          variant="body2"
                          align="center"
                          sx={{
                            fontWeight: "medium",
                            fontSize: "0.8rem",
                          }}
                        >
                          {action.title}
                        </Typography>
                      </Card>
                    </Tooltip>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>


    </Box>
  );
};

export default DashboardHome;
