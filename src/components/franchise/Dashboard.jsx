import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  styled,
  useTheme,
  useMediaQuery,
  Tooltip,
  Alert,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Payment as PaymentIcon,
  VerifiedUser as VerifiedUserIcon,
  CreditScore as CreditScoreIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
  GroupAdd as GroupAddIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Description as DescriptionIcon,
  CardMembership as CardMembershipIcon,
  AutoGraph as AutoGraphIcon,
  BusinessCenter as BusinessCenterIcon,
  ChevronLeft as ChevronLeftIcon,
  WhatsApp as WhatsAppIcon,
  Logout as LogoutIcon,
  LibraryBooks as CaseStudiesIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth.jsx";
import { franchiseAPI } from "../../services/api";

// Styled components for enhanced UI
const drawerWidth = 260;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const SidebarLogo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  margin: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

const SidebarTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.2rem",
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginLeft: theme.spacing(1),
}));

const NavItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  backgroundColor: active
    ? alpha(theme.palette.primary.main, 0.1)
    : "transparent",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  "& .MuiListItemIcon-root": {
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  },
  "& .MuiListItemText-primary": {
    fontWeight: active ? 600 : 400,
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
  },
  cursor: "pointer",
}));

const FranchiseDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [kycStatus, setKycStatus] = useState(null);
  const [kycRejectedReason, setKycRejectedReason] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/admin");
    }
  }, [user, navigate]);

  // Fetch KYC status when component mounts
  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const response = await franchiseAPI.getKycStatus();
        setKycStatus(response.data.kycStatus);
        if (
          response.data.kycRequest &&
          response.data.kycRequest.rejectionReason
        ) {
          setKycRejectedReason(response.data.kycRequest.rejectionReason);
        }
      } catch (error) {
        console.error("Failed to fetch KYC status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "franchise_user") {
      fetchKycStatus();
    }
  }, [user]);

  // Redirect from base route to default child route only on initial load
  useEffect(() => {
    if (
      (location.pathname === "/franchise" ||
        location.pathname === "/franchise/") &&
      location.state?.redirect !== false
    ) {
      navigate("/franchise", { replace: true });
    }
  }, [location.pathname, navigate, location.state]);

  // Handle responsive drawer
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const handleDrawerTransitionEnd = () => {
    // Handle drawer transition end if needed
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    if (isMobile) {
      setMobileOpen(false);
    } else {
      setOpen(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    handleMenuClose();
  };

  // Define all menu items
  const allMenuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/franchise" },
    { text: "My Profile", icon: <PersonIcon />, path: "/franchise/profile" },
    // {
    //   text: "KYC Verification",
    //   icon: <VerifiedUserIcon />,
    //   path: "/franchise/kyc",
    // },
    {
      text: "WhatsApp Groups",
      icon: <WhatsAppIcon />,
      path: "/franchise/whatsapp-groups",
    },
    {
      text: "Credit Check",
      icon: <CreditScoreIcon />,
      path: "/franchise/credit-check",
    },
    { text: "My Leads", icon: <PeopleIcon />, path: "/franchise/leads" },
    {
      text: "Payouts",
      icon: <AccountBalanceIcon />,
      path: "/franchise/payouts",
    },
    // { text: "Referrals", icon: <GroupAddIcon />, path: "/franchise/referrals" },
    {
      text: "Business",
      icon: <BusinessCenterIcon />,
      path: "/franchise/business",
    },
    {
      text: "Business MIS",
      icon: <AssessmentIcon />,
      path: "/franchise/business-mis",
    },
    {
      text: "View Reports",
      icon: <AssessmentIcon />,
      path: "/franchise/reports",
    },
    // {
    //   text: "Digital Agreement",
    //   icon: <DescriptionIcon />,
    //   path: "/franchise/agreement",
    // },
    {
      text: "Certificate",
      icon: <CardMembershipIcon />,
      path: "/franchise/certificate",
    },
    {
      text: "AI Analysis",
      icon: <AutoGraphIcon />,
      path: "/franchise/ai-analysis",
    },
    {
      text: "Contact RM",
      icon: <PersonIcon />,
      path: "/franchise/relationship-manager",
    },
    //Contact support need to check here sandhya
    {
      text: "Customer Support",
      icon: <PersonIcon />,
      path: "/franchise/support",
    },
    {
      text: "Marketing Materials",
      icon: <DescriptionIcon />,
      path: "/franchise/franchise-marketing",
    },
    {
      text: "Case Studies",
      icon: <CaseStudiesIcon />,
      path: "/franchise/case-studies",
    },
    {
      text: "Reward",
      icon: <CaseStudiesIcon />,
      path: "/franchise/reward",
    },
  ];

  // Filter menu items based on KYC status
  const getMenuItems = () => {
    // If KYC is approved, show all items
    if (kycStatus === "approved") {
      return allMenuItems;
    }

    // If KYC is rejected, show only Dashboard and KYC Verification
    if (kycStatus === "rejected") {
      return allMenuItems.slice(0, 3); // Dashboard, My Profile, KYC Verification
    }

    // If KYC is pending or submitted, show Dashboard, My Profile, KYC Verification, and Digital Agreement
    if (kycStatus === "pending" || kycStatus === "submitted") {
      // Find the index of Digital Agreement in the menu items
      const digitalAgreementIndex = allMenuItems.findIndex(
        (item) => item.text === "Digital Agreement",
      );

      // Return Dashboard, My Profile, KYC Verification, and Digital Agreement
      const baseItems = allMenuItems.slice(0, 3); // Dashboard, My Profile, KYC Verification

      if (digitalAgreementIndex !== -1) {
        baseItems.push(allMenuItems[digitalAgreementIndex]); // Add Digital Agreement
      }
      //comment out krna or yaha se allmenu return ko remove bhi krna hai testing ke baad sandhya
      // return baseItems;
      return allMenuItems;
    }

    // Default: show only Dashboard and KYC Verification
    return allMenuItems.slice(0, 3);
  };

  const menuItems = getMenuItems();

  const isActive = (path) => {
    // Special handling for the Dashboard item (first tab)
    if (path === "/franchise") {
      // When on the base route, the Dashboard tab should be active
      return (
        location.pathname === "/franchise" ||
        location.pathname === "/franchise/"
      );
    }
    // For all other items, do exact match
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <DrawerHeader>
        <SidebarLogo>
          {open ? (
            <>
              <img
                src="/images/cred.png"
                alt="Logo"
                style={{ width: "140px" }}
              />
            </>
          ) : (
            <Box
              component="img"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIGZpbGw9IiM2MjAwZWEiLz48cGF0aCBkPSJNNjAsMzAgTDQwLDUwIEw2MCw3MCIgZmlsbD0id2hpdGUiLz48L3N2Zz4="
              alt="Logo"
              sx={{ width: 30, height: 30 }}
            />
          )}
        </SidebarLogo>
        {open && (
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </DrawerHeader>
      <Divider />

      {/* Show rejection reason if KYC is rejected */}
      {kycStatus === "rejected" && open && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2">KYC Rejected</Typography>
            <Typography variant="body2">
              {kycRejectedReason ||
                "Your KYC verification was rejected. Please check the details and try again."}
            </Typography>
          </Alert>
        </Box>
      )}

      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <NavItem
            key={item.text}
            active={isActive(item.path) ? "true" : undefined}
            onClick={() => {
              if (item.path === "/franchise") {
                // For the Dashboard tab, navigate to the base route without redirect
                navigate("/franchise", { state: { redirect: false } });
              } else {
                navigate(item.path);
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
          </NavItem>
        ))}
      </List>
      <Divider />
      <List>{/* Logout is now in the top right dropdown menu */}</List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton size="large" color="inherit">
              <NotificationsIcon />
            </IconButton>

            <Tooltip title="Account settings">
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>
                  {user?.name?.charAt(0) || "U"}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{ display: { xs: "none", md: "block" } }}
                >
                  {user?.name || "User"}
                </Typography>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {user?.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user?.email}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      bgcolor: "primary.light",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      alignSelf: "flex-start",
                    }}
                  >
                    {user?.role}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBarStyled>
      <Box
        component="nav"
        // sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <DrawerStyled variant="permanent" open={open}>
          {drawer}
        </DrawerStyled>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          mt: "64px",

          width: {
            xs: "100%",
            sm: open
              ? `calc(100% - ${drawerWidth}px)`
              : `calc(100% - ${theme.spacing(8)}px - 1px)`,
          },
          // marginLeft: {
          //   xs: 0,
          //   sm: open ? `${drawerWidth}px` : `${theme.spacing(8) + 1}px`
          // },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: open
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default FranchiseDashboard;
