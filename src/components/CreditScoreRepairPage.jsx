import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  styled,
  Paper,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  TrendingUp,
  Security,
  Speed,
  Assessment,
  Timeline,
  VerifiedUser,
  ContactSupport,
  ArrowForward,
} from "@mui/icons-material";
import Header from "./homepage/Header";
import TestimonialSection from "./homepage/TestimonialsSection";
import HomePageFooter from "./homepage/HomePageFooter";
import api from "../services/api";

const PageBackground = styled(Box)(({ theme }) => ({
  background: "#ffffff",
  minHeight: "100vh",
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
  padding: theme.spacing(12, 0, 8),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
    pointerEvents: "none",
  },
}));

const SectionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  position: "relative",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: "#0f172a",
  marginBottom: theme.spacing(2),
  position: "relative",
  fontSize: "2.5rem",
  [theme.breakpoints.down("md")]: {
    fontSize: "2rem",
  },
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  color: "#64748b",
  fontSize: "1.2rem",
  marginBottom: theme.spacing(6),
  maxWidth: "700px",
  margin: "0 auto",
  lineHeight: 1.7,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(0, 0, 0, 0.05)",
  background: "white",
  transition: "all 0.3s ease",
  height: "100%",
}));

const ProcessCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  border: "2px solid #f1f5f9",
  background: "white",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "4px",
    background: "linear-gradient(90deg, #0ea5e9, #06b6d4)",
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 20px 40px rgba(14, 165, 233, 0.15)",
    borderColor: "#0ea5e9",
    "&::before": {
      transform: "scaleX(1)",
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.8, 5),
  borderRadius: 12,
  fontWeight: 700,
  fontSize: "1.1rem",
  textTransform: "none",
  transition: "all 0.3s ease",
  background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
  boxShadow: "0 8px 24px rgba(14, 165, 233, 0.3)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 12px 32px rgba(14, 165, 233, 0.4)",
    background: "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
  },
  "&:disabled": {
    background: "#cbd5e1",
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
  marginBottom: theme.spacing(3),
  boxShadow: "0 8px 24px rgba(14, 165, 233, 0.3)",
  transition: "all 0.3s ease",
  "& svg": {
    fontSize: 40,
    color: "white",
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
  border: "2px solid #e2e8f0",
  textAlign: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    borderColor: "#0ea5e9",
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  },
}));

const PlanCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  border: "2px solid #e2e8f0",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-12px) scale(1.02)",
    boxShadow: "0 24px 48px rgba(14, 165, 233, 0.2)",
    borderColor: "#0ea5e9",
  },
  "&.featured": {
    border: "3px solid #0ea5e9",
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
  },
}));

const FeatureBadge = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  borderRadius: 50,
  background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
  color: "#166534",
  fontWeight: 600,
  fontSize: "0.875rem",
  marginBottom: theme.spacing(2),
}));

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
  border: "2px solid #bae6fd",
  position: "relative",
  "&::before": {
    content: '"""',
    position: "absolute",
    top: 20,
    left: 20,
    fontSize: "4rem",
    color: "#0ea5e9",
    opacity: 0.2,
    fontFamily: "Georgia, serif",
  },
}));

const CreditScoreRepairPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    city: "",
    state: "",
    creditScore: "",
    problemType: "",
    message: "",
    language: "",
    occupation: "",
    income: "",
    // authorization: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // For mobile number, only allow digits
    if (name === "mobileNumber") {
      const cleanValue = value.replace(/\D/g, "");
      // Limit to 10 digits
      if (cleanValue.length <= 10) {
        setFormData({
          ...formData,
          [name]: cleanValue,
        });
      }
      return;
    }

    // For income field, only allow digits
    if (name === "income") {
      const cleanValue = value.replace(/\D/g, "");
      setFormData({
        ...formData,
        [name]: cleanValue,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (!formData.fullName || formData.fullName.length < 2) {
      setError("Please enter your full name");
      return false;
    }
    if (
      !formData.mobileNumber ||
      formData.mobileNumber.length !== 10 ||
      !/^[0-9]{10}$/.test(formData.mobileNumber)
    ) {
      setError("Please enter a valid 10-digit mobile number");
      return false;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.city) {
      setError("Please enter your city");
      return false;
    }
    if (!formData.state) {
      setError("Please select your state");
      return false;
    }
    if (!formData.problemType) {
      setError("Please select a problem type");
      return false;
    }
    if (!formData.authorization) {
      setError("Please authorize us to contact you");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    // Clean the mobile number to ensure it contains only digits
    const cleanFormData = {
      fullName: formData.fullName || "",
      email: formData.email || "",
      mobileNumber: formData.mobileNumber.replace(/\D/g, ""),
      city: formData.city || "",
      state: formData.state || "",
      problemType: formData.problemType || "",
      creditScore: formData.creditScore || "",
      message: formData.message || "",
      language: formData.language || "",
      occupation: formData.occupation || "",
      income: formData.income || "",
      // Note: authorization field is not sent to backend as it's only for frontend validation
    };

    // Log the data being sent
    console.log("Clean form data:", cleanFormData);

    // Additional validation for mobile number
    if (cleanFormData.mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      setLoading(false);
      return;
    }

    // Ensure all required fields are present
    if (!cleanFormData.problemType) {
      setError("Please select a problem type");
      setLoading(false);
      return;
    }

    if (!cleanFormData.state) {
      setError("Please select your state");
      setLoading(false);
      return;
    }

    if (!formData.authorization) {
      setError("Please authorize us to contact you");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Submit to backend API
      console.log("Submitting credit repair form with data:", cleanFormData);
      await api.post("/forms/credit-repair", cleanFormData);
      setSuccess(true);
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        mobileNumber: "",
        city: "",
        state: "",
        creditScore: "",
        problemType: "",
        message: "",
        language: "",
        occupation: "",
        income: "",
        authorization: false,
      });
    } catch (err) {
      console.error("Form submission error:", err);
      let errorMessage = "Failed to submit your request. Please try again.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
        if (err.response.data.details) {
          errorMessage += ": " + err.response.data.details.join(", ");
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const problemTypes = [
    "Loan Rejection",
    "Report Error",
    "Low Score",
    "Settlement Update",
    "DPD",
    "Suit File",
    "Other",
  ];

  const processSteps = [
    {
      icon: <Assessment />,
      title: "Credit Report Analysis",
      description:
        "Comprehensive evaluation of your credit report from all major bureaus to identify errors and negative items.",
    },
    {
      icon: <Timeline />,
      title: "Dispute Strategy",
      description:
        "Strategic identification of inaccuracies and development of a customized correction plan.",
    },
    {
      icon: <ContactSupport />,
      title: "Bank Coordination",
      description:
        "Direct communication with banks and credit bureaus to rectify false or outdated information.",
    },
    {
      icon: <TrendingUp />,
      title: "Score Improvement",
      description:
        "Ongoing guidance on credit utilization, payment habits, and score optimization strategies.",
    },
  ];

  const whyChooseUs = [
    {
      icon: <VerifiedUser />,
      title: "Trusted Experts",
      description:
        "India's leading credit repair specialists with proven track record",
    },
    {
      icon: <Security />,
      title: "100% Compliant",
      description: "Ethical processes following all regulatory guidelines",
    },
    {
      icon: <Speed />,
      title: "Fast Results",
      description: "Average score improvement visible within 60-90 days",
    },
    {
      icon: <Timeline />,
      title: "Transparent Updates",
      description: "Regular progress reports and complete visibility",
    },
  ];

  // Add Indian states array
  const indianStates = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  return (
    <>
      <Header />
      <PageBackground>
        {/* Hero Section */}
        <HeroSection>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <FeatureBadge sx={{ mb: 3 }}>
                <CheckCircle sx={{ fontSize: 20, mr: 1 }} />
                Trusted by clients across India
              </FeatureBadge>

              <Typography
                variant="h1"
                sx={{
                  color: "white",
                  fontWeight: 900,
                  mb: 3,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  lineHeight: 1.2,
                  textShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                Transform Your Credit Score.
                <br />
                <Box
                  component="span"
                  sx={{
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Unlock Financial Freedom.
                </Box>
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: "#cbd5e1",
                  maxWidth: "800px",
                  mx: "auto",
                  mb: 5,
                  lineHeight: 1.7,
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                }}
              >
                Expert credit repair services that fix errors, improve your
                score, and restore your financial credibility
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <StyledButton
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  href="#enquiry-form"
                >
                  Get Free Consultation
                </StyledButton>
              </Box>

              {/* Stats Row */}
              <Grid
                container
                spacing={3}
                sx={{ mt: 8, flexDirection: { xs: "column", sm: "row" } }}
                style={{ justifyContent: "center" }}
              >
                <Grid item xs={12} sm={6} md={4} style={{ flex: "1" }}>
                  <StatsCard elevation={0}>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 800, color: "#0ea5e9", mb: 1 }}
                    >
                      95%
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#64748b", fontWeight: 600 }}
                    >
                      Success Rate
                    </Typography>
                  </StatsCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4} style={{ flex: "1" }}>
                  <StatsCard elevation={0}>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 800, color: "#0ea5e9", mb: 1 }}
                    >
                      120+
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#64748b", fontWeight: 600 }}
                    >
                      Points Average Increase
                    </Typography>
                  </StatsCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4} style={{ flex: "1" }}>
                  <StatsCard elevation={0}>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 800, color: "#0ea5e9", mb: 1 }}
                    >
                      60-90
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#64748b", fontWeight: 600 }}
                    >
                      Days to See Results
                    </Typography>
                  </StatsCard>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </HeroSection>

        {/* Why It Matters Section */}
        <SectionBox sx={{ background: "#f8fafc" }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <SectionTitle>Why Your Credit Score Matters</SectionTitle>
              <SectionSubtitle>
                Your credit score is the key to unlocking better financial
                opportunities
              </SectionSubtitle>
            </Box>

            <Grid
              container
              spacing={4}
              sx={{ flexWrap: { xs: "wrap", sm: "nowrap" } }}
            >
              {[
                {
                  title: "Loan Approvals",
                  desc: "Get personal, home, and business loans approved faster",
                  color: "#0ea5e9",
                },
                {
                  title: "Lower Interest Rates",
                  desc: "Save thousands with better rates on credit products",
                  color: "#06b6d4",
                },
                {
                  title: "Credit Card Access",
                  desc: "Qualify for premium cards with higher limits",
                  color: "#8b5cf6",
                },
                {
                  title: "Financial Trust",
                  desc: "Build credibility with lenders and financial institutions",
                  color: "#10b981",
                },
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <ProcessCard elevation={0}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 3,
                        background: `${item.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 32, color: item.color }} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 1, color: "#0f172a" }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#64748b", lineHeight: 1.7 }}
                    >
                      {item.desc}
                    </Typography>
                  </ProcessCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </SectionBox>

        {/* Process Section */}
        <SectionBox>
          <Container style={{ maxWidth: "1300px" }}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <SectionTitle>
                Our Step-by-Step Credit Improvement Process
              </SectionTitle>
              <SectionSubtitle>
                A systematic approach to repairing and improving your credit
                score
              </SectionSubtitle>
            </Box>

            <Grid
              container
              spacing={4}
              sx={{ flexWrap: { xs: "wrap", sm: "nowrap" } }}
            >
              {processSteps.map((step, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <ProcessCard elevation={0}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 3,
                        flexDirection: "column",
                      }}
                    >
                      <IconBox>{step.icon}</IconBox>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mb: 1, color: "#0f172a" }}
                        >
                          {step.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "#64748b", lineHeight: 1.7 }}
                        >
                          {step.description}
                        </Typography>
                      </Box>
                    </Box>
                  </ProcessCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </SectionBox>

        {/* Our Approach */}
        <SectionBox sx={{ background: "#f8fafc" }}>
          {/* Animated Background Elements */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "44%",
              height: "100%",
              background:
                "linear-gradient(135deg, #1796b43b 0%, #0e7490e3 100%)",
              clipPath: "polygon(0% 0, 60% 0, 100% 100%, 0% 100%)",
              zIndex: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                top: "20%",
                left: "10%",
                width: "300px",
                height: "300px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "50%",
                animation: "float 6s ease-in-out infinite",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "15%",
                right: "61%",
                width: "200px",
                height: "200px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "50%",
                animation: "float 8s ease-in-out infinite reverse",
              },
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(-30px)" },
              },
            }}
          />
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <SectionTitle>Our Credit Repair Approach</SectionTitle>
              <SectionSubtitle>
                Personalized solutions for your unique credit challenges
              </SectionSubtitle>
            </Box>

            <Grid
              container
              spacing={4}
              sx={{ flexWrap: { xs: "wrap", sm: "nowrap" } }}
            >
              {[
                {
                  title: "One-to-one expert guidance",
                  icon: <ContactSupport />,
                  color: "#0ea5e9",
                },
                {
                  title: "Ethical and compliant dispute support",
                  icon: <Security />,
                  color: "#06b6d4",
                },
                {
                  title: "Regular progress updates",
                  icon: <Timeline />,
                  color: "#8b5cf6",
                },
                {
                  title: "Focus on long-term credit health",
                  icon: <TrendingUp />,
                  color: "#10b981",
                },
              ].map((feature, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  key={index}
                  sx={{ flex: { xs: "auto", sm: "1" } }}
                >
                  <PlanCard>
                    <CardContent sx={{ p: 4, textAlign: "center" }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          background: `${feature.color}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 3,
                        }}
                      >
                        {React.cloneElement(feature.icon, {
                          sx: { fontSize: 40, color: feature.color },
                        })}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 1, color: "#0f172a" }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "#64748b", mb: 2 }}
                      ></Typography>
                    </CardContent>
                  </PlanCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </SectionBox>

        {/* Why Choose Us */}
        <SectionBox>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <SectionTitle>Why Choose Credit Dost</SectionTitle>
              <SectionSubtitle>
                India’s leading credit repair specialists
              </SectionSubtitle>
            </Box>

            <Grid
              container
              spacing={4}
              sx={{ flexWrap: { xs: "wrap", sm: "nowrap" } }}
            >
              {whyChooseUs.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box sx={{ textAlign: "center" }}>
                    <IconBox sx={{ mx: "auto" }}>{item.icon}</IconBox>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 1, color: "#0f172a" }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#64748b", lineHeight: 1.7 }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </SectionBox>

        <TestimonialSection />

        {/* Contact Form */}
        <SectionBox id="enquiry-form">
          <Container maxWidth="md">
            <StyledCard>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      color: "#0f172a",
                      mb: 1,
                    }}
                  >
                    Get Your Free Credit Report Review
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "1.1rem" }}>
                    Start your journey to a better credit score today
                  </Typography>
                </Box>

                {success ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Box sx={{ mb: 3 }}>
                      <CheckCircle sx={{ fontSize: 80, color: "#10b981" }} />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{ mb: 2, fontWeight: 700, color: "#0f172a" }}
                    >
                      Thank You!
                    </Typography>
                    <Typography
                      sx={{ mb: 2, color: "#64748b", fontSize: "1.1rem" }}
                    >
                      Our credit repair experts will contact you within 24 hours
                    </Typography>
                    <Typography sx={{ color: "#64748b" }}>
                      Check your email for confirmation details
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {error && (
                      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                      </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        {/* Full Name and Mobile Number - Stacked on mobile, side-by-side on desktop */}
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "&:hover fieldset": {
                                  borderColor: "#0ea5e9",
                                },
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Mobile Number"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            required
                            variant="outlined"
                            type="tel"
                            inputProps={{ maxLength: 10 }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "&:hover fieldset": {
                                  borderColor: "#0ea5e9",
                                },
                              },
                            }}
                          />
                        </Grid>

                        {/* Email ID and Current Credit Score - Stacked on mobile, side-by-side on desktop */}
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Email ID"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            variant="outlined"
                            type="email"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "&:hover fieldset": {
                                  borderColor: "#0ea5e9",
                                },
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Current Credit Score (Optional)"
                            name="creditScore"
                            value={formData.creditScore}
                            onChange={handleChange}
                            variant="outlined"
                            type="number"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "&:hover fieldset": {
                                  borderColor: "#0ea5e9",
                                },
                              },
                            }}
                          />
                        </Grid>

                        {/* City and State - Stacked on mobile, side-by-side on desktop */}
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "&:hover fieldset": {
                                  borderColor: "#0ea5e9",
                                },
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6} style={{ minWidth: "200px" }}>
                          <FormControl fullWidth>
                            <InputLabel>State</InputLabel>
                            <Select
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                              required
                              sx={{
                                borderRadius: 2,
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#0ea5e9",
                                },
                              }}
                            >
                              <MenuItem value="">Select State</MenuItem>
                              {indianStates.map((state) => (
                                <MenuItem key={state} value={state}>
                                  {state}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Problem Type (full width) */}
                        <Grid item xs={12} style={{ width: "100%" }}>
                          <FormControl fullWidth>
                            <InputLabel>Problem Type</InputLabel>
                            <Select
                              name="problemType"
                              value={formData.problemType}
                              onChange={handleChange}
                              required
                              sx={{
                                borderRadius: 2,
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#0ea5e9",
                                },
                              }}
                            >
                              <MenuItem value="">Select Problem</MenuItem>
                              {problemTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Additional Information (full width text area) */}
                        <Grid item xs={12} style={{ width: "100%" }}>
                          <TextField
                            fullWidth
                            label="Additional Information (Optional)"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            variant="outlined"
                            multiline
                            rows={4}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "&:hover fieldset": {
                                  borderColor: "#0ea5e9",
                                },
                              },
                            }}
                          />
                        </Grid>

                        {/* Language, Occupation, and Income - Stacked on mobile, side-by-side on desktop */}
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControl fullWidth style={{ minWidth: "200px" }}>
                            <InputLabel>Language</InputLabel>
                            <Select
                              name="language"
                              value={formData.language}
                              onChange={handleChange}
                              sx={{
                                borderRadius: 2,
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#0ea5e9",
                                },
                              }}
                            >
                              <MenuItem value="">Select Language</MenuItem>
                              <MenuItem value="english">English</MenuItem>
                              <MenuItem value="hindi">Hindi</MenuItem>
                              <MenuItem value="telugu">Telugu</MenuItem>
                              <MenuItem value="tamil">Tamil</MenuItem>
                              <MenuItem value="punjabi">Punjabi</MenuItem>
                              <MenuItem value="marathi">Marathi</MenuItem>
                              <MenuItem value="gujarati">Gujarati</MenuItem>
                              <MenuItem value="bengali">Bengali</MenuItem>
                              <MenuItem value="kannada">Kannada</MenuItem>
                              <MenuItem value="malayalam">Malayalam</MenuItem>
                              <MenuItem value="other">Other</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <FormControl fullWidth style={{ minWidth: "200px" }}>
                            <InputLabel>Occupation</InputLabel>
                            <Select
                              name="occupation"
                              value={formData.occupation}
                              onChange={handleChange}
                              sx={{
                                borderRadius: 2,
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#0ea5e9",
                                },
                              }}
                            >
                              <MenuItem value="">Select Occupation</MenuItem>
                              <MenuItem value="salaried">Salaried</MenuItem>
                              <MenuItem value="self_employed">Self Employed</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            fullWidth
                            label="Monthly Income"
                            name="income"
                            value={formData.income}
                            onChange={handleChange}
                            variant="outlined"
                            placeholder="Enter amount"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "&:hover fieldset": {
                                  borderColor: "#0ea5e9",
                                },
                              },
                            }}
                          />
                        </Grid>

                        {/* Authorization checkbox */}
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="authorization"
                                checked={formData.authorization}
                                onChange={handleChange}
                                required
                                sx={{
                                  color: "#0ea5e9",
                                  "&.Mui-checked": {
                                    color: "#0ea5e9",
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography
                                variant="body2"
                                sx={{ color: "#64748b" }}
                              >
                                I authorize Credit Dost to contact me regarding
                                credit score repair assistance
                              </Typography>
                            }
                          />
                        </Grid>
                      </Grid>

                      <StyledButton
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        fullWidth
                        sx={{ mt: 3 }}
                      >
                        {loading ? (
                          <CircularProgress size={24} sx={{ color: "white" }} />
                        ) : (
                          "Submit Enquiry"
                        )}
                      </StyledButton>

                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: "center",
                          mt: 2,
                          color: "#94a3b8",
                        }}
                      >
                        Your information is secure and will never be shared
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </StyledCard>
          </Container>
        </SectionBox>

        {/* FAQ Section */}
        <SectionBox sx={{ background: "#f8fafc" }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <SectionTitle>Common Problems We Solve</SectionTitle>
              <SectionSubtitle>
                Expert solutions for every credit challenge
              </SectionSubtitle>
            </Box>

            <Grid container spacing={3} style={{ justifyContent: "center" }}>
              {[
                "Incorrect loan or credit card entries",
                'Settled accounts showing as "Written Off"',
                "Overdue or duplicate EMI records",
                "Incorrect personal information (PAN, DOB, Address)",
                "Old closed accounts not updated",
                "Wrong loan amounts or balances",
                "Hard inquiries from rejected applications",
                "Identity theft or fraud reporting",
              ].map((problem, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      border: "2px solid #e2e8f0",
                      transition: "all 0.3s ease",
                      height: "100%",
                      "&:hover": {
                        borderColor: "#0ea5e9",
                        transform: "translateX(8px)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          background:
                            "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <CheckCircle sx={{ color: "white", fontSize: 24 }} />
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "#0f172a" }}
                      >
                        {problem}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </SectionBox>

        {/* Contact Section */}
        <SectionBox>
          <Container style={{ maxWidth: "1200px" }}>
            <Box
              sx={{
                textAlign: "center",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: 4,
                p: 6,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography
                  variant="h4"
                  sx={{ color: "white", fontWeight: 800, mb: 3 }}
                >
                  Need Help? We're Here For You
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={4} style={{ flex: "1" }}>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ color: "#0ea5e9", fontWeight: 700, mb: 1 }}
                      >
                        📞 Call Us
                      </Typography>
                      <Typography sx={{ color: "#cbd5e1" }}>
                        +91 92174-69202
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} style={{ flex: "1" }}>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ color: "#0ea5e9", fontWeight: 700, mb: 1 }}
                      >
                        📧 Email Us
                      </Typography>
                      <Typography sx={{ color: "#cbd5e1" }}>
                        info@creditdost.co.in
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} style={{ flex: "1" }}>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ color: "#0ea5e9", fontWeight: 700, mb: 1 }}
                      >
                        🕒 Working Hours
                      </Typography>
                      <Typography sx={{ color: "#cbd5e1" }}>
                        Mon-Sat: 10 AM - 6 PM
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Typography variant="body1" sx={{ color: "#94a3b8", mb: 3 }}>
                  Expert consultation available • Quick response guaranteed
                </Typography>
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -50,
                  left: -50,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
                }}
              />
            </Box>
          </Container>
        </SectionBox>

        {/* Footer */}
      </PageBackground>

      <HomePageFooter />
    </>
  );
};

export default CreditScoreRepairPage;
