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
  Grid,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { adminAPI } from "../../../services/api";
import { useLeadUnreadCounts, notifyLeadCountsChanged } from "../useLeadUnreadCounts";

const CR_STATUSES = ["New", "Contacted", "In Progress", "Resolved"];
const FRANCHISE_STATUSES = ["New", "Contacted", "Interested", "Not Interested"];

const STATUS_COLORS = {
  New: "error",
  Contacted: "warning",
  "In Progress": "info",
  Resolved: "success",
  Interested: "info",
  "Not Interested": "default",
};

const COMMON_FILTERS = ["search", "status", "state", "from", "to"];

const FILTER_FIELDS = {
  search: { label: "Search name / phone / email", type: "text", width: 280 },
  status: { label: "Status", type: "select", width: 180 },
  state: { label: "State", type: "text", width: 160 },
  from: { label: "From", type: "date", width: 170 },
  to: { label: "To", type: "date", width: 170 },
  language: { label: "Language", type: "text", width: 160 },
  problemType: { label: "Problem type", type: "text", width: 200 },
  profession: { label: "Profession", type: "text", width: 180 },
  minScore: { label: "Min score", type: "number", width: 130 },
  maxScore: { label: "Max score", type: "number", width: 130 },
  bureau: { label: "Bureau", type: "text", width: 160 },
};

const maskPan = (pan) => (pan ? `${pan.slice(0, 2)}XXXX${pan.slice(-4)}` : "—");
const formatDate = (value) => (value ? new Date(value).toLocaleDateString("en-IN") : "—");
const locationOf = (r) => [r.city, r.state].filter(Boolean).join(", ") || "—";

const contactCell = (r) => (
  <>
    <Typography variant="body2">{r.mobileNumber}</Typography>
    <Typography variant="caption" color="text.secondary">
      {r.email}
    </Typography>
  </>
);

// Shared columns for the enquiry tables. `detail` drives both the dialog and CSV export.
const BASE_DETAIL = [
  { label: "Full Name", value: (r) => r.fullName },
  { label: "Mobile Number", value: (r) => r.mobileNumber },
  { label: "Email", value: (r) => r.email },
  { label: "City", value: (r) => r.city },
  { label: "State", value: (r) => r.state },
  { label: "Status", value: (r) => r.status },
  { label: "Received On", value: (r) => formatDate(r.createdAt) },
];

const TABS = [
  {
    key: "credit-repair",
    label: "Credit Repair Enquiry",
    countKey: "creditRepair",
    description: "Enquiries from the website Credit Repair form.",
    source: "website",
    statuses: CR_STATUSES,
    filters: [...COMMON_FILTERS, "language", "problemType", "minScore", "maxScore"],
    columns: [
      { label: "Full Name", render: (r) => r.fullName },
      { label: "Contact", render: contactCell },
      { label: "Location", render: locationOf },
      { label: "Problem", render: (r) => r.problemType || "—" },
      { label: "Score", render: (r) => r.creditScore || "—" },
      { label: "Language", render: (r) => r.language || "—" },
    ],
    detail: [
      ...BASE_DETAIL,
      { label: "Problem Type", value: (r) => r.problemType },
      { label: "Credit Score", value: (r) => r.creditScore },
      { label: "Language", value: (r) => r.language },
      { label: "Occupation", value: (r) => r.occupation },
      { label: "Income", value: (r) => r.income },
      { label: "Message", value: (r) => r.message },
    ],
  },
  {
    key: "franchise",
    label: "Franchise Leads",
    countKey: "franchise",
    description: "Enquiries from the Franchise Opportunity form.",
    statuses: FRANCHISE_STATUSES,
    filters: [...COMMON_FILTERS, "profession"],
    columns: [
      { label: "Full Name", render: (r) => r.fullName },
      { label: "Contact", render: contactCell },
      { label: "Location", render: locationOf },
      { label: "Profession", render: (r) => r.profession || "—" },
    ],
    detail: [
      ...BASE_DETAIL,
      { label: "Profession", value: (r) => r.profession },
      { label: "Message", value: (r) => r.message },
    ],
  },
  {
    key: "whatsapp",
    label: "WhatsApp Credit Repair Leads",
    countKey: "whatsapp",
    description: "Customers with a credit score below 700 who tapped Contact Support on WhatsApp.",
    source: "whatsapp",
    statuses: CR_STATUSES,
    filters: [...COMMON_FILTERS, "minScore", "maxScore", "bureau"],
    columns: [
      { label: "Full Name", render: (r) => r.fullName },
      { label: "Contact", render: contactCell },
      { label: "Location", render: locationOf },
      {
        label: "Score",
        render: (r) => {
          const score = r.creditReport?.score ?? r.creditScore;
          return score ? <Chip size="small" label={score} color={Number(score) < 600 ? "error" : "warning"} /> : "—";
        },
      },
      { label: "Bureau", render: (r) => r.creditReport?.bureau || "—" },
      { label: "PAN", render: (r) => maskPan(r.creditReport?.pan) },
    ],
    detail: [
      ...BASE_DETAIL,
      { label: "Credit Score", value: (r) => r.creditReport?.score ?? r.creditScore },
      { label: "Bureau", value: (r) => r.creditReport?.bureau },
      { label: "PAN", value: (r) => r.creditReport?.pan },
      { label: "Score Prompt Sent", value: (r) => formatDate(r.creditReport?.lowScorePromptSentAt) },
      { label: "Occupation", value: (r) => r.occupation },
      { label: "Language", value: (r) => r.language },
    ],
  },
];

