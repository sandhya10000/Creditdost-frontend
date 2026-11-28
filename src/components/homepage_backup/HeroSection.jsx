import React from "react";
import {
  Typography,
  Button,
  Box,
  styled,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PhotoCubeCard from "../PhotoCubeCard";

// CUSTOMER PHOTOS ARRAY
const CUSTOMER_PHOTOS = [
  {
    src: "/images/hero-new.png",
    alt: "Happy Credit Dost customer",
    name: "Customer name",
    city: "City",
  },
  {
    src: "/customers/customer-2.jpg",
    alt: "Happy Credit Dost customer",
    name: "Customer name",
    city: "City",
  },
  {
    src: "/customers/customer-3.jpg",
    alt: "Happy Credit Dost customer",
    name: "Customer name",
    city: "City",
  },
  {
    src: "/customers/customer-4.jpg",
    alt: "Happy Credit Dost customer",
    name: "Customer name",
    city: "City",
  },
];

// BRAND DESIGN TOKENS
const COLORS = {
  cyan600: "#0891b2",
  cyan500: "#06b6d4",
  cyan300: "#67e8f9",
  sky500: "#0ea5e9",
  navy950: "#0a1929",
  navy900: "#0d2847",
  navy800: "#1a2744",
  textLight: "#0f172a",
  textMuted: "#475569",
};

const HeroSectionRoot = styled("section")(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  background: `linear-gradient(160deg, ${COLORS.navy950} 0%, ${COLORS.navy900} 55%, ${COLORS.navy950} 100%)`,
  borderRadius: "0 0 clamp(28px, 5vw, 64px) clamp(28px, 5vw, 64px)",
  overflowX: "clip",
  overflowY: "visible",
  width: "100%",
  boxSizing: "border-box",

  // Uses --nav-h variable with safe-area and responsive vertical padding
  // Never a fixed height; caps gracefully at 820px or 100svh
  minHeight: "min(100svh, 820px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  paddingTop: "calc(var(--nav-h, 72px) + 16px + clamp(32px, 6vw, 72px))",
  paddingBottom: "clamp(72px, 9vw, 120px)",

  // Mesh glow 1 (Cyan top right)
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-10%",
    right: "-5%",
    width: "clamp(300px, 45vw, 650px)",
    height: "clamp(300px, 45vw, 650px)",
    background: "radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, transparent 70%)",
    filter: "blur(120px)",
    pointerEvents: "none",
    zIndex: 0,
  },

  // Mesh glow 2 (Sky bottom left)
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "5%",
    left: "-10%",
    width: "clamp(250px, 40vw, 600px)",
    height: "clamp(250px, 40vw, 600px)",
    background: "radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, transparent 70%)",
    filter: "blur(120px)",
    pointerEvents: "none",
    zIndex: 0,
  },
}));

// Faint background dot/line grid with radial fade
const GridOverlay = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage:
    "linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
  backgroundSize: "44px 44px",
  maskImage: "radial-gradient(circle at 50% 45%, black 25%, transparent 75%)",
  WebkitMaskImage: "radial-gradient(circle at 50% 45%, black 25%, transparent 75%)",
  pointerEvents: "none",
  zIndex: 1,
}));

// Eyebrow glass chip with small pulsing dot
const EyebrowChip = styled(Box)(() => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 14px",
  borderRadius: "999px",
  background: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  color: COLORS.cyan300,
  fontFamily: "'Poppins', sans-serif",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  marginBottom: "clamp(14px, 2vw, 24px)",
}));

const PulsingDot = styled(Box)(() => ({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: COLORS.cyan300,
  boxShadow: `0 0 10px ${COLORS.cyan300}`,
  animation: "dotPulse 2s ease-in-out infinite",
  "@keyframes dotPulse": {
    "0%, 100%": { opacity: 1, transform: "scale(1)" },
    "50%": { opacity: 0.4, transform: "scale(0.85)" },
  },
}));

