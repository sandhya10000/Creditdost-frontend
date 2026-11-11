import React from 'react';
import { Box, Typography, Button, Chip, Grid } from '@mui/material';
import {
  Sparkles as SparklesIcon,
  Check as CheckIcon,
  ArrowDown as ArrowDownIcon,
} from 'lucide-react';
import { BRANDED_REPORT_PRICE } from '../../../constants/brandedReport';
import ReportPreviewCard from './ReportPreviewCard';

const HeroSection = ({ onScrollToPayment, onScrollToSamples }) => {
  return (
    <Box
      sx={{
        py: { xs: 5, md: 7 },
        px: { xs: 2, md: 3 },
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
      }}
    >
      <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
        {/* Left Column: Sales Copy & CTAs */}
        <Grid item xs={12} md={7}>
          {/* Eyebrow Pill */}
          <Chip
            icon={<SparklesIcon size={14} color="#1d4ed8" />}
            label="Turn Credit Reports Into Your Top Lead Magnet"
            size="small"
            sx={{
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              color: '#1d4ed8',
              fontWeight: 700,
              fontSize: '0.75rem',
              mb: 2.5,
              border: '1px solid rgba(37, 99, 235, 0.2)',
              px: 0.5,
            }}
          />

          {/* Heading */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.1rem' },
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              mb: 2,
            }}
          >
            Your brand on <br />
            <Box component="span" sx={{ color: '#2563eb' }}>
              every credit report.
            </Box>
          </Typography>

          {/* Value Prop Paragraph */}
          <Typography
            variant="body1"
            sx={{
              color: '#475569',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              lineHeight: 1.6,
              mb: 3,
              maxWidth: 580,
            }}
          >
            Turn AI-analysed credit reports into your own high-trust marketing asset. Your logo, corporate colours,
            verified watermark, and contact details on every report shared with borrowers.
          </Typography>

          {/* Four Small Value Chips */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mb: 4,
            }}
          >
            {[
              `One-time fee ₹${BRANDED_REPORT_PRICE.toLocaleString('en-IN')}`,
              '2 free revisions included',
              'Setup in 1–2 working days',
              'Applied to all future reports',
            ].map((chipText) => (
              <Chip
                key={chipText}
                icon={<CheckIcon size={13} color="#16a34a" />}
                label={chipText}
                size="small"
                sx={{
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  border: '1px solid #e2e8f0',
                  py: 1.75,
                }}
              />
            ))}
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={onScrollToPayment}
              sx={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                py: 1.4,
                px: 3,
                borderRadius: 2.5,
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
                display: 'flex',
                gap: 1.25,
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                  boxShadow: '0 10px 28px rgba(37, 99, 235, 0.5)',
                },
              }}
            >
              Get my branded AI report
              <Box
                component="span"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  px: 1,
                  py: 0.2,
                  borderRadius: 1.2,
                  fontSize: '0.8rem',
                  fontWeight: 900,
                }}
              >
                ₹{BRANDED_REPORT_PRICE.toLocaleString('en-IN')}
              </Box>
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={onScrollToSamples}
              startIcon={<ArrowDownIcon size={16} />}
              sx={{
                color: '#1e293b',
                borderColor: '#cbd5e1',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                py: 1.35,
                px: 2.5,
                borderRadius: 2.5,
                backgroundColor: '#ffffff',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: '#f8fafc',
                },
              }}
            >
              See live samples ↓
            </Button>
          </Box>
        </Grid>

        {/* Right Column: Interactive Branded Preview */}
        <Grid item xs={12} md={5} sx={{ pt: { xs: 4, md: 0 } }}>
          <ReportPreviewCard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeroSection;
