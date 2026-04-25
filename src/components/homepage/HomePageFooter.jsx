import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
} from "@mui/icons-material";
import { X } from "@mui/icons-material";

const FooterBackground = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #1a2a6c 0%, #2c3e50 100%)",
  color: theme.palette.common.white,
  padding: theme.spacing(8, 0, 4),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url('/images/footer-pattern.png')",
    opacity: 0.1,
    pointerEvents: "none",
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.grey[300],
  textDecoration: "none",
  display: "block",
  marginBottom: theme.spacing(1.5),
  fontSize: "0.9rem",
  fontWeight: 400,
  transition: "all 0.3s ease",
  "&:hover": {
    color: theme.palette.common.white,
    transform: "translateX(5px)",
  },
}));

const FooterHeading = styled(Typography)(({ theme }) => ({
  position: "relative",
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(2),
  fontWeight: 700,
  fontSize: "1.2rem",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "50px",
    height: "3px",
    background: theme.palette.primary.main,
    borderRadius: "3px",
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  margin: theme.spacing(0, 0.5),
  width: 40,
  height: 40,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    transform: "translateY(-3px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  transition: "all 0.3s ease",
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1.5),
  "& svg": {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

// Mobile-specific components (hidden on desktop)
const MobileFooterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const MobileAccordion = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const MobileAccordionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  padding: theme.spacing(2, 0),
}));

const MobileAccordionContent = styled(Box)(({ theme, open }) => ({
  maxHeight: open ? "500px" : "0",
  overflow: "hidden",
  transition: "max-height 0.3s ease",
  paddingLeft: theme.spacing(1),
}));

const HomePageFooter = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Mobile accordion state
  const [openSections, setOpenSections] = React.useState({
    services: false,
    tools: false,
    links: false,
    legal: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Desktop Footer (unchanged)
  const DesktopFooter = () => (
    <Container style={{ maxWidth: "1400px" }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4} style={{ flex: "1.5" }}>
          <img
            src="/images/white-logo.png"
            alt="Credit Dost Logo"
            style={{ width: "200px", marginBottom: "20px" }}
          />
          <Typography variant="body2" color="grey.300" mb={3} lineHeight={1.6}>
            Credit Dost Suvidha Centre is a dedicated financial service point
            offering credit score repair, loan assistance, and financial support
            services.
          </Typography>
          <Box mb={2}>
            <ContactInfo>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <Typography variant="body2" color="grey.300">
                info@creditdost.co.in
              </Typography>
            </ContactInfo>
            <ContactInfo>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <Typography variant="body2" color="grey.300">
                +91 92174-69202
              </Typography>
            </ContactInfo>
          </Box>
          <Box>
            <a
              href="https://www.facebook.com/aapkacreditdost"
              target="_blank"
              style={{ color: "white" }}
            >
              <SocialIcon size="small">
                <FacebookIcon />
              </SocialIcon>
            </a>
            <a
              href="https://x.com/aapkacreditdost"
              target="_blank"
              style={{ color: "white" }}
            >
              <SocialIcon size="small">
                <X />
              </SocialIcon>
            </a>
            <a href="https://www.instagram.com/aapkacreditdost" target="_blank">
              <SocialIcon size="small">
                <InstagramIcon />
              </SocialIcon>
            </a>
            <a
              href="https://www.linkedin.com/company/aapkacreditdost"
              target="_blank"
            >
              <SocialIcon size="small">
                <LinkedInIcon />
              </SocialIcon>
            </a>
            <a
              href="http://www.youtube.com/@aapkacreditdost"
              target="_blank"
              style={{ color: "white", marginTop: "10px" }}
            >
              <SocialIcon size="small">
                <YouTubeIcon />
              </SocialIcon>
            </a>
          </Box>
        </Grid>

        <Grid item xs={6} md={2} style={{ flex: "1", marginLeft: "40px" }}>
          <FooterHeading variant="h6" gutterBottom>
            Services
          </FooterHeading>
          <FooterLink href="/credit-score-repair">
            Credit Score Repair
          </FooterLink>
          <FooterLink href="/franchise-opportunity">
            Franchise Opportunity
          </FooterLink>
          <FooterLink href="/apply-for-loan">Apply for Loan</FooterLink>
          <FooterLink href="/credit-check">Free Credit Report</FooterLink>
          <FooterLink href="/suvidha-centre">Suvidha Centre</FooterLink>
        </Grid>

        <Grid item xs={6} md={2} style={{ flex: "1" }}>
          <FooterHeading variant="h6" gutterBottom>
            Financial Tools
          </FooterHeading>
          <FooterLink href="/credit-check">Free Credit Report</FooterLink>
          <FooterLink href="/emi-calculator">EMI Calculator</FooterLink>
          <FooterLink href="/ifsc-finder">IFSC Finder</FooterLink>
        </Grid>

        <Grid item xs={6} md={2} style={{ flex: "1" }}>
          <FooterHeading variant="h6" gutterBottom>
            Quick Links
          </FooterHeading>
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/contact">Contact Us</FooterLink>
          <FooterLink href="/careers">Careers</FooterLink>
          <FooterLink href="/suvidha-centre">Suvidha Centre</FooterLink>
          <FooterLink href="/blogs">Blog</FooterLink>
        </Grid>

        <Grid item xs={6} md={2} style={{ flex: "1" }}>
          <FooterHeading variant="h6" gutterBottom>
            Legal
          </FooterHeading>
          <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
          <FooterLink href="/terms-and-conditions">Terms of Service</FooterLink>
          <FooterLink href="/disclaimer">Disclaimer</FooterLink>
          <FooterLink href="/refund-policy">Refund Policy</FooterLink>
        </Grid>
      </Grid>

      <Box
        mt={8}
        pt={4}
        borderTop={`1px solid rgba(255, 255, 255, 0.1)`}
        textAlign="center"
      >
        <Typography variant="body2" color="grey.400">
          © {new Date().getFullYear()} Credit Dost. All rights reserved.
        </Typography>
        <Typography variant="caption" display="block" color="grey.500" mt={1}>
          {/* Optimystic Auxiliary Services Private Limited &nbsp; (Designed by{" "}
          <a
            href="https://gdscreatives.in/"
            style={{ color: "white" }}
            target="_blank"
          >
            GDS Creatives
          </a>
          ) */}
        </Typography>
      </Box>
    </Container>
  );

  // Mobile Footer (new responsive version)
  const MobileFooter = () => (
    <Container maxWidth="lg">
      {/* Company Info Section */}
      <MobileFooterSection>
        <img
          src="/images/white-logo.png"
          alt="Credit Dost Logo"
          style={{ width: "180px", marginBottom: "16px" }}
        />
        <Typography
          variant="body2"
          color="grey.300"
          mb={3}
          lineHeight={1.6}
          fontSize="0.9rem"
        >
          Credit Dost Suvidha Centre is a dedicated financial service point
          offering credit score repair, loan assistance, and financial support
          services.
        </Typography>

        <Box mb={2}>
          <ContactInfo>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <Typography variant="body2" color="grey.300" fontSize="0.9rem">
              info@creditdost.co.in
            </Typography>
          </ContactInfo>
          <ContactInfo>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            <Typography variant="body2" color="grey.300" fontSize="0.9rem">
              +91 92174-69202
            </Typography>
          </ContactInfo>
        </Box>

        {/* Social Icons */}
        <Box display="flex" justifyContent="center" mb={4}>
          <a
            href="https://www.facebook.com/creditdost/"
            style={{ color: "white" }}
          >
            <SocialIcon size="small">
              <FacebookIcon />
            </SocialIcon>
          </a>
          <a
            href="https://www.youtube.com/@CreditDostLearning"
            style={{ color: "white" }}
          >
            <SocialIcon size="small">
              <YouTubeIcon />
            </SocialIcon>
          </a>
          <a href="https://www.linkedin.com/company/creditdost/">
            <SocialIcon size="small">
              <LinkedInIcon />
            </SocialIcon>
          </a>
          <a href="https://www.instagram.com/credit.dost/">
            <SocialIcon size="small">
              <InstagramIcon />
            </SocialIcon>
          </a>
        </Box>
      </MobileFooterSection>

      {/* Two-column grid for accordions */}
      <Grid container spacing={2}>
        {/* First column */}
        <Grid item xs={6}>
          {/* Services Accordion */}
          <MobileAccordion>
            <MobileAccordionHeader onClick={() => toggleSection("services")}>
              <FooterHeading
                variant="h6"
                style={{ fontSize: "1rem", margin: 0 }}
              >
                Services
              </FooterHeading>
              <Typography color="grey.300">
                {openSections.services ? "−" : "+"}
              </Typography>
            </MobileAccordionHeader>
            <MobileAccordionContent open={openSections.services}>
              <FooterLink href="/credit-score-repair">
                Credit Score Repair
              </FooterLink>
              <FooterLink href="/franchise-opportunity">
                Franchise Opportunity
              </FooterLink>
              <FooterLink href="/apply-for-loan">Apply for Loan</FooterLink>
              <FooterLink href="/credit-check">Free Credit Report</FooterLink>
              <FooterLink href="/suvidha-centre">Suvidha Centre</FooterLink>
            </MobileAccordionContent>
          </MobileAccordion>

          {/* Financial Tools Accordion */}
          <MobileAccordion>
            <MobileAccordionHeader onClick={() => toggleSection("tools")}>
              <FooterHeading
                variant="h6"
                style={{ fontSize: "1rem", margin: 0 }}
              >
                Financial Tools
              </FooterHeading>
              <Typography color="grey.300">
                {openSections.tools ? "−" : "+"}
              </Typography>
            </MobileAccordionHeader>
            <MobileAccordionContent open={openSections.tools}>
              <FooterLink href="/credit-check">Free Credit Report</FooterLink>
              <FooterLink href="/emi-calculator">EMI Calculator</FooterLink>
              <FooterLink href="/ifsc-finder">IFSC Finder</FooterLink>
            </MobileAccordionContent>
          </MobileAccordion>
        </Grid>

        {/* Second column */}
        <Grid item xs={6}>
          {/* Quick Links Accordion */}
          <MobileAccordion>
            <MobileAccordionHeader onClick={() => toggleSection("links")}>
              <FooterHeading
                variant="h6"
                style={{ fontSize: "1rem", margin: 0 }}
              >
                Quick Links
              </FooterHeading>
              <Typography color="grey.300">
                {openSections.links ? "−" : "+"}
              </Typography>
            </MobileAccordionHeader>
            <MobileAccordionContent open={openSections.links}>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/suvidha-centre">Suvidha Centre</FooterLink>
              <FooterLink href="/blogs">Blog</FooterLink>
            </MobileAccordionContent>
          </MobileAccordion>

          {/* Legal Accordion */}
          <MobileAccordion>
            <MobileAccordionHeader onClick={() => toggleSection("legal")}>
              <FooterHeading
                variant="h6"
                style={{ fontSize: "1rem", margin: 0 }}
              >
                Legal
              </FooterHeading>
              <Typography color="grey.300">
                {openSections.legal ? "−" : "+"}
              </Typography>
            </MobileAccordionHeader>
            <MobileAccordionContent open={openSections.legal}>
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="/terms-and-conditions">
                Terms of Service
              </FooterLink>
              <FooterLink href="/disclaimer">Disclaimer</FooterLink>
              <FooterLink href="/refund-policy">Refund Policy</FooterLink>
            </MobileAccordionContent>
          </MobileAccordion>
        </Grid>
      </Grid>

      {/* Copyright Section */}
      <Box
        mt={4}
        pt={3}
        borderTop={`1px solid rgba(255, 255, 255, 0.1)`}
        textAlign="center"
      >
        <Typography variant="body2" color="grey.400" fontSize="0.85rem">
          © {new Date().getFullYear()} Credit Dost. All rights reserved.
        </Typography>
        <Typography
          variant="caption"
          display="block"
          color="grey.500"
          mt={1}
          fontSize="0.75rem"
        >
          Optimystic Auxiliary Services Private Limited <br />
          (Designed by{" "}
          <a
            href="https://gdscreatives.in/"
            style={{ color: "white" }}
            target="_blank"
          >
            GDS Creatives
          </a>
          )
        </Typography>
      </Box>
    </Container>
  );

  return (
    <FooterBackground component="footer">
      {isMobile ? <MobileFooter /> : <DesktopFooter />}
    </FooterBackground>
  );
};

export default HomePageFooter;
