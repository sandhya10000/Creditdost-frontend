import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { franchiseAPI } from "../../services/api";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  Stack,
  CircularProgress,
  Paper,
} from "@mui/material";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";

// Convert URL slug "hindi" → "Hindi" to match DB enum values
const slugToLanguage = (slug = "") =>
  slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();

const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  ? import.meta.env.VITE_REACT_APP_API_URL.replace("/api", "")
  : "https://reactbackend.creditdost.co.in";

const FranchiseMarketingByLanguage = () => {
  const { language: langSlug } = useParams();
  const language = slugToLanguage(langSlug);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!language) return;
    setLoading(true);
    setItems([]);
    franchiseAPI
      .getMarketingMaterials(language)
      .then((res) => {
        const data = res.data.data || res.data.items || res.data || [];
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch marketing materials:", err);
      })
      .finally(() => setLoading(false));
  }, [language]);

  // ── Share / Download helpers (copied from FranchiseMarketing) ───────────
  const handleShare = async (fileUrl, item) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const extension = fileUrl.split(".").pop();
      const file = new File(
        [blob],
        `${item.title || "marketing-file"}.${extension}`,
        { type: blob.type }
      );
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: item.title,
          text: item.description || "",
          files: [file],
        });
      } else {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(fileUrl)}`,
          "_blank"
        );
      }
    } catch {
      try {
        if (navigator.share) {
          await navigator.share({
            title: item.title,
            text: item.description || "",
            url: fileUrl,
          });
        } else {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(fileUrl)}`,
            "_blank"
          );
        }
      } catch (innerError) {
        console.log("Fallback share failed", innerError);
      }
    }
  };

  const downloadImage = async (imageUrl, fileName = "image.jpg") => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(imageUrl, "_blank");
    }
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ p: 3 }}>
      {/* Page heading */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Marketing Materials —{" "}
        <Box component="span" sx={{ color: "primary.main" }}>
          {language}
        </Box>
      </Typography>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            mt: 6,
            mx: "auto",
            maxWidth: 480,
            textAlign: "center",
            py: 8,
            px: 4,
            borderRadius: 4,
            border: "2px dashed",
            borderColor: "divider",
            bgcolor: "background.default",
          }}
        >
          <ImageNotSupportedOutlinedIcon
            sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
          />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            No materials yet for{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              {language}
            </Box>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The admin hasn't uploaded any {language} marketing creatives yet.
            Check back soon!
          </Typography>
        </Paper>
      )}

      {/* Card grid */}
      {!loading && items.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {items.map((item) => {
            const fileUrl = `${API_URL}${item.fileUrl}`;
            return (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    border: "none",
                    height: "100%",
                    p: "16px",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  {item.fileType?.includes("image") && (
                    <CardMedia
                      component="img"
                      height="220"
                      image={fileUrl}
                      loading="lazy"
                      alt="marketing-material"
                      sx={{
                        objectFit: "contain",
                        bgcolor: "background.default",
                        borderRadius: "10px",
                      }}
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

                  <Box sx={{ mt: "auto", pt: "16px" }}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ justifyContent: "center" }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => downloadImage(fileUrl, item.fileName)}
                        sx={{
                          flex: 1,
                          borderRadius: "8px",
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Download
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleShare(fileUrl, item)}
                        sx={{
                          flex: 1,
                          borderRadius: "8px",
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        WhatsApp
                      </Button>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default FranchiseMarketingByLanguage;
