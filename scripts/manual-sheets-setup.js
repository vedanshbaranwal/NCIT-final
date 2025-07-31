// Manual Google Sheets Setup Guide and CSV Export
import fs from 'fs/promises';
import path from 'path';

const SPREADSHEET_ID = '1CuqYP9kyYUSszYVN3_ZJAjHV6rHnnONO_wJjBqPUzew';

async function createSheetsSetupGuide() {
  const setupDir = 'google-sheets-setup';
  await fs.mkdir(setupDir, { recursive: true });

  // Copy CSV files for manual upload
  const csvFiles = ['categories.csv', 'services.csv', 'locations.csv'];
  
  console.log('📋 Creating Google Sheets setup package...\n');
  
  for (const file of csvFiles) {
    try {
      const srcPath = path.join('data', file);
      const destPath = path.join(setupDir, file.replace('.csv', '-for-sheets.csv'));
      await fs.copyFile(srcPath, destPath);
      console.log(`✅ Copied: ${file} → ${file.replace('.csv', '-for-sheets.csv')}`);
    } catch (error) {
      console.log(`⚠️  ${file} not found`);
    }
  }

  // Create empty templates for future data
  const emptyTemplates = [
    {
      filename: 'users-template.csv',
      headers: 'id,username,email,fullName,phone,role,profilePicture,isVerified,createdAt,updatedAt'
    },
    {
      filename: 'bookings-template.csv', 
      headers: 'id,customerId,professionalId,serviceId,location,address,coordinates,scheduledDate,estimatedPrice,finalPrice,status,description,specialRequirements,paymentMethod,paymentStatus,customerNotes,professionalNotes,createdAt,updatedAt'
    },
    {
      filename: 'professionals-template.csv',
      headers: 'id,userId,skills,experience,rating,completedJobs,hourlyRate,availability,serviceAreas,profilePicture,createdAt,updatedAt'
    }
  ];

  for (const template of emptyTemplates) {
    await fs.writeFile(path.join(setupDir, template.filename), template.headers);
    console.log(`📝 Created template: ${template.filename}`);
  }

  // Create comprehensive setup guide
  const setupGuide = `# जरूरी छ - Google Sheets Integration Guide

## 🎯 Quick Setup (5 minutes)

### Step 1: Set up your Google Sheets
1. Open this spreadsheet: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}
2. Create 6 separate sheets (tabs) with these exact names:
   - Categories
   - Services  
   - Locations
   - Users
   - Bookings
   - Professionals

### Step 2: Import your data
**Upload these CSV files to corresponding sheets:**

#### Categories Sheet:
- Import: \`categories-for-sheets.csv\`
- Contains: 8 service categories (Electrician, Plumber, etc.)

#### Services Sheet:
- Import: \`services-for-sheets.csv\`
- Contains: 8 services with pricing and details

#### Locations Sheet:
- Import: \`locations-for-sheets.csv\`
- Contains: 5 service areas in Nepal

#### Users, Bookings, Professionals Sheets:
- Import template files to set up column headers
- Data will be added automatically as customers use the platform

### Step 3: Share with Service Account
Share your spreadsheet with: **jaruri@jaruri.iam.gserviceaccount.com**
- Give "Editor" permissions
- This allows the platform to update data automatically

---

## 🔄 Zapier Automation Setup

### Trigger 1: New Booking Notifications
**When:** New row added to "Bookings" sheet
**Do:** Send WhatsApp/SMS to professional

**Message Template:**
\`\`\`
🔧 New जरूरी छ Booking!

Service: [Service Name]
Location: [Address] 
Date: [Scheduled Date]
Customer: [Customer Phone]
Price: Rs. [Estimated Price]

Accept this job? Reply YES or NO
\`\`\`

### Trigger 2: User Registration Welcome
**When:** New row added to "Users" sheet  
**Do:** Send welcome SMS/email

### Trigger 3: Booking Status Updates
**When:** "status" column changes in "Bookings" sheet
**Do:** Notify customer of status change

---

## 📊 Real-time Data Flow

\`\`\`
जरूरी छ Website → CSV Files → Google Sheets → Zapier → WhatsApp/SMS
\`\`\`

1. **Customer books service** → New row in Bookings sheet
2. **Zapier detects new booking** → Finds professional by serviceId  
3. **Sends WhatsApp to worker** → "New job available!"
4. **Professional accepts** → Updates booking status
5. **Customer gets notification** → "Your booking is confirmed"

---

## 🛠️ Professional Matching Logic

**In Zapier, use this logic:**
1. New booking has \`serviceId\` (e.g., "1" for Electrical Repairs)
2. Look up \`serviceId\` in Services sheet to get \`categoryId\`
3. Find professionals in Professionals sheet with matching skills
4. Send notification to professional's phone number

**Example:**
- Booking serviceId: "1" (Electrical Repairs)
- Find categoryId: "1" (Electrician)  
- Notify all professionals with "Electrician" in skills column

---

## 📱 Sample WhatsApp Messages

**New Booking:**
"🔧 New जरूरी छ job! Electrical repair needed in Kathmandu on Jan 15. Customer: 9841234567. Price: Rs.500. Reply YES to accept."

**Booking Confirmed:**
"✅ Your जरूरी छ booking is confirmed! Electrician will arrive on Jan 15 at 2:00 PM. Contact: 9841234568"

**Job Completed:**
"🎉 Service completed! Please rate your experience and pay Rs.500. Thank you for using जरूरी छ!"

---

## 🔧 Technical Details

### Sheet Columns:

**Bookings Sheet:**
- id, customerId, professionalId, serviceId
- location, address, scheduledDate  
- status, estimatedPrice, paymentMethod
- customerNotes, professionalNotes

**Users Sheet:**
- id, username, email, fullName, phone, role
- isVerified, createdAt, updatedAt

**Services Sheet:**
- id, categoryId, name, nameNepali, basePrice
- unit, estimatedDuration, description

This setup gives you a complete service platform with automatic worker notifications!
`;

  await fs.writeFile(path.join(setupDir, 'SETUP-GUIDE.md'), setupGuide);
  
  console.log('\n🎉 Google Sheets setup package created!');
  console.log('\n📁 Check the "google-sheets-setup" folder for:');
  console.log('   • CSV files ready for upload');
  console.log('   • Template files for empty sheets');  
  console.log('   • Complete setup guide with Zapier instructions');
  
  console.log('\n🔗 Your spreadsheet: https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID);
  console.log('\n👆 Follow the SETUP-GUIDE.md for step-by-step instructions!');
}

createSheetsSetupGuide();