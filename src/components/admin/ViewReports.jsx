import React, { useState, useEffect } from "react";
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
  Button,
  Link,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Pagination,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { PictureAsPdf, Search } from "@mui/icons-material";
import { adminAPI } from "../../services/api";

const ViewReports = () => {
  const [creditReports, setCreditReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [bureauFilter, setBureauFilter] = useState("");

  // Pagination States
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reload data when page, search or bureau filter changes
  useEffect(() => {
    loadCreditReports();
  }, [page, debouncedSearch, bureauFilter]);

  const loadCreditReports = async () => {
    try {
      setLoading(true);
      // API expects 1-indexed pages, so we pass page + 1
      const response = await adminAPI.getAllCreditReports({
        page: page,
        limit: rowsPerPage,
        search: searchTerm,
        bureau: bureauFilter,
      });

      console.log("Report response", response);

      // Map API response to local state
      setCreditReports(response.data.reports || []);
      setTotalRecords(response.data.total || 0);
      setLoading(false);
    } catch (err) {
      console.error("Error loading credit reports:", err);
      setError("Failed to load credit reports");
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const getScoreColor = (score) => {
    if (score >= 750) return "success";
    if (score >= 700) return "info";
    if (score >= 650) return "warning";
    return "error";
  };

  const getScoreLabel = (score) => {
    if (score >= 750) return "Excellent";
    if (score >= 700) return "Good";
    if (score >= 650) return "Fair";
    return "Poor";
  };

  const getReportUrl = (report) => {
    if (report.localPath) {
      const baseUrl = import.meta.env.VITE_REACT_APP_API_URL
        ? import.meta.env.VITE_REACT_APP_API_URL.replace("/api", "")
        : "https://reactbackend.creditdost.co.in";
      return `${baseUrl}${report.localPath}`;
    }
    return report.reportUrl;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Credit Reports
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Credit Reports
          </Typography>

          {/* Search and Filter Controls */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Search by name, mobile, PAN, or franchise"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                InputProps={{
                  endAdornment: <Search />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Credit Bureau</InputLabel>
                <Select
                  value={bureauFilter}
                  label="Credit Bureau"
                  onChange={(e) => {
                    setBureauFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="">All Bureaus</MenuItem>
                  <MenuItem value="cibil">CIBIL</MenuItem>
                  <MenuItem value="crif">CRIF</MenuItem>
                  <MenuItem value="experian">Experian</MenuItem>
                  <MenuItem value="equifax">Equifax</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : creditReports.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: "center", py: 4 }}>
              {searchTerm || bureauFilter
                ? "No reports match your search criteria."
                : "No credit reports found."}
            </Typography>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="credit reports table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Franchise</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Mobile</TableCell>
                      <TableCell>PAN</TableCell>
                      <TableCell>Bureau</TableCell>
                      <TableCell>Credit Score</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {creditReports.map((report) => (
                      <TableRow
                        key={report._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          {report?.franchiseId?.businessName ||
                            report?.userId?.name}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {report.name}
                        </TableCell>
                        <TableCell>{report.mobile}</TableCell>
                        <TableCell>{report.pan || "N/A"}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              report.bureau
                                ? report.bureau.toUpperCase()
                                : "N/A"
                            }
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {report.score ? (
                            <Chip
                              label={`${report.score} (${getScoreLabel(report.score)})`}
                              color={getScoreColor(report.score)}
                              size="small"
                            />
                          ) : (
                            <Chip label="N/A" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getReportUrl(report) && (
                            <Button
                              size="small"
                              startIcon={<PictureAsPdf />}
                              component={Link}
                              href={getReportUrl(report)}
                              target="_blank"
                            >
                              PDF
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" }, // Stacks on mobile, side-by-side on desktop
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    p: 3,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Total Records: {totalRecords}
                  </Typography>

                  <Pagination
                    count={Math.ceil(totalRecords / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                  />
                  <Typography></Typography>
                </Box>
              </TableContainer>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewReports;
