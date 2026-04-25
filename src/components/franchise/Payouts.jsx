import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  Alert,
} from '@mui/material';
import { franchiseAPI } from '../../services/api';

const Payouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch payouts on component mount
  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await franchiseAPI.getFranchisePayouts();
      setPayouts(response.data);
    } catch (error) {
      setError('Error fetching payouts');
      console.error('Error fetching payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Payouts
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payout History
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Period</TableCell>
                    <TableCell align="right">Gross Amount (₹)</TableCell>
                    <TableCell align="right">TDS (2%)</TableCell>
                    <TableCell align="right">Net Payout (₹)</TableCell>
                    <TableCell align="right">Credits Generated</TableCell>
                    <TableCell align="right">Referral Bonus</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Processed Date</TableCell>
                    <TableCell>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payouts.length > 0 ? (
                    payouts.map((payout) => (
                      <TableRow key={payout._id}>
                        <TableCell>
                          {new Date(payout.periodStart).toLocaleDateString()} - {new Date(payout.periodEnd).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">₹{payout.grossAmount?.toFixed(2) || (payout.amount + payout.referralBonus).toFixed(2)}</TableCell>
                        <TableCell align="right">₹{payout.tdsAmount?.toFixed(2) || ((payout.amount + payout.referralBonus) * 0.02).toFixed(2)}</TableCell>
                        <TableCell align="right">₹{payout.totalAmount.toFixed(2)}</TableCell>
                        <TableCell align="right">{payout.creditsGenerated}</TableCell>
                        <TableCell align="right">₹{payout.referralBonus.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={payout.status} 
                            color={getStatusColor(payout.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          {payout.processedAt ? new Date(payout.processedAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>{payout.remarks || 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No payouts found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      
      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payout Information
          </Typography>
          <Typography variant="body1" paragraph>
            Payouts are calculated based on your customer package sales and business activity during a specific period.
          </Typography>
          <Typography variant="body1" paragraph>
            Our standard payout schedule is monthly, with payouts processed within 7 business days after the end of each month.
          </Typography>
          <Typography variant="body1" paragraph>
            Payouts include:
          </Typography>
          <ul>
            <li>
              <Typography variant="body2">
                Commission on package purchases based on package settings
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Referral bonuses for successful conversions
              </Typography>
            </li>
          </ul>
          <Typography variant="body2" paragraph sx={{ mt: 2, fontStyle: 'italic' }}>
            Note: Commission rates vary by package. Check each package's details for specific commission percentages.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Payouts;