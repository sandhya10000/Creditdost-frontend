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
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { adminAPI } from '../../services/api';

const ManageReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [packages, setPackages] = useState([]);
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [newSetting, setNewSetting] = useState({ packageId: '', bonusPercentage: '' });

  useEffect(() => {
    fetchReferrals();
    fetchPackages();
    fetchReferralSettings();
  }, []);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllReferrals();
      setReferrals(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch referrals';
      setError(errorMessage);
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await adminAPI.getAllPackages();
      setPackages(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch packages';
      setError(errorMessage);
      console.error('Error fetching packages:', error);
    }
  };

  const fetchReferralSettings = async () => {
    try {
      const response = await adminAPI.getReferralSettings();
      setSettings(response.data?.value || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch referral settings';
      setError(errorMessage);
      console.error('Error fetching referral settings:', error);
    }
  };

  const handleAddSetting = async () => {
    try {
      if (!newSetting.packageId || !newSetting.bonusPercentage) {
        setError('Please fill all fields');
        return;
      }

      // Validate bonus percentage
      const bonusPercentage = parseFloat(newSetting.bonusPercentage);
      if (isNaN(bonusPercentage) || bonusPercentage < 0 || bonusPercentage > 100) {
        setError('Bonus percentage must be a number between 0 and 100');
        return;
      }

      const updatedSettings = [...settings, { ...newSetting, bonusPercentage }];
      console.log('Sending referral settings update:', { value: updatedSettings });
      
      const response = await adminAPI.updateReferralSettings({ value: updatedSettings });
      console.log('Received response:', response);
      
      setSuccess(response.data?.message || 'Referral setting added successfully');
      setNewSetting({ packageId: '', bonusPercentage: '' });
      fetchReferralSettings();
      setOpenSettingsDialog(false);
    } catch (error) {
      console.error('Full error object:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add referral setting';
      setError(errorMessage);
      console.error('Error adding referral setting:', error);
    }
  };

  const handleDeleteSetting = async (index) => {
    try {
      const updatedSettings = settings.filter((_, i) => i !== index);
      const response = await adminAPI.updateReferralSettings({ value: updatedSettings });
      
      setSuccess(response.data?.message || 'Referral setting deleted successfully');
      fetchReferralSettings();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete referral setting';
      setError(errorMessage);
      console.error('Error deleting referral setting:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'registered': return 'info';
      case 'purchased': return 'primary';
      case 'credited': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Referrals
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Referral Records
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="referrals table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Referrer</TableCell>
                        <TableCell>Referred</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Bonus Amount</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {referrals.map((referral) => (
                        <TableRow
                          key={referral._id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>
                            {referral.referrerFranchiseId?.businessName || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {referral.referredFranchiseId?.businessName || referral.referredName}
                          </TableCell>
                          <TableCell>{referral.referredEmail}</TableCell>
                          <TableCell>{referral.referredPhone}</TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              color={getStatusColor(referral.status)}
                              sx={{ fontWeight: 'bold' }}
                            >
                              {referral.status}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {referral.bonusAmount > 0 ? `${referral.bonusAmount} credits` : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Referral Settings
              </Typography>
              
              <Button 
                variant="contained" 
                onClick={() => setOpenSettingsDialog(true)}
                sx={{ mb: 2 }}
              >
                Add New Setting
              </Button>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Package</TableCell>
                      <TableCell>Bonus %</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {settings.map((setting, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {packages.find(p => p._id === setting.packageId)?.name || 'Unknown Package'}
                        </TableCell>
                        <TableCell>{setting.bonusPercentage}%</TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            color="error" 
                            onClick={() => handleDeleteSetting(index)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Add Setting Dialog */}
      <Dialog open={openSettingsDialog} onClose={() => setOpenSettingsDialog(false)}>
        <DialogTitle>Add Referral Setting</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Package</InputLabel>
            <Select
              value={newSetting.packageId}
              onChange={(e) => setNewSetting({...newSetting, packageId: e.target.value})}
              label="Package"
            >
              {packages.map((pkg) => (
                <MenuItem key={pkg._id} value={pkg._id}>
                  {pkg.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Bonus Percentage"
            type="number"
            value={newSetting.bonusPercentage}
            onChange={(e) => setNewSetting({...newSetting, bonusPercentage: e.target.value})}
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: <Typography>%</Typography>
            }}
            inputProps={{
              min: 0,
              max: 100,
              step: 0.1
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSettingsDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSetting} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageReferrals;