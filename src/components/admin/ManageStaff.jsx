import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { adminAPI } from "../../services/api";
import ManageRoles from "./ManageRoles";

const EMPTY_FORM = { name: "", email: "", phone: "", roleId: "" };

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [editSaving, setEditSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [staffRes, rolesRes] = await Promise.all([
        adminAPI.getStaffMembers(),
        adminAPI.getStaffRoles(),
      ]);
      setStaff(staffRes.data?.data ?? []);
      setRoles(rolesRes.data?.data ?? []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const activeRoles = roles.filter((r) => r.isActive);

  const assign = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.roleId) {
      return alert("Name, email and role are required");
    }
    if (!/^\d{10}$/.test(form.phone.trim())) {
      return alert("Enter a valid 10-digit phone number");
    }
    try {
      setSaving(true);
      const res = await adminAPI.assignStaffMember({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        roleId: form.roleId,
      });
      alert(res.data?.message || "Done");
      setDialogOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign role");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (member) => {
    setEditMember(member);
    setEditForm({ name: member.name || "", email: member.email || "", phone: member.phone || "" });
  };

  const saveEdit = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      return alert("Name and email are required");
    }
    if (!/^\d{10}$/.test(editForm.phone.trim())) {
      return alert("Enter a valid 10-digit phone number");
    }
    try {
      setEditSaving(true);
      const res = await adminAPI.updateStaffMemberDetails(editMember._id, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
      });
      alert(res.data?.message || "Staff details updated");
      setEditMember(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update staff details");
    } finally {
      setEditSaving(false);
    }
  };

  const changeRole = async (member, roleId) => {
    try {
      setBusyId(member._id);
      await adminAPI.changeStaffMemberRole(member._id, roleId);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change role");
    } finally {
      setBusyId(null);
    }
  };

  const toggleStatus = async (member) => {
    try {
      setBusyId(member._id);
      await adminAPI.setStaffMemberStatus(member._id, !member.isActive);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setBusyId(null);
    }
  };

  const resend = async (member) => {
    try {
      setBusyId(member._id);
      const res = await adminAPI.resendStaffMemberCredentials(member._id);
      alert(res.data?.message || "Credentials emailed");
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend credentials");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body2" color="text.secondary">
          Assign a role by email. New staff get an auto-generated password by email.
        </Typography>
        <Button
          variant="contained"
          onClick={() => setDialogOpen(true)}
          disabled={activeRoles.length === 0}
        >
          Assign role
        </Button>
      </Stack>

      {activeRoles.length === 0 && (
        <Typography color="text.secondary" mb={2}>
          Create a role in the Roles tab before assigning staff.
        </Typography>
      )}

      {staff.length === 0 ? (
        <Typography color="text.secondary">No staff assigned yet.</Typography>
      ) : (
        staff.map((member) => (
          <Paper key={member._id} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="h6">{member.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.email}
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Chip
                    size="small"
                    color={member.isActive ? "success" : "default"}
                    label={member.isActive ? "Active" : "Deactivated"}
                  />
                  {member.credentialsSentAt && (
                    <Typography variant="caption" color="text.secondary" alignSelf="center">
                      Credentials sent {new Date(member.credentialsSentAt).toLocaleString()}
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
                <TextField
                  select
                  size="small"
                  label="Role"
                  value={member.staffRole?._id || ""}
                  disabled={busyId === member._id}
                  onChange={(e) => changeRole(member, e.target.value)}
                  sx={{ minWidth: 180 }}
                >
                  {activeRoles.map((r) => (
                    <MenuItem key={r._id} value={r._id}>
                      {r.name}
                    </MenuItem>
                  ))}
                  {member.staffRole && !activeRoles.some((r) => r._id === member.staffRole._id) && (
                    <MenuItem value={member.staffRole._id}>{member.staffRole.name} (inactive)</MenuItem>
                  )}
                </TextField>

                <Button
                  size="small"
                  variant="outlined"
                  disabled={busyId === member._id}
                  onClick={() => openEdit(member)}
                >
                  Edit details
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={busyId === member._id}
                  onClick={() => toggleStatus(member)}
                >
                  {member.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={busyId === member._id}
                  onClick={() => resend(member)}
                >
                  Resend credentials
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))
      )}

      <Dialog open={!!editMember} onClose={() => !editSaving && setEditMember(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit staff details</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Name"
            value={editForm.name}
            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email (login)"
            type="email"
            helperText="Changing the email changes the login address. The password stays the same."
            value={editForm.email}
            onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone Number"
            helperText="10-digit mobile number"
            value={editForm.phone}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMember(null)} disabled={editSaving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveEdit} disabled={editSaving}>
            {editSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Assign role</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            helperText="If this email already belongs to a staff account, its role is updated instead"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone Number"
            helperText="10-digit mobile number (RM contact shared with partners on WhatsApp)"
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))
            }
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="Role"
            value={form.roleId}
            onChange={(e) => setForm((prev) => ({ ...prev, roleId: e.target.value }))}
            margin="normal"
          >
            {activeRoles.map((r) => (
              <MenuItem key={r._id} value={r._id}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={assign} disabled={saving}>
            {saving ? "Assigning..." : "Assign & email credentials"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const ManageStaff = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Team & Roles
      </Typography>
      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 3 }}>
        <Tab label="Staff" />
        <Tab label="Roles" />
      </Tabs>
      {tab === 0 ? <StaffList /> : <ManageRoles />}
    </Box>
  );
};

export default ManageStaff;
