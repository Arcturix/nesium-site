# Google Sheets Integration Setup Guide

## Overview
This guide will help you set up automatic form submission to Google Sheets, so all your form data (including A/B testing information) is automatically saved to a spreadsheet in your Google Drive.

## Step-by-Step Setup

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click "Blank" to create a new spreadsheet
3. Name it something like "Nesium Form Submissions"
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit`
   - Sheet ID: `1ABC123DEF456GHI789JKL`

### Step 2: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Delete the default code and paste the contents of `google-apps-script.js`
4. Update the `SHEET_ID` constant with your actual Sheet ID
5. Save the project (Ctrl+S or Cmd+S)
6. Name your project "Nesium Form Handler"

### Step 3: Set Up Sheet Headers

1. In your Google Apps Script editor, click "Run" → "setupSheetHeaders"
2. Grant permissions when prompted
3. Go back to your Google Sheet - you should see the headers populated

### Step 4: Deploy as Web App

1. In Google Apps Script, click "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set the following:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the Web App URL (it will look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

### Step 5: Configure Your Website

1. Open `js/google-sheets-integration.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with your actual Web App URL
3. Save the file

### Step 6: Test the Integration

1. Open your website
2. Open browser developer tools (F12)
3. Go to Console tab
4. Submit a test form
5. You should see messages like:
   - "✅ Data saved to Google Sheets"
   - "📧 Email notification sent"

## What Gets Saved to Google Sheets

Your spreadsheet will automatically collect:

| Column | Description |
|--------|-------------|
| Name | User's first name |
| Company | User's company name |
| Project Type | Type of project requested |
| Budget | User's budget range |
| Message | Additional message from user |
| Contact Method | Preferred contact method (email/phone/whatsapp) |
| Status | Default value: 'Submission' |
| Timestamp | When the form was submitted |
| Email | User's email address |
| Phone | User's phone/WhatsApp number (if phone/WhatsApp contact method selected) |
| Improvements | Areas needing improvement (comma-separated) |
| Custom Improvement | Custom improvement description (if "Other/Custom" selected) |
| Start Date | Preferred start date |
| File Upload | Information about uploaded files (filename and Google Drive link) |
| AB Test Title | The actual title they saw |
| Form Type | Which form was submitted |
| Source URL | Which page the form was submitted from |

## File Upload Handling

When users upload files through the form:

1. **File Storage**: Files are automatically saved to a Google Drive folder called "Nesium Form Uploads"
2. **File Naming**: Files are renamed with the format: `[User Name]_[Timestamp]_[Original Filename]`
3. **Permissions**: Files are set to "Anyone with the link can view" for easy access
4. **Google Sheets**: The "File Upload" column contains the filename and Google Drive link
5. **Supported Formats**: PDF, DOC, DOCX, TXT files (as specified in the form)

### Accessing Uploaded Files

- Files are stored in your Google Drive in the "Nesium Form Uploads" folder
- Each file has a unique name with timestamp to avoid conflicts
- The Google Drive link is automatically included in the spreadsheet for easy access

## Troubleshooting

### Common Issues

**1. "Google Sheets integration not configured"**
- Make sure you've updated the Web App URL in `google-sheets-integration.js`
- Check that the URL is correct and complete

**2. "Google Sheets submission failed"**
- Check that your Google Apps Script is deployed correctly
- Verify the Sheet ID is correct
- Make sure the sheet has the proper headers

**3. "Network error"**
- Check your internet connection
- Verify the Web App URL is accessible
- Check browser console for CORS errors

**4. Data not appearing in sheet**
- Check Google Apps Script logs for errors
- Verify the sheet permissions
- Make sure the script has access to the sheet

### Testing the Connection

You can test the Google Sheets connection by running this in your browser console:

```javascript
// Test the connection
window.googleSheetsIntegration.testConnection().then(result => {
    console.log('Connection test result:', result);
});
```

### Manual Testing

1. Open your Google Apps Script
2. Click "Run" → "testConnection"
3. Check your Google Sheet for a test row
4. Delete the test row when done

## Advanced Configuration

### Customizing Data Fields

To add or modify fields saved to Google Sheets:

1. Update the `rowData` array in `google-apps-script.js`
2. Update the `headers` array in the `setupSheetHeaders` function
3. Redeploy your web app

### Adding Validation

You can add server-side validation in your Google Apps Script:

```javascript
// Add validation before saving
if (!data.email || !data.email.includes('@')) {
    return ContentService
        .createTextOutput(JSON.stringify({
            success: false,
            message: 'Invalid email address'
        }))
        .setMimeType(ContentService.MimeType.JSON);
}
```

### Email Notifications

Your existing PHP email system will continue to work alongside Google Sheets, so you'll get both:
- Instant email notifications
- Organized data in Google Sheets

## Security Considerations

- The web app is set to "Anyone" access for simplicity
- For production, consider restricting access
- All data is stored in your Google account
- No third-party services are involved

## Benefits

✅ **Automatic Data Collection**: No manual copy-pasting  
✅ **Real-time Updates**: Data appears instantly  
✅ **A/B Testing Data**: See which titles convert best  
✅ **Easy Analysis**: Use Google Sheets' built-in tools  
✅ **Backup**: Data is safely stored in Google Drive  
✅ **Sharing**: Easy to share data with team members  
✅ **Export**: Download as Excel, CSV, or PDF  

## Next Steps

1. **Set up the integration** following the steps above
2. **Test thoroughly** with different form submissions
3. **Monitor the data** to see A/B test results
4. **Analyze performance** using Google Sheets charts and filters
5. **Share access** with team members if needed

The system will now automatically save all form submissions to your Google Sheet, including the A/B testing data, giving you a complete picture of which titles are performing best!
