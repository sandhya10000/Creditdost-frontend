import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Grid,
  Divider,
} from "@mui/material";
import { Visibility, Download as DownloadIcon } from "@mui/icons-material";

const PAGE_SIZE = 10;

// Shared list page for website enquiry leads (search, status filter,
// client-side pagination, status update, view dialog, CSV export).
// columns:      [{ key, label, render?(row) }]  -> table columns
// detailFields: [{ key, label, render?(row) }]  -> view dialog fields
const LeadsTablePage = ({
  title,
  initialRows,
  statuses,
  statusColors,
  columns,
  detailFields,
  searchKeys,
  csvFileName,
  onStatusChange,
}) => {
  const [rows, setRows] = useState(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!term) return true;
      return searchKeys.some((key) =>
        String(row[key] || "").toLowerCase().includes(term),
      );
    });
  }, [rows, searchTerm, statusFilter, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const renderCell = (field, row) =>
    field.render ? field.render(row) : row[field.key] || "—";

  const handleStatusChange = (id, status) => {
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    if (onStatusChange) onStatusChange(id, status);
  };

  const downloadCSV = () => {
    if (filtered.length === 0) {
      alert("No data to export.");
      return;
    }
    const headers = ["Created Date", ...detailFields.map((f) => f.label), "Status"];
    const csvRows = filtered.map((row) => [
      new Date(row.createdAt).toLocaleDateString(),
      ...detailFields.map((f) => `"${String(row[f.key] ?? "").replace(/"/g, '""')}"`),
      `"${row.status}"`,
    ]);
    const csvContent = [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${csvFileName}_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const colCount = columns.length + 3;

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<DownloadIcon />}
          onClick={downloadCSV}
          sx={{ color: "#fff", minWidth: 160 }}
        >
          Download CSV
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label="Search by name, mobile, email or city"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              {columns.map((col) => (
                <TableCell key={col.key} sx={{ fontWeight: 700 }}>
                  {col.label}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colCount} align="center" sx={{ py: 6 }}>
                  <Typography color="textSecondary">No leads found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row) => (
                <TableRow key={row._id} hover>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {new Date(row.createdAt).toLocaleDateString()}
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{renderCell(col, row)}</TableCell>
                  ))}
                  <TableCell>
                    <FormControl size="small" variant="outlined" sx={{ minWidth: 130 }}>
                      <Select
                        value={row.status}
                        onChange={(e) => handleStatusChange(row._id, e.target.value)}
                        sx={{ fontSize: "0.8rem" }}
                        renderValue={(val) => (
                          <Chip
                            label={val}
                            color={statusColors[val] || "default"}
                            size="small"
                            sx={{ height: 22, fontSize: "0.72rem", cursor: "pointer" }}
                          />
                        )}
                      >
                        {statuses.map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => setSelected(row)}
                      title="View Details"
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, v) => setPage(v)}
            color="primary"
          />
        </Box>
      )}

      {/* View Details Modal */}
      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Lead Details — {selected && renderCell(detailFields[0], selected)}
          <Chip
            label={selected?.status}
            color={statusColors[selected?.status] || "default"}
            size="small"
            sx={{ ml: 2, verticalAlign: "middle" }}
          />
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selected && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              {detailFields.map((field) => (
                <Grid item xs={12} sm={6} key={field.key}>
                  <Typography variant="caption" color="textSecondary">
                    {field.label}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {renderCell(field, selected)}
                  </Typography>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  Submitted on {new Date(selected.createdAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadsTablePage;
