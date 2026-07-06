import React, { useState } from "react";
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
  Tooltip,
  styled,
  useTheme /* MOBILE FIX */,
  useMediaQuery /* MOBILE FIX */,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  BusinessCenter as BusinessCenterIcon,
  AccountBalance as AccountBalanceIcon,
  Assessment as AssessmentIcon,
  GroupAdd as GroupAddIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  CreditScore as CreditScoreIcon,
  Description as DescriptionIcon,
  AutoGraph as AutoGraphIcon,
} from "@mui/icons-material";
import CampaignIcon from "@mui/icons-material/Campaign";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

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
  "@media (max-width: 768px)": {
    zIndex: theme.zIndex.drawer - 1,
  },
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

  "& .MuiDrawer-paper": {
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      width: 0,
      display: "none",
    },
  },

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        width: 0,
        display: "none",
      },
    },
  }),

  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        width: 0,
        display: "none",
      },
    },
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
  backgroundColor: active ? theme.palette.primary.main : "transparent",
  color: active
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  "&:hover": {
    backgroundColor: active
      ? theme.palette.primary.main
      : theme.palette.action.hover,
  },
  "& .MuiListItemIcon-root": {
    color: active
      ? theme.palette.primary.contrastText
      : theme.palette.text.secondary,
  },
}));

const AdminDashboard = () => {
  const theme = useTheme(); /* MOBILE FIX */
  const isMobile = useMediaQuery("(max-width:768px)"); /* MOBILE FIX */
  const [open, setOpen] = useState(!isMobile); /* MOBILE FIX */
  const [mobileOpen, setMobileOpen] = useState(false); /* MOBILE FIX */
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle responsive drawer
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]); /* MOBILE FIX */
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState({});

  // Redirect non-admin users to appropriate dashboard
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/franchise");
    }
  }, [user, navigate]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
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

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    {
      text: "Website Enquiry",
      icon: <CreditScoreIcon />,
      children: [
        {
          text: "Franchise Pending Case",
          path: "/admin/website-enquiry/franchise-pending",
          icon: <BusinessIcon />,
        },
        {
          text: "Credit Score Repair",
          path: "/admin/credit-repair",
          icon: <AssessmentIcon />,
        },
      ],
    },
    {
      text: "Manage Franchises",
      icon: <PeopleIcon />,
      path: "/admin/franchises",
    },
    {
      text: "Manage Franchise Packages",
      icon: <BusinessIcon />,
      path: "/admin/packages",
    },
    {
      text: "Manage Customer Packages",
      icon: <BusinessCenterIcon />,
      path: "/admin/customer-packages",
    },
    { text: "Manage Leads", icon: <PeopleIcon />, path: "/admin/leads" },
    {
      text: "Credit Check",
      icon: <AssessmentIcon />,
      path: "/admin/credit-check",
    },

    { text: "View Reports", icon: <AssessmentIcon />, path: "/admin/reports" },
    {
      text: "Prefill Failed Logs",
      icon: <AssessmentIcon />,
      path: "/admin/prefill-failed-logs",
    },

    // {
    //   text: "Manage Referrals",
    //   icon: <GroupAddIcon />,
    //   path: "/admin/referrals",
    // },
    {
      text: "Business MIS",
      icon: <DescriptionIcon />,
      path: "/admin/business-forms",
    },
    {
      text: "Business MIS Pending",
      icon: <DescriptionIcon />,
      path: "/admin/business-forms-pending",
    },
    // {
    //   text: "Surepass Settings",
    //   icon: <SettingsIcon />,
    //   path: "/admin/surepass-settings",
    // },
    {
      text: "Recharge Credits",
      icon: <CreditScoreIcon />,
      path: "/admin/recharge",
    },
    {
      text: "Manage Blogs",
      icon: <DescriptionIcon />,
      path: "/admin/blogs",
    },
    {
      text: "Manage RMs",
      icon: <PeopleIcon />,
      path: "/admin/rms",
    },
    {
      text: "Google Sheets",
      icon: <DescriptionIcon />,
      path: "/admin/google-sheets",
    },
    {
      text: "Digital Agreements",
      icon: <DescriptionIcon />,
      path: "/admin/digital-agreements",
    },
    {
      text: "Marketing Materials",
      icon: <CampaignIcon />,
      path: "/admin/marketing-materials",
    },
    {
      text: "Reward",
      icon: <EmojiEventsIcon />,
      path: "/admin/reward",
    },
    {
      text: "Case Studies",
      icon: <MenuBookIcon />,
      path: "/admin/case-study",
    },
    {
      text: "Report Analytics",
      icon: <AnalyticsIcon />,
      path: "/admin/report-analytics",
    },
    {
      text: "AI Analysis",
      icon: <AutoGraphIcon />,
      path: "/admin/ai-analysis",
    },
    {
      text: "Manage Payouts",
      icon: <AccountBalanceIcon />,
      path: "/admin/payouts",
    },
    {
      text: "Manual Business",
      icon: <AccountBalanceIcon />,
      path: "/admin/manual-business",
    },
  ];

  const isActive = (path) => {
    // Special handling for the Dashboard item (first tab)
    if (path === "/admin") {
      // When on the base route, the Dashboard tab should be active
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    // For all other items, do exact match
    return location.pathname === path;
  };

  // Redirect from base route to default child route only on initial load
  useEffect(() => {
    if (
      (location.pathname === "/admin" || location.pathname === "/admin/") &&
      location.state?.redirect !== false
    ) {
      navigate("/admin", { replace: true });
    }
  }, [location.pathname, navigate, location.state]);

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <DrawerHeader>
        <SidebarLogo>
          {open || isMobile /* MOBILE FIX */ ? (
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
        {(open || isMobile) /* MOBILE FIX */ && (
          <IconButton
            onClick={isMobile ? () => setMobileOpen(false) : handleDrawerClose}
          >
            {" "}
            {/* MOBILE FIX */}
            <ChevronLeftIcon />
          </IconButton>
        )}
      </DrawerHeader>
      <Divider />
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <NavItem
              active={isActive(item.path) ? "true" : undefined}
              onClick={() => {
                if (item.children) {
                  setOpenMenu((prev) => ({
                    ...prev,
                    [item.text]: !prev[item.text],
                  }));
                } else if (item.path === "/admin") {
                  // Existing Dashboard logic
                  navigate("/admin", { state: { redirect: false } });
                } else {
                  navigate(item.path);
                }
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>

              <ListItemText
                primary={item.text}
                sx={{ opacity: open ? 1 : 0 }}
                style={{ maxWidth: "160px", whiteSpace: "wrap" }}
              />

              {item.children &&
                (openMenu[item.text] ? <ExpandLess /> : <ExpandMore />)}
            </NavItem>

            {item.children && (
              <Collapse in={openMenu[item.text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <NavItem
                      key={child.text}
                      active={isActive(child.path) ? "true" : undefined}
                      onClick={() => navigate(child.path)}
                      style={{
                        cursor: "pointer",
                        paddingLeft: "45px",
                      }}
                    >
                      <ListItemIcon>{child.icon}</ListItemIcon>

                      <ListItemText
                        primary={child.text}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </NavItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      <Divider />
      <List>
        <NavItem
          onClick={() => {
            handleLogout();
            if (isMobile) setMobileOpen(false); /* MOBILE FIX */
          }} /* MOBILE FIX */
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{ opacity: open || isMobile ? 1 : 0 }}
          />{" "}
          {/* MOBILE FIX */}
        </NavItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={isMobile ? false : open}>
        {" "}
        {/* MOBILE FIX */}
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={
              isMobile ? () => setMobileOpen(true) : handleDrawerOpen
            } /* MOBILE FIX */
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Account settings">
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <Avatar
                  sx={{ width: 36, height: 36, bgcolor: "secondary.main" }}
                >
                  {user?.name?.charAt(0) || "A"}
                </Avatar>
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
                    {user?.subRole === "super_admin"
                      ? "Admin"
                      : user?.subRole === "relationship_manager"
                        ? "Relationship Manager"
                        : "Credit Analyst"}
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
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: isMobile ? "block" : "none" /* MOBILE FIX */,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <DrawerStyled
        variant="permanent"
        open={open}
        sx={{ display: isMobile ? "none" : "block" }} /* MOBILE FIX */
      >
        {drawer}
      </DrawerStyled>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 2 : 3 /* MOBILE FIX */,
          width: isMobile
            ? "100%"
            : open
              ? `calc(100% - ${drawerWidth}px)`
              : `calc(100% - 64px)` /* MOBILE FIX */,
          minHeight: "100vh",
          bgcolor: "background.default",
          mt: "64px",
          overflowX: "hidden" /* MOBILE FIX */,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
