import React from 'react';
import { Container, Typography, Box, Grid, styled } from '@mui/material';
import { People, AccountBalance, TrendingUp, EmojiEvents } from '@mui/icons-material';

const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: '#007ba7',
  color: 'white',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 800,
  color: 'white',
  marginBottom: theme.spacing(6),
  fontSize: { xs: '2rem', md: '2.5rem' },
}));

const StatCard = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  borderRadius: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 20px',
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 800,
  marginBottom: theme.spacing(1),
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  opacity: 0.9,
}));

const StatsSection = () => {
  const stats = [
    {
      icon: <People sx={{ fontSize: 40, color: 'white' }} />,
      number: '50,000+',
      label: 'Happy Customers'
    },
    {
      icon: <AccountBalance sx={{ fontSize: 40, color: 'white' }} />,
      number: '200+',
      label: 'Financial Partners'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'white' }} />,
      number: '98%',
      label: 'Success Rate'
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40, color: 'white' }} />,
      number: '15+',
      label: 'Industry Awards'
    }
  ];

  return (
    <Section>
      <Container style={{ maxWidth: '1400px' }}>
        <SectionTitle variant="h4">By The Numbers</SectionTitle>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard>
                <IconWrapper>
                  {stat.icon}
                </IconWrapper>
                <StatNumber>
                  {stat.number}
                </StatNumber>
                <StatLabel>
                  {stat.label}
                </StatLabel>
              </StatCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default StatsSection;