// Primary CTA button with dark navy text on bright cyan and 40px circle arrow
const HeroCTAButton = styled(Button)(() => ({
  minHeight: "52px",
  height: "56px",
  borderRadius: "14px",
  padding: "0 8px 0 24px",
  background: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)",
  color: COLORS.navy950,
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  textTransform: "none",
  whiteSpace: "nowrap",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  boxShadow: "0 10px 30px rgba(6, 182, 212, 0.45)",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  width: "auto",
  "@media (max-width: 600px)": {
    width: "100%",
    maxWidth: "420px",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "60%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
    transform: "skewX(-20deg)",
    transition: "left 0.75s ease",
  },
  "&:hover": {
    transform: "translateY(-2px)",
    background: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)",
    boxShadow: "0 14px 38px rgba(6, 182, 212, 0.6)",
    "&::after": {
      left: "150%",
    },
    "& .cta-arrow-circle": {
      transform: "translateX(4px)",
    },
  },
  "&:active": {
    transform: "scale(0.98)",
  },
  "&:focus-visible": {
    outline: `2px solid ${COLORS.cyan300}`,
    outlineOffset: "3px",
  },
}));

const ArrowCircle = styled(Box)(() => ({
  width: "40px",
  height: "40px",
  minWidth: "40px",
  borderRadius: "50%",
  backgroundColor: "#ffffff",
  color: COLORS.navy950,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.25s ease",
}));

// Floating Glass Cards - Higher z-index than the cube (zIndex: 20), do not rotate with cube
const GlassCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "positionTop" && prop !== "delay",
})(({ positionTop, delay }) => ({
  position: "absolute",
  pointerEvents: "none",
  ...(positionTop
    ? { top: "20px", right: "-12px" }
    : { bottom: "40px", left: "-12px" }),
  background: "rgba(255, 255, 255, 0.16)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "16px",
  padding: "10px 16px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.35)",
  zIndex: 20,
  animation: `floatSlow 6s ease-in-out ${delay || "0s"} infinite`,
  "@keyframes floatSlow": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-10px)" },
  },
  "@media (min-width: 1024px)": {
    ...(positionTop
      ? { top: "24px", right: "-24px" }
      : { bottom: "52px", left: "-24px" }),
  },
  "@media (max-width: 600px)": {
    display: "none",
  },
}));

const IconChip = styled(Box)(() => ({
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  background: `linear-gradient(135deg, ${COLORS.cyan600}, ${COLORS.cyan500})`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  flexShrink: 0,
}));

const StaggerWrapper = styled(Box)(() => ({
  "@media (prefers-reduced-motion: no-preference)": {
    "& .stagger-1": { animation: "fadeUp 0.6s ease forwards 0.08s" },
    "& .stagger-2": { animation: "fadeUp 0.6s ease forwards 0.16s" },
    "& .stagger-3": { animation: "fadeUp 0.6s ease forwards 0.24s" },
    "& .stagger-4": { animation: "fadeUp 0.6s ease forwards 0.32s" },
    "& .stagger-5": { animation: "fadeUp 0.6s ease forwards 0.40s" },
    "& .hero-cube-scale": { animation: "scaleIn 0.8s ease forwards 0.15s" },
  },
  "@keyframes fadeUp": {
    from: { opacity: 0, transform: "translateY(24px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "@keyframes scaleIn": {
    from: { opacity: 0, transform: "scale(0.96)" },
    to: { opacity: 1, transform: "scale(1)" },
  },
}));

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <HeroSectionRoot>
      <GridOverlay />

      <Box
        sx={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          maxWidth: "1440px",
          mx: "auto",
          px: "clamp(16px, 4vw, 48px)",
          boxSizing: "border-box",
        }}
      >
        <StaggerWrapper>
          <Grid
            container
            spacing={{ xs: 5, md: 5, lg: 6 }}
            alignItems="center"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "column", lg: "row" },
            }}
          >
            {/* Left Column (55% desktop, centered on mobile/tablet) */}
            <Grid
              item
              xs={12}
              lg={6.5}
              sx={{
                width: "100%",
                maxWidth: { xs: "560px", lg: "none" },
                mx: { xs: "auto", lg: "0" },
                textAlign: { xs: "center", lg: "left" },
              }}
            >
              {/* Eyebrow */}
              <Box className="stagger-1">
                <EyebrowChip>
                  <PulsingDot />
                  BE INVEST
                </EyebrowChip>
              </Box>

              {/* Headline */}
              <Typography
                variant="h1"
                component="h1"
                className="stagger-2"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "clamp(2rem, 1.2rem + 3.6vw, 4rem)",
                  fontWeight: 700,
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  mb: 3,
                  maxWidth: "36em",
                  mx: { xs: "auto", lg: "0" },
                }}
              >
                Download Your{" "}
                <Box
                  component="span"
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    background: "linear-gradient(90deg, #67e8f9 0%, #38bdf8 50%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: "-4px",
                      left: 0,
                      width: "100%",
                      height: "6px",
                      borderRadius: "6px",
                      background: `linear-gradient(90deg, ${COLORS.cyan500}, ${COLORS.cyan300})`,
                    },
                  }}
                >
                  Credit Report
                </Box>
              </Typography>

              {/* Paragraph */}
              <Typography
                className="stagger-3"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(1rem, 0.95rem + 0.3vw, 1.125rem)",
                  lineHeight: 1.7,
                  color: "rgba(255, 255, 255, 0.78)",
                  maxWidth: "36em",
                  mx: { xs: "auto", lg: "0" },
                  mb: 4,
                }}
              >
                Your credit score shapes your financial opportunities. At Credit
                Dost, we help you correct errors, remove inaccurate negative
                entries, and improve your score so you can get loan approvals
                faster.
              </Typography>

              {/* Primary CTA */}
              <Box
                className="stagger-4"
                sx={{
                  mb: 4,
                  display: "flex",
                  justifyContent: { xs: "center", lg: "flex-start" },
                }}
              >
                <HeroCTAButton onClick={() => navigate("/credit-check")}>
                  <span>Download Free Credit Report</span>
                  <ArrowCircle className="cta-arrow-circle">
                    <ArrowForwardIcon sx={{ fontSize: "1.2rem" }} />
                  </ArrowCircle>
                </HeroCTAButton>
              </Box>

              {/* Trust Row */}
              <Box
                className="stagger-5"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", lg: "flex-start" },
                  flexWrap: "wrap",
                  gap: { xs: 2, sm: 3 },
                  pt: 1.5,
                  borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                  maxWidth: "36em",
                  mx: { xs: "auto", lg: "0" },
                }}
              >
                {/* Overlapping Initials Avatars */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {["AK", "PS", "RV", "MK"].map((initials, index) => (
                    <Box
                      key={initials}
                      sx={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        backgroundColor: index % 2 === 0 ? COLORS.navy800 : COLORS.cyan600,
                        border: "2px solid #ffffff",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: 700,
                        fontFamily: "'Poppins', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: index === 0 ? 0 : "-10px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      {initials}
                    </Box>
                  ))}
                </Box>

                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#ffffff",
                      lineHeight: 1.2,
                    }}
                  >
                    640+ Happy Customers
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.3 }}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: "#facc15", fontSize: "15px" }} />
                    ))}
                    <Typography
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.7)",
                        ml: 0.5,
                      }}
                    >
                      11 Years of experience
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right Column: 3D Photo Cube (max 440px desktop, min(80vw, 440px) mobile) */}
            <Grid
              item
              xs={12}
              lg={5.5}
              sx={{
                width: "100%",
                maxWidth: { xs: "min(80vw, 440px)", lg: "440px" },
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mx: "auto",
                  width: "100%",
                }}
              >
                {/* Soft cyan blurred ring */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100%",
                    height: "100%",
                    background: "radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 65%)",
                    filter: "blur(50px)",
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                />

                {/* Thin orbit ring outline */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "clamp(120px, 20vw, 180px)",
                    height: "clamp(120px, 20vw, 180px)",
                    borderRadius: "50%",
                    border: "1px solid rgba(103, 232, 249, 0.25)",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />

                {/* 3D Rotating Photo Cube Card */}
                <Box className="hero-cube-scale" sx={{ width: "100%", zIndex: 2 }}>
                  <PhotoCubeCard photos={CUSTOMER_PHOTOS} />
                </Box>

                {/* Floating Glass Card 1 (Top-Right) - Over corners, does not rotate */}
                <GlassCard positionTop={1} delay="0s">
                  <IconChip>
                    <VerifiedIcon sx={{ fontSize: "1.2rem" }} />
                  </IconChip>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#ffffff",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      640+
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.75)",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Happy Customers
                    </Typography>
                  </Box>
                </GlassCard>

                {/* Floating Glass Card 2 (Bottom-Left) - Over corners, does not rotate */}
                <GlassCard positionTop={0} delay="3s">
                  <IconChip>
                    <TrendingUpIcon sx={{ fontSize: "1.2rem" }} />
                  </IconChip>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#ffffff",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      11 Years
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.75)",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      of Experience
                    </Typography>
                  </Box>
                </GlassCard>
              </Box>
            </Grid>
          </Grid>
        </StaggerWrapper>
      </Box>
    </HeroSectionRoot>
  );
};

export default HeroSection;
