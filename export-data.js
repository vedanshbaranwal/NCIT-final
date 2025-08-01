// Complete data export script for migrating to Bolt.new
import fs from 'fs';

async function exportAllData() {
  const baseURL = 'http://localhost:5000';
  
  console.log('🚀 Exporting all data from जरूरी छ platform...\n');
  
  const allData = {
    exportDate: new Date().toISOString(),
    platform: "जरूरी छ - Service Platform",
    version: "1.0.0",
    data: {}
  };

  try {
    // Export categories
    console.log('📂 Exporting categories...');
    const categoriesResponse = await fetch(`${baseURL}/api/categories`);
    allData.data.categories = await categoriesResponse.json();
    console.log(`   ✅ ${allData.data.categories.length} categories exported`);

    // Export services
    console.log('🔧 Exporting services...');
    const servicesResponse = await fetch(`${baseURL}/api/services`);
    allData.data.services = await servicesResponse.json();
    console.log(`   ✅ ${allData.data.services.length} services exported`);

    // Export locations
    console.log('📍 Exporting locations...');
    const locationsResponse = await fetch(`${baseURL}/api/locations`);
    allData.data.locations = await locationsResponse.json();
    console.log(`   ✅ ${allData.data.locations.length} locations exported`);

    // Export professionals
    console.log('👥 Exporting professionals...');
    const professionalsResponse = await fetch(`${baseURL}/api/professionals`);
    allData.data.professionals = await professionalsResponse.json();
    console.log(`   ✅ ${allData.data.professionals.length} professionals exported`);

    // Export bookings with full details
    console.log('📋 Exporting bookings...');
    const bookingsResponse = await fetch(`${baseURL}/api/bookings`);
    allData.data.bookings = await bookingsResponse.json();
    console.log(`   ✅ ${allData.data.bookings.length} bookings exported`);

    // Export users (if available)
    console.log('👤 Exporting users...');
    try {
      const usersResponse = await fetch(`${baseURL}/api/users`);
      if (usersResponse.ok) {
        allData.data.users = await usersResponse.json();
        console.log(`   ✅ ${allData.data.users.length} users exported`);
      }
    } catch (error) {
      console.log('   ⚠️  Users endpoint not available, skipping...');
      allData.data.users = [];
    }

    // Save to JSON file
    const filename = `jaruri-cha-data-export-${new Date().toISOString().slice(0,10)}.json`;
    fs.writeFileSync(filename, JSON.stringify(allData, null, 2));
    console.log(`\n💾 Data exported to: ${filename}`);

    // Create JavaScript seed file for Bolt.new
    const seedFilename = `bolt-seed-data.js`;
    const seedContent = generateSeedFile(allData.data);
    fs.writeFileSync(seedFilename, seedContent);
    console.log(`📝 Seed file created: ${seedFilename}`);

    // Generate summary
    console.log('\n📊 Export Summary:');
    console.log(`   Categories: ${allData.data.categories.length}`);
    console.log(`   Services: ${allData.data.services.length}`);
    console.log(`   Locations: ${allData.data.locations.length}`);
    console.log(`   Professionals: ${allData.data.professionals.length}`); 
    console.log(`   Bookings: ${allData.data.bookings.length}`);
    console.log(`   Users: ${allData.data.users.length}`);

    // Create migration instructions
    createMigrationGuide(allData.data);

    console.log('\n✅ Export complete! Ready for Bolt.new migration.');
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
  }
}

function generateSeedFile(data) {
  return `// Seed data for जरूरी छ platform - Generated on ${new Date().toISOString()}
// Copy this into your Bolt.new project's storage initialization

export const seedData = {
  categories: ${JSON.stringify(data.categories, null, 2)},
  
  services: ${JSON.stringify(data.services, null, 2)},
  
  locations: ${JSON.stringify(data.locations, null, 2)},
  
  professionals: ${JSON.stringify(data.professionals, null, 2)},
  
  bookings: ${JSON.stringify(data.bookings, null, 2)},
  
  users: ${JSON.stringify(data.users, null, 2)}
};

// Function to initialize storage with this data
export function initializeStorage(storage) {
  // Initialize categories
  seedData.categories.forEach(category => {
    storage.createCategory(category);
  });
  
  // Initialize services
  seedData.services.forEach(service => {
    storage.createService(service);
  });
  
  // Initialize locations
  seedData.locations.forEach(location => {
    storage.createLocation(location);
  });
  
  // Initialize professionals
  seedData.professionals.forEach(professional => {
    storage.createProfessional(professional);
  });
  
  // Initialize users
  seedData.users.forEach(user => {
    storage.createUser(user);
  });
  
  // Initialize bookings
  seedData.bookings.forEach(booking => {
    storage.createBooking(booking);
  });
  
  console.log('✅ Storage initialized with seed data');
}`;
}

function createMigrationGuide(data) {
  const guide = `# Migration Guide for Bolt.new

## Step 1: Copy Files to Bolt.new
1. Copy all files from your Replit project
2. Upload the generated \`bolt-seed-data.js\` file

## Step 2: Update Storage Implementation
Replace your storage system to use in-memory storage with seed data:

\`\`\`javascript
import { seedData, initializeStorage } from './bolt-seed-data.js';

class MemoryStorage {
  constructor() {
    this.categories = new Map();
    this.services = new Map();
    this.locations = new Map();
    this.professionals = new Map();
    this.bookings = new Map();
    this.users = new Map();
    
    // Initialize with seed data
    this.initWithSeedData();
  }
  
  initWithSeedData() {
    seedData.categories.forEach(item => this.categories.set(item.id, item));
    seedData.services.forEach(item => this.services.set(item.id, item));
    seedData.locations.forEach(item => this.locations.set(item.id, item));
    seedData.professionals.forEach(item => this.professionals.set(item.id, item));
    seedData.bookings.forEach(item => this.bookings.set(item.id, item));
    seedData.users.forEach(item => this.users.set(item.id, item));
  }
  
  // Implement all your CRUD methods here...
}
\`\`\`

## Step 3: Update Environment
- Remove DATABASE_URL references
- Update storage imports to use MemoryStorage
- Test all functionality

## Your Data Summary:
- Categories: ${data.categories.length} items
- Services: ${data.services.length} items  
- Locations: ${data.locations.length} items
- Professionals: ${data.professionals.length} items
- Bookings: ${data.bookings.length} items
- Users: ${data.users.length} items

All your data will be preserved in the new environment!
`;

  fs.writeFileSync('BOLT_MIGRATION_GUIDE.md', guide);
  console.log('📋 Migration guide created: BOLT_MIGRATION_GUIDE.md');
}

// Run export
exportAllData().catch(console.error);