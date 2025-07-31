# Complete Zapier Integration Guide for जरूरी छ

## Quick Setup Overview

Your service platform now has built-in Zapier integration! Here's what happens automatically:

✅ **New bookings** → Sends data to Zapier → Can update Google Sheets, send SMS, etc.
✅ **User registrations** → Triggers notifications 
✅ **Booking status changes** → Sends updates to professionals
✅ **Professional assignments** → Notifies both customer and professional

## Step-by-Step Setup

### 1. Create Your Zapier Account
- Go to [zapier.com](https://zapier.com) 
- Sign up (free plan works fine to start)

### 2. Create Your First Zap - New Bookings to Google Sheets

#### Step A: Set up the Trigger
1. Click "Create Zap"
2. Choose **"Webhooks by Zapier"** as trigger
3. Select **"Catch Hook"**
4. Copy the webhook URL (looks like: `https://hooks.zapier.com/hooks/catch/XXXXX/YYYYY`)

#### Step B: Add the webhook URL to your Replit
1. Go to your Replit project
2. Click the lock icon (Secrets) 
3. Add new secret:
   - Name: `ZAPIER_NEW_BOOKING_WEBHOOK`
   - Value: (paste the webhook URL from Step A)

#### Step C: Test the connection
1. Make a test booking on your website
2. Check if Zapier received the data
3. You should see booking details like customer name, service, location, etc.

#### Step D: Connect to Google Sheets
1. Add action: **"Google Sheets"** → **"Create Spreadsheet Row"**
2. Create a new Google Sheet with these columns:
   - booking_id
   - customer_name
   - customer_phone
   - service_name
   - location
   - scheduled_date
   - estimated_price
   - status
3. Map the webhook data to your sheet columns
4. Turn on your Zap!

### 3. Set up SMS Notifications for Professionals

#### Create a second Zap:
1. **Trigger**: Webhooks by Zapier → Catch Hook
2. Add webhook URL as: `ZAPIER_PROFESSIONAL_ASSIGNMENT_WEBHOOK`
3. **Action**: SMS by Zapier (or Twilio)
4. **Message**: "New job! Customer: {{customer_name}}, Service: {{service_name}}, Location: {{location}}"

### 4. Environment Variables Needed

Add these to your Replit Secrets:

```
ZAPIER_NEW_BOOKING_WEBHOOK=https://hooks.zapier.com/hooks/catch/XXXXX/YYYYY
ZAPIER_BOOKING_STATUS_WEBHOOK=https://hooks.zapier.com/hooks/catch/XXXXX/YYYYY  
ZAPIER_NEW_USER_WEBHOOK=https://hooks.zapier.com/hooks/catch/XXXXX/YYYYY
ZAPIER_PROFESSIONAL_ASSIGNMENT_WEBHOOK=https://hooks.zapier.com/hooks/catch/XXXXX/YYYYY
```

## What Data Gets Sent to Zapier

### New Booking Data:
```json
{
  "booking_id": "abc-123",
  "customer_name": "Ram Sharma", 
  "customer_phone": "9841234567",
  "service_name": "Electrical Wiring",
  "service_name_nepali": "बिजुली तार",
  "location": "Kathmandu",
  "address": "Thamel, Kathmandu",
  "scheduled_date": "2025-08-01T10:00:00.000Z",
  "estimated_price": "800.00",
  "payment_method": "cash",
  "status": "pending"
}
```

### Professional Assignment Data:
```json
{
  "booking_id": "abc-123",
  "professional_name": "Ram Bahadur Thapa",
  "professional_phone": "9841234567", 
  "customer_name": "Sita Sharma",
  "service_name": "Electrical Wiring",
  "location": "Kathmandu",
  "scheduled_date": "2025-08-01T10:00:00.000Z"
}
```

## Popular Automation Ideas

### 1. **Customer Confirmations**
- **Trigger**: New booking
- **Action**: Send email confirmation to customer

### 2. **Professional Notifications** 
- **Trigger**: Professional assignment
- **Action**: Send SMS/WhatsApp to professional

### 3. **Google Sheets Dashboard**
- **Trigger**: Any booking event
- **Action**: Update master spreadsheet for analytics

### 4. **Payment Reminders**
- **Trigger**: Booking status = completed
- **Action**: Send payment reminder after 24 hours

### 5. **Customer Follow-up**
- **Trigger**: Booking completed
- **Action**: Send review request email after 2 days

## Testing Your Setup

### Test API Endpoints:
```bash
# Get all bookings data (for Google Sheets export)
GET https://your-replit-url.replit.app/api/zapier/bookings

# Test webhook manually
POST https://your-replit-url.replit.app/api/zapier/test-webhook
{
  "type": "new_booking",
  "data": { "bookingId": "test-booking-id" }
}
```

### Manual Testing:
1. Create a booking on your website
2. Check Zapier dashboard for webhook data
3. Verify Google Sheets gets updated
4. Test SMS notifications

## Troubleshooting

**Webhooks not working?**
- Check if environment variables are set correctly
- Make sure webhook URLs are valid
- Test with a simple booking first

**Google Sheets not updating?**
- Verify column names match exactly
- Check Google Sheets permissions
- Make sure Zap is turned ON

**SMS not sending?**
- Check phone number format (+977XXXXXXXXX)
- Verify SMS service is connected to Zapier
- Test with your own number first

## Alternative: Make.com Integration

If you prefer Make.com instead of Zapier:

1. Create webhooks in Make.com
2. Use the same environment variable names
3. The data format is identical
4. Works exactly the same way

## Advanced Features

### WhatsApp Business Integration
- Use WhatsApp Business API through Zapier
- Send rich messages with booking details
- Include location links and contact info

### Calendar Integration  
- Auto-add bookings to Google Calendar
- Send calendar invites to customers
- Block professional's availability

### Analytics Dashboard
- Track booking trends over time
- Monitor most popular services
- Calculate revenue automatically

Your platform is now ready for full automation! Start with the basic Google Sheets integration and gradually add more automations as needed.