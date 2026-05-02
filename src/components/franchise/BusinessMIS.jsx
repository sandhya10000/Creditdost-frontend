import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { franchiseAPI } from "../../services/api";

const BusinessMIS = () => {
  const [businessForms, setBusinessForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch business forms on component mount
  useEffect(() => {
    fetchBusinessForms();
  }, []);

  const fetchBusinessForms = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await franchiseAPI.getBusinessForms();
      console.log(response, "business mis data");
      setBusinessForms(response.data);
    } catch (err) {
      setError("Failed to fetch business forms. Please try again later.");
      console.error("Error fetching business forms:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getPaymentStatusChip = (status) => {
    const statusConfig = {
      pending: { label: "Pending", color: "warning" },
      paid: { label: "Paid", color: "success" },
      failed: { label: "Failed", color: "error" },
    };

    const config = statusConfig[status] || { label: status, color: "default" };

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const getWorkStatusChip = (status) => {
    switch (status) {
      case "Closed":
        return <Chip label="Closed" color="success" />;
      default:
        return <Chip label="In Progress" color="warning" />;
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredBusinessForms = businessForms.filter((form) => {
    const name = form.customerName?.toLowerCase() || "";
    const email = form.customerEmail?.toLowerCase() || "";
    const phone = String(form.customerPhone || "");

    return (
      name.includes(normalizedSearch) ||
      email.includes(normalizedSearch) ||
      phone.includes(normalizedSearch)
    );
  });

  //Download bussiness mis users data function
  const handleDownloadCSV = () => {
    const headers = [
      "Customer ID",
      "Customer Name",
      "Email",
      "Phone",
      "Package",
      "Amount",
      "Payment Status",
      "Date",
      "Work Status",
    ];

    const rows = filteredBusinessForms.map((form) => [
      `CUST-${form._id.slice(-6).toUpperCase()}`,
      form.customerName || "",
      form.customerEmail || "",
      form.customerPhone || "",
      form.selectedPackage?.name || "N/A",
      form.selectedPackage?.price || "N/A",
      form.paymentStatus || "",
      formatDate(form.createdAt),
      form.workStatus || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const encodedUri =
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);

    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "business_mis.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Business MIS
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          {/* Search + Download */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search by customer name, email, or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ maxWidth: 400 }}
            />

            <Button
              variant="contained"
              color="success"
              onClick={handleDownloadCSV}
            >
              Download CSV
            </Button>
          </Box>

          {loading && businessForms.length === 0 ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer ID</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Package</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Work Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredBusinessForms.map((form) => (
                    <TableRow key={form._id}>
                      <TableCell>
                        CUST-{form._id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell>{form.customerName}</TableCell>
                      <TableCell>{form.customerEmail}</TableCell>
                      <TableCell>{form.customerPhone}</TableCell>
                      <TableCell>
                        {form.selectedPackage?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        ₹{form.selectedPackage?.price || "N/A"}
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusChip(form.paymentStatus)}
                      </TableCell>
                      <TableCell>{formatDate(form.createdAt)}</TableCell>
                      <TableCell>
                        {getWorkStatusChip(form.workStatus)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BusinessMIS;
