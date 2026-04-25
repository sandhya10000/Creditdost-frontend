import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import ManageFranchises from './ManageFranchises';
import ManagePackages from './ManagePackages';
import ManageCustomerPackages from './ManageCustomerPackages';
import ManageLeads from './ManageLeads';
import ManagePayouts from './ManagePayouts';
import ViewReports from './ViewReports';
import ManageReferrals from './ManageReferrals';
import SurepassSettings from './SurepassSettings';
import RechargeCredits from './RechargeCredits';
import BusinessForms from './BusinessForms';
import ManageBlogs from './ManageBlogs';
import ManageRelationshipManagers from './ManageRelationshipManagers';
import AdminDashboardHome from './AdminDashboardHome';
import GoogleSheetsSettings from './GoogleSheetsSettings';
import ManageDigitalAgreements from './ManageDigitalAgreements';
import ManageAIAnalysis from './ManageAIAnalysis';

const AdminRoutes = () => {
  return ( 
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route index element={<AdminDashboardHome />} />
        <Route path="franchises" element={<ManageFranchises />} />
        <Route path="packages" element={<ManagePackages />} />
        <Route path="customer-packages" element={<ManageCustomerPackages />} />
        <Route path="leads" element={<ManageLeads />} />
        <Route path="payouts" element={<ManagePayouts />} />
        <Route path="reports" element={<ViewReports />} />
        <Route path="referrals" element={<ManageReferrals />} />
        <Route path="surepass-settings" element={<SurepassSettings />} />
        <Route path="recharge" element={<RechargeCredits />} />
        <Route path="business-forms" element={<BusinessForms />} />
        <Route path="blogs" element={<ManageBlogs />} />
        <Route path="rms" element={<ManageRelationshipManagers />} />
        <Route path="google-sheets" element={<GoogleSheetsSettings />} />
        <Route path="digital-agreements" element={<ManageDigitalAgreements />} />
        <Route path="ai-analysis" element={<ManageAIAnalysis />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;