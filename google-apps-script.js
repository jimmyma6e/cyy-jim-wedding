// ─────────────────────────────────────────────────────────────
//  Crystal & Jimmy Wedding — RSVP Google Apps Script
//  Paste this into: script.google.com → New Project → Code.gs
//  Then: Deploy → New deployment → Web app
//        Execute as: Me  |  Who has access: Anyone
//  Copy the deployed URL into index.html → SHEETS_URL
// ─────────────────────────────────────────────────────────────

const SHEET_NAME = 'RSVPs'; // tab name in your Google Sheet

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss   = SpreadsheetApp.getActiveSpreadsheet();
    let sheet  = ss.getSheetByName(SHEET_NAME);

    // Auto-create the sheet + header row if it doesn't exist yet
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Submitted At', 'Email', 'Attending', 'Total Guests', 'Message',
        'Guest 1 Name', 'Guest 1 Dietary', 'Guest 1 Kid Meal',
        'Guest 2 Name', 'Guest 2 Dietary', 'Guest 2 Kid Meal',
        'Guest 3 Name', 'Guest 3 Dietary', 'Guest 3 Kid Meal',
        'Guest 4 Name', 'Guest 4 Dietary', 'Guest 4 Kid Meal',
        'Guest 5 Name', 'Guest 5 Dietary', 'Guest 5 Kid Meal',
      ]);
      // Bold + freeze the header row
      sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Build the row
    const row = [
      data.submittedAt || new Date().toISOString(),
      data.email       || '',
      data.attending   === 'yes' ? 'Yes' : 'No',
      data.guests      || 0,
      data.message     || '',
    ];

    // Up to 5 guests
    for (let i = 1; i <= 5; i++) {
      row.push(data[`guest${i}_name`]     || '');
      row.push(data[`guest${i}_dietary`]  || '');
      row.push(data[`guest${i}_kid_meal`] || '');
    }

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: open this URL in browser to test the sheet is accessible
function doGet() {
  return ContentService
    .createTextOutput('RSVP script is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
