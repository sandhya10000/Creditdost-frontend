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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const FranchiseReportsTab = ({ reports = [] }) => {
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
    <Paper sx={{ p: 3 }}>
      <Box mb={2}>
        <Chip color="primary" label={`Total Reports: ${reports.length}`} />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight="medium">Customer Name</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight="medium">PAN</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight="medium">Bureau</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight="medium">Score</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight="medium">Date</Typography>
              </TableCell>

              <TableCell align="center">
                <Typography fontWeight="medium">Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <TableRow key={report._id} hover>
                  <TableCell>{report.name || "-"}</TableCell>

                  <TableCell>{report.pan || "-"}</TableCell>

                  <TableCell>{report.bureau?.toUpperCase() || "-"}</TableCell>

                  <TableCell>
                    <Chip
                      label={report.score || "-"}
                      color={
                        Number(report.score) >= 750
                          ? "success"
                          : Number(report.score) >= 650
                            ? "warning"
                            : "error"
                      }
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PictureAsPdfIcon />}
                      onClick={() =>
                        window.open(getReportUrl(report), "_blank")
                      }
                    >
                      View Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No reports found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default FranchiseReportsTab;
