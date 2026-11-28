import React, { lazy } from "react";
import { AssessmentOutlined, CloudUploadOutlined } from "@mui/icons-material";
import TabbedPage from "../admin/TabbedPage";

// Bank Statement Analyzer: analyze a statement, or browse the analyses.
// Each tab loads only when it is opened.
const BankStatementAnalyzer = lazy(() => import("./BankStatementAnalyzer"));

// /franchise/bank-statement-analyzer?tab=analyze|analyses
const BankStatementTabs = () => (
  <TabbedPage
    title="Bank Statement Analyzer"
    subtitle="Extract, reconcile and generate credit intelligence reports from bank statements."
    tabs={[
      {
        key: "analyze",
        label: "Analyze Statement",
        icon: <CloudUploadOutlined fontSize="small" />,
        render: () => <BankStatementAnalyzer section="analyze" />,
      },
      {
        key: "analyses",
        label: "Analyses",
        icon: <AssessmentOutlined fontSize="small" />,
        render: () => <BankStatementAnalyzer section="analyses" />,
      },
    ]}
  />
);

export default BankStatementTabs;
