import React, { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Lock as LockIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { franchiseAPI } from '../../../services/api';
import { isEligibleForBrandedReport } from '../../../constants/brandedReport';
import { getBrandedReportStatus } from '../../../services/brandedReportService';

import OfferBanner from './OfferBanner';
import HeroSection from './HeroSection';
import PersonaliseGrid from './PersonaliseGrid';
import SampleThemes from './SampleThemes';
import HowItWorks from './HowItWorks';
import PricingBanner from './PricingBanner';
import PaymentCard from './PaymentCard';

const BrandedReportPage = () => {
  const navigate = useNavigate();

  // Loading & Eligibility State
  const [loading, setLoading] = useState(true);
  const [isEligible, setIsEligible] = useState(false);
  const [packageName, setPackageName] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [userProfile, setUserProfile] = useState({});
  const [purchaseStatus, setPurchaseStatus] = useState(null);

  // Smooth scroll helper
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);

      // 1. Fetch AI usage / package information to verify Platinum / Diamond
      const [usageRes, profileRes, dashboardRes, statusRes] = await Promise.all([
        franchiseAPI.getAIAnalysisUsage().catch(() => null),
        franchiseAPI.getProfile().catch(() => null),
        franchiseAPI.getDashboardStats().catch(() => null),
        getBrandedReportStatus().catch(() => null),
      ]);

      const resolvedPackage =
        usageRes?.data?.packageName ||
        dashboardRes?.data?.franchise?.assignedPackages?.[0]?.name ||
        '';

      const eligible = isEligibleForBrandedReport(resolvedPackage);
      setPackageName(resolvedPackage);
      setIsEligible(eligible);

      // 2. Wallet credits
      const balance =
        dashboardRes?.data?.stats?.creditDetails?.credits ??
        dashboardRes?.data?.franchise?.credits ??
        0;
      setWalletBalance(balance);

      // 3. User profile (email, phone, businessName)
      if (profileRes?.data) {
        setUserProfile(profileRes.data);
      }

      // 4. Purchase status
      if (statusRes) {
        setPurchaseStatus(statusRes);
      }
    } catch (err) {
      console.error('[BrandedReportPage] Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Loading indicator
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  // Route Guard View: Non-eligible user notice
  if (!isEligible) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3.5,
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <LockIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
            Available Exclusively for Platinum & Diamond Partners
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 520, mx: 'auto', mb: 3 }}>
            The AI Custom Branded Report add-on is reserved for our premier tier partners on Platinum and Diamond plans
            {packageName ? ` (Your current plan: ${packageName})` : ''}.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/franchise/upgrade-package')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                backgroundColor: '#2563eb',
                px: 3,
                py: 1,
                borderRadius: 2,
              }}
            >
              Upgrade Your Package
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/franchise')}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderColor: '#cbd5e1',
                color: '#475569',
                px: 3,
                py: 1,
                borderRadius: 2,
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Eligible User: Full Sales & Purchase Page
  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh', pb: 8 }}>
      {/* 1. Sticky Offer Banner */}
      <OfferBanner onScrollToPayment={() => scrollToSection('payment-section')} />

      <Container maxWidth="lg" disableGutters>
        {/* 2. Hero Section (with Mock Report Preview) */}
        <HeroSection
          onScrollToPayment={() => scrollToSection('payment-section')}
          onScrollToSamples={() => scrollToSection('sample-themes-section')}
        />

        {/* 3. What You Can Personalise Grid */}
        <PersonaliseGrid />

        {/* 4. Sample Branded Report Themes Portfolio */}
        <SampleThemes />

        {/* 5. How It Works */}
        <HowItWorks />

        {/* 6. Dark High-Contrast Pricing Banner */}
        <PricingBanner />

        {/* 7. Complete Payment Card */}
        <PaymentCard
          status={purchaseStatus}
          walletBalance={walletBalance}
          userProfile={userProfile}
          onPurchaseSuccess={() => loadData()}
          onRefreshWallet={() => loadData()}
        />
      </Container>
    </Box>
  );
};

export default BrandedReportPage;

