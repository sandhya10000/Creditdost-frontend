import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import Header from './homepage/Header';
import HomePageFooter from './homepage/HomePageFooter';

const RefundPolicyPage = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      
      <Box 
        sx={{ 
          bgcolor: 'background.default',
          py: 8,
          minHeight: 'calc(100vh - 200px)'
        }}
      >
        <Container style={{maxWidth: "1200px"}}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, sm: 6 },
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <Typography 
              variant="h3" 
              component="h1" 
              align="center" 
              gutterBottom
              sx={{ 
                fontWeight: 800,
                color: 'primary.main',
                mb: 4
              }}
            >
              Refund & Cancellation Policy
            </Typography>
            
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              
              <Typography variant="body2" color="text.secondary">
                <strong>Website:</strong> www.creditdost.co.in
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Legal Entity:</strong> Optimystic Auxiliary Services Private Limited
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> info@creditdost.co.in
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                1. Introduction
              </Typography>
              <Typography paragraph>
                This Refund & Cancellation Policy applies to all users and partners of Credit Dost, owned and operated by Optimystic Auxiliary Services Private Limited ("we," "our," "us").
              </Typography>
              <Typography paragraph>
                By enrolling in our services, you acknowledge that you have read and agreed to the terms outlined below.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                2. No Refund Policy
              </Typography>
              <Typography paragraph>
                All payments made towards our services are strictly non-refundable once processed.
              </Typography>
              <Typography paragraph>
                This includes, but is not limited to:
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • Change of mind after enrollment
                </Typography>
                <Typography paragraph>
                  • Non-participation or delay in activation
                </Typography>
                <Typography paragraph>
                  • Inability to use the provided materials or support services
                </Typography>
                <Typography paragraph>
                  • Disagreement with the service structure or deliverables
                </Typography>
              </Typography>
              <Typography paragraph>
                This policy exists because once payment is received, the company provides immediate access to proprietary resources, onboarding, and training materials that cannot be reversed or retrieved.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                3. Exceptions – Refund Eligibility
              </Typography>
              <Typography paragraph>
                Refunds will only be considered under the following exceptional circumstances:
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  1. Duplicate Payment: If the same transaction amount is charged more than once due to a technical error.
                </Typography>
                <Typography paragraph>
                  2. Transaction Failure: If your payment is deducted but not successfully recorded in our system.
                </Typography>
              </Typography>
              <Typography paragraph>
                In such cases:
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • You must notify us via email at info@creditdost.co.in within 7 working days of the transaction.
                </Typography>
                <Typography paragraph>
                  • Include transaction details, proof of payment, and a valid bank account for refund processing.
                </Typography>
                <Typography paragraph>
                  • Once verified, the refund (if applicable) will be processed within 10–15 business days via the same mode of payment used for the transaction.
                </Typography>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                4. Cancellation Policy
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • As our services provide instant access to exclusive content and support systems upon payment, cancellations are not permitted once enrollment is confirmed.
                </Typography>
                <Typography paragraph>
                  • In case of accidental payment or incorrect registration, please contact us immediately at info@creditdost.co.in within 24 hours for possible resolution.
                </Typography>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                5. Disputes and Chargebacks
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • Users are requested not to raise any chargeback or payment dispute directly with their bank or payment provider before contacting us.
                </Typography>
                <Typography paragraph>
                  • All refund or transaction issues will be handled directly by our finance team as per this policy.
                </Typography>
                <Typography paragraph>
                  • Any fraudulent or abusive refund claims may lead to legal action and permanent suspension from future programs.
                </Typography>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                6. Policy Updates
              </Typography>
              <Typography paragraph>
                Optimystic Auxiliary Services Private Limited reserves the right to amend, modify, or update this Refund & Cancellation Policy at any time without prior notice.
              </Typography>
              <Typography paragraph>
                All updates will be posted on this page with the revised effective date. Users are encouraged to review this policy periodically.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                7. Contact Us
              </Typography>
              <Typography paragraph>
                For all payment or refund-related concerns, please contact:
              </Typography>
              <Typography paragraph>
                <strong>Optimystic Auxiliary Services Private Limited</strong>
              </Typography>
              <Typography paragraph>
                Email: info@creditdost.co.in
              </Typography>
              <Typography paragraph>
                Website: www.creditdost.co.in
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Typography variant="body2" color="text.secondary">
                © 2026 Optimystic Auxiliary Services Private Limited. All Rights Reserved.
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
      
      <HomePageFooter />
    </Box>
  );
};

export default RefundPolicyPage;