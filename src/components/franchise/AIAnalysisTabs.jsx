import React, { lazy } from "react";
import {
  AutoAwesomeOutlined,
  DescriptionOutlined,
} from "@mui/icons-material";
import TabbedPage from "../admin/TabbedPage";

// AI Analysis: generate a report and browse the generated reports.
// Each tab loads only when it is opened.
const AIAnalysis = lazy(() => import("./AIAnalysis"));

// /franchise/ai-analysis?tab=generate|reports
const AIAnalysisTabs = () => (
  <TabbedPage
    title="AI Analysis"
    subtitle="Generate AI reports from your credit documents and review the reports you have generated."
    tabs={[
      {
        key: "generate",
        label: "Generate AI Report",
        icon: <AutoAwesomeOutlined fontSize="small" />,
        render: () => <AIAnalysis section="generate" />,
      },
      {
        key: "reports",
        label: "AI Reports",
        icon: <DescriptionOutlined fontSize="small" />,
        render: () => <AIAnalysis section="reports" />,
      },
    ]}
  />
);

export default AIAnalysisTabs;
