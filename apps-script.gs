/**
 * Google Apps Script for RSVP form submissions.
 *
 * Setup steps (also see SETUP.md):
 *   1. Create a new Google Sheet, name it "Engagement RSVPs"
 *   2. In that sheet, go to Extensions > Apps Script
 *   3. Delete any boilerplate code, paste THIS file in
 *   4. Hit Save (the project name doesn't matter)
 *   5. Click Deploy > New deployment
 *      - Type: Web app
 *      - Execute as: Me (your account)
 *      - Who has access: Anyone
 *   6. Authorize when prompted
 *   7. Copy the Web app URL it gives you
 *   8. Paste that URL into rsvp.html where it says PASTE_YOUR_APPS_SCRIPT_URL_HERE
 */

// ============================================================
// Change this if you want notifications elsewhere
const NOTIFY_EMAIL = 'jessicasourbeer@gmail.com';
// ============================================================

function doPost(e) {
  try {
    // The form sends JSON as text/plain to avoid a CORS preflight
    const payload = JSON.parse(e.postData.contents);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // If sheet is empty, write a header row
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Email',
        'Attending',
        'Plus One',
        'Plus One Name',
        'Dietary',
      ]);
    }

    sheet.appendRow([
      payload.timestamp || new Date().toISOString(),
      payload.name || '',
      payload.email || '',
      payload.attending || '',
      payload.plusOne || '',
      payload.plusOneName || '',
      payload.dietary || '',
    ]);

    // Email notification
    const subject = payload.attending === 'yes'
      ? `${payload.name} is coming to the engagement party`
      : `${payload.name} can't make the engagement party`;

    const body = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Attending: ${payload.attending}`,
      payload.attending === 'yes' ? `Plus one: ${payload.plusOne || '(no answer)'}` : '',
      payload.plusOneName ? `Plus one's name: ${payload.plusOneName}` : '',
      payload.dietary ? `Dietary: ${payload.dietary}` : '',
      '',
      `Submitted: ${payload.timestamp}`,
    ].filter(Boolean).join('\n');

    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: lets you visit the URL in a browser to verify the deployment is live
function doGet() {
  return ContentService
    .createTextOutput('RSVP endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
