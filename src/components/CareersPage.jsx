import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon, Upload as UploadIcon } from "@mui/icons-material";
import Header from "./homepage/Header";
import HomePageFooter from "./homepage/HomePageFooter";
import { careersAPI } from "../services/api";

const CareersPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [resume, setResume] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const positions = [
    {
      id: 1,
      title: "Credit Analyst (Operations)",
      location: "New Delhi (On-site)",
      type: "Full Time",
      department: "Operations",
      description:
        "We are looking for a detail-oriented analyst to manage the backend credit repair process. You will be the technical expert analyzing credit reports.",
      responsibilities: [
        "Analyze credit reports from CIBIL, Experian, CRIF, and Equifax to identify errors.",
        "Draft professional dispute letters and coordinate with credit bureaus for rectification.",
        "Maintain strict data privacy and update client records in the CRM.",
      ],
      requirements: [
        "Experience: 1-3 years in Banking, Loan Processing, or Backend Operations.",
        "Strong understanding of banking terms (DPD, Write-off, Settlement).",
        "Proficiency in MS Excel is mandatory.",
      ],
    },
    {
      id: 2,
      title: "Client Success Manager",
      location: "New Delhi",
      type: "Full Time",
      department: "Customer Support",
      description:
        "You will be the primary point of contact for our premium clients, guiding them through their journey to a better credit score.",
      responsibilities: [
        "Onboard new clients and explain the credit repair roadmap.",
        "Provide monthly updates on score improvements and handle client queries via call/email.",
        "Focus on retention and ensure high customer satisfaction scores (CSAT).",
      ],
      requirements: [
        "Excellent verbal and written communication skills (English & Hindi).",
        "High levels of patience and empathy.",
        "Prior experience in Customer Success or Relationship Management is a plus.",
      ],
    },
    {
      id: 3,
      title: "Inside Sales Executive",
      location: "New Delhi",
      type: "Full Time",
      department: "Sales & Revenue",
      description:
        "Drive the company's growth by consulting potential customers who have inquired about our services. This is a high-reward role with attractive incentives.",
      responsibilities: [
        "Contact inbound leads (people looking to fix their score) and counsel them on Credit Dost packages.",
        "Understand customer financial pain points and offer the right solution.",
        "Meet and exceed monthly sales targets.",
      ],
      requirements: [
        "1+ year of experience in Tele-sales, BFSI sales, or Ed-tech sales.",
        "High energy and a target-driven mindset.",
        "Ability to explain complex financial concepts simply.",
      ],
    },
  ];

  const hiringSteps = [
    { step: "01", title: "Apply", description: "Send your CV via email." },
    { step: "02", title: "Screening", description: "Brief call with HR." },
    {
      step: "03",
      title: "Interview",
      description: "Technical & Culture round.",
    },
    { step: "04", title: "Offer", description: "Welcome to the team!" },
  ];

  const handleApplyClick = (positionTitle) => {
    setSelectedPosition(positionTitle);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPosition("");
    setResume(null);
    setFormData({ name: "", email: "", phone: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmitApplication = async () => {
    try {
      setIsSubmitting(true);

      // Create FormData object to send file
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("position", selectedPosition);
      submitData.append("resume", resume);

      // Submit application via API
      await careersAPI.submitApplication(submitData);

      setSnackbar({
        open: true,
        message:
          "Application submitted successfully! We will contact you soon.",
        severity: "success",
      });

      handleCloseModal();
    } catch (error) {
      console.error("Error submitting application:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to submit application. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)",
          color: "white",
          py: { xs: 4, md: 11 },
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
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L50 50L0 100' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='2'/%3E%3Cpath d='M50 0L100 50L50 100' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='2'/%3E%3C/svg%3E\")",
            opacity: 0.3,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            style={{ flexWrap: "wrap", gap: "50px" }}
          >
            <Grid item xs={12} md={8} style={{ flex: "1" }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2rem", md: "3.5rem" },
                  mb: 2,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Shape the Future of Financial Health
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 400,
                  mb: 4,
                  textAlign: { xs: "center", md: "left" },
                  opacity: 0.9,
                }}
              >
                Join Credit Dost and help millions of Indians build a better
                financial reputation.
              </Typography>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background:
                      "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
                    color: "white",
                    fontWeight: 700,
                    textTransform: "none",
                    padding: "12px 32px",
                    borderRadius: "50px",
                    fontSize: "1rem",
                    boxShadow: "0 4px 20px rgba(8, 145, 178, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 25px rgba(8, 145, 178, 0.4)",
                      background:
                        "linear-gradient(135deg, #0e7490 0%, #0891b2 100%)",
                    },
                  }}
                  onClick={() =>
                    document
                      .getElementById("positions")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                >
                  View Open Positions
                </Button>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: { xs: "none", md: "block" } }}
              style={{ flex: "1" }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "400px",
                  backgroundImage: 'url("./images/join our team.jpg")',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, textAlign: "center" }}
                >
                  
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Why Work at Credit Dost */}
      <Container sx={{ py: { xs: 4, md: 8 } }} style={{ maxWidth: "1300px" }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "#1e3a5f",
              position: "relative",
              pb: 2,
              display: "inline-block",
              fontSize: { xs: "1.8rem", md: "2.2rem" },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                height: "4px",
                background: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
                borderRadius: "2px",
              },
            }}
          >
            Why Work at Credit Dost?
          </Typography>
        </Box>

        <Grid
          container
          spacing={4}
          sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}
        >
          <Grid item xs={12} md={4} sx={{ mb: { xs: 3, md: 0 } }}>
            <Box
              sx={{
                background: "white",
                borderRadius: "16px",
                p: 4,
                height: "100%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                textAlign: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-10px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(8, 145, 178, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  fontSize: "2rem",
                }}
              >
                📈
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 2, color: "#1e3a5f" }}
              >
                Real Impact
              </Typography>
              <Typography variant="body1" sx={{ color: "#64748b" }}>
                We don't just sell services; we solve problems. Your work
                directly helps people get loans for homes, cars, and
                emergencies.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} sx={{ mb: { xs: 3, md: 0 } }}>
            <Box
              sx={{
                background: "white",
                borderRadius: "16px",
                p: 4,
                height: "100%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                textAlign: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-10px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(8, 145, 178, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  fontSize: "2rem",
                }}
              >
                🚀
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 2, color: "#1e3a5f" }}
              >
                Rapid Growth
              </Typography>
              <Typography variant="body1" sx={{ color: "#64748b" }}>
                We are a fast-moving Fintech company. High performers are
                rewarded with fast-track promotions and competitive incentives.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                background: "white",
                borderRadius: "16px",
                p: 4,
                height: "100%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                textAlign: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-10px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(8, 145, 178, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  fontSize: "2rem",
                }}
              >
                🤝
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 2, color: "#1e3a5f" }}
              >
                Inclusive Culture
              </Typography>
              <Typography variant="body1" sx={{ color: "#64748b" }}>
                We believe in transparency and teamwork. Whether you are in
                sales or ops, your voice matters in shaping our products.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Current Opportunities */}
        <Box id="positions" sx={{ mt: 8 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#1e3a5f",
                position: "relative",
                pb: 2,
                display: "inline-block",
                fontSize: { xs: "1.8rem", md: "2.2rem" },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "4px",
                  background:
                    "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
                  borderRadius: "2px",
                },
              }}
            >
              Current Opportunities
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {positions.map((position) => (
              <Grid item xs={12} key={position.id} style={{ width: "100%" }}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: "#1e3a5f",
                            fontSize: { xs: "1.5rem", md: "inherit" },
                          }}
                        >
                          {position.title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#64748b",
                            }}
                          >
                            📍 {position.location}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#64748b",
                            }}
                          >
                            💼 {position.type}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#64748b",
                            }}
                          >
                            🏢 {position.department}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: "#1e3a5f",
                        fontSize: { xs: "1.2rem", md: "inherit" },
                      }}
                    >
                      About the Role
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mb: 3, color: "#64748b" }}
                    >
                      {position.description}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: "#1e3a5f",
                        fontSize: { xs: "1.2rem", md: "inherit" },
                      }}
                    >
                      Responsibilities
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                      {position.responsibilities.map((resp, idx) => (
                        <Typography
                          component="li"
                          variant="body1"
                          key={idx}
                          sx={{ mb: 1, color: "#64748b" }}
                        >
                          {resp}
                        </Typography>
                      ))}
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: "#1e3a5f",
                        fontSize: { xs: "1.2rem", md: "inherit" },
                      }}
                    >
                      Requirements
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                      {position.requirements.map((req, idx) => (
                        <Typography
                          component="li"
                          variant="body1"
                          key={idx}
                          sx={{ mb: 1, color: "#64748b" }}
                        >
                          {req}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions
                    sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: 3, pt: 0 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        background:
                          "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
                        color: "white",
                        fontWeight: 700,
                        textTransform: "none",
                        padding: "10px 24px",
                        borderRadius: "50px",
                        fontSize: "1rem",
                        boxShadow: "0 4px 20px rgba(8, 145, 178, 0.3)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 25px rgba(8, 145, 178, 0.4)",
                          background:
                            "linear-gradient(135deg, #0e7490 0%, #0891b2 100%)",
                        },
                      }}
                      onClick={() => handleApplyClick(position.title)}
                    >
                      Apply Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Hiring Process */}
        <Box sx={{ mt: 8, mb: 6 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#1e3a5f",
                position: "relative",
                pb: 2,
                display: "inline-block",
                fontSize: { xs: "1.8rem", md: "2.2rem" },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "4px",
                  background:
                    "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
                  borderRadius: "2px",
                },
              }}
            >
              Our Hiring Process
            </Typography>
          </Box>

          <Grid
            container
            spacing={4}
            sx={{ flexDirection: { xs: "column", md: "row" } }}
          >
            {hiringSteps.map((step, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
                style={{ flex: "1" }}
              >
                <Box
                  sx={{
                    background: "white",
                    borderRadius: "16px",
                    p: { xs: 2, sm: 3, md: 4 },
                    height: "100%",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    textAlign: "center",
                    position: "relative",
                    border: "1px solid rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    },
                    "&::before": {
                      content: `"${step.step}"`,
                      position: "absolute",
                      top: "-20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "40px",
                      height: "40px",
                      background:
                        "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "1rem",
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: "#1e3a5f",
                      fontSize: { xs: "1.3rem", md: "inherit" },
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#64748b" }}>
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <HomePageFooter />

      {/* Application Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            m: { xs: 2, sm: 4 },
            maxHeight: { xs: "90vh", sm: "80vh" },
            maxWidth: "550px",
            width: "100%",
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
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e3a5f" }}>
              Apply for Position
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            {selectedPosition}
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{ overflowY: "auto", maxHeight: "calc(80vh - 200px)" }}
        >
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    padding: { xs: "12px", sm: "15px" },
                    borderColor: "#e2e8f0",
                    color: "#64748b",
                    "&:hover": {
                      borderColor: "#cbd5e1",
                      backgroundColor: "rgba(8, 145, 178, 0.03)",
                    },
                  }}
                  startIcon={<UploadIcon />}
                >
                  {resume ? resume.name : "Upload Resume"}
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </Button>
                {resume && (
                  <Typography variant="body2" sx={{ mt: 1, color: "#64748b" }}>
                    Selected: {resume.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          <Button onClick={handleCloseModal} sx={{ color: "#64748b" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitApplication}
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.phone ||
              !resume ||
              isSubmitting
            }
            sx={{
              background: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
              color: "white",
              fontWeight: 700,
              textTransform: "none",
              padding: "8px 24px",
              borderRadius: "50px",
              boxShadow: "0 4px 20px rgba(8, 145, 178, 0.3)",
              transition: "all 0.3s ease",
              minWidth: "150px",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 25px rgba(8, 145, 178, 0.4)",
                background: "linear-gradient(135deg, #0e7490 0%, #0891b2 100%)",
              },
              "&.Mui-disabled": {
                background: "linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)",
                color: "white",
              },
            }}
          >
            {isSubmitting ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} sx={{ color: "white" }} />
                <span>Uploading...</span>
              </Box>
            ) : (
              "Submit Application"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CareersPage;
