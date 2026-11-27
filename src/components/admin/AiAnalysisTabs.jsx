import React, { lazy } from "react";
import {
  AutoAwesomeOutlined,
  DescriptionOutlined,
  HandshakeOutlined,
} from "@mui/icons-material";
import TabbedPage from "./TabbedPage";

const ManageAIAnalysis = lazy(() => import("./ManageAIAnalysis"));
const WhiteLabelPartners = lazy(() => import("./WhiteLabelPartners"));
const WhiteLabelReports = lazy(() => import("./WhiteLabelReports"));

// /admin/ai-analysis?tab=ai-reports|white-label-partners|white-label-reports
const AiAnalysisTabs = () => (
  <TabbedPage
    title="AI Analysis"
    subtitle="AI analysis documents, white-labeled partners and the reports they generate."
    tabs={[
      {
        key: "ai-reports",
        label: "AI Reports",
        icon: <AutoAwesomeOutlined fontSize="small" />,
        permission: "ai_analysis",
        render: () => <ManageAIAnalysis embedded />,
      },
      {
        key: "white-label-partners",
        label: "White Label Partners",
        icon: <HandshakeOutlined fontSize="small" />,
        permission: "white_label_partners",
        render: () => <WhiteLabelPartners embedded />,
      },
      {
        key: "white-label-reports",
        label: "White Label Reports",
        icon: <DescriptionOutlined fontSize="small" />,
        permission: "white_label_reports",
        render: () => <WhiteLabelReports embedded />,
      },
    ]}
  />
);

export default AiAnalysisTabs;
