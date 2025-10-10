/**
 * Google Apps Script for Form Submissions to Google Sheets
 * 
 * Instructions:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Create a new Google Sheet
 * 5. Get the Sheet ID from the URL
 * 6. Update the SHEET_ID constant below
 * 7. Deploy as a web app with execute permissions for "Anyone"
 * 8. Copy the web app URL and use it in your form submission
 */

// Replace this with your actual Google Sheet ID
const SHEET_ID = '1KIXWABdx4uqvahJa97zHBl_qfTp67_1miYivZcmFyu4';

function doPost(e) {
  try {
    // Get the Google Sheet using the specific Sheet ID
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // Parse the form data
    const data = JSON.parse(e.postData.contents);
    
    // Handle file upload if present
    let fileInfo = '';
    if (data.fileName && data.fileContent) {
      try {
        // Create a folder for form uploads if it doesn't exist
        const folderName = 'Nesium Form Uploads';
        let folder;
        const folders = DriveApp.getFoldersByName(folderName);
        if (folders.hasNext()) {
          folder = folders.next();
        } else {
          folder = DriveApp.createFolder(folderName);
        }
        
        // Create a unique filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${data.name || 'Unknown'}_${timestamp}_${data.fileName}`;
        
        // Create the file in Google Drive
        const blob = Utilities.newBlob(Utilities.base64Decode(data.fileContent), data.fileType, fileName);
        const file = folder.createFile(blob);
        
        // Set file permissions to be viewable by anyone with the link
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        fileInfo = `File uploaded: ${fileName} - Link: ${file.getUrl()}`;
        
        Logger.log('File uploaded successfully: ' + fileName);
      } catch (fileError) {
        Logger.log('File upload error: ' + fileError.toString());
        fileInfo = 'File upload failed: ' + fileError.toString();
      }
    }
    
    // Prepare the row data
    const rowData = [
      data.name || '', // 1 - Name
      data.company || '', // 2 - Company
      data.projectType || '', // 3 - Project Type
      data.budget || '', // 4 - Budget
      data.message || '', // 5 - Message
      data.contactMethod || '', // 6 - Contact Method
      'Submission', // 7 - Status (default value)
      new Date().toISOString(), // 8 - Timestamp
      data.email || '', // 9 - Email
      data.phone || '', // 10 - Phone
      data.improvements ? data.improvements.join(', ') : '', // 11 - Improvements
      data.customImprovement || '', // 12 - Custom Improvement
      data.startDate || '', // 13 - Start Date
      fileInfo, // 14 - File Upload
      data.ab_test_title || '', // 15 - AB Test Title
      data.form_type || '', // 16 - Form Type
      data.url || '' // 17 - Source URL
    ];
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Form submitted successfully' + (fileInfo ? ' with file upload' : ''),
        fileUploaded: !!fileInfo
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  // Handle CORS preflight requests
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    // Handle GET requests (for testing and JSONP)
    const response = {
      success: true,
      message: 'Google Sheets Form Handler is running',
      timestamp: new Date().toISOString()
    };
    
    // Check if this is a JSONP request
    const callback = e.parameter.callback;
    
    if (callback) {
      // Return JSONP response
      const jsonpResponse = callback + '(' + JSON.stringify(response) + ');';
      return ContentService
        .createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      // Return regular JSON response
      return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to set up the sheet headers (run this once)
function setupSheetHeaders() {
  try {
    // Get the Google Sheet using the specific Sheet ID
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    const headers = [
      'Name', // 1
      'Company', // 2
      'Project Type', // 3
      'Budget', // 4
      'Message', // 5
      'Contact Method', // 6
      'Status', // 7
      'Timestamp', // 8
      'Email', // 9
      'Phone', // 10
      'Improvements', // 11
      'Custom Improvement', // 12
      'Start Date', // 13
      'File Upload', // 14
      'AB Test Title', // 15
      'Form Type', // 16
      'Source URL' // 17
    ];
    
    // Clear existing data and add headers
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#d6ff48'); // BRAND COLOR - Google Sheets header background
    
    Logger.log('Sheet headers set up successfully');
    Logger.log('Headers: ' + headers.join(', '));
    
  } catch (error) {
    Logger.log('Error setting up headers: ' + error.toString());
  }
}

// Function to test the connection
function testConnection() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getActiveSheet();
  const testData = [
    'Test User', // 1 - Name
    'Test Company', // 2 - Company
    'Website', // 3 - Project Type
    '$5000', // 4 - Budget
    'This is a test message', // 5 - Message
    'email', // 6 - Contact Method
    'Submission', // 7 - Status
    new Date().toISOString(), // 8 - Timestamp
    'test@example.com', // 9 - Email
    '123-456-7890', // 10 - Phone
    'Lead Management, Content Automation', // 11 - Improvements
    'Custom test improvement', // 12 - Custom Improvement
    '2024-01-15', // 13 - Start Date
    'Test file upload', // 14 - File Upload
    'Test title for A/B testing', // 15 - AB Test Title
    'test-form', // 16 - Form Type
    'https://example.com' // 17 - Source URL
  ];
  
  sheet.appendRow(testData);
  Logger.log('Test data added successfully');
}
