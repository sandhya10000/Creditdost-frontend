import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { adminAPI } from "../../services/api";

const EMPTY_FORM = {
  id: null,
  name: "",
  description: "",
  permissions: [],
  fullAccess: false,
  limitToOwnFranchises: false,
};

// Sections a role may hold: all of them, or only the scopable ones for a Business Manager
const allowedKeys = (catalog, limitToOwnFranchises) =>
  catalog.filter((p) => !limitToOwnFranchises || p.scopable).map((p) => p.key);

const ManageRoles = () => {
  const [roles, setRoles] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [rolesRes, catalogRes] = await Promise.all([
        adminAPI.getStaffRoles(),
        adminAPI.getPermissionCatalog(),
      ]);
      setRoles(rolesRes.data?.data ?? []);
      setCatalog(catalogRes.data?.data ?? []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (role) => {
    setForm({
      id: role._id,
      name: role.name,
      description: role.description || "",
      permissions: role.permissions || [],
      fullAccess: Boolean(role.fullAccess),
      limitToOwnFranchises: Boolean(role.limitToOwnFranchises),
    });
    setDialogOpen(true);
  };

  const togglePermission = (key) =>
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter((p) => p !== key)
        : [...prev.permissions, key],
    }));

  // Full access ticks every section the role may hold; turning it off keeps them ticked to edit
  const toggleFullAccess = (checked) =>
    setForm((prev) => ({
      ...prev,
      fullAccess: checked,
      permissions: checked ? allowedKeys(catalog, prev.limitToOwnFranchises) : prev.permissions,
    }));

  const allowed = allowedKeys(catalog, form.limitToOwnFranchises);
  const allSelected = allowed.length > 0 && allowed.every((key) => form.permissions.includes(key));
  const someSelected = allowed.some((key) => form.permissions.includes(key));

  const toggleSelectAll = () =>
    setForm((prev) => ({ ...prev, permissions: allSelected ? [] : allowed }));

  const save = async () => {
    if (!form.name.trim()) return alert("Role name is required");
    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        permissions: form.permissions,
        fullAccess: form.fullAccess,
        limitToOwnFranchises: form.limitToOwnFranchises,
      };
      if (form.id) {
        await adminAPI.updateStaffRole(form.id, payload);
      } else {
        await adminAPI.createStaffRole(payload);
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save role");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (role) => {
    if (!window.confirm(`Delete the role "${role.name}"?`)) return;
    try {
      await adminAPI.deleteStaffRole(role._id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete role");
    }
  };

  const labelFor = (key) => catalog.find((p) => p.key === key)?.label || key;

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
          Roles decide which admin sections a staff member can open.
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          New role
        </Button>
      </Stack>

      {roles.length === 0 ? (
        <Typography color="text.secondary">No roles yet. Create one to get started.</Typography>
      ) : (
        roles.map((role) => (
          <Paper key={role._id} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6">{role.name}</Typography>
                {role.description && (
                  <Typography variant="body2" color="text.secondary">
                    {role.description}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  {role.staffCount} staff assigned
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <IconButton onClick={() => openEdit(role)} aria-label="Edit role">
                  <EditIcon />
                </IconButton>
                <Tooltip
                  title={role.staffCount > 0 ? "Reassign staff before deleting" : "Delete role"}
                >
                  <span>
                    <IconButton
                      color="error"
                      disabled={role.staffCount > 0}
                      onClick={() => remove(role)}
                      aria-label="Delete role"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
              {role.fullAccess ? (
                <Chip
                  size="small"
                  color="primary"
                  label={
                    role.limitToOwnFranchises
                      ? "Full access (all Business Manager sections)"
                      : "Full access (all sections)"
                  }
                />
              ) : role.permissions.length === 0 ? (
                <Chip size="small" label="No sections" />
              ) : (
                role.permissions.map((key) => (
                  <Chip key={key} size="small" label={labelFor(key)} />
                ))
              )}
            </Stack>
          </Paper>
        ))
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{form.id ? "Edit role" : "New role"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Role name"
            placeholder="e.g. Credit Analyst"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            margin="normal"
            inputProps={{ maxLength: 60 }}
          />
          <TextField
            fullWidth
            label="Description (optional)"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            margin="normal"
            inputProps={{ maxLength: 300 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.limitToOwnFranchises}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    limitToOwnFranchises: e.target.checked,
                    // Business Managers can only hold sections limited to their own franchises
                    // Full access follows the switch: all sections, or all scopable ones
                    permissions: prev.fullAccess
                      ? allowedKeys(catalog, e.target.checked)
                      : e.target.checked
                        ? prev.permissions.filter((key) =>
                            catalog.find((p) => p.key === key)?.scopable,
                          )
                        : prev.permissions,
                  }))
                }
              />
            }
            label="Business Manager: limit to franchises this person owns (gets an RM-n ID)"
          />

          <Paper
            variant="outlined"
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 2,
              bgcolor: form.fullAccess ? "rgba(98, 0, 234, 0.06)" : "transparent",
              borderColor: form.fullAccess ? "primary.main" : "divider",
            }}
          >
            <FormControlLabel
              sx={{ m: 0, alignItems: "flex-start" }}
              control={
                <Switch
                  checked={form.fullAccess}
                  onChange={(e) => toggleFullAccess(e.target.checked)}
                />
              }
              label={
                <Box sx={{ pt: 0.75 }}>
                  <Typography variant="body1" fontWeight={600}>
                    Full access
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {form.limitToOwnFranchises
                      ? "Every section a Business Manager can hold, including ones added later."
                      : "Every admin section, including ones added later. Team & Roles stays with full administrators."}
                  </Typography>
                </Box>
              }
            />
          </Paper>

          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
            <Typography variant="subtitle2">Sections this role can access</Typography>
            <FormControlLabel
              sx={{ mr: 0 }}
              control={
                <Checkbox
                  size="small"
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  disabled={form.fullAccess}
                  onChange={toggleSelectAll}
                />
              }
              label={<Typography variant="body2">Select all</Typography>}
            />
          </Stack>
          <Divider sx={{ mb: 1 }} />
          <FormGroup>
            {catalog.map((p) => (
              <FormControlLabel
                key={p.key}
                control={
                  <Checkbox
                    checked={form.permissions.includes(p.key)}
                    disabled={form.fullAccess || (form.limitToOwnFranchises && !p.scopable)}
                    onChange={() => togglePermission(p.key)}
                  />
                }
                label={p.label}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save role"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageRoles;
