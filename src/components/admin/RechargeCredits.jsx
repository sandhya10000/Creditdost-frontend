import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Chip,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { adminAPI } from '../../services/api';

const RechargeCredits = () => {
  const [franchises, setFranchises] = useState([]);
  const [selectedFranchise, setSelectedFranchise] = useState('');
  const [credits, setCredits] = useState('');
  const [remarks, setRemarks] = useState('');
  const [mode, setMode] = useState('add'); // 'add' | 'deduct'
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [formErrors, setFormErrors] = useState({});

  // Fetch franchises with credits
  useEffect(() => {
    fetchFranchises();
    fetchRechargeHistory();
  }, []);

  const fetchFranchises = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllFranchisesWithCredits();
      setFranchises(response.data);
    } catch (error) {
      showNotification('Error fetching franchises', 'error');
      console.error('Error fetching franchises:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRechargeHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await adminAPI.getCreditRechargeHistory();
      setRechargeHistory(response.data);
    } catch (error) {
      showNotification('Error fetching recharge history', 'error');
      console.error('Error fetching recharge history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const showNotification = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const validateForm = () => {
    const errors = {};
    if (!selectedFranchise) {
      errors.franchise = 'Please select a franchise';
    }
    if (!credits || credits <= 0) {
      errors.credits = 'Please enter a valid number of credits';
    }
    if (mode === 'deduct' && selectedFranchise && credits > 0) {
      const franchise = franchises.find(f => f._id === selectedFranchise);
      if (franchise && parseInt(credits) > (franchise.credits || 0)) {
        errors.credits = `Insufficient balance. Available: ${franchise.credits || 0}`;
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRecharge = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await adminAPI.rechargeFranchiseCredits({
        franchiseId: selectedFranchise,
        credits: parseInt(credits),
        remarks,
        type: mode
      });

      showNotification(response.data.message);
      // Reset form
      setSelectedFranchise('');
      setCredits('');
      setRemarks('');
      // Refresh data
      fetchFranchises();
      fetchRechargeHistory();
    } catch (error) {
      showNotification(
        error.response?.data?.message || (mode === 'deduct' ? 'Error deducting credits' : 'Error recharging credits'),
        'error'
      );
      console.error('Error adjusting credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFranchiseName = (franchiseId) => {
    const franchise = franchises.find(f => f._id === franchiseId);
    return franchise ? franchise.businessName : 'Unknown Franchise';
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Manage Credits
      </Typography>

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(e, value) => value && setMode(value)}
        sx={{ mb: 1 }}
      >
        <ToggleButton value="add" color="success">Add Funds</ToggleButton>
        <ToggleButton value="deduct" color="error">Deduct Funds</ToggleButton>
      </ToggleButtonGroup>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity} 
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {/* Recharge Form */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {mode === 'deduct' ? 'Deduct Credits' : 'Credit Recharge'}
              </Typography>
              
              <FormControl fullWidth margin="normal" error={!!formErrors.franchise}>
                <InputLabel>Select Franchise</InputLabel>
                <Select
                  value={selectedFranchise}
                  onChange={(e) => setSelectedFranchise(e.target.value)}
                  label="Select Franchise"
                >
                  {franchises.map((franchise) => (
                    <MenuItem key={franchise._id} value={franchise._id}>
                      {franchise.businessName} (Credits: {franchise.credits})
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.franchise && (
                  <Typography color="error" variant="caption">
                    {formErrors.franchise}
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                label={mode === 'deduct' ? 'Credits to Deduct' : 'Credits to Add'}
                type="number"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                margin="normal"
                error={!!formErrors.credits}
                helperText={formErrors.credits}
                inputProps={{ min: 1 }}
              />

              <TextField
                fullWidth
                label="Remarks (Optional)"
                multiline
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                margin="normal"
              />

              <Button
                variant="contained"
                color={mode === 'deduct' ? 'error' : 'primary'}
                onClick={handleRecharge}
                disabled={loading}
                sx={{ mt: 2 }}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Processing...' : (mode === 'deduct' ? 'Deduct Credits' : 'Recharge Credits')}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Credit Balance Overview */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Franchise Credit Balances
              </Typography>
              
              {loading ? (
                <Box display="flex" justifyContent="center" my={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Franchise</TableCell>
                        <TableCell align="right">Credits</TableCell>
                        <TableCell align="right">Total Purchased</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {franchises.map((franchise) => (
                        <TableRow 
                          key={franchise._id} 
                          selected={franchise._id === selectedFranchise}
                        >
                          <TableCell component="th" scope="row">
                            {franchise.businessName}
                          </TableCell>
                          <TableCell align="right">{franchise.credits}</TableCell>
                          <TableCell align="right">{franchise.totalCreditsPurchased}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recharge History */}
        <Grid item xs={12}>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recharge History
              </Typography>
              
              {historyLoading ? (
                <Box display="flex" justifyContent="center" my={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Franchise</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Credits</TableCell>
                        <TableCell>Remarks</TableCell>
                        <TableCell>Admin</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rechargeHistory.length > 0 ? (
                        rechargeHistory.map((transaction) => (
                          <TableRow key={transaction._id}>
                            <TableCell>
                              {new Date(transaction.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {transaction.userId ? transaction.userId.name : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {transaction.paymentMethod === 'admin_deduct' ? (
                                <Chip label="Deduct" color="error" size="small" />
                              ) : (
                                <Chip label="Add" color="success" size="small" />
                              )}
                            </TableCell>
                            <TableCell align="right">
                              {transaction.paymentMethod === 'admin_deduct' ? '-' : '+'}
                              {transaction.metadata?.creditsDeducted ?? transaction.metadata?.creditsAdded ?? 0}
                            </TableCell>
                            <TableCell>{transaction.remarks}</TableCell>
                            <TableCell>
                              {transaction.metadata?.adminId || 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                              No recharge history found
                            </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RechargeCredits;