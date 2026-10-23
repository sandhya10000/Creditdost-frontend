import React from "react";
import { Typography } from "@mui/material";
import LeadsTablePage from "./LeadsTablePage";

const STATUSES = ["New", "Contacted", "Converted", "Closed"];

const STATUS_COLORS = {
  New: "error",
  Contacted: "warning",
  Converted: "success",
  Closed: "default",
};

// TODO: replace MOCK_CREDIT_REPORT_LEADS with API data once the backend endpoint exists
const MOCK_CREDIT_REPORT_LEADS = [
  { name: "Rahul Sharma", phone: "9876543210", email: "rahul.sharma@gmail.com", city: "Delhi", pan: "ABCPS1234K", creditScore: "642", status: "New", daysAgo: 0 },
  { name: "Priya Verma", phone: "9812345678", email: "priya.verma@yahoo.com", city: "Lucknow", pan: "BQWPV5678L", creditScore: "711", status: "Contacted", daysAgo: 1 },
  { name: "Amit Patel", phone: "9898989898", email: "amit.patel@gmail.com", city: "Ahmedabad", pan: "CXZPP9012M", creditScore: "580", status: "New", daysAgo: 1 },
  { name: "Sneha Reddy", phone: "9700011122", email: "sneha.reddy@outlook.com", city: "Hyderabad", pan: "DLKPR3456N", creditScore: "755", status: "Converted", daysAgo: 2 },
  { name: "Vikram Singh", phone: "9811122233", email: "vikram.singh@gmail.com", city: "Jaipur", pan: "EMNPS7890P", creditScore: "", status: "Closed", daysAgo: 3 },
  { name: "Anjali Gupta", phone: "9922334455", email: "anjali.gupta@gmail.com", city: "Pune", pan: "FGHPG2345Q", creditScore: "690", status: "Contacted", daysAgo: 4 },
  { name: "Mohammed Irfan", phone: "9833445566", email: "irfan.m@gmail.com", city: "Mumbai", pan: "GHJPI6789R", creditScore: "615", status: "New", daysAgo: 5 },
  { name: "Kavita Nair", phone: "9744556677", email: "kavita.nair@gmail.com", city: "Kochi", pan: "HJKPN1234S", creditScore: "728", status: "Converted", daysAgo: 6 },
  { name: "Suresh Kumar", phone: "9655667788", email: "suresh.kumar@rediffmail.com", city: "Chennai", pan: "JKLPK5678T", creditScore: "560", status: "New", daysAgo: 7 },
  { name: "Neha Joshi", phone: "9566778899", email: "neha.joshi@gmail.com", city: "Indore", pan: "KLMPJ9012U", creditScore: "702", status: "Contacted", daysAgo: 8 },
  { name: "Arjun Mehta", phone: "9477889900", email: "arjun.mehta@gmail.com", city: "Surat", pan: "LMNPM3456V", creditScore: "668", status: "Closed", daysAgo: 10 },
  { name: "Pooja Das", phone: "9388990011", email: "pooja.das@gmail.com", city: "Kolkata", pan: "MNOPD7890W", creditScore: "735", status: "New", daysAgo: 12 },
].map((lead, i) => ({
  ...lead,
  _id: `mock-crl-${i + 1}`,
  source: "Website",
  createdAt: new Date(Date.now() - lead.daysAgo * 86400000).toISOString(),
}));

const maskPan = (pan) => (pan ? `${pan.slice(0, 2)}XXXX${pan.slice(-4)}` : "—");

const COLUMNS = [
  { key: "name", label: "Full Name" },
  {
    key: "contact",
    label: "Contact",
    render: (row) => (
      <>
        <Typography variant="body2">{row.phone}</Typography>
        <Typography variant="caption" color="textSecondary">
          {row.email}
        </Typography>
      </>
    ),
  },
  { key: "city", label: "City" },
  { key: "pan", label: "PAN", render: (row) => maskPan(row.pan) },
  { key: "creditScore", label: "Credit Score" },
  { key: "source", label: "Source" },
];

const DETAIL_FIELDS = [
  { key: "name", label: "Full Name" },
  { key: "phone", label: "Mobile Number" },
  { key: "email", label: "Email ID" },
  { key: "city", label: "City" },
  { key: "pan", label: "PAN Number", render: (row) => maskPan(row.pan) },
  { key: "creditScore", label: "Credit Score" },
  { key: "source", label: "Source" },
];

const CreditReportLeads = () => (
  <LeadsTablePage
    title="Credit Report Leads"
    initialRows={MOCK_CREDIT_REPORT_LEADS}
    statuses={STATUSES}
    statusColors={STATUS_COLORS}
    columns={COLUMNS}
    detailFields={DETAIL_FIELDS}
    searchKeys={["name", "phone", "email", "city"]}
    csvFileName="Credit_Report_Leads"
  />
);

export default CreditReportLeads;
