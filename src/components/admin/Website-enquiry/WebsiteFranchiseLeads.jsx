import React, { useEffect, useState } from "react";
import { Alert, Typography } from "@mui/material";
import LeadsTablePage from "./LeadsTablePage";
import { adminAPI } from "../../../services/api";

const STATUSES = ["New", "Contacted", "Interested", "Not Interested"];

const STATUS_COLORS = {
  New: "error",
  Contacted: "warning",
  Interested: "success",
  "Not Interested": "default",
};

const COLUMNS = [
  { key: "fullName", label: "Full Name" },
  {
    key: "contact",
    label: "Contact",
    render: (row) => (
      <>
        <Typography variant="body2">{row.mobileNumber}</Typography>
        <Typography variant="caption" color="textSecondary">
          {row.email}
        </Typography>
      </>
    ),
  },
  { key: "location", label: "Location", render: (row) => `${row.city}, ${row.state}` },
  { key: "profession", label: "Profession" },
];

const DETAIL_FIELDS = [
  { key: "fullName", label: "Full Name" },
  { key: "mobileNumber", label: "Mobile Number" },
  { key: "email", label: "Email ID" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "profession", label: "Profession" },
  { key: "message", label: "Message" },
];

const WebsiteFranchiseLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminAPI.getFranchiseLeads();
      setLeads(response.data.leads || []);
    } catch (err) {
      console.error("Failed to fetch franchise leads:", err);
      setError("Failed to fetch franchise leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await adminAPI.updateFranchiseLeadStatus(id, status);
      setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  if (loading) return null;

  return (
    <LeadsTablePage
      title="Website Franchise Leads"
      initialRows={leads}
      statuses={STATUSES}
      statusColors={STATUS_COLORS}
      columns={COLUMNS}
      detailFields={DETAIL_FIELDS}
      searchKeys={["fullName", "mobileNumber", "email", "city", "state"]}
      csvFileName="Website_Franchise_Leads"
      onStatusChange={handleStatusChange}
    />
  );
};

export default WebsiteFranchiseLeads;
