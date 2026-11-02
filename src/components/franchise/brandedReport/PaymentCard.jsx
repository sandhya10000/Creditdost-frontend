import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Radio,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Payment as RazorpayIcon,
  Lock as LockIcon,
  Edit as EditIcon,
  Check as SaveIcon,
  Close as CancelIcon,
  CheckCircle as SuccessIcon,
  PhoneInTalk as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BRANDED_REPORT_PRICE } from '../../../constants/brandedReport';
import { purchaseWithWallet, purchaseWithRazorpay } from '../../../services/brandedReportService';

const PaymentCard = ({
  status,
  walletBalance = 0,
  userProfile = {},
  onPurchaseSuccess,
  onRefreshWallet,
}) => {
  const navigate = useNavigate();

  // Contact Details Inline Editing State
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [email, setEmail] = useState(userProfile.email || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [contactError, setContactError] = useState('');

  // Payment Selection & Processing State
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'wallet' | 'razorpay'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  // Update contact when userProfile loads
  React.useEffect(() => {
    if (userProfile.email && !email) setEmail(userProfile.email);
    if (userProfile.phone && !phone) setPhone(userProfile.phone);
  }, [userProfile]);

  // Balance computations
  const isWalletSufficient = walletBalance >= BRANDED_REPORT_PRICE;
  const walletShortage = Math.max(0, BRANDED_REPORT_PRICE - walletBalance);

  // Validate contact details (email + 10-digit Indian mobile)
  const validateContact = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setContactError('Please enter a valid email address.');
      return false;
    }
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setContactError('Please enter a valid 10-digit mobile number.');
      return false;
    }
    setContactError('');
    return true;
  };

  const handleSaveContact = () => {
    if (validateContact()) {
      setIsEditingContact(false);
    }
  };

  const handleCancelContactEdit = () => {
    setEmail(userProfile.email || '');
    setPhone(userProfile.phone || '');
    setContactError('');
    setIsEditingContact(false);
  };

  // Handle Pay Action
  const handlePayment = async () => {
    setErrorMessage('');

    if (!validateContact()) {
      setErrorMessage('Please ensure your design specialist contact details are valid before proceeding.');
      return;
    }

    if (paymentMethod === 'wallet') {
      if (!isWalletSufficient) {
        // Redirect to recharge / payment page
        navigate('/franchise/payment');
        return;
      }

      try {
        setLoading(true);
        const res = await purchaseWithWallet({
          email: email.trim(),
          phone: phone.trim(),
          currentBalance: walletBalance,
        });
        setToast({
          open: true,
          message: res.message,
          severity: 'success',
        });
        if (onPurchaseSuccess) onPurchaseSuccess();
      } catch (err) {
        setErrorMessage(err.message || 'Wallet payment failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (paymentMethod === 'razorpay') {
      try {
        setLoading(true);
        await purchaseWithRazorpay({
          email: email.trim(),
          phone: phone.trim(),
          franchiseName: userProfile.businessName || 'Franchise Partner',
          onSuccess: (data) => {
            setLoading(false);
            setToast({
              open: true,
              message: 'Payment received. Our design team will contact you within 3 hours.',
              severity: 'success',
            });
            if (onPurchaseSuccess) onPurchaseSuccess();
          },
          onError: (err) => {
            setLoading(false);
            setErrorMessage(err.message || 'Payment was cancelled or failed.');
          },
        });
      } catch (err) {
        setLoading(false);
        setErrorMessage(err.message || 'Failed to initiate Razorpay payment.');
      }
    }
  };

  // Button Label Resolution
  const getButtonLabel = () => {
    if (loading) return 'Processing securely...';
    if (paymentMethod === 'wallet') {
      if (!isWalletSufficient) {
        return `Pay ₹${BRANDED_REPORT_PRICE.toLocaleString('en-IN')} with wallet (Requires Recharge)`;
      }
      return `Pay ₹${BRANDED_REPORT_PRICE.toLocaleString('en-IN')} with wallet`;
    }
    return `Pay ₹${BRANDED_REPORT_PRICE.toLocaleString('en-IN')} securely`;
  };

  // =========================================================================
  // SUCCESS / PURCHASED STATUS VIEW
  // =========================================================================
  if (status?.hasPurchased || status?.status === 'in_progress' || status?.status === 'active') {
    return (
      <Box id="payment-section" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3.5,
            border: '2px solid #86efac',
            backgroundColor: '#f0fdf4',
            p: { xs: 3, md: 4.5 },
            maxWidth: 760,
            mx: 'auto',
            boxShadow: '0 10px 30px rgba(22, 163, 74, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <SuccessIcon sx={{ color: '#16a34a', fontSize: 36, mt: 0.25 }} />
            <Box>
              <Chip
                label="Setup in progress"
                size="small"
                sx={{
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  mb: 1,
                  border: '1px solid #86efac',
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#14532d', mb: 0.5 }}>
                Payment Received & Branded Setup Initiated!
              </Typography>
              <Typography variant="body2" sx={{ color: '#166534', lineHeight: 1.6 }}>
                Our dedicated design team will contact you within <strong>3 hours</strong> to collect your high-res logo,
                palette requirements, and contact URLs.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: '1px dashed #bbf7d0',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon sx={{ color: '#15803d', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#166534', fontWeight: 600 }}>
                {status.contactEmail || email}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon sx={{ color: '#15803d', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#166534', fontWeight: 600 }}>
                +91 {status.contactPhone || phone}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  }

  // =========================================================================
  // NORMAL PAYMENT CHECKOUT VIEW
  // =========================================================================
  return (
    <Box id="payment-section" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3.5,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          p: { xs: 3, sm: 4, md: 5 },
          maxWidth: 780,
          mx: 'auto',
          boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header Row */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            pb: 3,
            borderBottom: '1px solid #f1f5f9',
            gap: 1.5,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.6rem' }}>
              Complete payment
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.25 }}>
              Choose how to pay the one-time fee, and we&apos;ll reach out to configure your branding.
            </Typography>
          </Box>
          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#2563eb', fontSize: '1.75rem', lineHeight: 1 }}>
              ₹{BRANDED_REPORT_PRICE.toLocaleString('en-IN')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
              Inclusive of GST
            </Typography>
          </Box>
        </Box>

        {/* Design Specialist Contact Box */}
        <Box
          sx={{
            my: 3.5,
            p: 2.5,
            borderRadius: 2.5,
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
              Design specialist contact details
            </Typography>
            {!isEditingContact ? (
              <Button
                size="small"
                startIcon={<EditIcon sx={{ fontSize: 15 }} />}
                onClick={() => setIsEditingContact(true)}
                sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.78rem' }}
              >
                Edit
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<SaveIcon sx={{ fontSize: 15 }} />}
                  onClick={handleSaveContact}
                  sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', py: 0.2 }}
                >
                  Save
                </Button>
                <Button
                  size="small"
                  startIcon={<CancelIcon sx={{ fontSize: 15 }} />}
                  onClick={handleCancelContactEdit}
                  sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', py: 0.2 }}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>

          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>
            Our design team will reach out to these coordinates to gather your brand book and assets.
          </Typography>

          {isEditingContact ? (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                label="Email Address"
                size="small"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Mobile Number"
                size="small"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10 digit mobile"
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#64748b', fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
                  {email || 'No email specified'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: '#64748b', fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
                  +91 {phone || 'No phone specified'}
                </Typography>
              </Box>
            </Box>
          )}

          {contactError && (
            <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, display: 'block', mt: 1 }}>
              {contactError}
            </Typography>
          )}
        </Box>

        {/* Payment Methods (Radio Cards) */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 1.5 }}>
          Select payment method
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3.5 }}>
          {/* Method 1: Wallet Credits */}
          <Paper
            elevation={0}
            onClick={() => setPaymentMethod('wallet')}
            sx={{
              p: 2.25,
              borderRadius: 2.5,
              border: '2px solid',
              borderColor: paymentMethod === 'wallet' ? '#2563eb' : '#e2e8f0',
              backgroundColor: paymentMethod === 'wallet' ? 'rgba(37, 99, 235, 0.03)' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: paymentMethod === 'wallet' ? '#2563eb' : '#cbd5e1',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
              <Radio checked={paymentMethod === 'wallet'} value="wallet" sx={{ p: 0 }} />
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WalletIcon sx={{ color: '#2563eb' }} />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#1e293b' }}>
                  Wallet credits (₹{BRANDED_REPORT_PRICE.toLocaleString('en-IN')})
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Current balance: ₹{(walletBalance || 0).toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Box>

            {/* Wallet Status / Action Pill */}
            <Box sx={{ textAlign: 'right' }}>
              {isWalletSufficient ? (
                <Chip
                  label="Sufficient balance"
                  size="small"
                  sx={{
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                  }}
                />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 700 }}>
                    short by ₹{walletShortage.toLocaleString('en-IN')}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/franchise/payment');
                    }}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      py: 0.2,
                      px: 1,
                      color: '#2563eb',
                      borderColor: '#93c5fd',
                    }}
                  >
                    + Recharge ₹{walletShortage.toLocaleString('en-IN')}
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Method 2: Razorpay / Instant Pay */}
          <Paper
            elevation={0}
            onClick={() => setPaymentMethod('razorpay')}
            sx={{
              p: 2.25,
              borderRadius: 2.5,
              border: '2px solid',
              borderColor: paymentMethod === 'razorpay' ? '#2563eb' : '#e2e8f0',
              backgroundColor: paymentMethod === 'razorpay' ? 'rgba(37, 99, 235, 0.03)' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: paymentMethod === 'razorpay' ? '#2563eb' : '#cbd5e1',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
              <Radio checked={paymentMethod === 'razorpay'} value="razorpay" sx={{ p: 0 }} />
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RazorpayIcon sx={{ color: '#059669' }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#1e293b' }}>
                    Razorpay / Instant Pay
                  </Typography>
                  <Chip
                    label="Recommended"
                    size="small"
                    sx={{
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 800,
                      fontSize: '0.675rem',
                      height: 20,
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  UPI (GPay, PhonePe, Paytm), Cards, Net banking & Wallets
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Error Alert */}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Primary Checkout Action Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          onClick={handlePayment}
          sx={{
            py: 1.6,
            borderRadius: 2.5,
            backgroundColor: paymentMethod === 'wallet' && !isWalletSufficient ? '#e0e7ff' : '#2563eb',
            color: paymentMethod === 'wallet' && !isWalletSufficient ? '#3730a3' : '#ffffff',
            fontWeight: 800,
            fontSize: '1rem',
            textTransform: 'none',
            boxShadow:
              paymentMethod === 'wallet' && !isWalletSufficient
                ? 'none'
                : '0 8px 24px rgba(37, 99, 235, 0.35)',
            '&:hover': {
              backgroundColor:
                paymentMethod === 'wallet' && !isWalletSufficient ? '#c7d2fe' : '#1d4ed8',
            },
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : getButtonLabel()}
        </Button>

        {/* Security Footnote */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2.5 }}>
          <LockIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.78rem' }}>
            256-bit encrypted checkout. Debited securely. Tax invoice with GST input credit available immediately upon
            receipt.
          </Typography>
        </Box>
      </Paper>

      {/* Notification Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
      />
    </Box>
  );
};

export default PaymentCard;

