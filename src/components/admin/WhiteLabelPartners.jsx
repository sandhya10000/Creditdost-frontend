import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { Visibility, Search, Description } from "@mui/icons-material";
import { adminAPI } from "../../services/api";

const WhiteLabelPartners = () => {
  const [partners, setPartners] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0); // MUI TablePagination is 0-indexed
  const rowsPerPage = 20;

  const [selected, setSelected] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await adminAPI.getWhiteLabelPartners({
          page: page + 1,
          limit: rowsPerPage,
          search: debouncedSearch,
        });
        setPartners(res.data.partners || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error("Failed to load White Label partners:", err);
        setError("Failed to load White-Labeled Reports.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, debouncedSearch]);

  const openReports = async (partner) => {
    setSelected(partner);
    setReports([]);
    setReportsLoading(true);
    try {
      const res = await adminAPI.getWhiteLabelPartnerReports(partner.partnerId);
      setReports(res.data.reports || []);
    } catch (err) {
      console.error("Failed to load partner white-label reports:", err);
      setError("Failed to load reports for this partner.");
    } finally {
      setReportsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        White-Labeled Reports
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Partners who purchased White Label Reports
          </Typography>

          <TextField
            fullWidth
            sx={{ mb: 3 }}
            label="Search by request ID, franchise, email, or mobile"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{ endAdornment: <Search /> }}
          />

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : partners.length === 0 ? (
            <Typography sx={{ textAlign: "center", py: 4 }}>
              {debouncedSearch
                ? "No partners match your search."
                : "No partners have purchased White Label Reports yet."}
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 800 }} aria-label="white label partners table">
                <TableHead>
                  <TableRow>
                    <TableCell>Request ID</TableCell>
                    <TableCell>Franchise</TableCell>
                    <TableCell>Franchise ID</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Paid On</TableCell>
                    <TableCell align="center">Reports</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {partners.map((p) => (
                    <TableRow key={p._id} sx={{ "&:last-child td": { border: 0 } }}>
                      <TableCell>
                        <Chip label={p.requestId} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{p.businessName}</TableCell>
                      <TableCell sx={{ fontFamily: "monospace" }}>
                        {p.franchiseCode || "N/A"}
                      </TableCell>
                      <TableCell>{p.ownerName || "N/A"}</TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell>{p.phone}</TableCell>
                      <TableCell>₹{(p.amount || 0).toLocaleString("en-IN")}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {p.paidAt ? new Date(p.paidAt).toLocaleDateString("en-IN") : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View white-labeled reports">
                          <IconButton color="primary" onClick={() => openReports(p)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={total}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[rowsPerPage]}
                onPageChange={(_, newPage) => setPage(newPage)}
              />
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>
          White-Labeled Reports
          {selected && (
            <Typography variant="body2" color="text.secondary">
              {selected.businessName} · {selected.requestId}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {reportsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : reports.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Description sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
              <Typography color="text.secondary">
                No white-labeled reports generated yet.
              </Typography>
            </Box>
          ) : (
            reports.map((r) => <Typography key={r._id}>{r.name}</Typography>)
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WhiteLabelPartners;
