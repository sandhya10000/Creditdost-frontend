import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { adminAPI } from "../../services/api";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTickets = async () => {
    try {
      setLoading(true);

      const res = await adminAPI.getAllTickets();

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

      setTickets(data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        All Support Tickets ({tickets.length})
      </Typography>

      {tickets.length === 0 ? (
        <Typography color="text.secondary">No tickets found.</Typography>
      ) : (
        tickets.map((ticket) => (
          <Paper key={ticket._id} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Typography variant="h6">{ticket.subject}</Typography>

            <Typography variant="body2" color="text.secondary">
              {ticket.category}
            </Typography>

            <Typography sx={{ my: 1 }}>{ticket.message}</Typography>

            <Typography variant="body2">Status: {ticket.status}</Typography>

            <Typography variant="caption" color="text.secondary">
              Raised by: {ticket.user?.name ?? "Unknown"} •{" "}
              {new Date(ticket.createdAt).toLocaleString()}
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default AdminTickets;
