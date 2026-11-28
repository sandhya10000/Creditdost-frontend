import React, { lazy, useEffect, useState } from "react";
import { Chip, Stack, Typography } from "@mui/material";
import {
  AssessmentOutlined,
  CreditScoreOutlined,
  SummarizeOutlined,
} from "@mui/icons-material";
import TabbedPage from "../admin/TabbedPage";
import { franchiseAPI } from "../../services/api";

// Partner Credit Check: one page with a tab per bureau and the reports list.
// Each tab is loaded only when it is opened.
const CibilCheck = lazy(() => import("./CreditCheck"));
const CrifCheck = lazy(() => import("./creditBureau/CRIF"));
const ExperianCheck = lazy(() => import("./creditBureau/Experian"));
const EquifaxCheck = lazy(() => import("./creditBureau/Equifax"));
const ViewReports = lazy(() => import("./ViewReports"));

// /franchise/credit-check?tab=cibil|crif|experian|equifax|reports
const CreditCheckTabs = () => {
  // Available credits: shown in the page header, kept in sync by the bureau forms
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    franchiseAPI
      .getDashboardStats()
      .then((res) => setCredits(res.data.stats.credits))
      .catch((err) => console.error("Error loading credits:", err));
  }, []);

  const creditsBadge = (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="body2" color="text.secondary">
        Available credits
      </Typography>
      <Chip label={credits ?? "--"} color="primary" sx={{ fontWeight: 700, minWidth: 48 }} />
    </Stack>
  );

  return (
  <TabbedPage
    title="Credit Check"
    subtitle="Pull credit reports from each bureau and view the reports you have generated."
    actions={creditsBadge}
    tabs={[
      {
        key: "cibil",
        label: "CIBIL",
        icon: <CreditScoreOutlined fontSize="small" />,
        render: () => <CibilCheck embedded onCreditsChange={setCredits} />,
      },
      {
        key: "crif",
        label: "CRIF",
        icon: <SummarizeOutlined fontSize="small" />,
        render: () => <CrifCheck onCreditsChange={setCredits} />,
      },
      {
        key: "experian",
        label: "Experian",
        icon: <SummarizeOutlined fontSize="small" />,
        render: () => <ExperianCheck onCreditsChange={setCredits} />,
      },
      {
        key: "equifax",
        label: "Equifax",
        icon: <SummarizeOutlined fontSize="small" />,
        render: () => <EquifaxCheck onCreditsChange={setCredits} />,
      },
      {
        key: "reports",
        label: "View Reports",
        icon: <AssessmentOutlined fontSize="small" />,
        render: () => <ViewReports embedded />,
      },
    ]}
  />
  );
};

export default CreditCheckTabs;
