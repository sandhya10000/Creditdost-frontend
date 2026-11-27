import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Collapse,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandMore as ExpandMoreIcon,
  LockReset as LockResetIcon,
  LogoutOutlined as LogoutIcon,
  SpaceDashboardOutlined,
  InboxOutlined,
  StorefrontOutlined,
  Inventory2Outlined,
  CreditScoreOutlined,
  BusinessCenterOutlined,
  PostAddOutlined,
  PaymentsOutlined,
  SupportAgentOutlined,
  AutoAwesomeOutlined,
  AccountBalanceOutlined,
  ArticleOutlined,
  CampaignOutlined,
  MenuBookOutlined,
  ManageAccountsOutlined,
  TableChartOutlined,
  EventNoteOutlined,
} from "@mui/icons-material";
import { canAccess } from "../../config/adminPermissions";
import CASE_STUDY_CATEGORIES from "../../config/caseStudyCategories";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useLeadUnreadCounts } from "./useLeadUnreadCounts";
import { useInboxUnreadCounts } from "./useInboxUnreadCounts";
import ChangePasswordDialog from "./ChangePasswordDialog";

const DRAWER_WIDTH = 248;
const MINI_WIDTH = 72;

const MINI_LOGO =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIGZpbGw9IiM2MjAwZWEiLz48cGF0aCBkPSJNNjAsMzAgTDQwLDUwIEw2MCw3MCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=";

// Sidebar, grouped into sections. Pages made of tabs (Franchises, Credit Check, Business MIS,
// AI Analysis) have a single entry. `match` lists extra paths that keep an entry highlighted.
const MENU = [
  {
    items: [
      { text: "Dashboard", icon: <SpaceDashboardOutlined />, path: "/admin" },
      { text: "Leads", icon: <InboxOutlined />, path: "/admin/credit-report-leads" },
    ],
  },
  {
    title: "Partners",
    items: [
      {
        text: "Franchises",
        icon: <StorefrontOutlined />,
        path: "/admin/franchises",
        match: ["/admin/franchise"],
      },
      {
        text: "Manage Packages",
        icon: <Inventory2Outlined />,
        children: [
          { text: "Franchise Packages", path: "/admin/packages" },
          { text: "Customer Packages", path: "/admin/customer-packages" },
        ],
      },
    ],
  },
  {
    title: "Customers",
    items: [
      { text: "Credit Check", icon: <CreditScoreOutlined />, path: "/admin/credit-check" },
      {
        text: "Business MIS",
        icon: <BusinessCenterOutlined />,
        path: "/admin/business-mis",
        match: ["/admin/business-forms", "/admin/customer"],
      },
      { text: "Manual Business", icon: <PostAddOutlined />, path: "/admin/manual-business" },
      { text: "Manual Payments", icon: <PaymentsOutlined />, path: "/admin/manual-payments" },
      { text: "Support Tickets", icon: <SupportAgentOutlined />, path: "/admin/admin-tickets" },
    ],
  },
  {
    title: "Analysis",
    items: [
      { text: "AI Analysis", icon: <AutoAwesomeOutlined />, path: "/admin/ai-analysis" },
      {
        text: "Bank Statement Analyzer",
        icon: <AccountBalanceOutlined />,
        path: "/admin/bsa-reports",
      },
    ],
  },
  {
    title: "Content",
    items: [
      { text: "Manage Blogs", icon: <ArticleOutlined />, path: "/admin/blogs" },
      {
        text: "Marketing Materials",
        icon: <CampaignOutlined />,
        path: "/admin/marketing-materials",
      },
      {
        text: "Case Studies",
        icon: <MenuBookOutlined />,
        children: CASE_STUDY_CATEGORIES.map((category) => ({
          text: category.label,
          path: `/admin/case-study/${category.value}`,
        })),
      },
    ],
  },
  {
    title: "Administration",
    items: [
      { text: "Team & Roles", icon: <ManageAccountsOutlined />, path: "/admin/staff" },
      { text: "Incentives Tracking", icon: <EventNoteOutlined />, path: "/admin/work-tracking" },
      { text: "Google Sheets", icon: <TableChartOutlined />, path: "/admin/google-sheets" },
    ],
  },
];

