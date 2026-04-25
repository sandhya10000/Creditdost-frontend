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

const DisclaimerPage = () => {
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
              Disclaimer Policy
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
                1. General Disclaimer
              </Typography>
              <Typography paragraph>
                The information provided on www.creditdost.co.in ("Website") and all its associated programs, materials, and communications are owned and managed by Optimystic Auxiliary Services Private Limited ("we," "our," "us").
              </Typography>
              <Typography paragraph>
                All content is intended for educational, informational, and business purposes only and should not be considered financial, legal, or professional advice.
              </Typography>
              <Typography paragraph>
                While we strive to ensure that all information shared is accurate and up to date, Credit Dost makes no warranties or representations about the completeness, reliability, suitability, or accuracy of any information on this website.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                2. No Professional or Financial Advice
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • The services, programs, and content offered by Credit Dost are not a substitute for independent financial or legal consultation.
                </Typography>
                <Typography paragraph>
                  • Users are encouraged to perform their own due diligence or seek professional advice before making any financial or credit-related decisions.
                </Typography>
                <Typography paragraph>
                  • We do not guarantee any specific results or credit score improvements, as outcomes depend on various individual factors, including user participation, past credit history, and adherence to guidance.
                </Typography>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                3. Franchise & Earning Disclaimer
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • The Credit Dost Franchise Program offers a business opportunity, not a job or employment guarantee.
                </Typography>
                <Typography paragraph>
                  • Income and results vary based on individual effort, market conditions, and consistency in execution.
                </Typography>
                <Typography paragraph>
                  • Any examples of income, testimonials, or success stories displayed on this website or in training materials are illustrative only and do not represent guaranteed outcomes.
                </Typography>
                <Typography paragraph>
                  • Participants are advised to treat the franchise as an entrepreneurial opportunity with both risks and rewards.
                </Typography>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                4. External Links Disclaimer
              </Typography>
              <Typography paragraph>
                Our website may contain links to external websites or third-party resources. These are provided solely for convenience and informational purposes.
              </Typography>
              <Typography paragraph>
                Credit Dost has no control over the content, privacy policies, or practices of any third-party websites and assumes no responsibility for them.
              </Typography>
              <Typography paragraph>
                Visiting such external links is done at your own discretion and risk.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                5. Limitation of Liability
              </Typography>
              <Typography paragraph>
                Under no circumstances shall Optimystic Auxiliary Services Private Limited or its directors, employees, associates, or partners be held liable for:
              </Typography>
              <Typography component="div" sx={{ pl: 2 }}>
                <Typography paragraph>
                  • Any direct, indirect, incidental, or consequential damages
                </Typography>
                <Typography paragraph>
                  • Loss of profits, data, or goodwill
                </Typography>
                <Typography paragraph>
                  • Delays or interruptions in services
                </Typography>
                <Typography paragraph>
                  • Any action taken based on the information provided on our website or through our representatives
                </Typography>
              </Typography>
              <Typography paragraph>
                By using our website or enrolling in our programs, you agree that your use of the services is at your sole risk.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                6. Testimonials and Endorsements
              </Typography>
              <Typography paragraph>
                Testimonials and feedback shared by users or franchise partners represent their personal experiences.
              </Typography>
              <Typography paragraph>
                We do not claim that every participant will achieve similar results.
              </Typography>
              <Typography paragraph>
                Testimonials should not be interpreted as a promise or guarantee of earnings, outcomes, or performance.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                7. Policy Updates
              </Typography>
              <Typography paragraph>
                We reserve the right to modify, update, or amend this Disclaimer Policy at any time without prior notice.
              </Typography>
              <Typography paragraph>
                All updates will be posted on this page with a revised effective date. Continued use of our website constitutes acceptance of any such changes.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                8. Contact Us
              </Typography>
              <Typography paragraph>
                For any questions or concerns regarding this Disclaimer Policy, please contact:
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

export default DisclaimerPage;