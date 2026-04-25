# HTML File Upload Implementation for AI Analysis

## Changes Made

### Frontend Changes

#### 1. Admin Dashboard - ManageAIAnalysis.jsx
- Updated `handleFileChange` function to accept PDF and HTML files
- Modified input field `accept` attribute to include `"application/pdf,.html,text/html"`
- Changed button text from "Upload Response PDF" to "Upload Response PDF/HTML"
- Updated error message from "Please select a PDF file" to "Please select a PDF or HTML file"

#### 2. Franchise AI Analysis - AIAnalysis.jsx
- Updated `handleFileChange` function to accept PDF and HTML files
- Modified input field `accept` attribute to include `"application/pdf,.html,text/html"`
- Changed button text from "Select PDF File" to "Select PDF/HTML File"
- Updated description text to mention HTML files and general response text
- Updated error message from "Please select a PDF file" to "Please select a PDF or HTML file"

### Backend Changes

#### 1. File Upload Utility - fileUpload.js
- Modified `fileFilter` function to accept HTML files (`.html`, `.htm` extensions)
- Updated error message to include HTML files: "Only image, PDF, CSV, and HTML files are allowed!"
- Added HTML extensions to the regex pattern: `/\.(jpg|jpeg|png|pdf|csv|html|htm)$/`

#### 2. AI Analysis Controller - aiAnalysisController.js
- Updated franchise `uploadDocument` function to accept PDF and HTML files
- Updated admin `respondToDocument` function to accept PDF and HTML files
- Modified file extension checks to include `.html` and `.htm`
- Updated error messages to reflect HTML file support: "Only PDF and HTML files are allowed"

## Technical Details

### File Types Supported
- PDF files: `.pdf`
- HTML files: `.html`, `.htm`
- Content types: `application/pdf`, `text/html`

### Validation Logic
- Client-side validation ensures proper file types are selected
- Server-side validation double-checks file extensions before processing
- Both frontend and backend validate file types for security

### Database Compatibility
- Existing database schema works with HTML files since it stores file paths and names
- No database changes required

### Email Attachments
- HTML files will be sent as attachments in emails using the same mechanism as PDFs
- Email service functions remain unchanged

## Impact
- Admins can now respond to documents with either PDF or HTML files in the "Respond to Document" modal
- Franchise users can upload either PDF or HTML files for AI analysis
- All existing functionality remains intact
- No breaking changes to existing workflows