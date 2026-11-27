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
  Chip,
  Button,
  Link,
} from "@mui/material";
import { PictureAsPdf } from "@mui/icons-material";
import { adminAPI } from "../../services/api";
import FranchiseDetailsDialog from "./FranchiseDetailsDialog";
import {
  CardAlerts,
  CellText,
  DateCell,
  EmptyRow,
  FilterChips,
  LoadingBar,
  ScoreChip,
  SearchField,
  SectionCard,
  TableFooter,
  TableToolbar,
} from "./ui/AdminTable";
import { bodyRowSx, headRowSx } from "./ui/tableStyles";

const BUREAU_FILTERS = [
  { value: "", label: "All" },
  { value: "cibil", label: "CIBIL" },
  { value: "crif", label: "CRIF" },
  { value: "experian", label: "Experian" },
  { value: "equifax", label: "Equifax" },
];

const ViewReports = ({ embedded = false }) => {
  const [creditReports, setCreditReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingId, setDownloadingId] = useState("");
  const [franchiseCode, setFranchiseCode] = useState(null);

  // Error responses come back as blobs when responseType is "blob"; read the JSON message out of them
  const readErrorMessage = async (err) => {
    const data = err.response?.data;
    if (data instanceof Blob) {
      try {
        return JSON.parse(await data.text()).message || "Download failed";
      } catch {
        return "Download failed";
      }
    }
    return data?.message || "Download failed";
  };

  const handleDownload = async (report) => {
    setDownloadingId(report._id);
    setError("");
    try {
      const { data } = await adminAPI.downloadCreditReport(report._id);
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(report.name || "Report").replace(/[^a-z0-9]+/gi, "_")}_${(report.bureau || "credit").toUpperCase()}_Report.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(await readErrorMessage(err));
    } finally {
      setDownloadingId("");
    }
  };
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
      const response = await adminAPI.getAllCreditReports({
        page: page,
        limit: rowsPerPage,
        search: searchTerm,
        bureau: bureauFilter,
      });

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

  const getReportUrl = (report) => {
    if (report.localPath) {
      const baseUrl = import.meta.env.VITE_REACT_APP_API_URL
        ? import.meta.env.VITE_REACT_APP_API_URL.replace("/api", "")
        : "https://reactbackend.creditdost.co.in";
      return `${baseUrl}${report.localPath}`;
    }
    return report.reportUrl;
  };

  // Who pulled the report: a staff member, or the partner's business
  const creatorName = (report) =>
    report.createdByEmployee
      ? `${report.createdByEmployee.name}${
          report.createdByEmployee.staffCode ? ` (${report.createdByEmployee.staffCode})` : ""
        }`
      : report?.franchiseId?.businessName || "N/A";

  return (
    <Box>
      {!embedded && (
        <Typography variant="h4" gutterBottom>
          Credit Reports
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
            placeholder="Search by name, mobile, PAN or franchise"
          />
          <FilterChips
            label="Bureau:"
            options={BUREAU_FILTERS}
            value={bureauFilter}
            onChange={(value) => {
              setBureauFilter(value);
              setPage(1);
            }}
          />
        </TableToolbar>

        <CardAlerts error={error} onCloseError={() => setError("")} />
        <LoadingBar loading={loading} />

        <TableContainer>
          <Table size="small" sx={{ minWidth: 1000 }} aria-label="credit reports table">
            <TableHead>
              <TableRow sx={headRowSx}>
                <TableCell>Customer</TableCell>
                <TableCell>PAN</TableCell>
                <TableCell>Pulled by</TableCell>
                <TableCell>Bureau</TableCell>
                <TableCell>Credit Score</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Report</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {creditReports.length === 0 ? (
                <EmptyRow
                  colSpan={7}
                  loading={loading}
                  title="No credit reports found"
                  hint={
                    searchTerm || bureauFilter
                      ? "Try a different search or bureau."
                      : "Reports appear here once a credit check is run."
                  }
                />
              ) : (
                creditReports.map((report) => (
                  <TableRow key={report._id} hover sx={bodyRowSx}>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <CellText variant="body2" fontWeight={600}>
                        {report.name}
                      </CellText>
                      <Typography variant="caption" color="text.secondary">
                        {report.mobile || "No mobile"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace", whiteSpace: "nowrap" }}>
                      {report.pan || "—"}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <CellText variant="body2">{creatorName(report)}</CellText>
                      {report.franchiseId?.franchiseCode ? (
                        <Link
                          component="button"
                          variant="caption"
                          underline="hover"
                          sx={{ fontWeight: 600 }}
                          onClick={() => setFranchiseCode(report.franchiseId.franchiseCode)}
                        >
                          {report.franchiseId.franchiseCode}
                        </Link>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          {report.createdByEmployee
                            ? report.createdByEmployee.roleName || "Staff"
                            : report.createdFrom || "—"}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.bureau ? report.bureau.toUpperCase() : "N/A"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <ScoreChip score={report.score || null} />
                    </TableCell>
                    <TableCell>
                      <DateCell value={report.createdAt} />
                    </TableCell>
                    <TableCell align="right">
                      {getReportUrl(report) ? (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PictureAsPdf fontSize="small" />}
                          component={Link}
                          href={getReportUrl(report)}
                          target="_blank"
                        >
                          PDF
                        </Button>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No PDF
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TableFooter
          page={page}
          rowsPerPage={rowsPerPage}
          total={totalRecords}
          onPageChange={setPage}
        />
      </SectionCard>

      <FranchiseDetailsDialog
        franchiseCode={franchiseCode}
        onClose={() => setFranchiseCode(null)}
      />
    </Box>
  );
};

export default ViewReports;
