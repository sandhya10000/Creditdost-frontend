import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Chip,
  Button,
  Link,
  Stack,
} from "@mui/material";
import { PictureAsPdf } from "@mui/icons-material";
import { franchiseAPI } from "../../services/api";
import {
  SectionCard,
  SectionHeader,
  TableToolbar,
  SearchField,
  FilterChips,
  EmptyRow,
  LoadingBar,
  TableFooter,
} from "../admin/ui/AdminTable";
import { headRowSx, bodyRowSx } from "../admin/ui/tableStyles";

const ROWS_PER_PAGE = 20;

const BUREAU_OPTIONS = [
  { value: "", label: "All" },
  { value: "cibil", label: "CIBIL" },
  { value: "crif", label: "CRIF" },
  { value: "experian", label: "Experian" },
  { value: "equifax", label: "Equifax" },
];

const scoreColor = (score) => {
  if (score >= 750) return "success";
  if (score >= 700) return "info";
  if (score >= 650) return "warning";
  return "error";
};

const scoreLabel = (score) => {
  if (score >= 750) return "Excellent";
  if (score >= 700) return "Good";
  if (score >= 650) return "Fair";
  return "Poor";
};

const getReportUrl = (report) => {
  // Use the local path if available, otherwise the original report URL
  if (report.localPath) {
    const baseUrl = import.meta.env.VITE_REACT_APP_API_URL
      ? import.meta.env.VITE_REACT_APP_API_URL.replace("/api", "")
      : "https://reactbackend.creditdost.co.in";
    return `${baseUrl}${report.localPath}`;
  }
  return report.reportUrl;
};

const ViewReports = () => {
  const [creditReports, setCreditReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [bureauFilter, setBureauFilter] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadCreditReports();
  }, [page]);

  const loadCreditReports = async () => {
    try {
      setLoading(true);
      const response = await franchiseAPI.getCreditReports({
        page: page,
        limit: ROWS_PER_PAGE,
      });
      setCreditReports(response.data.reports || []);
      setTotalRecords(response.data.total || 0);
    } catch (err) {
      console.error("Error loading credit reports:", err);
      setError("Failed to load credit reports");
    } finally {
      setLoading(false);
    }
  };

  // Search and bureau filter apply to the rows on the current page
  const filteredReports = creditReports.filter((report) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      report.name.toLowerCase().includes(query) ||
      report.mobile.includes(searchTerm) ||
      (report.pan && report.pan.toLowerCase().includes(query));

    const matchesBureau = bureauFilter ? report.bureau === bureauFilter : true;

    return matchesSearch && matchesBureau;
  });

  const isFiltering = Boolean(searchTerm || bureauFilter);

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <SectionCard>
        <SectionHeader
          title="Credit reports"
          subtitle={`${totalRecords} ${totalRecords === 1 ? "report" : "reports"} generated`}
        />

        <TableToolbar>
          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name, mobile or PAN"
          />
          <FilterChips
            value={bureauFilter}
            onChange={setBureauFilter}
            options={BUREAU_OPTIONS}
          />
        </TableToolbar>
        <LoadingBar loading={loading} />

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={headRowSx}>
                <TableCell>Name</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>PAN</TableCell>
                <TableCell>Bureau</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Report</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && filteredReports.length === 0 && (
                <EmptyRow
                  colSpan={7}
                  title={isFiltering ? "No reports match your search" : "No credit reports yet"}
                  hint={
                    isFiltering
                      ? "Try a different name, mobile, PAN or bureau."
                      : "Run a credit check and its report will appear here."
                  }
                />
              )}
              {!loading &&
                filteredReports.map((report) => (
                  <TableRow key={report._id} hover sx={bodyRowSx}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {report.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontVariantNumeric: "tabular-nums" }}>{report.mobile}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace" }}>{report.pan || "—"}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.bureau ? report.bureau.toUpperCase() : "N/A"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {report.score ? (
                        <Chip
                          label={`${report.score} · ${scoreLabel(report.score)}`}
                          color={scoreColor(report.score)}
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      {getReportUrl(report) ? (
                        <Stack direction="row" justifyContent="flex-end">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<PictureAsPdf sx={{ fontSize: 16 }} />}
                            component={Link}
                            href={getReportUrl(report)}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="none"
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                              borderRadius: 2,
                              borderColor: "divider",
                              color: "text.primary",
                            }}
                          >
                            PDF
                          </Button>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableFooter
          page={page}
          rowsPerPage={ROWS_PER_PAGE}
          total={totalRecords}
          onPageChange={setPage}
        />
      </SectionCard>
    </Box>
  );
};

export default ViewReports;
