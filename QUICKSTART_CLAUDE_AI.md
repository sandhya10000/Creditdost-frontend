# Quick Start Guide - Claude AI Integration

## 🚀 Getting Started in 3 Steps

### Step 1: Add Your Claude API Key

Open `Backend\.env` and add your API key:

```env
CLAUDE_API_KEY=sk-ant-api03-your-actual-key-here
CLAUDE_MODEL=claude-sonnet-4-20250514
AI_ANALYSIS_PROMPT=You are a professional credit analysis assistant. Analyze the uploaded document carefully and provide a comprehensive analysis report in HTML format. Include: 1) Executive Summary, 2) Key Findings, 3) Risk Assessment, 4) Recommendations. Format the output as clean, professional HTML with proper styling.
```

**Get your API key from:** https://console.anthropic.com/dashboard

### Step 2: Restart Your Server

```bash
cd Backend
npm run dev
```

### Step 3: Test the Integration

#### Option A: Via Dashboard (Recommended)
1. Log in to franchise dashboard
2. Navigate to "AI Analysis" tab
3. Upload a PDF or HTML document
4. Wait 1-2 minutes
5. Check your email for the HTML analysis report
6. Download the report from the dashboard

#### Option B: Via Test Script
```bash
cd Backend
node testClaudeAI.js
```

Expected output:
```
=== Claude AI Integration Test ===

Test 1: Checking environment variables...
✓ CLAUDE_API_KEY configured
✓ AI_ANALYSIS_PROMPT configured

Test 2: Creating sample test document...
✓ Test document created

Test 3: Testing Claude API analysis...
✓ Claude analysis completed successfully

Analysis Result Preview:
---
[HTML analysis preview...]
---

✓ Test files cleaned up

=== All Tests Passed! ===
```

## ✨ What Happens When a User Uploads a Document?

1. **Upload** → User uploads PDF/HTML via dashboard
2. **Extract** → System extracts text content
3. **Analyze** → Claude AI analyzes the document
4. **Generate** → HTML report is created
5. **Email** → Report sent to user's email
6. **Display** → Download button appears in dashboard

## 📊 Features Overview

### Automatic Analysis
- ✅ Triggers immediately on upload
- ✅ Runs in background (non-blocking)
- ✅ Email delivery of HTML report
- ✅ Status tracking in dashboard

### Manual Control
- 🔄 Re-analyze any document
- ⚙️ Custom prompts (admin only)
- 📥 Download reports anytime
- ❌ Error handling & retry

### Admin Controls
- 🔧 Configure analysis prompt
- 🎯 Choose Claude model
- 📈 Monitor all analyses
- 👥 View franchise usage

## 🎨 UI Components

### Franchise Dashboard Shows:
- **Upload Button** - Select PDF/HTML files
- **Status Badges**:
  - 🟢 "AI Analyzed" - Analysis complete
  - 🟡 "Analyzing..." - In progress
  - 🔴 "Analysis Failed" - Error occurred
- **Download Button** - Get HTML report
- **Refresh Button** - Trigger manual analysis

### Status Indicators:
```
Document.pdf [AI Analyzed] ✓
├─ Uploaded: Jan 15, 2026
├─ Status: responded
└─ Analyzed: Jan 15, 2026 10:30 AM
```

## 🔧 Configuration Options

### Change the Analysis Prompt

**Via API:**
```bash
curl -X PUT https://reactbackend.creditdost.co.in/api/ai-analysis/admin/settings \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Your custom prompt here..."
  }'
```

**Example Prompts:**

**Credit Analysis:**
```
You are a credit expert. Analyze this credit report and provide:
1. Credit Score Breakdown
2. Payment History Analysis
3. Credit Utilization Review
4. Negative Items
5. Improvement Strategy

Format as professional HTML with sections and bullet points.
```

**Business Analysis:**
```
Analyze this business document and provide:
1. Executive Summary
2. Key Metrics
3. SWOT Analysis
4. Financial Health
5. Recommendations

Use business professional tone and HTML formatting.
```

## 🐛 Troubleshooting

### Issue: "API key not configured"
**Solution:** Check `.env` file has `CLAUDE_API_KEY` set correctly

### Issue: "Rate limit exceeded"
**Solution:** Wait 1-2 minutes, then retry. Consider upgrading Anthropic plan.

### Issue: "Failed to extract text"
**Solution:** Ensure PDF is not password-protected or corrupted

### Issue: No email received
**Solution:** Check spam folder. Verify `EMAIL_USER` and `ADMIN_EMAIL` in `.env`

## 📝 Example Workflow

1. **Login** to franchise dashboard
2. **Navigate** to AI Analysis tab
3. **Click** "Select PDF/HTML File"
4. **Choose** your credit report PDF
5. **Click** "Upload Document"
6. **Wait** for confirmation message
7. **Check email** in 1-2 minutes
8. **Download** HTML report from dashboard

## 💰 Cost Estimate

- **Claude Sonnet**: ~$0.0025 per 1K tokens
- **Average document**: 2-5K tokens
- **Cost per analysis**: $0.005 - $0.0125
- **100 analyses/month**: ~$0.50 - $1.25

Monitor usage at: https://console.anthropic.com/dashboard

## 📞 Support

Having issues? Check:
- Full documentation: `CLAUDE_AI_INTEGRATION_GUIDE.md`
- Server logs for error messages
- Claude API docs: https://docs.anthropic.com

---

**Ready to analyze! 🎉**
