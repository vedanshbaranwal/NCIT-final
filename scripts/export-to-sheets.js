// Export CSV data to Google Sheets format
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = 'data';
const EXPORT_DIR = 'google-sheets-export';

async function exportForGoogleSheets() {
  try {
    await fs.mkdir(EXPORT_DIR, { recursive: true });
    
    // Read existing CSV files
    const files = ['categories.csv', 'services.csv', 'locations.csv', 'users.csv', 'bookings.csv'];
    
    console.log('🚀 Exporting CSV data for Google Sheets integration...\n');
    
    for (const filename of files) {
      const srcPath = path.join(DATA_DIR, filename);
      const destPath = path.join(EXPORT_DIR, filename);
      
      try {
        await fs.copyFile(srcPath, destPath);
        console.log(`✅ Exported: ${filename}`);
        
        // Show first few lines
        const content = await fs.readFile(srcPath, 'utf-8');
        const lines = content.split('\n').slice(0, 3);
        console.log(`   Headers: ${lines[0]}`);
        if (lines[1]) console.log(`   Sample:  ${lines[1].substring(0, 80)}...`);
        console.log('');
      } catch (error) {
        console.log(`⚠️  ${filename} not found - will be created when data is added`);
      }
    }
    
    // Create README for Zapier integration
    const readme = `# जरूरी छ - Google Sheets Integration

## Files Ready for Google Sheets Import

1. **categories.csv** - Service categories (Electrician, Plumber, etc.)
2. **services.csv** - Individual services offered
3. **locations.csv** - Service areas (Kathmandu, Pokhara, etc.)
4. **users.csv** - Customer and professional accounts (passwords excluded)
5. **bookings.csv** - Service bookings and appointments

## Zapier Integration Steps

### Step 1: Import to Google Sheets
1. Create a new Google Sheets document
2. Create separate sheets: Categories, Services, Locations, Users, Bookings
3. Import each CSV file into its corresponding sheet
4. Share the spreadsheet with your service account: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'jaruri@jaruri.iam.gserviceaccount.com'}

### Step 2: Set up Zapier Automation
1. **New Booking Trigger**: 
   - Trigger: Google Sheets - New/Updated Row in Bookings sheet
   - Action: Send WhatsApp/SMS to professional using their phone number
   
2. **User Registration Trigger**:
   - Trigger: Google Sheets - New Row in Users sheet
   - Action: Send welcome email or SMS

3. **Booking Status Updates**:
   - Trigger: Google Sheets - Updated Row in Bookings sheet (when status changes)
   - Action: Notify customer via SMS/WhatsApp

### Step 3: Worker Notifications
When a new booking is created:
- Zapier reads the serviceId from Bookings sheet
- Finds professionals with matching skills
- Sends WhatsApp message: "New जरूरी छ booking! [Service] needed at [Location] on [Date]. Contact: [Customer Phone]"

## Data Format

### Bookings Sheet Columns:
- id, customerId, professionalId, serviceId
- location, address, scheduledDate
- status (pending, confirmed, completed, cancelled)
- customerPhone, description, estimatedPrice
- paymentMethod, paymentStatus

### Users Sheet Columns:
- id, username, email, fullName, phone, role
- isVerified, createdAt, updatedAt

This system enables real-time notifications to workers without complex backend infrastructure!
`;

    await fs.writeFile(path.join(EXPORT_DIR, 'README.md'), readme);
    
    console.log('📋 Created integration guide: README.md');
    console.log('\n🎉 Export complete! Your जरूरी छ data is ready for Google Sheets.');
    console.log('\nNext steps:');
    console.log('1. Upload CSV files to Google Sheets');
    console.log('2. Set up Zapier triggers for real-time notifications');
    console.log('3. Configure WhatsApp/SMS for worker notifications');
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
  }
}

exportForGoogleSheets();