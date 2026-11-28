import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Visibility, Description } from "@mui/icons-material";
import { adminAPI } from "../../services/api";
import {
  CardAlerts,
  CellText,
  DateCell,
  EmptyRow,
  LoadingBar,
  SearchField,
  SectionCard,
  TableFooter,
  TableToolbar,
} from "./ui/AdminTable";
import { bodyRowSx, headRowSx } from "./ui/tableStyles";

const WhiteLabelPartners = ({ embedded = false }) => {
  const [partners, setPartners] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
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
          page,
          limit: rowsPerPage,
          search: debouncedSearch,
        });
        setPartners(res.data.partners || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error("Failed to load White Label partners:", err);
        setError("Failed to load White Labeled Partners.");
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
      {!embedded && (
        <Typography variant="h4" gutterBottom>
          White Labeled Partners
        </Typography>
      )}

      <SectionCard>
        <TableToolbar>
          <SearchField
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            placeholder="Search by request ID, franchise, email or mobile"
          />
          <Typography variant="body2" color="text.secondary">
            Partners enrolled in White Labeled services
          </Typography>
        </TableToolbar>

        <CardAlerts error={error} onCloseError={() => setError("")} />
        <LoadingBar loading={loading} />

        <TableContainer>
          <Table size="small" sx={{ minWidth: 950 }} aria-label="white label partners table">
            <TableHead>
              <TableRow sx={headRowSx}>
                <TableCell>Request ID</TableCell>
                <TableCell>Partner</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Paid On</TableCell>
                <TableCell align="right">Reports</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partners.length === 0 ? (
                <EmptyRow
                  colSpan={7}
                  loading={loading}
                  title={debouncedSearch ? "No partners match your search" : "No partners yet"}
                  hint={
                    debouncedSearch
                      ? "Try a different search term."
                      : "Partners appear here after buying White Label Reports."
                  }
                />
              ) : (
                partners.map((p) => (
                  <TableRow key={p._id} hover sx={bodyRowSx}>
                    <TableCell>
                      <Chip label={p.requestId} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <CellText variant="body2" fontWeight={600}>
                        {p.businessName}
                      </CellText>
                      <Typography variant="caption" color="primary.main" fontWeight={600}>
                        {p.franchiseCode || "No partner ID"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 180 }}>
                      <CellText variant="body2">{p.ownerName || "—"}</CellText>
                      <Typography variant="caption" color="text.secondary">
                        {p.phone || "No phone"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <CellText variant="body2">{p.email}</CellText>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                      ₹{(p.amount || 0).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <DateCell value={p.paidAt} withTime={false} />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility fontSize="small" />}
                        onClick={() => openReports(p)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TableFooter page={page} rowsPerPage={rowsPerPage} total={total} onPageChange={setPage} />
      </SectionCard>

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography variant="h6" component="span" fontWeight={700}>
            White-Labeled Reports
          </Typography>
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
            <List dense disablePadding>
              {reports.map((r) => (
                <ListItem key={r._id} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Description fontSize="small" color="action" />
                  </ListItemIcon>
                  <ListItemText primary={r.name} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WhiteLabelPartners;
