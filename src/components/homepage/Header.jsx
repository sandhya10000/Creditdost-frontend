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
  Container,
  Avatar,
  Tooltip,
  Badge,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  KeyboardArrowDown,
  Search as SearchIcon,
  Phone as PhoneIcon,
  Facebook,
  Twitter,
  LinkedIn,
  YouTube,
  ArrowForward,
  Person as PersonIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  AccountCircle,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const HeaderAppBar = styled(AppBar)(({ theme, scrolled }) => ({
  backgroundColor: scrolled ? "rgba(255, 255, 255, 0.98)" : "#ffffff",
  backdropFilter: "blur(10px)",
  boxShadow: scrolled
    ? "0 4px 30px rgba(0, 0, 0, 0.08)"
    : "0 2px 20px rgba(0, 0, 0, 0.05)",
  color: "#1a2744",
  position: "sticky",
  top: 0,
  zIndex: 1200,
  transition: "all 0.3s ease",
}));

const TopBar = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
  color: "white",
  padding: "8px 0",
  fontSize: "0.875rem",
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  position: "relative",
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  background: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontWeight: 700,
  fontSize: "1.2rem",
  marginRight: theme.spacing(1.5),
  boxShadow: "0 4px 15px rgba(8, 145, 178, 0.3)",
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: "1.75rem",
  background: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  letterSpacing: "-0.5px",
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: "#1a2744",
  fontWeight: 600,
  textTransform: "none",
  margin: theme.spacing(0, 0.5),
  padding: theme.spacing(1, 2),
  borderRadius: "8px",
  fontSize: "0.95rem",
  position: "relative",
  "&:hover": {
    backgroundColor: "rgba(8, 145, 178, 0.08)",
    "&::after": {
      width: "100%",
    },
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: "2px",
    background: "linear-gradient(90deg, #0891b2, #06b6d4)",
    transition: "width 0.3s ease",
  },
}));

const ServicesDropdown = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "inline-block",
}));

const ServicesButton = styled(Button)(({ theme }) => ({
  color: "#1a2744",
  fontWeight: 600,
  textTransform: "none",
  margin: theme.spacing(0, 0.5),
  padding: theme.spacing(1, 2),
  borderRadius: "8px",
  fontSize: "0.95rem",
  position: "relative",
  backgroundColor: "transparent",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(8, 145, 178, 0.08)",
    "&::after": {
      width: "100%",
    },
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: "2px",
    background: "linear-gradient(90deg, #0891b2, #06b6d4)",
    transition: "width 0.3s ease",
  },
}));

const DropdownMenu = styled(Box)(({ theme, open }) => ({
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translateX(-50%)",
  width: "260px",
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
  padding: theme.spacing(1.5),
  zIndex: 1300,
  opacity: open ? 1 : 0,
  visibility: open ? "visible" : "hidden",
  transition: "all 0.3s ease",
  marginTop: open ? theme.spacing(1) : 0,
}));

const DropdownItem = styled(Button)(({ theme }) => ({
  justifyContent: "flex-start",
  textTransform: "none",
  fontWeight: 500,
  color: "#1a2744",
  padding: theme.spacing(1.2, 2),
  borderRadius: "8px",
  width: "100%",
  margin: theme.spacing(0.2, 0),
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(8, 145, 178, 0.1)",
    color: "#0891b2",
    transform: "translateX(5px)",
  },
  "& .MuiButton-startIcon": {
    marginRight: theme.spacing(1.5),
  },
}));

const AuthButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
  color: "white",
  fontWeight: 700,
  textTransform: "none",
  padding: theme.spacing(1.5, 3),
  borderRadius: "50px",
  fontSize: "0.95rem",
  boxShadow: "0 4px 20px rgba(8, 145, 178, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 25px rgba(8, 145, 178, 0.4)",
    background: "linear-gradient(135deg, #0e7490 0%, #0891b2 100%)",
  },
}));

const ContactBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  marginRight: theme.spacing(3),
  padding: theme.spacing(1, 2),
  borderRadius: "50px",
  backgroundColor: "rgba(8, 145, 178, 0.08)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(8, 145, 178, 0.12)",
  },
}));

const PhoneIconBox = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: "pulse 2s infinite",
  "@keyframes pulse": {
    "0%, 100%": {
      boxShadow: "0 0 0 0 rgba(8, 145, 178, 0.4)",
    },
    "50%": {
      boxShadow: "0 0 0 10px rgba(8, 145, 178, 0)",
    },
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: "white",
  fontSize: "0.9rem",
  padding: theme.spacing(0.5),
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#fff",
    transform: "translateY(-2px)",
  },
}));

const SearchIconButton = styled(IconButton)(({ theme }) => ({
  color: "#1a2744",
  marginRight: theme.spacing(1),
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#0891b2",
    transform: "rotate(90deg)",
  },
}));

const UserProfileButton = styled(IconButton)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
  color: "white",
  marginLeft: theme.spacing(1),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 15px rgba(8, 145, 178, 0.4)",
  },
}));

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState({});
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event, menuName) => {
    setAnchorEl({ ...anchorEl, [menuName]: event.currentTarget });
  };

  const handleMenuClose = (menuName) => {
    setAnchorEl({ ...anchorEl, [menuName]: null });
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

  const handleRegister = () => {
    navigate("/register");
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
    { text: "Apply for loan", path: "/apply-for-loan" },

    // { text: "Suvidha Centre", path: "/suvidha-centre" },
  ];

  const drawer = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <a href="/">
            <img src="/images/cred.png" style={{ width: "150px" }} />
          </a>
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              handleDrawerToggle();
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem
          button
          onClick={() => {
            navigate("/credit-check");
            handleDrawerToggle();
          }}
        >
          <ListItemText primary="Credit Check" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            navigate("/emi-calculator");
            handleDrawerToggle();
          }}
        >
          <ListItemText primary="EMI Calculator" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            navigate("/ifsc-finder");
            handleDrawerToggle();
          }}
        >
          <ListItemText primary="IFSC Finder" />
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        {user ? (
          <Box sx={{ textAlign: "center" }}>
            <Avatar sx={{ width: 56, height: 56, margin: "0 auto 16px" }}>
              {user.name?.charAt(0) || "U"}
            </Avatar>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {user.name || "User"}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={handleDashboard}
              sx={{ mb: 1 }}
            >
              Dashboard
            </Button>
            <Button fullWidth variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              sx={{ mb: 1 }}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                navigate("/franchise-opportunity");
                handleDrawerToggle();
              }}
            >
              Franchise Opportunity
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <HeaderAppBar scrolled={scrolled} elevation={0}>
        <Container maxWidth="xl">
          <Toolbar
            sx={{ padding: "0 !important", minHeight: "80px !important" }}
          >
            {isMobile && (
              <IconButton
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1, color: "#1a2744" }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <LogoBox>
              <a href="/">
                <img src="/images/cred.png" style={{ width: "150px" }} />
              </a>
            </LogoBox>

            {!isMobile && (
              <>
                <Box
                  sx={{
                    ml: 6,
                    display: "flex",
                    alignItems: "center",
                    flexGrow: 1,
                  }}
                >
                  {navItems.map((item) => (
                    <Box key={item.text}>
                      {item.hasDropdown ? (
                        <ServicesDropdown
                          onMouseEnter={(e) => handleMenuClick(e, "services")}
                          onMouseLeave={() => handleMenuClose("services")}
                        >
                          <ServicesButton endIcon={<KeyboardArrowDown />}>
                            {item.text}
                          </ServicesButton>
                          <DropdownMenu open={Boolean(anchorEl["services"])}>
                            <DropdownItem
                              onClick={() => {
                                navigate("/credit-score-repair");
                                handleMenuClose("services");
                              }}
                              startIcon={
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    backgroundColor: "#8b5cf6",
                                  }}
                                />
                              }
                            >
                              Credit Score Repair
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => {
                                navigate("/apply-for-loan");
                                handleMenuClose("services");
                              }}
                              startIcon={
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    backgroundColor: "#0ea5e9",
                                  }}
                                />
                              }
                            >
                              Apply for Loan
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => {
                                navigate("/franchise-opportunity");
                                handleMenuClose("services");
                              }}
                              startIcon={
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    backgroundColor: "#ef4444",
                                  }}
                                />
                              }
                            >
                              Franchise Opportunity
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => {
                                navigate("/careers");
                                handleMenuClose("services");
                              }}
                              startIcon={
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    backgroundColor: "#10b981",
                                  }}
                                />
                              }
                            >
                              Careers
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => {
                                navigate("/suvidha-centre");
                                handleMenuClose("services");
                              }}
                              startIcon={
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    backgroundColor: "#f59e0b",
                                  }}
                                />
                              }
                            >
                              Suvidha Centre
                            </DropdownItem>
                          </DropdownMenu>
                        </ServicesDropdown>
                      ) : (
                        <NavButton onClick={() => navigate(item.path)}>
                          {item.text}
                        </NavButton>
                      )}
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ContactBox>
                    <PhoneIconBox>
                      <PhoneIcon sx={{ color: "white", fontSize: "1.2rem" }} />
                    </PhoneIconBox>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          display: "block",
                          lineHeight: 1.2,
                        }}
                      >
                        Requesting A Call:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: "#1a2744",
                          fontSize: "1rem",
                        }}
                      >
                        +91 9217469202
                      </Typography>
                    </Box>
                  </ContactBox>

                  {user ? (
                    <Zoom in={true}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Tooltip title={user.name || "User"}>
                          <UserProfileButton onClick={handleUserMenuOpen}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "transparent",
                                color: "white",
                                fontSize: "1rem",
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
                          transitionDuration={300}
                          sx={{ mt: 1 }}
                        >
                          <MenuItem>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                                {user.name?.charAt(0) || "U"}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {user.name || "User"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  {user.email}
                                </Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                          <Divider />
                          <MenuItem onClick={handleDashboard}>
                            <DashboardIcon sx={{ mr: 1 }} />
                            Dashboard
                          </MenuItem>
                          <MenuItem onClick={handleLogout}>
                            <LogoutIcon sx={{ mr: 1 }} />
                            Logout
                          </MenuItem>
                        </Menu>
                      </Box>
                    </Zoom>
                  ) : (
                    <Zoom in={true}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AuthButton
                          startIcon={<LoginIcon />}
                          onClick={handleLogin}
                          sx={{ mr: 1 }}
                        >
                          Login
                        </AuthButton>
                        <AuthButton
                          variant="outlined"
                          sx={{
                            background: "white",
                            color: "black",
                            border: "2px solid",
                            borderColor: "primary.main",
                            "&:hover": {
                              background: "rgba(8, 145, 178, 0.1)",
                            },
                          }}
                          onClick={() => navigate("/franchise-opportunity")}
                        >
                          Franchise Opportunity
                        </AuthButton>
                      </Box>
                    </Zoom>
                  )}
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </HeaderAppBar>

      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: 280 } }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default Header;
