// Test CSV parsing
import { CSVStorage } from './server/csvStorage.js';

async function testCSV() {
  const storage = new CSVStorage();
  
  console.log('Testing CSV parsing...');
  
  try {
    const categories = await storage.getServiceCategories();
    console.log('Categories found:', categories.length);
    console.log('First category:', categories[0]);
    
    const activeCategories = categories.filter(cat => cat.isActive);
    console.log('Active categories:', activeCategories.length);
    
    if (activeCategories.length > 0) {
      console.log('First active category:', activeCategories[0]);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testCSV();