import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { adminAPI } from "../../services/api";

// Lets an admin move a franchise to another Business Manager (or unassign it)
const ReassignRmDialog = ({ franchise, onClose, onSaved }) => {
  const [managers, setManagers] = useState([]);
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!franchise) return;
    setSelected(franchise.businessManager?._id || "");
    adminAPI
      .getStaffMembers()
      .then((res) =>
        setManagers(
          (res.data?.data ?? []).filter(
            (m) => m.isActive && m.staffRole?.limitToOwnFranchises,
          ),
        ),
      )
      .catch(() => alert("Could not load Business Managers"));
  }, [franchise]);

  const save = async () => {
    try {
      setSaving(true);
      await adminAPI.reassignFranchiseManager(franchise._id, selected || null);
      onSaved();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update Business Manager");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={Boolean(franchise)} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Business Manager (RM)</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {franchise?.businessName}
        </Typography>
        <TextField
          select
          fullWidth
          label="Business Manager"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <MenuItem value="">Unassigned</MenuItem>
          {managers.map((m) => (
            <MenuItem key={m._id} value={m._id}>
              {m.staffCode ? `${m.staffCode} · ` : ""}
              {m.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReassignRmDialog;
