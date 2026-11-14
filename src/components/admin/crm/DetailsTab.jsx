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
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import StyleIcon from "@mui/icons-material/Style";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

const toFormData = (c) => ({
  customerName: c?.customerName || "",
  customerEmail: c?.customerEmail || "",
  customerPhone: c?.customerPhone || "",
  panNumber: c?.panNumber || "",
  aadharNumber: c?.aadharNumber || "",
  dob: c?.dob || "",
  gender: c?.gender || "",
  fullAddress: c?.fullAddress || "",
  city: c?.city || "",
  state: c?.state || "",
  pincode: c?.pincode || "",
});

const DetailsTab = ({ customer, creditReport, ifscDeatails, onUpdated }) => {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [formData, setFormData] = useState(() => toFormData(customer));
  useEffect(() => {
    if (customer) {
      setFormData(toFormData(customer));
    }
  }, [customer]);
  const handleUpdate = async () => {
    setSaving(true);
    setSaveError("");
    try {
      await franchiseAPI.updateCustomer(customer.customerId, formData);
      setEditMode(false);
      // Re-fetch so the view shows the saved values
      if (onUpdated) await onUpdated();
    } catch (error) {
      setSaveError(
        error?.response?.data?.message || "Failed to update customer details.",
      );
    } finally {
      setSaving(false);
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
            <>
              <Button
                variant="outlined"
                disabled={saving}
                onClick={() => {
                  setFormData(toFormData(customer));
                  setSaveError("");
                  setEditMode(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                disabled={saving}
                onClick={handleUpdate}
              >
                {saving ? "Saving..." : "Update"}
              </Button>
            </>
          )}
        </Box>
      </Box>

      {saveError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {saveError}
        </Typography>
      )}

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
          {editMode ? (
            <TextField
              fullWidth
              multiline
              minRows={2}
              value={formData.fullAddress}
              onChange={(e) =>
                setFormData({ ...formData, fullAddress: e.target.value })
              }
            />
          ) : (
            <Typography>{customer?.fullAddress || "-"}</Typography>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography fontWeight="Medium">City</Typography>
          {editMode ? (
            <TextField
              fullWidth
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          ) : (
            <Typography>{customer?.city || "-"}</Typography>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography fontWeight="Medium">State</Typography>
          {editMode ? (
            <TextField
              fullWidth
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          ) : (
            <Typography>{customer?.state || "-"}</Typography>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography fontWeight="Medium">Pincode</Typography>
          {editMode ? (
            <TextField
              fullWidth
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            />
          ) : (
            <Typography>{customer?.pincode || "-"}</Typography>
          )}
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

      {/* Franchise shown when linked; consultant shown when entered; N/A when neither */}
      {(() => {
        const hasFranchise = Boolean(customer?.franchiseId?._id || customer?.franchiseId?.franchiseCode);
        const consultant = customer?.consultant || {};
        const hasConsultant = Boolean(consultant.name || consultant.phone || consultant.email);
        const showFranchise = hasFranchise || !hasConsultant;

        return (
          <>
            {renderSectionTitle(
              showFranchise ? "Franchise Details" : "Consultant Details",
              <DomainAddIcon color="primary" />,
            )}

            <Grid container spacing={3}>
              {showFranchise && (
                <>
                  <Grid item xs={12} md={6}>
                    <Typography fontWeight="medium">Franchise ID</Typography>
                    {customer?.franchiseId?.franchiseCode ? (
                      <Link component={RouterLink} to={`/admin/franchise/${customer.franchiseId.franchiseCode}`}>
                        {customer.franchiseId.franchiseCode}
                      </Link>
                    ) : (
                      <Typography>N/A</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography fontWeight="Medium">Business Name</Typography>

                    {customer?.franchiseId?._id ? (
                      <Link
                        component={RouterLink}
                        to={`/admin/franchise/${customer.franchiseId.franchiseCode || customer.franchiseId._id}`}
                      >
                        {customer.franchiseId.businessName || "N/A"}
                      </Link>
                    ) : (
                      <Typography>{customer?.franchiseId?.businessName || "N/A"}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography fontWeight="medium">Phone No.</Typography>
                    <Typography>{customer?.franchiseId?.phone || "N/A"}</Typography>
                  </Grid>
                </>
              )}

              {hasConsultant && (
                <>
                  <Grid item xs={12} md={6}>
                    <Typography fontWeight="medium">Consultant Name</Typography>
                    <Typography>{consultant.name || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography fontWeight="medium">Consultant Number</Typography>
                    <Typography>{consultant.phone || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography fontWeight="medium">Consultant Email</Typography>
                    <Typography>{consultant.email || "-"}</Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </>
        );
      })()}

      {/* ================= CLIENT ISSUES ================= */}

      {renderSectionTitle(
        "Client Issues",
        <ReportProblemOutlinedIcon color="primary" />,
      )}

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: "#fafafa",
          border: "1px solid",
          borderColor: "divider",
          minHeight: 64,
        }}
      >
        <Typography
          sx={{ whiteSpace: "pre-wrap", color: customer?.clientIssues ? "text.primary" : "text.disabled" }}
        >
          {customer?.clientIssues || "No issues recorded by the client"}
        </Typography>
      </Box>
    </Paper>
  );
};

export default DetailsTab;
