import React from "react";
import {
  Grid,
  Typography,
  Paper,
  Divider,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";

const DetailsTab = ({ customer }) => {
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

        <Chip
          label={customer?.workStatus || "Working"}
          color={customer?.workStatus === "Closed" ? "success" : "warning"}
        />
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        {/* CUSTOMER ID */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">Customer ID</Typography>

          <Typography>{customer?.customerId || "-"}</Typography>
        </Grid>

        {/* CUSTOMER NAME */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">Customer Name</Typography>

          <Typography>{customer?.customerName || "-"}</Typography>
        </Grid>

        {/* EMAIL */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">Email</Typography>

          <Typography>{customer?.customerEmail || "-"}</Typography>
        </Grid>

        {/* PHONE */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">Phone</Typography>

          <Typography>{customer?.customerPhone || "-"}</Typography>
        </Grid>

        {/* PAN */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">PAN Number</Typography>

          <Typography>{customer?.panNumber || "-"}</Typography>
        </Grid>

        {/* AADHAAR */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">Aadhaar Number</Typography>

          <Typography>{customer?.aadharNumber || "-"}</Typography>
        </Grid>

        {/* DOB */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">Date Of Birth</Typography>

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

        {/* GENDER */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">Gender</Typography>

          <Typography>{customer?.gender || "-"}</Typography>
        </Grid>

        {/* CITY */}

        <Grid item xs={12} md={4}>
          <Typography fontWeight="bold">City</Typography>

          <Typography>{customer?.city || "-"}</Typography>
        </Grid>

        {/* STATE */}

        <Grid item xs={12} md={4}>
          <Typography fontWeight="bold">State</Typography>

          <Typography>{customer?.state || "-"}</Typography>
        </Grid>

        {/* PINCODE */}

        <Grid item xs={12} md={4}>
          <Typography fontWeight="bold">Pincode</Typography>

          <Typography>{customer?.pincode || "-"}</Typography>
        </Grid>

        {/* LANGUAGE */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">Language</Typography>

          <Typography>{customer?.language || "-"}</Typography>
        </Grid>

        {/* OCCUPATION */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">Occupation</Typography>

          <Typography>{customer?.occupation || "-"}</Typography>
        </Grid>

        {/* MONTHLY INCOME */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">Monthly Income</Typography>

          <Typography>₹ {customer?.monthlyIncome || "-"}</Typography>
        </Grid>

        {/* CREDIT SCORE */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">Credit Score</Typography>

          <Typography>{customer?.creditScore || "-"}</Typography>
        </Grid>

        {/* ADDRESS */}

        <Grid item xs={12}>
          <Typography fontWeight="bold">Full Address</Typography>

          <Typography>{customer?.fullAddress || "-"}</Typography>
        </Grid>

        {/* BANK ACCOUNT */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">Bank Account Number</Typography>

          <Typography>{customer?.bankAccountNumber || "-"}</Typography>
        </Grid>

        {/* IFSC */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">IFSC Code</Typography>

          <Typography>{customer?.ifscCode || "-"}</Typography>
        </Grid>

        {/* PAYMENT STATUS */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">Payment Status</Typography>

          <Typography>{customer?.paymentStatus || "-"}</Typography>
        </Grid>

        {/* PACKAGE */}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">Selected Package</Typography>

          <Typography>{customer?.selectedPackage?.name || "-"}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DetailsTab;
