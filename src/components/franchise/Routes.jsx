import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import DashboardHome from './DashboardHome';
import Profile from './Profile';
import KycVerification from './KycVerification';
import Packages from './Packages';
import Payment from './Payment';
import CreditCheck from './CreditCheck';
import Leads from './Leads';
import ViewReports from './ViewReports';
import Referrals from './Referrals';
import Business from './Business';
import BusinessMIS from './BusinessMIS';
import AIAnalysis from './AIAnalysis';
import Certificate from './Certificate';
import DigitalAgreement from './DigitalAgreement';
import Payouts from './Payouts';
import RelationshipManagerInfo from './RelationshipManagerInfo';
import WhatsAppGroups from './WhatsAppGroups';

const FranchiseRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<Profile />} />
        <Route path="kyc" element={<KycVerification />} />
        <Route path="whatsapp-groups" element={<WhatsAppGroups />} />
        <Route path="packages" element={<Packages />} />
        <Route path="payment" element={<Payment />} />
        <Route path="credit-check" element={<CreditCheck />} />
        <Route path="leads" element={<Leads />} />
        <Route path="reports" element={<ViewReports />} />
        <Route path="referrals" element={<Referrals />} />
        <Route path="business" element={<Business />} />
        <Route path="business-mis" element={<BusinessMIS />} />
        <Route path="ai-analysis" element={<AIAnalysis />} />
        <Route path="certificate" element={<Certificate />} />
        <Route path="agreement" element={<DigitalAgreement />} />
        <Route path="payouts" element={<Payouts />} />
        <Route path="relationship-manager" element={<RelationshipManagerInfo />} />
      </Route>
    </Routes>
  );
};

export default FranchiseRoutes;