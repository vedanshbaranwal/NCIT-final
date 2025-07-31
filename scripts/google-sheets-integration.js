// Complete Google Sheets Integration for जरूरी छ Platform
import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';

const SPREADSHEET_ID = '1CuqYP9kyYUSszYVN3_ZJAjHV6rHnnONO_wJjBqPUzew';
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'jaruri@jaruri.iam.gserviceaccount.com';
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

const SHEET_CONFIGS = {
  Categories: {
    range: 'Categories!A:I',
    headers: ['id', 'name', 'nameNepali', 'description', 'icon', 'color', 'isActive', 'createdAt', 'updatedAt'],
    csvFile: 'categories.csv'
  },
  Services: {
    range: 'Services!A:K',
    headers: ['id', 'categoryId', 'name', 'nameNepali', 'description', 'basePrice', 'unit', 'estimatedDuration', 'isActive', 'createdAt', 'updatedAt'],
    csvFile: 'services.csv'
  },
  Locations: {
    range: 'Locations!A:H',
    headers: ['id', 'name', 'nameNepali', 'type', 'parentId', 'isServiceable', 'createdAt', 'updatedAt'],
    csvFile: 'locations.csv'
  },
  Users: {
    range: 'Users!A:K',
    headers: ['id', 'username', 'email', 'fullName', 'phone', 'role', 'profilePicture', 'isVerified', 'createdAt', 'updatedAt', 'lastLogin'],
    csvFile: 'users.csv'
  },
  Bookings: {
    range: 'Bookings!A:S',
    headers: [
      'id', 'customerId', 'professionalId', 'serviceId', 'location', 'address', 
      'coordinates', 'scheduledDate', 'estimatedPrice', 'finalPrice', 'status', 
      'description', 'specialRequirements', 'paymentMethod', 'paymentStatus', 
      'customerNotes', 'professionalNotes', 'createdAt', 'updatedAt'
    ],
    csvFile: 'bookings.csv'
  },
  Professionals: {
    range: 'Professionals!A:L',
    headers: [
      'id', 'userId', 'skills', 'experience', 'rating', 'completedJobs', 
      'hourlyRate', 'availability', 'serviceAreas', 'profilePicture', 'createdAt', 'updatedAt'
    ],
    csvFile: 'professionals.csv'
  }
};

async function getAuthenticatedSheets() {
  const auth = new google.auth.JWT(
    SERVICE_ACCOUNT_EMAIL,
    undefined,
    PRIVATE_KEY,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  return google.sheets({ version: 'v4', auth });
}

async function readCSVFile(filename) {
  const filepath = path.join('data', filename);
  try {
    const content = await fs.readFile(filepath, 'utf-8');
    const lines = content.trim().split('\n');
    if (lines.length <= 1) return [];
    
    // Return all lines including headers
    return lines.map(line => {
      // Simple CSV parsing - split by comma but handle quoted values
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && (i === 0 || line[i-1] === ',')) {
          inQuotes = true;
        } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i+1] === ',')) {
          inQuotes = false;
        } else if (char === ',' && !inQuotes) {
          values.push(current.replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.replace(/^"|"$/g, ''));
      return values;
    });
  } catch (error) {
    console.log(`⚠️  ${filename} not found - creating empty sheet`);
    return [];
  }
}

async function createOrUpdateSheet(sheets, sheetName, config) {
  console.log(`🔄 Processing ${sheetName}...`);
  
  try {
    // Try to clear existing data first
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: config.range,
    });
  } catch (error) {
    console.log(`   Creating new sheet: ${sheetName}`);
  }
  
  // Read CSV data
  const csvData = await readCSVFile(config.csvFile);
  
  if (csvData.length === 0) {
    // Create empty sheet with headers
    csvData.push(config.headers);
  }
  
  // Update the sheet
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: config.range,
    valueInputOption: 'RAW',
    requestBody: {
      values: csvData
    },
  });
  
  console.log(`✅ ${sheetName}: ${csvData.length - 1} rows (+ headers)`);
}

async function setupGoogleSheetsIntegration() {
  console.log('🚀 Setting up Google Sheets integration for जरूरी छ platform...\n');
  
  try {
    const sheets = await getAuthenticatedSheets();
    
    // Test connection
    console.log('🔍 Testing connection to spreadsheet...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    console.log(`✅ Connected to: ${spreadsheet.data.properties?.title}\n`);
    
    // Process each sheet
    for (const [sheetName, config] of Object.entries(SHEET_CONFIGS)) {
      await createOrUpdateSheet(sheets, sheetName, config);
    }
    
    console.log('\n🎉 Google Sheets integration complete!');
    console.log('\n📊 Your spreadsheet now has the following sheets:');
    console.log('   • Categories - Service categories (Electrician, Plumber, etc.)');
    console.log('   • Services - Individual services offered');
    console.log('   • Locations - Service areas (Kathmandu, Pokhara, etc.)');
    console.log('   • Users - Customer and professional accounts');
    console.log('   • Bookings - Service bookings and appointments');
    console.log('   • Professionals - Service provider profiles');
    
    console.log('\n🔗 Zapier Integration Ready:');
    console.log('   1. New booking triggers: Monitor "Bookings" sheet for new rows');
    console.log('   2. User registration triggers: Monitor "Users" sheet for new rows');
    console.log('   3. Professional notifications: Use booking data to notify workers');
    
    console.log(`\n📱 WhatsApp/SMS Setup:`);
    console.log('   • Trigger: New row in Bookings sheet');
    console.log('   • Action: Send message to professional based on serviceId');
    console.log('   • Message: "New जरूरी छ booking! [Service] at [Location] on [Date]"');
    
    console.log(`\n🔧 Spreadsheet URL: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
    
  } catch (error) {
    console.error('❌ Integration failed:', error.message);
    
    if (error.message.includes('authentication')) {
      console.log('\n🔐 Authentication Setup Required:');
      console.log('1. Ensure GOOGLE_SERVICE_ACCOUNT_EMAIL is set');
      console.log('2. Ensure GOOGLE_PRIVATE_KEY is set (full private key with \\n)');
      console.log('3. Share the spreadsheet with the service account email');
      console.log('4. Grant "Editor" permissions to the service account');
    }
    
    if (error.message.includes('not found')) {
      console.log('\n📋 Spreadsheet Setup:');
      console.log('1. Create a new Google Sheets document');
      console.log('2. Update SPREADSHEET_ID in the script');
      console.log('3. Share with service account email');
    }
  }
}

// Run the integration
if (process.argv[2] === '--run') {
  setupGoogleSheetsIntegration();
} else {
  console.log('Google Sheets Integration Script Ready');
  console.log('Run with: npx tsx scripts/google-sheets-integration.js --run');
}

export { setupGoogleSheetsIntegration };