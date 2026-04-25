import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  UploadFile as UploadIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon
} from "@mui/icons-material";
import { adminAPI } from "../../services/api";

const ManageAIAnalysis = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [responseFile, setResponseFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Fetch all AI analysis documents
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAIAnalysisDocuments();
      setDocuments(response.data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle response file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'text/html' || file.name.toLowerCase().endsWith('.html'))) {
      setResponseFile(file);
      setUploadError('');
    } else {
      setUploadError('Please select a PDF or HTML file');
      setResponseFile(null);
    }
  };

  // Open dialog for responding to a document
  const handleOpenDialog = (document) => {
    setSelectedDocument(document);
    setOpenDialog(true);
    setResponseFile(null);
    setNotes('');
    setUploadError('');
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDocument(null);
    setResponseFile(null);
    setNotes('');
    setUploadError('');
  };

  // Submit response
  const handleSubmitResponse = async () => {
    if (!responseFile) {
      setUploadError('Please select a response file');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('document', responseFile);
      if (notes) {
        formData.append('notes', notes);
      }

      const response = await adminAPI.respondToAIAnalysisDocument(selectedDocument._id, formData);
      
      if (response.data) {
        // Refresh documents list
        fetchDocuments();
        handleCloseDialog();
      }
    } catch (error) {
      setUploadError(error.response?.data?.message || 'Failed to submit response');
    } finally {
      setUploading(false);
    }
  };



  // Get status chip color based on Claude analysis status
  const getStatusChip = (doc) => {
    const claudeStatus = doc.claudeAnalysisStatus;
    const hasAdminResponse = doc.status === 'responded';
    
    if (claudeStatus === 'email_sent') {
      return { label: 'AI Analyzed & Sent', color: 'success', icon: <CheckCircleIcon /> };
    } else if (claudeStatus === 'completed') {
      return { label: 'AI Analyzed', color: 'success', icon: <CheckCircleIcon /> };
    } else if (claudeStatus === 'processing') {
      return { label: 'Analyzing...', color: 'warning', icon: <HourglassIcon /> };
    } else if (claudeStatus === 'failed') {
      return { label: 'Analysis Failed', color: 'error' };
    } else if (hasAdminResponse) {
      return { label: 'Admin Responded', color: 'success' };
    } else {
      return { label: 'Uploaded', color: 'primary' };
    }
  };

  // Download AI analysis report
  const handleDownloadAnalysis = async (docId, fileName) => {
    try {
      const response = await adminAPI.downloadClaudeAnalysis(docId);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || `analysis_${docId}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download analysis:', error);
      alert('Failed to download analysis report. Please try again.');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Analysis Documents
      </Typography>
      
      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Document Management
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Franchise</TableCell>
                    <TableCell>Document</TableCell>
                    <TableCell>Uploaded At</TableCell>
                    <TableCell>AI Analysis Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((doc) => {
                    const statusChip = getStatusChip(doc);
                    const hasAnalysis = doc.claudeAnalysisStatus === 'completed' || doc.claudeAnalysisStatus === 'email_sent';
                    
                    return (
                      <TableRow key={doc._id}>
                        <TableCell>
                          <Typography variant="body2">{doc.franchiseName}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {doc.franchiseEmail}
                          </Typography>
                        </TableCell>
                        <TableCell>{doc.uploadedDocumentName}</TableCell>
                        <TableCell>
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={statusChip.label} 
                            color={statusChip.color} 
                            icon={statusChip.icon}
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {/* View Details Button */}
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenDialog(doc)}
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            
                            {/* Download AI Analysis Button */}
                            {hasAnalysis && doc.claudeAnalysisFileName && (
                              <Tooltip title="Download AI Analysis Report">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDownloadAnalysis(doc._id, doc.claudeAnalysisFileName)}
                                  color="success"
                                >
                                  <DownloadIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Response Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Document Details</Typography>
            {selectedDocument && (selectedDocument.claudeAnalysisStatus === 'completed' || selectedDocument.claudeAnalysisStatus === 'email_sent') && (
              <Button 
                startIcon={<DownloadIcon />}
                onClick={() => handleDownloadAnalysis(selectedDocument._id, selectedDocument.claudeAnalysisFileName)}
                color="success"
                variant="outlined"
                size="small"
              >
                Download AI Report
              </Button>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Franchise:</strong> {selectedDocument.franchiseName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Email: {selectedDocument.franchiseEmail}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Document Information
                </Typography>
                <Box sx={{ ml: 2, mt: 1 }}>
                  <Typography variant="body2">
                    Original File: {selectedDocument.uploadedDocumentName}
                  </Typography>
                  <Typography variant="body2">
                    Uploaded: {new Date(selectedDocument.uploadedAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              
              {/* AI Analysis Status Section */}
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  AI Analysis Status
                </Typography>
                <Box sx={{ ml: 2, mt: 1 }}>
                  <Typography variant="body2">
                    Status: <Chip 
                      label={selectedDocument.claudeAnalysisStatus || 'pending'} 
                      size="small"
                      color={selectedDocument.claudeAnalysisStatus === 'completed' || selectedDocument.claudeAnalysisStatus === 'email_sent' ? 'success' : 'default'}
                    />
                  </Typography>
                  {selectedDocument.analyzedAt && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Analyzed At: {new Date(selectedDocument.analyzedAt).toLocaleString()}
                    </Typography>
                  )}
                  {selectedDocument.emailSentAt && (
                    <Typography variant="body2" sx={{ mt: 0.5 }} color="success.main">
                      Email Sent: {new Date(selectedDocument.emailSentAt).toLocaleString()}
                    </Typography>
                  )}
                  {selectedDocument.claudeAnalysisError && (
                    <Typography variant="body2" sx={{ mt: 1 }} color="error">
                      Error: {selectedDocument.claudeAnalysisError}
                    </Typography>
                  )}
                  {!selectedDocument.claudeAnalysisHtml && selectedDocument.claudeAnalysisStatus !== 'processing' && (
                    <Typography variant="body2" sx={{ mt: 1 }} color="warning.main">
                      ⚠️ AI analysis not yet completed. Franchise user can trigger it manually.
                    </Typography>
                  )}
                </Box>
              </Box>
              
              {/* Admin Response Section */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Admin Response (Optional)
                </Typography>
                
                {selectedDocument.adminResponseDocumentName && (
                  <Alert severity="success" sx={{ mt: 1, mb: 2 }}>
                    Response already submitted: {selectedDocument.adminResponseDocumentName}
                  </Alert>
                )}
                
                <input
                  accept="application/pdf,.html,text/html"
                  style={{ display: 'none' }}
                  id="response-upload"
                  type="file"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                
                <label htmlFor="response-upload">
                  <Button 
                    variant="outlined" 
                    component="span" 
                    startIcon={<UploadIcon />}
                    sx={{ mt: 1 }}
                    disabled={uploading || !!selectedDocument.adminResponseDocumentName}
                  >
                    Upload Response PDF/HTML
                  </Button>
                </label>
                
                {responseFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected: {responseFile.name}
                  </Typography>
                )}
                
                {uploadError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {uploadError}
                  </Alert>
                )}
                
                <TextField
                  label="Notes (Optional)"
                  multiline
                  rows={3}
                  fullWidth
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{ mt: 2 }}
                  placeholder="Add any notes or comments for the franchise user..."
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitResponse} 
            variant="contained" 
            disabled={!responseFile || uploading || !!selectedDocument?.adminResponseDocumentName}
          >
            {uploading ? <CircularProgress size={24} /> : 'Submit Response'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageAIAnalysis;