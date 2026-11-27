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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { adminAPI } from "../../services/api";
import ManageRoles from "./ManageRoles";
import { PageHeader, SectionCard, SectionHeader, EmptyRow } from "./ui/AdminTable";
import { headRowSx, bodyRowSx, primaryButtonSx } from "./ui/tableStyles";

const EMPTY_FORM = { name: "", email: "", phone: "", roleId: "" };

const outlinedSmall = { textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "divider", color: "text.primary" };

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
      <SectionCard>
        <SectionHeader
          title="Staff"
          subtitle="Assign a role by email. New staff get an auto-generated password by email."
          actions={
            <Button
              variant="contained"
              disableElevation
              onClick={() => setDialogOpen(true)}
              disabled={activeRoles.length === 0}
              sx={primaryButtonSx}
            >
              Assign role
            </Button>
          }
        />

        {activeRoles.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2.5, py: 1.5 }}>
            Create a role in the Roles tab before assigning staff.
          </Typography>
        )}

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={headRowSx}>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.length === 0 && (
                <EmptyRow colSpan={4} title="No staff assigned yet" hint="Assign a role to add the first team member." />
              )}
              {staff.map((member) => {
                const busy = busyId === member._id;
                return (
                  <TableRow key={member._id} hover sx={bodyRowSx}>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        component={Link}
                        to={`/admin/staff/${member._id}`}
                        sx={{ color: "text.primary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
                      >
                        {member.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {member.email}
                      </Typography>
                      {member.credentialsSentAt && (
                        <Typography variant="caption" color="text.disabled" display="block">
                          Credentials sent {new Date(member.credentialsSentAt).toLocaleString()}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={member.staffRole?._id || ""}
                        disabled={busy}
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
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        variant="outlined"
                        color={member.isActive ? "success" : "default"}
                        label={member.isActive ? "Active" : "Deactivated"}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined" disabled={busy} onClick={() => openEdit(member)} sx={outlinedSmall}>
                          Edit
                        </Button>
                        <Button size="small" variant="outlined" disabled={busy} onClick={() => toggleStatus(member)} sx={outlinedSmall}>
                          {member.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button size="small" variant="outlined" disabled={busy} onClick={() => resend(member)} sx={outlinedSmall}>
                          Resend
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </SectionCard>

      <Dialog open={!!editMember} onClose={() => !editSaving && setEditMember(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Edit staff details</DialogTitle>
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
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setEditMember(null)} disabled={editSaving} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" disableElevation onClick={saveEdit} disabled={editSaving} sx={primaryButtonSx}>
            {editSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Assign role</DialogTitle>
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
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" disableElevation onClick={assign} disabled={saving} sx={primaryButtonSx}>
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
    <Box>
      <PageHeader
        title="Team & Roles"
        subtitle="Staff accounts and the roles that decide which admin sections they can open."
      />
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        sx={{ mb: 3, minHeight: 40, "& .MuiTab-root": { textTransform: "none", fontWeight: 600, minHeight: 40 } }}
      >
        <Tab label="Staff" />
        <Tab label="Roles" />
      </Tabs>
      {tab === 0 ? <StaffList /> : <ManageRoles />}
    </Box>
  );
};

export default ManageStaff;
