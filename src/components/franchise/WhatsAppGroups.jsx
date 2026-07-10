import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
} from "@mui/material";
import {
  WhatsApp,
  Facebook,
  Instagram,
  LinkedIn,
  YouTube,
  Link as LinkIcon,
  Mail as MailIcon,
} from "@mui/icons-material";

const WhatsAppGroups = () => {
  // Social media and group links
  const socialLinks = [
    {
      name: "Main WhatsApp Group",
      url: "https://chat.whatsapp.com/BM7OdjpeVu23HZt3465c9L",
      icon: <WhatsApp sx={{ color: "#25D366", fontSize: 32 }} />,
      description:
        "Join our main WhatsApp group for general discussions and announcements",
      tag: "General Support",
    },
    {
      name: "Sales & Marketing Group",
      url: "https://whatsapp.com/channel/0029VbCIhwEKmCPLvpOePP2u",
      icon: <WhatsApp sx={{ color: "#25D366", fontSize: 32 }} />,
      description:
        "Connect with other franchise partners for sales and marketing tips",
      tag: "Marketing",
    },
  ];

  const socialMediaLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/aapkacreditdost",
      icon: <Facebook sx={{ color: "#1877F2", fontSize: 28 }} />,
      description: "Follow us on Facebook for updates and news",
      color: "#1877F2",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/aapkacreditdost",
      icon: <Instagram sx={{ color: "#E4405F", fontSize: 28 }} />,
      description: "Follow us on Instagram for visual updates and stories",
      color: "#E4405F",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/aapkacreditdost",
      icon: <LinkedIn sx={{ color: "#0A66C2", fontSize: 28 }} />,
      description: "Connect with us on LinkedIn for professional networking",
      color: "#0A66C2",
    },
    {
      name: "YouTube",
      url: "http://www.youtube.com/@aapkacreditdost",
      icon: <YouTube sx={{ color: "#FF0000", fontSize: 28 }} />,
      description: "Subscribe to our YouTube channel for tutorials and videos",
      color: "#FF0000",
    },
  ];

  const handleJoinGroup = (url) => {
    window.open(url, "_blank");
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, py: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontSize: { xs: "1.75rem", sm: "2.25rem" },
          fontWeight: 800,
          color: "text.primary",
          mb: 1,
        }}
      >
        WhatsApp Groups & Social Media
      </Typography>

      <Typography
        variant="body1"
        paragraph
        sx={{
          mb: 4,
          color: "text.secondary",
          fontSize: { xs: "0.95rem", sm: "1rem" },
          lineHeight: 1.6,
          maxWidth: "800px",
        }}
      >
        Connect with our community through various WhatsApp groups and social
        media platforms. Join relevant groups to stay updated, get support, and
        network with other franchise partners.
      </Typography>

      {/* WhatsApp Groups Section */}
      <Card
        sx={{
          mb: 4,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "primary.main", fontWeight: 800, mb: 1 }}
          >
            WhatsApp Groups
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            paragraph
            sx={{ mb: 3 }}
          >
            Join our WhatsApp groups to connect with other franchise partners
            and get real-time support.
          </Typography>

          <Grid container spacing={3}>
            {socialLinks.map((group, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    borderRadius: 3,
                    border: "1px solid rgba(37, 211, 102, 0.2)",
                    background:
                      "linear-gradient(145deg, #ffffff 0%, #f9fbf9 100%)",
                    transition:
                      "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 10px 20px rgba(37, 211, 102, 0.1)",
                      borderColor: "#25D366",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 4,
                      bgcolor: "#25D366",
                      borderTopLeftRadius: 3,
                      borderTopRightRadius: 3,
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            bgcolor: "rgba(37, 211, 102, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {group.icon}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {group.name}
                        </Typography>
                      </Box>
                      {group.tag && (
                        <Chip
                          label={group.tag}
                          size="small"
                          sx={{
                            bgcolor: "rgba(37, 211, 102, 0.1)",
                            color: "#128C7E",
                            fontWeight: 600,
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {group.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<WhatsApp />}
                      onClick={() => handleJoinGroup(group.url)}
                      sx={{
                        py: 1.2,
                        borderRadius: 2,
                        backgroundColor: "#25D366",
                        fontWeight: "bold",
                        textTransform: "none",
                        boxShadow: "0 4px 10px rgba(37, 211, 102, 0.3)",
                        "&:hover": {
                          backgroundColor: "#128C7E",
                          boxShadow: "0 6px 15px rgba(18, 140, 126, 0.4)",
                        },
                      }}
                    >
                      Join Group
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Social Media Section */}
      <Card
        sx={{
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "primary.main", fontWeight: 800, mb: 1 }}
          >
            Social Media
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            paragraph
            sx={{ mb: 3 }}
          >
            Follow us on social media for updates, news, and community
            engagement.
          </Typography>

          <Grid container spacing={3}>
            {socialMediaLinks.map((platform, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    border: "1px solid rgba(0,0,0,0.08)",
                    transition:
                      "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 10px 20px ${platform.color}15`,
                      borderColor: platform.color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 4,
                      bgcolor: platform.color,
                      borderTopLeftRadius: 3,
                      borderTopRightRadius: 3,
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          p: 0.8,
                          borderRadius: 1.5,
                          bgcolor: `${platform.color}10`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {platform.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {platform.name}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ lineHeight: 1.5 }}
                    >
                      {platform.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<LinkIcon />}
                      onClick={() => handleJoinGroup(platform.url)}
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        borderColor: "rgba(0,0,0,0.15)",
                        color: "text.primary",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                          borderColor: platform.color,
                          backgroundColor: `${platform.color}08`,
                          color: platform.color,
                        },
                      }}
                    >
                      Follow
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Information Section */}
      <Card
        sx={{
          mt: 4,
          boxShadow: "0px 8px 30px rgba(2, 136, 209, 0.15)",
          borderRadius: 4,
          background: "linear-gradient(135deg, #0288d1 0%, #26c6da 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative background circles */}
        <Box
          sx={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-30px",
            left: "10%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            pointerEvents: "none",
          }}
        />

        <CardContent
          sx={{ p: { xs: 3, sm: 4 }, position: "relative", zIndex: 1 }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
            Need Help?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              opacity: 0.9,
              maxWidth: "600px",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              lineHeight: 1.6,
            }}
          >
            If you're having trouble joining any of our groups or accessing our
            social media accounts, feel free to contact us. We are here to
            support you!
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: "stretch",
            }}
          >
            <Chip
              icon={<MailIcon style={{ color: "white" }} />}
              label="info@creditdost.co.in"
              component="a"
              href="mailto:info@creditdost.co.in"
              clickable
              target="_blank"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.15)",
                color: "white",
                py: 2.5,
                px: 1,
                fontSize: "0.95rem",
                fontWeight: "bold",
                borderRadius: 3,
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "background-color 0.2s, transform 0.2s",
                "& .MuiChip-icon": { color: "white" },
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.25)",
                  transform: "translateY(-2px)",
                },
              }}
            />

            <Chip
              icon={<WhatsApp style={{ color: "white" }} />}
              label="+91 92174-69202"
              component="a"
              href="https://wa.me/919217469202"
              clickable
              target="_blank"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.15)",
                color: "white",
                py: 2.5,
                px: 1,
                fontSize: "0.95rem",
                fontWeight: "bold",
                borderRadius: 3,
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "background-color 0.2s, transform 0.2s",
                "& .MuiChip-icon": { color: "white" },
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.25)",
                  transform: "translateY(-2px)",
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WhatsAppGroups;
