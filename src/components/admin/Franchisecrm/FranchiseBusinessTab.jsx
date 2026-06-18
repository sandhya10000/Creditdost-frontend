import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  Box,
} from "@mui/material";

const FranchiseBusinessTab = ({ businessForms = [] }) => {
  const totalBusinessAmount = businessForms.reduce(
    (sum, item) => sum + (Number(item.manualAmount) || 0),
    0,
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Typography variant="h6" fontWeight="bold">
          Business Activity
        </Typography>

        <Box display="flex" gap={2}>
          <Chip
            label={`Total Businesses: ${businessForms.length}`}
            color="primary"
          />

          <Chip
            label={`Business Done: ₹${totalBusinessAmount.toLocaleString(
              "en-IN",
            )}`}
            color="success"
          />
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Customer ID</strong>
              </TableCell>
              <TableCell>
                <strong>Customer Name</strong>
              </TableCell>

              <TableCell>
                <strong>Package</strong>
              </TableCell>

              <TableCell>
                <strong>Amount</strong>
              </TableCell>

              <TableCell>
                <strong>Status</strong>
              </TableCell>

              <TableCell>
                <strong>Created At</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {businessForms.length > 0 ? (
              businessForms.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.customerId || "-"}</TableCell>

                  <TableCell>{item.customerName || "-"}</TableCell>

                  <TableCell>
                    {item.selectedPackage?.name || "Direct Entry"}
                  </TableCell>

                  <TableCell>
                    ₹ {(item.manualAmount || 0).toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={item.paymentStatus || "Pending"}
                      size="small"
                      color={
                        item.paymentStatus === "approved"
                          ? "success"
                          : item.paymentStatus === "rejected"
                            ? "error"
                            : "warning"
                      }
                    />
                  </TableCell>

                  <TableCell>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-IN")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No business records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default FranchiseBusinessTab;
