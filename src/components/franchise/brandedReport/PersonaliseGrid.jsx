import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import {
  Image as ImageIcon,
  Badge as BadgeIcon,
  QrCode2 as QrCodeIcon,
  Palette as PaletteIcon,
  ContactPhone as ContactPhoneIcon,
  VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material';

const FEATURES = [
  {
    icon: <ImageIcon sx={{ fontSize: 28, color: '#2563eb' }} />,
    bgColor: '#eff6ff',
    title: 'Company Logo & Wordmark',
    description:
      'High-resolution PNG, SVG, or JPEG integration seamlessly scaled for crystal-clear vector PDF export.',
  },
  {
    icon: <BadgeIcon sx={{ fontSize: 28, color: '#059669' }} />,
    bgColor: '#ecfdf5',
    title: 'Company Name & Tagline',
    description:
      'Prominent custom headers on every page highlighting your registration number, DSA codes, and slogan.',
  },
  {
    icon: <QrCodeIcon sx={{ fontSize: 28, color: '#7c3aed' }} />,
    bgColor: '#f5f3ff',
    title: 'Social & Web Presence',
    description:
      'LinkedIn, Instagram, official portal links, plus dynamic QR code generated for borrowers to connect in 1 scan.',
  },
  {
    icon: <PaletteIcon sx={{ fontSize: 28, color: '#ea580c' }} />,
    bgColor: '#fff7ed',
    title: 'Custom Brand Palette',
    description:
      "Match your primary, secondary, and badge colors with your firm's brand book or official website theme.",
  },
  {
    icon: <ContactPhoneIcon sx={{ fontSize: 28, color: '#0284c7' }} />,
    bgColor: '#f0f9ff',
    title: 'Direct Contact & Office Info',
    description:
      'Clickable phone numbers, direct one-tap WhatsApp chat links, agency email, and registered office address.',
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 28, color: '#4f46e5' }} />,
    bgColor: '#eef2ff',
    title: 'Header & Executive Summary',
    description:
      'Personalised advisory commentary, custom legal disclaimer, and certified loan officer sign-off stamp.',
  },
];

const PersonaliseGrid = () => {
  return (
    <Box sx={{ py: { xs: 5, md: 7 }, px: { xs: 2, md: 3 } }}>
      {/* Header Row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'flex-end' },
          mb: 4,
          gap: 1,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#2563eb',
              fontSize: '0.75rem',
            }}
          >
            CUSTOMISATION BREAKDOWN
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#0f172a',
              fontSize: { xs: '1.6rem', md: '2.1rem' },
              mt: 0.25,
            }}
          >
            What you can personalise
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          Tailored by our dedicated design team
        </Typography>
      </Box>

      {/* 3x2 Feature Cards Grid */}
      <Grid container spacing={3}>
        {FEATURES.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.title}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                transition: 'all 0.25s ease-in-out',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  borderColor: '#cbd5e1',
                  boxShadow: '0 10px 24px rgba(0, 0, 0, 0.05)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {/* Soft Coloured Icon Tile */}
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2.25,
                  backgroundColor: item.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2.25,
                }}
              >
                {item.icon}
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
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  lineHeight: 1.55,
                  fontSize: '0.875rem',
                }}
              >
                {item.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PersonaliseGrid;

