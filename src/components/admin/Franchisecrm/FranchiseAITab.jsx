import React from "react";
import {
  Paper,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Chip,
  Box,
  TableContainer,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const FranchiseAITab = ({ aireports = [] }) => {
  const getAnalysisUrl = (report) => {
    const baseUrl = import.meta.env.VITE_REACT_APP_API_URL
      ? import.meta.env.VITE_REACT_APP_API_URL.replace("/api", "")
      : "http://localhost:5000";

    return `${baseUrl}/api/ai-analysis/admin/download-analysis/${report._id}`;
  };
  return (
    <Paper sx={{ p: 3 }}>
      <Box mb={2}>
        <Chip color="primary" label={`Total AI Reports: ${aireports.length}`} />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight="medium">Report Name</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight="medium">Franchise</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight="medium">Status</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight="medium">Analysis Status</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight="medium">Uploaded Date</Typography>
              </TableCell>

              <TableCell align="center">
                <Typography fontWeight="medium">Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {aireports.length > 0 ? (
              aireports.map((report) => (
                <TableRow key={report._id} hover>
                  <TableCell>{report.uploadedDocumentName}</TableCell>

                  <TableCell>{report.franchiseName}</TableCell>

                  <TableCell>
                    <Chip label={report.status} color="warning" size="small" />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={report.claudeAnalysisStatus}
                      color={
                        report.claudeAnalysisStatus === "email_sent"
                          ? "success"
                          : "warning"
                      }
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    {new Date(report.uploadedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() =>
                        window.open(getAnalysisUrl(report), "_blank")
                      }
                    >
                      View Analysis
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No AI Reports Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default FranchiseAITab;
