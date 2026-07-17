import React, { useState, useEffect } from "react";
import { franchiseAPI } from "../../../services/api";
import {
  Grid,
  Typography,
  Paper,
  Divider,
  Chip,
  Box,
  Button,
  TextField,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import StyleIcon from "@mui/icons-material/Style";

const DetailsTab = ({ customer, creditReport, ifscDeatails }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    customerName: customer?.customerName || "",
    customerEmail: customer?.customerEmail || "",
    customerPhone: customer?.customerPhone || "",
    panNumber: customer?.panNumber || "",
    aadharNumber: customer?.aadharNumber || "",
    dob: customer?.dob || "",
    gender: customer?.gender || "",
  });
  useEffect(() => {
    if (customer) {
      setFormData({
        customerName: customer.customerName || "",
        customerEmail: customer.customerEmail || "",
        customerPhone: customer.customerPhone || "",
        panNumber: customer.panNumber || "",
        aadharNumber: customer.aadharNumber || "",
        dob: customer.dob || "",
        gender: customer.gender || "",
      });
    }
  }, [customer]);
  const handleUpdate = async () => {
    try {
      const res = await franchiseAPI.updateCustomer(
        customer.customerId,
        formData,
      );

      console.log(res);
      setEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };
  const renderSectionTitle = (title, icon) => (
    <Box mt={4} mb={2}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {icon}

        <Typography variant="h6" fontWeight="bold" color="primary">
          {title}
        </Typography>
      </Box>

      <Divider sx={{ mt: 1 }} />
    </Box>
  );

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
      }}
    >
      {/* HEADER */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Customer Details
        </Typography>

        <Box display="flex" gap={2}>
          <Chip
            label={customer?.workStatus || "Working"}
            color={customer?.workStatus === "Closed" ? "success" : "warning"}
          />

          {!editMode ? (
            <Button variant="contained" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleUpdate}>
              Update
            </Button>
          )}
        </Box>
      </Box>

      {/* ================= PERSONAL DETAILS ================= */}

      {renderSectionTitle(
        "Personal Details",
        <AccountCircleIcon color="primary" />,
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Customer ID</Typography>
          <Typography>{customer?.customerId || "-"}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Name</Typography>
          {editMode ? (
            <TextField
              fullWidth
              value={formData.customerName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customerName: e.target.value,
                })
              }
            />
          ) : (
            <Typography>{customer?.customerName || "-"}</Typography>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Email</Typography>
          {editMode ? (
            <TextField
              fullWidth
              value={formData.customerEmail}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customerEmail: e.target.value,
                })
              }
            />
          ) : (
            <Typography>{customer?.customerEmail || "-"}</Typography>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Phone</Typography>
          {editMode ? (
            <TextField
              fullWidth
              value={formData.customerPhone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customerPhone: e.target.value,
                })
              }
            />
          ) : (
            <Typography>{customer?.customerPhone || "-"}</Typography>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">PAN Number</Typography>
          {editMode ? (
            <TextField
              fullWidth
              value={formData.panNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  panNumber: e.target.value,
                })
              }
            />
          ) : (
            <Typography>{customer?.panNumber || "-"}</Typography>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Aadhaar Number</Typography>
          {editMode ? (
            <TextField
              fullWidth
              value={formData.aadharNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  aadharNumber: e.target.value,
                })
              }
            />
          ) : (
            <Typography>{customer?.aadharNumber || "-"}</Typography>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Date Of Birth</Typography>

          <Typography>
            {customer?.dob
              ? new Date(customer.dob).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "-"}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Gender</Typography>
          <Typography>{customer?.gender || "-"}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Language</Typography>
          <Typography>{customer?.language || "-"}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Occupation</Typography>
          <Typography>{customer?.occupation || "-"}</Typography>
        </Grid>
      </Grid>

      {/* ================= ADDRESS DETAILS ================= */}

      {renderSectionTitle("Address Details", <HomeIcon color="primary" />)}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography fontWeight="Medium">Full Address</Typography>
          <Typography>{customer?.fullAddress || "-"}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography fontWeight="Medium">State</Typography>
          <Typography>{customer?.state || "-"}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography fontWeight="Medium">Pincode</Typography>
          <Typography>{customer?.pincode || "-"}</Typography>
        </Grid>
      </Grid>

      {/* ================= FINANCIAL DETAILS ================= */}

      {renderSectionTitle(
        "Financial Details",
        <LocalAtmIcon color="primary" />,
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Monthly Income</Typography>
          <Typography>₹ {customer?.monthlyIncome || "-"}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Credit Score</Typography>

          <Typography>{creditReport}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Bank Account Number</Typography>
          <Typography>{customer?.bankAccountNumber || "-"}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">IFSC Code</Typography>
          <Typography>{customer?.ifscCode || "-"}</Typography>
        </Grid>
        {ifscDeatails && (
          <>
            <Grid item xs={12} md={6}>
              <Typography fontWeight="Medium">Bank Name</Typography>
              <Typography>{ifscDeatails.bank_name || "-"}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography fontWeight="Medium">Branch</Typography>
              <Typography>{ifscDeatails.branch || "-"}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight="Medium">Banch Address</Typography>
              <Typography>{ifscDeatails?.address || "-"}</Typography>
              <Typography>{ifscDeatails?.city || "-"}</Typography>
              <Typography>{ifscDeatails?.state || "-"}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography fontWeight="Medium">City</Typography>
              <Typography>{ifscDeatails?.city || "-"}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography fontWeight="Medium">State</Typography>
              <Typography>{ifscDeatails?.state || "-"}</Typography>
            </Grid>
          </>
        )}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Payment Status</Typography>
          <Typography>{customer?.paymentStatus || "-"}</Typography>
        </Grid>
      </Grid>

      {/* ================= PACKAGE DETAILS ================= */}

      {renderSectionTitle("Package Details", <StyleIcon color="primary" />)}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Selected Package Price</Typography>
          <Typography>
            {customer?.selectedPackage?.totalPrice || "-"}
          </Typography>
        </Grid>
      </Grid>

      {/* ================= FRANCHISE DETAILS ================= */}

      {renderSectionTitle(
        "Franchise Details",
        <DomainAddIcon color="primary" />,
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Business Name</Typography>

          <Typography>{customer?.franchiseId?.businessName || "-"}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography fontWeight="medium">Phone No.</Typography>
          <Typography>{customer?.franchiseId?.phone || "-"}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DetailsTab;
