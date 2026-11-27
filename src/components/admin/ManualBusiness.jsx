import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import Business from "../franchise/Business";
import { PageHeader } from "./ui/AdminTable";

const ManualBusiness = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box>
      <PageHeader
        title="Manual Business"
        subtitle="Create a business or AMC record on behalf of a customer."
      />

      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        sx={{
          mb: 3,
          minHeight: 40,
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600, minHeight: 40 },
        }}
      >
        <Tab label="Individual customer" />
        <Tab label="Business customer" />
        <Tab label="AMC" />
      </Tabs>

      {/* key remounts the form so each tab starts with its own clean state */}
      {tabValue === 0 && (
        <Business
          key="individual"
          userType="admin"
          fixedCustomerType="individual"
          showConsultantFields
        />
      )}
      {tabValue === 1 && (
        <Business key="business" userType="admin" fixedCustomerType="business" />
      )}
      {tabValue === 2 && (
        <Business key="amc" userType="admin" fixedCustomerType="individual" amcEnabled />
      )}
    </Box>
  );
};

export default ManualBusiness;
