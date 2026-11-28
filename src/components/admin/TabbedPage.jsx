import React, { Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth.jsx";
import { hasPermission } from "../../config/adminPermissions";

const TabFallback = () => (
  <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
    <CircularProgress />
  </Box>
);

const CountChip = ({ count }) => (
  <Box
    component="span"
    sx={{
      minWidth: 20,
      height: 20,
      px: 0.75,
      borderRadius: 10,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      fontWeight: 700,
      bgcolor: "primary.main",
      color: "primary.contrastText",
    }}
  >
    {count > 99 ? "99+" : count}
  </Box>
);

// A page made of tabs (e.g. Credit Check / View Reports / Prefill Failed Logs).
// The open tab is kept in the URL as ?tab=<key>, and staff only see tabs their role allows.
// Each tab: { key, label, icon, permission, badge, render }. Only the open tab is mounted.
const TabbedPage = ({ title, subtitle, tabs }) => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const visibleTabs = tabs.filter(
    (tab) => !tab.permission || hasPermission(user, tab.permission),
  );
  const activeTab =
    visibleTabs.find((tab) => tab.key === searchParams.get("tab")) || visibleTabs[0];

  if (!activeTab) {
    return (
      <Box p={4}>
        <Typography variant="h6">You do not have access to this section.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {visibleTabs.length > 1 && (
        <Paper
          elevation={0}
          sx={{ mb: 3, borderRadius: 3, border: 1, borderColor: "divider", overflow: "hidden" }}
        >
          <Tabs
            value={activeTab.key}
            onChange={(_, key) => setSearchParams({ tab: key })}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 1,
              "& .MuiTab-root": { textTransform: "none", fontWeight: 600, minHeight: 60 },
            }}
          >
            {visibleTabs.map((tab) => (
              <Tab
                key={tab.key}
                value={tab.key}
                icon={tab.icon}
                iconPosition="start"
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>{tab.label}</span>
                    {tab.badge > 0 && <CountChip count={tab.badge} />}
                  </Stack>
                }
              />
            ))}
          </Tabs>
        </Paper>
      )}

      <Suspense fallback={<TabFallback />}>
        <Box key={activeTab.key}>{activeTab.render()}</Box>
      </Suspense>
    </Box>
  );
};

export default TabbedPage;
