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
  Chip,
} from '@mui/material';
import { adminAPI } from '../../services/api';

const BusinessForms = () => {
  const [businessForms, setBusinessForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all business forms on component mount
  useEffect(() => {
    fetchBusinessForms();
  }, []);

  const fetchBusinessForms = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getAllBusinessForms();
      setBusinessForms(response.data);
    } catch (err) {
      setError('Failed to fetch business forms. Please try again later.');
      console.error('Error fetching business forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getPaymentStatusChip = (status) => {
    const statusConfig = {
      'pending': { label: 'Pending', color: 'warning' },
      'paid': { label: 'Paid', color: 'success' },
      'failed': { label: 'Failed', color: 'error' },
    };
    
    const config = statusConfig[status] || { label: status, color: 'default' };
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const filteredBusinessForms = businessForms.filter(form => 
    form.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.customerPhone.includes(searchTerm) ||
    (form.franchiseId?.businessName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Business MIS
      </Typography>     
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by customer name, email, phone, or franchise"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ maxWidth: 400 }}
            />
          </Box>
          
          {loading && businessForms.length === 0 ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="business forms table">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Franchise</TableCell>
                    <TableCell>Package</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBusinessForms.map((form) => (
                    <TableRow
                      key={form._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {form.customerName}
                      </TableCell>
                      <TableCell>{form.customerEmail}</TableCell>
                      <TableCell>{form.customerPhone}</TableCell>
                      <TableCell>
                        {form.franchiseId?.businessName || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {form.selectedPackage?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        ₹{form.selectedPackage?.price || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusChip(form.paymentStatus)}
                      </TableCell>
                      <TableCell>{formatDate(form.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BusinessForms;