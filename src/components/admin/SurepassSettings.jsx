import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button, 
  Alert,
  CircularProgress,
} from '@mui/material';
import { adminAPI } from '../../services/api';

const SurepassSettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load current API key on component mount
  useEffect(() => {
    loadCurrentApiKey();
  }, []);

  const loadCurrentApiKey = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getSurepassApiKey();
      // We receive a masked key, but we'll show a placeholder to indicate it's configured
      if (response.data.hasApiKey) {
        setApiKey('••••••••••••••••••••'); // Masked placeholder
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading API key:', err);
      // If not found, it's expected - just leave the field empty
      if (err.response?.status !== 404) {
        setError('Failed to load current API key');
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await adminAPI.updateSurepassApiKey(apiKey);
      setSuccess(response.data.message);
      // After saving, reload to show the masked version
      await loadCurrentApiKey();
    } catch (err) {
      console.error('Error updating API key:', err);
      setError(err.response?.data?.message || 'Failed to update Surepass API key');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Surepass Settings
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
            API Configuration
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              label="Surepass API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              sx={{ mb: 3 }}
              helperText="Enter your Surepass API key to enable credit verification services"
              disabled={loading}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving || loading}
                sx={{ py: 1.5, px: 4 }}
              >
                {saving ? <CircularProgress size={24} /> : 'Update API Key'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Integration Information
          </Typography>
          <Typography variant="body1" paragraph>
            Surepass is used for credit verification and background checks for your customers.
          </Typography>
          <Typography variant="body1" paragraph>
            To configure the integration:
          </Typography>
          <ol>
            <li>
              <Typography variant="body2">
                Sign up for a Surepass account at their official website
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Generate an API key in your Surepass dashboard
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Paste the API key in the field above and save
              </Typography>
            </li>
          </ol>
          <Typography variant="body1" paragraph>
            Once configured, franchise partners will be able to perform credit checks for their customers.
          </Typography> 
        </CardContent>
      </Card>
    </Box>
  );
};

export default SurepassSettings;