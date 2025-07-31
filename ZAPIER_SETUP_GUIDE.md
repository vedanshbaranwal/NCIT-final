# Zapier Integration Guide for जरूरी छ Service Platform

This guide will help you set up Zapier automation for your service platform to handle notifications, data synchronization, and Google Sheets integration.

## Overview

The platform now includes Zapier webhook integration that automatically sends data when:
- New bookings are created
- Booking status changes (pending → assigned → completed)
- New users register
- Professionals are assigned to bookings

## Step 1: Set Up Zapier Webhooks

### 1.1 Create Zapier Account
1. Go to [zapier.com](https://zapier.com)
2. Sign up for a free account
3. Access your dashboard

### 1.2 Create Webhook Triggers
Create 4 separate Zaps with webhook triggers:

#### Zap 1: New Booking Notifications
- **Trigger**: Webhook by Zapier - Catch Hook
- **Name**: "New Booking Notification"
- **Copy the webhook URL** (you'll need this for environment variables)

#### Zap 2: Booking Status Updates
- **Trigger**: Webhook by Zapier - Catch Hook
- **Name**: "Booking Status Update"
- **Copy the webhook URL**

#### Zap 3: New User Registration
- **Trigger**: Webhook by Zapier - Catch Hook
- **Name**: "New User Registration"
- **Copy the webhook URL**

#### Zap 4: Professional Assignment
- **Trigger**: Webhook by Zapier - Catch Hook
- **Name**: "Professional Assignment"
- **Copy the webhook URL**

## Step 2: Configure Environment Variables

Add these environment variables to your Replit project:

```bash
ZAPIER_NEW_BOOKING_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_NEW_BOOKING_URL
ZAPIER_BOOKING_STATUS_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_STATUS_UPDATE_URL
ZAPIER_NEW_USER_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_NEW_USER_URL
ZAPIER_PROFESSIONAL_ASSIGNMENT_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_ASSIGNMENT_URL
```

## Step 3: Set Up Google Sheets Integration

### 3.1 Create Google Sheets
Create these Google Sheets:

#### Sheet 1: Bookings
Columns:
- booking_id
- customer_name
- customer_phone
- customer_email
- professional_name
- professional_phone
- service_name
- service_name_nepali
- location
- address
- scheduled_date
- scheduled_date_formatted
- estimated_price
- final_price
- status
- payment_method
- payment_status
- created_date
- description

#### Sheet 2: Users
Columns:
- user_id
- username
- full_name
- email
- phone
- role
- registration_date

#### Sheet 3: Service Analytics
Columns:
- date
- total_bookings
- completed_bookings
- pending_bookings
- total_revenue
- most_popular_service

### 3.2 Connect Zapier to Google Sheets

#### For New Booking Zap:
1. **Action**: Google Sheets - Create Spreadsheet Row
2. **Spreadsheet**: Select your "Bookings" sheet
3. **Worksheet**: Sheet1
4. **Map the webhook data** to appropriate columns

#### For User Registration Zap:
1. **Action**: Google Sheets - Create Spreadsheet Row
2. **Spreadsheet**: Select your "Users" sheet
3. **Map the webhook data** to appropriate columns

## Step 4: Set Up SMS/WhatsApp Notifications

### 4.1 SMS Notifications (via Twilio)
Add to your booking status update Zap:
1. **Action**: SMS by Zapier (or Twilio)
2. **To**: Use the professional's phone number from webhook data
3. **Message**: "New booking assigned! Customer: {{customer_name}}, Service: {{service_name}}, Location: {{location}}, Date: {{scheduled_date_formatted}}"

### 4.2 WhatsApp Notifications
Add to your professional assignment Zap:
1. **Action**: WhatsApp Business by Zapier
2. **To**: Professional's WhatsApp number
3. **Message**: "🔔 New Job Alert!\n\nCustomer: {{customer_name}}\nService: {{service_name}}\nLocation: {{location}}\nDate: {{scheduled_date_formatted}}\nPrice: Rs. {{estimated_price}}\n\nPlease confirm availability."

## Step 5: Advanced Automations

### 5.1 Email Notifications
Set up email automation for:
- Customer booking confirmation
- Professional job assignment
- Booking completion reminder

### 5.2 Calendar Integration
- Add bookings to Google Calendar
- Send calendar invites to customers and professionals

### 5.3 Payment Reminders
- Send payment reminders for pending bookings
- Update payment status in Google Sheets

## Step 6: Testing the Integration

1. Create a test booking through your platform
2. Check if webhook data appears in your Zapier dashboard
3. Verify Google Sheets are updated
4. Test SMS/WhatsApp notifications

## Sample Webhook Data Structure

### New Booking Webhook Data:
```json
{
  "event": "new_booking",
  "data": {
    "booking_id": "booking-123",
    "customer_name": "Ram Sharma",
    "customer_phone": "9841234567",
    "customer_email": "ram@example.com",
    "service_name": "Electrical Wiring",
    "service_name_nepali": "बिजुली तार",
    "location": "Kathmandu",
    "address": "Thamel, Kathmandu",
    "scheduled_date": "2025-08-01T10:00:00.000Z",
    "estimated_price": "800.00",
    "payment_method": "cash",
    "description": "Need electrical wiring for new room",
    "status": "pending"
  },
  "timestamp": "2025-07-31T20:30:00.000Z"
}
```

## API Endpoints for Manual Integration

If you prefer direct API integration instead of webhooks:

- `GET /api/zapier/bookings` - Get all bookings for export
- `POST /api/zapier/test-webhook` - Test webhook functionality

## Troubleshooting

### Common Issues:
1. **Webhooks not firing**: Check environment variables are set correctly
2. **Google Sheets not updating**: Verify column mapping in Zapier
3. **SMS not sending**: Check phone number format (+977XXXXXXXXX)

### Debug Mode:
Enable debug logging by adding:
```bash
DEBUG_ZAPIER=true
```

## Security Notes

- Keep webhook URLs private
- Use HTTPS URLs only
- Consider adding webhook authentication for production
- Regularly rotate webhook URLs if needed

This integration will automate your entire workflow from booking creation to completion, keeping your Google Sheets updated and sending notifications to relevant parties.