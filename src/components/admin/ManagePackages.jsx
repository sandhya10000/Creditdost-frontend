import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Autocomplete,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, Check, Close } from '@mui/icons-material';
import { adminAPI } from '../../services/api';

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    gstPercentage: 0,
    creditsIncluded: '',
    features: [], // Add features field
    isActive: true,
    // Business payout settings
    businessPayoutPercentage: 20,
    businessPayoutType: 'percentage',
    businessPayoutFixedAmount: 0,
  });
  const [featureInput, setFeatureInput] = useState(''); // Add feature input state

  // Fetch all packages on component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getAllPackages();
      setPackages(response.data);
    } catch (err) {
      setError('Failed to fetch packages. Please try again later.');
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name,
        description: pkg.description,
        price: pkg.price,
        gstPercentage: pkg.gstPercentage || 0,
        creditsIncluded: pkg.creditsIncluded,
        features: pkg.features || [], // Add features
        isActive: pkg.isActive,
        // Business payout settings
        businessPayoutPercentage: pkg.businessPayoutPercentage || 20,
        businessPayoutType: pkg.businessPayoutType || 'percentage',
        businessPayoutFixedAmount: pkg.businessPayoutFixedAmount || 0,
      });
    } else {
      setEditingPackage(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        gstPercentage: 0,
        creditsIncluded: '',
        features: [], // Add features
        isActive: true,
        // Business payout settings
        businessPayoutPercentage: 20,
        businessPayoutType: 'percentage',
        businessPayoutFixedAmount: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPackage(null);
    setFeatureInput(''); // Reset feature input
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()],
      });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (featureToRemove) => {
    setFormData({
      ...formData,
      features: formData.features.filter(feature => feature !== featureToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Convert price and credits to numbers
      const packageData = {
        ...formData,
        price: Number(formData.price),
        gstPercentage: Number(formData.gstPercentage),
        creditsIncluded: Number(formData.creditsIncluded),
      };
      
      if (editingPackage) {
        // Update existing package
        const response = await adminAPI.updatePackage(editingPackage._id, packageData);
        setSuccess('Package updated successfully!');
      } else {
        // Create new package
        const response = await adminAPI.createPackage(packageData);
        setSuccess('Package created successfully!');
      }
      
      // Refresh the package list
      fetchPackages();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save package. Please try again.');
      console.error('Error saving package:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await adminAPI.deletePackage(id);
      setSuccess('Package deleted successfully!');
      fetchPackages();
    } catch (err) {
      setError('Failed to delete package. Please try again.');
      console.error('Error deleting package:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await adminAPI.updatePackage(id, { isActive: !currentStatus });
      setSuccess('Package status updated successfully!');
      fetchPackages();
    } catch (err) {
      setError('Failed to update package status. Please try again.');
      console.error('Error updating package status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Franchise Packages
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Add Package
            </Button>
          </Box>
          
          {loading && packages.length === 0 ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="packages table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Base Price</TableCell>
                    <TableCell>GST</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell>Credits</TableCell>
                    <TableCell>Features</TableCell>
                    <TableCell>Payout Settings</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow
                      key={pkg._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {pkg.name}
                      </TableCell>
                      <TableCell>{pkg.description}</TableCell>
                      <TableCell>₹{pkg.price}</TableCell>
                      <TableCell>{pkg.gstPercentage || 0}%</TableCell>
                      <TableCell>₹{Number(pkg.price) + (Number(pkg.price) * (pkg.gstPercentage || 0) / 100)}</TableCell>
                      <TableCell>{pkg.creditsIncluded}</TableCell>
                      <TableCell>
                        {pkg.features && pkg.features.length > 0 ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {pkg.features.map((feature, index) => (
                              <Chip key={index} label={feature} size="small" />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No features
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {pkg.businessPayoutType === 'percentage' ? (
                          <Typography variant="body2">
                            {pkg.businessPayoutPercentage}% of package price
                          </Typography>
                        ) : (
                          <Typography variant="body2">
                            ₹{pkg.businessPayoutFixedAmount} fixed
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {pkg.isActive ? (
                          <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                            Active
                          </Typography>
                        ) : (
                          <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                            Inactive
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog(pkg)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(pkg._id)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete />
                        </IconButton>
                        <Switch
                          checked={pkg.isActive}
                          onChange={() => handleToggleStatus(pkg._id, pkg.isActive)}
                          color="primary"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPackage ? 'Edit Package' : 'Add New Package'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Package Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Base Price (₹)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="GST Percentage (%)"
                  name="gstPercentage"
                  type="number"
                  value={formData.gstPercentage}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                  helperText={`Total Price: ₹${Number(formData.price) + (Number(formData.price) * (Number(formData.gstPercentage) || 0) / 100)}`}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Credits Included"
                  name="creditsIncluded"
                  type="number"
                  value={formData.creditsIncluded}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Add Feature"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  helperText="Press Enter to add a feature"
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {formData.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      onDelete={() => handleRemoveFeature(feature)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
              
              {/* Business Payout Settings */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Business Payout Settings
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Payout Type"
                  name="businessPayoutType"
                  value={formData.businessPayoutType}
                  onChange={handleInputChange}
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </TextField>
              </Grid>
              
              {formData.businessPayoutType === 'percentage' ? (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Payout Percentage (%)"
                    name="businessPayoutPercentage"
                    type="number"
                    value={formData.businessPayoutPercentage}
                    onChange={handleInputChange}
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                  />
                </Grid>
              ) : (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fixed Payout Amount (₹)"
                    name="businessPayoutFixedAmount"
                    type="number"
                    value={formData.businessPayoutFixedAmount}
                    onChange={handleInputChange}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Switch
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    name="isActive"
                    color="primary"
                  />
                  <Typography>Active</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (editingPackage ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagePackages;