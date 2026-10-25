import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { adminAPI } from "../../services/api";

// Full profile of a staff member (opened from the RM column in Franchises)
const StaffProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    adminAPI
      .getStaffProfile(id)
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box p={3}>
        <Typography color="error">{error || "Profile not found"}</Typography>
      </Box>
    );
  }

  const { staff, franchises } = data;

  return (
    <Box p={3}>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Typography variant="h5" fontWeight="bold">
            {staff.name}
          </Typography>
          {staff.staffCode && <Chip label={staff.staffCode} color="primary" />}
          <Chip label={staff.staffRole?.name || "No role"} variant="outlined" />
          <Chip
            size="small"
            color={staff.isActive ? "success" : "default"}
            label={staff.isActive ? "Active" : "Deactivated"}
          />
        </Stack>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {staff.email} • Joined {new Date(staff.createdAt).toLocaleDateString()}
          {staff.lastLoginAt
            ? ` • Last login ${new Date(staff.lastLoginAt).toLocaleString()}`
            : ""}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Franchise partners ({franchises.length})
        </Typography>
        {franchises.length === 0 ? (
          <Typography color="text.secondary">No franchise partners owned yet.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Business</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Franchise ID</TableCell>
                <TableCell>KYC</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {franchises.map((f) => (
                <TableRow key={f._id}>
                  <TableCell>{f.businessName}</TableCell>
                  <TableCell>{f.ownerName}</TableCell>
                  <TableCell>{f.franchiseCode || "-"}</TableCell>
                  <TableCell>{f.kycStatus}</TableCell>
                  <TableCell>{f.isActive ? "Active" : "Inactive"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default StaffProfile;
