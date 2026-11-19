import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  styled,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Phone as PhoneIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

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

// 1. The outer header wrapper (the full-width strip behind the rounded card)
// is strictly transparent with no border, shadow, or blur.
const HeaderAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "scrolled" && prop !== "variant",
})(({ variant }) => {
  const isOverlay = variant === "overlay";

  return {
    color: COLORS.navy800,
    fontFamily: "'Inter', sans-serif",
    zIndex: 1200,

    ...(isOverlay
      ? {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          backgroundColor: "transparent",
          boxShadow: "none",
          border: "none",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          padding: 0,
        }
      : {
          position: "sticky",
          top: 0,
          width: "100%",
          backgroundColor: "#ffffff",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 2px 20px rgba(0, 0, 0, 0.05)",
          borderBottom: "1px solid rgba(15, 23, 42, 0.06)",
        }),
  };
});

// The rounded floating white card inside the transparent wrapper
const NavGlassCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "scrolled" && prop !== "variant",
})(({ scrolled, variant }) => {
  const isOverlay = variant === "overlay";

  if (!isOverlay) {
    return {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    };
  }

  return {
    width: "98%",
    maxWidth: "none",
    margin: "0 auto",
    marginTop: "max(clamp(8px, 1.2vw, 16px), env(safe-area-inset-top, 0px))",
    borderRadius: "20px",
    backgroundColor: scrolled
      ? "rgba(255, 255, 255, 0.98)"
      : "rgba(255, 255, 255, 0.94)",
    backdropFilter: "blur(16px) saturate(160%)",
    WebkitBackdropFilter: "blur(16px) saturate(160%)",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    boxShadow: scrolled
      ? "0 14px 38px rgba(10, 25, 41, 0.22)"
      : "0 10px 30px rgba(10, 25, 41, 0.18)",
    boxSizing: "border-box",
    transition: "background-color 0.25s ease, box-shadow 0.25s ease",
    "@media (max-width: 600px)": {
      borderRadius: "14px",
      marginTop: "max(8px, env(safe-area-inset-top, 0px))",
    },
  };
});

const LogoBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  position: "relative",
  flexShrink: 0,
  "&:focus-visible": {
    outline: `2px solid ${COLORS.cyan600}`,
    outlineOffset: "4px",
    borderRadius: "8px",
  },
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: "clamp(14px, 1.05vw, 15.5px)",
  fontWeight: active ? 600 : 500,
  textTransform: "none",
  whiteSpace: "nowrap",
  color: active ? "#0e7490" : COLORS.navy800,
  padding: "8px clamp(10px, 1vw, 16px)",
  borderRadius: "12px",
  backgroundColor: active ? "rgba(8, 145, 178, 0.12)" : "transparent",
  transition: "all 0.2s ease-in-out",
  flexShrink: 0,
  "&:hover": {
    color: COLORS.cyan600,
    backgroundColor: "rgba(8, 145, 178, 0.08)",
  },
  "&:focus-visible": {
    outline: `2px solid ${COLORS.cyan600}`,
    outlineOffset: "2px",
  },
}));

const PhoneLink = styled("a")(() => ({
  display: "flex",
  alignItems: "center",
  gap: "clamp(6px, 0.8vw, 10px)",
  textDecoration: "none",
  whiteSpace: "nowrap",
  padding: "4px 6px",
  borderRadius: "10px",
  flexShrink: 0,
  transition: "opacity 0.2s ease",
  "&:hover": {
    opacity: 0.9,
  },
  "&:focus-visible": {
    outline: `2px solid ${COLORS.cyan600}`,
    outlineOffset: "2px",
  },
}));

const PhoneIconChip = styled(Box)(() => ({
  width: 40,
  height: 40,
  minWidth: 40,
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${COLORS.cyan600} 0%, ${COLORS.cyan500} 100%)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  boxShadow: "0 4px 12px rgba(8, 145, 178, 0.25)",
  flexShrink: 0,
}));

const LoginGhostButton = styled(Button)(() => ({
  fontFamily: "'Poppins', sans-serif",
  color: "#0e7490",
  fontWeight: 600,
  fontSize: "clamp(13px, 0.95vw, 14px)",
  textTransform: "none",
  whiteSpace: "nowrap",
  height: "44px",
  padding: "0 clamp(14px, 1.3vw, 22px)",
  borderRadius: "12px",
  border: "1px solid rgba(8, 145, 178, 0.35)",
  backgroundColor: "transparent",
  flexShrink: 0,
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: "rgba(6, 182, 212, 0.08)",
    borderColor: COLORS.cyan600,
    transform: "translateY(-1px)",
  },
  "&:focus-visible": {
    outline: `2px solid ${COLORS.cyan600}`,
    outlineOffset: "2px",
  },
}));

