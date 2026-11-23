import React, { useState, useEffect } from "react";
import api, { franchiseAPI } from "../../../services/api";
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
  MenuItem,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import StyleIcon from "@mui/icons-material/Style";
import BusinessIcon from "@mui/icons-material/Business";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const WORK_STATUS_LABELS = {
  newly_logged: "Newly Logged",
  in_progress: "In Progress",
  pending: "Pending",
  closed: "Closed",
};

// Every editable Business MIS field, flattened so one TextField can bind to each
const toFormData = (c) => ({
  customerName: c?.customerName || "",
  customerEmail: c?.customerEmail || "",
  customerPhone: c?.customerPhone || "",
  whatsappNumber: c?.whatsappNumber || "",
  fatherName: c?.fatherName || "",
  panNumber: c?.panNumber || "",
  aadharNumber: c?.aadharNumber || "",
  dob: c?.dob ? String(c.dob).slice(0, 10) : "",
  gender: c?.gender || "",
  language: c?.language || "",
  occupation: c?.occupation || "",
  monthlyIncome: c?.monthlyIncome ?? "",
  fullAddress: c?.fullAddress || "",
  city: c?.city || "",
  state: c?.state || "",
  pincode: c?.pincode || "",
  bankAccountNumber: c?.bankAccountNumber || "",
  ifscCode: c?.ifscCode || "",
  clientIssues: c?.clientIssues || "",
  consultantName: c?.consultant?.name || "",
  consultantPhone: c?.consultant?.phone || "",
  consultantEmail: c?.consultant?.email || "",
  franchiseId: c?.franchiseId?._id || "",
  selectedPackage: c?.selectedPackage?._id || "",
  directorName: c?.businessDetails?.directorName || "",
  gstUsername: c?.businessDetails?.gstUsername || "",
  gstNumber: c?.businessDetails?.gstNumber || "",
  companyType: c?.businessDetails?.companyType || "",
  companyPanNumber: c?.businessDetails?.companyPanNumber || "",
});

const DetailsTab = ({ customer, creditReport, ifscDeatails, onUpdated }) => {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [formData, setFormData] = useState(() => toFormData(customer));
  const isBusiness = customer?.customerType === "business";
  const savedValues = toFormData(customer);
  // Dropdown options for the franchise / package fields, loaded once when edit starts
  const [franchiseOptions, setFranchiseOptions] = useState([]);
  const [packageOptions, setPackageOptions] = useState([]);

  useEffect(() => {
    if (customer) {
      setFormData(toFormData(customer));
    }
  }, [customer]);

  useEffect(() => {
    if (!editMode || franchiseOptions.length) return;
    franchiseAPI
      .getfranchiseList()
      .then((res) => setFranchiseOptions(res.data?.data || []))
      .catch((err) => console.error("Failed to load franchises:", err));
    // Public list of active packages (the admin-only /all list is blocked for some staff roles)
    api
      .get("/customer-packages")
      .then((res) => setPackageOptions(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Failed to load packages:", err));
  }, [editMode]);

  const setField = (name) => (e) =>
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));

  const handleUpdate = async () => {
    setSaving(true);
    setSaveError("");
    const {
      consultantName,
      consultantPhone,
      consultantEmail,
      directorName,
      gstUsername,
      gstNumber,
      companyType,
      companyPanNumber,
      franchiseId,
      selectedPackage,
      ...fields
    } = formData;

    // Consultant applies to individual customers; business details to business customers
    const payload = {
      ...fields,
      franchiseId: franchiseId || null,
      selectedPackage: selectedPackage || null,
      ...(isBusiness
        ? {
            businessDetails: {
              directorName,
              gstUsername,
              gstNumber,
              companyType,
              companyPanNumber,
            },
          }
        : {
            consultant: {
              name: consultantName,
              phone: consultantPhone,
              email: consultantEmail,
            },
          }),
    };

    try {
      await franchiseAPI.updateCustomer(customer.customerId, payload);
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

  // One labelled field: a text box in edit mode, otherwise the read-only value
  const renderField = ({
    label,
    name,
    display,
    xs = 12,
    md = 6,
    multiline = false,
    minRows,
    select = false,
    options = [],
    type = "text",
    maxLength,
    emptyText = "-",
  }) => {
    // Read-only value comes from the saved record (nested fields like consultant.name included)
    const shown = display !== undefined ? display : savedValues[name];
    return (
      <Grid item xs={xs} md={md} key={name}>
        <Typography fontWeight="Medium">{label}</Typography>
        {editMode ? (
          select ? (
            <TextField
              select
              fullWidth
              value={formData[name]}
              onChange={setField(name)}
            >
              <MenuItem value="">
                <em>Not set</em>
              </MenuItem>
              {options.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              fullWidth
              type={type}
              multiline={multiline}
              minRows={minRows}
              value={formData[name]}
              onChange={setField(name)}
              InputLabelProps={type === "date" ? { shrink: true } : undefined}
              inputProps={maxLength ? { maxLength } : undefined}
              helperText={
                maxLength ? `${formData[name]?.length || 0}/${maxLength}` : undefined
              }
            />
          )
        ) : (
          <Typography sx={{ whiteSpace: multiline ? "pre-wrap" : "normal" }}>
            {shown || emptyText}
          </Typography>
        )}
      </Grid>
    );
  };

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
            label={WORK_STATUS_LABELS[customer?.workStatus] || "Newly Logged"}
            color={customer?.workStatus === "closed" ? "success" : "warning"}
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

        {renderField({ label: "Name", name: "customerName" })}
        {renderField({ label: "Email", name: "customerEmail", type: "email" })}
        {renderField({ label: "Phone", name: "customerPhone" })}
        {renderField({ label: "WhatsApp Number", name: "whatsappNumber" })}
        {renderField({ label: "Father's Name", name: "fatherName" })}
        {renderField({ label: "PAN Number", name: "panNumber" })}
        {renderField({ label: "Aadhaar Number", name: "aadharNumber" })}
        {renderField({
          label: "Date Of Birth",
          name: "dob",
          type: "date",
          display: customer?.dob
            ? new Date(customer.dob).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "-",
        })}
        {renderField({
          label: "Gender",
          name: "gender",
          select: true,
          options: GENDER_OPTIONS,
        })}
        {renderField({ label: "Language", name: "language" })}
        {renderField({ label: "Occupation", name: "occupation" })}
      </Grid>

      {/* ================= BUSINESS DETAILS (business customers only) ================= */}

      {isBusiness && (
        <>
          {renderSectionTitle("Business Details", <BusinessIcon color="primary" />)}

          <Grid container spacing={3}>
            {renderField({ label: "Director Name", name: "directorName" })}
            {renderField({ label: "GST Username", name: "gstUsername" })}
            {renderField({ label: "GST Number", name: "gstNumber" })}
            {renderField({ label: "Company Type", name: "companyType" })}
            {renderField({ label: "Company PAN Number", name: "companyPanNumber" })}
          </Grid>
        </>
      )}

      {/* ================= ADDRESS DETAILS ================= */}

      {renderSectionTitle("Address Details", <HomeIcon color="primary" />)}

      <Grid container spacing={3}>
        {renderField({
          label: "Full Address",
          name: "fullAddress",
          xs: 12,
          multiline: true,
          minRows: 2,
        })}
        {renderField({ label: "City", name: "city", xs: 12, md: 4 })}
        {renderField({ label: "State", name: "state", xs: 12, md: 4 })}
        {renderField({ label: "Pincode", name: "pincode", xs: 12, md: 4 })}
      </Grid>

      {/* ================= FINANCIAL DETAILS ================= */}

      {renderSectionTitle(
        "Financial Details",
        <LocalAtmIcon color="primary" />,
      )}

      <Grid container spacing={3}>
        {renderField({
          label: "Monthly Income",
          name: "monthlyIncome",
          type: "number",
          display: customer?.monthlyIncome ? `₹ ${customer.monthlyIncome}` : "-",
        })}

        <Grid item xs={12} md={6}>
          <Typography fontWeight="Medium">Credit Score</Typography>

          <Typography>{creditReport}</Typography>
        </Grid>

        {renderField({ label: "Bank Account Number", name: "bankAccountNumber" })}
        {renderField({ label: "IFSC Code", name: "ifscCode" })}
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
          <Typography fontWeight="Medium">Selected Package</Typography>
          {editMode ? (
            <TextField
              select
              fullWidth
              value={formData.selectedPackage}
              onChange={setField("selectedPackage")}
            >
              <MenuItem value="">
                <em>No package</em>
              </MenuItem>
              {packageOptions.map((pkg) => (
                <MenuItem key={pkg._id} value={pkg._id}>
                  {pkg.name}
                  {pkg.totalPrice ? ` (₹${pkg.totalPrice})` : ""}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <Typography>{customer?.selectedPackage?.name || "-"}</Typography>
          )}
        </Grid>
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
            {editMode && (
              <>
                {renderSectionTitle("Franchise Details", <DomainAddIcon color="primary" />)}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography fontWeight="medium">Franchise</Typography>
                    <TextField
                      select
                      fullWidth
                      value={formData.franchiseId}
                      onChange={setField("franchiseId")}
                    >
                      <MenuItem value="">
                        <em>No franchise (direct)</em>
                      </MenuItem>
                      {franchiseOptions.map((f) => (
                        <MenuItem key={f._id} value={f._id}>
                          {f.businessName}
                          {f.franchiseCode ? ` (${f.franchiseCode})` : ""}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </>
            )}

            {showFranchise && !editMode && (
              <>
                {renderSectionTitle("Franchise Details", <DomainAddIcon color="primary" />)}
                <Grid container spacing={3}>
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
                </Grid>
              </>
            )}

            {/* Consultant referral is for individual customers; always editable there */}
            {!isBusiness && (
              <>
                {renderSectionTitle("Consultant Details", <DomainAddIcon color="primary" />)}
                <Grid container spacing={3}>
                  {renderField({ label: "Consultant Name", name: "consultantName", md: 4 })}
                  {renderField({ label: "Consultant Number", name: "consultantPhone", md: 4 })}
                  {renderField({ label: "Consultant Email", name: "consultantEmail", md: 4 })}
                </Grid>
              </>
            )}
          </>
        );
      })()}

      {/* ================= CLIENT ISSUES ================= */}

      {renderSectionTitle(
        "Client Issues",
        <ReportProblemOutlinedIcon color="primary" />,
      )}

      {editMode ? (
        <TextField
          fullWidth
          multiline
          minRows={3}
          value={formData.clientIssues}
          onChange={setField("clientIssues")}
          inputProps={{ maxLength: 1000 }}
          helperText={`${formData.clientIssues.length}/1000 · What the client is facing and wants help with`}
        />
      ) : (
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
      )}
    </Paper>
  );
};

export default DetailsTab;
