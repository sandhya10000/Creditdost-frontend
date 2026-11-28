import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
const DashboardHome = lazy(() => import("./DashboardHome"));
const Profile = lazy(() => import("./Profile"));
const KycVerification = lazy(() => import("./KycVerification"));
const Packages = lazy(() => import("./Packages"));
const Payment = lazy(() => import("./Payment"));
const CreditCheckTabs = lazy(() => import("./CreditCheckTabs"));
const Leads = lazy(() => import("./Leads"));
const Referrals = lazy(() => import("./Referrals"));
const Business = lazy(() => import("./Business"));
const BusinessMIS = lazy(() => import("./BusinessMIS"));
const AIAnalysisTabs = lazy(() => import("./AIAnalysisTabs"));
const WhiteLabelReports = lazy(() => import("./WhiteLabelReports"));
const Certificate = lazy(() => import("./Certificate"));
const DigitalAgreement = lazy(() => import("./DigitalAgreement"));
const RelationshipManagerInfo = lazy(() => import("./RelationshipManagerInfo"));
const WhatsAppGroups = lazy(() => import("./WhatsAppGroups"));
const Support = lazy(() => import("./Support"));
const FranchiseMarketing = lazy(() => import("./FranchiseMarketing")); // legacy page (all languages)
const FranchiseMarketingByLanguage = lazy(() => import("./FranchiseMarketingByLanguage")); // per-language page
const FranchiseCaseStudies = lazy(() => import("./FranchiseCaseStudies"));
const UpgradePackage = lazy(() => import("./UpgradePackage"));
const BrandedReportPage = lazy(() => import("./brandedReport/BrandedReportPage"));
const BankStatementTabs = lazy(() => import("../bsa/BankStatementTabs"));

const FranchiseRoutes = () => {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route path="upgrade-package" element={<UpgradePackage />} />
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<Profile />} />
        <Route path="kyc" element={<KycVerification />} />
        <Route path="whatsapp-groups" element={<WhatsAppGroups />} />
        <Route path="packages" element={<Packages />} />
        <Route path="payment" element={<Payment />} />
        <Route path="credit-check" element={<CreditCheckTabs />} />
        <Route path="leads" element={<Leads />} />
        <Route path="reports" element={<Navigate to="/franchise/credit-check?tab=reports" replace />} />
        <Route path="referrals" element={<Referrals />} />
        <Route path="business" element={<Business fixedCustomerType="individual" />} />
        <Route path="business-mis" element={<BusinessMIS />} />
        <Route path="white-label-reports" element={<WhiteLabelReports />} />
        <Route path="ai-analysis" element={<AIAnalysisTabs />} />
        <Route path="bank-statement-analyzer" element={<BankStatementTabs />} />
        <Route path="ai-custom-branded-report" element={<BrandedReportPage />} />
        <Route path="certificate" element={<Certificate />} />
        <Route path="agreement" element={<DigitalAgreement />} />
        <Route path="/support" element={<Support />} />
        <Route path="/credit-check/crif" element={<Navigate to="/franchise/credit-check?tab=crif" replace />} />
        <Route path="/credit-check/experian" element={<Navigate to="/franchise/credit-check?tab=experian" replace />} />
        <Route path="/credit-check/equifax" element={<Navigate to="/franchise/credit-check?tab=equifax" replace />} />
        <Route path="/case-studies/:category?" element={<FranchiseCaseStudies />} />{" "}
        {/* Per-language marketing material view — driven by sidebar */}
        <Route path="/marketing/:language" element={<FranchiseMarketingByLanguage />} />
        {/* Legacy all-in-one view kept for backward compat */}
        <Route path="/franchise-marketing" element={<FranchiseMarketing />} />
        <Route
          path="relationship-manager"
          element={<RelationshipManagerInfo />}
        />
      </Route>

      {/* New Marketing Route */}
    </Routes>
    </Suspense>
  );
};

export default FranchiseRoutes;