const EMPTY_FILTERS = {
  search: "",
  status: "",
  state: "",
  from: "",
  to: "",
  language: "",
  problemType: "",
  profession: "",
  minScore: "",
  maxScore: "",
  bureau: "",
};

// Only send the filters this tab supports and that have a value
const buildParams = (tab, filters, page, rowsPerPage) => {
  const params = { page: page + 1, limit: rowsPerPage };
  if (tab.source) params.source = tab.source;
  tab.filters.forEach((key) => {
    if (filters[key]) params[key] = filters[key];
  });
  return params;
};

const downloadCsv = (tab, rows) => {
  const headers = tab.detail.map((d) => d.label);
  const lines = rows.map((r) =>
    tab.detail
      .map((d) => `"${String(d.value(r) ?? "").replace(/"/g, '""')}"`)
      .join(","),
  );
  const blob = new Blob([[headers.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${tab.label.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const CreditReportLeads = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const tab = TABS[tabIndex];

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [detailRow, setDetailRow] = useState(null);
  const leadCounts = useLeadUnreadCounts();

  // Debounce typing so each keystroke doesn't trigger a request
  useEffect(() => {
    const timer = setTimeout(() => setAppliedFilters(filters), 350);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const params = buildParams(tab, appliedFilters, page, rowsPerPage);
        const res =
          tab.key === "franchise"
            ? await adminAPI.getFranchiseLeads(params)
            : await adminAPI.getCreditRepairEnquiries(params);
        if (ignore) return;
        const data = res.data;
        setRows(tab.key === "franchise" ? data.leads || [] : data.enquiries || []);
        setTotal(data.total || 0);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Failed to load leads");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [tab, appliedFilters, page, rowsPerPage, refreshKey]);

  const handleTabChange = (_, value) => {
    setTabIndex(value);
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPage(0);
  };

  const handleFilterChange = (key) => (e) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
    setPage(0);
  };

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(0);
  };

  // Opening or acting on a lead marks it read; the list and sidebar counts update
  const markRead = async (row) => {
    if (row.isRead) return;
    try {
      if (tab.key === "franchise") {
        await adminAPI.markFranchiseLeadRead(row._id);
      } else {
        await adminAPI.markCreditRepairRead(row._id);
      }
      setRows((prev) => prev.map((r) => (r._id === row._id ? { ...r, isRead: true } : r)));
      notifyLeadCountsChanged();
    } catch {
      // Not fatal: the lead stays unread and is retried on the next action
    }
  };

  const openDetails = (row) => {
    setDetailRow(row);
    markRead(row);
  };

  const changeStatus = async (row, status) => {
    try {
      if (tab.key === "franchise") {
        await adminAPI.updateFranchiseLeadStatus(row._id, status);
      } else {
        await adminAPI.updateCreditRepairEnquiryStatus(row._id, status);
      }
      setRows((prev) => prev.map((r) => (r._id === row._id ? { ...r, status } : r)));
      markRead(row);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
      setRefreshKey((k) => k + 1);
    }
  };

  const renderFilter = (key) => {
    const def = FILTER_FIELDS[key];
    if (key === "status") {
      return (
        <TextField
          select
          size="small"
          fullWidth
          label={def.label}
          value={filters.status}
          onChange={handleFilterChange("status")}
        >
          <MenuItem value="">All</MenuItem>
          {tab.statuses.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
      );
    }
    return (
      <TextField
        size="small"
        fullWidth
        type={def.type}
        label={def.label}
        value={filters[key]}
        onChange={handleFilterChange(key)}
        InputLabelProps={def.type === "date" ? { shrink: true } : undefined}
      />
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Leads
      </Typography>

      <Box>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
        >
          {TABS.map((t) => {
            const count = leadCounts[t.countKey] || 0;
            return (
              <Tab
                key={t.key}
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {t.label}
                    {count > 0 && <Chip size="small" color="error" label={count} />}
                  </Stack>
                }
              />
            );
          })}
        </Tabs>

        <Box p={2}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {tab.description}
          </Typography>

          {/* Filters: one wrapping row of fixed-width fields, actions on the right */}
          <Stack direction="row" flexWrap="wrap" useFlexGap gap={1.5} alignItems="center" mb={2}>
            {tab.filters.map((key) => (
              <Box key={key} sx={{ width: FILTER_FIELDS[key].width }}>
                {renderFilter(key)}
              </Box>
            ))}
            <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
              <Button variant="outlined" onClick={resetFilters}>
                Reset
              </Button>
              <Button
                variant="contained"
                onClick={() => downloadCsv(tab, rows)}
                disabled={rows.length === 0}
              >
                Export CSV
              </Button>
            </Stack>
          </Stack>

          <Typography variant="body2" color="text.secondary" mb={1}>
            {total} lead{total === 1 ? "" : "s"} found
          </Typography>

          {error && (
            <Typography color="error" mb={2}>
              {error}
            </Typography>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : rows.length === 0 ? (
            <Typography color="text.secondary" py={4} textAlign="center">
              No leads match these filters.
            </Typography>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {tab.columns.map((c) => (
                      <TableCell key={c.label}>{c.label}</TableCell>
                    ))}
                    <TableCell>Status</TableCell>
                    <TableCell>Received</TableCell>
                    <TableCell align="right">Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row._id}
                      hover
                      sx={{ "& td": { fontWeight: row.isRead ? "normal" : 600 } }}
                    >
                      {tab.columns.map((c) => (
                        <TableCell key={c.label}>{c.render(row)}</TableCell>
                      ))}
                      <TableCell>
                        <TextField
                          select
                          size="small"
                          value={row.status}
                          onChange={(e) => changeStatus(row, e.target.value)}
                          sx={{ minWidth: 140 }}
                        >
                          {tab.statuses.map((s) => (
                            <MenuItem key={s} value={s}>
                              <Chip size="small" label={s} color={STATUS_COLORS[s]} variant="outlined" />
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>{formatDate(row.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => openDetails(row)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          <TablePagination
            component="div"
            count={total}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Box>
      </Box>

      {/* Details */}
      <Dialog open={Boolean(detailRow)} onClose={() => setDetailRow(null)} fullWidth maxWidth="sm">
        <DialogTitle>{detailRow?.fullName || "Lead details"}</DialogTitle>
        <DialogContent dividers>
          {detailRow &&
            tab.detail.map((d) => (
              <Grid container key={d.label} py={0.75}>
                <Grid item xs={5}>
                  <Typography variant="body2" color="text.secondary">
                    {d.label}
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                    {d.value(detailRow) || "—"}
                  </Typography>
                </Grid>
              </Grid>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailRow(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreditReportLeads;
