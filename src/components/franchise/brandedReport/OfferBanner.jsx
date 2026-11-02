import React from 'react';
import { Box, Typography, Button, Chip, Container } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { BRANDED_REPORT_PRICE } from '../../../constants/brandedReport';

const OfferBanner = ({ onScrollToPayment }) => {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'linear-gradient(90deg, #0b1329 0%, #172554 100%)',
        color: '#ffffff',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        py: { xs: 1.25, md: 1.5 },
        px: { xs: 2, md: 3 },
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
      }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        {/* Left: Offer chips & notice */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.25,
          }}
        >
          <Chip
            label="OFFER"
            size="small"
            sx={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.7rem',
              letterSpacing: '0.05em',
              height: 22,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '0.85rem', md: '0.925rem' },
              color: '#ffffff',
            }}
          >
            AI Custom Branded Report • ₹{BRANDED_REPORT_PRICE.toLocaleString('en-IN')} one-time setup
          </Typography>
          <Chip
            label="Setup delivered in 1–2 working days"
            size="small"
            sx={{
              backgroundColor: 'rgba(245, 158, 11, 0.18)',
              color: '#fbbf24',
              fontWeight: 600,
              fontSize: '0.75rem',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              height: 22,
            }}
          />
        </Box>

        {/* Right: CTA */}
        <Button
          variant="contained"
          size="small"
          onClick={onScrollToPayment}
          endIcon={<ArrowForwardIcon fontSize="small" />}
          sx={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.825rem',
            px: 2.25,
            py: 0.6,
            borderRadius: '9999px',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.4)',
            '&:hover': {
              backgroundColor: '#1d4ed8',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.6)',
            },
            alignSelf: { xs: 'stretch', sm: 'auto' },
          }}
        >
          Pay & Activate →
        </Button>
      </Container>
    </Box>
  );
};

export default OfferBanner;

