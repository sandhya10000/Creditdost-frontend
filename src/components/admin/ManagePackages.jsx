import React, { useState, useEffect, useMemo } from 'react';

const ACCENT = '#4f46e5';
import {
  Box,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
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
});

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [featureInput, setFeatureInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
        features: pkg.features || [],
        isActive: pkg.isActive,
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
      };

      if (editingPackage) {
        await adminAPI.updatePackage(editingPackage._id, packageData);
        setSuccess('Package updated successfully!');
      } else {
        await adminAPI.createPackage(packageData);
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

  return (
    <Box>
      <PackageHeader
        accent={ACCENT}
        eyebrow="Partner plans"
        title="Franchise Packages"
        subtitle="Plans partners buy. Set the price, GST, credits and features shown to them."
        actionLabel="Add Package"
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
              : 'No franchise packages yet.'
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
          {editingPackage ? 'Edit Franchise Package' : 'New Franchise Package'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="franchise-package-form" onSubmit={handleSubmit}>
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

              <FormSection title="Pricing" hint="Partners pay the total. GST is added on top of the base price.">
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

              <FormSection title="Credits & features" hint="Credits given with this package and what partners get.">
                <Stack spacing={2}>
                  <TextField
                    required
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

              <FormSection title="Visibility">
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography fontWeight={600}>Active</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Inactive packages are hidden from partners.
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
            form="franchise-package-form"
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

export default ManagePackages;
