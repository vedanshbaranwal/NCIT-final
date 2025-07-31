// Quick test to verify Google Sheets connection
import { google } from 'googleapis';

const SPREADSHEET_ID = '1CuqYP9kyYUSszYVN3_ZJAjHV6rHnnONO_wJjBqPUzew';
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

async function testConnection() {
  try {
    console.log('Testing Google Sheets connection...');
    console.log('Service Account:', SERVICE_ACCOUNT_EMAIL);
    console.log('Private Key Length:', PRIVATE_KEY.length);
    
    const auth = new google.auth.JWT(
      SERVICE_ACCOUNT_EMAIL,
      undefined,
      PRIVATE_KEY,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets('v4');
    
    // Test reading the spreadsheet
    const response = await sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: SPREADSHEET_ID,
      range: 'Categories!A1:Z10',
    });

    console.log('✅ Connection successful!');
    console.log('Data:', response.data.values);
    
    // Test writing sample data
    const testData = [
      ['id', 'name', 'nameNepali', 'description', 'icon', 'color', 'isActive', 'createdAt', 'updatedAt'],
      ['1', 'Electrician', 'बिजुली मिस्त्री', 'Electrical repairs', 'fas fa-bolt', 'yellow', 'TRUE', new Date().toISOString(), new Date().toISOString()]
    ];
    
    await sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId: SPREADSHEET_ID,
      range: 'Categories!A:I',
      valueInputOption: 'RAW',
      requestBody: { values: testData },
    });
    
    console.log('✅ Test data written to Categories sheet');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();