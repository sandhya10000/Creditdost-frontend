# Claude AI Integration - Setup & Usage Guide

## Overview
This integration adds Claude AI-powered document analysis to the AI Analysis tab in the franchise dashboard. Users can upload PDF/HTML documents and receive comprehensive HTML analysis reports via email.

## Features

### For Franchise Users:
- **Automatic AI Analysis**: Documents are automatically analyzed by Claude AI upon upload
- **Email Delivery**: HTML analysis reports are sent directly to user's email
- **Manual Trigger**: Option to re-analyze documents on demand
- **Download Reports**: Download HTML analysis reports from the dashboard
- **Real-time Status**: Track analysis progress (Pending → Processing → Completed)

### For Admins:
- **Custom Prompts**: Configure the AI analysis prompt via settings endpoint
- **Model Selection**: Choose which Claude model to use
- **Monitoring**: View all analysis requests and their status

## Setup Instructions

### 1. Configure Environment Variables

Add the following to your `.env` file:

```env
# Claude API (for AI Analysis)
CLAUDE_API_KEY=your_claude_api_key_here
CLAUDE_MODEL=claude-sonnet-4-20250514

# AI Analysis Default Prompt
AI_ANALYSIS_PROMPT=You are a professional credit analysis assistant. Analyze the uploaded document carefully and provide a comprehensive analysis report in HTML format. Include: 1) Executive Summary, 2) Key Findings, 3) Risk Assessment, 4) Recommendations. Format the output as clean, professional HTML with proper styling.
```

**Get Claude API Key:**
1. Visit https://console.anthropic.com
2. Sign up or log in to your account
3. Go to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

### 2. Install Dependencies

Already installed via:
```bash
npm install @anthropic-ai/sdk pdf-parse
```

### 3. Update Database Schema

The AIAnalysis model has been updated with new fields:
- `claudeAnalysisHtml`: Path to generated HTML report
- `claudeAnalysisFileName`: Name of the HTML file
- `analysisPrompt`: Custom prompt used for analysis
- `isAutoAnalyzed`: Boolean flag for automatic analysis
- `claudeAnalysisStatus`: Status (pending/processing/completed/failed)
- `claudeAnalysisError`: Error message if analysis fails
- `analyzedAt`: Timestamp of analysis completion

Run this MongoDB migration script to update existing documents:

```javascript
// migrations/add-claude-fields.js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const AIAnalysis = mongoose.model('AIAnalysis', new mongoose.Schema({
  claudeAnalysisHtml: String,
  claudeAnalysisFileName: String,
  analysisPrompt: String,
  isAutoAnalyzed: Boolean,
  claudeAnalysisStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  claudeAnalysisError: String,
  analyzedAt: Date
}));

async function migrate() {
  await AIAnalysis.updateMany(
    {},
    {
      $setOnInsert: {
        claudeAnalysisStatus: 'pending',
        isAutoAnalyzed: false
      }
    },
    { upsert: false }
  );
  console.log('Migration completed');
  process.exit();
}

migrate();
```

## API Endpoints

### Franchise Endpoints

#### Upload Document (Triggers Auto Analysis)
```http
POST /api/ai-analysis/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
  document: <file>
```

Response:
```json
{
  "message": "Document uploaded successfully. AI analysis will be performed automatically.",
  "document": { ... }
}
```

#### Get My Documents
```http
GET /api/ai-analysis/franchise/documents
Authorization: Bearer <token>
```

#### Manually Trigger AI Analysis
```http
POST /api/ai-analysis/franchise/analyze/:id
Authorization: Bearer <token>
```

