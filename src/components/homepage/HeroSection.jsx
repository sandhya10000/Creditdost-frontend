import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  styled,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Phone, Add } from "@mui/icons-material";

const HeroBackground = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #0a1929 0%, #1a2744 50%, #0d2847 100%)",
  minHeight: "91vh",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(8, 0),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(4, 0),
    minHeight: "auto",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3, 0),
  },
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: "10%",
    left: "-10%",
    width: "600px",
    height: "600px",
    background:
      "radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)",
    borderRadius: "50%",
    animation: "pulse 8s ease-in-out infinite",
    [theme.breakpoints.down("md")]: {
      width: "300px",
      height: "300px",
      left: "-5%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "200px",
      height: "200px",
      bottom: "5%",
    },
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "20%",
    right: "-5%",
    width: "400px",
    height: "400px",
    background:
      "radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)",
    borderRadius: "50%",
    animation: "float 6s ease-in-out infinite",
    [theme.breakpoints.down("md")]: {
      width: "250px",
      height: "250px",
      top: "15%",
      right: "-3%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "150px",
      height: "150px",
      top: "10%",
    },
  },
  "@keyframes pulse": {
    "0%, 100%": { transform: "scale(1)", opacity: 1 },
    "50%": { transform: "scale(1.1)", opacity: 0.8 },
  },
  "@keyframes float": {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-30px)" },
  },
  // Adding new unique animations
  "@keyframes rotatePulse": {
    "0%": { transform: "rotate(0deg) scale(1)", opacity: 0.4 },
    "50%": { transform: "rotate(180deg) scale(1.05)", opacity: 0.8 },
    "100%": { transform: "rotate(360deg) scale(1)", opacity: 0.4 },
  },
  "@keyframes slideAndGlow": {
    "0%": {
      transform: "translate(0, 0)",
      boxShadow: "0 0 0 rgba(6, 182, 212, 0.4)",
    },
    "50%": {
      transform: "translate(10px, 10px)",
      boxShadow: "0 0 20px rgba(6, 182, 212, 0.8)",
    },
    "100%": {
      transform: "translate(0, 0)",
      boxShadow: "0 0 0 rgba(6, 182, 212, 0.4)",
    },
  },
  "@keyframes gradientShift": {
    "0%": {
      backgroundPosition: "0% 50%",
    },
    "50%": {
      backgroundPosition: "100% 50%",
    },
    "100%": {
      backgroundPosition: "0% 50%",
    },
  },
}));

const FloatingShape = styled(Box)(({ delay = 0, theme }) => ({
  position: "absolute",
  borderRadius: "50%",
  background: "rgba(14, 165, 233, 0.1)",
  animation: `float 6s ease-in-out ${delay}s infinite`,
  [theme.breakpoints.down("md")]: {
    width: "40px !important",
    height: "40px !important",
  },
  [theme.breakpoints.down("sm")]: {
    width: "30px !important",
    height: "30px !important",
  },
}));

const ContentWrapper = styled(Box)(({ isVisible, theme }) => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? "translateY(0)" : "translateY(30px)",
  transition: "all 0.8s ease-out",
  [theme.breakpoints.down("md")]: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3.5),
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "1rem",
  textTransform: "none",
  transition: "all 0.3s ease",
  background: "linear-gradient(90deg, #0ea5e9, #06b6d4, #0ea5e9)",
  backgroundSize: "200% 200%",
  animation: "gradientShift 3s ease infinite", // Added gradient animation
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(14, 165, 233, 0.4)",
  },
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(1.2, 3),
    fontSize: "0.9rem",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    maxWidth: "250px",
    margin: "0 auto",
  },
}));

const ImageWrapper = styled(Box)(({ isVisible, theme }) => ({
  position: "relative",
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? "translateX(0)" : "translateX(50px)",
  transition: "all 1s ease-out 0.3s",
  [theme.breakpoints.down("md")]: {
    transform: isVisible ? "translateX(0)" : "translateX(30px)",
    marginTop: theme.spacing(4),
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(3),
  },
  "& img": {
    width: "100%",
    height: "auto",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
}));

const AccentCircle = styled(Box)(({ top, right, size, theme }) => ({
  position: "absolute",
  top: top || "auto",
  right: right || "auto",
  width: size || "150px",
  height: size || "150px",
  borderRadius: "50%",
  border: "2px solid rgba(14, 165, 233, 0.3)",
  zIndex: 0,
  [theme.breakpoints.down("md")]: {
    width: size ? `${parseInt(size) * 0.7}px` : "100px",
    height: size ? `${parseInt(size) * 0.7}px` : "100px",
  },
  [theme.breakpoints.down("sm")]: {
    width: size ? `${parseInt(size) * 0.5}px` : "70px",
    height: size ? `${parseInt(size) * 0.5}px` : "70px",
  },
}));

const HeroSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <HeroBackground>
      <FloatingShape
        sx={{ width: 80, height: 80, top: "15%", left: "10%" }}
        delay={0}
      />
      <FloatingShape
        sx={{ width: 120, height: 120, bottom: "25%", left: "5%" }}
        delay={2}
      />
      <FloatingShape
        sx={{ width: 60, height: 60, top: "60%", right: "15%" }}
        delay={4}
      />

      <Container
        sx={{ position: "relative", zIndex: 1 }}
        style={{ maxWidth: "1400px" }}
      >
        <Grid
          container
          spacing={6}
          alignItems="center"
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column", // mobile
              md: "row", // laptop & desktop
            },
          }}
        >
          <Grid item xs={12} md={6} style={{ flex: "1" }}>
            <ContentWrapper isVisible={isVisible}>
              <Typography
                sx={{
                  color: "#0ea5e9",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  mb: 2,
                }}
              >
                BE INVEST
              </Typography>

              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: {
                    xs: "2rem",
                    sm: "2.5rem",
                    md: "3.5rem",
                    lg: "3.7rem",
                  },
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.2,
                  mb: 3,
                  "& span": {
                    display: "block",
                  },
                }}
              >
                Download Your Credit Report
              </Typography>

              {/* <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: { xs: "0.9rem", sm: "1.1rem" },
                  fontWeight: 600,
                  lineHeight: 1.6,
                  fontStyle: "italic",
                  mb: 1.5,
                  maxWidth: "600px",
                  [(theme) => theme.breakpoints.down("md")]: {
                    marginLeft: "auto",
                    marginRight: "auto",
                  },
                }}
              >
                India’s Trusted Platform for Credit Score Repair, CIBIL Report
                Correction & Loan Approval Support
              </Typography> */}

              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  lineHeight: 1.6,
                  mb: 1.5,
                  maxWidth: "600px",
                  [(theme) => theme.breakpoints.down("md")]: {
                    marginLeft: "auto",
                    marginRight: "auto",
                  },
                }}
              >
                Your credit score shapes your financial opportunities. At Credit
                Dost, we help you correct errors, remove inaccurate negative
                entries, and improve your score so you can get loan approvals
                faster.
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  lineHeight: 1.6,
                  mb: 5,
                  maxWidth: "600px",
                  [(theme) => theme.breakpoints.down("md")]: {
                    marginLeft: "auto",
                    marginRight: "auto",
                  },
                }}
              ></Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  flexWrap: "wrap",
                  [(theme) => theme.breakpoints.down("md")]: {
                    justifyContent: "center",
                  },
                  [(theme) => theme.breakpoints.down("sm")]: {
                    flexDirection: "column",
                    gap: 2,
                  },
                }}
              >
                <StyledButton
                  variant="contained"
                  endIcon={<Add />}
                  onClick={() => navigate("/credit-check")}
                  sx={{
                    backgroundColor: "#0ea5e9",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#0284c7",
                    },
                    [(theme) => theme.breakpoints.down("sm")]: {
                      marginBottom: 2,
                    },
                  }}
                >
                  Download Free Credit Report
                </StyledButton>

               
              </Box>
            </ContentWrapper>
          </Grid>

          <Grid item xs={12} md={6} style={{ flex: "1" }}>
            <ImageWrapper isVisible={isVisible}>
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "20px",
                }}
              >
                {/* Top right cyan quarter circle */}
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: "-66px", md: "-89px" },
                    right: "-65px",
                    width: { xs: "219px", md: "280px" },

                    height: { xs: "180px", md: "280px" },
                    background: "#06b6d4",
                    borderRadius: "0 0 0 100%",
                    zIndex: 2,
                    [(theme) => theme.breakpoints.down("md")]: {
                      width: "180px",
                      height: "180px",
                      top: "-20px",
                      right: "-20px",
                    },
                    [(theme) => theme.breakpoints.down("sm")]: {
                      width: "120px",
                      height: "120px",
                      top: "-15px",
                      right: "-15px",
                    },
                  }}
                />

                {/* Bottom left cyan triangle/quarter circle */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "-40px",
                    left: "-40px",
                    width: "180px",
                    height: "180px",
                    background: "#06b6d4",
                    clipPath: "polygon(0 0, 0 100%, 100% 100%)",
                    zIndex: 2,
                    [(theme) => theme.breakpoints.down("md")]: {
                      width: "120px",
                      height: "120px",
                      bottom: "-20px",
                      left: "-20px",
                    },
                    [(theme) => theme.breakpoints.down("sm")]: {
                      width: "80px",
                      height: "80px",
                      bottom: "-15px",
                      left: "-15px",
                    },
                  }}
                />

                {/* Large circle outline - top right area */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "-60px",
                    right: "40%",
                    width: "220px",
                    height: "220px",
                    border: "2px solid rgba(6, 182, 212, 0.4)",
                    borderRadius: "50%",
                    zIndex: 0,
                    animation: "rotatePulse 8s linear infinite", // Changed to rotatePulse animation
                    [(theme) => theme.breakpoints.down("md")]: {
                      width: "140px",
                      height: "140px",
                      top: "-30px",
                    },
                    [(theme) => theme.breakpoints.down("sm")]: {
                      width: "90px",
                      height: "90px",
                      top: "-20px",
                    },
                  }}
                />

                {/* Large circle outline - bottom right */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "10%",
                    right: "-80px",
                    width: "280px",
                    height: "280px",
                    border: "2px solid rgba(6, 182, 212, 0.4)",
                    borderRadius: "50%",
                    zIndex: 0,
                    animation: "slideAndGlow 4s ease-in-out infinite", // Changed to slideAndGlow animation
                    [(theme) => theme.breakpoints.down("md")]: {
                      width: "180px",
                      height: "180px",
                      right: "-40px",
                    },
                    [(theme) => theme.breakpoints.down("sm")]: {
                      width: "120px",
                      height: "120px",
                      right: "-25px",
                      bottom: "5%",
                    },
                  }}
                />

                {/* Main image with custom mask */}
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 8,
                    borderRadius: {
                      xs: "120px 120px 15px",
                      sm: "160px 160px 15px",
                      md: "170px 170px 20px",
                    },
                    overflow: "hidden",
                    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "-30px",
                      right: "-30px",
                      width: "250px",
                      height: "250px",
                      background: "rgba(6, 182, 212, 0.3)",
                      borderRadius: "50%",
                      filter: "blur(60px)",
                      zIndex: -1,
                      [(theme) => theme.breakpoints.down("md")]: {
                        width: "150px",
                        height: "150px",
                        top: "-20px",
                        right: "-20px",
                      },
                      [(theme) => theme.breakpoints.down("sm")]: {
                        width: "100px",
                        height: "100px",
                        top: "-15px",
                        right: "-15px",
                      },
                    },
                  }}
                >
                  <img
                    src="/images/hero-new.png"
                    alt="Business team collaboration"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </Box>

                {/* Small cyan dots */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "30%",
                    left: "15%",
                    width: "12px",
                    height: "12px",
                    background: "#06b6d4",
                    borderRadius: "50%",
                    zIndex: 3,
                    [(theme) => theme.breakpoints.down("md")]: {
                      width: "8px",
                      height: "8px",
                    },
                    [(theme) => theme.breakpoints.down("sm")]: {
                      width: "6px",
                      height: "6px",
                    },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "15%",
                    right: "35%",
                    width: "8px",
                    height: "8px",
                    background: "#06b6d4",
                    borderRadius: "50%",
                    zIndex: 3,
                    [(theme) => theme.breakpoints.down("md")]: {
                      width: "6px",
                      height: "6px",
                    },
                    [(theme) => theme.breakpoints.down("sm")]: {
                      width: "4px",
                      height: "4px",
                    },
                  }}
                />
              </Box>
            </ImageWrapper>
          </Grid>
        </Grid>
      </Container>
    </HeroBackground>
  );
};

export default HeroSection;
