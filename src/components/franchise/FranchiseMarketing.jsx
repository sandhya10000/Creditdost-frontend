console.log("FranchiseMarketing Loaded");

import React, { useEffect, useState } from "react";
import { franchiseAPI } from "../../services/api";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
const FranchiseMarketing = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
    ? import.meta.env.VITE_REACT_APP_API_URL.replace("/api", "")
    : "https://reactbackend.creditdost.co.in";

  useEffect(() => {
    fetchMarketingMaterials();
    console.log("Fetching API...");
  }, []);

  const fetchMarketingMaterials = async () => {
    try {
      const response = await franchiseAPI.getMarketingMaterials();

      const data =
        response.data.data || response.data.items || response.data || [];

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch marketing materials:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Marketing Material
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
          }}
        >
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No marketing material found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => {
            console.log("Items:", items);
            const fileUrl = `${API_URL}${item.fileUrl}`;
            console.log(`${fileUrl}`, fileUrl);

            return (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    height: "100%",
                  }}
                >
                  {item.fileType?.includes("image") && (
                    <CardMedia
                      component="img"
                      height="220"
                      image={fileUrl}
                      loading="lazy"
                      alt={item.title}
                    />
                  )}

                  {item.fileType?.includes("video") && (
                    <Box sx={{ p: 1 }}>
                      <video
                        controls
                        width="100%"
                        style={{ borderRadius: "8px" }}
                      >
                        <source src={fileUrl} />
                      </video>
                    </Box>
                  )}

                  {item.fileType?.includes("audio") && (
                    <Box sx={{ p: 2 }}>
                      <audio controls style={{ width: "100%" }}>
                        <source src={fileUrl} />
                      </audio>
                    </Box>
                  )}

                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {item.title}
                    </Typography>

                    {item.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {item.description}
                      </Typography>
                    )}

                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <Button
                        variant="contained"
                        href={fileUrl}
                        download
                        size="small"
                      >
                        Download
                      </Button>

                      <Button
                        variant="contained"
                        color="success"
                        target="_blank"
                        rel="noreferrer"
                        href={`https://wa.me/?text=${fileUrl}`}
                        size="small"
                      >
                        WhatsApp
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default FranchiseMarketing;