#### Download Analysis Report
```http
GET /api/ai-analysis/franchise/download-analysis/:id
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get AI Analysis Settings
```http
GET /api/ai-analysis/admin/settings
Authorization: Bearer <token>
```

Response:
```json
{
  "prompt": "Your custom prompt...",
  "model": "claude-sonnet-4-20250514"
}
```

#### Update AI Analysis Settings
```http
PUT /api/ai-analysis/admin/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "New custom prompt...",
  "model": "claude-3-opus-20240229"
}
```

## How It Works

### Automatic Analysis Flow:

1. **User Uploads Document**
   - User uploads PDF/HTML via franchise dashboard
   - File is saved to server

2. **Background Processing**
   - System extracts text from PDF or reads HTML
   - Text is sent to Claude API with configured prompt
   - Claude generates comprehensive HTML analysis

3. **Report Generation**
   - HTML analysis is saved to file system
   - Database record is updated with analysis path
   - Status changed to "completed"

4. **Email Delivery**
   - HTML report is attached to email
   - Email sent to franchise user
   - Admin receives notification

5. **Dashboard Update**
   - User sees "AI Analyzed" badge
   - Download button appears
   - Can view analysis timestamp

### Manual Analysis Flow:

1. User clicks "Refresh" icon on any document
2. System triggers Claude analysis
3. Same process as automatic flow
4. Dashboard refreshes to show results

## Usage Examples

### Customizing the Analysis Prompt

Example prompts for different use cases:

**Credit Report Analysis:**
```
You are a professional credit analyst. Analyze this credit report and provide:
1. Credit Score Summary
2. Payment History Analysis
3. Credit Utilization Assessment
4. Derogatory Marks Review
5. Recommendations for Improvement

Format as professional HTML with charts where applicable.
```

**Business Document Analysis:**
```
Analyze this business document and provide:
1. Executive Summary
2. Key Business Metrics
3. Risk Factors
4. Growth Opportunities
5. Strategic Recommendations

Use professional business language and HTML formatting.
```

### Testing the Integration

1. **Test Upload:**
   ```bash
   # Upload a test PDF
   curl -X POST https://reactbackend.creditdost.co.in/api/ai-analysis/upload \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "document=@test-credit-report.pdf"
   ```

2. **Check Analysis Status:**
   ```bash
   curl https://reactbackend.creditdost.co.in/api/ai-analysis/franchise/documents \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. **Download Report:**
   ```bash
   curl -O https://reactbackend.creditdost.co.in/api/ai-analysis/franchise/download-analysis/DOCUMENT_ID \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

## Troubleshooting

### Common Issues

**1. "Claude API key not configured"**
- Check `.env` file has `CLAUDE_API_KEY` set
- Restart server after adding key
- Ensure key doesn't have extra spaces

**2. "Failed to extract text from PDF"**
- Verify PDF is not password-protected
- Check PDF file is not corrupted
- Ensure pdf-parse is installed

**3. "Analysis failed: Rate limit exceeded"**
- Claude API has rate limits
- Wait a few minutes before retrying
- Consider upgrading Anthropic plan

**4. "HTML report not downloading"**
- Check file exists at the path in database
- Verify CORS settings allow blob downloads
- Check browser console for errors

### Error Handling

The system handles errors gracefully:
- Failed analysis marked as "failed" in database
- Error messages stored in `claudeAnalysisError` field
- User can see error in dashboard
- Manual retry option available

## Best Practices

### Security
- Never commit `.env` file with API keys
- Use environment variables in production
- Rotate API keys regularly
- Implement rate limiting on endpoints

### Performance
- Analysis runs asynchronously (non-blocking)
- Large files may take longer (1-2 minutes typical)
- Consider file size limits (recommend < 10MB)
- Monitor API usage and costs

### User Experience
- Clear status indicators in UI
- Provide estimated completion time
- Send email notifications
- Allow manual retry on failures

## Cost Considerations

Claude API pricing (as of 2024):
- Claude Sonnet: ~$0.0025 per 1K tokens
- Average document: 2-5K tokens
- Cost per analysis: ~$0.005 - $0.0125

Monitor usage at: https://console.anthropic.com/dashboard

## Support

For issues or questions:
- Check error logs in server console
- Review Claude API documentation: https://docs.anthropic.com
- Contact support team

---

**Version:** 1.0.0  
**Last Updated:** March 11, 2026
