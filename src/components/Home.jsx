import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  PersonAdd, 
  CreditScore, 
  Dashboard as DashboardIcon,
  ArrowForward
} from '@mui/icons-material';

const GradientBackground = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
  borderRadius: theme.shape.borderRadius * 3,
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`,
    transform: 'rotate(30deg)',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
    borderColor: theme.palette.primary.main,
  },
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  width: 72,
  height: 72,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: `${color}20`,
  color: color,
  margin: '0 auto 24px',
}));

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Easy Registration',
      description: 'Simple and quick registration process to get you started in minutes',
      icon: <PersonAdd sx={{ fontSize: 36 }} />,
      color: '#6200ea',
    },
    {
      title: 'Credit Verification',
      description: 'Instant credit score checks and detailed reports for your customers',
      icon: <CreditScore sx={{ fontSize: 36 }} />,
      color: '#03dac6',
    },
    {
      title: 'Business Management',
      description: 'Comprehensive dashboard to manage leads, transactions, and referrals',
      icon: <DashboardIcon sx={{ fontSize: 36 }} />,
      color: '#ff4081',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <GradientBackground>
        <Container maxWidth="lg">
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            fontWeight="800"
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              color: 'common.white',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              mb: 2
            }}
          >
            Credit Dost Franchise Platform
          </Typography>
          <Typography 
            variant="h5" 
            color="common.white"
            sx={{ 
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              opacity: 0.9
            }}
          >
            Empowering franchise partners with credit verification and business management tools
          </Typography>
          <Box mt={4}>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/register')}
              endIcon={<ArrowForward />}
              sx={{ 
                mr: 2, 
                px: 4, 
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(98, 0, 234, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(98, 0, 234, 0.4)',
                }
              }}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => navigate('/login')}
              sx={{ 
                px: 4, 
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                color: 'common.white',
                borderColor: 'common.white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'common.white',
                }
              }}
            >
              Login
            </Button>
          </Box>
        </Container>
      </GradientBackground>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography 
          variant="h4" 
          textAlign="center" 
          fontWeight="700" 
          mb={2}
          sx={{ color: 'text.primary' }}
        >
          Why Choose Credit Dost?
        </Typography>
        <Typography 
          variant="body1" 
          textAlign="center" 
          color="text.secondary" 
          mb={6}
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Our platform provides everything you need to grow your franchise business
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureCard>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <IconWrapper color={feature.color}>
                    {feature.icon}
                  </IconWrapper>
                  <Typography variant="h6" fontWeight="700" mb={2}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;