import React, { useState } from "react";
import api from "../services/api";

import {
  Verified,
  // Star,
} from "@mui/icons-material";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Box as BoxUI,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  styled,
  Checkbox,
  FormControlLabel,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Check,
  TrendingUp,
  Home,
  School,
  AttachMoney,
  People,
  EmojiEvents,
  AutoAwesome,
  ArrowForward,
  Download,
  Chat,
  Star,
  TrackChanges,
  FlashOn,
  Person,
  Email,
  Phone,
  LocationOn,
  Work,
  AccountBalance,
  CreditCard,
  CheckCircle,
  TrendingUp as TrendingUpIcon,
  Security,
  SupportAgent,
  VerifiedUser,
  Star as StarIcon,
  AttachMoney as MoneyIcon,
  Business,
  DriveEta,
  CreditScore,
} from "@mui/icons-material";
import Header from "./homepage/Header";
import HomePageFooter from "./homepage/HomePageFooter";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  border: "1px solid rgba(0,0,0,0.03)",
  background: "white",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  height: "100%",
  animation: "fadeIn 0.6s ease-out",
  "@keyframes fadeIn": {
    "0%": { opacity: 0, transform: "translateY(20px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.8, 4.5),
  borderRadius: 16,
  fontWeight: 700,
  fontSize: "1.1rem",
  textTransform: "none",
  transition: "all 0.4s ease",
  background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
  boxShadow: "0 10px 25px rgba(14, 165, 233, 0.4)",
  "&:hover": {
    transform: "translateY(-5px) scale(1.02)",
    boxShadow: "0 15px 35px rgba(14, 165, 233, 0.5)",
    background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
  },
  "&:disabled": {
    background: "#cbd5e1",
    transform: "none",
    boxShadow: "none",
  },
}));

