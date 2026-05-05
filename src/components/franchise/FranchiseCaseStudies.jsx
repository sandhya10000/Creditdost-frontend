import React, { useEffect, useState } from "react";
import { franchiseAPI } from "../../services/api";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

const FranchiseCaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCaseStudies = async () => {
    try {
      const res = await franchiseAPI.getCaseStudies();
      setCaseStudies(res.data.data);
    } catch (err) {
      setError("Failed to load case studies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Case Studies
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3}>
        {caseStudies.map((item) => (
          <Grid item xs={12} md={6} key={item._id}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {item.title}
                </Typography>

                <Typography sx={{ my: 1 }}>{item.description}</Typography>

                <Button
                  variant="outlined"
                  href={item.beforeWorking}
                  target="_blank"
                  sx={{ mr: 1 }}
                >
                  Before PDF
                </Button>

                <Button
                  variant="contained"
                  href={item.afterWorking}
                  target="_blank"
                >
                  After PDF
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FranchiseCaseStudies;
