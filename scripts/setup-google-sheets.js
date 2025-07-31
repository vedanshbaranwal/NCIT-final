// Script to set up Google Sheets with sample data
// This will populate your Google Sheets with the service data

const { GoogleSheetsStorage } = require('../server/googleSheets');

const sampleCategories = [
  {
    id: '1',
    name: 'Electrician',
    nameNepali: 'बिजुली मिस्त्री',
    description: 'Electrical repairs and installations',
    icon: 'fas fa-bolt',
    color: 'yellow',
    isActive: true
  },
  {
    id: '2',
    name: 'Plumber',
    nameNepali: 'प्लम्बर',
    description: 'Pipe and fixture repairs',
    icon: 'fas fa-wrench',
    color: 'blue',
    isActive: true
  },
  {
    id: '3',
    name: 'House Cleaning',
    nameNepali: 'घर सफाई',
    description: 'Deep and regular cleaning',
    icon: 'fas fa-broom',
    color: 'green',
    isActive: true
  },
  {
    id: '4',
    name: 'AC Repair',
    nameNepali: 'ए.सी. मर्मत',
    description: 'AC service and installation',
    icon: 'fas fa-snowflake',
    color: 'cyan',
    isActive: true
  }
];

const sampleServices = [
  {
    id: '1',
    categoryId: '1',
    name: 'Electrical Repairs',
    nameNepali: 'बिजुली मर्मत',
    description: 'Fix electrical issues and installations',
    basePrice: '500.00',
    unit: 'hour',
    estimatedDuration: 60,
    isActive: true
  },
  {
    id: '2',
    categoryId: '2',
    name: 'Pipe Repair',
    nameNepali: 'पाइप मर्मत',
    description: 'Fix leaky pipes and faucets',
    basePrice: '400.00',
    unit: 'hour',
    estimatedDuration: 45,
    isActive: true
  },
  {
    id: '3',
    categoryId: '3',
    name: 'Deep Cleaning',
    nameNepali: 'गहिरो सफाई',
    description: 'Thorough house cleaning service',
    basePrice: '800.00',
    unit: 'fixed',
    estimatedDuration: 180,
    isActive: true
  },
  {
    id: '4',
    categoryId: '4',
    name: 'AC Service',
    nameNepali: 'ए.सी. सेवा',
    description: 'AC cleaning and maintenance',
    basePrice: '1200.00',
    unit: 'fixed',
    estimatedDuration: 90,
    isActive: true
  }
];

const sampleLocations = [
  {
    id: '1',
    name: 'Kathmandu',
    nameNepali: 'काठमाडौं',
    type: 'city',
    parentId: null,
    isServiceable: true
  },
  {
    id: '2',
    name: 'Pokhara',
    nameNepali: 'पोखरा',
    type: 'city',
    parentId: null,
    isServiceable: true
  },
  {
    id: '3',
    name: 'Lalitpur',
    nameNepali: 'ललितपुर',
    type: 'city',
    parentId: null,
    isServiceable: true
  }
];

async function setupGoogleSheets() {
  console.log('Setting up Google Sheets with sample data...');
  
  try {
    const storage = new GoogleSheetsStorage();
    
    // Add categories
    for (const category of sampleCategories) {
      await storage.upsertServiceCategory(category);
      console.log(`✓ Added category: ${category.name}`);
    }
    
    // Add services
    for (const service of sampleServices) {
      await storage.upsertService(service);
      console.log(`✓ Added service: ${service.name}`);
    }
    
    // Add locations
    for (const location of sampleLocations) {
      await storage.upsertLocation(location);
      console.log(`✓ Added location: ${location.name}`);
    }
    
    console.log('\n🎉 Google Sheets setup complete!');
    console.log('Your जरूरी छ platform is now using Google Sheets for data storage.');
    console.log('Zapier can now easily read and write to your spreadsheet.');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\nPlease ensure:');
    console.log('1. Google Service Account credentials are configured');
    console.log('2. The spreadsheet is shared with the service account email');
    console.log('3. The sheets (Categories, Services, Locations, Users, Bookings, Professionals) exist');
  }
}

if (require.main === module) {
  setupGoogleSheets();
}

module.exports = { setupGoogleSheets };