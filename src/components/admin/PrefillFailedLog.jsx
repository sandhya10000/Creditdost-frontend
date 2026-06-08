import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Pagination,
} from "@mui/material";

import { franchiseAPI } from "../../services/api";

const PrefillFailedLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  const fetchPrefillLogs = async () => {
    try {
      setLoading(true);

      const response = await franchiseAPI.getPrefillFailedLog({
        page: page,
        limit: rowsPerPage,
      });

      setLogs(response.data.reports || []);
      setTotalRecords(response.data.total || 0);
      console.log(response, "prefill failed logs----");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrefillLogs();
  }, [page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Prefill Failed Logs
      </Typography>

      <Paper elevation={3}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={5}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Mobile</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Message</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Franchise</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log._id}>
                      <TableCell>{log.mobile}</TableCell>

                      <TableCell>{log.message}</TableCell>

                      <TableCell>{log.userId?.name}</TableCell>

                      <TableCell>
                        {new Date(log.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        <br />
                        <span style={{ color: "#666", fontSize: "12px" }}>
                          {new Date(log.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No Logs Found
                    </TableCell>
                  </TableRow>
                )}
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
        )}
      </Paper>
    </Box>
  );
};

export default PrefillFailedLog;
