import React, { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Link,
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

const StatCard = ({ label, value }) => (
  <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
    <Typography variant="h5" fontWeight="bold">
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Paper>
);

// Full profile of a staff member: role, access and (for Business Managers) assigned franchises
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

  const { staff, franchises, summary } = data;
  const role = staff.staffRole;
  // Franchise section only for roles that hold the "franchises" permission
  const hasFranchiseAccess = !!role?.permissions?.includes("franchises");

  return (
    <Box p={3}>
      <Button component={RouterLink} to="/admin/staff" size="small" sx={{ mb: 2 }}>
        ← Back to Team &amp; Roles
      </Button>

      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Typography variant="h5" fontWeight="bold">
            {staff.name}
          </Typography>
          {staff.staffCode && <Chip label={staff.staffCode} color="primary" />}
          <Chip label={role?.name || "No role"} variant="outlined" />
          {hasFranchiseAccess && <Chip label="Business Manager" color="secondary" size="small" />}
          <Chip
            size="small"
            color={staff.isActive ? "success" : "default"}
            label={staff.isActive ? "Active" : "Deactivated"}
          />
        </Stack>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {staff.email}
          {staff.phone ? ` • ${staff.phone}` : ""} • Joined{" "}
          {new Date(staff.createdAt).toLocaleDateString()}
          {staff.lastLoginAt ? ` • Last login ${new Date(staff.lastLoginAt).toLocaleString()}` : ""}
        </Typography>
        {staff.credentialsSentAt && (
          <Typography variant="body2" color="text.secondary">
            Credentials sent {new Date(staff.credentialsSentAt).toLocaleString()}
            {staff.credentialsSentCount > 1 ? ` (${staff.credentialsSentCount} times)` : ""}
          </Typography>
        )}
      </Paper>

      {/* Summary */}
      <Grid container spacing={2} mb={3}>
        {hasFranchiseAccess && (
          <>
            <Grid item xs={6} md={3}>
              <StatCard label="Franchises assigned" value={summary.totalFranchises} />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard label="Active franchises" value={summary.activeFranchises} />
            </Grid>
          </>
        )}
        <Grid item xs={6} md={3}>
          <StatCard label="Permissions" value={summary.permissionCount} />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Access scope" value={hasFranchiseAccess ? "Own franchises" : "No franchise access"} />
        </Grid>
      </Grid>

      {/* Role & permissions */}
      <Paper sx={{ p: 3, mb: 3, }}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Role: {role?.name || "No role"}
        </Typography>
        {role?.description && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            {role.description}
          </Typography>
        )}
        {role?.permissions?.length ? (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {role.permissions.map((p) => (
              <Chip key={p} label={p} size="small" variant="outlined" />
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">No permissions assigned to this role.</Typography>
        )}
      </Paper>

      {/* Assigned franchises (Business Manager) */}
      {hasFranchiseAccess && (
        <Paper sx={{ p: 3, }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Franchise partners ({franchises.length})
          </Typography>
          {franchises.length === 0 ? (
            <Typography color="text.secondary">No franchise partners assigned yet.</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Business</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Franchise ID</TableCell>
                  <TableCell>City / State</TableCell>
                  <TableCell>KYC</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created on</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {franchises.map((f) => (
                  <TableRow key={f._id} hover>
                    <TableCell>
                      {f.franchiseCode ? (
                        <Link component={RouterLink} to={`/admin/franchise/${f.franchiseCode}`}>
                          {f.businessName || f.franchiseCode}
                        </Link>
                      ) : (
                        f.businessName || "-"
                      )}
                    </TableCell>
                    <TableCell>{f.ownerName || "-"}</TableCell>
                    <TableCell>{f.franchiseCode || "-"}</TableCell>
                    <TableCell>
                      {[f.city, f.state].filter(Boolean).join(", ") || "-"}
                    </TableCell>
                    <TableCell>{f.kycStatus || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={f.isActive ? "Active" : "Inactive"}
                        color={f.isActive ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default StaffProfile;
