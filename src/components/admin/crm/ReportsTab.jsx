import React from "react";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Box,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
const ReportsTab = ({ customerReport }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      {/* Header */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight="bold">
          Credit Report Details
        </Typography>

        {/* <Chip
          label={customerReport?.bureau?.toUpperCase() || "N/A"}
          color="primary"
        /> */}
      </Box>

      {/* Table */}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight="Medium">PAN Card</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight="Medium">Bureau</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight="Medium">Credit Score</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight="Medium">Date</Typography>
              </TableCell>

              <TableCell align="center">
                <Typography fontWeight="Medium">Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customerReport?.map((report, index) => (
              <TableRow hover key={index}>
                <TableCell>{report?.pan || "-"}</TableCell>

                <TableCell>{report?.bureau.toUpperCase() || "-"}</TableCell>

                <TableCell>
                  <Chip
                    label={report?.score || "-"}
                    color={
                      Number(report?.score) >= 750
                        ? "success"
                        : Number(report?.score) >= 650
                          ? "warning"
                          : "error"
                    }
                    variant="outlined"
                  />
                </TableCell>

                <TableCell>
                  {report?.createdAt
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
                    disabled={!report?.reportUrl}
                    onClick={() => window.open(report?.reportUrl, "_blank")}
                  >
                    View Report
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ReportsTab;
