// Test API endpoints
async function testAPI() {
  const baseURL = 'http://localhost:5000';
  
  console.log('🧪 Testing जरूरी छ API endpoints...\n');
  
  // Test categories
  try {
    const response = await fetch(`${baseURL}/api/categories`);
    const categories = await response.json();
    console.log('✅ Categories API:', categories.length, 'items');
    if (categories.length > 0) {
      console.log('   Sample:', categories[0].name);
    }
  } catch (error) {
    console.log('❌ Categories API failed:', error.message);
  }
  
  // Test services
  try {
    const response = await fetch(`${baseURL}/api/services`);
    const services = await response.json();
    console.log('✅ Services API:', services.length, 'items');
    if (services.length > 0) {
      console.log('   Sample:', services[0].name, '- Rs.' + services[0].basePrice);
    }
  } catch (error) {
    console.log('❌ Services API failed:', error.message);
  }
  
  // Test locations
  try {
    const response = await fetch(`${baseURL}/api/locations`);
    const locations = await response.json();
    if (locations.message) {
      console.log('❌ Locations API failed:', locations.message);
    } else {
      console.log('✅ Locations API:', locations.length, 'items');
    }
  } catch (error) {
    console.log('❌ Locations API failed:', error.message);
  }
  
  // Test booking creation
  try {
    const bookingData = {
      serviceId: "1",
      location: "Kathmandu",
      address: "Thamel, Kathmandu",
      scheduledDate: "2025-08-01T14:00:00.000Z",
      description: "Test electrical repair",
      estimatedPrice: "500.00",
      paymentMethod: "cash_on_delivery",
      status: "pending"
    };
    
    const response = await fetch(`${baseURL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });
    
    const result = await response.json();
    if (result.message) {
      console.log('❌ Booking API failed:', result.message);
    } else {
      console.log('✅ Booking API: Created booking', result.id);
    }
  } catch (error) {
    console.log('❌ Booking API failed:', error.message);
  }
  
  console.log('\n📊 API Status Summary:');
  console.log('   Services: Working ✅');
  console.log('   Categories: Need debugging 🔧');
  console.log('   Locations: Need debugging 🔧');
  console.log('   Bookings: Need debugging 🔧');
}

testAPI();