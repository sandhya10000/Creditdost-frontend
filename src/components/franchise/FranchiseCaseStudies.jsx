import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
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

const mapCategory = (title) => {
  const t = (title || "").toLowerCase();
  if (t.includes("dpd")) return "dpd-removal";
  if (t.includes("write off")) return "write-off";
  if (t.includes("settlement")) return "settlement";
  if (t.includes("suit filled")) return "suit-filled";
  if (t.includes("score")) return "score-increase";
  if (t.includes("inquires")) return "credit-inquires";
  return "multiple-issues";
};

const FranchiseCaseStudies = () => {
  const { category } = useParams();
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCaseStudies = async () => {
    try {
      const res = await franchiseAPI.getCaseStudies();
      setCaseStudies(res.data.data);
    } catch (err) {
      setError("Failed to load case studies");
      console.log(err);
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

  if (!category) {
    return <Navigate to="dpd-removal" replace />;
  }

  const displayCategory = category.replace(/-/g, " ");

  const filteredCases = caseStudies.filter((item) => {
    return mapCategory(item.title) === category;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ textTransform: "capitalize" }}>
        Case Studies — {displayCategory}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {filteredCases.length === 0 && !error ? (
        <Typography>No case studies found for this category.</Typography>
      ) : (
        <Grid container spacing={3} mt={1}>
          {filteredCases.map((item) => (
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
      )}
    </Box>
  );
};

export default FranchiseCaseStudies;
