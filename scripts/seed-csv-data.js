// Seed CSV files with sample data
import { CSVStorage } from '../server/csvStorage.js';

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
  },
  {
    id: '5',
    name: 'Carpenter',
    nameNepali: 'सुतारी',
    description: 'Furniture and wood work',
    icon: 'fas fa-hammer',
    color: 'amber',
    isActive: true
  },
  {
    id: '6',
    name: 'Painting',
    nameNepali: 'रंगाई',
    description: 'Interior and exterior painting',
    icon: 'fas fa-paint-roller',
    color: 'purple',
    isActive: true
  },
  {
    id: '7',
    name: 'Appliance Repair',
    nameNepali: 'उपकरण मर्मत',
    description: 'TV, washing machine repairs',
    icon: 'fas fa-tools',
    color: 'red',
    isActive: true
  },
  {
    id: '8',
    name: 'Pest Control',
    nameNepali: 'कीरा नियन्त्रण',
    description: 'Safe and effective pest control',
    icon: 'fas fa-bug',
    color: 'teal',
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
  },
  {
    id: '5',
    categoryId: '5',
    name: 'Furniture Assembly',
    nameNepali: 'फर्निचर जोड्ने',
    description: 'Assemble furniture and cabinets',
    basePrice: '600.00',
    unit: 'hour',
    estimatedDuration: 120,
    isActive: true
  },
  {
    id: '6',
    categoryId: '6',
    name: 'Wall Painting',
    nameNepali: 'भित्ता रंगाई',
    description: 'Interior wall painting service',
    basePrice: '300.00',
    unit: 'sq_ft',
    estimatedDuration: 240,
    isActive: true
  },
  {
    id: '7',
    categoryId: '7',
    name: 'TV Repair',
    nameNepali: 'टि.भी. मर्मत',
    description: 'Television repair and setup',
    basePrice: '700.00',
    unit: 'fixed',
    estimatedDuration: 75,
    isActive: true
  },
  {
    id: '8',
    categoryId: '8',
    name: 'Home Pest Control',
    nameNepali: 'घर कीरा नियन्त्रण',
    description: 'Safe pest control for homes',
    basePrice: '1000.00',
    unit: 'fixed',
    estimatedDuration: 120,
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
    name: 'Chitwan',
    nameNepali: 'चितवन',
    type: 'city',
    parentId: null,
    isServiceable: true
  },
  {
    id: '4',
    name: 'Lalitpur',
    nameNepali: 'ललितपुर',
    type: 'city',
    parentId: null,
    isServiceable: true
  },
  {
    id: '5',
    name: 'Bhaktapur',
    nameNepali: 'भक्तपुर',
    type: 'city',
    parentId: null,
    isServiceable: true
  }
];

async function seedCSVData() {
  console.log('Seeding CSV files with sample data...');
  
  try {
    const storage = new CSVStorage();
    
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
    
    console.log('\n🎉 CSV data seeding complete!');
    console.log('Your जरूरी छ platform is now using CSV files for data storage.');
    console.log('These CSV files can easily be imported to Google Sheets for Zapier integration.');
    console.log('\nNext steps:');
    console.log('1. Copy the CSV files from the "data" folder to your Google Sheets');
    console.log('2. Set up Zapier to monitor changes in your Google Sheets');
    console.log('3. Configure Zapier triggers for new bookings and user registrations');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  }
}

seedCSVData();