const FranchiseCTAButton = styled(Button)(() => ({
  fontFamily: "'Poppins', sans-serif",
  color: "#ffffff",
  fontWeight: 600,
  fontSize: "clamp(13px, 0.95vw, 14px)",
  textTransform: "none",
  whiteSpace: "nowrap",
  height: "44px",
  padding: "0 clamp(14px, 1.3vw, 22px)",
  borderRadius: "12px",
  flexShrink: 0,
  background: `linear-gradient(135deg, ${COLORS.cyan600} 0%, ${COLORS.sky500} 100%)`,
  boxShadow: "0 6px 20px rgba(8, 145, 178, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "60%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)",
    transform: "skewX(-20deg)",
    transition: "left 0.75s ease",
  },
  "&:hover": {
    transform: "translateY(-1px)",
    background: `linear-gradient(135deg, ${COLORS.cyan600} 0%, ${COLORS.sky500} 100%)`,
    boxShadow: "0 8px 24px rgba(8, 145, 178, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
    "&::before": {
      left: "150%",
    },
  },
  "&:active": {
    transform: "scale(0.98)",
  },
  "&:focus-visible": {
    outline: `2px solid ${COLORS.cyan600}`,
    outlineOffset: "2px",
  },
}));

const UserProfileButton = styled(IconButton)(() => ({
  width: 42,
  height: 42,
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${COLORS.cyan600} 0%, ${COLORS.cyan500} 100%)`,
  color: "#ffffff",
  flexShrink: 0,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 15px rgba(8, 145, 178, 0.4)",
  },
  "&:focus-visible": {
    outline: `2px solid ${COLORS.cyan600}`,
    outlineOffset: "2px",
  },
}));

const Header = ({ variant = "overlay" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  // Responsive breakpoints
  const isDesktop = useMediaQuery("(min-width:1180px)");
  const isCompactDesktop = useMediaQuery("(min-width:1180px) and (max-width:1300px)");
  const showPhoneIconOnly = useMediaQuery("(min-width:400px)");

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleDashboard = () => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/franchise");
    }
    handleUserMenuClose();
  };

  const navItems = [
    { text: "Home", path: "/" },
    { text: "About Us", path: "/about" },
    { text: "Credit Score Repair", path: "/credit-score-repair" },
    { text: "Download Free Credit Report", path: "/credit-check" },
  ];

  const drawer = (
    <Box
      sx={{
        width: "min(86vw, 340px)",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        p: 2.5,
        pb: "max(16px, env(safe-area-inset-bottom, 16px))",
        boxSizing: "border-box",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Drawer"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <a href="/" style={{ display: "inline-block" }}>
          <img
            src="/images/cred.png"
            alt="Credit Dost Logo"
            style={{ height: "34px", width: "auto", display: "block" }}
          />
        </a>
        <IconButton
          onClick={handleDrawerToggle}
          aria-label="Close menu drawer"
          sx={{
            color: COLORS.navy800,
            width: 44,
            height: 44,
            "&:focus-visible": {
              outline: `2px solid ${COLORS.cyan600}`,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(15, 23, 42, 0.08)", mb: 1.5 }} />

      <List sx={{ flexGrow: 1, py: 0, overflowY: "auto" }} aria-label="Mobile Navigation">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <ListItem
              key={item.text}
              component="button"
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                minHeight: 52,
                borderRadius: "12px",
                mb: 1,
                border: "none",
                background: isActive ? "rgba(8, 145, 178, 0.12)" : "transparent",
                color: isActive ? "#0e7490" : COLORS.navy800,
                textAlign: "left",
                cursor: "pointer",
                px: 2,
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "rgba(8, 145, 178, 0.08)",
                  color: COLORS.cyan600,
                },
                "&:focus-visible": {
                  outline: `2px solid ${COLORS.cyan600}`,
                  outlineOffset: "2px",
                },
              }}
            >
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "16px",
                  fontWeight: isActive ? 600 : 500,
                  whiteSpace: "normal",
                }}
              />
            </ListItem>
          );
        })}

        <ListItem
          component="button"
          onClick={() => {
            navigate("/emi-calculator");
            setMobileOpen(false);
          }}
          sx={{
            minHeight: 52,
            borderRadius: "12px",
            mb: 1,
            border: "none",
            background: "transparent",
            color: COLORS.navy800,
            textAlign: "left",
            cursor: "pointer",
            px: 2,
            display: "flex",
            alignItems: "center",
            "&:hover": {
              background: "rgba(8, 145, 178, 0.08)",
              color: COLORS.cyan600,
            },
            "&:focus-visible": {
              outline: `2px solid ${COLORS.cyan600}`,
              outlineOffset: "2px",
            },
          }}
        >
          <ListItemText
            primary="EMI Calculator"
            primaryTypographyProps={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "16px",
              fontWeight: 500,
            }}
          />
        </ListItem>

        <ListItem
          component="button"
          onClick={() => {
            navigate("/ifsc-finder");
            setMobileOpen(false);
          }}
          sx={{
            minHeight: 52,
            borderRadius: "12px",
            mb: 1,
            border: "none",
            background: "transparent",
            color: COLORS.navy800,
            textAlign: "left",
            cursor: "pointer",
            px: 2,
            display: "flex",
            alignItems: "center",
            "&:hover": {
              background: "rgba(8, 145, 178, 0.08)",
              color: COLORS.cyan600,
            },
            "&:focus-visible": {
              outline: `2px solid ${COLORS.cyan600}`,
              outlineOffset: "2px",
            },
          }}
        >
          <ListItemText
            primary="IFSC Finder"
            primaryTypographyProps={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "16px",
              fontWeight: 500,
            }}
          />
        </ListItem>
      </List>

      <Box sx={{ pt: 2, borderTop: "1px solid rgba(15, 23, 42, 0.08)" }}>
        {/* Phone Card */}
        <PhoneLink
          href="tel:+919217469202"
          aria-label="Call Credit Dost Customer Support"
          style={{
            marginBottom: "16px",
            padding: "8px 12px",
            background: "rgba(8, 145, 178, 0.06)",
            borderRadius: "12px",
          }}
        >
          <PhoneIconChip>
            <PhoneIcon sx={{ fontSize: "1.1rem" }} />
          </PhoneIconChip>
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: COLORS.textMuted,
                display: "block",
                fontSize: "12px",
                lineHeight: 1.2,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Requesting A Call
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: COLORS.textLight,
                fontSize: "15px",
                fontFamily: "'Inter', sans-serif",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
            >
              +91 9217469202
            </Typography>
          </Box>
        </PhoneLink>

        {user ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleDashboard}
              sx={{
                fontFamily: "'Poppins', sans-serif",
                textTransform: "none",
                borderRadius: "12px",
                height: "44px",
                background: `linear-gradient(135deg, ${COLORS.cyan600} 0%, ${COLORS.sky500} 100%)`,
              }}
            >
              Dashboard
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleLogout}
              sx={{
                fontFamily: "'Poppins', sans-serif",
                textTransform: "none",
                borderRadius: "12px",
                height: "44px",
                color: COLORS.navy800,
                borderColor: "rgba(15, 23, 42, 0.2)",
              }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <LoginGhostButton fullWidth onClick={handleLogin}>
              Login
            </LoginGhostButton>
            <FranchiseCTAButton
              fullWidth
              onClick={() => {
                navigate("/franchise-opportunity");
                setMobileOpen(false);
              }}
            >
              Franchise Opportunity
            </FranchiseCTAButton>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <header style={{ "--nav-h": isDesktop ? "72px" : "60px" }}>
      <HeaderAppBar scrolled={scrolled} variant={variant} elevation={0}>
        <NavGlassCard scrolled={scrolled} variant={variant}>
          <Toolbar
            sx={{
              padding: "0 clamp(16px, 2vw, 32px) !important",
              minHeight: { xs: "60px !important", md: "60px !important", lg: "72px !important" },
              height: isDesktop ? "72px" : "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "clamp(12px, 1.5vw, 28px)",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Logo */}
            <LogoBox
              onClick={() => navigate("/")}
              tabIndex={0}
              role="button"
              aria-label="Credit Dost Home"
            >
              <img
                src="/images/cred.png"
                alt="Credit Dost Logo"
                style={{
                  height: isDesktop ? "38px" : "clamp(28px, 7vw, 34px)",
                  width: "auto",
                  display: "block",
                }}
              />
            </LogoBox>

            {/* Desktop Navigation Links */}
            {isDesktop && (
              <Box
                component="nav"
                aria-label="Main Navigation"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "1 1 auto",
                  minWidth: 0,
                  gap: "clamp(0px, 0.5vw, 8px)",
                }}
              >
                {navItems.map((item) => {
                  const isActive =
                    item.path === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.path);
                  return (
                    <NavButton
                      key={item.text}
                      active={isActive ? 1 : 0}
                      onClick={() => navigate(item.path)}
                    >
                      {item.text}
                    </NavButton>
                  );
                })}
              </Box>
            )}

            {/* Desktop Right Controls (Phone, Login, CTA) */}
            {isDesktop && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                  gap: "clamp(8px, 1vw, 16px)",
                }}
              >
                {/* Phone Callout */}
                <PhoneLink
                  href="tel:+919217469202"
                  aria-label="Call Credit Dost Support at +91 9217469202"
                >
                  <PhoneIconChip>
                    <PhoneIcon sx={{ fontSize: "1.15rem" }} />
                  </PhoneIconChip>
                  <Box sx={{ minWidth: 0 }}>
                    {!isCompactDesktop && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: COLORS.textMuted,
                          display: "block",
                          fontSize: "12px",
                          lineHeight: 1.2,
                          fontFamily: "'Inter', sans-serif",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Requesting A Call
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: COLORS.textLight,
                        fontSize: isCompactDesktop ? "14px" : "15px",
                        lineHeight: 1.2,
                        fontFamily: "'Inter', sans-serif",
                        fontVariantNumeric: "tabular-nums",
                        whiteSpace: "nowrap",
                      }}
                    >
                      +91 9217469202
                    </Typography>
                  </Box>
                </PhoneLink>

                {/* Auth Controls */}
                {user ? (
                  <Zoom in={true}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Tooltip title={user.name || "User Account"}>
                        <UserProfileButton
                          onClick={handleUserMenuOpen}
                          aria-label="Open User Account Menu"
                        >
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              bgcolor: "transparent",
                              color: "#ffffff",
                              fontSize: "1rem",
                              fontWeight: 600,
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            {user.name?.charAt(0) || "U"}
                          </Avatar>
                        </UserProfileButton>
                      </Tooltip>
                      <Menu
                        anchorEl={userMenuAnchor}
                        open={Boolean(userMenuAnchor)}
                        onClose={handleUserMenuClose}
                        TransitionComponent={Fade}
                        transitionDuration={250}
                        sx={{ mt: 1.5 }}
                        PaperProps={{
                          sx: {
                            borderRadius: "16px",
                            boxShadow: "0 10px 30px rgba(10, 25, 41, 0.15)",
                            minWidth: 200,
                          },
                        }}
                      >
                        <MenuItem sx={{ py: 1.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                background: `linear-gradient(135deg, ${COLORS.cyan600}, ${COLORS.cyan500})`,
                              }}
                            >
                              {user.name?.charAt(0) || "U"}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {user.name || "User"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleDashboard}>
                          <DashboardIcon sx={{ mr: 1.5, fontSize: "1.2rem", color: COLORS.cyan600 }} />
                          Dashboard
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                          <LogoutIcon sx={{ mr: 1.5, fontSize: "1.2rem", color: COLORS.navy800 }} />
                          Logout
                        </MenuItem>
                      </Menu>
                    </Box>
                  </Zoom>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "clamp(8px, 0.9vw, 14px)",
                      flexShrink: 0,
                    }}
                  >
                    <LoginGhostButton
                      startIcon={<LoginIcon sx={{ fontSize: "1.1rem" }} />}
                      onClick={handleLogin}
                    >
                      Login
                    </LoginGhostButton>
                    <FranchiseCTAButton
                      onClick={() => navigate("/franchise-opportunity")}
                    >
                      Franchise Opportunity
                    </FranchiseCTAButton>
                  </Box>
                )}
              </Box>
            )}

            {/* Tablet & Mobile Right Controls */}
            {!isDesktop && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* Optional Phone Quick Button for mobile screen >= 400px */}
                {showPhoneIconOnly && (
                  <IconButton
                    component="a"
                    href="tel:+919217469202"
                    aria-label="Call Customer Support"
                    sx={{
                      width: 44,
                      height: 44,
                      color: COLORS.cyan600,
                      background: "rgba(8, 145, 178, 0.08)",
                      borderRadius: "50%",
                      "&:focus-visible": {
                        outline: `2px solid ${COLORS.cyan600}`,
                      },
                    }}
                  >
                    <PhoneIcon sx={{ fontSize: "1.2rem" }} />
                  </IconButton>
                )}

                {/* Hamburger Toggle */}
                <IconButton
                  onClick={handleDrawerToggle}
                  aria-label="Open menu"
                  aria-expanded={mobileOpen}
                  sx={{
                    color: COLORS.navy800,
                    width: 44,
                    height: 44,
                    "&:focus-visible": {
                      outline: `2px solid ${COLORS.cyan600}`,
                      outlineOffset: "2px",
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </NavGlassCard>
      </HeaderAppBar>

      {/* Mobile Slide-Out Drawer (Slides from Right, 100dvh) */}
      {!isDesktop && (
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
            disableScrollLock: false,
          }}
          PaperProps={{
            sx: {
              background: "#ffffff",
              boxShadow: "-8px 0 32px rgba(10, 25, 41, 0.15)",
              borderTopLeftRadius: "20px",
              borderBottomLeftRadius: "20px",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </header>
  );
};

export default Header;
