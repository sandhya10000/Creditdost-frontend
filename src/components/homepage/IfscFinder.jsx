import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  styled
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { ifscAPI } from '../../services/api';
import Header from './Header';
import HomePageFooter from './HomePageFooter';

const IfscBackground = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #0a1929 0%, #1a2744 50%, #0d2847 100%)",
  minHeight: "100vh",
  padding: theme.spacing(4, 0),
  display: "flex",
  flexDirection: "column",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "1rem",
  textTransform: "none",
  transition: "all 0.3s ease",
  background: "linear-gradient(90deg, #0ea5e9, #06b6d4, #0ea5e9)",
  backgroundSize: "200% 200%",
  animation: "gradientShift 3s ease infinite",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(14, 165, 233, 0.4)",
  },
}));

const IfscFinder = () => {
  const [ifscCode, setIfscCode] = useState('');
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const validateIfsc = (code) => {
    // IFSC code should be 11 characters: first 4 alphabets, 0, and last 6 alphanumeric
    const ifscRegex = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/;
    return ifscRegex.test(code);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setNotFound(false);
    setBankDetails(null);

    if (!ifscCode) {
      setError('Please enter an IFSC code');
      return;
    }

    if (!validateIfsc(ifscCode)) {
      setError('Please enter a valid IFSC code (11 characters: first 4 alphabets, 0, and last 6 alphanumeric)');
      return;
    }

    setLoading(true);

    try {
      const response = await ifscAPI.getBankDetails(ifscCode);
      
      if (response.data === "Not Found") {
        setNotFound(true);
      } else {
        setBankDetails(response.data);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(err.response?.data?.message || 'Error fetching bank details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <IfscBackground>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 700, 
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              IFSC Code Finder
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Find bank details using IFSC code. Get branch information, address, and contact details instantly.
            </Typography>
          </Box>

          <StyledCard>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  mb: 3, 
                  textAlign: 'center',
                  fontWeight: 600,
                  color: 'white'
                }}
              >
                Enter IFSC Code
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              <Box 
                component="form" 
                onSubmit={handleSearch}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 3 
                }}
              >
                <TextField
                  fullWidth
                  label="IFSC Code"
                  name="ifscCode"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  required
                  variant="outlined"
                  inputProps={{ 
                    maxLength: 11,
                    style: { textTransform: "uppercase" }
                  }}
                  helperText="Format: XXXX0XXXXXX (e.g., HDFC0000123)"
                  InputProps={{
                    sx: {
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(14, 165, 233, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0ea5e9',
                      },
                    }
                  }}
                  InputLabelProps={{
                    sx: {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': {
                        color: '#0ea5e9',
                      },
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                    '& .MuiFormLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  }}
                />
                
                <StyledButton
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                  startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                  sx={{ mt: 2, py: 1.5 }}
                >
                  {loading ? 'Searching...' : 'Find Bank Details'}
                </StyledButton>
              </Box>
            </CardContent>
          </StyledCard>

          {notFound && (
            <StyledCard>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
                  Bank Details Not Found
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  No bank found with the provided IFSC code. Please check the code and try again.
                </Typography>
              </CardContent>
            </StyledCard>
          )}

          {bankDetails && (
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 3, 
                    textAlign: 'center',
                    fontWeight: 600,
                    color: 'white'
                  }}
                >
                  Bank Details
                </Typography>
                
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>Bank Name:</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 500 }}>{bankDetails.BANK}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>Branch:</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 500 }}>{bankDetails.BRANCH}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>Address:</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 500, textAlign: 'right' }}>{bankDetails.ADDRESS}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>City:</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 500 }}>{bankDetails.CITY}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>District:</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 500 }}>{bankDetails.DISTRICT}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>State:</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 500 }}>{bankDetails.STATE}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>IFSC Code:</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 500 }}>{bankDetails.IFSC}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>Contact:</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 500 }}>{bankDetails.CONTACT || 'N/A'}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          )}
        </Container>
      </IfscBackground>
      <HomePageFooter />
    </>
  );
};

export default IfscFinder;