/**
 * Google Apps Script to handle form submissions and store in Google Sheets
 * Deploy this as a web app to get a URL for form submissions
 */

// IMPORTANT: Replace this with your actual Google Spreadsheet ID
// You can get this from your spreadsheet URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
const SPREADSHEET_ID = '1I1Zw3HtxYwrQO1xF8I-z55psiHjoHDOBp3H40tYCfo0'; // Replace with your actual spreadsheet ID

function doPost(e) {
  try {
    console.log('POST request received:', e);
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    console.log('Received POST data:', data);
    
    // Get or create the spreadsheet
    const sheet = getOrCreateSheet();
    
    // Add headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      addHeaders(sheet);
    }
    
    // Ensure headers include latest expected set for compatibility with existing sheets
    ensureSheetHeaders(sheet);
    
    // Add the form data to the sheet
    addFormData(sheet, data);
    
    console.log('Data saved successfully');
    
    // Return success response (Google Apps Script handles CORS automatically for "Anyone" access)
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Data saved successfully'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: false, message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  console.log('GET request received:', e);
  
  // Handle GET requests and return status
  return ContentService
    .createTextOutput(JSON.stringify({status: 'ready', timestamp: new Date().toISOString()}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  console.log('OPTIONS request received (if called)');
  
  // Google Apps Script doesn't handle OPTIONS well, but return empty response
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet() {
  const sheetName = 'AI Coach Questionnaire Responses';
  let spreadsheet;
  
  try {
    if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
      throw new Error('Please update SPREADSHEET_ID with your actual Google Spreadsheet ID');
    }
    
    // Open the specific spreadsheet by ID
    spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('Opened existing spreadsheet with ID:', SPREADSHEET_ID);
    
  } catch (error) {
    console.error('Error opening spreadsheet:', error);
    throw new Error('Could not open spreadsheet. Please check that SPREADSHEET_ID is correct and the script has access to the spreadsheet.');
  }
  
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    console.log('Created new sheet:', sheetName);
  }
  
  return sheet;
}

function addHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Struggle with Goals',
    'Life Change Scale (Coach Tasks)',
    'Would Achieve More (Coach)',
    'Achievement Scale',
    'Feeling about AI Coach',
    'Email',
    'Prolific PID',
    'Prolific Study ID',
    'Prolific Session ID',
    'User Agent',
    'IP Address (if available)'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
}

function getRequiredHeaders() {
  return [
    'Timestamp',
    'Struggle with Goals',
    'Life Change Scale (Coach Tasks)',
    'Would Achieve More (Coach)',
    'Achievement Scale',
    'Feeling about AI Coach',
    'Email',
    'Prolific PID',
    'Prolific Study ID',
    'Prolific Session ID',
    'User Agent',
    'IP Address (if available)'
  ];
}

/**
 * Ensures the first row contains all required headers; appends any missing headers at the end.
 * Returns the up-to-date header list.
 */
function ensureSheetHeaders(sheet) {
  const lastColumn = sheet.getLastColumn();
  const currentHeaders = lastColumn > 0 ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0] : [];
  const required = getRequiredHeaders();
  const missing = required.filter(function(h) { return currentHeaders.indexOf(h) === -1; });
  if (missing.length > 0) {
    const newHeaders = currentHeaders.concat(missing);
    sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
    return newHeaders;
  }
  return currentHeaders;
}

function addFormData(sheet, data) {
  const timestamp = new Date();
  // Ensure headers are up to date and map values to header order
  const headers = ensureSheetHeaders(sheet);
  const valueByHeader = {
    'Timestamp': timestamp,
    'Struggle with Goals': data.struggle_with_goals || '',
    'Life Change Scale (Coach Tasks)': data.life_change_scale || '',
    'Would Achieve More (Coach)': data.would_achieve_more || '',
    'Achievement Scale': data.achievement_scale || '',
    'Feeling about AI Coach': data.feeling_about_ai || '',
    'Email': data.email || '',
    'Prolific PID': data.prolific_pid || '',
    'Prolific Study ID': data.prolific_study_id || '',
    'Prolific Session ID': data.prolific_session_id || '',
    'User Agent': data.userAgent || '',
    'IP Address (if available)': data.ipAddress || ''
  };
  const rowData = headers.map(function(h) { return valueByHeader.hasOwnProperty(h) ? valueByHeader[h] : ''; });
  const nextRow = sheet.getLastRow() + 1;
  sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, rowData.length);
}

/**
 * Test function to verify the script works
 */
function testFormSubmission() {
  const testData = {
    struggle_with_goals: 'Sometimes',
    life_change_scale: '8',
    would_achieve_more: 'Yes, absolutely',
    achievement_scale: '7',
    feeling_about_ai: 'Really Excited',
    email: 'test@example.com',
    userAgent: 'Test Browser',
    ipAddress: '127.0.0.1'
  };
  
  const sheet = getOrCreateSheet();
  if (sheet.getLastRow() === 0) {
    addHeaders(sheet);
  }
  addFormData(sheet, testData);
  
  console.log('Test data added successfully');
} 