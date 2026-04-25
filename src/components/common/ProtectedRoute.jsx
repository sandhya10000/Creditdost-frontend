import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { 
  CircularProgress, 
  Box, 
  Typography,
  Card,
  CardContent,
  styled
} from '@mui/material';
import { Lock } from '@mui/icons-material';

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
}));

const LoadingCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  textAlign: 'center',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
}));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingCard>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Lock sx={{ fontSize: 48, color: 'primary.main' }} />
            </Box>
            <Typography variant="h6" gutterBottom>
              Verifying Access
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please wait while we authenticate your session...
            </Typography>
            <CircularProgress size={40} thickness={4} />
          </CardContent>
        </LoadingCard>
      </LoadingContainer>
    );
  }

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User doesn't have the required role, redirect to appropriate dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'franchise_user') {
      return <Navigate to="/franchise/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has the required role
  return children;
};

export default ProtectedRoute;