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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { adminAPI } from '../../services/api';

const ManageDigitalAgreements = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch all digital agreements on component mount
  useEffect(() => {
    fetchAllDigitalAgreements();
  }, []);

  const fetchAllDigitalAgreements = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getAllDigitalAgreements();
      setAgreements(response.data);
    } catch (err) {
      setError('Failed to fetch digital agreements');
      console.error('Error fetching digital agreements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (agreement) => {
    setSelectedAgreement(agreement);
    setOpenApproveDialog(true);
  };

  const handleRejectClick = (agreement) => {
    setSelectedAgreement(agreement);
    setOpenRejectDialog(true);
  };

  const handleDownloadSignedPdf = async (agreementId) => {
    try {
      setDownloading(true);
      setError('');
      
      const response = await adminAPI.downloadSignedDigitalAgreement(agreementId);
      
      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `signed_agreement_${agreementId}.pdf`);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSuccess('Signed PDF downloaded successfully!');
    } catch (err) {
      setError('Failed to download signed PDF');
      console.error('Error downloading signed PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleApproveAgreement = async () => {
    try {
      setApproving(true);
      setError('');
      
      const response = await adminAPI.approveDigitalAgreement(selectedAgreement._id);
      
      setSuccess('Digital agreement approved successfully!');
      
      // Update the agreement in the list
      setAgreements(agreements.map(agreement => 
        agreement._id === selectedAgreement._id 
          ? response.data.agreement 
          : agreement
      ));
      
      setOpenApproveDialog(false);
      setSelectedAgreement(null);
    } catch (err) {
      setError('Failed to approve digital agreement');
      console.error('Error approving digital agreement:', err);
    } finally {
      setApproving(false);
    }
  };

  const handleRejectAgreement = async () => {
    try {
      setRejecting(true);
      setError('');
      
      const response = await adminAPI.rejectDigitalAgreement(selectedAgreement._id, { rejectionReason });
      
      setSuccess('Digital agreement rejected successfully!');
      
      // Update the agreement in the list
      setAgreements(agreements.map(agreement => 
        agreement._id === selectedAgreement._id 
          ? response.data.agreement 
          : agreement
      ));
      
      setOpenRejectDialog(false);
      setSelectedAgreement(null);
      setRejectionReason('');
    } catch (err) {
      setError('Failed to reject digital agreement');
      console.error('Error rejecting digital agreement:', err);
    } finally {
      setRejecting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'submitted':
        return 'warning';
      case 'signed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'downloaded':
        return 'Downloaded';
      case 'signed':
        return 'Signed';
      case 'submitted':
        return 'Submitted for Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Digital Agreements
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
          <Typography variant="h6" gutterBottom>
            Submitted Agreements
          </Typography>
          
          {agreements.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              No digital agreements found
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Franchise</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agreements.map((agreement) => (
                    <TableRow key={agreement._id}>
                      <TableCell>
                        <Typography variant="body2">{agreement.userId?.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {agreement.userId?.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {agreement.franchiseId?.businessName || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusText(agreement.status)} 
                          color={getStatusColor(agreement.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(agreement.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {agreement.status === 'submitted' && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton 
                                  size="small" 
                                  color="success"
                                  onClick={() => handleApproveClick(agreement)}
                                >
                                  <CheckIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleRejectClick(agreement)}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          
                          {agreement.status === 'signed' && (
                            <Tooltip title="Download Signed PDF">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDownloadSignedPdf(agreement._id)}
                                disabled={downloading}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small"
                              onClick={() => {
                                setSelectedAgreement(agreement);
                                setOpenApproveDialog(true);
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      
      {/* Approve Agreement Dialog */}
      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAgreement && selectedAgreement.status === 'submitted' 
            ? 'Approve Digital Agreement' 
            : 'Digital Agreement Details'}
        </DialogTitle>
        <DialogContent>
          {selectedAgreement && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedAgreement.userName}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="body1">
                  Status: <strong>{getStatusText(selectedAgreement.status)}</strong>
                </Typography>
                <Chip 
                  label={getStatusText(selectedAgreement.status)} 
                  color={getStatusColor(selectedAgreement.status)}
                  size="small"
                />
              </Box>
              
              <Typography variant="body2" paragraph>
                Franchise: {selectedAgreement.franchiseId?.businessName || 'N/A'}
              </Typography>
              
              <Typography variant="body2" paragraph>
                Created: {new Date(selectedAgreement.createdAt).toLocaleString()}
              </Typography>
              
              {selectedAgreement.transactionId && (
                <Typography variant="body2" paragraph>
                  Transaction ID: {selectedAgreement.transactionId}
                </Typography>
              )}
              
              {selectedAgreement.status === 'rejected' && selectedAgreement.rejectionReason && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Rejection Reason:</Typography>
                  <Typography variant="body2">{selectedAgreement.rejectionReason}</Typography>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)}>Close</Button>
          {selectedAgreement && selectedAgreement.status === 'submitted' && (
            <Button 
              onClick={handleApproveAgreement} 
              variant="contained" 
              color="success"
              disabled={approving}
              startIcon={approving ? <CircularProgress size={20} /> : <CheckIcon />}
            >
              {approving ? 'Approving...' : 'Approve'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Reject Agreement Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Digital Agreement</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Are you sure you want to reject this digital agreement?
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            helperText="Please provide a reason for rejecting this agreement"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleRejectAgreement} 
            variant="contained" 
            color="error"
            disabled={rejecting || !rejectionReason.trim()}
            startIcon={rejecting ? <CircularProgress size={20} /> : <CloseIcon />}
          >
            {rejecting ? 'Rejecting...' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageDigitalAgreements;