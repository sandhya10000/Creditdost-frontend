import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { GroupAdd, Send, ContentCopy, Check } from "@mui/icons-material";
import { franchiseAPI } from "../../services/api";

const Referrals = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      setDataLoading(true);
      const response = await franchiseAPI.getReferrals();
      setReferrals(response.data);
    } catch (error) {
      setError("Failed to fetch referrals");
      console.error("Error fetching referrals:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRefer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await franchiseAPI.createReferral(formData);
      setSuccess("Referral sent successfully!");
      setFormData({ name: "", email: "", phone: "" });
      fetchReferrals(); // Refresh the referrals list
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send referral");
      console.error("Error sending referral:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = (referralId) => {
    const referralLink = `${window.location.origin}/register?ref=${referralId}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopiedId(referralId);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "registered":
        return "info";
      case "purchased":
        return "primary";
      case "credited":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Referrals
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Grid
        container
        spacing={3}
        style={{ flexWrap: "nowrap" }}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <Grid item xs={12} md={6} style={{ flex: "1" }}>
          <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Refer a Friend
              </Typography>

              <Box component="form" onSubmit={handleRefer}>
                <Grid container spacing={3} style={{ flexDirection: "column" }}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="name"
                      name="name"
                      label="Friend's Name"
                      fullWidth
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="email"
                      name="email"
                      label="Friend's Email"
                      fullWidth
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="phone"
                      name="phone"
                      label="Friend's Phone"
                      fullWidth
                      value={formData.phone}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 10 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Send />}
                        disabled={loading}
                        sx={{ py: 1.5, px: 4 }}
                      >
                        {loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Send Referral"
                        )}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} style={{ flex: "1" }}>
          <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Referral Program
              </Typography>
              <Typography variant="body1" paragraph>
                Earn credits by referring new franchise partners to Credit Dost.
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>How it works:</strong>
              </Typography>
              <ul>
                <li>
                  <Typography variant="body2">
                    Refer a friend using the form or share your referral link
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Your friend registers and purchases a package
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    You earn credits based on their purchase
                  </Typography>
                </li>
              </ul>
              <Typography variant="body1" paragraph>
                <strong>Rewards:</strong>
              </Typography>
              <ul>
                <li>
                  <Typography variant="body2">
                    Bonus credits based on package purchased by your referral
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Percentage varies by package type
                  </Typography>
                </li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Referrals
          </Typography>

          {dataLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="referrals table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Bonus Amount</TableCell>
                    <TableCell>Referral Link</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {referrals.map((referral) => (
                    <TableRow
                      key={referral._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {referral.referredName}
                      </TableCell>
                      <TableCell>{referral.referredEmail}</TableCell>
                      <TableCell>{referral.referredPhone}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={getStatusColor(referral.status)}
                          sx={{ fontWeight: "bold" }}
                        >
                          {referral.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {referral.bonusAmount > 0
                          ? `${referral.bonusAmount} credits`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Copy referral link">
                          <IconButton
                            onClick={() => copyReferralLink(referral._id)}
                            size="small"
                          >
                            {copiedId === referral._id ? (
                              <Check color="success" />
                            ) : (
                              <ContentCopy />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ mt: 1 }}
                        >
                          {window.location.origin}/register?ref={referral._id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Referrals;