const FormSection = styled(StyledCard)(({ theme }) => ({
  padding: theme.spacing(5),
  marginBottom: theme.spacing(6),
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  animation: "fadeIn 0.8s ease-out",
  "@keyframes fadeIn": {
    "0%": { opacity: 0, transform: "translateY(30px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
}));

// Indian states list
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const SuvidhaCentrePage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    whatsappNumber: "",
    email: "",
    city: "",
    state: "",
    pincode: "",
    occupation: "",
    financeExperience: "",
    smartphoneLaptop: "",
    communication: "",
    investmentReadiness: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If it's the mobile number field, only allow digits and limit to 10
    if (
      name === "mobileNumber" ||
      name === "whatsappNumber" ||
      name === "pincode"
    ) {
      let numericValue = value.replace(/[^0-9]/g, "");
      if (name === "mobileNumber" || name === "whatsappNumber") {
        numericValue = numericValue.slice(0, 10);
      } else if (name === "pincode") {
        numericValue = numericValue.slice(0, 6);
      }
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate consent checkbox
    if (!formData.consent) {
      alert("Please agree to be contacted by Credit Dost team.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to backend API
      await api.post("/forms/suvidha-centre", formData);
      // Reset form
      setFormData({
        fullName: "",
        mobileNumber: "",
        whatsappNumber: "",
        email: "",
        city: "",
        state: "",
        pincode: "",
        occupation: "",
        financeExperience: "",
        smartphoneLaptop: "",
        communication: "",
        investmentReadiness: "",
        consent: false,
      });
      // Show success message
      alert("Thank you for your application. We will get back to you soon!");
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Failed to submit your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f8fafc",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .pulse-bg-1 { animation: pulse 3s ease-in-out infinite; }
        .pulse-bg-2 { animation: pulse 3s ease-in-out infinite 2s; }
        .pulse-bg-3 { animation: pulse 3s ease-in-out infinite 4s; }
        .bounce-chip { animation: bounce 2s ease-in-out infinite; }
      `}</style>

        {/* Hero Section */}
        <Box sx={{ position: "relative", pt: 10, pb: 16, overflow: "hidden" }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, #0891b2, #2563eb, #7c3aed)",
              opacity: 0.95,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            }}
          />

          <Container
            maxWidth="lg"
            sx={{ position: "relative", textAlign: "center", zIndex: 1 }}
          >
            <Chip
              className="bounce-chip"
              icon={<AutoAwesome sx={{ color: "#fde047 !important" }} />}
              label="Launch Your Own Credit & Financial Services Business
"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                color: "white",
                fontWeight: 600,
                py: 3,
                px: 2,
                mb: 4,
                fontSize: "1rem",
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "3rem", md: "3.5rem" },
                fontWeight: 700,
                color: "white",

                lineHeight: 1.2,
              }}
            >
              Credit Dost
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 700,
                background: "linear-gradient(to right, #67e8f9, #fde047)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 3,
              }}
            >
              Suvidha Centre Franchise
            </Typography>

            <Typography
              variant="h4"
              sx={{
                color: "#a5f3fc",
                mb: 2,
                fontWeight: 300,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Start Your Own Credit Repair Business in India
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.9)",
                mb: 4,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
              }}
            >
              No Banking Background Required • PAN-India Opportunity • Scalable
              Income Model
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: "white",
                  color: "#2563eb",
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: 50,
                  fontWeight: 700,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
                  "&:hover": {
                    bgcolor: "white",
                    transform: "scale(1.05)",
                    boxShadow: "0 20px 25px -5px rgba(6,182,212,0.5)",
                  },
                  transition: "all 0.3s",
                }}
                href="#suvidha-centre-application"
              >
                Apply Now
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Trust Badge */}
        <Container
          maxWidth="lg"
          sx={{ position: "relative", mt: -8, mb: 10, zIndex: 2 }}
        >
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid #a5f3fc",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Grid
                container
                spacing={4}
                justifyContent="space-around"
                alignItems="center"
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                <Grid item xs={6} md={3} sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: "#2563eb",
                      mb: 1,
                      fontSize: { xs: "2rem", md: "3rem" },
                    }}
                  >
                    10,000+
                  </Typography>
                  <Typography sx={{ color: "#64748b" }}>
                    Happy Customers
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3} sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: "#9333ea",
                      mb: 1,
                      fontSize: { xs: "2rem", md: "3rem" },
                    }}
                  >
                    500+
                  </Typography>
                  <Typography sx={{ color: "#64748b" }}>
                    Active Partners
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3} sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: "#0891b2",
                      mb: 1,
                      fontSize: { xs: "2rem", md: "3rem" },
                    }}
                  >
                    95%
                  </Typography>
                  <Typography sx={{ color: "#64748b" }}>
                    Success Rate
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3} sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: "#16a34a",
                      mb: 1,
                      fontSize: { xs: "2rem", md: "3rem" },
                    }}
                  >
                    ₹2.5L
                  </Typography>
                  <Typography sx={{ color: "#64748b" }}>
                    Avg. Monthly Earnings
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>

        {/* Welcome Section */}
        <Container maxWidth="lg" sx={{ py: { 5: 10, md: 7 } }}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "2.6rem" },
                fontWeight: 700,
                color: "#111827",
                mb: 3,
              }}
            >
              Welcome to Your
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(to right, #0891b2, #2563eb)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  ml: 1,
                }}
              >
                Financial Freedom
              </Box>
            </Typography>
            <Box
              sx={{
                width: 96,
                height: 4,
                background: "linear-gradient(to right, #06b6d4, #3b82f6)",
                mx: "auto",
                mb: 4,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "#4b5563",
                maxWidth: "900px",
                mx: "auto",
                lineHeight: 1.7,
              }}
            >
              Credit Dost Suvidha Centre empowers individuals, shop owners,
              freelancers, and small agencies to start their own credit repair
              and credit score improvement business in India. With end-to-end
              training, technology tools, and operational support from Credit
              Dost, you can build a scalable financial services business without
              any prior banking or finance experience.
            </Typography>
          </Box>

          <Grid
            container
            spacing={4}
            sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}
          >
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #ecfeff 0%, #dbeafe 100%)",
                  border: "2px solid #a5f3fc",
                  borderRadius: 4,
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: "#22d3ee",
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <TrackChanges
                    sx={{ fontSize: 48, color: "#0891b2", mb: 2 }}
                  />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#111827", mb: 2 }}
                  >
                    Massive Market
                  </Typography>
                  <Typography sx={{ color: "#4b5563" }}>
                    India has 40+ crore credit-active consumers, and millions
                    struggle with low CIBIL scores, loan rejections, and
                    incorrect credit reports — creating a huge and consistent
                    demand for credit repair services.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #faf5ff 0%, #dbeafe 100%)",
                  border: "2px solid #d8b4fe",
                  borderRadius: 4,
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: "#c084fc",
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <FlashOn sx={{ fontSize: 48, color: "#9333ea", mb: 2 }} />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#111827", mb: 2 }}
                  >
                    Fast Growing
                  </Typography>
                  <Typography sx={{ color: "#4b5563" }}>
                    Credit repair and credit consulting is among India’s
                    fastest-growing financial service segments, driven by rising
                    loan demand, digital lending, and increased credit awareness
                    — with low competition in most cities.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)",
                  border: "2px solid #86efac",
                  borderRadius: 4,
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: "#4ade80",
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <AttachMoney sx={{ fontSize: 48, color: "#16a34a", mb: 2 }} />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#111827", mb: 2 }}
                  >
                    Long-Term & Scalable Income
                  </Typography>
                  <Typography sx={{ color: "#4b5563" }}>
                    Build a sustainable, service-based business with minimal
                    investment, recurring client opportunities, and long-term
                    earning potential — supported by Credit Dost’s systems and
                    expertise.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Why Become Section */}
        <Box sx={{ bgcolor: "white", py: 10 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.6rem" },
                  fontWeight: 700,
                  color: "#111827",
                  mb: 3,
                }}
              >
                Why Choose a
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(to right, #2563eb, #9333ea)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    ml: 1,
                  }}
                >
                  Suvidha Centre?
                </Box>
              </Typography>
              <Box
                sx={{
                  width: 96,
                  height: 4,
                  background: "linear-gradient(to right, #3b82f6, #9333ea)",
                  mx: "auto",
                }}
              />
            </Box>

            <Grid
              container
              spacing={4}
              sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}
            >
              {[
                {
                  icon: <AttachMoney sx={{ fontSize: 48 }} />,
                  title: "Earn High Monthly Income",
                  gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  items: [
                    "Credit score repair services",
                    "Report correction services",
                    "Loan readiness consulting",
                    "Add-on financial services",
                  ],
                },
                {
                  icon: <TrendingUp sx={{ fontSize: 48 }} />,
                  title: "Rapidly Growing Market",
                  gradient: "linear-gradient(135deg, #3b82f6 0%, #0891b2 100%)",
                  items: [
                    "Loan rejection cases",
                    "Low credit score issues",
                    "Wrong CIBIL entries",
                    "DPD / settled status",
                  ],
                },
                {
                  icon: <Home sx={{ fontSize: 48 }} />,
                  title: "Work From Anywhere",
                  gradient: "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                  items: [
                    "No special setup required",
                    "Mobile or laptop is enough",
                    "Complete training provided",
                    "24/7 support available",
                  ],
                },
              ].map((item, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Card
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      border: "1px solid #f3f4f6",
                      transition: "all 0.5s",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background: item.gradient,
                        opacity: hoveredCard === idx ? 0.1 : 0,
                        transition: "opacity 0.5s",
                      }}
                    />
                    <CardContent sx={{ p: 4, position: "relative" }}>
                      <Box
                        sx={{
                          display: "inline-flex",
                          p: 2,
                          borderRadius: 4,
                          background: item.gradient,
                          color: "white",
                          mb: 3,
                          transform:
                            hoveredCard === idx
                              ? "scale(1.1) rotate(6deg)"
                              : "scale(1) rotate(0deg)",
                          transition: "all 0.5s",
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#111827",
                          mb: 3,
                          fontSize: { xs: "1.4rem", md: "1.8rem" },
                        }}
                      >
                        {item.title}
                      </Typography>
                      <List sx={{ p: 0 }}>
                        {item.items.map((listItem, i) => (
                          <ListItem key={i} sx={{ px: 0, py: 1 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Check sx={{ color: "#22c55e", fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={listItem}
                              sx={{ color: "#4b5563", m: 0 }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* What You Get */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #dbeafe 0%, #ecfeff 100%)",
            py: 10,
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.6rem" },
                  fontWeight: 700,
                  color: "#111827",
                  mb: 3,
                }}
              >
                What You Get as a
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(to right, #0891b2, #2563eb)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    ml: 1,
                  }}
                >
                  Partner
                </Box>
              </Typography>
              <Box
                sx={{
                  width: 96,
                  height: 4,
                  background: "linear-gradient(to right, #06b6d4, #3b82f6)",
                  mx: "auto",
                }}
              />
            </Box>

            <Grid container spacing={3} style={{ justifyContent: "center" }}>
              {[
                {
                  icon: <School sx={{ fontSize: 40 }} />,
                  title: "Complete Training",
                  color: "#2563eb",
                },
                {
                  icon: <TrendingUp sx={{ fontSize: 40 }} />,
                  title: "Business Dashboard",
                  color: "#9333ea",
                },
                {
                  icon: <People sx={{ fontSize: 40 }} />,
                  title: "Marketing Support",
                  color: "#0891b2",
                },
                {
                  icon: <Star sx={{ fontSize: 40 }} />,
                  title: "Live Mentorship",
                  color: "#ec4899",
                },
                {
                  icon: <EmojiEvents sx={{ fontSize: 40 }} />,
                  title: "High Earnings",
                  color: "#16a34a",
                },
              ].map((item, idx) => (
                <Grid item xs={6} sm={6} lg={2.4} key={idx}>
                  <Card
                    sx={{
                      textAlign: "center",
                      borderRadius: 3,
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      transition: "all 0.3s",
                      "&:hover": {
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                        transform: "translateY(-8px)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "inline-flex",
                          p: 2,
                          borderRadius: "50%",
                          bgcolor: `${item.color}15`,
                          color: item.color,
                          mb: 2,
                          transition: "transform 0.3s",
                          "&:hover": { transform: "scale(1.1)" },
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 700,
                          color: "#111827",
                          fontSize: { xs: "1rem", md: "1.1rem" },
                        }}
                      >
                        {item.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Who Can Join */}
        <Box sx={{ bgcolor: "white", py: 10 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.6rem" },
                  fontWeight: 700,
                  color: "#111827",
                  mb: 3,
                }}
              >
                Who Can Become a
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(to right, #9333ea, #ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    ml: 1,
                  }}
                >
                  Partner?
                </Box>
              </Typography>
              <Box
                sx={{
                  width: 96,
                  height: 4,
                  background: "linear-gradient(to right, #9333ea, #ec4899)",
                  mx: "auto",
                  mb: 4,
                }}
              />
              <Typography variant="h6" sx={{ color: "#4b5563", mb: 6 }}>
                This opportunity is ideal for:
              </Typography>
            </Box>

            <Grid
              container
              spacing={2}
              sx={{ mb: 6 }}
              style={{ justifyContent: "center" }}
            >
              {[
                "Students",
                "Working professionals",
                "Shop owners",
                "Loan agents",
                "Insurance agents",
                "Freelancers",
                "Finance consultants",
                "Homemakers",
              ].map((item, idx) => (
                <Grid item xs={6} md={3} key={idx}>
                  <Card
                    sx={{
                      background:
                        "linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)",
                      border: "2px solid #d8b4fe",
                      borderRadius: 3,
                      textAlign: "center",
                      transition: "all 0.3s",
                      "&:hover": {
                        borderColor: "#c084fc",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography sx={{ fontWeight: 600, color: "#1f2937" }}>
                        {item}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Card
              sx={{
                background: "linear-gradient(to right, #f3e8ff, #fce7f3)",
                border: "2px solid #d8b4fe",
                borderRadius: 4,
                textAlign: "center",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "0.9rem", md: "1.1rem" },
                    fontWeight: 500,
                    color: "#1f2937",
                    fontStyle: "italic",
                    lineHeight: 1.6,
                  }}
                >
                  If you can understand people’s financial challenges and guide
                  them correctly, Credit Dost provides the system to help you
                  build a successful and sustainable business No finance
                  background required — training, tools, and expert support are
                  provided by Credit Dost.
                </Typography>
              </CardContent>
            </Card>
          </Container>
        </Box>

        {/* Income Potential */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #dbeafe 100%)",
            py: 10,
          }}
        >
          <Container maxWidth="md" sx={{ textAlign: "center" }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "2.6rem" },
                fontWeight: 700,
                color: "#111827",
                mb: 3,
              }}
            >
              Your
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(to right, #16a34a, #0891b2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  ml: 1,
                }}
              >
                Income Potential
              </Box>
            </Typography>
            <Box
              sx={{
                width: 96,
                height: 4,
                background: "linear-gradient(to right, #22c55e, #06b6d4)",
                mx: "auto",
                mb: 6,
              }}
            />

            <Grid
              container
              spacing={4}
              sx={{ mb: 4, justifyContent: "center" }}
            >
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    border: "4px solid #93c5fd",
                    borderRadius: 4,
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                    transition: "all 0.3s",
                    "&:hover": {
                      borderColor: "#60a5fa",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: "#2563eb",
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        mb: 1.5,
                      }}
                    >
                      Part-Time
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 700,
                        color: "#111827",
                        mb: 1,
                        fontSize: { xs: "2rem", md: "2.6rem" },
                      }}
                    >
                      ₹30K - ₹90K
                    </Typography>
                    <Typography sx={{ color: "#4b5563" }}>per month</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #22c55e 0%, #0891b2 100%)",
                    borderRadius: 4,
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                    position: "relative",
                    overflow: "visible",
                    transition: "all 0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <Chip
                    label="POPULAR"
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      bgcolor: "#fbbf24",
                      color: "#78350f",
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      transform: "rotate(12deg)",
                    }}
                  />
                  <CardContent sx={{ p: 5, color: "white" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        mb: 1.5,
                      }}
                    >
                      Full-Time
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        fontSize: { xs: "2rem", md: "2.6rem" },
                      }}
                    >
                      ₹1L - ₹2.5L
                    </Typography>
                    <Typography sx={{ color: "#d1fae5" }}>per month</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card
              sx={{
                bgcolor: "white",
                borderRadius: 3,
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ color: "#4b5563" }}>
                  Income figures are indicative and not guaranteed. Actual
                  earnings depend on individual effort, time commitment, market
                  conditions, and customer acquisition. Credit Dost provides
                  training, tools, and support to help partners scale their
                  business effectively.
                </Typography>
              </CardContent>
            </Card>
          </Container>
        </Box>

        {/* How to Start */}
        <Box sx={{ bgcolor: "white", py: 10 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.6rem" },
                  fontWeight: 700,
                  color: "#111827",
                  mb: 3,
                }}
              >
                Start Your Journey in
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(to right, #2563eb, #0891b2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    ml: 1,
                  }}
                >
                  4 Simple Steps
                </Box>
              </Typography>
              <Box
                sx={{
                  width: 96,
                  height: 4,
                  background: "linear-gradient(to right, #3b82f6, #06b6d4)",
                  mx: "auto",
                }}
              />
            </Box>

            <Grid
              container
              spacing={4}
              sx={{ flexDirection: { xs: "column", md: "row" } }}
            >
              {[
                {
                  step: "01",
                  title: "Submit Your Partner Application",
                  desc: " Fill out the online partner form. Our team will review your details and connect with you within 24 working hours.",
                },
                {
                  step: "02",
                  title: "Understand the Business Model",
                  desc: "Join a detailed orientation session to learn about the Credit Dost Suvidha Centre model, income structure, tools, and support system.",
                },
                {
                  step: "03",
                  title: "Training, Tools & System Setup",
                  desc: "Receive complete training and access to dashboards, resources, and processes required to set up and operate your Suvidha Centre smoothly.",
                },
                {
                  step: "04",
                  title: "Serve Customers & Grow Your Income",
                  desc: " Begin assisting customers with credit score improvement and related services while building a scalable, recurring-income business.",
                },
              ].map((item, idx) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={idx}
                  style={{ flex: "1" }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Card
                      sx={{
                        borderRadius: 4,
                        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)",
                        border: "2px solid #a5f3fc",
                        pt: 5,

                        transition: "all 0.3s",
                        "&:hover": {
                          borderColor: "#22d3ee",
                          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                          transform: "translateY(-8px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: -24,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                        }}
                      >
                        {item.step}
                      </Box>
                      <CardContent
                        sx={{
                          p: 4,
                          pt: 2,
                          textAlign: "center",
                          minHeight: "168px",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: "#111827", mb: 2 }}
                        >
                          {item.title}
                        </Typography>
                        <Typography sx={{ color: "#4b5563" }}>
                          {item.desc}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Suvidha Centre Application Form */}
        <Box
          sx={{ bgcolor: "#f0f9ff", py: 10 }}
          id="suvidha-centre-application"
        >
          <Container maxWidth="md">
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  fontWeight: 700,
                  color: "#111827",
                  mb: 2,
                }}
              >
                Apply for Suvidha Centre
              </Typography>
              <Typography variant="h6" sx={{ color: "#4b5563", mb: 4 }}>
                Fill out the form below to apply for your Suvidha Centre
                franchise
              </Typography>
            </Box>

            <FormSection>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={4} style={{ flexDirection: "column" }}>
                  {/* Personal Information Section */}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Person sx={{ color: "#0ea5e9", mr: 2 }} />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        Personal Information
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} style={{ flex: "1" }}>
                      <TextField
                        fullWidth
                        required
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        variant="outlined"
                        size="medium"
                      />
                    </Grid>

                    <Grid item xs={12} md={6} style={{ flex: "1" }}>
                      <TextField
                        fullWidth
                        required
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        size="medium"
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} style={{ flex: "1" }}>
                      <TextField
                        fullWidth
                        required
                        label="Mobile Number (Primary)"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        variant="outlined"
                        size="medium"
                      />
                    </Grid>

                    <Grid item xs={12} md={6} style={{ flex: "1" }}>
                      <TextField
                        fullWidth
                        label="WhatsApp Number"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleChange}
                        variant="outlined"
                        size="medium"
                      />
                    </Grid>
                  </Grid>

                  {/* Location Details Section */}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
                      <LocationOn sx={{ color: "#0ea5e9", mr: 2 }} />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        Location Details
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} style={{ flex: "1" }}>
                      <TextField
                        fullWidth
                        required
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        variant="outlined"
                        size="medium"
                      />
                    </Grid>

                    <Grid item xs={12} md={6} style={{ flex: "1" }}>
                      <FormControl fullWidth required>
                        <InputLabel>State</InputLabel>
                        <Select
                          value={formData.state}
                          label="State"
                          name="state"
                          onChange={handleChange}
                          size="medium"
                        >
                          <MenuItem value="">
                            <em>Select State</em>
                          </MenuItem>
                          {indianStates.map((state) => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={6} style={{ flex: "1" }}>
                    <TextField
                      fullWidth
                      required
                      label="Pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      variant="outlined"
                      size="medium"
                      inputProps={{ maxLength: 6, minLength: 6 }}
                    />
                  </Grid>

                  {/* Background Information Section */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        my: 3,
                      }}
                    >
                      <Work sx={{ color: "#0ea5e9", mr: 2 }} />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        Background Information
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} style={{ flex: "1" }}>
                      <FormControl fullWidth required>
                        <InputLabel>Current Occupation</InputLabel>
                        <Select
                          value={formData.occupation}
                          label="Current Occupation"
                          name="occupation"
                          onChange={handleChange}
                          size="medium"
                        >
                          <MenuItem value="">
                            <em>Select Occupation</em>
                          </MenuItem>
                          <MenuItem value="Student">Student</MenuItem>
                          <MenuItem value="Working Professional">
                            Working Professional
                          </MenuItem>
                          <MenuItem value="Business Owner / Shop Owner">
                            Business Owner / Shop Owner
                          </MenuItem>
                          <MenuItem value="Loan Agent">Loan Agent</MenuItem>
                          <MenuItem value="Insurance Agent">
                            Insurance Agent
                          </MenuItem>
                          <MenuItem value="Freelancer">Freelancer</MenuItem>
                          <MenuItem value="Homemaker">Homemaker</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6} style={{ flex: "1" }}>
                      <FormControl fullWidth required>
                        <InputLabel>
                          Do you have experience in finance / loans / sales?
                        </InputLabel>
                        <Select
                          value={formData.financeExperience}
                          label="Do you have experience in finance / loans / sales?"
                          name="financeExperience"
                          onChange={handleChange}
                          size="medium"
                        >
                          <MenuItem value="">
                            <em>Select Option</em>
                          </MenuItem>
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Infrastructure Check Section */}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
                      <Home sx={{ color: "#0ea5e9", mr: 2 }} />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        Infrastructure Check
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} style={{ flex: "1" }}>
                      <FormControl fullWidth required>
                        <InputLabel>
                          Do you have a smartphone/laptop with internet?
                        </InputLabel>
                        <Select
                          value={formData.smartphoneLaptop}
                          label="Do you have a smartphone/laptop with internet?"
                          name="smartphoneLaptop"
                          onChange={handleChange}
                          size="medium"
                        >
                          <MenuItem value="">
                            <em>Select Option</em>
                          </MenuItem>
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6} style={{ flex: "1" }}>
                      <FormControl fullWidth required>
                        <InputLabel>
                          Can you communicate confidently with customers in
                          Hindi / English?
                        </InputLabel>
                        <Select
                          value={formData.communication}
                          label="Can you communicate confidently with customers in Hindi / English?"
                          name="communication"
                          onChange={handleChange}
                          size="medium"
                        >
                          <MenuItem value="">
                            <em>Select Option</em>
                          </MenuItem>
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="Somewhat">Somewhat</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Investment Readiness Section */}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
                      <AttachMoney sx={{ color: "#0ea5e9", mr: 2 }} />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        Investment Readiness
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>

                  <Grid item xs={12} md={6} style={{ flex: "1" }}>
                    <FormControl fullWidth required>
                      <InputLabel>
                        Are you ready to invest in training & setup to start
                        this business?
                      </InputLabel>
                      <Select
                        value={formData.investmentReadiness}
                        label="Are you ready to invest in training & setup to start this business?"
                        name="investmentReadiness"
                        onChange={handleChange}
                        size="medium"
                      >
                        <MenuItem value="">
                          <em>Select Option</em>
                        </MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="Need more details">
                          Need more details
                        </MenuItem>
                        <MenuItem value="Not sure">Not sure</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Consent Checkbox */}
                  <Grid item xs={12} style={{ flex: "1" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="consent"
                          checked={formData.consent}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              consent: e.target.checked,
                            })
                          }
                          required
                          sx={{
                            color: "#0ea5e9",
                            "&.Mui-checked": {
                              color: "#0ea5e9",
                            },
                          }}
                        />
                      }
                      label="I agree to be contacted by Credit Dost team via call, WhatsApp, SMS & email."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <StyledButton
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      endIcon={<ArrowForward />}
                      disabled={isSubmitting}
                      sx={{
                        py: 1.5, // More touch-friendly padding
                        fontSize: { xs: "1rem", md: "1.1rem" },
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <CircularProgress
                            size={24}
                            sx={{ mr: 1, color: "white" }}
                          />
                          Processing Your Application...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </StyledButton>
                  </Grid>
                </Grid>
              </Box>
            </FormSection>
          </Container>
        </Box>

        {/* Final CTA */}
        <Box sx={{ position: "relative", py: 10, overflow: "hidden" }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, #2563eb, #0891b2, #7c3aed)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.2,
              background:
                "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)",
            }}
          />

          <Container
            maxWidth="md"
            sx={{ position: "relative", textAlign: "center" }}
          >
            <AutoAwesome
              sx={{
                fontSize: 64,
                color: "#fde047",
                mx: "auto",
                mb: 3,
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "3.5rem" },
                fontWeight: 700,
                color: "white",
                mb: 3,
              }}
            >
              Ready to Transform Lives?
            </Typography>
            <Typography variant="h5" sx={{ color: "#a5f3fc", mb: 6 }}>
              Join hundreds of successful partners building financial freedom
              today
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                href="/contact"
                sx={{
                  bgcolor: "white",
                  color: "#2563eb",
                  px: { xs: 3, md: 5 },
                  py: { xs: 1.5, md: 2.5 },
                  borderRadius: 50,
                  fontWeight: 700,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
                  "&:hover": {
                    bgcolor: "white",
                    transform: "scale(1.05)",
                    boxShadow: "0 20px 25px -5px rgba(6,182,212,0.5)",
                  },
                  transition: "all 0.3s",
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
      <HomePageFooter />
    </>
  );
};

export default SuvidhaCentrePage;
