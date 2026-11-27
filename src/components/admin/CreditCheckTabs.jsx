import React, { lazy } from "react";
import {
  AssessmentOutlined,
  CreditScoreOutlined,
  ErrorOutline,
} from "@mui/icons-material";
import TabbedPage from "./TabbedPage";

const AdminCreditBureau = lazy(() => import("./AdminCreditcheck"));
const ViewReports = lazy(() => import("./ViewReports"));
const PrefillFailedLog = lazy(() => import("./PrefillFailedLog"));

// /admin/credit-check?tab=check|reports|prefill-logs
const CreditCheckTabs = () => (
  <TabbedPage
    title="Credit Check"
    subtitle="Pull bureau reports, browse generated reports and review failed prefill attempts."
    tabs={[
      {
        key: "check",
        label: "Credit Check",
        icon: <CreditScoreOutlined fontSize="small" />,
        permission: "credit",
        render: () => <AdminCreditBureau embedded />,
      },
      {
        key: "reports",
        label: "View Reports",
        icon: <AssessmentOutlined fontSize="small" />,
        permission: "reports",
        render: () => <ViewReports embedded />,
      },
      {
        key: "prefill-logs",
        label: "Prefill Failed Logs",
        icon: <ErrorOutline fontSize="small" />,
        permission: "prefill_logs",
        render: () => <PrefillFailedLog embedded />,
      },
    ]}
  />
);

export default CreditCheckTabs;
