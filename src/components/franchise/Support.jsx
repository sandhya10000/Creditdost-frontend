import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Link,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SendIcon from "@mui/icons-material/Send";
import { franchiseAPI, getAttachmentUrl } from "../../services/api";

const CATEGORY_OPTIONS = [
  { value: "CIBIL Report Issue", label: "Credit Report Issue" },
  { value: "AI Issue", label: "AI Analysis Issue" },
  { value: "Technical Issue", label: "Technical Issue" },
  { value: "Reopen Case", label: "Reopen Case" },
];

const STATUS_COLOR = {
  Pending: "warning",
  "In Progress": "info",
  Resolved: "success",
  Closed: "default",
};

const EMPTY_FORM = {
  subject: "",
  category: "CIBIL Report Issue",
  message: "",
};

const AttachmentLinks = ({ attachments = [] }) =>
  attachments.length === 0 ? null : (
    <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
      {attachments.map((a) => (
        <Link
          key={a.url}
          href={getAttachmentUrl(a.url)}
          target="_blank"
          rel="noopener noreferrer"
          variant="body2"
        >
          {a.originalName || "Attachment"}
        </Link>
      ))}
    </Stack>
  );

export default function Support() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [files, setFiles] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selected, setSelected] = useState(null);
  const [replies, setReplies] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyFiles, setReplyFiles] = useState([]);
  const [sendingReply, setSendingReply] = useState(false);

  const [toast, setToast] = useState({ open: false, type: "success", text: "" });
  const showToast = (type, text) => setToast({ open: true, type, text });

  const getTickets = useCallback(async () => {
    try {
      setListLoading(true);
      const res = await franchiseAPI.getTickets();
      setTickets(res.data?.data ?? []);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Could not load tickets");
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    getTickets();
  }, [getTickets]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!formData.subject.trim() || !formData.message.trim()) {
      return showToast("error", "Subject and message are required");
    }

    try {
      setSubmitting(true);
      const payload = new FormData();
      payload.append("subject", formData.subject.trim());
      payload.append("category", formData.category);
      payload.append("message", formData.message.trim());
      files.forEach((file) => payload.append("attachments", file));

      await franchiseAPI.customerSupport(payload);

      showToast("success", "Ticket submitted successfully");
      setFormData(EMPTY_FORM);
      setFiles([]);
      getTickets();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const openTicket = async (ticket) => {
    try {
      setDetailLoading(true);
      setSelected(ticket);
      setReplies([]);
      setReplyText("");
      setReplyFiles([]);
      const res = await franchiseAPI.getTicket(ticket._id);
      setSelected(res.data.data.ticket);
      setReplies(res.data.data.replies);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Could not open ticket");
      setSelected(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim()) return showToast("error", "Please write a reply");
    try {
      setSendingReply(true);
      const payload = new FormData();
      payload.append("message", replyText.trim());
      replyFiles.forEach((file) => payload.append("attachments", file));

      const res = await franchiseAPI.replyTicket(selected._id, payload);
      setReplies((prev) => [...prev, res.data.data]);
      setReplyText("");
      setReplyFiles([]);
      // Backend reopens a Resolved ticket to Pending on reply
      setSelected((prev) =>
        prev?.status === "Resolved" ? { ...prev, status: "Pending" } : prev,
      );
      getTickets();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const fileInput = (onPick) => (
    <Button component="label" size="small" variant="outlined">
      Attach files
      <input
        hidden
        type="file"
        multiple
        accept="image/jpeg,image/png,application/pdf"
        onChange={(e) => onPick(Array.from(e.target.files || []).slice(0, 3))}
      />
    </Button>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Support Tickets
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        Raise requests about CIBIL, credit reports, recharges or technical
        issues.
      </Typography>

      <Grid container spacing={3}>
        {/* Left Side - Create Ticket */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <AddCircleOutlineIcon color="error" />
              <Typography variant="h6" fontWeight="bold">
                Create New Ticket
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <TextField
              fullWidth
              name="subject"
              label="Subject"
              placeholder="e.g. CIBIL Report Not Generated"
              value={formData.subject}
              onChange={handleChange}
              margin="normal"
              inputProps={{ maxLength: 150 }}
              required
            />

            <TextField
              select
              fullWidth
              name="category"
              label="Category"
              value={formData.category}
              onChange={handleChange}
              margin="normal"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={5}
              name="message"
              label="Message"
              placeholder="Please describe your issue in detail..."
              value={formData.message}
              onChange={handleChange}
              margin="normal"
              inputProps={{ maxLength: 5000 }}
              required
            />

            <Stack direction="row" spacing={2} alignItems="center" mt={1}>
              {fileInput(setFiles)}
              <Typography variant="caption" color="text.secondary">
                {files.length
                  ? files.map((f) => f.name).join(", ")
                  : "JPG, PNG or PDF, up to 3 files"}
              </Typography>
            </Stack>

            <Button
              fullWidth
              variant="contained"
              startIcon={submitting ? null : <SendIcon />}
              disabled={submitting}
              sx={{
                mt: 3,
                py: 1.5,
                backgroundColor: "#ff3b1f",
                "&:hover": { backgroundColor: "#e63118" },
              }}
              onClick={handleSubmit}
            >
              {submitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </Paper>
        </Grid>

        {/* Right Side - Ticket List */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, md: 3 }, minHeight: 420 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">
                Your Tickets
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tickets.length} tickets
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {listLoading ? (
              <Box display="flex" justifyContent="center" mt={6}>
                <CircularProgress />
              </Box>
            ) : tickets.length === 0 ? (
              <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
                <ErrorOutlineIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No support tickets found.
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Create your first ticket on the left.
                </Typography>
              </Box>
            ) : (
              tickets.map((ticket) => (
                <Paper
                  key={ticket._id}
                  onClick={() => openTicket(ticket)}
                  sx={{
                    p: 2,
                    mb: 2,
                    cursor: "pointer",
                    "&:hover": { boxShadow: 3 },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {ticket.ticketNumber || "—"} •{" "}
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography fontWeight="bold">{ticket.subject}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ticket.category}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={ticket.status}
                      color={STATUS_COLOR[ticket.status] || "default"}
                    />
                  </Stack>
                </Paper>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Ticket detail + thread */}
      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selected?.ticketNumber} — {selected?.subject}
        </DialogTitle>
        <DialogContent dividers>
          {detailLoading || !selected ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                {selected.category} • Status: {selected.status}
              </Typography>
              <Typography sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
                {selected.message}
              </Typography>
              <AttachmentLinks attachments={selected.attachments} />

              <Divider sx={{ my: 2 }} />

              {replies.length === 0 ? (
                <Typography color="text.secondary">No replies yet.</Typography>
              ) : (
                replies.map((r) => (
                  <Paper key={r._id} variant="outlined" sx={{ p: 2, mb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {r.authorRole === "admin" ? "Credit Dost Support" : "You"} •{" "}
                      {new Date(r.createdAt).toLocaleString()}
                    </Typography>
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>{r.message}</Typography>
                    <AttachmentLinks attachments={r.attachments} />
                  </Paper>
                ))
              )}

              <Divider sx={{ my: 2 }} />

              {selected.status === "Closed" ? (
                <Alert severity="info">This ticket is closed and cannot receive replies.</Alert>
              ) : (
                <>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Your reply"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    disabled={sendingReply}
                    inputProps={{ maxLength: 5000 }}
                  />
                  <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                    {fileInput(setReplyFiles)}
                    <Typography variant="caption" color="text.secondary">
                      {replyFiles.length
                        ? replyFiles.map((f) => f.name).join(", ")
                        : "JPG, PNG or PDF, up to 3 files"}
                    </Typography>
                  </Stack>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
          {selected && selected.status !== "Closed" && (
            <Button
              variant="contained"
              onClick={sendReply}
              disabled={sendingReply || detailLoading}
            >
              {sendingReply ? "Sending..." : "Send reply"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={toast.type}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          variant="filled"
        >
          {toast.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
