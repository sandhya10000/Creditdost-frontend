import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { adminAPI } from "../../../services/api";
import {
  addDays,
  formatDay,
  getFollowUpStatus,
  toDayString,
} from "../../../utils/followUp";

const QUICK_DATES = [
  { label: "Tomorrow", days: 1 },
  { label: "In 3 days", days: 3 },
  { label: "In 1 week", days: 7 },
  { label: "In 2 weeks", days: 14 },
  { label: "In 1 month", days: 30 },
];

const FollowUpTab = ({ customer, onUpdated }) => {
  const [date, setDate] = useState(addDays(1));
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const current = customer?.nextFollowUpDate || null;
  const status = getFollowUpStatus(current);
  const history = [...(customer?.followUpHistory || [])].reverse();

  const handleSave = async () => {
    if (!date) {
      setFeedback({ severity: "error", message: "Pick a follow-up date" });
      return;
    }
    try {
      setSaving(true);
      setFeedback(null);
      await adminAPI.setBusinessFollowUp(customer._id, {
        nextFollowUpDate: date,
        note,
      });
      setNote("");
      setFeedback({ severity: "success", message: "Follow-up scheduled" });
      onUpdated?.();
    } catch (err) {
      setFeedback({
        severity: "error",
        message: err.response?.data?.message || "Failed to save follow-up",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMarkDone = async () => {
    try {
      setSaving(true);
      setFeedback(null);
      await adminAPI.clearBusinessFollowUp(customer._id);
      setFeedback({ severity: "success", message: "Marked as done. History is kept." });
      onUpdated?.();
    } catch (err) {
      setFeedback({
        severity: "error",
        message: err.response?.data?.message || "Failed to update follow-up",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={3}>
      {feedback && (
        <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      {/* Current follow-up */}
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: 3,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          borderLeft: 4,
          borderLeftColor: current ? `${status.color}.main` : "divider",
        }}
      >
        <Box>
          <Typography variant="overline" color="text.secondary">
            Next follow-up
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {current ? formatDay(current) : "Not scheduled"}
          </Typography>
          {current && (
            <Chip
              size="small"
              label={status.label}
              color={status.color}
              sx={{ mt: 0.5, color: status.color === "default" ? undefined : "#fff" }}
            />
          )}
        </Box>
        {current && (
          <Button
            variant="outlined"
            color="success"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={handleMarkDone}
            disabled={saving}
          >
            Mark as done
          </Button>
        )}
      </Paper>

      {/* Schedule form */}
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <EventAvailableIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Schedule next follow-up
          </Typography>
        </Stack>

        <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
          {QUICK_DATES.map((q) => (
            <Chip
              key={q.label}
              label={q.label}
              clickable
              variant={date === addDays(q.days) ? "filled" : "outlined"}
              color={date === addDays(q.days) ? "primary" : "default"}
              onClick={() => setDate(addDays(q.days))}
            />
          ))}
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            type="date"
            label="Follow-up date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: toDayString() }}
            sx={{ minWidth: { sm: 220 } }}
          />
          <TextField
            fullWidth
            label="Note (optional)"
            placeholder="e.g. Customer asked to call after salary day"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            inputProps={{ maxLength: 500 }}
            helperText={`${note.length}/500`}
          />
        </Stack>

        <Box mt={2} textAlign="right">
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !date}
            sx={{ color: "#fff", px: 3 }}
          >
            {saving ? "Saving..." : "Save follow-up"}
          </Button>
        </Box>
      </Paper>

      {/* History */}
      <Box>
        <Typography variant="h6" fontWeight={600} mb={1}>
          Follow-up history
        </Typography>
        {history.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No follow-ups recorded yet.
          </Typography>
        ) : (
          <Stack divider={<Divider flexItem />} spacing={0}>
            {history.map((item, index) => (
              <Box key={item._id || index} py={1.5}>
                <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap={1}>
                  <Typography fontWeight={600}>
                    Follow-up on {formatDay(item.followUpDate)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Added {new Date(item.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {item.createdBy?.name ? ` by ${item.createdBy.name}` : ""}
                  </Typography>
                </Stack>
                {item.note && (
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {item.note}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default FollowUpTab;
