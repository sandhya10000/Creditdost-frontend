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
import { adminAPI } from "../../services/api";
//import { useNavigate } from "react-router-dom";

const BusinessForms = ({ status = "paid" }) => {
  const [businessForms, setBusinessForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  //const navigate = useNavigate();

  // Fetch all business forms on component mount
  useEffect(() => {
    fetchBusinessForms();
  }, []);

  const fetchBusinessForms = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminAPI.getAllBusinessForms();
      console.log("fetch all documents with details----", response);
      setBusinessForms(response.data);
    } catch (err) {
      setError("Failed to fetch business forms. Please try again later.");
      console.error("Error fetching business forms:", err);
    } finally {
      setLoading(false);
    }
  };
  //function for case close update from admin api
  const closeCase = async (id) => {
    try {
      setLoading(true);
      setError("");
      const response = await adminAPI.closeBusinessCase(id);
      alert(response.message || "Case Closed Successfully");
      // Refress update list
      fetchBusinessForms();
    } catch (err) {
      setError("Failed to close case. Please try again later.");
      console.error("Error closing case:", err);
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

  const filteredBusinessForms = businessForms.filter(
    (form) =>
      form.paymentStatus === status &&
      (form.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.customerPhone?.includes(searchTerm) ||
        (form.franchiseId?.businessName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())),
  );

  console.log(filteredBusinessForms, "filteredBusinessForms----------------"); //Download bussiness mis users data function
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
      form.customerId,
      form.customerName || "",
      form.customerEmail || "",
      form.customerPhone || "",
      form.selectedPackage?.name || "N/A",
      form.manualAmount || form.selectedPackage?.price || "N/A",
      form.manualAmount || "N/A",
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

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
    ? import.meta.env.VITE_REACT_APP_API_URL.replace("/api", "")
    : "https://reactbackend.creditdost.co.in";

  //Windows backslash problem fix (\\ → /)
  // const getFileUrl = (path) => {
  //   if (!path) return "";

  //   return `${API_URL}/${path.replace(/\\/g, "/")}`;
  // };
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {status === "pending" ? "Business MIS Pending" : "Business MIS"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by customer name, email, phone, or franchise"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ maxWidth: 400 }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleDownloadCSV}
              sx={{ color: "#fff" }}
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
              <Table sx={{ minWidth: 650 }} aria-label="business forms table">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer ID</TableCell>

                    <TableCell>Customer Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Franchise</TableCell>
                    <TableCell>Package</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Document</TableCell>

                    <TableCell>Date</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBusinessForms.map((form) => (
                    <TableRow
                      key={form._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          color: "blue",
                          fontWeight: "bold",
                        }}
                      >
                        <a href={`customer/${form.customerId}`}>
                          {form.customerId}
                        </a>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {form.customerName}
                      </TableCell>
                      <TableCell>{form.customerEmail}</TableCell>
                      <TableCell>{form.customerPhone}</TableCell>
                      <TableCell>
                        {form.franchiseId?.businessName || "N/A"}
                      </TableCell>
                      <TableCell>
                        {form.selectedPackage?.name || "N/A"}
                      </TableCell>
                      {/* <TableCell>
                        ₹{form.selectedPackage?.price || "N/A"}
                      </TableCell> */}
                      <TableCell>
                        ₹
                        {form.manualAmount
                          ? form.manualAmount
                          : form.selectedPackage?.price || "N/A"}
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusChip(form.paymentStatus)}
                      </TableCell>
                      <TableCell>{form.createdByRole || "franchise"}</TableCell>
                      {/* <TableCell>
                        {form.documents?.panCard && (
                          <a
                            href={getFileUrl(form.documents.panCard)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            PAN
                          </a>
                        )}

                        <br />

                        {form.documents?.aadharFront && (
                          <a
                            href={getFileUrl(form.documents.aadharFront)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Aadhaar Front
                          </a>
                        )}

                        <br />

                        {form.documents?.aadharBack && (
                          <a
                            href={getFileUrl(form.documents.aadharBack)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Aadhaar Back
                          </a>
                        )}

                        <br />

                        {form.documents?.cancelCheque && (
                          <a
                            href={getFileUrl(form.documents.cancelCheque)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Cancel Cheque
                          </a>
                        )}

                        <br />

                        {form.documents?.bankProof && (
                          <a
                            href={getFileUrl(form.documents.bankProof)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Bank Proof
                          </a>
                        )}
                        <br />
                        {form.documents?.extraBankDoc && (
                          <a
                            href={getFileUrl(form.documents.extraBankDoc)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Extra Bank Proof
                          </a>
                        )}
                      </TableCell> */}
                      <TableCell>
                        {Object.values(form.documents || {}).some(Boolean)
                          ? "Yes"
                          : "No"}
                      </TableCell>
                      <TableCell>{formatDate(form.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => closeCase(form._id)}
                        >
                          Close Case
                        </Button>
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

export default BusinessForms;
