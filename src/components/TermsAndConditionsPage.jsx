import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Link
} from '@mui/material';
import Header from './homepage/Header';
import HomePageFooter from './homepage/HomePageFooter';

const TermsAndConditionsPage = () => {
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
              Terms & Conditions
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
                Welcome to Credit Dost, a website owned and operated by Optimystic Auxiliary Services Private Limited ("we," "our," "us").
              </Typography>
              <Typography paragraph>
                By accessing or using www.creditdost.co.in ("Website"), you agree to be bound by these Terms and Conditions ("Terms"). Please read them carefully before using our website or enrolling in our franchise program.
              </Typography>
              <Typography paragraph>
                If you do not agree to these Terms, you must not use this Website or any of its services.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                2. Definitions
              </Typography>
              <Typography paragraph>
                <strong>• "User," "You," or "Your"</strong> refers to any individual or entity using our website.
              </Typography>
              <Typography paragraph>
                <strong>• "Services"</strong> refers to credit score education, consulting, franchise programs, and related financial literacy services offered through this website.
              </Typography>
              <Typography paragraph>
                <strong>• "Company"</strong> refers to Optimystic Auxiliary Services Private Limited, the owner of Credit Dost.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                3. Eligibility
              </Typography>
              <Typography paragraph>
                By using this website or applying for the franchise program, you confirm that:
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • You are at least 18 years of age.
                </Typography>
                <Typography paragraph>
                  • You have the legal capacity to enter into a binding agreement.
                </Typography>
                <Typography paragraph>
                  • The information you provide is accurate, complete, and truthful.
                </Typography>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                4. Services Provided
              </Typography>
              <Typography paragraph>
                Credit Dost provides credit score repair education, consulting, and franchise programs that enable individuals or entities to represent and operate under the Credit Dost Learning brand.
              </Typography>
              <Typography paragraph>
                All programs, tools, and resources are designed to promote financial awareness and help franchisees build independent consulting opportunities.
              </Typography>
              <Typography paragraph>
                We are not a bank, NBFC, or lending institution and do not guarantee any specific credit score improvement or loan approval for end customers.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                5. User Obligations
              </Typography>
              <Typography paragraph>
                When using our website or enrolling in a franchise program, you agree:
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • Not to use the site for any unlawful or unauthorized purpose.
                </Typography>
                <Typography paragraph>
                  • Not to misuse, copy, or distribute any content or materials without written permission.
                </Typography>
                <Typography paragraph>
                  • To provide accurate and up-to-date details during registration or franchise onboarding.
                </Typography>
                <Typography paragraph>
                  • To adhere to the terms of the franchise agreement, if applicable.
                </Typography>
              </Typography>
              <Typography paragraph>
                Violation of these obligations may result in suspension or termination of access to our website or programs.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                6. Intellectual Property Rights
              </Typography>
              <Typography paragraph>
                All content, graphics, logos, text, software, videos, and materials available on this website are the exclusive property of Optimystic Auxiliary Services Private Limited and are protected by copyright and trademark laws.
              </Typography>
              <Typography paragraph>
                You may not copy, reproduce, distribute, or modify any content without prior written consent.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                7. Payments and Refund Policy
              </Typography>
              <Typography paragraph>
                If you enroll in our franchise program, the following conditions apply:
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • All applicable fees and charges shall be clearly displayed before payment.
                </Typography>
                <Typography paragraph>
                  • Payments are accepted through secure, authorized third-party payment gateways.
                </Typography>
                <Typography paragraph>
                  • Fees once paid are non-refundable, except in cases of proven technical error or duplicate transactions.
                </Typography>
              </Typography>
              <Typography paragraph>
                For any refund-related queries, please contact us at info@creditdost.co.in.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                8. Limitation of Liability
              </Typography>
              <Typography paragraph>
                While we strive to maintain the accuracy of information, Credit Dost and its parent company Optimystic Auxiliary Services Private Limited shall not be liable for:
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • Any financial loss or business outcome resulting from participation in the franchise program.
                </Typography>
                <Typography paragraph>
                  • Any inaccuracy, interruption, or delay in content or services.
                </Typography>
                <Typography paragraph>
                  • Any indirect, incidental, or consequential damages arising from the use of our website or materials.
                </Typography>
              </Typography>
              <Typography paragraph>
                Your use of the website and participation in any franchise program is entirely at your own risk.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                9. Disclaimer
              </Typography>
              <Typography paragraph>
                All content, resources, and services are provided on an "as is" and "as available" basis.
              </Typography>
              <Typography paragraph>
                We make no warranties, express or implied, regarding:
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • The accuracy or completeness of any information shared.
                </Typography>
                <Typography paragraph>
                  • Any guaranteed results or income from the franchise program.
                </Typography>
              </Typography>
              <Typography paragraph>
                Participants are expected to follow the business guidance provided, but success may vary based on individual effort and market conditions.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                10. Third-Party Links
              </Typography>
              <Typography paragraph>
                Our website may include links to third-party websites or service providers. These links are provided for convenience only. We do not endorse or control the content, policies, or practices of such third parties.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                11. Privacy
              </Typography>
              <Typography paragraph>
                Your use of this website is also governed by our Privacy Policy, which outlines how we collect, use, and protect your data.
              </Typography>
              <Typography paragraph>
                Please review our Privacy Policy here: <Link href="/privacy-policy" color="primary">Privacy Policy</Link>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                12. Indemnification
              </Typography>
              <Typography paragraph>
                You agree to indemnify and hold harmless Optimystic Auxiliary Services Private Limited, its directors, employees, and affiliates from any losses, damages, or claims resulting from:
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • Your breach of these Terms
                </Typography>
                <Typography paragraph>
                  • Misuse of our website, content, or franchise materials
                </Typography>
                <Typography paragraph>
                  • Violation of applicable laws or third-party rights
                </Typography>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                13. Termination
              </Typography>
              <Typography paragraph>
                We reserve the right to suspend or terminate your access to our website or franchise program at any time, without prior notice, if you violate these Terms or engage in behavior deemed harmful to the company's interests or reputation.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                14. Governing Law & Jurisdiction
              </Typography>
              <Typography paragraph>
                These Terms shall be governed by and construed in accordance with the laws of India.
              </Typography>
              <Typography paragraph>
                All disputes shall be subject to the exclusive jurisdiction of the competent courts located in Haryana, India.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                15. Contact Us
              </Typography>
              <Typography paragraph>
                For questions, feedback, or concerns about these Terms, please contact us:
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

export default TermsAndConditionsPage;