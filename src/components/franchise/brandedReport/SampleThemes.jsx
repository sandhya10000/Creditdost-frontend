import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { SAMPLE_BRANDED_THEMES } from '../../../constants/brandedReport';

const SampleThemes = () => {
  const [activePreview, setActivePreview] = useState(null);

  const handleOpenPreview = (sample) => {
    setActivePreview(sample);
  };

  const handleClosePreview = () => {
    setActivePreview(null);
  };

  const handleDownload = (sample) => {
    const link = document.createElement('a');
    link.href = sample.fileUrl;
    link.download = sample.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box id="sample-themes-section" sx={{ py: { xs: 5, md: 7 }, px: { xs: 2, md: 3 }, backgroundColor: '#f8fafc' }}>
      {/* Centered Heading */}
      <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 5 }}>
        <Typography
          variant="overline"
          sx={{
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#2563eb',
            fontSize: '0.75rem',
          }}
        >
          PORTFOLIO
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
          Sample Branded Report Themes
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontSize: '0.95rem' }}>
          See how your reports can look. These samples use fictional financial firms. Yours will carry your own logo,
          palette, and contact links.
        </Typography>
      </Box>

      {/* 3 Theme Cards */}
      <Grid container spacing={3}>
        {SAMPLE_BRANDED_THEMES.map((sample) => (
          <Grid item xs={12} md={4} key={sample.id}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3.5,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              {/* Header Strip */}
              <Box
                sx={{
                  p: 2.25,
                  backgroundColor: sample.palette[0],
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: sample.palette[1],
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    width: 40,
                    height: 40,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  }}
                >
                  {sample.initials}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                    {sample.firmName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem' }}>
                    Branded Demo Template
                  </Typography>
                </Box>
              </Box>

              {/* Card Body */}
              <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Theme Name Row */}
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.7rem' }}>
                    THEME
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                    {sample.themeName}
                  </Typography>
                </Box>

                {/* Palette Row */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.7rem' }}>
                    PALETTE
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    {sample.palette.map((color, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: '2px solid #ffffff',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Description */}
                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.55, mb: 3, flexGrow: 1 }}>
                  {sample.description}
                </Typography>

                {/* Buttons */}
                <Box sx={{ display: 'flex', gap: 1.25, pt: 1, borderTop: '1px solid #f1f5f9' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    startIcon={<VisibilityIcon fontSize="small" />}
                    onClick={() => handleOpenPreview(sample)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      borderColor: '#cbd5e1',
                      color: '#1e293b',
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#94a3b8',
                        backgroundColor: '#f8fafc',
                      },
                    }}
                  >
                    View sample
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    startIcon={<DownloadIcon fontSize="small" />}
                    onClick={() => handleDownload(sample)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: '#1d4ed8',
                      },
                    }}
                  >
                    Download
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footnote */}
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          textAlign: 'center',
          color: '#94a3b8',
          fontStyle: 'italic',
          mt: 4,
          fontSize: '0.8rem',
        }}
      >
        *Fictional examples created for demonstration. Your reports will feature your unique branding, phone numbers,
        and color schemes.
      </Typography>

      {/* Preview Dialog (Modal with iframe) */}
      <Dialog
        open={Boolean(activePreview)}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            height: '85vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 2,
            backgroundColor: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              {activePreview?.firmName} — Sample Report Preview
            </Typography>
            <Button
              size="small"
              href={activePreview?.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<OpenInNewIcon sx={{ fontSize: '13px !important' }} />}
              sx={{
                color: '#93c5fd',
                fontSize: '0.72rem',
                textTransform: 'none',
              }}
            >
              Open in new tab
            </Button>
          </Box>
          <IconButton size="small" onClick={handleClosePreview} sx={{ color: '#ffffff' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, flexGrow: 1, backgroundColor: '#f1f5f9' }}>
          {activePreview && (
            <iframe
              src={activePreview.fileUrl}
              title={activePreview.firmName}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: '#ffffff',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SampleThemes;

