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
  Chip,
  TextareaAutosize,
} from '@mui/material';
import { 
  Search, 
  Visibility, 
  Check, 
  Close, 
  CheckCircle, 
  Cancel, 
  Pending, 
  Upload 
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { franchiseAPI } from '../../services/api';

const Leads = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false); // Add this
  const [selectedLead, setSelectedLead] = useState(null);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState(''); // Add this
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [csvFile, setCsvFile] = useState(null);

  // Fetch assigned leads on component mount
  useEffect(() => {
    fetchAssignedLeads();
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

  const fetchAssignedLeads = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use the new franchise-specific endpoint
      const response = await franchiseAPI.getFranchiseLeads();
      console.log('Fetched franchise leads:', response.data); // Add this for debugging
      
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (err) {
      setError('Failed to fetch leads. Please try again later.');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filtering is handled by useEffect
  };

  const handleUpdateLeadStatus = async (leadId, status) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Prepare data for the API call
      const updateData = { status };
      
      // If status is 'lost', we need to collect a reason
      if (status === 'lost') {
        // Open the rejection dialog instead of using prompt
        const lead = leads.find(l => l._id === leadId);
        setSelectedLead(lead);
        setRejectDialogOpen(true);
        setLoading(false);
        return;
      }
      
      await franchiseAPI.updateLeadStatus(leadId, updateData);
      setSuccess(`Lead status updated to ${status} successfully!`);
      fetchAssignedLeads(); // Refresh the leads list
    } catch (err) {
      setError('Failed to update lead status. Please try again.');
      console.error('Error updating lead status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectLead = async () => {
    if (!rejectionReason.trim()) {
      setError('Rejection reason is required.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    setRejectDialogOpen(false);
    
    try {
      const updateData = { 
        status: 'lost', 
        rejectionReason 
      };
      
      await franchiseAPI.updateLeadStatus(selectedLead._id, updateData);
      setSuccess('Lead rejected successfully!');
      setRejectionReason('');
      setSelectedLead(null);
      fetchAssignedLeads(); // Refresh the leads list
    } catch (err) {
      setError('Failed to reject lead. Please try again.');
      console.error('Error rejecting lead:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNotes = async () => {
    if (!notes.trim()) {
      setError('Please enter notes.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // In a real implementation, this would call an API endpoint to add notes
      setSuccess('Notes added successfully!');
      handleCloseUploadDialog();
    } catch (err) {
      setError('Failed to add notes. Please try again.');
      console.error('Error adding notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      // In a real implementation, this would upload the file to the server
      setSuccess('File selected for upload. Click "Upload" to process.');
    }
  };

  const handleUploadSubmit = async () => {
    if (!csvFile) {
      setError('Please select a CSV file to upload.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // In a real implementation, this would call an API endpoint to upload the file
      setSuccess('Leads uploaded successfully!');
      setUploadDialogOpen(false);
      setCsvFile(null);
    } catch (err) {
      setError('Failed to upload leads. Please try again.');
      console.error('Error uploading leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUploadDialog = (lead = null) => {
    setSelectedLead(lead);
    setUploadDialogOpen(true);
  };

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
    setSelectedLead(null);
    setNotes('');
    setCsvFile(null);
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setSelectedLead(null);
    setRejectionReason('');
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'new': { label: 'New', color: 'info', icon: <Pending /> },
      'contacted': { label: 'Contacted', color: 'warning', icon: <Pending /> },
      'qualified': { label: 'Qualified', color: 'success', icon: <CheckCircle /> },
      'lost': { label: 'Lost', color: 'error', icon: <Cancel /> },
      'converted': { label: 'Converted', color: 'success', icon: <CheckCircle /> },
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Leads
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
                    <TableCell>Credit Score</TableCell>
                    <TableCell>Status</TableCell>
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
                      <TableCell>{lead.creditScore || 'N/A'}</TableCell>
                      <TableCell>
                        {getStatusChip(lead.status)}
                      </TableCell>
                      <TableCell>{formatDate(lead.createdAt)}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenUploadDialog(lead)}
                        >
                          <Visibility />
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      
      {/* Upload Leads Dialog */}
      <Dialog open={uploadDialogOpen} onClose={handleCloseUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedLead ? 'Lead Details' : 'Upload Leads'}
        </DialogTitle>
        <DialogContent>
          {selectedLead ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedLead.name}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Email:</strong> {selectedLead.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Phone:</strong> {selectedLead.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Credit Score:</strong> {selectedLead.creditScore || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Status:</strong> {getStatusChip(selectedLead.status)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Address:</strong> {selectedLead.address?.street}, {selectedLead.address?.city}, {selectedLead.address?.state} - {selectedLead.address?.pincode}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Add Notes"
                    multiline
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box>
              <Typography sx={{ mb: 2 }}>
                Upload a CSV file containing lead information.
              </Typography>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ marginBottom: '16px' }}
              />
              {csvFile && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Selected file: {csvFile.name}
                </Typography>
              )}
              <Typography variant="body2" color="textSecondary">
                CSV format should include columns: name, email, phone, address, city, state, pincode
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Cancel</Button>
          <Button 
            onClick={selectedLead ? handleAddNotes : handleUploadSubmit} 
            variant="contained"
            disabled={loading || (!selectedLead && !csvFile)}
          >
            {loading ? <CircularProgress size={24} /> : (selectedLead ? 'Add Notes' : 'Upload')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Reject Lead Dialog */}
      <Dialog open={rejectDialogOpen} onClose={handleCloseRejectDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Lead</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Please provide a reason for rejecting this lead:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            variant="outlined"
            placeholder="Enter rejection reason..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>Cancel</Button>
          <Button 
            onClick={handleRejectLead} 
            variant="contained"
            color="error"
            disabled={loading || !rejectionReason.trim()}
          >
            {loading ? <CircularProgress size={24} /> : 'Reject Lead'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Leads;