// Hides entries (and sub-entries, and empty sections) the signed-in user cannot open
const visibleMenu = (user) =>
  MENU.map((section) => ({
    ...section,
    items: section.items
      .map((item) =>
        item.children
          ? { ...item, children: item.children.filter((child) => canAccess(user, child.path)) }
          : item,
      )
      .filter((item) => (item.children ? item.children.length > 0 : canAccess(user, item.path))),
  })).filter((section) => section.items.length > 0);

const pathMatches = (pathname, prefix) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  width: MINI_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
});

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
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    borderRight: `1px solid ${theme.palette.divider}`,
    ...(open ? openedMixin(theme) : closedMixin(theme)),
  },
  ...(open ? openedMixin(theme) : closedMixin(theme)),
}));

// Shared look for top-level entries (and Logout)
const navItemSx = (active, expanded) => (theme) => ({
  minHeight: 40,
  // explicit margins: the app theme gives every ListItemButton "4px 8px"
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

const CountPill = ({ count }) => (
  <Box
    component="span"
    sx={{
      ml: 1,
      minWidth: 20,
      height: 20,
      px: 0.75,
      borderRadius: 10,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      fontWeight: 700,
      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
      color: "primary.main",
    }}
  >
    {count > 99 ? "99+" : count}
  </Box>
);

const AdminDashboard = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const leadCounts = useLeadUnreadCounts();
  const inboxCounts = useInboxUnreadCounts();

  const menu = visibleMenu(user);
  // Labels show when the desktop drawer is open, and always in the mobile drawer
  const expanded = open || isMobile;

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  // Redirect non-admin users to their dashboard
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/franchise");
    }
  }, [user, navigate]);

  const isActive = (item) => {
    if (item.path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return [item.path, ...(item.match || [])].some((prefix) =>
      pathMatches(location.pathname, prefix),
    );
  };

  // Keep the group that holds the current page expanded
  useEffect(() => {
    const parent = MENU.flatMap((section) => section.items).find((item) =>
      item.children?.some((child) => isActive(child)),
    );
    setOpenGroup(parent ? parent.text : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Staff without Dashboard access land on the first section they can see, not the denial page
  useEffect(() => {
    const isBase = location.pathname === "/admin" || location.pathname === "/admin/";
    if (!isBase || canAccess(user, "/admin")) return;

    const firstPath = visibleMenu(user)
      .flatMap((section) => section.items)
      .map((item) => item.path ?? item.children?.[0]?.path)
      .find(Boolean);
    if (firstPath) {
      navigate(firstPath, { replace: true });
    }
  }, [location.pathname, user, navigate]);

  // Unread count beside a sidebar entry (0 = no badge)
  const badgeCountFor = (item) => {
    if (item.path === "/admin/credit-report-leads") return leadCounts.total;
    if (item.path === "/admin/admin-tickets") return inboxCounts.support;
    if (item.path === "/admin/business-mis") return inboxCounts.business.total;
    return 0;
  };

  const go = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleItemClick = (item) => {
    if (!item.children) {
      go(item.path);
      return;
    }
    // In the collapsed rail, a group opens the drawer so its entries are readable
    if (!expanded) {
      setOpen(true);
      setOpenGroup(item.text);
      return;
    }
    setOpenGroup((current) => (current === item.text ? null : item.text));
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    if (isMobile) setMobileOpen(false);
    await logout();
    navigate("/login");
  };

  const renderItem = (item) => {
    const hasChildren = Boolean(item.children);
    const active = hasChildren ? item.children.some((child) => isActive(child)) : isActive(item);
    const groupOpen = hasChildren && expanded && openGroup === item.text;
    const count = badgeCountFor(item);

    const button = (
      <ListItemButton onClick={() => handleItemClick(item)} sx={navItemSx(active, expanded)}>
        <ListItemIcon sx={{ minWidth: 0, mr: expanded ? 1.5 : 0, "& svg": { fontSize: 20 } }}>
          <Badge color="primary" variant="dot" invisible={expanded || !count}>
            {item.icon}
          </Badge>
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
            {count > 0 && <CountPill count={count} />}
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
    );

    return (
      <Box key={item.text}>
        {expanded ? (
          button
        ) : (
          <Tooltip title={item.text} placement="right" arrow>
            {button}
          </Tooltip>
        )}

        {hasChildren && (
          <Collapse in={groupOpen} timeout="auto" unmountOnExit>
            <List
              disablePadding
              sx={{ ml: 4.5, mr: 1.5, mb: 0.5, pl: 1, borderLeft: 1, borderColor: "divider" }}
            >
              {item.children.map((child) => {
                const childActive = isActive(child);
                return (
                  <ListItemButton
                    key={child.path}
                    onClick={() => go(child.path)}
                    sx={(theme) => ({
                      minHeight: 34,
                      px: 1.25,
                      mx: 0,
                      my: 0.25,
                      borderRadius: 1.5,
                      color: childActive ? theme.palette.primary.main : "#5f6470",
                      bgcolor: childActive
                        ? alpha(theme.palette.primary.main, 0.08)
                        : "transparent",
                      "&:hover": {
                        bgcolor: childActive
                          ? alpha(theme.palette.primary.main, 0.12)
                          : "rgba(15, 23, 42, 0.04)",
                        color: childActive ? theme.palette.primary.main : "#3f4451",
                      },
                    })}
                  >
                    <ListItemText
                      primary={child.text}
                      primaryTypographyProps={{
                        noWrap: true,
                        fontSize: 13.5,
                        fontWeight: childActive ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const logoutButton = (
    <ListItemButton onClick={handleLogout} sx={navItemSx(false, expanded)}>
      <ListItemIcon sx={{ minWidth: 0, mr: expanded ? 1.5 : 0, "& svg": { fontSize: 20 } }}>
        <LogoutIcon />
      </ListItemIcon>
      {expanded && (
        <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
      )}
    </ListItemButton>
  );

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
          <Box
            component="img"
            src="/images/cred.png"
            alt="Credit Dost"
            sx={{ width: 124, display: "block" }}
          />
        ) : (
          <Box component="img" src={MINI_LOGO} alt="Credit Dost" sx={{ width: 28, height: 28 }} />
        )}
        {expanded && (
          <IconButton
            size="small"
            aria-label="Collapse sidebar"
            onClick={isMobile ? () => setMobileOpen(false) : () => setOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

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
        {menu.map((section, index) => (
          <Box key={section.title || `section-${index}`}>
            {section.title &&
              (expanded ? (
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
              ))}
            <List disablePadding>{section.items.map(renderItem)}</List>
          </Box>
        ))}
      </Box>

      <Box sx={{ borderTop: 1, borderColor: "divider", py: 1 }}>
        {expanded ? (
          logoutButton
        ) : (
          <Tooltip title="Logout" placement="right" arrow>
            {logoutButton}
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={isMobile ? false : open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={isMobile ? () => setMobileOpen(true) : () => setOpen(true)}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && !isMobile && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.staffRoleName ? `Welcome, ${user.name}` : "Admin Dashboard"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Account settings">
              <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "secondary.main" }}>
                  {user?.name?.charAt(0) || "A"}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
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
                    {user?.staffRoleName ??
                      (user?.subRole === "super_admin"
                        ? "Admin"
                        : user?.subRole === "relationship_manager"
                          ? "Relationship Manager"
                          : "Credit Analyst")}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  setChangePasswordOpen(true);
                }}
              >
                <ListItemIcon>
                  <LockResetIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Change password</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
            <ChangePasswordDialog
              open={changePasswordOpen}
              onClose={() => setChangePasswordOpen(false)}
            />
          </Box>
        </Toolbar>
      </AppBarStyled>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: isMobile ? "block" : "none",
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer (collapses to an icon rail) */}
      <DrawerStyled
        variant="permanent"
        open={open}
        sx={{ display: isMobile ? "none" : "block" }}
      >
        {drawer}
      </DrawerStyled>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 2 : 3,
          width: isMobile
            ? "100%"
            : `calc(100% - ${open ? DRAWER_WIDTH : MINI_WIDTH}px)`,
          minHeight: "100vh",
          bgcolor: "background.default",
          mt: "64px",
          overflowX: "hidden",
        }}
      >
        {canAccess(user, location.pathname) ? (
          <Outlet />
        ) : (
          <Box p={4}>
            <Typography variant="h6">You do not have access to this section.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
