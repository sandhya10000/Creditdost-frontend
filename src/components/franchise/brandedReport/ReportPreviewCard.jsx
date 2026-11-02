import React from 'react';
import { Box, Typography, Chip, Avatar, Button } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Verified as VerifiedIcon,
  WhatsApp as WhatsAppIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const ReportPreviewCard = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      {/* Outer Mock Phone/Card Shell */}
      <Box
        sx={{
          borderRadius: 3.5,
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.18), 0 4px 12px rgba(15, 23, 42, 0.08)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
        }}
      >
        {/* Header (Branded Partner Bar) */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            p: 2.25,
            position: 'relative',
          }}
        >
          {/* Top-Right Floating Tag */}
          <Chip
            label="Your Logo Here"
            size="small"
            sx={{
              position: 'absolute',
              top: 14,
              right: 14,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#93c5fd',
              border: '1px dashed #60a5fa',
              fontSize: '0.675rem',
              fontWeight: 700,
              height: 22,
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: '#2563eb',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                width: 44,
                height: 44,
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.5)',
              }}
            >
              NC
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  lineHeight: 1.2,
                  letterSpacing: '0.02em',
                }}
              >
                NORTHSTAR FINSERV
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#94a3b8',
                  fontSize: '0.72rem',
                  display: 'block',
                  mt: 0.25,
                }}
              >
                DSA Partner ID: DL-88210
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <VerifiedIcon sx={{ fontSize: 13, color: '#38bdf8' }} />
                <Typography sx={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700 }}>
                  Verified Agent
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Body Content */}
        <Box sx={{ p: 2.5, backgroundColor: '#f8fafc' }}>
          {/* Applicant & Date Row */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 1.75,
              mb: 2,
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>
                CLIENT CREDIT ANALYSIS
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                Rohan Verma
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
              Report: Today
            </Typography>
          </Box>

          {/* CIBIL Score Card */}
          <Box
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: 2.5,
              p: 2,
              mb: 2,
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.7rem' }}>
                CIBIL TRANSUNION SCORE
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mt: 0.25 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                  742
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  / 900
                </Typography>
              </Box>
              <Chip
                label="EXCELLENT"
                size="small"
                sx={{
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  fontWeight: 800,
                  fontSize: '0.675rem',
                  height: 20,
                  mt: 0.75,
                }}
              />
            </Box>

            {/* Circular Ring Pill */}
            <Box
              sx={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                border: '4px solid #16a34a',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0fdf4',
              }}
            >
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 900, color: '#15803d', lineHeight: 1 }}>
                Top
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 900, color: '#15803d', lineHeight: 1 }}>
                12%
              </Typography>
            </Box>
          </Box>

          {/* Key Metrics Rows */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1.5,
              mb: 2,
            }}
          >
            <Box
              sx={{
                p: 1.25,
                backgroundColor: '#ffffff',
                borderRadius: 2,
                border: '1px solid #e2e8f0',
              }}
            >
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.675rem' }}>
                Active Loans
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                3 Accounts
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.25,
                backgroundColor: '#ffffff',
                borderRadius: 2,
                border: '1px solid #e2e8f0',
              }}
            >
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.675rem' }}>
                On-time Payments
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#16a34a' }}>
                100% Rate
              </Typography>
            </Box>
          </Box>

          {/* Direct WhatsApp Callout */}
          <Box
            sx={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 2.25,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WhatsAppIcon sx={{ color: '#10b981', fontSize: 24 }} />
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#065f46' }}>
                  Direct WhatsApp Callout
                </Typography>
                <Typography sx={{ fontSize: '0.68rem', color: '#047857' }}>
                  Click to chat with loan consultant
                </Typography>
              </Box>
            </Box>
            <Button
              size="small"
              variant="contained"
              endIcon={<ArrowForwardIcon sx={{ fontSize: '12px !important' }} />}
              sx={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.72rem',
                py: 0.4,
                px: 1.2,
                borderRadius: 1.5,
                '&:hover': { backgroundColor: '#059669' },
              }}
            >
              Apply Now
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Floating Badge Overlapping Bottom-Left */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -18,
          left: -12,
          backgroundColor: '#ffffff',
          borderRadius: 2.5,
          py: 1,
          px: 1.75,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
          border: '1px solid #cbd5e1',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          maxWidth: 270,
          zIndex: 2,
        }}
      >
        <CheckCircleIcon sx={{ color: '#16a34a', fontSize: 20 }} />
        <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
          4.2x Client Inquiries{' '}
          <Typography component="span" sx={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 500, display: 'block' }}>
            With agent branded exports
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default ReportPreviewCard;

