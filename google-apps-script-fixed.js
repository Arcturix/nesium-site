/**
 * Google Apps Script for Form Submission to Google Sheets
 * Handles form data and file uploads
 */

// Replace this with your actual Google Sheet ID
const SHEET_ID = '1KIXWABdx4uqvahJa97zHBl_qfTp67_1miYivZcmFyu4';

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the Google Sheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // Handle file upload if present
    let fileInfo = '';
    if (data.fileName && data.fileContent && data.fileType) {
      try {
        // Create folder for uploads
        const folderName = 'Nesium Form Uploads';
        let folder;
        const folders = DriveApp.getFoldersByName(folderName);
        
        if (folders.hasNext()) {
          folder = folders.next();
        } else {
          folder = DriveApp.createFolder(folderName);
        }
        
        // Create file with unique name
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${data.name || 'Unknown'}_${timestamp}_${data.fileName}`;
        
        // Convert base64 to blob
        const blob = Utilities.newBlob(
          Utilities.base64Decode(data.fileContent), 
          data.fileType, 
          fileName
        );
        
        // Upload file
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        fileInfo = `File: ${file.getName()} - Link: ${file.getUrl()}`;
        
        Logger.log('File uploaded successfully: ' + fileName);
      } catch (fileError) {
        Logger.log('File upload error: ' + fileError.toString());
        fileInfo = 'File upload failed: ' + fileError.toString();
      }
    }
    
    // Prepare row data in the correct order
    const rowData = [
      data.name || '',                    // Name
      data.company || '',                 // Company
      data.projectType || '',             // Project Type
      data.budget || '',                  // Budget
      data.message || '',                 // Message
      data.contactMethod || '',           // Contact Method
      'Submission',                       // Status (default)
      data.improvements || '',            // Improvements
      data.customImprovement || '',        // Custom Improvement
      data.startDate || '',               // Start Date
      data.ab_test_title || '',           // AB Test Title
      fileInfo,                           // File Upload
      new Date().toISOString()            // Timestamp
    ];
    
    // Add the row to the sheet
    sheet.appendRow(rowData);
    
    Logger.log('Form data saved successfully');
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Form submitted successfully' + (fileInfo ? ' with file upload' : ''),
        fileUploaded: !!fileInfo
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
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

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Google Sheets Form Handler is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Function to set up the sheet headers (run this once)
function setupSheetHeaders() {
  try {
    // Get the Google Sheet using the specific Sheet ID
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // Clear existing content
    sheet.clear();
    
    // Define headers in the correct order
    const headers = [
      'Name',
      'Company', 
      'Project Type',
      'Budget',
      'Message',
      'Contact Method',
      'Status',
      'Improvements',
      'Custom Improvement',
      'Start Date',
      'AB Test Title',
      'File Upload',
      'Timestamp'
    ];
    
    // Add headers to the first row
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#f0f0f0');
    
    Logger.log('Sheet headers set up successfully');
    Logger.log('Headers: ' + headers.join(', '));
    
  } catch (error) {
    Logger.log('Error setting up headers: ' + error.toString());
  }
}

// Function to test the connection
function testConnection() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    const name = sheet.getName();
    
    Logger.log('Connection successful! Sheet name: ' + name);
    return 'Connection successful! Sheet name: ' + name;
  } catch (error) {
    Logger.log('Connection failed: ' + error.toString());
    return 'Connection failed: ' + error.toString();
  }
}
