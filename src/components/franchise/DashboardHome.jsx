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
  CheckCircle,
  Star,
  ArrowUpward,
  Close as CloseIcon,
} from "@mui/icons-material";
import { franchiseAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const DashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    credits: 0,
    totalLeads: 0,
    newLeads: 0,
    totalCreditReports: 0,
    totalReferrals: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchasedPackage, setPurchasedPackage] = useState(null);
  const [assignedPackages, setAssignedPackages] = useState([]);
  const [kycStatus, setKycStatus] = useState(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeError, setUpgradeError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch KYC status
        const kycResponse = await franchiseAPI.getKycStatus();
        setKycStatus(kycResponse.data.kycStatus);

        // Fetch dashboard stats
        const dashboardResponse = await franchiseAPI.getDashboardStats();

        // Fetch recent credit reports
        const reportsResponse = await franchiseAPI.getCreditReports();
        const recentReports = reportsResponse.data.slice(0, 5); // Get last 5 reports

        // Fetch transactions to get purchased package
        const transactionsResponse = await franchiseAPI.getTransactions();
        const paidTransactions = transactionsResponse.data.filter(
          (tx) => tx.status === "paid",
        );
        const latestTransaction =
          paidTransactions.length > 0 ? paidTransactions[0] : null;

        setStats({
          credits: dashboardResponse.data.stats.credits,
          totalLeads: dashboardResponse.data.stats.totalLeads,
          newLeads: dashboardResponse.data.stats.newLeads,
          totalCreditReports: dashboardResponse.data.stats.totalCreditReports,
          totalReferrals: dashboardResponse.data.stats.totalReferrals,
        });

        setRecentReports(recentReports);

        // Set purchased package from latest transaction
        if (latestTransaction && latestTransaction.packageId) {
          console.log(
            "Latest transaction package data:",
            latestTransaction.packageId,
          );
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

  // Function to fetch packages with higher tiers
  const fetchUpgradePackages = async () => {
    try {
      setUpgradeLoading(true);
      setUpgradeError("");

      // Get all packages
      const response = await franchiseAPI.getCreditPackages();

      console.log("All packages:", response.data);
      console.log("Purchased package:", purchasedPackage);
      console.log("Assigned packages:", assignedPackages);

      // Filter packages with higher price (higher tier) than current package
      let filteredPackages = [];
      if (purchasedPackage) {
        console.log(
          "Filtering by purchased package price:",
          purchasedPackage.price || purchasedPackage.credits,
        );
        filteredPackages = response.data.filter((pkg) => {
          const result = pkg.price > (purchasedPackage.price || 0);
          console.log(
            `Package ${pkg.name} (price: ${pkg.price}) > ${
              purchasedPackage.price || 0
            }: ${result}`,
          );
          return result;
        });
      } else if (assignedPackages.length > 0) {
        // If no purchased package, check assigned packages
        // Use credits as a proxy for tier level since price isn't available in assigned packages
        const highestCredits = Math.max(
          ...assignedPackages.map((pkg) => pkg.creditsIncluded || 0),
        );
        console.log(
          "Filtering by assigned packages highest credits:",
          highestCredits,
        );
        filteredPackages = response.data.filter((pkg) => {
          const result = pkg.creditsIncluded > highestCredits;
          console.log(
            `Package ${pkg.name} (credits: ${pkg.creditsIncluded}) > ${highestCredits}: ${result}`,
          );
          return result;
        });
      }

      console.log("Filtered packages:", filteredPackages);

      // Sort packages by price in ascending order (lowest to highest)
      const sortedPackages = [...filteredPackages].sort(
        (a, b) => a.price - b.price,
      );
      setAvailablePackages(sortedPackages);

      // Show error if no packages available for upgrade
      if (sortedPackages.length === 0) {
        setUpgradeError("No upgrade packages available at this time.");
      }

      setUpgradeDialogOpen(true);
    } catch (err) {
      console.error("Error fetching upgrade packages:", err);
      setUpgradeError(
        err.response?.data?.message ||
          "Failed to load upgrade packages. Please try again.",
      );
    } finally {
      setUpgradeLoading(false);
    }
  };

  // Function to handle package selection and initiate payment
  const handlePackageSelection = async (pkg) => {
    try {
      setUpgradeLoading(true);
      setUpgradeError("");

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
            setUpgradeError("Payment cancelled by user.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        setUpgradeLoading(false);
        setUpgradeError(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err) {
      console.error("Error initiating payment:", err);
      setUpgradeError(
        err.message || "Failed to initiate payment. Please try again.",
      );
    } finally {
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
      setUpgradeDialogOpen(false);
      alert("Payment successful! Your package has been upgraded.");

      // Refresh the page to show updated package information
      window.location.reload();
    } catch (err) {
      console.error("Error verifying payment:", err);
      setUpgradeError("Payment verification failed. Please contact support.");
      setUpgradeLoading(false);
    }
  };

  const statCards = [
    {
      title: "Available Credits",
      value: stats.credits,
      icon: <CreditScore sx={{ fontSize: 40 }} />,
      color: "#6200ea",
    },
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: <People sx={{ fontSize: 40 }} />,
      color: "#03dac6",
    },
    {
      title: "New Leads",
      value: stats.newLeads,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: "#ff4081",
    },
    {
      title: "Credit Reports",
      value: stats.totalCreditReports,
      icon: <AccountBalance sx={{ fontSize: 40 }} />,
      color: "#00c853",
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
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
                  alignItems: "flex-end",
                  gap: 1,
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
                <Button
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
                </Button>
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
          <CardContent>
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
                      <strong>{pkg.creditsIncluded} Credits</strong> included
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
                }}
              >
                <Chip
                  icon={<Star />}
                  label="Active"
                  color="success"
                  sx={{
                    fontWeight: "bold",
                    marginTop: { xs: "15px", md: "0" },
                    height: 32,
                    "& .MuiChip-icon": {
                      color: "white !important",
                    },
                  }}
                />
                <Button
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
                </Button>
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
              <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
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
            <CardContent>
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
                <TableContainer component={Paper}>
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
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
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

      {/* Upgrade Package Dialog */}
      <Dialog
        open={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            width: "90%",
            maxWidth: "900px",
            borderRadius: 4,
            p: 1,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: "primary.main" }}
            >
              Upgrade Your Package Hello sandhya
            </Typography>
            <IconButton
              onClick={() => setUpgradeDialogOpen(false)}
              sx={{
                bgcolor: "#f5f5f5",
                "&:hover": { bgcolor: "#e0e0e0" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          {upgradeError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {upgradeError}
            </Alert>
          )}

          {upgradeLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 6,
                flexDirection: "column",
              }}
            >
              <CircularProgress size={40} />
              <Typography sx={{ mt: 2 }}>Loading packages...</Typography>
            </Box>
          ) : (
            <>
              {availablePackages.length === 0 ? (
                <DialogContentText sx={{ textAlign: "center", py: 4 }}>
                  No upgrade packages available at this time.
                </DialogContentText>
              ) : (
                <Grid container spacing={3}>
                  {availablePackages.map((pkg) => {
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
                        style={{ width: "100%" }}
                      >
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 4,
                            cursor: "pointer",
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
                              p: 3,
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              gutterBottom
                            >
                              {pkg.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mb: 2,
                                minHeight: 45,
                              }}
                            >
                              {pkg.description}
                            </Typography>
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
                          <CardActions sx={{ p: 2, pt: 0 }}>
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
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setUpgradeDialogOpen(false)}
            disabled={upgradeLoading}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardHome;
