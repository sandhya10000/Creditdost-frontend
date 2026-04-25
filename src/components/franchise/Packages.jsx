import React, { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Packages = () => {
  const navigate = useNavigate();

  // Redirect to the new packages page
  React.useEffect(() => {
    navigate("/packages");
  }, [navigate]);

  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Redirecting to Packages Page...
      </Typography>
      <Typography variant="body1" color="text.secondary">
        If you are not redirected automatically, please click{" "}
        <Box
          component="span"
          sx={{ color: "primary.main", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/packages")}
        >
          here
        </Box>
      </Typography>
    </Container>
  );
};

export default Packages;
