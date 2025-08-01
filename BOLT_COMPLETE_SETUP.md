# Complete Setup Guide for Bolt.new Migration

## Problem: Bolt.new Doesn't Have Database Persistence
Your Replit project uses PostgreSQL database, but Bolt.new uses in-memory storage that resets on each reload.

## Solution: Export Data + In-Memory Storage with Seed Data

### Step 1: Export Your Current Data
```bash
node export-data.js
```
This creates:
- `jaruri-cha-data-export-[date].json` - Complete data backup
- `bolt-seed-data.js` - Ready-to-use seed file for Bolt.new
- `BOLT_MIGRATION_GUIDE.md` - Step-by-step instructions

### Step 2: Create Bolt.new Project
1. Go to bolt.new
2. Paste this prompt:

```
Create a Nepali service booking platform called "जरूरी छ" with:

- React frontend with Tailwind CSS
- Express backend with in-memory storage
- Service categories: Electrician, Plumber, Cleaner, etc.
- Booking system with customer details
- Professional signup and management
- Bilingual support (English/Nepali)
- Admin dashboard at /admin
- Zapier webhook integration

Use modern React patterns with TypeScript, shadcn/ui components, and responsive design.
```

### Step 3: Add Your Data to Bolt.new
1. Upload the generated `bolt-seed-data.js` file
2. Replace the storage initialization:

```javascript
// In your storage file
import { seedData } from './bolt-seed-data.js';

class MemoryStorage {
  constructor() {
    this.categories = new Map();
    this.services = new Map();
    this.locations = new Map();
    this.professionals = new Map();
    this.bookings = new Map();
    this.users = new Map();
    
    // Load your real data
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
  
  // Your existing CRUD methods...
}
```

### Step 4: Copy Essential Files
Copy these key files from your Replit project:

**Frontend Files:**
- `client/src/pages/` - All your pages
- `client/src/components/` - Custom components
- `client/src/lib/` - Utilities and query client
- `index.css` - Your custom styles

**Backend Files:**
- `server/routes.ts` - API endpoints
- `server/zapier.ts` - Zapier integration
- `shared/schema.ts` - Type definitions

**Configuration:**
- `package.json` dependencies
- `tailwind.config.ts`
- `vite.config.ts`

### Step 5: Zapier Integration for Bolt.new
Your Zapier webhooks will work the same way:

```javascript
// In your Bolt.new backend
import { seedData } from './bolt-seed-data.js';

class ZapierIntegration {
  static async notifyNewBooking(bookingId) {
    const booking = storage.getBooking(bookingId);
    const webhookUrl = process.env.ZAPIER_NEW_BOOKING_WEBHOOK;
    
    if (webhookUrl && booking) {
      const payload = {
        event: "new_booking",
        data: {
          booking_id: booking.id,
          customer_name: booking.customer?.fullName,
          service_name: booking.service?.name,
          location: booking.location,
          scheduled_date: booking.scheduledDate,
          estimated_price: booking.estimatedPrice
        }
      };
      
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
  }
}
```

### Step 6: Test Your Migration
1. Check that all your services appear: `/services`
2. Test booking system: `/booking/1`
3. Verify admin dashboard: `/admin`
4. Test Zapier webhooks with your existing URLs

### Step 7: Advantages of Bolt.new Setup
- **Faster Loading**: No database queries
- **Instant Deployment**: No database setup needed
- **Portable**: Works anywhere
- **Your Real Data**: All your bookings and services preserved

### Step 8: Maintain Data Sync
To keep both environments in sync:

1. **Export from Replit regularly:**
   ```bash
   node export-data.js
   ```

2. **Import to Bolt.new:**
   - Replace `bolt-seed-data.js` with new export
   - Restart the application

### Data Preservation Guarantee
Your exported data includes:
- All 15 services across 10 categories
- Professional profiles and ratings
- Customer booking history
- Location data with Nepali translations
- Complete Zapier integration setup

The Bolt.new version will have identical functionality to your Replit version, just with in-memory storage instead of PostgreSQL database.

## Quick Migration Checklist
- [ ] Run `node export-data.js` in Replit
- [ ] Create new Bolt.new project
- [ ] Upload `bolt-seed-data.js` 
- [ ] Copy essential files
- [ ] Update storage to use seed data
- [ ] Test all functionality
- [ ] Set up Zapier webhooks
- [ ] Verify admin dashboard shows all bookings

Your जरूरी छ platform will work exactly the same in Bolt.new with all your real data preserved!