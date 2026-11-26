import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { adminAPI } from "../../services/api";

const MAX_REASON = 500;

// Blacklist a partner (reason required) or lift an existing blacklist.
// A blacklisted partner can't log in and is signed out on their next request.
const BlacklistPartnerDialog = ({ franchise, onClose, onSaved }) => {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const removing = Boolean(franchise?.isBlacklisted);

  useEffect(() => {
    setReason("");
    setError("");
  }, [franchise]);

  const save = async () => {
    if (!removing && !reason.trim()) {
      setError("Please enter a reason for blacklisting.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await adminAPI.setFranchiseBlacklist(franchise._id, !removing, reason.trim());
      onSaved(removing ? "Partner removed from blacklist." : "Partner blacklisted.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update blacklist. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={Boolean(franchise)} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{removing ? "Remove from blacklist" : "Blacklist partner"}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" fontWeight={600}>
          {franchise?.businessName}
          {franchise?.franchiseCode ? ` (${franchise.franchiseCode})` : ""}
        </Typography>

        {removing ? (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              The partner will be able to log in and use the portal again.
            </Typography>
            {franchise?.blacklistReason && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>Blacklisted for:</strong> {franchise.blacklistReason}
              </Typography>
            )}
          </>
        ) : (
          <>
            <Alert severity="warning" sx={{ my: 2 }}>
              The partner will be signed out and can't log in. They will see "Your account is
              suspended" until they are removed from the blacklist.
            </Alert>
            <TextField
              autoFocus
              fullWidth
              multiline
              minRows={3}
              label="Reason (visible to Admin and Business Managers only)"
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, MAX_REASON))}
              helperText={`${reason.length}/${MAX_REASON}`}
            />
          </>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color={removing ? "success" : "error"}
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving..." : removing ? "Remove from blacklist" : "Blacklist partner"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlacklistPartnerDialog;
