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
  ListItemButton,
  Collapse,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  SupportAgent as SupportAgentIcon,
  Business as BusinessIcon,
  Payment as PaymentIcon,
  VerifiedUser as VerifiedUserIcon,
  CreditScore as CreditScoreIcon,
  People as PeopleIcon,
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
  ArrowUpward as ArrowUpwardIcon,
  AccountBalance as AccountBalanceIcon,
  AutoAwesome as AutoAwesomeIcon,
} from "@mui/icons-material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

import { useAuth } from "../../hooks/useAuth.jsx";
import { franchiseAPI } from "../../services/api";
import { isEligibleForBrandedReport } from "../../constants/brandedReport";

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
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// Sidebar sections, in display order. Entries not listed here fall under "Resources".
const SECTION_ORDER = ["Overview", "Business", "Resources"];
const SECTION_OF = {
  Dashboard: "Overview",
  "Important Updates": "Overview",
  "Upgrade Package": "Overview",
  "Credit Check": "Business",
  "Business MIS": "Business",
  "Bank Statement Analyzer": "Business",
  "AI Analysis": "Business",
  "White Label Reports": "Business",
  Certificate: "Business",
  "Case Studies": "Resources",
  "Marketing Materials": "Resources",
  "Customer Support": "Resources",
};

// Collapsed rail logo (same mark as the admin sidebar)
const MINI_LOGO =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIGZpbGw9IiM2MjAwZWEiLz48cGF0aCBkPSJNNjAsMzAgTDQwLDUwIEw2MCw3MCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=";

const FranchiseDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:768px)"); /* MOBILE FIX */
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [kycStatus, setKycStatus] = useState(null);
  const [kycRejectedReason, setKycRejectedReason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  // Dynamic language list for Marketing Materials sidebar sub-items
  const [marketingLanguages, setMarketingLanguages] = useState([]);
  const [franchisePackage, setFranchisePackage] = useState("");
  // True when the partner already holds the top (₹1 lakh) package
  const [hasTopPackage, setHasTopPackage] = useState(false);

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
      franchiseAPI
        .getAIAnalysisUsage()
        .then((res) => {
          if (res?.data?.packageName) {
            setFranchisePackage(res.data.packageName);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Check whether the partner holds the ₹1 lakh package (hides Upgrade Package)
  useEffect(() => {
    const checkTopPackage = async () => {
      try {
        const [transactionsResponse, dashboardResponse] = await Promise.all([
          franchiseAPI.getTransactions(),
          franchiseAPI.getDashboardStats(),
        ]);
        const paid = transactionsResponse.data.filter(
          (tx) => tx.status === "paid",
        );
        const purchasedPrice = paid[0]?.packageId?.price || 0;
        const assignedPrices = (
          dashboardResponse.data.franchise?.assignedPackages || []
        ).map((pkg) => pkg.price || 0);
        const maxPrice = Math.max(purchasedPrice, ...assignedPrices);
        setHasTopPackage(maxPrice >= 100000);
      } catch (error) {
        console.error("Failed to check partner package:", error);
      }
    };

    if (user && user.role === "franchise_user") {
      checkTopPackage();
    }
  }, [user]);

  // Fetch marketing language list so the sidebar can build sub-items
  useEffect(() => {
    franchiseAPI
      .getMarketingLanguages()
      .then((res) => {
        const langs = res.data.languages || [];
        setMarketingLanguages(langs);
      })
      .catch((err) =>
        console.error("Failed to fetch marketing languages:", err)
      );
  }, []);

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
      setOpen(false);
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
    {
      text: "Important Updates",
      icon: <WhatsAppIcon />,
      path: "/franchise/whatsapp-groups",
    },
    // {
    //   text: "KYC Verification",
    //   icon: <VerifiedUserIcon />,
    //   path: "/franchise/kyc",
    // },
    {
      text: "Upgrade Package",
      icon: <ArrowUpwardIcon />,
      path: "/franchise/upgrade-package",
    },

    {
      text: "Credit Check",
      icon: <CreditScoreIcon />,
      path: "/franchise/credit-check",
    },

    // { text: "Referrals", icon: <GroupAddIcon />, path: "/franchise/referrals" },
    {
      text: "Business MIS",
      icon: <AssessmentIcon />,
      path: "/franchise/business-mis",
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
      text: "White Label Reports",
      icon: <DescriptionIcon />,
      path: "/franchise/white-label-reports",
    },
    {
      text: "AI Analysis",
      icon: <AutoGraphIcon />,
      path: "/franchise/ai-analysis",
    },
    {
      text: "Bank Statement Analyzer",
      icon: <AccountBalanceIcon />,
      path: "/franchise/bank-statement-analyzer",
    },
    //Contact support need to check here sandhya
    {
      text: "Customer Support",
      icon: <PersonIcon />,
      path: "/franchise/support",
    },

    {
      text: "Case Studies",
      icon: <CaseStudiesIcon />,
      children: [
        { text: "DPD Removal", path: "/franchise/case-studies/dpd-removal", icon: <CaseStudiesIcon /> },
        { text: "Write Off", path: "/franchise/case-studies/write-off", icon: <CaseStudiesIcon /> },
        { text: "Settlement", path: "/franchise/case-studies/settlement", icon: <CaseStudiesIcon /> },
        { text: "Score Increase", path: "/franchise/case-studies/score-increase", icon: <CaseStudiesIcon /> },
        { text: "Multiple Issues", path: "/franchise/case-studies/multiple-issues", icon: <CaseStudiesIcon /> },
        { text: "Suit Filled", path: "/franchise/case-studies/suit-filled", icon: <CaseStudiesIcon /> },
        { text: "Credit Inquires", path: "/franchise/case-studies/credit-inquires", icon: <CaseStudiesIcon /> },
      ],
    },
    {
      text: "Marketing Materials",
      icon: <DescriptionIcon />,
      // Children are built dynamically from the language master list fetched
      // from the API. When admin adds a new language to the model enum, it
      // automatically appears here without any frontend code change.
      children: marketingLanguages.map((lang) => ({
        text: lang,
        path: `/franchise/marketing/${lang.toLowerCase()}`,
        icon: <DescriptionIcon />,
      })),
    },
  ];

  // Filter menu items based on KYC status
  const basicMenuItems = allMenuItems.filter((item) =>
    ["Dashboard", "My Profile"].includes(item.text),
  );

  const getMenuItems = () => {
    // If KYC is approved, show all items
    if (kycStatus === "approved") {
      return allMenuItems;
    }

    // If KYC is rejected, show only Dashboard and My Profile
    if (kycStatus === "rejected") {
      return basicMenuItems;
    }
    if (kycStatus === "pending") {
      return basicMenuItems;
    }

    // // If KYC is pending or submitted, show Dashboard, My Profile, and Digital Agreement
    if (kycStatus === "submitted") {
      // Find the index of Digital Agreement in the menu items
      const digitalAgreementIndex = allMenuItems.findIndex(
        (item) => item.text === "Digital Agreement",
      );

      // Return Dashboard, My Profile, and Digital Agreement
      const baseItems = [...basicMenuItems];

      if (digitalAgreementIndex !== -1) {
        baseItems.push(allMenuItems[digitalAgreementIndex]); // Add Digital Agreement
      }
      //comment out krna or yaha se allmenu return ko remove bhi krna hai testing ke baad sandhya
      return baseItems;
      // return allMenuItems;
    }

    // Default: show only Dashboard and My Profile
    return basicMenuItems;
  };

  const menuItems = getMenuItems().filter(
    (item) => !(hasTopPackage && item.text === "Upgrade Package"),
  );

  useEffect(() => {
    const activeParent = menuItems.find(item => 
      item.children?.some(child => location.pathname === child.path)
    );
    
    if (activeParent) {
      setOpenMenu(activeParent.text);
    } else {
      setOpenMenu(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
  //new function for dropdown
  const handleToggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };
  const expanded = open || isMobile; /* MOBILE FIX */

  // Shared look for top-level entries: rounded, tinted when active (matches the admin sidebar)
  const navItemSx = (active) => (theme) => ({
    minHeight: 40,
    mx: 1.5,
    my: 0.25,
    px: expanded ? 1.5 : 0,
    borderRadius: 2,
    justifyContent: expanded ? "flex-start" : "center",
    color: active ? theme.palette.primary.main : "#3f4451",
    bgcolor: active ? alpha(theme.palette.primary.main, 0.08) : "transparent",
    "& .MuiListItemIcon-root": {
      color: active ? theme.palette.primary.main : "#8a8f98",
    },
    "&:hover": {
      bgcolor: active ? alpha(theme.palette.primary.main, 0.12) : "rgba(15, 23, 42, 0.04)",
      "& .MuiListItemIcon-root": {
        color: active ? theme.palette.primary.main : "#3f4451",
      },
    },
  });

  const isItemActive = (item) =>
    isActive(item.path) ||
    Boolean(item.children?.some((child) => location.pathname === child.path));

  const renderNavItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isItemActive(item);
    const groupOpen = hasChildren && openMenu === item.text;

    return (
      <Box key={item.text}>
        <ListItemButton
          onClick={() => {
            if (hasChildren) {
              handleToggle(item.text);
              return;
            }
            if (item.path === "/franchise") {
              navigate("/franchise", { state: { redirect: false } });
            } else {
              navigate(item.path);
            }
            if (isMobile) handleDrawerClose(); /* MOBILE FIX */
          }}
          sx={navItemSx(active)}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: expanded ? 1.5 : 0, "& svg": { fontSize: 20 } }}>
            {item.icon}
          </ListItemIcon>
          {expanded && (
            <>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  noWrap: true,
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                }}
              />
              {hasChildren && (
                <ExpandMoreIcon
                  sx={{
                    ml: 0.5,
                    fontSize: 18,
                    color: "#9aa0a9",
                    transition: "transform 0.2s",
                    transform: groupOpen ? "rotate(180deg)" : "none",
                  }}
                />
              )}
            </>
          )}
        </ListItemButton>

        {hasChildren && expanded && (
          <Collapse in={groupOpen} timeout="auto" unmountOnExit>
            <Box sx={{ ml: 4.5, mr: 1.5, mb: 0.5, pl: 1, borderLeft: 1, borderColor: "divider" }}>
              {item.children.map((child) => {
                const childActive = location.pathname === child.path;
                return (
                  <ListItemButton
                    key={child.path}
                    onClick={() => {
                      navigate(child.path);
                      if (isMobile) handleDrawerClose(); /* MOBILE FIX */
                    }}
                    sx={{
                      minHeight: 34,
                      px: 1.25,
                      borderRadius: 1.5,
                      color: childActive ? "primary.main" : "#5b6170",
                      bgcolor: childActive ? alpha("#6200ea", 0.08) : "transparent",
                      fontWeight: childActive ? 600 : 400,
                    }}
                  >
                    <ListItemText
                      primary={child.text}
                      primaryTypographyProps={{ fontSize: 13.5, fontWeight: childActive ? 600 : 400 }}
                    />
                  </ListItemButton>
                );
              })}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  };

  // Entries grouped under section labels, in menu order
  const sections = SECTION_ORDER.map((title) => ({
    title,
    items: menuItems.filter((item) => (SECTION_OF[item.text] || "Resources") === title),
  })).filter((section) => section.items.length > 0);

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#fff" }}>
      {/* Logo row; in the collapsed rail the app bar covers this space */}
      <Box
        sx={{
          height: 64,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: expanded ? "space-between" : "center",
          px: expanded ? 2.5 : 0,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {expanded ? (
          <Box component="img" src="/images/cred.png" alt="Credit Dost" sx={{ width: 124, display: "block" }} />
        ) : (
          <Box component="img" src={MINI_LOGO} alt="Credit Dost" sx={{ width: 28, height: 28 }} />
        )}
        {expanded && (
          <IconButton
            size="small"
            aria-label="Collapse sidebar"
            onClick={handleDrawerClose}
            sx={{ color: "text.secondary" }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Show rejection reason if KYC is rejected */}
      {kycStatus === "rejected" && expanded && (
        <Box sx={{ p: 2, pb: 0 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            <Typography variant="subtitle2">KYC Rejected</Typography>
            <Typography variant="body2">
              {kycRejectedReason ||
                "Your KYC verification was rejected. Please check the details and try again."}
            </Typography>
          </Alert>
        </Box>
      )}

      <Box
        component="nav"
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          py: 1,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {sections.map((section) => (
          <Box key={section.title}>
            {expanded ? (
              <Typography
                sx={{
                  px: 3,
                  pt: 2,
                  pb: 0.75,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#9aa0a9",
                }}
              >
                {section.title}
              </Typography>
            ) : (
              <Divider sx={{ mx: 2, my: 1.25 }} />
            )}
            <List disablePadding>{section.items.map(renderNavItem)}</List>
          </Box>
        ))}
      </Box>

      {/* Account actions (profile, relationship manager, logout) are in the top-right menu */}
    </Box>
  );

  const currentPageTitle =
    allMenuItems.find((item) => item.path === location.pathname)?.text ||
    allMenuItems
      .flatMap((item) => item.children || [])
      .find((child) => child.path === location.pathname)?.text ||
    "Partner Dashboard";

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={isMobile ? false : open}> {/* MOBILE FIX */}
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={isMobile ? () => setMobileOpen(true) : handleDrawerOpen} /* MOBILE FIX */
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            noWrap
            sx={{ flexGrow: 1, ml: open ? 0 : 1, letterSpacing: "-0.01em" }}
          >
            {currentPageTitle}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Account settings">
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ p: 0.5 }}
              >
                <Avatar sx={{ width: 36, height: 36, bgcolor: "rgba(255, 255, 255, 0.2)", color: "#fff", fontWeight: 700 }}>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    mt: 1,
                    width: 280,
                    borderRadius: 3,
                    border: 1,
                    borderColor: "divider",
                    boxShadow: "0 12px 32px -12px rgba(15, 23, 42, 0.18)",
                    overflow: "hidden",
                  },
                },
              }}
            >
              <Box sx={{ px: 2.5, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", fontWeight: 700 }}>
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={700} noWrap>
                    {user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" noWrap>
                    {user?.email}
                  </Typography>
                  {user?.role && (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        display: "inline-block",
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: "grey.100",
                        color: "text.secondary",
                        fontWeight: 600,
                      }}
                    >
                      {user.role.replace(/_/g, " ")}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/franchise/profile");
                }}
                sx={{ py: 1.25, px: 2.5 }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontWeight: 600 }}>My profile</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/franchise/relationship-manager");
                }}
                sx={{ py: 1.25, px: 2.5 }}
              >
                <ListItemIcon>
                  <SupportAgentIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontWeight: 600 }}>Relationship manager</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ py: 1.25, px: 2.5, color: "error.main" }}>
                <ListItemIcon sx={{ color: "inherit" }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontWeight: 600 }}>Logout</ListItemText>
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
            display: isMobile ? "block" : "none", /* MOBILE FIX */
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <DrawerStyled
          variant="permanent"
          open={open}
          sx={{ display: isMobile ? "none" : "block" }} /* MOBILE FIX */
        >
          {drawer}
        </DrawerStyled>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 2 : 3, /* MOBILE FIX */
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          mt: "64px",
          overflowX: "hidden", /* MOBILE FIX */

          width: isMobile
            ? "100%"
            : open
              ? `calc(100% - ${drawerWidth}px)`
              : `calc(100% - ${theme.spacing(8)}px - 1px)`, /* MOBILE FIX */
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
