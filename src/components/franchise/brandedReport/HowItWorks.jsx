import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { BRANDED_REPORT_PRICE } from '../../../constants/brandedReport';

const STEPS = [
  {
    number: '01',
    title: 'Pay one-time fee',
    description: `Pay ₹${BRANDED_REPORT_PRICE.toLocaleString('en-IN')} flat via Razorpay or your wallet. Zero monthly fees or recurring charges.`,
    badgeColor: '#2563eb',
  },
  {
    number: '02',
    title: 'Onboarding in 1–2 days',
    description:
      'Our dedicated designer reaches out within 3 hours via WhatsApp or phone call to gather requirements.',
    badgeColor: '#059669',
  },
  {
    number: '03',
    title: 'Submit brand assets',
    description:
      'Share your PNG logo, desired brand colors, contact links, and preferred disclaimer text.',
    badgeColor: '#7c3aed',
  },
  {
    number: '04',
    title: 'Approve & Go Live',
    description:
      'Includes 2 free revision rounds. Once approved, all future reports export automatically branded!',
    badgeColor: '#ea580c',
  },
];

const HowItWorks = () => {
  return (
    <Box sx={{ py: { xs: 5, md: 7 }, px: { xs: 2, md: 3 } }}>
      {/* Eyebrow & Heading */}
      <Box sx={{ textAlign: 'center', maxWidth: 650, mx: 'auto', mb: 5 }}>
        <Typography
          variant="overline"
          sx={{
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#2563eb',
            fontSize: '0.75rem',
          }}
        >
          FAST & SIMPLE
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#0f172a',
            fontSize: { xs: '1.6rem', md: '2.1rem' },
            mt: 0.5,
            mb: 1.5,
          }}
        >
          How It Works
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontSize: '0.95rem' }}>
          From order to your first branded export in 4 simple milestones.
        </Typography>
      </Box>

      {/* 4 Steps Grid */}
      <Grid container spacing={3}>
        {STEPS.map((step) => (
          <Grid item xs={12} sm={6} md={3} key={step.number}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#cbd5e1',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
                },
              }}
            >
              {/* Step Number Tag */}
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  backgroundColor: `${step.badgeColor}15`,
                  color: step.badgeColor,
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2.25,
                }}
              >
                {step.number}
              </Box>

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  color: '#0f172a',
                  fontSize: '1rem',
                  mb: 1,
                  lineHeight: 1.3,
                }}
              >
                {step.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  lineHeight: 1.55,
                  fontSize: '0.875rem',
                }}
              >
                {step.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HowItWorks;

