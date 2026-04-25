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
import { useAuth } from "../../hooks/useAuth.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

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
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Redirect non-admin users to appropriate dashboard
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/franchise');
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
      text: "Manage Payouts",
      icon: <AccountBalanceIcon />,
      path: "/admin/payouts",
    },
    { text: "View Reports", icon: <AssessmentIcon />, path: "/admin/reports" },
    {
      text: "Manage Referrals",
      icon: <GroupAddIcon />,
      path: "/admin/referrals",
    },
    {
      text: "Business MIS",
      icon: <DescriptionIcon />,
      path: "/admin/business-forms",
    },
    {
      text: "Surepass Settings",
      icon: <SettingsIcon />,
      path: "/admin/surepass-settings",
    },
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
      text: "AI Analysis",
      icon: <AutoGraphIcon />,
      path: "/admin/ai-analysis",
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
    if ((location.pathname === '/admin' || location.pathname === '/admin/') && 
        location.state?.redirect !== false) {
      navigate('/admin', { replace: true });
    }
  }, [location.pathname, navigate, location.state]);

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <DrawerHeader>
        <SidebarLogo>
          {open ? (
            <>
              <img src="/images/cred.png" alt="Logo" style={{width: "140px"}}/>
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
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <NavItem
            key={item.text}
            active={isActive(item.path)}
            onClick={() => {
              if (item.path === "/admin") {
                // For the Dashboard tab, navigate to the base route without redirect
                navigate("/admin", { state: { redirect: false } });
              } else {
                navigate(item.path);
              }
            }}
            style={{cursor: "pointer"}}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{ opacity: open ? 1 : 0 }}
              style={{ maxWidth: "160px", whiteSpace: "wrap" }}
            />
          </NavItem>
        ))}
      </List>
      <Divider />
      <List>
        <NavItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
        </NavItem>
      </List>
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
      <DrawerStyled variant="permanent" open={open}>
        {drawer}
      </DrawerStyled>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "background.default",
          mt: "64px",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
