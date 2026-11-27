import React, { Suspense, lazy } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

const Dashboard = lazy(() => import("./Dashboard"));
const ManageFranchises = lazy(() => import("./ManageFranchises"));
const ManagePackages = lazy(() => import("./ManagePackages"));
const ManageCustomerPackages = lazy(() => import("./ManageCustomerPackages"));
const ManagePayouts = lazy(() => import("./ManagePayouts"));
const SurepassSettings = lazy(() => import("./SurepassSettings"));
// Pages made of tabs (see TabbedPage)
const CreditCheckTabs = lazy(() => import("./CreditCheckTabs"));
const BusinessMisTabs = lazy(() => import("./BusinessMisTabs"));
const AiAnalysisTabs = lazy(() => import("./AiAnalysisTabs"));
const ManualPayments = lazy(() => import("./ManualPayments"));
const BusinessFollowUps = lazy(() => import("./BusinessFollowUps"));
const ManageBlogs = lazy(() => import("./ManageBlogs"));
const ManageRelationshipManagers = lazy(
  () => import("./ManageRelationshipManagers"),
);
const AdminDashboardHome = lazy(() => import("./AdminDashboardHome"));
const GoogleSheetsSettings = lazy(() => import("./GoogleSheetsSettings"));
const ManageDigitalAgreements = lazy(() => import("./ManageDigitalAgreements"));
const ManageBsaReports = lazy(() => import("./ManageBsaReports"));
const AdminMarketing = lazy(() => import("./AdminMarketing"));
const AdminReward = lazy(() => import("./AdminReward"));
const AdminCaseStudies = lazy(() => import("./AdminCaseStudy"));
const CustomerCRM = lazy(() => import("../pages/CustomerCRM"));
const FranchiseCRM = lazy(() => import("../pages/FranchiseCRM"));
const ManualBusiness = lazy(() => import("../admin/ManualBusiness"));
const CreditReportLeads = lazy(
  () => import("../admin/Website-enquiry/CreditReportLeads"),
);
const AdminTickets = lazy(() => import("../admin/supportTicket"));
const ManageStaff = lazy(() => import("./ManageStaff"));
const StaffProfile = lazy(() => import("./StaffProfile"));
// Shared by every role granted the Work Tracking section (see config/adminPermissions.js)
const WorkTracking = lazy(() => import("./WorkTracking"));
const AdminRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<AdminDashboardHome />} />
          {/* One Franchises page; tabs are ?tab=active|pending|deleted */}
          <Route path="franchises" element={<ManageFranchises />} />
          <Route path="packages" element={<ManagePackages />} />
          <Route
            path="customer-packages"
            element={<ManageCustomerPackages />}
          />
          <Route path="payouts" element={<ManagePayouts />} />
          <Route path="surepass-settings" element={<SurepassSettings />} />

          {/* Credit Check page: ?tab=check|reports|prefill-logs */}
          <Route path="credit-check" element={<CreditCheckTabs />} />
          <Route
            path="reports"
            element={<Navigate to="/admin/credit-check?tab=reports" replace />}
          />
          <Route
            path="prefill-failed-logs"
            element={<Navigate to="/admin/credit-check?tab=prefill-logs" replace />}
          />

          {/* Business MIS page: ?tab=individual|business|amc|pending */}
          <Route path="business-mis" element={<BusinessMisTabs />} />
          <Route
            path="business-forms"
            element={<Navigate to="/admin/business-mis?tab=individual" replace />}
          />
          <Route
            path="business-forms/individual"
            element={<Navigate to="/admin/business-mis?tab=individual" replace />}
          />
          <Route
            path="business-forms/business"
            element={<Navigate to="/admin/business-mis?tab=business" replace />}
          />
          <Route
            path="amc-customers"
            element={<Navigate to="/admin/business-mis?tab=amc" replace />}
          />
          <Route
            path="business-forms-pending"
            element={<Navigate to="/admin/business-mis?tab=pending" replace />}
          />

          {/* AI Analysis page: ?tab=ai-reports|white-label-partners|white-label-reports */}
          <Route path="ai-analysis" element={<AiAnalysisTabs />} />
          <Route
            path="white-label-partners"
            element={<Navigate to="/admin/ai-analysis?tab=white-label-partners" replace />}
          />
          <Route
            path="white-label-reports"
            element={<Navigate to="/admin/ai-analysis?tab=white-label-reports" replace />}
          />
          <Route path="business-forms/follow-ups" element={<BusinessFollowUps />} />
          <Route path="manual-payments" element={<ManualPayments />} />
          <Route path="blogs" element={<ManageBlogs />} />
          <Route path="rms" element={<ManageRelationshipManagers />} />
          <Route path="staff" element={<ManageStaff />} />
          <Route path="staff/:id" element={<StaffProfile />} />
          <Route path="work-tracking" element={<WorkTracking />} />
          <Route path="google-sheets" element={<GoogleSheetsSettings />} />
          <Route
            path="digital-agreements"
            element={<ManageDigitalAgreements />}
          />
          <Route path="bsa-reports" element={<ManageBsaReports />} />
          <Route path="marketing-materials" element={<AdminMarketing />} />
          <Route path="reward" element={<AdminReward />} />
          <Route path="case-study/:category?" element={<AdminCaseStudies />} />
          <Route path="/customer/:customerId" element={<CustomerCRM />} />
          <Route path="/franchise/:franchiseCode" element={<FranchiseCRM />} />
          <Route path="/manual-business" element={<ManualBusiness />} />
          <Route path="/admin-tickets" element={<AdminTickets />} />
          {/* Older franchise URLs open the matching tab */}
          <Route
            path="manage-franchise"
            element={<Navigate to="/admin/franchises?tab=active&status=all" replace />}
          />
          <Route
            path="franchise-pending"
            element={<Navigate to="/admin/franchises?tab=pending" replace />}
          />
          <Route
            path="franchise-approved"
            element={<Navigate to="/admin/franchises?tab=active" replace />}
          />
          <Route
            path="franchise-rejected"
            element={<Navigate to="/admin/franchises?tab=active&status=rejected" replace />}
          />

          <Route path="credit-report-leads" element={<CreditReportLeads />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
