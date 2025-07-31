# जरूरी छ - Google Sheets Integration

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
4. Share the spreadsheet with your service account: vedanshbarnwal22@gmail.com

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
