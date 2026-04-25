import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ErrorIcon from "@mui/icons-material/Error";
import AssessmentIcon from "@mui/icons-material/Assessment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import InsightsIcon from "@mui/icons-material/Insights";
import { styled } from "@mui/material/styles";
import { adminAPI } from "../../services/api"; // Import the admin API

// Recharts imports
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Styled components for enhanced UI
const StatCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  border: `1px solid ${theme.palette.divider}`,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
  },
}));

const StatIconWrapper = styled(Box)(({ theme, color }) => ({
  width: 60,
  height: 60,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: `${color}20`,
  color: color,
  marginBottom: theme.spacing(2),
}));

const TrendChip = styled(Chip)(({ theme }) => ({
  height: 24,
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
}));

const ActivityItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius * 1.5,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const QuickActionCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  border: `1px solid ${theme.palette.divider}`,
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
    borderColor: theme.palette.primary.main,
  },
}));

const AdminDashboardHome = () => {
  const [stats, setStats] = useState({
    totalFranchises: 0,
    activeFranchises: 0,
    pendingKycFranchises: 0,
    totalPackages: 0,
    totalLeads: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    franchisePackageRevenue: 0,
    customerPackageRevenue: 0,
  });

  const [visitorStats, setVisitorStats] = useState({
    realTimeVisitors: 0,
    totalUsers: 0,
    pageViews: 0,
    sessions: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    chartData: [],
    topPages: [],
    trafficSources: [],
    period: "",
    lastUpdated: null,
    loading: true,
    error: null,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [performanceData, setPerformanceData] = useState({
    chartData: [],
    summary: {
      totalRevenue: 0,
      totalLeads: 0,
      totalFranchises: 0,
      revenueGrowth: 0,
      leadsGrowth: 0,
    },
    period: "monthly",
  });
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard stats
        const statsResponse = await adminAPI.getDashboardStats();
        setStats(statsResponse.data);

        // Fetch recent activities (now limited to 5 entries by backend)
        const activitiesResponse = await adminAPI.getRecentActivities();
        setRecentActivities(activitiesResponse.data);

        // Fetch performance overview data
        const performanceResponse = await adminAPI.getPerformanceOverview({
          period: selectedPeriod,
        });
        setPerformanceData(performanceResponse.data);

        // Fetch visitor statistics
        try {
          const visitorResponse = await adminAPI.getVisitorStats({
            period: "7daysAgo",
          }); // Changed to 7 days for more recent data
          console.log("Visitor response received:", visitorResponse.data);
          console.log("Full visitor response:", visitorResponse);
          console.log(
            "visitorResponse.data.totalStats:",
            visitorResponse.data?.totalStats
          );

          // Add defensive checks
          const totalStats = visitorResponse.data?.totalStats || {};

          const newVisitorStats = {
            realTimeVisitors: visitorResponse.data?.realTimeVisitors || 0,
            totalUsers: totalStats.totalUsers || 0,
            pageViews: totalStats.pageViews || 0,
            sessions: totalStats.sessions || 0,
            bounceRate: totalStats.bounceRate || 0,
            avgSessionDuration: totalStats.avgSessionDuration || 0,
            chartData: visitorResponse.data?.chartData || [],
            topPages: visitorResponse.data?.topPages || [],
            trafficSources: visitorResponse.data?.trafficSources || [],
            period: visitorResponse.data?.period || "",
            lastUpdated: visitorResponse.data?.lastUpdated || null,
            loading: false,
            error: null,
          };

          console.log("Setting visitor stats to:", newVisitorStats);

          setVisitorStats(newVisitorStats);

          console.log("Visitor stats set:", {
            realTimeVisitors: visitorResponse.data?.realTimeVisitors || 0,
            totalUsers: totalStats.totalUsers || 0,
            pageViews: totalStats.pageViews || 0,
            sessions: totalStats.sessions || 0,
            bounceRate: totalStats.bounceRate || 0,
            avgSessionDuration: totalStats.avgSessionDuration || 0,
          });
        } catch (visitorErr) {
          console.error("Failed to fetch visitor statistics:", visitorErr);
          console.error("Visitor error details:", visitorErr.response);
          setVisitorStats((prev) => ({
            ...prev,
            loading: false,
            error:
              visitorErr.response?.status === 500
                ? "Google Analytics not configured. Check server logs."
                : "Unable to load visitor data",
          }));
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  // Auto-refresh visitor statistics every 30 seconds
  useEffect(() => {
    const refreshVisitorStats = async () => {
      if (!visitorStats.error) {
        // Only refresh if there's no error
        try {
          const visitorResponse = await adminAPI.getVisitorStats({
            period: "7daysAgo",
          });

          // Add defensive checks
          // const totalStats = visitorResponse.data?.totalStats || {};

          const analyticsData = visitorResponse.data?.data || {};
          const totalStats = analyticsData.totalStats || {};

          const newVisitorStats = {
            realTimeVisitors: analyticsData.realTimeVisitors || 0,
            totalUsers: totalStats.totalUsers || 0,
            pageViews: totalStats.pageViews || 0,
            sessions: totalStats.sessions || 0,
            bounceRate: totalStats.bounceRate || 0,
            avgSessionDuration: totalStats.avgSessionDuration || 0,
            chartData: analyticsData.chartData || [],
            topPages: analyticsData.topPages || [],
            trafficSources: analyticsData.trafficSources || [],
            period: analyticsData.period || "",
            lastUpdated: analyticsData.lastUpdated || null,
            loading: false,
            error: null,
          };

          setVisitorStats(newVisitorStats);
        } catch (visitorErr) {
          console.warn("Failed to refresh visitor statistics:", visitorErr);
        }
      }
    };

    const interval = setInterval(refreshVisitorStats, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []); // Empty dependency array means this runs once when component mounts

  const statCards = [
    {
      title: "Total Franchises",
      value: stats.totalFranchises,
      icon: <PeopleIcon sx={{ fontSize: 30 }} />,
      color: "#6200ea",
      trend: "+12%",
      trendDirection: "up",
    },
    // {
    //   title: "Active Franchises",
    //   value: stats.activeFranchises,
    //   icon: <BusinessIcon sx={{ fontSize: 30 }} />,
    //   color: "#03dac6",
    //   trend: "+8%",
    //   trendDirection: "up",
    // },
    {
      title: "Pending KYC",
      value: stats.pendingKycFranchises,
      icon: <PendingIcon sx={{ fontSize: 30 }} />,
      color: "#ff9800",
      trend: "-2%",
      trendDirection: "down",
    },
    {
      title: "Total Packages",
      value: stats.totalPackages,
      icon: <CreditScoreIcon sx={{ fontSize: 30 }} />,
      color: "#4caf50",
      trend: "0%",
      trendDirection: "neutral",
    },
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: <GroupIcon sx={{ fontSize: 30 }} />,
      color: "#ff4081",
      trend: "+24%",
      trendDirection: "up",
    },
    // {
    //   title: "Total Revenue",
    //   value: `₹${stats.totalRevenue.toLocaleString()}`,
    //   icon: <AccountBalanceIcon sx={{ fontSize: 30 }} />,
    //   color: "#6200ea",
    //   trend: "+15%",
    //   trendDirection: "up",
    // },
    {
      title: "Revenue from Franchise Packages",
      value: `₹${stats.franchisePackageRevenue.toLocaleString()}`,
      icon: <BusinessIcon sx={{ fontSize: 30 }} />,
      color: "#6200ea",
      trend: "+15%",
      trendDirection: "up",
    },
    {
      title: "Revenue from Customer Packages",
      value: `₹${stats.customerPackageRevenue.toLocaleString()}`,
      icon: <AccountBalanceIcon sx={{ fontSize: 30 }} />,
      color: "#03dac6",
      trend: "+15%",
      trendDirection: "up",
    },
  ];

  const getVisitorStatCards = () => [
    {
      title: "Real-Time Visitors",
      value:
        visitorStats.loading || visitorStats.error
          ? "--"
          : visitorStats.realTimeVisitors,
      icon: <VisibilityIcon sx={{ fontSize: 30 }} />,
      color: "#00bcd4",
      trend: "+5%",
      trendDirection: "up",
    },
    {
      title: "Total Users (7d)",
      value:
        visitorStats.loading || visitorStats.error
          ? "--"
          : visitorStats.totalUsers,
      icon: <GroupIcon sx={{ fontSize: 30 }} />,
      color: "#ff9800",
      trend: "+18%",
      trendDirection: "up",
    },
    {
      title: "Page Views (7d)",
      value:
        visitorStats.loading || visitorStats.error
          ? "--"
          : visitorStats.pageViews,
      icon: <EqualizerIcon sx={{ fontSize: 30 }} />,
      color: "#9c27b0",
      trend: "+22%",
      trendDirection: "up",
    },
    {
      title: "Sessions (7d)",
      value:
        visitorStats.loading || visitorStats.error
          ? "--"
          : visitorStats.sessions,
      icon: <TrendingUpIcon sx={{ fontSize: 30 }} />,
      color: "#4caf50",
      trend: "+15%",
      trendDirection: "up",
    },
    {
      title: "Bounce Rate",
      value:
        visitorStats.loading || visitorStats.error
          ? "--"
          : `${(visitorStats.bounceRate * 100).toFixed(2)}%`,
      icon: <ErrorIcon sx={{ fontSize: 30 }} />,
      color: "#f44336",
      trend: "-5%",
      trendDirection: "down",
    },
    {
      title: "Avg Session Duration",
      value:
        visitorStats.loading || visitorStats.error
          ? "--"
          : `${Math.round(visitorStats.avgSessionDuration)}s`,
      icon: <AccessTimeIcon sx={{ fontSize: 30 }} />,
      color: "#2196f3",
      trend: "+10%",
      trendDirection: "up",
    },
  ];

  const visitorStatCards = [
    ...getVisitorStatCards(),
    // Google Analytics Configuration Warning
    ...(!visitorStats.error
      ? []
      : [
          {
            title: "Analytics Not Configured",
            value: (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Configure Google Analytics
                </Typography>
              </Box>
            ),
            icon: <InsightsIcon sx={{ fontSize: 30 }} />,
            color: "#9e9e9e",
            trend: "Setup",
            trendDirection: "neutral",
          },
        ]),
  ];

  console.log("Current visitorStats state:", visitorStats);
  const tempVisitorStatCards = getVisitorStatCards();
  console.log(
    "Temp visitorStatCards created from current state:",
    tempVisitorStatCards
  );
  console.log("Final visitorStatCards created:", visitorStatCards);

  const handlePeriodChange = async (period) => {
    try {
      setSelectedPeriod(period);
      // Performance data will be fetched automatically due to the useEffect dependency
    } catch (err) {
      console.error("Error changing period:", err);
      setError("Failed to update performance data. Please try again later.");
    }
  };

  const quickActions = [
    { title: "Add Franchise", icon: <PeopleIcon />, color: "#6200ea" },
    { title: "Create Package", icon: <BusinessIcon />, color: "#03dac6" },
    { title: "View Reports", icon: <AssessmentIcon />, color: "#ff4081" },
    { title: "Manage Payouts", icon: <AccountBalanceIcon />, color: "#ff9800" },
  ];

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="600px"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, Administrator. Here's what's happening today.
          </Typography>
        </Box>
        <Chip
          label={`Last updated: ${new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`}
          variant="outlined"
          size="small"
        />
      </Box>

      <Grid
        container
        spacing={3}
        mb={4}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        {statCards.map((card, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={index}
            style={{ flex: " 1" }}
          >
            <StatCard>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <StatIconWrapper color={card.color}>
                    {card.icon}
                  </StatIconWrapper>
                  {card.trendDirection !== "neutral" && (
                    <TrendChip
                      icon={
                        card.trendDirection === "up" ? (
                          <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                        ) : (
                          <ArrowUpwardIcon
                            sx={{ fontSize: 16, transform: "rotate(180deg)" }}
                          />
                        )
                      }
                      label={card.trend}
                      size="small"
                      variant="outlined"
                      color={
                        card.trendDirection === "up" ? "success" : "warning"
                      }
                      sx={{
                        ".MuiChip-icon": {
                          color:
                            card.trendDirection === "up"
                              ? "#4caf50"
                              : "#ff9800",
                        },
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ fontWeight: 700, mb: 0.5 }}
                >
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
        ))}
      </Grid>

      <Grid
        container
        spacing={3}
        mb={4}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <Grid item xs={12} md={8} style={{ flex: " 1" }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Activity
                </Typography>
                <Chip
                  label="Live"
                  color="success"
                  size="small"
                  icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                />
              </Box>
              <List sx={{ py: 0 }}>
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <Box key={activity.id}>
                      <ListItem sx={{ px: 0, py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor:
                                activity.status === "completed"
                                  ? "#4caf50"
                                  : activity.status === "pending"
                                  ? "#ff9800"
                                  : activity.status === "rejected"
                                  ? "#f44336"
                                  : "#2196f3",
                            }}
                          >
                            {activity.status === "completed" ? (
                              <CheckCircleIcon />
                            ) : activity.status === "pending" ? (
                              <AccessTimeIcon />
                            ) : activity.status === "rejected" ? (
                              <ErrorIcon />
                            ) : (
                              <AccessTimeIcon />
                            )}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.user}
                          secondary={activity.action}
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(activity.time)}
                        </Typography>
                      </ListItem>
                      {index < recentActivities.length - 1 && (
                        <Divider variant="middle" component="li" />
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    No recent activities
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} style={{ flex: " 1" }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={6} key={index}>
                    <QuickActionCard>
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        <Box sx={{ textAlign: "center" }}>
                          <Avatar
                            sx={{
                              bgcolor: `${action.color}20`,
                              color: action.color,
                              mx: "auto",
                              mb: 1,
                            }}
                          >
                            {action.icon}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {action.title}
                          </Typography>
                        </Box>
                      </CardContent>
                    </QuickActionCard>
                  </Grid>
                ))}
              </Grid>

              <Box
                sx={{ mt: 3, p: 2, bgcolor: "primary.light", borderRadius: 2 }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: "primary.main", mb: 1 }}
                >
                  System Status
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircleIcon
                    sx={{ color: "#4caf50", fontSize: 20, mr: 1 }}
                  />
                  <Typography variant="body2">
                    All systems operational
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        style={{ flexWrap: "nowrap" }}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Performance Overview
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip
                    label="Weekly"
                    variant={
                      selectedPeriod === "weekly" ? "filled" : "outlined"
                    }
                    size="small"
                    clickable
                    onClick={() => handlePeriodChange("weekly")}
                    sx={{ cursor: "pointer" }}
                  />
                  <Chip
                    label="Monthly"
                    variant={
                      selectedPeriod === "monthly" ? "filled" : "outlined"
                    }
                    size="small"
                    clickable
                    onClick={() => handlePeriodChange("monthly")}
                    sx={{ cursor: "pointer" }}
                  />
                  <Chip
                    label="Quarterly"
                    variant={
                      selectedPeriod === "quarterly" ? "filled" : "outlined"
                    }
                    size="small"
                    clickable
                    onClick={() => handlePeriodChange("quarterly")}
                    sx={{ cursor: "pointer" }}
                  />
                  <Chip
                    label="Yearly"
                    variant={
                      selectedPeriod === "yearly" ? "filled" : "outlined"
                    }
                    size="small"
                    clickable
                    onClick={() => handlePeriodChange("yearly")}
                    sx={{ cursor: "pointer" }}
                  />
                </Box>
              </Box>
              <Box sx={{ height: 400 }}>
                {performanceData.chartData &&
                performanceData.chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceData.chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        strokeOpacity={0.3}
                      />
                      <XAxis
                        dataKey="date"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) =>
                          value >= 1000
                            ? `${(value / 1000).toFixed(1)}k`
                            : value
                        }
                      />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "revenue") {
                            return [
                              `₹${Number(value).toLocaleString()}`,
                              "Revenue",
                            ];
                          }
                          return [
                            value,
                            name === "leads" ? "Leads" : "Franchises",
                          ];
                        }}
                        labelFormatter={(label) => `Date: ${label}`}
                        contentStyle={{
                          borderRadius: 8,
                          border: "1px solid #eee",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#6200ea"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="leads"
                        name="Leads"
                        stroke="#03dac6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="franchises"
                        name="New Franchises"
                        stroke="#ff4081"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "grey.50",
                      borderRadius: 2,
                      border: "1px dashed rgba(0,0,0,0.12)",
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      No performance data available
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.08)",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Visitor Analytics
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {console.log("Rendering visitorStatCards:", visitorStatCards)}
                {visitorStats.loading ? (
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      minHeight="100px"
                    >
                      <CircularProgress size={30} />
                    </Box>
                  </Grid>
                ) : (
                  visitorStatCards.slice(0, 3).map((card, index) => (
                    <Grid item xs={12} key={`stats-${index}`}>
                      <StatCard>
                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Box>
                              <StatIconWrapper color={card.color}>
                                {card.icon}
                              </StatIconWrapper>
                            </Box>
                            <Box textAlign="right">
                              <Typography
                                variant="h5"
                                component="div"
                                sx={{ fontWeight: 700, mb: 0.5 }}
                              >
                                {card.value}
                              </Typography>
                              {card.trendDirection !== "neutral" && (
                                <TrendChip
                                  icon={
                                    card.trendDirection === "up" ? (
                                      <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                                    ) : (
                                      <ArrowUpwardIcon
                                        sx={{
                                          fontSize: 16,
                                          transform: "rotate(180deg)",
                                        }}
                                      />
                                    )
                                  }
                                  label={card.trend}
                                  size="small"
                                  variant="outlined"
                                  color={
                                    card.trendDirection === "up"
                                      ? "success"
                                      : "warning"
                                  }
                                  sx={{
                                    ".MuiChip-icon": {
                                      color:
                                        card.trendDirection === "up"
                                          ? "#4caf50"
                                          : "#ff9800",
                                    },
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {card.title}
                          </Typography>
                        </CardContent>
                      </StatCard>
                    </Grid>
                  ))
                )}
              </Grid>

              {/* Detailed Metrics */}
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 2, color: "text.secondary" }}
                >
                  Detailed Metrics
                </Typography>
                <Grid container spacing={1}>
                  {visitorStats.loading ? (
                    <Grid item xs={12}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="60px"
                      >
                        <CircularProgress size={20} />
                      </Box>
                    </Grid>
                  ) : (
                    visitorStatCards.slice(3).map((card, index) => (
                      <Grid item xs={12} key={`detail-${index}`}>
                        <Paper
                          sx={{
                            p: 1.5,
                            mb: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            bgcolor: "grey.50",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: `${card.color}20`,
                                color: card.color,
                                mr: 1.5,
                              }}
                            >
                              {card.icon}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {card.title}
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {card.value}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))
                  )}
                </Grid>
              </Box>

              {/* Top Pages */}
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 2, color: "text.secondary" }}
                >
                  Top Pages
                </Typography>
                <List sx={{ py: 0 }}>
                  {visitorStats.loading ? (
                    <ListItem sx={{ py: 0.5, px: 0 }}>
                      <ListItemText
                        primary={
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            minHeight="40px"
                          >
                            <CircularProgress size={16} />
                          </Box>
                        }
                      />
                    </ListItem>
                  ) : visitorStats.topPages &&
                    visitorStats.topPages.length > 0 ? (
                    visitorStats.topPages.slice(0, 5).map((page, index) => (
                      <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography variant="body2" noWrap>
                              {page.pageTitle}
                            </Typography>
                          }
                          secondary={`Views: ${page.pageViews}`}
                          primaryTypographyProps={{ fontSize: "0.8rem" }}
                          secondaryTypographyProps={{
                            fontSize: "0.7rem",
                            color: "text.secondary",
                          }}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ py: 1 }}
                    >
                      No top pages data
                    </Typography>
                  )}
                </List>
              </Box>

              {/* Traffic Sources */}
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 2, color: "text.secondary" }}
                >
                  Traffic Sources
                </Typography>
                <List sx={{ py: 0 }}>
                  {visitorStats.loading ? (
                    <ListItem sx={{ py: 0.5, px: 0 }}>
                      <ListItemText
                        primary={
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            minHeight="40px"
                          >
                            <CircularProgress size={16} />
                          </Box>
                        }
                      />
                    </ListItem>
                  ) : visitorStats.trafficSources &&
                    visitorStats.trafficSources.length > 0 ? (
                    visitorStats.trafficSources
                      .slice(0, 5)
                      .map((source, index) => (
                        <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                          <ListItemText
                            primary={`${source.source}`}
                            secondary={`Users: ${source.users}`}
                            primaryTypographyProps={{ fontSize: "0.8rem" }}
                            secondaryTypographyProps={{
                              fontSize: "0.7rem",
                              color: "text.secondary",
                            }}
                          />
                        </ListItem>
                      ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ py: 1 }}
                    >
                      No traffic sources data
                    </Typography>
                  )}
                </List>
              </Box>

              {/* Last Updated */}
              {visitorStats.lastUpdated && (
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Last updated:{" "}
                    {new Date(visitorStats.lastUpdated).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardHome;
