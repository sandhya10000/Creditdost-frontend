import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import Business from "../franchise/Business";

const ManualBusiness = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box>
      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        sx={{ mb: 2 }}
      >
        <Tab label="Individual Customer" />
        <Tab label="Business Customer" />
      </Tabs>

      {/* key remounts the form so each tab starts with its own clean state */}
      {tabValue === 0 && (
        <Business key="individual" userType="admin" fixedCustomerType="individual" />
      )}
      {tabValue === 1 && (
        <Business key="business" userType="admin" fixedCustomerType="business" />
      )}
    </Box>
  );
};

export default ManualBusiness;
