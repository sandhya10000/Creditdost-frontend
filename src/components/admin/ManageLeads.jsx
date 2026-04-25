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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  TextareaAutosize,
  Divider,
} from '@mui/material';
import { 
  Search, 
  Visibility, 
  Check, 
  Close, 
  CheckCircle, 
  Cancel, 
  Pending, 
  AssignmentInd,
  Add as AddIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { adminAPI } from '../../services/api';

const ManageLeads = () => {
  const [leads, setLeads] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bulkUploadDialogOpen, setBulkUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedFranchise, setSelectedFranchise] = useState('');
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    creditScore: '',
    notes: ''
  });
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Fetch all leads and franchises on component mount
  useEffect(() => {
    fetchLeads();
    fetchFranchises();
  }, []);

  // Filter leads based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLeads(leads);
      return;
    }
    
    const filtered = leads.filter(lead => 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm)
    );
    
    setFilteredLeads(filtered);
  }, [searchTerm, leads]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getAllLeads();
      console.log('Fetched leads:', response.data); // Add this for debugging
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (err) {
      setError('Failed to fetch leads. Please try again later.');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFranchises = async () => {
    try {
      const response = await adminAPI.getAllFranchises();
      console.log('Fetched franchises:', response.data); // Add this for debugging
      setFranchises(response.data);
    } catch (err) {
      console.error('Error fetching franchises:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filtering is handled by useEffect
  };

  const handleCreateLead = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
    setNewLead({
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: ''
      },
      creditScore: '',
      notes: ''
    });
  };

  const handleCreateLeadSubmit = async () => {
    if (!newLead.name || !newLead.phone) {
      setError('Name and phone are required.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const leadData = {
        ...newLead,
        creditScore: newLead.creditScore ? parseInt(newLead.creditScore) : undefined
      };
      
      await adminAPI.createLead(leadData);
      setSuccess('Lead created successfully!');
      handleCloseCreateDialog();
      fetchLeads();
    } catch (err) {
      setError('Failed to create lead. Please try again.');
      console.error('Error creating lead:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignLead = (lead) => {
    setSelectedLead(lead);
    setAssignDialogOpen(true);
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedLead(null);
    setSelectedFranchise('');
  };

  const handleAssignSubmit = async () => {
    if (!selectedFranchise) {
      setError('Please select a franchise to assign the lead to.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await adminAPI.updateLead(selectedLead._id, { 
        franchiseId: selectedFranchise,
        status: 'assigned'
      });
      setSuccess('Lead assigned successfully!');
      handleCloseAssignDialog();
      fetchLeads();
    } catch (err) {
      setError('Failed to assign lead. Please try again.');
      console.error('Error assigning lead:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeadStatus = async (leadId, status) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await adminAPI.updateLead(leadId, { status });
      setSuccess(`Lead status updated to ${status} successfully!`);
      fetchLeads();
    } catch (err) {
      setError('Failed to update lead status. Please try again.');
      console.error('Error updating lead status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = (lead) => {
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await adminAPI.deleteLead(leadToDelete._id);
      setSuccess('Lead deleted successfully!');
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
      fetchLeads();
    } catch (err) {
      setError('Failed to delete lead. Please try again.');
      console.error('Error deleting lead:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelDeleteLead = () => {
    setDeleteDialogOpen(false);
    setLeadToDelete(null);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'new': { label: 'New', color: 'info', icon: <Pending /> },
      'contacted': { label: 'Contacted', color: 'warning', icon: <Pending /> },
      'qualified': { label: 'Qualified', color: 'success', icon: <CheckCircle /> },
      'lost': { label: 'Lost', color: 'error', icon: <Cancel /> },
      'converted': { label: 'Converted', color: 'success', icon: <CheckCircle /> },
      'assigned': { label: 'Assigned', color: 'primary', icon: <AssignmentInd /> },
    };
    
    const config = statusConfig[status] || { label: status, color: 'default' };
    
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleNewLeadChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties like address.street
      const [parent, child] = name.split('.');
      setNewLead(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNewLead(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Bulk upload functions
  const handleOpenBulkUploadDialog = () => {
    setBulkUploadDialogOpen(true);
  };

  const handleCloseBulkUploadDialog = () => {
    setBulkUploadDialogOpen(false);
    setCsvFile(null);
    setUploadProgress(0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is CSV
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setError('Please upload a valid CSV file.');
        return;
      }
      setCsvFile(file);
      setError('');
    }
  };

  const handleBulkUploadSubmit = async () => {
    if (!csvFile) {
      setError('Please select a CSV file to upload.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('csvFile', csvFile);

      const response = await adminAPI.bulkUploadLeads(formData);
      
      if (response.data.errors && response.data.errors.length > 0) {
        setError(`Upload completed with ${response.data.errors.length} errors. Check console for details.`);
        console.error('Upload errors:', response.data.errors);
      } else {
        setSuccess(`Successfully uploaded ${response.data.successCount} leads!`);
      }
      
      // Refresh leads list
      fetchLeads();
      handleCloseBulkUploadDialog();
    } catch (err) {
      setError('Failed to upload leads. Please try again.');
      console.error('Error uploading leads:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Leads
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box component="form" onSubmit={handleSearch} sx={{ width: '70%' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    placeholder="Search leads by name, email, or phone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Search'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={handleOpenBulkUploadDialog}
                sx={{ mr: 1 }}
              >
                Bulk Upload
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateLead}
              >
                Create Lead
              </Button>
            </Box>
          </Box>
          
          {loading && filteredLeads.length === 0 ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="leads table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow
                      key={lead._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {lead.name}
                      </TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>
                        {getStatusChip(lead.status)}
                      </TableCell>
                      <TableCell>
                        {lead.franchiseId ? 
                          (typeof lead.franchiseId === 'object' ? 
                            lead.franchiseId.businessName : 
                            franchises.find(f => f._id === lead.franchiseId)?.businessName || 'Unknown Franchise') : 
                          'Not Assigned'
                        }
                      </TableCell>
                      <TableCell>{formatDate(lead.createdAt)}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleAssignLead(lead)}
                        >
                          <AssignmentInd />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleUpdateLeadStatus(lead._id, 'qualified')}
                          sx={{ color: 'success.main' }}
                        >
                          <Check />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleUpdateLeadStatus(lead._id, 'lost')}
                          sx={{ color: 'error.main' }}
                        >
                          <Close />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteLead(lead)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      
      {/* Create Lead Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Lead</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={newLead.name}
                onChange={handleNewLeadChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newLead.email}
                onChange={handleNewLeadChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={newLead.phone}
                onChange={handleNewLeadChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Street"
                name="address.street"
                value={newLead.address.street}
                onChange={handleNewLeadChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="address.city"
                value={newLead.address.city}
                onChange={handleNewLeadChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="address.state"
                value={newLead.address.state}
                onChange={handleNewLeadChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pincode"
                name="address.pincode"
                value={newLead.address.pincode}
                onChange={handleNewLeadChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credit Score"
                name="creditScore"
                type="number"
                value={newLead.creditScore}
                onChange={handleNewLeadChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={3}
                value={newLead.notes}
                onChange={handleNewLeadChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateLeadSubmit} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Lead'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Assign Lead Dialog */}
      <Dialog open={assignDialogOpen} onClose={handleCloseAssignDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Lead to Franchise</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Assign lead "{selectedLead?.name}" to a franchise partner.
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Franchise</InputLabel>
            <Select
              value={selectedFranchise}
              onChange={(e) => setSelectedFranchise(e.target.value)}
              label="Select Franchise"
            >
              {franchises
                .filter(franchise => franchise.isActive && franchise.kycStatus === 'approved')
                .map((franchise) => (
                  <MenuItem key={franchise._id} value={franchise._id}>
                    {franchise.businessName} ({franchise.ownerName})
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button 
            onClick={handleAssignSubmit} 
            variant="contained"
            disabled={!selectedFranchise || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Assign Lead'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Bulk Upload Dialog */}
      <Dialog open={bulkUploadDialogOpen} onClose={handleCloseBulkUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Upload Leads</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Upload a CSV file containing lead information.
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            CSV Format Requirements:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            The CSV file should contain the following columns:
          </Typography>
          <ul>
            <li><strong>name</strong> (required)</li>
            <li><strong>phone</strong> (required)</li>
            <li><strong>email</strong> (optional)</li>
            <li><strong>address</strong> (optional)</li>
            <li><strong>city</strong> (optional)</li>
            <li><strong>state</strong> (optional)</li>
            <li><strong>pincode</strong> (optional)</li>
            <li><strong>creditScore</strong> (optional)</li>
            <li><strong>creditReportUrl</strong> (optional)</li>
          </ul>
          
          <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
            <a 
              href="/templates/leads-template.csv" 
              download="leads-template.csv"
              style={{ color: '#1976d2', textDecoration: 'none' }}
            >
              Download CSV Template
            </a>
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ marginBottom: '16px' }}
          />
          
          {csvFile && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected file: {csvFile.name}
            </Typography>
          )}
          
          {uploadProgress > 0 && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Upload progress: {uploadProgress}%
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBulkUploadDialog}>Cancel</Button>
          <Button 
            onClick={handleBulkUploadSubmit} 
            variant="contained"
            disabled={loading || !csvFile}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload Leads'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Lead Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDeleteLead}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the lead '<strong>{leadToDelete?.name}</strong>'?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteLead}>Cancel</Button>
          <Button 
            onClick={confirmDeleteLead} 
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Lead Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDeleteLead}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the lead '<strong>{leadToDelete?.name}</strong>'?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteLead}>Cancel</Button>
          <Button 
            onClick={confirmDeleteLead} 
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageLeads;