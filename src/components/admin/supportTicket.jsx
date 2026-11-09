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
  IconButton,
  Link,
  Menu,
  MenuItem,
  Pagination,
  Paper,
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
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import { adminAPI, getAttachmentUrl } from "../../services/api";
import { useAuth } from "../../hooks/useAuth.jsx";
import { notifySupportCountsChanged } from "./useSupportUnreadCount";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved", "Closed"];
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

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (value) =>
  new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDateTime = (value) => `${formatDate(value)} ${formatTime(value)}`;

const SectionLabel = ({ children }) => (
  <Typography
    variant="caption"
    sx={{
      display: "block",
      mt: 2.5,
      mb: 0.5,
      color: "text.secondary",
      fontWeight: 600,
      letterSpacing: 0.6,
      textTransform: "uppercase",
    }}
  >
    {children}
  </Typography>
);

const AttachmentList = ({ attachments = [] }) =>
  attachments.length === 0 ? null : (
    <Stack direction="row" spacing={1} flexWrap="wrap" mt={1} useFlexGap>
      {attachments.map((a) =>
        a.mimeType?.startsWith("image/") ? (
          <a
            key={a.url}
            href={getAttachmentUrl(a.url)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Box
              component="img"
              src={getAttachmentUrl(a.url)}
              alt={a.originalName || "Attachment"}
              sx={{
                width: 110,
                height: 150,
                objectFit: "cover",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            />
          </a>
        ) : (
          <Link
            key={a.url}
            href={getAttachmentUrl(a.url)}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
          >
            {a.originalName || "Attachment"}
          </Link>
        ),
      )}
    </Stack>
  );

// One chat bubble. Admin replies sit on the right, partner messages on the left.
const Bubble = ({ mine, name, time, text, attachments }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: mine ? "flex-end" : "flex-start",
      mb: 1.5,
    }}
  >
    <Box
      sx={{
        maxWidth: "75%",
        px: 2,
        py: 1.5,
        borderRadius: 3,
        bgcolor: mine ? "#2563eb" : "background.paper",
        color: mine ? "#fff" : "text.primary",
        border: mine ? "none" : "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        variant="caption"
        sx={{ display: "block", fontWeight: 600, opacity: 0.85 }}
      >
        {name} · {time}
      </Typography>
      <Typography sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>{text}</Typography>
      {attachments?.length > 0 && (
        <Box sx={{ "& a, & p": { color: mine ? "#fff" : undefined } }}>
          <AttachmentList attachments={attachments} />
        </Box>
      )}
    </Box>
  </Box>
);

const formatAddress = (address) => {
  if (!address) return "—";
  if (typeof address === "string") return address;
  return Object.values(address).filter(Boolean).join(", ") || "—";
};

const DetailRow = ({ label, value }) => (
  <Box sx={{ display: "flex", py: 1, borderBottom: "1px solid #f1f5f9" }}>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ width: 180, flexShrink: 0 }}
    >
      {label}
    </Typography>
    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
      {value ?? "—"}
    </Typography>
  </Box>
);

const AdminTickets = () => {
  const { user } = useAuth();
  const [franchiseDialog, setFranchiseDialog] = useState({
    open: false,
    loading: false,
    data: null,
    error: "",
  });
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState({ anchor: null, ticket: null });

  // Ticket modal
  const [selected, setSelected] = useState(null);
  const [replies, setReplies] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [draftStatus, setDraftStatus] = useState("");
  const [draftNotes, setDraftNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyFiles, setReplyFiles] = useState([]);
  const [sendingReply, setSendingReply] = useState(false);

  const fetchTickets = useCallback(
    async (page = 1) => {
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
    },
    [filters],
  );

  useEffect(() => {
    fetchTickets(1);
  }, [fetchTickets]);

  const applySearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput.trim() }));
  };

  const updateFilter = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const openTicket = async (ticket) => {
    setMenu({ anchor: null, ticket: null });

    // Opening a ticket clears its "new" badge in the sidebar
    if (ticket.isRead === false) {
      adminAPI
        .markTicketRead(ticket._id)
        .then(() => {
          setTickets((prev) =>
            prev.map((t) => (t._id === ticket._id ? { ...t, isRead: true } : t)),
          );
          notifySupportCountsChanged();
        })
        .catch((err) => console.error("Mark ticket read failed:", err));
    }

    try {
      setDetailLoading(true);
      setSelected(ticket);
      setReplies([]);
      setReplyText("");
      setReplyFiles([]);
      setDraftStatus(ticket.status);
      setDraftNotes(ticket.internalNotes || "");

      const res = await adminAPI.getTicket(ticket._id);
      const full = res.data.data.ticket;
      setSelected(full);
      setDraftStatus(full.status);
      setDraftNotes(full.internalNotes || "");
      setReplies(res.data.data.replies);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load ticket");
      setSelected(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      if (draftStatus !== selected.status) {
        await adminAPI.updateTicketStatus(selected._id, draftStatus);
      }
      if (draftNotes !== (selected.internalNotes || "")) {
        await adminAPI.updateTicketMeta(selected._id, {
          internalNotes: draftNotes,
        });
      }
      setSelected(null);
      fetchTickets(pagination.page);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
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
      // Backend moves a Pending ticket to In Progress on admin reply
      setSelected((prev) =>
        prev?.status === "Pending" ? { ...prev, status: "In Progress" } : prev,
      );
      setDraftStatus((prev) => (prev === "Pending" ? "In Progress" : prev));
      fetchTickets(pagination.page);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const conversationCount = selected ? replies.length + 1 : 0;

  const openFranchise = async (franchiseCode) => {
    setFranchiseDialog({ open: true, loading: true, data: null, error: "" });
    try {
      const res = await adminAPI.getSingleFranchise(franchiseCode);
      setFranchiseDialog({
        open: true,
        loading: false,
        data: res.data.data,
        error: "",
      });
    } catch (err) {
      setFranchiseDialog({
        open: true,
        loading: false,
        data: null,
        error:
          err.response?.data?.message || "Failed to load franchise details",
      });
    }
  };

  const closeFranchise = () =>
    setFranchiseDialog((prev) => ({ ...prev, open: false }));

  const f = franchiseDialog.data;

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Support Tickets ({pagination.total})
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
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
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Date & Time",
                  "Name",
                  "Franchise ID",
                  "Subject",
                  "Reference ID",
                  "Status",
                  "",
                ].map((h, i) => (
                  <TableCell key={i}>
                    <strong>{h}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow
                  key={ticket._id}
                  hover
                  onClick={() => openTicket(ticket)}
                  sx={{
                    cursor: "pointer",
                    bgcolor: ticket.isRead === false ? "#fffbeb" : "inherit",
                  }}
                >
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {formatDate(ticket.createdAt)}
                    <br />
                    <span style={{ color: "#666", fontSize: "12px" }}>
                      {formatTime(ticket.createdAt)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {ticket.user?.name ?? "Unknown"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ticket.user?.email || ""}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {ticket.franchiseId?.franchiseCode ? (
                      <Link
                        component="button"
                        variant="body2"
                        fontWeight={700}
                        underline="hover"
                        sx={{ fontFamily: "monospace", fontWeight: 700 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openFranchise(ticket.franchiseId.franchiseCode);
                        }}
                      >
                        {ticket.franchiseId.franchiseCode}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  <TableCell>
                    {ticket.isRead === false && (
                      <Chip
                        size="small"
                        color="error"
                        label="New"
                        sx={{ mr: 1, height: 20 }}
                      />
                    )}
                    {ticket.subject}
                  </TableCell>

                  <TableCell sx={{ fontFamily: "monospace" }}>
                    {ticket.referenceId || "—"}
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      variant="outlined"
                      icon={<FiberManualRecordIcon sx={{ fontSize: 10 }} />}
                      label={ticket.status}
                      color={STATUS_COLOR[ticket.status] || "default"}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenu({ anchor: e.currentTarget, ticket });
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Menu
            anchorEl={menu.anchor}
            open={Boolean(menu.anchor)}
            onClose={() => setMenu({ anchor: null, ticket: null })}
          >
            <MenuItem onClick={() => openTicket(menu.ticket)}>
              Open conversation ({(menu.ticket?.replyCount || 0) + 1})
            </MenuItem>
          </Menu>
        </TableContainer>
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

      {/* Franchise details */}
      <Dialog
        open={franchiseDialog.open}
        onClose={closeFranchise}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>
            Franchise Details
          </Typography>
          {f && (
            <Typography variant="body2" color="text.secondary">
              {f.franchiseCode} • {f.businessName || "—"}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {franchiseDialog.loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : franchiseDialog.error ? (
            <Typography color="error">{franchiseDialog.error}</Typography>
          ) : f ? (
            <>
              <DetailRow label="Franchise ID" value={f.franchiseCode} />
              <DetailRow label="Business name" value={f.businessName} />
              <DetailRow label="Owner name" value={f.ownerName || f.userId?.name} />
              <DetailRow label="Email" value={f.email || f.userId?.email} />
              <DetailRow label="Phone" value={f.phone || f.userId?.phone} />
              <DetailRow label="Alternate phone" value={f.alternatePhone} />
              <DetailRow label="Address" value={formatAddress(f.address)} />
              <DetailRow label="Status" value={f.isActive ? "Active" : "Inactive"} />
              <DetailRow label="KYC status" value={f.kycStatus} />
              <DetailRow
                label="Agreement signed"
                value={f.agreementSigned ? "Yes" : "No"}
              />
              <DetailRow label="Credits available" value={f.credits} />
              <DetailRow
                label="Total credits purchased"
                value={f.totalCreditsPurchased}
              />
              <DetailRow
                label="Credit hold"
                value={f.creditHold ? "On hold" : "No"}
              />
              <DetailRow
                label="Last login"
                value={
                  f.lastLoginCreditAt || f.userId?.lastLoginAt
                    ? formatDateTime(f.lastLoginCreditAt || f.userId.lastLoginAt)
                    : null
                }
              />
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFranchise}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Ticket details + conversation */}
      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="sm"
      >
        {detailLoading || !selected ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h6" fontWeight={700}>
                Ticket Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Submitted by {selected.user?.name ?? "Unknown"} on{" "}
                {formatDateTime(selected.createdAt)}
              </Typography>
            </DialogTitle>

            <DialogContent dividers>
              <SectionLabel>Category</SectionLabel>
              <Typography>{selected.category}</Typography>

              <SectionLabel>Reference ID</SectionLabel>
              <Typography>{selected.referenceId || "—"}</Typography>

              <SectionLabel>Description</SectionLabel>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                  border: "1px solid",
                  borderColor: "divider",
                  whiteSpace: "pre-wrap",
                }}
              >
                <Typography>{selected.message}</Typography>
                <AttachmentList attachments={selected.attachments} />
              </Box>

              <SectionLabel>Conversation ({conversationCount})</SectionLabel>
              <Box
                sx={{
                  p: 2,
                  maxHeight: 280,
                  overflowY: "auto",
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Bubble
                  mine={false}
                  name={selected.user?.name ?? "Franchise"}
                  time={formatDateTime(selected.createdAt)}
                  text={selected.message}
                  attachments={selected.attachments}
                />
                {replies.map((r) => (
                  <Bubble
                    key={r._id}
                    mine={r.authorRole === "admin"}
                    name={
                      r.authorRole === "admin" && r.author?.name === user?.name
                        ? "You"
                        : r.author?.name ?? "Unknown"
                    }
                    time={formatDateTime(r.createdAt)}
                    text={r.message}
                    attachments={r.attachments}
                  />
                ))}
              </Box>

              {/* Reply box */}
              <Stack direction="row" spacing={1} alignItems="center" mt={2}>
                <IconButton component="label" size="small" color="primary">
                  <AttachFileIcon />
                  <input
                    hidden
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) =>
                      setReplyFiles(Array.from(e.target.files || []).slice(0, 3))
                    }
                  />
                </IconButton>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a reply to partner..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={sendingReply}
                  helperText={
                    replyFiles.length
                      ? replyFiles.map((f) => f.name).join(", ")
                      : "JPG, PNG or PDF, up to 3 files, 5 MB each"
                  }
                />
                <Button
                  variant="contained"
                  onClick={sendReply}
                  disabled={sendingReply || !replyText.trim()}
                  endIcon={<SendIcon />}
                  sx={{ minWidth: 100, height: 40 }}
                >
                  {sendingReply ? "Sending..." : "Reply"}
                </Button>
              </Stack>

              <Divider sx={{ my: 2.5 }} />

              <TextField
                select
                fullWidth
                label="Status"
                value={draftStatus}
                onChange={(e) => setDraftStatus(e.target.value)}
                disabled={saving}
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Internal Notes"
                placeholder="Visible to admins only"
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                disabled={saving}
                sx={{ mt: 2 }}
              />
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setSelected(null)} color="inherit">
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={saveChanges}
                disabled={saving}
                sx={{ px: 3 }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AdminTickets;
