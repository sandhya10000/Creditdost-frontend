import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import api from "../../services/api.jsx";

const RelationshipManagerInfo = () => {
  const [relationshipManager, setRelationshipManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assigned relationship manager
  const fetchRelationshipManager = async () => {
    try {
      setLoading(true);
      const response = await api.get("/relationship-managers/user/rm");
      setRelationshipManager(response.data);
      setError(null);
    } catch (error) {
      if (error.response?.status === 404) {
        setError("No Relationship Manager assigned to your account yet.");
      } else {
        setError("Error fetching Relationship Manager information.");
      }
      setRelationshipManager(null);
    } finally {
      setLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    fetchRelationshipManager();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Relationship Manager
      </Typography>
      
      {error ? (
        <Alert severity="info">{error}</Alert>
      ) : relationshipManager ? (
        <Card sx={{ maxWidth: 600 }}>
          <CardHeader
            avatar={<PersonIcon sx={{ fontSize: 40, color: "primary.main" }} />}
            title={
              <Typography variant="h6" component="div">
                {relationshipManager.name}
              </Typography>
            }
            subheader="Your Dedicated Relationship Manager"
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EmailIcon sx={{ mr: 2, color: "text.secondary" }} />
              <Typography variant="body1">
                <strong>Email:</strong> {relationshipManager.email}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PhoneIcon sx={{ mr: 2, color: "text.secondary" }} />
              <Typography variant="body1">
                <strong>Phone:</strong> {relationshipManager.phone}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : null}
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Your Relationship Manager is your dedicated point of contact for any questions or assistance you may need.
        </Typography>
      </Box>
    </Box>
  );
};

export default RelationshipManagerInfo;