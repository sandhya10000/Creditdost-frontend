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
  Chip,
} from "@mui/material";

import { franchiseAPI } from "../../services/api";

const formatDateTime = (value) => {
  const d = new Date(value);
  const date = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
};

const getType = (log) => {
  if (log.source === "credit-report") {
    return `Credit · ${(log.bureau || "").toUpperCase()}`;
  }
  return "Prefill";
};

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

  const headers = [
    "Date & Time",
    "Partner ID",
    "Type",
    "Name",
    "Phone",
    "PAN",
    "Reason",
  ];

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
                  {headers.map((h) => (
                    <TableCell key={h}>
                      <strong>{h}</strong>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => {
                    const { date, time } = formatDateTime(log.createdAt);
                    return (
                      <TableRow key={log._id}>
                        <TableCell>
                          {date}
                          <br />
                          <span style={{ color: "#666", fontSize: "12px" }}>
                            {time}
                          </span>
                        </TableCell>

                        <TableCell>
                          {log.franchiseId?.franchiseCode || "—"}
                        </TableCell>

                        <TableCell>{getType(log)}</TableCell>

                        <TableCell>
                          {log.name || log.customerName || "—"}
                        </TableCell>

                        <TableCell>{log.mobile || "—"}</TableCell>

                        <TableCell>{log.pan || "—"}</TableCell>

                        <TableCell>
                          {log.statusCode && (
                            <Chip
                              label={log.statusCode}
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                          )}
                          {log.message || "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={headers.length} align="center">
                      No Logs Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
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
              <Box />
            </Box>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default PrefillFailedLog;
