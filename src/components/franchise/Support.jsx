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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SendIcon from "@mui/icons-material/Send";
import { franchiseAPI, getAttachmentUrl } from "../../services/api";
import { PageHeader, SectionCard, SectionHeader, TableToolbar, SearchField, FilterChips, EmptyRow, LoadingBar } from "../admin/ui/AdminTable";
import { headRowSx, bodyRowSx, primaryButtonSx } from "../admin/ui/tableStyles";

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

const STATUS_FILTERS = [
  { value: "", label: "All" },
  ...Object.keys(STATUS_COLOR).map((value) => ({ value, label: value })),
];

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
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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
      setCreateOpen(false);
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

  const visibleTickets = tickets.filter((ticket) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = [ticket.subject, ticket.ticketNumber, ticket.category].some((value) =>
      (value || "").toLowerCase().includes(query),
    );
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box>
      <PageHeader
        title="Support tickets"
        subtitle="Raise requests about CIBIL, credit reports, recharges or technical issues."
        actions={
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setCreateOpen(true)}
            sx={primaryButtonSx}
          >
            Create ticket
          </Button>
        }
      />

      <SectionCard>
        <SectionHeader
          title="Your tickets"
          subtitle={`${tickets.length} ${tickets.length === 1 ? "ticket" : "tickets"}`}
        />

        <TableToolbar>
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search by subject, ticket number or category"
          />
          <FilterChips value={statusFilter} onChange={setStatusFilter} options={STATUS_FILTERS} />
        </TableToolbar>
        <LoadingBar loading={listLoading} />

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={headRowSx}>
                <TableCell>Ticket</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!listLoading && visibleTickets.length === 0 && (
                <EmptyRow
                  colSpan={4}
                  title={tickets.length === 0 ? "No support tickets yet" : "No tickets match your search"}
                  hint={
                    tickets.length === 0
                      ? "Create a ticket to get help from Credit Dost support."
                      : "Try a different search or filter."
                  }
                />
              )}
              {visibleTickets.map((ticket) => (
                <TableRow
                  key={ticket._id}
                  hover
                  onClick={() => openTicket(ticket)}
                  sx={{ ...bodyRowSx, cursor: "pointer" }}
                >
                  <TableCell sx={{ maxWidth: 380 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {ticket.ticketNumber || "—"}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} noWrap title={ticket.subject}>
                      {ticket.subject}
                    </Typography>
                  </TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={ticket.status}
                      color={STATUS_COLOR[ticket.status] || "default"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SectionCard>

      {/* Create ticket */}
      <Dialog
        open={createOpen}
        onClose={() => !submitting && setCreateOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Create ticket</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            name="subject"
            label="Subject"
            placeholder="e.g. CIBIL report not generated"
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
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setCreateOpen(false)} disabled={submitting} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            startIcon={submitting ? null : <SendIcon />}
            disabled={submitting}
            onClick={handleSubmit}
            sx={primaryButtonSx}
          >
            {submitting ? "Submitting..." : "Submit ticket"}
          </Button>
        </DialogActions>
      </Dialog>

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
