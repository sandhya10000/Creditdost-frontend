import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Handshake, Store, ArrowUpRight } from "lucide-react";
import { Box, Typography, styled } from "@mui/material";

// BRAND DESIGN TOKENS
const COLORS = {
  cyan600: "#0891b2",
  cyan500: "#06b6d4",
  cyan300: "#22d3ee",
  sky500: "#0ea5e9",
  navy950: "#0a1929",
  navy900: "#0d2847",
  navy800: "#1a2744",
  textLight: "#0f172a",
  textMuted: "#475569",
  bgLight: "#f8fafc",
};

const services = [
  {
    title: "Credit Score Repair",
    description:
      "Expert credit repair services that fix errors, improve your score, and restore your financial credibility.",
    image: "/images/IMG 2-01.jpg",
    link: "/credit-score-repair",
    icon: ShieldCheck,
  },
  {
    title: "Franchise Opportunity",
    description:
      "Partner with Credit Dost and build a rewarding business helping people improve their credit scores and financial confidence.",
    image: "/images/franchise-new.jpeg",
    link: "/franchise-opportunity",
    icon: Handshake,
  }
];

const SectionRoot = styled("section")(() => ({
  position: "relative",
  zIndex: 0,
  backgroundColor: COLORS.bgLight,
  marginTop: "calc(-1 * clamp(28px, 5vw, 64px))",
  paddingTop: "clamp(56px, 6vw, 88px)",
  paddingBottom: "clamp(64px, 8vw, 112px)",
  overflowX: "clip",
  width: "100%",
  boxSizing: "border-box",

  // Soft cyan glow behind cards - fades to nothing within 120px of top edge
  "&::before": {
    content: '""',
    position: "absolute",
    top: "35%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "clamp(350px, 60vw, 850px)",
    height: "clamp(300px, 45vw, 650px)",
    background: "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)",
    filter: "blur(100px)",
    pointerEvents: "none",
    zIndex: 0,
    maskImage: "linear-gradient(to bottom, transparent 0px, transparent 120px, black 180px)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, transparent 120px, black 180px)",
  },
}));

// Faint dot-grid overlay masked with radial fade and top fade
const GridOverlay = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage:
    "radial-gradient(rgba(15, 23, 42, 0.08) 1.2px, transparent 1.2px)",
  backgroundSize: "28px 28px",
  maskImage:
    "linear-gradient(to bottom, transparent 0px, transparent 120px, black 180px), radial-gradient(circle at 50% 40%, black 20%, transparent 75%)",
  WebkitMaskImage:
    "linear-gradient(to bottom, transparent 0px, transparent 120px, black 180px), radial-gradient(circle at 50% 40%, black 20%, transparent 75%)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
  pointerEvents: "none",
  zIndex: 1,
}));

// Pill chip in the same style as hero eyebrow on light background
const EyebrowChip = styled(Box)(() => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 14px",
  borderRadius: "999px",
  backgroundColor: "rgba(8, 145, 178, 0.08)",
  border: "1px solid rgba(8, 145, 178, 0.25)",
  color: "#0e7490",
  fontFamily: "'Poppins', sans-serif",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  marginBottom: "16px",
}));

const PulsingDot = styled(Box)(() => ({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: COLORS.cyan600,
  boxShadow: `0 0 8px ${COLORS.cyan500}`,
  animation: "dotPulse 2s ease-in-out infinite",
  "@keyframes dotPulse": {
    "0%, 100%": { opacity: 1, transform: "scale(1)" },
    "50%": { opacity: 0.35, transform: "scale(0.85)" },
  },
}));

const CardsGrid = styled("div")(() => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "clamp(24px, 3vw, 36px)",
  alignItems: "stretch",
  marginTop: "48px",
  "@media (min-width: 768px)": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
}));

const ServiceCard = styled("article")(() => ({
  position: "relative",
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  border: "1px solid rgba(15, 23, 42, 0.06)",
  boxShadow: "0 10px 30px rgba(10, 25, 41, 0.07)",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",

  "@media (prefers-reduced-motion: no-preference)": {
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 22px 50px rgba(8, 145, 178, 0.18)",
      borderColor: "rgba(8, 145, 178, 0.35)",
      "& .service-img": {
        transform: "scale(1.05)",
      },
      "& .arrow-btn": {
        background: `linear-gradient(135deg, ${COLORS.cyan600} 0%, ${COLORS.sky500} 100%)`,
        color: "#ffffff",
        transform: "rotate(45deg)",
      },
    },
  },

  "&:focus-within": {
    outline: `2px solid ${COLORS.cyan600}`,
    outlineOffset: "3px",
  },
}));

const ImageContainer = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  aspectRatio: "16 / 10",
  borderRadius: "16px",
  overflow: "hidden",
  backgroundColor: COLORS.navy900,
}));

const StyledImage = styled("img")(() => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
}));

// 52px rounded-14px icon chip overlapping bottom-left edge of the image
const FloatingIconChip = styled(Box)(() => ({
  position: "absolute",
  bottom: "-16px",
  left: "20px",
  width: "52px",
  height: "52px",
  borderRadius: "14px",
  background: `linear-gradient(135deg, ${COLORS.cyan600} 0%, ${COLORS.cyan500} 100%)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  border: "3px solid #ffffff",
  boxShadow: "0 8px 20px rgba(8, 145, 178, 0.3)",
  zIndex: 3,
}));

const CardBody = styled(Box)(() => ({
  padding: "28px 20px 20px",
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
}));

const CardFooter = styled(Box)(() => ({
  marginTop: "auto",
  display: "flex",
  justifyContent: "flex-end",
  paddingTop: "16px",
}));

const ArrowButton = styled(Box)(() => ({
  width: "44px",
  height: "44px",
  minWidth: "44px",
  borderRadius: "50%",
  backgroundColor: "rgba(8, 145, 178, 0.1)",
  color: COLORS.navy950,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
}));

const StaggerWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isVisible",
})(({ isVisible }) => ({
  opacity: isVisible ? 1 : 0,
  transition: "opacity 0.6s ease",
  "@media (prefers-reduced-motion: no-preference)": {
    "& .anim-header": {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
    },
    "& .anim-card-0": {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.6s ease 0.08s, transform 0.6s ease 0.08s",
    },
    "& .anim-card-1": {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.6s ease 0.16s, transform 0.6s ease 0.16s",
    },
    "& .anim-card-2": {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.6s ease 0.24s, transform 0.6s ease 0.24s",
    },
  },
}));

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionRoot ref={sectionRef} aria-labelledby="services-section-heading">
      <GridOverlay />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1440px",
          mx: "auto",
          px: "clamp(16px, 4vw, 48px)",
          boxSizing: "border-box",
        }}
      >
        <StaggerWrapper isVisible={isVisible}>
          {/* Header left-aligned like hero */}
          <Box className="anim-header">
            <EyebrowChip>
              <PulsingDot />
              OUR SERVICES
            </EyebrowChip>

            <Typography
              id="services-section-heading"
              component="h2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(1.75rem, 1.1rem + 2.6vw, 3rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                color: COLORS.navy950,
                margin: 0,
              }}
            >
              Innovate to{" "}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(90deg, ${COLORS.cyan600} 0%, ${COLORS.sky500} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                dominate
              </Box>{" "}
              with us
            </Typography>
          </Box>

          {/* Cards Grid: 2 equal columns, responsive for all screens */}
          <CardsGrid>
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <ServiceCard
                  key={service.title}
                  className={`anim-card-${index}`}
                >
                  {/* Image with overlapping icon chip */}
                  <ImageContainer>
                    <StyledImage
                      className="service-img"
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      decoding="async"
                      width="600"
                      height="375"
                    />
                    <FloatingIconChip aria-hidden="true">
                      <IconComponent size={24} />
                    </FloatingIconChip>
                  </ImageContainer>

                  {/* Body Content */}
                  <CardBody>
                    <Typography
                      component="h3"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        fontSize: "22px",
                        lineHeight: 1.3,
                        color: COLORS.navy950,
                        mb: 1.5,
                        mt: 1,
                      }}
                    >
                      <Link
                        to={service.link}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          outline: "none",
                        }}
                      >
                        {/* Stretched link pattern across entire card */}
                        <Box
                          component="span"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1,
                          }}
                          aria-hidden="true"
                        />
                        {service.title}
                      </Link>
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: 1.65,
                        color: COLORS.textMuted,
                      }}
                    >
                      {service.description}
                    </Typography>

                    {/* Footer Arrow Button (Decorative indicator) */}
                    <CardFooter>
                      <ArrowButton className="arrow-btn" aria-hidden="true">
                        <ArrowUpRight size={22} />
                      </ArrowButton>
                    </CardFooter>
                  </CardBody>
                </ServiceCard>
              );
            })}
          </CardsGrid>
        </StaggerWrapper>
      </Box>
    </SectionRoot>
  );
};

export default FeaturesSection;
