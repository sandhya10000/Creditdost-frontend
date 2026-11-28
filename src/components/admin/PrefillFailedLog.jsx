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
  Chip,
} from "@mui/material";

import { franchiseAPI } from "../../services/api";
import {
  CellText,
  DateCell,
  EmptyRow,
  LoadingBar,
  SectionCard,
  SectionHeader,
  TableFooter,
} from "./ui/AdminTable";
import { bodyRowSx, headRowSx } from "./ui/tableStyles";

// Credit-report failures carry their bureau; everything else is a prefill lookup
const TypeChip = ({ log }) =>
  log.source === "credit-report" ? (
    <Chip
      size="small"
      color="primary"
      variant="outlined"
      label={`Credit · ${(log.bureau || "").toUpperCase()}`}
    />
  ) : (
    <Chip size="small" variant="outlined" label="Prefill" />
  );

const PrefillFailedLog = ({ embedded = false }) => {
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

  return (
    <Box p={embedded ? 0 : 3}>
      {!embedded && (
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Prefill Failed Logs
        </Typography>
      )}

      <SectionCard>
        <SectionHeader
          title="Failed attempts"
          subtitle="Prefill lookups and credit report pulls that returned an error."
        />
        <LoadingBar loading={loading} />

        <TableContainer>
          <Table size="small" sx={{ minWidth: 1000 }} aria-label="prefill failed logs table">
            <TableHead>
              <TableRow sx={headRowSx}>
                <TableCell>Date</TableCell>
                <TableCell>Partner ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>PAN</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {logs.length === 0 ? (
                <EmptyRow
                  colSpan={6}
                  loading={loading}
                  title="No failed attempts"
                  hint="Prefill and credit report errors will be listed here."
                />
              ) : (
                logs.map((log) => (
                  <TableRow key={log._id} hover sx={bodyRowSx}>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <DateCell value={log.createdAt} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        {log.franchiseId?.franchiseCode || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TypeChip log={log} />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <CellText variant="body2">{log.name || log.customerName || "—"}</CellText>
                      <Typography variant="caption" color="text.secondary">
                        {log.mobile || "No mobile"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace", whiteSpace: "nowrap" }}>
                      {log.pan || "—"}
                    </TableCell>
                    <TableCell sx={{ minWidth: 260 }}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                        {log.statusCode && (
                          <Chip
                            label={log.statusCode}
                            size="small"
                            color="error"
                            variant="outlined"
                            sx={{ flexShrink: 0 }}
                          />
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {log.message || "—"}
                        </Typography>
                      </Box>
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
    </Box>
  );
};

export default PrefillFailedLog;
