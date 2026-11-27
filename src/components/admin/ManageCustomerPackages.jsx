import React, { useState, useEffect, useMemo } from 'react';

const ACCENT = '#0891b2';
import {
  Box,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Checkbox,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  SearchOutlined,
  CheckCircleOutline,
  Inventory2Outlined,
  PauseCircleOutline,
} from '@mui/icons-material';
import { adminAPI } from '../../services/api';
import {
  FeatureEditor,
  FormSection,
  PackageAlerts,
  PackageCard,
  PackageGridEmpty,
  PackageTag,
  PackageHeader,
  PackageStats,
  PricePreview,
} from './PackageUi';

const emptyForm = () => ({
  name: '',
  description: '',
  price: '',
  gstPercentage: 0,
  creditsIncluded: '',
  features: [],
  isActive: true,
  availableForPackages: [],
  // Business payout settings (kept in the payload; the UI for them is not shown)
  businessPayoutPercentage: 20,
  businessPayoutType: 'percentage',
  businessPayoutFixedAmount: 0,
});

const ManageCustomerPackages = () => {
  const [packages, setPackages] = useState([]);
  const [franchisePackages, setFranchisePackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [featureInput, setFeatureInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch all customer packages and franchise packages on component mount
  useEffect(() => {
    fetchPackages();
    fetchFranchisePackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getAllCustomerPackages();
      setPackages(response.data);
    } catch (err) {
      setError('Failed to fetch customer packages. Please try again later.');
      console.error('Error fetching customer packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFranchisePackages = async () => {
    try {
      const response = await adminAPI.getAllPackages();
      setFranchisePackages(response.data);
    } catch (err) {
      console.error('Error fetching franchise packages:', err);
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
        features: pkg.features || [],
        isActive: pkg.isActive,
        availableForPackages: pkg.availableForPackages || [],
        businessPayoutPercentage: pkg.businessPayoutPercentage || 20,
        businessPayoutType: pkg.businessPayoutType || 'percentage',
        businessPayoutFixedAmount: pkg.businessPayoutFixedAmount || 0,
      });
    } else {
      setEditingPackage(null);
      setFormData(emptyForm());
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPackage(null);
    setFeatureInput('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePackageSelection = (selectedPackageIds) => {
    setFormData((prev) => ({ ...prev, availableForPackages: selectedPackageIds }));
  };

  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !formData.features.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, trimmed] }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (featureToRemove) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature !== featureToRemove),
    }));
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
        availableForPackages: formData.availableForPackages || [],
      };

      if (editingPackage) {
        await adminAPI.updateCustomerPackage(editingPackage._id, packageData);
        setSuccess('Customer package updated successfully!');
      } else {
        await adminAPI.createCustomerPackage(packageData);
        setSuccess('Customer package created successfully!');
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
    if (!window.confirm('Are you sure you want to delete this customer package?')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminAPI.deleteCustomerPackage(id);
      setSuccess('Customer package deleted successfully!');
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
      await adminAPI.updateCustomerPackage(id, { isActive: !currentStatus });
      setSuccess('Package status updated successfully!');
      fetchPackages();
    } catch (err) {
      setError('Failed to update package status. Please try again.');
      console.error('Error updating package status:', err);
    } finally {
      setLoading(false);
    }
  };

  const franchiseNameById = useMemo(
    () => Object.fromEntries(franchisePackages.map((fp) => [fp._id, fp.name])),
    [franchisePackages],
  );

  const counts = useMemo(() => {
    const active = packages.filter((pkg) => pkg.isActive).length;
    return { total: packages.length, active, inactive: packages.length - active };
  }, [packages]);

  const visiblePackages = useMemo(() => {
    const query = search.trim().toLowerCase();
    return packages.filter((pkg) => {
      if (statusFilter === 'active' && !pkg.isActive) return false;
      if (statusFilter === 'inactive' && pkg.isActive) return false;
      if (!query) return true;
      return (
        pkg.name?.toLowerCase().includes(query) ||
        pkg.description?.toLowerCase().includes(query)
      );
    });
  }, [packages, search, statusFilter]);

  const isFiltering = Boolean(search.trim()) || statusFilter !== 'all';

  // Footer tag: which franchise packages can offer this customer package
  const availabilityFooter = (pkg) => {
    const ids = pkg.availableForPackages || [];
    if (ids.length === 0) {
      return <PackageTag accent={ACCENT}>Sold via all franchise packages</PackageTag>;
    }
    const names = ids.map((id) => franchiseNameById[id] || 'Unknown');
    return (
      <PackageTag title={names.join(', ')} accent={ACCENT}>
        Via {names.length === 1 ? names[0] : `${names.length} franchise packages`}
      </PackageTag>
    );
  };

  return (
    <Box>
      <PackageHeader
        accent={ACCENT}
        eyebrow="Customer plans"
        title="Customer Packages"
        subtitle="Packages sold to customers. Choose which franchise packages can offer each one."
        actionLabel="Add Customer Package"
        onAction={() => handleOpenDialog()}
      />

      <PackageAlerts error={error} success={success} />

      <PackageStats total={counts.total} active={counts.active} inactive={counts.inactive} accent={ACCENT} />

      {/* Toolbar */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <TextField
          size="small"
          placeholder="Search by name or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: { md: 320 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <ToggleButtonGroup
          size="small"
          exclusive
          value={statusFilter}
          onChange={(_, value) => value && setStatusFilter(value)}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="active">Active</ToggleButton>
          <ToggleButton value="inactive">Inactive</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {loading && packages.length === 0 ? (
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress />
        </Box>
      ) : visiblePackages.length === 0 ? (
        <PackageGridEmpty
          accent={ACCENT}
          message={
            isFiltering
              ? 'No packages match your search or filter.'
              : 'No customer packages yet.'
          }
          actionLabel={isFiltering ? 'Clear search and filter' : 'Add the first package'}
          onAction={
            isFiltering
              ? () => {
                  setSearch('');
                  setStatusFilter('all');
                }
              : () => handleOpenDialog()
          }
        />
      ) : (
        <Grid container spacing={2.5}>
          {visiblePackages.map((pkg) => (
            <Grid item xs={12} sm={6} lg={4} key={pkg._id}>
              <PackageCard
                pkg={pkg}
                accent={ACCENT}
                busy={loading}
                footer={availabilityFooter(pkg)}
                onEdit={() => handleOpenDialog(pkg)}
                onDelete={() => handleDelete(pkg._id)}
                onToggle={() => handleToggleStatus(pkg._id, pkg.isActive)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add / edit form */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingPackage ? 'Edit Customer Package' : 'New Customer Package'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="customer-package-form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormSection title="Basics">
                <Stack spacing={2}>
                  <TextField
                    required
                    fullWidth
                    label="Package name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
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
                </Stack>
              </FormSection>

              <FormSection title="Pricing" hint="Customers pay the total. GST is added on top of the base price.">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Base price (₹)"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="GST (%)"
                      name="gstPercentage"
                      type="number"
                      value={formData.gstPercentage}
                      onChange={handleInputChange}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <PricePreview price={formData.price} gstPercentage={formData.gstPercentage} accent={ACCENT} />
                  </Grid>
                </Grid>
              </FormSection>

              <FormSection title="Credits & features">
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Credits included"
                    name="creditsIncluded"
                    type="number"
                    value={formData.creditsIncluded}
                    onChange={handleInputChange}
                    inputProps={{ min: 0 }}
                  />
                  <FeatureEditor
                    accent={ACCENT}
                    features={formData.features}
                    input={featureInput}
                    onInputChange={setFeatureInput}
                    onAdd={handleAddFeature}
                    onRemove={handleRemoveFeature}
                  />
                </Stack>
              </FormSection>

              <FormSection
                title="Available through franchise packages"
                hint="Leave empty to offer this package through every franchise package."
              >
                <FormControl fullWidth>
                  <InputLabel id="franchise-packages-label">Franchise packages</InputLabel>
                  <Select
                    labelId="franchise-packages-label"
                    label="Franchise packages"
                    multiple
                    value={formData.availableForPackages}
                    onChange={(e) => handlePackageSelection(e.target.value)}
                    renderValue={(selected) => (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {selected.length === 0 && 'All franchise packages'}
                        {selected.map((id) => (
                          <Chip
                            key={id}
                            size="small"
                            label={franchiseNameById[id] || 'Unknown'}
                          />
                        ))}
                      </Stack>
                    )}
                  >
                    {franchisePackages.map((pkg) => (
                      <MenuItem key={pkg._id} value={pkg._id}>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={formData.availableForPackages.includes(pkg._id)}
                            tabIndex={-1}
                          />
                        </ListItemIcon>
                        <ListItemText primary={pkg.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormSection>

              <FormSection title="Visibility">
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography fontWeight={600}>Active</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Inactive packages are hidden from customers.
                    </Typography>
                  </Box>
                  <Switch
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    name="isActive"
                    color="success"
                  />
                </Stack>
              </FormSection>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            type="submit"
            form="customer-package-form"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : editingPackage ? 'Save changes' : 'Create package'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageCustomerPackages;
