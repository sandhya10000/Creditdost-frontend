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
  Alert,
  Chip,
  Button,
  Link,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { PictureAsPdf, Download, Search } from '@mui/icons-material';
import { adminAPI } from '../../services/api';

const ViewReports = () => {
  const [creditReports, setCreditReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [bureauFilter, setBureauFilter] = useState('');

  // Load credit reports on component mount
  useEffect(() => {
    loadCreditReports();
  }, []);

  const loadCreditReports = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllCreditReports();
      setCreditReports(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading credit reports:', err);
      setError('Failed to load credit reports');
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 750) return 'success';
    if (score >= 700) return 'info';
    if (score >= 650) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Poor';
  };

  const getReportUrl = (report) => {
    // Use local path if available, otherwise use the original report URL
    if (report.localPath) {
      // For local paths, use the base server URL without /api prefix
      const baseUrl = import.meta.env.VITE_REACT_APP_API_URL 
        ? import.meta.env.VITE_REACT_APP_API_URL.replace('/api', '') 
        : 'https://reactbackend.creditdost.co.in';
      return `${baseUrl}${report.localPath}`;
    }
    return report.reportUrl;
  };

  // Filter reports based on search term and bureau filter
  const filteredReports = creditReports.filter(report => {
    const matchesSearch = 
      (report.name && report.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.mobile && report.mobile.includes(searchTerm)) ||
      (report.pan && report.pan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.franchiseId && report.franchiseId.businessName && 
       report.franchiseId.businessName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesBureau = bureauFilter ? report.bureau === bureauFilter : true;
    
    return matchesSearch && matchesBureau;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Credit Reports
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Credit Reports
          </Typography>
          
          {/* Search and Filter Controls */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Search by name, mobile, PAN, or franchise"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: <Search />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Credit Bureau</InputLabel>
                <Select
                  value={bureauFilter}
                  label="Credit Bureau"
                  onChange={(e) => setBureauFilter(e.target.value)}
                >
                  <MenuItem value="">All Bureaus</MenuItem>
                  <MenuItem value="cibil">CIBIL</MenuItem>
                  <MenuItem value="crif">CRIF</MenuItem>
                  <MenuItem value="experian">Experian</MenuItem>
                  <MenuItem value="equifax">Equifax</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredReports.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              {searchTerm || bureauFilter 
                ? 'No reports match your search criteria.' 
                : 'No credit reports found.'}
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="credit reports table">
                <TableHead>
                  <TableRow>
                    <TableCell>Franchise</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>PAN</TableCell>
                    <TableCell>Bureau</TableCell>
                    <TableCell>Credit Score</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow
                      key={report._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        {report.franchiseId ? report.franchiseId.businessName : 'Website'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {report.name}
                      </TableCell>
                      <TableCell>{report.mobile}</TableCell>
                      <TableCell>{report.pan || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={report.bureau ? report.bureau.toUpperCase() : 'N/A'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {report.score ? (
                          <Chip
                            label={`${report.score} (${getScoreLabel(report.score)})`}
                            color={getScoreColor(report.score)}
                            size="small"
                          />
                        ) : (
                          <Chip label="N/A" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getReportUrl(report) && (
                          <Button
                            size="small"
                            startIcon={<PictureAsPdf />}
                            component={Link}
                            href={getReportUrl(report)}
                            target="_blank"
                          >
                            PDF
                          </Button>
                        )}
                      </TableCell>
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

export default ViewReports;