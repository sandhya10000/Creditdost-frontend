import React from 'react';
import { Box, Typography, Chip, Grid } from '@mui/material';
import { Check as CheckIcon } from 'lucide-react';
import { BRANDED_REPORT_PRICE } from '../../../constants/brandedReport';

const CHECKLIST = [
  'Lifetime custom brand template configuration',
  'Logo, palette, contact info & social links integration',
  'Up to 2 complimentary revision rounds with dedicated designer',
  'Instant automated generation for all future credit analyses',
];

const PricingBanner = () => {
  return (
    <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          borderRadius: 4,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          color: '#ffffff',
          p: { xs: 3.5, sm: 4.5, md: 5.5 },
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Glow Accent */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Amber Pill */}
        <Chip
          label="Most Popular Upgrade • Pay Once, Brand Forever"
          size="small"
          sx={{
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            color: '#fbbf24',
            fontWeight: 800,
            fontSize: '0.75rem',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            mb: 3,
            height: 26,
            px: 0.5,
          }}
        />

        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          {/* Left Side: Pricing */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', sm: '3.2rem', md: '3.75rem' },
                  color: '#ffffff',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                ₹{BRANDED_REPORT_PRICE.toLocaleString('en-IN')}
              </Typography>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.85rem' }}>
                  one-time setup fee
                </Typography>
                <Chip
                  label="One-time"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    color: '#4ade80',
                    fontWeight: 700,
                    fontSize: '0.675rem',
                    height: 20,
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    mt: 0.5,
                  }}
                />
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: '#94a3b8',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                mt: 2.5,
                maxWidth: 420,
              }}
            >
              Branding setup fee, paid once. Includes template creation, custom assets setup, and automated pipeline
              integration.
            </Typography>
          </Grid>

          {/* Right Side: Checklist */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
              {CHECKLIST.map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mt: 0.25,
                    }}
                  >
                    <CheckIcon size={14} color="#4ade80" />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#e2e8f0',
                      fontSize: { xs: '0.875rem', sm: '0.925rem' },
                      fontWeight: 600,
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Note Strip */}
        <Box
          sx={{
            mt: 4,
            pt: 2.5,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#94a3b8',
              fontSize: '0.8rem',
              lineHeight: 1.5,
            }}
          >
            <strong>Note:</strong> AI analysis reports are charged separately at the current platform rate (from your
            active wallet credits).
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PricingBanner;

