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

const PrivacyPolicyPage = () => {
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
              Privacy Policy
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
                Welcome to Credit Dost, a platform owned and operated by Optimystic Auxiliary Services Private Limited ("we," "our," "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website www.creditdost.co.in or engage with our services.
              </Typography>
              <Typography paragraph>
                By using our website or services, you agree to the terms outlined in this Privacy Policy. If you do not agree, please discontinue use immediately.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                2. Information We Collect
              </Typography>
              <Typography paragraph>
                We may collect the following types of information:
              </Typography>
              <Typography paragraph>
                <strong>(a) Personal Information</strong>
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • Full name, email address, phone number, and address
                </Typography>
                <Typography paragraph>
                  • Identity details such as PAN or Aadhaar (if voluntarily provided for credit verification)
                </Typography>
              </Typography>
              <Typography paragraph>
                <strong>(b) Non-Personal Information</strong>
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • Browser type, device information, IP address, and cookies
                </Typography>
                <Typography paragraph>
                  • Usage data such as pages visited, duration, and referral sources
                </Typography>
              </Typography>
              <Typography paragraph>
                <strong>(c) Third-Party Data</strong>
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  We may receive information about you from our partners, credit bureaus, or affiliates for the purpose of providing credit score analysis, financial consultation, or related services.
                </Typography>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                3. Purpose of Data Collection
              </Typography>
              <Typography paragraph>
                We use collected data for the following purposes:
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • To provide and improve our credit score and financial consulting services
                </Typography>
                <Typography paragraph>
                  • To generate reports and communicate updates
                </Typography>
                <Typography paragraph>
                  • To send offers, information, and important notifications
                </Typography>
                <Typography paragraph>
                  • To personalize user experience and improve website performance
                </Typography>
                <Typography paragraph>
                  • To comply with legal and regulatory obligations
                </Typography>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                4. Data Sharing and Disclosure
              </Typography>
              <Typography paragraph>
                We do not sell or rent your personal information.
              </Typography>
              <Typography paragraph>
                However, we may share your data in the following cases:
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • With authorized service providers or technical partners assisting us in operations
                </Typography>
                <Typography paragraph>
                  • With government or legal authorities, when required by law
                </Typography>
                <Typography paragraph>
                  • With financial institutions or credit bureaus, upon your consent, for credit-related processing
                </Typography>
              </Typography>
              <Typography paragraph>
                All third-party partners are obligated to maintain data confidentiality and use it strictly for authorized purposes.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                5. Data Security
              </Typography>
              <Typography paragraph>
                We implement appropriate administrative, technical, and physical safeguards to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
              </Typography>
              <Typography paragraph>
                Despite our efforts, no method of online transmission or storage is 100% secure; hence, we cannot guarantee absolute security.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                6. Cookies
              </Typography>
              <Typography paragraph>
                Our website uses cookies and similar technologies to enhance your experience.
              </Typography>
              <Typography paragraph>
                You can manage or disable cookies through your browser settings, but certain features of the site may not function properly without them.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                7. Your Rights
              </Typography>
              <Typography paragraph>
                You have the following rights regarding your personal data:
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • Right to access, correct, or delete your information
                </Typography>
                <Typography paragraph>
                  • Right to withdraw consent at any time
                </Typography>
                <Typography paragraph>
                  • Right to lodge a complaint with a data protection authority
                </Typography>
              </Typography>
              <Typography paragraph>
                To exercise these rights, contact us at info@creditdost.co.in.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                8. Data Retention
              </Typography>
              <Typography paragraph>
                We retain personal data only as long as necessary for fulfilling the purposes stated in this policy or as required by applicable law. Once data is no longer needed, it is securely deleted.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                9. Third-Party Links
              </Typography>
              <Typography paragraph>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. Please review their respective privacy policies before sharing your information.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                10. Updates to This Policy
              </Typography>
              <Typography paragraph>
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. The updated version will be posted on this page with a revised "Effective Date."
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                11. Contact Us
              </Typography>
              <Typography paragraph>
                For any questions, concerns, or requests regarding this Privacy Policy, please contact:
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

export default PrivacyPolicyPage;