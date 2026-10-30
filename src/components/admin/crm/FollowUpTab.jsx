import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
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

// Same card + section-label style as RemarksTab
const cardSx = {
  p: 3,
  borderRadius: 4,
  border: "1px solid #d7dbea",
};

const sectionLabelSx = {
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: 2,
  color: "#7c84a6",
  textTransform: "uppercase",
  mb: 2,
};

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
    <Stack spacing={4}>
      {feedback && (
        <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      {/* CURRENT FOLLOW-UP */}
      <Box>
        <Typography sx={sectionLabelSx}>Next follow-up</Typography>
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            borderLeft: 6,
            borderLeftColor: current ? `${status.color}.main` : "#d7dbea",
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700} color="#2c2f3a">
              {current ? formatDay(current) : "Not scheduled"}
            </Typography>
            {current ? (
              <Chip
                size="small"
                label={status.label}
                color={status.color}
                sx={{ mt: 1, color: status.color === "default" ? undefined : "#fff" }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Pick a date below to schedule the next call.
              </Typography>
            )}
          </Box>
          {current && (
            <Button
              variant="outlined"
              color="success"
              startIcon={<CheckCircleOutlineIcon />}
              onClick={handleMarkDone}
              disabled={saving}
              sx={{ borderRadius: 2 }}
            >
              Mark as done
            </Button>
          )}
        </Paper>
      </Box>

      {/* SCHEDULE */}
      <Box>
        <Typography sx={sectionLabelSx}>Schedule next follow-up</Typography>
        <Paper elevation={0} sx={cardSx}>
          <Stack direction="row" flexWrap="wrap" gap={1} mb={3}>
            {QUICK_DATES.map((q) => {
              const isSelected = date === addDays(q.days);
              return (
                <Chip
                  key={q.label}
                  label={q.label}
                  clickable
                  variant={isSelected ? "filled" : "outlined"}
                  color={isSelected ? "primary" : "default"}
                  onClick={() => setDate(addDays(q.days))}
                />
              );
            })}
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

          <Box mt={3} textAlign="right">
            <Button
              variant="contained"
              startIcon={<EventAvailableIcon />}
              onClick={handleSave}
              disabled={saving || !date}
              sx={{ color: "#fff", px: 3, borderRadius: 2 }}
            >
              {saving ? "Saving..." : "Save follow-up"}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* HISTORY */}
      <Box>
        <Typography sx={sectionLabelSx}>Follow-up history</Typography>
        {history.length === 0 ? (
          <Paper elevation={0} sx={{ ...cardSx, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No follow-ups recorded yet.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {history.map((item, index) => (
              <Paper
                key={item._id || index}
                elevation={0}
                sx={{
                  ...cardSx,
                  p: 2.5,
                  borderLeft: 4,
                  borderLeftColor: "#7c84a6",
                }}
              >
                <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap={1}>
                  <Typography fontWeight={700} color="#2c2f3a">
                    Follow-up on {formatDay(item.followUpDate)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Added{" "}
                    {new Date(item.createdAt).toLocaleString("en-IN", {
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
                  <Typography sx={{ mt: 1, fontSize: 16, color: "#2c2f3a", lineHeight: 1.6 }}>
                    {item.note}
                  </Typography>
                )}
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default FollowUpTab;
