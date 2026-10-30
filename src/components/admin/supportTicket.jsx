import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Link,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { adminAPI, getAttachmentUrl } from "../../services/api";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved", "Closed"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];
const CATEGORY_OPTIONS = [
  "CIBIL Report Issue",
  "AI Issue",
  "Technical Issue",
  "Reopen Case",
];

const STATUS_COLOR = {
  Pending: "warning",
  "In Progress": "info",
  Resolved: "success",
  Closed: "default",
};

const EMPTY_FILTERS = { status: "", category: "", priority: "", search: "" };

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

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [selected, setSelected] = useState(null);
  const [replies, setReplies] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyFiles, setReplyFiles] = useState([]);
  const [sendingReply, setSendingReply] = useState(false);

  const fetchTickets = useCallback(async (page = 1) => {
    try {
      setLoading(true);

      const params = { page, limit: 20 };
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const res = await adminAPI.getAllTickets(params);
      setTickets(res.data?.data ?? []);
      setPagination({
        page: res.data?.pagination?.page ?? 1,
        pages: res.data?.pagination?.pages ?? 1,
        total: res.data?.pagination?.total ?? 0,
      });
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTickets(1);
  }, [fetchTickets]);

  const applySearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput.trim() }));
  };

  const updateFilter = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const replaceTicketInList = (updated) =>
    setTickets((prev) =>
      prev.map((t) => (t._id === updated._id ? { ...t, ...updated } : t)),
    );

  const handleStatusChange = async (ticketId, status) => {
    try {
      setUpdatingId(ticketId);
      const res = await adminAPI.updateTicketStatus(ticketId, status);
      replaceTicketInList(res.data.data);
      if (selected?._id === ticketId) {
        setSelected((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update ticket status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMetaChange = async (ticketId, data) => {
    try {
      setUpdatingId(ticketId);
      const res = await adminAPI.updateTicketMeta(ticketId, data);
      replaceTicketInList(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update ticket");
    } finally {
      setUpdatingId(null);
    }
  };

  const openTicket = async (ticket) => {
    try {
      setDetailLoading(true);
      setSelected(ticket);
      setReplies([]);
      setReplyText("");
      setReplyFiles([]);
      const res = await adminAPI.getTicket(ticket._id);
      setSelected(res.data.data.ticket);
      setReplies(res.data.data.replies);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load ticket");
      setSelected(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim()) return alert("Please write a reply");
    try {
      setSendingReply(true);
      const formData = new FormData();
      formData.append("message", replyText.trim());
      replyFiles.forEach((file) => formData.append("attachments", file));

      const res = await adminAPI.replyTicket(selected._id, formData);
      setReplies((prev) => [...prev, res.data.data]);
      setReplyText("");
      setReplyFiles([]);
      // Backend may move the ticket to In Progress; refresh the row to match
      setSelected((prev) =>
        prev?.status === "Pending" ? { ...prev, status: "In Progress" } : prev,
      );
      fetchTickets(pagination.page);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Support Tickets ({pagination.total})
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2, }}>
        <Stack
          component="form"
          onSubmit={applySearch}
          direction={{ xs: "column", md: "row" }}
          spacing={2}
        >
          <TextField
            select
            size="small"
            label="Status"
            value={filters.status}
            onChange={updateFilter("status")}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Category"
            value={filters.category}
            onChange={updateFilter("category")}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All</MenuItem>
            {CATEGORY_OPTIONS.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Priority"
            value={filters.priority}
            onChange={updateFilter("priority")}
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="">All</MenuItem>
            {PRIORITY_OPTIONS.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="Search subject or ticket no."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Button type="submit" variant="contained" sx={{ minWidth: 100 }}>
            Search
          </Button>
        </Stack>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : tickets.length === 0 ? (
        <Typography color="text.secondary">No tickets found.</Typography>
      ) : (
        tickets.map((ticket) => (
          <Paper key={ticket._id} sx={{ p: 2, mb: 2, }}>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {ticket.ticketNumber || "—"}
                </Typography>
                <Typography variant="h6">{ticket.subject}</Typography>
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

            <Typography sx={{ my: 1 }} noWrap>
              {ticket.message}
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
              <TextField
                select
                size="small"
                label="Status"
                value={ticket.status}
                disabled={updatingId === ticket._id}
                onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                sx={{ minWidth: 160 }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                size="small"
                label="Priority"
                value={ticket.priority || "Medium"}
                disabled={updatingId === ticket._id}
                onChange={(e) =>
                  handleMetaChange(ticket._id, { priority: e.target.value })
                }
                sx={{ minWidth: 130 }}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                size="small"
                variant="outlined"
                disabled={updatingId === ticket._id}
                onClick={() =>
                  handleMetaChange(ticket._id, {
                    assignment: ticket.assignedTo ? "none" : "me",
                  })
                }
              >
                {ticket.assignedTo
                  ? `Assigned: ${ticket.assignedTo.name} (unassign)`
                  : "Assign to me"}
              </Button>

              <Button size="small" onClick={() => openTicket(ticket)}>
                View & reply
              </Button>
            </Stack>

            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              Raised by: {ticket.user?.name ?? "Unknown"}
              {ticket.user?.email ? ` (${ticket.user.email})` : ""} •{" "}
              {new Date(ticket.createdAt).toLocaleString()}
            </Typography>
          </Paper>
        ))
      )}

      {pagination.pages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={(_, page) => fetchTickets(page)}
            color="primary"
          />
        </Box>
      )}

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
                {selected.category} • {selected.status} • Priority{" "}
                {selected.priority} • Raised by {selected.user?.name}
                {selected.user?.email ? ` (${selected.user.email})` : ""}
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
                      {r.authorRole === "admin" ? "Credit Dost" : "Franchise"} •{" "}
                      {r.author?.name ?? "Unknown"} •{" "}
                      {new Date(r.createdAt).toLocaleString()}
                    </Typography>
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                      {r.message}
                    </Typography>
                    <AttachmentLinks attachments={r.attachments} />
                  </Paper>
                ))
              )}

              <Divider sx={{ my: 2 }} />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Reply to franchise"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                disabled={sendingReply}
              />
              <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                <Button component="label" size="small" variant="outlined">
                  Attach files
                  <input
                    hidden
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) =>
                      setReplyFiles(Array.from(e.target.files || []).slice(0, 3))
                    }
                  />
                </Button>
                <Typography variant="caption" color="text.secondary">
                  {replyFiles.length
                    ? replyFiles.map((f) => f.name).join(", ")
                    : "JPG, PNG or PDF, up to 3 files, 5 MB each"}
                </Typography>
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
          <Button
            variant="contained"
            onClick={sendReply}
            disabled={sendingReply || !selected || detailLoading}
          >
            {sendingReply ? "Sending..." : "Send reply"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTickets;
