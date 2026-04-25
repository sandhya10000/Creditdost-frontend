import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  styled,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CheckCircle,
  TrendingUp,
  VerifiedUser,
  Build,
  SupportAgent,
  EmojiEvents,
  Phone,
  Email,
  LocationOn,
  ArrowForward,
} from "@mui/icons-material";
import Header from "./homepage/Header";
import HomePageFooter from "./homepage/HomePageFooter";
import api from "../services/api";
import RegistrationForm from "./common/RegistrationForm";
import { useAuth } from "../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import FranchiseSuccessStories from "./franchise/FranchiseSuccessStories.jsx";

// Custom styled components for unique design
const PageWrapper = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)",
  minHeight: "100vh",
  padding: theme.spacing(2, 0),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-10%",
    left: "-10%",
    width: "400px",
    height: "400px",
    background:
      "radial-gradient(circle, rgba(76, 175, 80, 0.15) 0%, transparent 70%)",
    borderRadius: "50%",
    animation: "pulse 8s ease-in-out infinite",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-15%",
    right: "-10%",
    width: "500px",
    height: "500px",
    background:
      "radial-gradient(circle, rgba(33, 150, 243, 0.15) 0%, transparent 70%)",
    borderRadius: "50%",
    animation: "pulse 10s ease-in-out infinite 2s",
  },
  "@keyframes pulse": {
    "0%, 100%": {
      transform: "scale(1)",
      opacity: 1,
    },
    "50%": {
      transform: "scale(1.1)",
      opacity: 0.8,
    },
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background:
    "linear-gradient(135deg, #0f1b5f 0%, #1a237e 30%, #283593 70%, #303f9f 100%)",
  borderRadius: "24px",
  padding: theme.spacing(8, 4),
  position: "relative",
  overflow: "hidden",
  marginBottom: theme.spacing(8),
  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 20% 50%, rgba(76, 175, 80, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(33, 150, 243, 0.2) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: `conic-gradient(
      transparent, 
      rgba(76, 175, 80, 0.1), 
      transparent 30%
    )`,
    animation: "rotate 15s linear infinite",
    zIndex: 0,
  },
  "@keyframes rotate": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: "24px",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  background: "white",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  marginBottom: theme.spacing(8),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "4px",
    background: "linear-gradient(90deg, #4caf50, #2196f3)",
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
    "&::before": {
      transform: "scaleX(1)",
    },
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: "20px",
  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
  border: "1px solid #e9ecef",
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
    background: "linear-gradient(90deg, #4caf50, #2196f3)",
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
    borderColor: "#4caf50",
    "&::before": {
      transform: "scaleX(1)",
    },
  },
}));

const StepCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "20px",
  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
  border: "2px solid #e9ecef",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  height: "100%",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "4px",
    background: "linear-gradient(90deg, #4caf50, #2196f3)",
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)",
    borderColor: "#4caf50",
    "&::before": {
      transform: "scaleX(1)",
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.8, 4),
  borderRadius: "50px",
  fontWeight: 700,
  fontSize: "1.1rem",
  textTransform: "none",
  transition: "all 0.3s ease",
  background: "linear-gradient(135deg, #4caf50 0%, #2196f3 100%)",
  boxShadow: "0 8px 24px rgba(76, 175, 80, 0.3)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 12px 32px rgba(76, 175, 80, 0.4)",
    background: "linear-gradient(135deg, #43a047 0%, #1e88e5 100%)",
  },
}));

const FormCard = styled(Card)(({ theme }) => ({
  borderRadius: "24px",
  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
  border: "1px solid #e0e0e0",
  background: "white",
  overflow: "hidden",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "5px",
    background: "linear-gradient(90deg, #4caf50, #2196f3)",
  },
}));

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: "20px",
  background: "linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 100%)",
  border: "1px solid #c8e6c9",
  position: "relative",
  height: "100%",
  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.05)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 20,
    left: 20,
    fontSize: "4rem",
    color: "#4caf50",
    opacity: 0.2,
    fontFamily: "Georgia, serif",
  },
}));

const FranchiseOpportunityPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    city: "",
    state: "",
    profession: "",
    message: "",
    consent: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

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

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Form validation would go here

    try {
      // Submit to backend API
      await api.post("/forms/franchise-opportunity", formData);
      setSubmitted(true);
      // Reset form
      setFormData({
        fullName: "",
        mobileNumber: "",
        email: "",
        city: "",
        state: "",
        profession: "",
        message: "",
        consent: false,
      });
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Failed to submit your request. Please try again.");
    }
  };

  const benefits = [
    {
      icon: <VerifiedUser sx={{ fontSize: 40, color: "#4caf50" }} />,
      title: "Ready-to-Run Business Model",
      description:
        " Launch your credit repair business with a proven structure, processes, and workflows already in place.",
    },
    {
      icon: <Build sx={{ fontSize: 40, color: "#2196f3" }} />,
      title: "Complete Skill-Based Training",
      description:
        " Step-by-step training on credit reports, disputes, customer handling, and business operations — no prior finance experience required.",
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: "#ff9800" }} />,
      title: "Centralized Technology Platform",
      description:
        " Get access to CRM, case tracking, customer management, and automation tools to run your business smoothly.",
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: "#ff9800" }} />,
      title: "Brand Trust & Market Presence",
      description:
        "Operate under the Credit Dost brand with nationwide visibility and growing customer trust.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Apply Online",
      description: "Fill the franchise enquiry form below.",
    },
    {
      number: "2",
      title: "Attend Orientation",
      description:
        "Get a detailed overview of the business model and earning potential.",
    },
    {
      number: "3",
      title: "Complete Training & Certification",
      description:
        "Learn how to manage client cases ethically and effectively.",
    },
    {
      number: "4",
      title: "Start Your Business",
      description:
        "Begin serving clients using our system and brand credibility.",
    },
    {
      number: "5",
      title: "Scale with Support",
      description:
        "Expand your network, grow your income, and become a key partner in our nationwide mission.",
    },
  ];

  const supportFeatures = [
    "Business development and lead generation guidance",
    "Legal and compliance support",
    "Regular training updates and new learning modules",
    "Marketing materials and promotional assets",
    "Dedicated partner success team for assistance",
  ];

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
      <PageWrapper
        style={{
          paddingLeft: "0 !important",
          paddingRight: "0 !important",
        }}
      >
        <Container
          style={{
            maxWidth: "1400px",
            padding: "0px",
          }}
        >
          {/* Hero Section */}
          <HeroSection>
            <Grid
              container
              spacing={6}
              alignItems="center"
              sx={{
                position: "relative",
                zIndex: 1,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Grid item xs={12} md={7} style={{ flex: "1" }}>
                <Box
                  sx={{ position: "relative", display: "inline-block", mb: 2 }}
                >
                  <Typography
                    component="span"
                    sx={{
                      color: "#4caf50",
                      fontWeight: 700,
                      fontSize: { xs: "1rem", md: "1.2rem" },
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    FUTURE OF FINANCE
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "8px",
                      background: "linear-gradient(90deg, #4caf50, #2196f3)",
                      borderRadius: "4px",
                      opacity: 0.3,
                      zIndex: 0,
                    }}
                  />
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    color: "white",
                    fontWeight: 800,
                    fontSize: { xs: "2rem", md: "3rem" },
                    lineHeight: 1.2,
                    mb: 3,
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  Franchise Opportunity with Credit Dost
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    color: "#bbdefb",
                    fontWeight: 600,
                    fontSize: { xs: "1.2rem", md: "2rem" },
                    mb: 4,
                  }}
                >
                  Start Your Own Credit Score Repair Business
                </Typography>

                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.95)",
                    fontSize: "1.1rem",
                    lineHeight: 1.7,
                    mb: 4,
                    maxWidth: "90%",
                  }}
                >
                  India's credit awareness and repair industry is growing
                  rapidly — and Credit Dost is at the forefront of this
                  transformation. We are inviting passionate individuals,
                  entrepreneurs, and financial professionals to partner with
                  Credit Dost and build a rewarding business helping people
                  improve their credit scores and financial confidence.
                </Typography>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
                  <StyledButton
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    href="#franchise-form"
                    sx={{
                      py: 1.5,
                      fontSize: { xs: "1rem", md: "1.1rem" },
                    }}
                  >
                    Become a Partner
                  </StyledButton>
                </Box>
              </Grid>

              <Grid item xs={12} md={5} style={{ flex: "1" }}>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
                    transform:
                      "perspective(1000px) rotateY(-5deg) rotateX(5deg)",
                    transition: "transform 0.5s ease",
                    "&:hover": {
                      transform: "perspective(1000px) rotateY(0) rotateX(0)",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="/images/franchise-new.jpeg"
                    alt="Franchise Opportunity"
                    sx={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      position: "relative",
                      zIndex: 0,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    justifyContent: "space-evenly",
                    marginTop: "43px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: "#4caf50",
                        boxShadow: "0 0 0 4px rgba(76, 175, 80, 0.3)",
                        animation: "pulse 2s infinite",
                      }}
                    />
                    <Typography sx={{ color: "white", fontWeight: 500 }}>
                      500+ Partners
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: "#2196f3",
                        boxShadow: "0 0 0 4px rgba(33, 150, 243, 0.3)",
                        animation: "pulse 2s infinite 0.5s",
                      }}
                    />
                    <Typography sx={{ color: "white", fontWeight: 500 }}>
                      98% Success Rate
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Floating Elements */}
            <Box
              sx={{
                position: "absolute",
                top: "20%",
                left: "5%",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "rgba(76, 175, 80, 0.6)",
                boxShadow: "0 0 0 8px rgba(76, 175, 80, 0.2)",
                animation: "float 4s ease-in-out infinite",
                zIndex: 0,
              }}
            />

            <Box
              sx={{
                position: "absolute",
                bottom: "15%",
                right: "8%",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "rgba(33, 150, 243, 0.6)",
                boxShadow: "0 0 0 12px rgba(33, 150, 243, 0.2)",
                animation: "float 5s ease-in-out infinite 1s",
                zIndex: 0,
              }}
            />

            <Box
              sx={{
                position: "absolute",
                top: "10%",
                right: "15%",
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                background: "rgba(255, 152, 0, 0.6)",
                boxShadow: "0 0 0 6px rgba(255, 152, 0, 0.2)",
                animation: "float 6s ease-in-out infinite 2s",
                zIndex: 0,
              }}
            />

            <style>
              {`
              @keyframes float {
                0%, 100% {
                  transform: translateY(0) translateX(0);
                }
                50% {
                  transform: translateY(-20px) translateX(10px);
                }
              }
              
              @keyframes pulse {
                0%, 100% {
                  transform: scale(1);
                  opacity: 1;
                }
                50% {
                  transform: scale(1.2);
                  opacity: 0.7;
                }
              }
            `}
            </style>
          </HeroSection>

          {/* Benefits Section */}
          <SectionCard>
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Box
                  sx={{ display: "inline-block", position: "relative", mb: 2 }}
                >
                  <Typography
                    component="span"
                    sx={{
                      color: "#4caf50",
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}
                  >
                    PARTNER BENEFITS
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "-5px",
                      left: 0,
                      width: "100%",
                      height: "3px",
                      background: "linear-gradient(90deg, #4caf50, #2196f3)",
                      borderRadius: "2px",
                    }}
                  />
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    textAlign: "center",
                    fontWeight: 800,
                    color: "#1a237e",
                    mb: 3,
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  Why Partner with Credit Dost?
                </Typography>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    maxWidth: "800px",
                    mx: "auto",
                    lineHeight: 1.7,
                  }}
                >
                  Credit Dost is not just a franchise — it’s a complete business
                  ecosystem designed to help partners build a sustainable,
                  long-term income in the fast-growing credit repair industry.
                </Typography>
              </Box>

              <Grid
                container
                spacing={4}
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                {benefits.map((benefit, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={index}
                    style={{ flex: "1" }}
                  >
                    <FeatureCard elevation={0}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          background: "rgba(76, 175, 80, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                          mx: "auto",
                        }}
                      >
                        {benefit.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
                      >
                        {benefit.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#666",
                          textAlign: "center",
                          lineHeight: 1.6,
                        }}
                      >
                        {benefit.description}
                      </Typography>
                    </FeatureCard>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </SectionCard>

          {/* Who Can Join Section */}
          <SectionCard>
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Box
                  sx={{ display: "inline-block", position: "relative", mb: 2 }}
                >
                  <Typography
                    component="span"
                    sx={{
                      color: "#4caf50",
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}
                  >
                    WHO CAN JOIN
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "-5px",
                      left: 0,
                      width: "100%",
                      height: "3px",
                      background: "linear-gradient(90deg, #4caf50, #2196f3)",
                      borderRadius: "2px",
                    }}
                  />
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    textAlign: "center",
                    fontWeight: 800,
                    color: "#1a237e",
                    mb: 3,
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  Who Can Become a Credit Dost Partner?
                </Typography>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    maxWidth: "800px",
                    mx: "auto",
                    lineHeight: 1.7,
                  }}
                >
                  This opportunity is open to individuals from all backgrounds
                  who want to build a meaningful and income-generating career in
                  finance.
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {[
                  "A financial consultant, banker, or loan agent",
                  "A call centre or outsourcing company looking to add a new vertical",
                  "A self-motivated individual wanting to start an ethical home-based business",
                  "A trainer, coach, or educator interested in financial empowerment",
                ].map((item, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        p: 3,
                        background: "rgba(76, 175, 80, 0.05)",
                        borderRadius: "12px",
                        border: "1px solid rgba(76, 175, 80, 0.1)",
                      }}
                    >
                      <CheckCircle sx={{ color: "#4caf50", mt: 0.5 }} />
                      <Typography sx={{ color: "#333", fontWeight: 500 }}>
                        {item}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#1a237e",
                    fontStyle: "italic",
                  }}
                >
                  No prior credit or banking experience is required — we'll
                  train and guide you every step of the way.
                </Typography>
              </Box>
            </CardContent>
          </SectionCard>

          {/* What You Get Section */}
          <SectionCard>
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Box
                  sx={{ display: "inline-block", position: "relative", mb: 2 }}
                >
                  <Typography
                    component="span"
                    sx={{
                      color: "#4caf50",
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}
                  >
                    PARTNER SUPPORT
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "-5px",
                      left: 0,
                      width: "100%",
                      height: "3px",
                      background: "linear-gradient(90deg, #4caf50, #2196f3)",
                      borderRadius: "2px",
                    }}
                  />
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    textAlign: "center",
                    fontWeight: 800,
                    color: "#1a237e",
                    mb: 3,
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  What You Get as a Partner
                </Typography>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    maxWidth: "800px",
                    mx: "auto",
                    lineHeight: 1.7,
                  }}
                >
                  A complete business support ecosystem designed to help you
                  launch, operate, and scale your credit repair franchise with
                  confidence.
                </Typography>
              </Box>

              <Grid
                container
                spacing={3}
                sx={{
                  flexDirection: { xs: "column", md: "row" },
                  flexWrap: { xs: "wrap", md: "nowrap" },
                }}
              >
                {[
                  {
                    area: "Training & Certification",
                    description:
                      "Get structured, hands-on training to become a Certified Credit Score Repair Consultant, covering credit reports, dispute handling, compliance, and customer management.",
                  },
                  {
                    area: "Tools & Resources",
                    description:
                      "Access ready-to-use CRM systems, dispute templates, report formats, and operational tools to manage clients efficiently from day one.",
                  },
                  {
                    area: "Marketing Support",
                    description:
                      "Receive co-branded creatives, digital marketing guidance, and growth strategies to help you generate leads and build local brand visibility.",
                  },
                  {
                    area: "Technology Access",
                    description:
                      "Leverage AI-enabled backend systems for case tracking, client progress monitoring, documentation flow, and performance insights.",
                  },
                  {
                    area: "Dedicated Mentorship",
                    description:
                      "Benefit from ongoing mentoring, business review calls, and operational support from the Credit Dost core team to help you grow sustainably.",
                  },
                ].map((item, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Box
                      sx={{
                        p: 3,
                        background: "white",
                        borderRadius: "12px",
                        border: "1px solid #e0e0e0",
                        height: "100%",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#1a237e", mb: 1 }}
                      >
                        {item.area}
                      </Typography>
                      <Typography sx={{ color: "#666" }}>
                        {item.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </SectionCard>

          {/* How It Works Section */}
          <SectionCard>
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Box
                  sx={{ display: "inline-block", position: "relative", mb: 2 }}
                >
                  <Typography
                    component="span"
                    sx={{
                      color: "#4caf50",
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}
                  >
                    GETTING STARTED
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "-5px",
                      left: 0,
                      width: "100%",
                      height: "3px",
                      background: "linear-gradient(90deg, #4caf50, #2196f3)",
                      borderRadius: "2px",
                    }}
                  />
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    textAlign: "center",
                    fontWeight: 800,
                    color: "#1a237e",
                    mb: 3,
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  How It Works – Step by Step
                </Typography>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    maxWidth: "800px",
                    mx: "auto",
                    lineHeight: 1.7,
                  }}
                >
                  A clear path to building your successful credit repair
                  business
                </Typography>
              </Box>

              <Grid
                container
                spacing={4}
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                {steps.map((step, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={index}
                    style={{ flex: "1" }}
                  >
                    <StepCard elevation={0}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #4caf50, #2196f3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "1.5rem",
                          mb: 2,
                        }}
                      >
                        {step.number}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 1, color: "#1a237e" }}
                      >
                        {step.title}
                      </Typography>
                      <Typography sx={{ color: "#666" }}>
                        {step.description}
                      </Typography>
                    </StepCard>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </SectionCard>

          {/* Support Section */}
          <SectionCard>
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Box
                  sx={{ display: "inline-block", position: "relative", mb: 2 }}
                >
                  <Typography
                    component="span"
                    sx={{
                      color: "#4caf50",
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}
                  >
                    ONGOING SUPPORT
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "-5px",
                      left: 0,
                      width: "100%",
                      height: "3px",
                      background: "linear-gradient(90deg, #4caf50, #2196f3)",
                      borderRadius: "2px",
                    }}
                  />
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    textAlign: "center",
                    fontWeight: 800,
                    color: "#1a237e",
                    mb: 3,
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  Support You Can Count On
                </Typography>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    maxWidth: "800px",
                    mx: "auto",
                    lineHeight: 1.7,
                  }}
                >
                  Our partners receive continuous support across every business
                  stage
                </Typography>
              </Box>

              <Grid container spacing={2} justifyContent="center">
                {supportFeatures.map((feature, index) => (
                  <Grid item xs={12} md={10} key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        background: "rgba(33, 150, 243, 0.05)",
                        borderRadius: "8px",
                      }}
                    >
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #2196f3, #4caf50)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckCircle sx={{ color: "white", fontSize: 16 }} />
                      </Box>
                      <Typography sx={{ color: "#333" }}>{feature}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </SectionCard>

          {/* Testimonials Section */}
          <SectionCard>
            <CardContent style={{ paddingTop: "40px" }}>
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Box
                  sx={{ display: "inline-block", position: "relative", mb: 2 }}
                >
                  <Typography
                    component="span"
                    sx={{
                      color: "#4caf50",
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}
                  >
                    PARTNER STORIES
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "-5px",
                      left: 0,
                      width: "100%",
                      height: "3px",
                      background: "linear-gradient(90deg, #4caf50, #2196f3)",
                      borderRadius: "2px",
                    }}
                  />
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    textAlign: "center",
                    fontWeight: 800,
                    color: "#1a237e",
                    mb: 3,
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  Success Stories
                </Typography>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: "1.2rem",
                    maxWidth: "800px",
                    mx: "auto",
                    lineHeight: 1.7,
                  }}
                >
                  Hear from our successful partners across India
                </Typography>
              </Box>

              <FranchiseSuccessStories />
            </CardContent>
          </SectionCard>

          {/* Contact Section */}
          <SectionCard>
            <CardContent sx={{ p: { xs: 2, md: 5 } }} id="franchise-form">
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Box
                  sx={{ display: "inline-block", position: "relative", mb: 2 }}
                >
                  <Typography
                    component="span"
                    sx={{
                      color: "#4caf50",
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}
                  >
                    GET IN TOUCH
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "-5px",
                      left: 0,
                      width: "100%",
                      height: "3px",
                      background: "linear-gradient(90deg, #4caf50, #2196f3)",
                      borderRadius: "2px",
                    }}
                  />
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    textAlign: "center",
                    fontWeight: 800,
                    color: "#1a237e",
                    mb: 3,
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  Join the Credit Dost Network
                </Typography>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: "1.2rem",
                    maxWidth: "800px",
                    mx: "auto",
                    lineHeight: 1.7,
                  }}
                >
                  Become part of a growing network of Credit Score Repair
                  Professionals across India. Together, we can empower
                  individuals, educate customers, and build a financially
                  stronger nation.
                </Typography>
              </Box>

              <Grid
                container
                spacing={6}
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                <Grid item xs={12} md={5} style={{ flex: "1" }}>
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #1a237e, #283593)",
                      borderRadius: "16px",
                      p: 4,
                      color: "white",
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}
                    >
                      Contact for Partnership Enquiries
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      <Phone sx={{ color: "#4caf50" }} />
                      <Typography>Partnership Desk: +91 92174-69202</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      <Email sx={{ color: "#4caf50" }} />
                      <Typography>Email: info@creditdost.co.in</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <LocationOn sx={{ color: "#4caf50" }} />
                      <Typography>India-wide Operations</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={7} style={{ flex: "1" }}>
                  <FormCard>
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          mb: 3,
                          textAlign: "center",
                          color: "#1a237e",
                        }}
                      >
                        📩 Ready to Start? Create Your Account
                      </Typography>

                      {submitted ? (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <CheckCircle
                            sx={{ fontSize: 80, color: "#4caf50", mb: 2 }}
                          />
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, mb: 2 }}
                          >
                            Registration Successful!
                          </Typography>
                          <Typography sx={{ color: "#666", mb: 3 }}>
                            Welcome to Credit Dost! You have been registered
                            successfully.
                          </Typography>
                          <Typography sx={{ color: "#666", mb: 2 }}>
                            Join our exclusive WhatsApp group for partners to
                            connect with fellow franchisees and get instant
                            support.
                          </Typography>
                          <Button
                            variant="contained"
                            href={
                              "https://chat.whatsapp.com/J9D0d2qF1PHFiecQyFw7PW"
                            }
                            target="_blank"
                            sx={{
                              background:
                                "linear-gradient(135deg, #25D366, #128C7E)",
                              mb: 0,
                              mr: 2,
                              py: 1.2,
                              fontSize: { xs: "0.9rem", md: "1rem" },
                            }}
                          >
                            Join WhatsApp Group
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => {
                              setSubmitted(false);
                              navigate("/");
                            }}
                            sx={{
                              background:
                                "linear-gradient(135deg, #4caf50, #2196f3)",
                              py: 1.2,
                              fontSize: { xs: "0.9rem", md: "1rem" },
                            }}
                          >
                            Go to Home
                          </Button>
                        </Box>
                      ) : (
                        <RegistrationForm
                          onSubmit={async (registrationData) => {
                            try {
                              // Call the actual registration function
                              await register({
                                name: registrationData.name,
                                email: registrationData.email,
                                phone: registrationData.phone,
                                state: registrationData.state,
                                pincode: registrationData.pincode,
                                language: registrationData.language,
                                password: registrationData.password,
                              });

                              // After successful registration, submit franchise inquiry
                              const franchiseData = {
                                fullName: registrationData.name || "",
                                mobileNumber: registrationData.phone || "",
                                email: registrationData.email || "",
                                city:
                                  registrationData.state ||
                                  registrationData.pincode ||
                                  "", // Use state first, then pincode as city since RegistrationForm doesn't have city field
                                state: registrationData.state || "",
                                profession: "Franchise Opportunity Inquiry", // Indicate this is a franchise inquiry
                                message: "Interested in franchise opportunity",
                                consent: true,
                              };

                              await api.post(
                                "/forms/franchise-opportunity",
                                franchiseData,
                              );
                              setSubmitted(true);
                              return Promise.resolve();
                            } catch (error) {
                              console.error("Registration error:", error);
                              // Check if this is a validation error from the franchise opportunity form
                              if (
                                error.response &&
                                error.response.status === 400
                              ) {
                                // Still consider registration successful if user was registered but franchise inquiry failed
                                try {
                                  const franchiseData = {
                                    fullName: registrationData.name || "",
                                    mobileNumber: registrationData.phone || "",
                                    email: registrationData.email || "",
                                    city:
                                      registrationData.state ||
                                      registrationData.pincode ||
                                      "", // Use state first, then pincode as city since RegistrationForm doesn't have city field
                                    state: registrationData.state || "",
                                    profession: "Franchise Opportunity Inquiry",
                                    message:
                                      "Interested in franchise opportunity",
                                    consent: true,
                                  };

                                  await api.post(
                                    "/forms/franchise-opportunity",
                                    franchiseData,
                                  );
                                  setSubmitted(true);
                                  return Promise.resolve();
                                } catch (franchiseError) {
                                  console.error(
                                    "Franchise opportunity submission error:",
                                    franchiseError,
                                  );
                                  // If franchise submission fails but registration succeeded, we still consider it a success
                                  setSubmitted(true);
                                  // Log the specific error for debugging
                                  console.log(
                                    "Franchise opportunity form data:",
                                    {
                                      fullName: registrationData.name,
                                      mobileNumber: registrationData.phone,
                                      email: registrationData.email,
                                      city:
                                        registrationData.state ||
                                        registrationData.pincode ||
                                        "",
                                      state: registrationData.state,
                                      profession:
                                        "Franchise Opportunity Inquiry",
                                    },
                                  );
                                  return Promise.resolve();
                                }
                              } else {
                                return Promise.reject(error);
                              }
                            }
                          }}
                          submitButtonText="Register Now"
                          formTitle="Create Your Account"
                        />
                      )}
                    </CardContent>
                  </FormCard>
                </Grid>
              </Grid>
            </CardContent>
          </SectionCard>
        </Container>
      </PageWrapper>
      <HomePageFooter />
    </>
  );
};

export default FranchiseOpportunityPage;
