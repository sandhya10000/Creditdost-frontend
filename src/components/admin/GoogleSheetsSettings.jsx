import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Grid,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Chip,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Save,
  Sync,
  CloudDone,
  CloudOff,
  InfoOutlined,
  Refresh
} from '@mui/icons-material';
import api from '../../services/api';

const GoogleSheetsSettings = () => {
  const [settings, setSettings] = useState({
    spreadsheetId: '',
    credentials: null,
    tabs: {
      creditScore: { enabled: true, lastSync: null },
      applyForLoan: { enabled: true, lastSync: null },
      creditScoreRepair: { enabled: true, lastSync: null },
      contactUs: { enabled: true, lastSync: null },
      newRegistration: { enabled: true, lastSync: null },
      franchiseOpportunity: { enabled: true, lastSync: null },
      businessLogin: { enabled: true, lastSync: null }
    },
    syncSettings: {
      autoSync: true,
      syncInterval: 300,
      twoWaySync: true
    },
    isActive: false
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [credentialsFile, setCredentialsFile] = useState(null);

  // Fetch current settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/google-sheets/settings');
      if (response.data) {
        setSettings({
          ...response.data,
          credentials: null // Don't store credentials in state
        });
      }
    } catch (err) {
      // If settings don't exist yet (404), that's okay - we'll create them
      if (err.response?.status !== 404) {
        setError('Failed to fetch Google Sheets settings');
      }
      // Otherwise, we just leave the default settings as they are
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const formData = new FormData();
      formData.append('spreadsheetId', settings.spreadsheetId);
      
      if (credentialsFile) {
        formData.append('credentials', credentialsFile);
      }
      
      formData.append('tabs', JSON.stringify(settings.tabs));
      formData.append('syncSettings', JSON.stringify(settings.syncSettings));
      formData.append('isActive', settings.isActive);
      
      const response = await api.put('/google-sheets/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('Settings saved successfully');
      // Refresh settings to get the latest data
      fetchSettings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await api.post('/google-sheets/test-connection');
      setSuccess('Connection successful!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to connect to Google Sheets';
      if (errorMessage.includes('not configured')) {
        setError(errorMessage + ' Please save your settings first.');
      } else if (errorMessage.includes('credentials not found')) {
        setError(errorMessage + ' Please upload your credentials JSON file.');
      } else if (errorMessage.includes('access to the spreadsheet')) {
        setError(errorMessage + ' Please make sure to share your Google Sheet with the service account email from your credentials and grant Editor access.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setTesting(false);
    }
  };

  const handleSyncData = async (dataType) => {
    setSyncing(true);
    setError('');
    setSuccess('');
    
    try {
      let response;
      switch (dataType) {
        case 'creditScore':
          response = await api.post('/google-sheets/sync/credit-score');
          break;
        case 'applyForLoan':
          response = await api.post('/google-sheets/sync/business-form');
          break;
        case 'creditScoreRepair':
          response = await api.post('/google-sheets/sync/credit-repair');
          break;
        case 'contactUs':
          response = await api.post('/google-sheets/sync/contact-form');
          break;
        case 'newRegistration':
          response = await api.post('/google-sheets/sync/registration');
          break;
        case 'franchiseOpportunity':
          response = await api.post('/google-sheets/sync/franchise-opportunity');
          break;
        case 'businessLogin':
          response = await api.post('/google-sheets/sync/business-login');
          break;
        case 'all':
          response = await api.post('/google-sheets/sync/all');
          break;
        default:
          throw new Error('Invalid data type');
      }
      
      setSuccess(response.data.message);
      // Refresh settings to update last sync timestamps
      fetchSettings();
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to sync ${dataType} data`;
      if (errorMessage.includes('not configured')) {
        setError(errorMessage + ' Please configure and save your Google Sheets settings first.');
      } else if (errorMessage.includes('access to the spreadsheet')) {
        setError(errorMessage + ' Please make sure to share your Google Sheet with the service account email from your credentials and grant Editor access.');
      } else if (errorMessage.includes('credentials not found')) {
        setError(errorMessage + ' Please upload your credentials JSON file.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTabSettingChange = (tabName, field, value) => {
    setSettings({
      ...settings,
      tabs: {
        ...settings.tabs,
        [tabName]: {
          ...settings.tabs[tabName],
          [field]: value
        }
      }
    });
  };

  const handleSyncSettingChange = (field, value) => {
    setSettings({
      ...settings,
      syncSettings: {
        ...settings.syncSettings,
        [field]: value
      }
    });
  };

  const handleFileChange = (event) => {
    setCredentialsFile(event.target.files[0]);
  };

  const formatLastSync = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const tabLabels = {
    creditScore: 'Credit Score',
    applyForLoan: 'Apply for Loan',
    creditScoreRepair: 'Credit Score Repair',
    contactUs: 'Contact Us',
    newRegistration: 'New Registration',
    franchiseOpportunity: 'Franchise Opportunity',
    businessLogin: 'Business Login/MIS'
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
      {/* MOBILE FIX: header now stacks vertically on mobile (title -> instructions -> buttons), 
          each taking full width. On desktop (md+) it keeps the original side-by-side layout. */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        gap={{ xs: 2, md: 0 }}
        mb={3}
      >
        {/* MOBILE FIX: title takes full width on mobile, slightly smaller font so it doesn't dominate */}
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            width: { xs: '100%', md: 'auto' },
            fontSize: { xs: '1.5rem', md: '2.125rem' }
          }}
        >
          Google Sheets Integration
        </Typography>

        {/* MOBILE FIX: instructional text block forced to full width on mobile so the
            numbered list reads naturally instead of wrapping in a squeezed column */}
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ width: { xs: '100%', md: 'auto' } }}
        >
          To use this feature, you need to:
          <ol style={{ paddingLeft: '1.25rem', margin: '8px 0' }}>
            <li>Create a Google Cloud Project and enable the Google Sheets API</li>
            <li>Create a Service Account and download the credentials JSON file</li>
            <li>Share your Google Sheet with the service account email from your credentials (grant Editor access)</li>
            <li>Enter your Spreadsheet ID and upload the credentials file below</li>
          </ol>
          <strong>Important:</strong> The service account must have Editor access to your Google Sheet, not just Viewer access.
        </Typography>

        {/* MOBILE FIX: action buttons stack full-width vertically on mobile, 
            sit side-by-side on desktop (original behavior preserved) */}
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          width={{ xs: '100%', md: 'auto' }}
          gap={{ xs: 1, md: 0 }}
        >
          <Button
            variant="outlined"
            startIcon={testing ? <CircularProgress size={20} /> : <CloudDone />}
            onClick={handleTestConnection}
            disabled={testing}
            sx={{
              mr: { xs: 0, md: 2 },
              width: { xs: '100%', md: 'auto' }
            }}
          >
            Test Connection
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSaveSettings}
            disabled={saving}
            sx={{ width: { xs: '100%', md: 'auto' } }}
          >
            Save Settings
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      {/* MOBILE FIX: extra vertical gap between stacked Grid items on mobile for breathing room */}
      <Grid container spacing={3} sx={{ rowGap: { xs: 1, md: 0 } }}>
        <Grid item xs={12} md={8}>
          <Card>
            {/* MOBILE FIX: reduced CardContent padding on mobile for more usable width */}
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Spreadsheet Configuration
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Spreadsheet ID"
                    value={settings.spreadsheetId}
                    onChange={(e) => setSettings({ ...settings, spreadsheetId: e.target.value })}
                    placeholder="Enter your Google Spreadsheet ID"
                    helperText="The ID can be found in the URL of your Google Spreadsheet. Example: 1oaDQRksxjuHgCPquSGQwCFUT20v8rOP3YGqRoJkiKxM"
                  />
                  {/* MOBILE FIX: increased top margin so this note doesn't crowd the helper text above it */}
                  <Typography variant="caption" color="textSecondary" mt={2} display="block">
                    After saving your settings, make sure to share your Google Sheet with the service account email from your credentials file.
                    The service account needs <strong>Editor</strong> access to your Google Sheet.
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                  >
                    Upload Credentials JSON
                    <input
                      type="file"
                      hidden
                      accept=".json"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {credentialsFile && (
                    <Typography variant="body2" color="textSecondary" mt={1}>
                      Selected file: {credentialsFile.name}
                    </Typography>
                  )}
                  <Typography variant="caption" color="textSecondary" mt={1} display="block">
                    Upload your Google Service Account credentials JSON file
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.isActive}
                        onChange={(e) => setSettings({ ...settings, isActive: e.target.checked })}
                      />
                    }
                    label="Enable Google Sheets Integration"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            {/* MOBILE FIX: reduced CardContent padding on mobile */}
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Sync Settings
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.syncSettings.autoSync}
                        onChange={(e) => handleSyncSettingChange('autoSync', e.target.checked)}
                      />
                    }
                    label="Enable Auto Sync"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sync Interval (seconds)"
                    type="number"
                    value={settings.syncSettings.syncInterval}
                    onChange={(e) => handleSyncSettingChange('syncInterval', parseInt(e.target.value))}
                    disabled={!settings.syncSettings.autoSync}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.syncSettings.twoWaySync}
                        onChange={(e) => handleSyncSettingChange('twoWaySync', e.target.checked)}
                      />
                    }
                    label="Enable Two-Way Sync"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            {/* MOBILE FIX: reduced CardContent padding on mobile */}
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Data Sync
              </Typography>
              
              <Button
                variant="contained"
                fullWidth
                startIcon={syncing ? <CircularProgress size={20} /> : <Sync />}
                onClick={() => handleSyncData('all')}
                disabled={syncing}
                sx={{ mb: 2 }}
              >
                Sync All Data
              </Button>
              
              <Divider sx={{ my: 2 }} />
              
              {/* MOBILE FIX: smaller tab font-size + minWidth on mobile so labels like 
                  "Credit Score Repair" don't get clipped/truncated; scroll behavior unchanged */}
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  minHeight: { xs: 36, md: 48 },
                  '& .MuiTab-root': {
                    fontSize: { xs: '0.7rem', md: '0.875rem' },
                    minWidth: { xs: 90, md: 120 },
                    minHeight: { xs: 36, md: 48 },
                    padding: { xs: '6px 10px', md: '12px 16px' }
                  }
                }}
              >
                {Object.entries(tabLabels).map(([key, label]) => (
                  <Tab key={key} label={label} />
                ))}
              </Tabs>
              
              <Box sx={{ mt: 2 }}>
                {Object.entries(tabLabels).map(([key, label], index) => (
                  <div key={key} hidden={tabValue !== index}>
                    {/* MOBILE FIX: this row wraps on mobile so the "last sync" chip 
                        doesn't get squeezed/cut off next to the switch label */}
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      alignItems="center"
                      gap={1}
                      mb={2}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.tabs[key]?.enabled || false}
                            onChange={(e) => handleTabSettingChange(key, 'enabled', e.target.checked)}
                          />
                        }
                        label={`Enable ${label} Tab`}
                      />
                      <Tooltip title="Last sync time">
                        <Chip
                          icon={<InfoOutlined />}
                          label={formatLastSync(settings.tabs[key]?.lastSync)}
                          size="small"
                          variant="outlined"
                          sx={{ ml: { xs: 0, md: 2 } }}
                        />
                      </Tooltip>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={syncing ? <CircularProgress size={20} /> : <Refresh />}
                      onClick={() => handleSyncData(key)}
                      disabled={syncing}
                    >
                      Sync {label} Data
                    </Button>
                  </div>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GoogleSheetsSettings;