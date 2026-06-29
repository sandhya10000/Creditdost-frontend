import React, { Suspense, lazy } from "react";

import { Routes, Route } from "react-router-dom";

const Dashboard = lazy(() => import("./Dashboard"));
const ManageFranchises = lazy(() => import("./ManageFranchises"));
const ManagePackages = lazy(() => import("./ManagePackages"));
const ManageCustomerPackages = lazy(() => import("./ManageCustomerPackages"));
const ManageLeads = lazy(() => import("./ManageLeads"));
const ManagePayouts = lazy(() => import("./ManagePayouts"));
const ViewReports = lazy(() => import("./ViewReports"));
const ManageReferrals = lazy(() => import("./ManageReferrals"));
const SurepassSettings = lazy(() => import("./SurepassSettings"));
const RechargeCredits = lazy(() => import("./RechargeCredits"));
const BusinessForms = lazy(() => import("./BusinessForms"));
const ManageBlogs = lazy(() => import("./ManageBlogs"));
const ManageRelationshipManagers = lazy(
  () => import("./ManageRelationshipManagers"),
);
const AdminDashboardHome = lazy(() => import("./AdminDashboardHome"));
const GoogleSheetsSettings = lazy(() => import("./GoogleSheetsSettings"));
const ManageDigitalAgreements = lazy(() => import("./ManageDigitalAgreements"));
const ManageAIAnalysis = lazy(() => import("./ManageAIAnalysis"));
const AdminMarketing = lazy(() => import("./AdminMarketing"));
const AdminReward = lazy(() => import("./AdminReward"));
const AdminCaseStudies = lazy(() => import("./AdminCaseStudy"));
const ReportAnalytics = lazy(() => import("./ReportAnalytics"));
const CustomerCRM = lazy(() => import("../pages/CustomerCRM"));
const FranchiseCRM = lazy(() => import("../pages/FranchiseCRM"));
const AdminCreditBureau = lazy(() => import("../admin/AdminCreditcheck"));
const PrefillFailedLog = lazy(() => import("../admin/PrefillFailedLog"));
const ManualBusiness = lazy(() => import("../admin/ManualBusiness"));
const FranchisePending = lazy(
  () => import("../admin/Website-enquiry/FranchisePending"),
);
const CreditScoreRepair = lazy(
  () => import("../admin/Website-enquiry/CreditScoreRepair"),
);
const AdminRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<AdminDashboardHome />} />
          <Route
            path="franchises"
            element={<ManageFranchises kycStatus="approved" />}
          />
          <Route path="packages" element={<ManagePackages />} />
          <Route
            path="customer-packages"
            element={<ManageCustomerPackages />}
          />
          <Route path="leads" element={<ManageLeads />} />
          <Route path="payouts" element={<ManagePayouts />} />
          <Route path="reports" element={<ViewReports />} />
          <Route path="referrals" element={<ManageReferrals />} />
          <Route path="surepass-settings" element={<SurepassSettings />} />
          <Route path="recharge" element={<RechargeCredits />} />
          <Route
            path="business-forms"
            element={<BusinessForms status="paid" />}
          />

          <Route
            path="business-forms-pending"
            element={<BusinessForms status="pending" />}
          />
          <Route path="blogs" element={<ManageBlogs />} />
          <Route path="rms" element={<ManageRelationshipManagers />} />
          <Route path="google-sheets" element={<GoogleSheetsSettings />} />
          <Route
            path="digital-agreements"
            element={<ManageDigitalAgreements />}
          />
          <Route path="ai-analysis" element={<ManageAIAnalysis />} />
          <Route path="marketing-materials" element={<AdminMarketing />} />
          <Route path="reward" element={<AdminReward />} />
          <Route path="case-study" element={<AdminCaseStudies />} />
          <Route path="report-analytics" element={<ReportAnalytics />} />
          <Route path="/customer/:customerId" element={<CustomerCRM />} />
          <Route path="/franchise/:franchiseCode" element={<FranchiseCRM />} />
          <Route path="/credit-check" element={<AdminCreditBureau />} />
          <Route path="/prefill-failed-logs" element={<PrefillFailedLog />} />
          <Route path="/manual-business" element={<ManualBusiness />} />
          <Route
            path="/admin/franchise-pending"
            element={<FranchisePending kycStatus="pending" />}
          />

          <Route path="/admin/credit-repair" element={<CreditScoreRepair />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
