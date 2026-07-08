import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SendIcon from "@mui/icons-material/Send";
import { franchiseAPI } from "../../services/api";

export default function Support() {
  const [formData, setFormData] = useState({
    subject: "",
    category: "CIBIL Report Issue",
    message: "",
  });

  const getTickets = async () => {
    try {
      const res = await franchiseAPI.getTickets();
      console.log(res, "res get ticket");
      setTickets(res.data.data); //
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getTickets();
  }, []);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async () => {
    try {
      if (!formData.subject || !formData.message) {
        return alert("Please fill all required fields");
      }

      setLoading(true);

      const res = await franchiseAPI.customerSupport(formData);
      console.log(res, "res create ticket");

      alert(res.message || "Ticket submitted successfully");

      setFormData({
        subject: "",
        category: "CIBIL Report Issue",
        message: "",
      });

      getTickets();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f8f9fb", minHeight: "100vh" }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Support Tickets
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        Raise requests about CIBIL, credit reports, recharges or technical
        issues.
      </Typography>

      <Grid container spacing={3}>
        {/* Left Side - Create Ticket */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              borderRadius: 3,
              p: 3,
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <AddCircleOutlineIcon color="error" />
              <Typography variant="h6" fontWeight="bold">
                Create New Ticket
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="caption" fontWeight="bold">
              SUBJECT
            </Typography>

            <TextField
              fullWidth
              name="subject"
              placeholder="e.g. CIBIL Report Not Generated"
              value={formData.subject}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Typography variant="caption" fontWeight="bold">
              CATEGORY
            </Typography>

            <TextField
              select
              fullWidth
              name="category"
              value={formData.category}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="CIBIL Report Issue">
                Credit Report Issue
              </MenuItem>
              <MenuItem value="AI Issue">AI Analysis Issue</MenuItem>
              <MenuItem value="Technical Issue">Technical Issue</MenuItem>
              <MenuItem value="Reopen Case">Reopen Case</MenuItem>
            </TextField>

            <Typography variant="caption" fontWeight="bold">
              MESSAGE
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={5}
              name="message"
              placeholder="Please describe your issue in detail..."
              value={formData.message}
              onChange={handleChange}
              margin="normal"
            />

            <Button
              fullWidth
              variant="contained"
              startIcon={<SendIcon />}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2,
                backgroundColor: "#ff3b1f",
                "&:hover": {
                  backgroundColor: "#e63118",
                },
              }}
              onClick={handleSubmit}
            >
              Submit Ticket
            </Button>
          </Paper>
        </Grid>

        {/* Right Side - Ticket List */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={2}
            sx={{
              borderRadius: 3,
              p: 3,
              minHeight: 420,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h6" fontWeight="bold">
                Your Tickets
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {tickets.length} tickets
              </Typography>
            </Box>

            <Divider sx={{ mb: 8 }} />

            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              mt={8}
            >
              <ErrorOutlineIcon
                sx={{ fontSize: 60, color: "#d1d5db", mb: 2 }}
              />

              {tickets.length === 0 ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  mt={8}
                >
                  <ErrorOutlineIcon
                    sx={{ fontSize: 60, color: "#d1d5db", mb: 2 }}
                  />

                  <Typography variant="h6" color="text.secondary">
                    No support tickets found.
                  </Typography>

                  <Typography variant="body2" color="text.disabled">
                    Create your first ticket above.
                  </Typography>
                </Box>
              ) : (
                tickets.map((ticket) => (
                  <Paper
                    key={ticket._id}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Typography fontWeight="bold">{ticket.subject}</Typography>

                    <Typography variant="body2" color="text.secondary">
                      {ticket.category}
                    </Typography>

                    <Typography sx={{ mt: 1 }}>{ticket.message}</Typography>

                    <Typography
                      variant="caption"
                      color={
                        ticket.status === "Pending"
                          ? "warning.main"
                          : ticket.status === "Resolved"
                            ? "success.main"
                            : "error.main"
                      }
                    >
                      {ticket.status}
                    </Typography>
                  </Paper>
                ))
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
