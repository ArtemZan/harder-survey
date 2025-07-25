# AI Coach Questionnaire - Google Sheets Integration Setup

This guide will help you set up your questionnaire to automatically save responses to Google Sheets.

## Overview

Your questionnaire has 6 questions:
1. **Struggle with Goals** (Multiple Choice) - Required
2. **Life Change Scale** (0-10 Scale) - Required  
3. **Would Achieve More** (Multiple Choice) - Required
4. **Achievement Scale** (0-10 Scale) - Required (conditional)
5. **Feeling about AI Coach** (Multiple Choice) - Required
6. **Email** (Text Input) - Optional

## Step 1: Create Google Spreadsheet (IMPORTANT - Do This First!)

### 1.1 Create a New Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com/)
2. Click **"Blank"** to create a new spreadsheet
3. Give it a name like "AI Coach Questionnaire Responses"
4. **IMPORTANT**: Copy the Spreadsheet ID from the URL
   - The URL looks like: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the long string between `/d/` and `/edit` - this is your Spreadsheet ID
   - Example: If URL is `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - Your Spreadsheet ID is: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Step 2: Set Up Google Apps Script

### 2.1 Create a New Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/)
2. Click **"New Project"**
3. Delete the default code in the editor
4. Copy and paste the entire content from `google-apps-script.js`
5. **CRITICAL**: Find this line at the top of the script:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```
6. Replace `'YOUR_SPREADSHEET_ID_HERE'` with your actual Spreadsheet ID from Step 1.1
   ```javascript
   const SPREADSHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
   ```
7. Save the project (Ctrl+S or Cmd+S)
8. Give it a name like "AI Coach Questionnaire Handler"

### 2.2 Test the Script

1. In the Apps Script editor, select the `testFormSubmission` function from the dropdown
2. Click the **Run** button (▶️)
3. Grant permissions when prompted:
   - Click **"Review permissions"**
   - Choose your Google account
   - Click **"Advanced"** → **"Go to [Your Project Name] (unsafe)"**
   - Click **"Allow"**
4. Check the execution log for any errors
5. **Verify**: Go back to your Google Spreadsheet - you should see headers and test data added

### 2.3 Deploy as Web App

1. Click **"Deploy"** → **"New deployment"**
2. Click the gear icon ⚙️ next to "Type"
3. Select **"Web app"**
4. Configure the deployment:
   - **Description**: "AI Coach Questionnaire Form Handler"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **"Deploy"**
6. **IMPORTANT**: Copy the Web app URL - you'll need this for the HTML file

## Step 3: Update the HTML File

1. Open `index.html`
2. Find this line near the top of the JavaScript section:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxP15_XNxdL7x1wUFPgJJc4Czqu6vfMEm056cMsPufTyjpkwdCLGSmhn-WLhxUrHIDS/exec';
   ```
3. Replace the entire URL with the Web app URL you copied in Step 2.3
4. Save the file

**Example:**
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
```

## Step 4: Test the Integration

### 4.1 Test Form Submission
1. Open `index.html` in a web browser
2. Fill out the questionnaire completely
3. Click "Submit your answers"
4. You should see a success message

### 4.2 Verify Data in Google Sheets
1. Go back to your Google Spreadsheet from Step 1
2. Verify your test data appears in a new row
3. **Important**: All future submissions should go to this same spreadsheet

## Step 5: Deploy Your Form

### Hosting Options

#### Option A: Simple File Hosting
1. Upload `index.html` and `index.css` and `peak.jpg` to any web hosting service
2. Share the URL with your audience

#### Option B: GitHub Pages (Free)
1. Create a GitHub repository
2. Upload all files (`index.html`, `index.css`, `peak.jpg`)
3. Enable GitHub Pages in repository settings
4. Your form will be available at `https://[username].github.io/[repository-name]/`

#### Option C: Local Testing
1. Simply open `index.html` directly in a web browser
2. The form will work for testing, but you'll need proper hosting for public use

## Troubleshooting

### Common Issues

**1. "Please update SPREADSHEET_ID" Error**
- You forgot to replace `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID
- Double-check the Spreadsheet ID is correct (no spaces, quotes, etc.)

**2. New Spreadsheets Created Each Time**
- This happens if the Spreadsheet ID is wrong or not set
- Verify you followed Step 2.1 correctly
- Make sure the Google Apps Script has permission to access your spreadsheet

**3. CORS Errors**
- Make sure the Web app is deployed with "Anyone" access
- Ensure the URL in the HTML file is correct and ends with `/exec`

**4. Permission Denied**
- Re-run the authorization process in Google Apps Script
- Make sure the Web app is executed "as me"
- Verify your Google account has access to both the spreadsheet and the script

**5. Data Not Appearing in Sheets**
- Check the Apps Script execution log for errors
- Verify the Web app URL is correct
- Test the `testFormSubmission` function first
- Make sure you're looking at the correct spreadsheet

**6. Form Not Submitting**
- Open browser developer tools (F12) and check the Console for errors
- Verify internet connection
- Try submitting with different browsers

### Checking Logs

1. In Google Apps Script, go to **"Executions"** tab
2. Click on any execution to see detailed logs
3. Look for error messages or successful completions

### Testing the Google Apps Script Directly

You can test your Google Apps Script without the form:

1. In Apps Script editor, go to **"Functions"** dropdown
2. Select `testFormSubmission`
3. Click **"Run"**
4. Check if test data appears in your Google Sheets

## Data Structure

Your Google Sheets will have these columns:
- **Timestamp**: When the form was submitted
- **Struggle with Goals**: Answer to question 1
- **Life Change Scale (Coach Tasks)**: Answer to question 2 (0-10)
- **Would Achieve More (Coach)**: Answer to question 3
- **Achievement Scale**: Answer to question 4 (0-10, if applicable)
- **Feeling about AI Coach**: Answer to question 5
- **Email**: Email address (if provided)
- **User Agent**: Browser information
- **IP Address**: Not available from client-side

## Security Notes

- The Google Apps Script runs with your permissions
- All form submissions will be stored in your Google account
- The form data is sent over HTTPS for security
- No sensitive data like passwords should be collected

## Why This Setup Prevents Multiple Spreadsheets

The previous issue where each submission created a new spreadsheet happened because:
- `SpreadsheetApp.getActiveSpreadsheet()` returns null in web app context
- The script would fall back to creating a new spreadsheet each time

Our fix:
- We specify the exact spreadsheet ID to use
- `SpreadsheetApp.openById(SPREADSHEET_ID)` always opens the same spreadsheet
- All submissions go to the same file, just adding new rows

## Customization

### Adding More Questions
1. Add the question HTML in `index.html`
2. Update the JavaScript to collect the new data
3. Add a new column in the `addHeaders` function in `google-apps-script.js`
4. Update the `addFormData` function to include the new field

### Changing Email Notifications
You can modify the Google Apps Script to send email notifications:

```javascript
function sendNotificationEmail(data) {
  const subject = 'New AI Coach Questionnaire Response';
  const body = `New response received:\n\n${JSON.stringify(data, null, 2)}`;
  GmailApp.sendEmail('your-email@gmail.com', subject, body);
}
```

Add this function call to the `doPost` function after successfully saving data.

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the Google Apps Script execution logs
3. Test each component individually
4. Ensure all URLs and IDs are correctly configured

The system is designed to be robust and handle various scenarios, including network issues and duplicate submissions. 