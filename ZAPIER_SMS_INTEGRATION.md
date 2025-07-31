# Zapier SMS Integration Guide for जरूरी छ

This guide shows you how to set up automated SMS notifications for your service platform using Zapier with various SMS providers.

## Overview

Your platform will automatically send SMS notifications for:
- New booking confirmations to customers
- Job assignments to professionals  
- Booking status updates
- Payment reminders

## Step 1: Choose SMS Provider

### Option A: Twilio (Recommended)
- Most reliable
- Global coverage including Nepal
- Cost: ~$0.0075 per SMS

### Option B: ClickSend
- Good alternative to Twilio
- Competitive pricing
- Easy Zapier integration

### Option C: SMS by Zapier
- Built into Zapier
- Simple setup
- Limited to certain countries

## Step 2: Set Up Zapier Zaps

### Zap 1: Customer Booking Confirmation

**Trigger:** Webhook by Zapier
1. Copy webhook URL from your "New Booking" trigger
2. Add this URL to your environment variables:
   ```
   ZAPIER_NEW_BOOKING_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_KEY
   ```

**Action:** Twilio - Send SMS
- **To:** Use customer phone from webhook data: `{{customer_phone}}`
- **Message:** 
```
🔔 बुकिङ पुष्टि / Booking Confirmed!

सेवा: {{service_name}} ({{service_name_nepali}})
स्थान: {{location}}
मिति: {{scheduled_date_formatted}}
मूल्य: रु. {{estimated_price}}

हाम्रो टिमले चाँडै सम्पर्क गर्नेछ।
धन्यवाद!

- जरूरी छ टिम
```

### Zap 2: Professional Job Assignment

**Trigger:** Webhook by Zapier (Professional Assignment)
- Use webhook URL: `ZAPIER_PROFESSIONAL_ASSIGNMENT_WEBHOOK`

**Action:** Twilio - Send SMS
- **To:** Use professional phone: `{{professional_phone}}`
- **Message:**
```
🚨 नयाँ काम / New Job Alert!

ग्राहक: {{customer_name}}
फोन: {{customer_phone}}
सेवा: {{service_name}}
स्थान: {{location}}
ठेगाना: {{address}}
मिति: {{scheduled_date_formatted}}
मूल्य: रु. {{estimated_price}}

कृपया उपलब्धता पुष्टि गर्नुहोस्।

Booking ID: {{booking_id}}
```

### Zap 3: Booking Status Updates

**Trigger:** Webhook by Zapier (Booking Status Update)
- Use webhook URL: `ZAPIER_BOOKING_STATUS_WEBHOOK`

**Action:** Multi-step with Filters

**Filter:** Only continue if `{{new_status}}` equals "completed"

**Action:** Twilio - Send SMS to Customer
- **To:** `{{customer_phone}}`
- **Message:**
```
✅ सेवा सम्पन्न / Service Completed!

सेवा: {{service_name}}
प्रविधि: {{professional_name}}

कृपया हाम्रो सेवालाई रेटिङ दिनुहोस्।
धन्यवाद!

- जरूरी छ
```

## Step 3: Environment Variables Setup

Add these to your Replit project environment:

```bash
# Zapier Webhooks
ZAPIER_NEW_BOOKING_WEBHOOK=https://hooks.zapier.com/hooks/catch/12345/abcdef
ZAPIER_BOOKING_STATUS_WEBHOOK=https://hooks.zapier.com/hooks/catch/12345/xyz123
ZAPIER_NEW_USER_WEBHOOK=https://hooks.zapier.com/hooks/catch/12345/user456
ZAPIER_PROFESSIONAL_ASSIGNMENT_WEBHOOK=https://hooks.zapier.com/hooks/catch/12345/prof789

# Optional: Direct Twilio Integration (Alternative)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

## Step 4: Test the Integration

### Test New Booking SMS
```bash
curl -X POST http://localhost:5000/api/zapier/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "new_booking",
    "data": {
      "bookingId": "test-booking-123"
    }
  }'
```

### Test Professional Assignment SMS
```bash
curl -X POST http://localhost:5000/api/zapier/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "professional_assignment",
    "data": {
      "bookingId": "test-booking-123",
      "professionalId": "test-prof-456"
    }
  }'
```

## Step 5: Advanced SMS Features

### SMS Templates with Nepali Support

Create different message templates for different scenarios:

#### For Electricians:
```
⚡ बिजुली काम / Electrical Work

ग्राहक: {{customer_name}}
समस्या: {{description}}
स्थान: {{location}}
```

#### For Plumbers:
```
🔧 प्लम्बिङ काम / Plumbing Work

ग्राहक: {{customer_name}}
समस्या: {{description}}
स्थान: {{location}}
```

### SMS Delivery Tracking

Add to your Zapier webhook response:
```javascript
// In server/zapier.ts
static async trackSMSDelivery(bookingId: string, smsStatus: string) {
  // Log SMS delivery status
  console.log(`SMS for booking ${bookingId}: ${smsStatus}`);
}
```

## Step 6: WhatsApp Integration (Optional)

### Using WhatsApp Business API via Zapier

**Trigger:** Same webhook triggers
**Action:** WhatsApp Business - Send Message

Message format:
```
🔔 *नयाँ बुकिङ / New Booking*

*सेवा:* {{service_name}}
*ग्राहक:* {{customer_name}}
*स्थान:* {{location}}
*मिति:* {{scheduled_date_formatted}}
*मूल्य:* रु. {{estimated_price}}

कृपया उपलब्धता पुष्टि गर्नुहोस्।

_जरूरी छ - आपको विश्वसनीय सेवा साझेदार_
```

## Step 7: Cost Optimization

### SMS Cost Management
- **Peak Hours:** Send priority SMS only
- **Batch Processing:** Group multiple updates
- **Opt-out Handling:** Respect user preferences

### Free SMS Alternatives
1. **Telegram Bot:** Free unlimited messages
2. **Discord Webhooks:** Free for team notifications
3. **Email to SMS:** Some carriers support email-to-SMS

## Step 8: Phone Number Formatting

Ensure phone numbers are in correct format for Nepal:

```javascript
// In server/zapier.ts
static formatNepalPhoneNumber(phone: string): string {
  // Remove any spaces, dashes, or special characters
  phone = phone.replace(/[^\d]/g, '');
  
  // If it starts with 98, add +977
  if (phone.startsWith('98') && phone.length === 10) {
    return `+977${phone}`;
  }
  
  // If it starts with 9, add +977
  if (phone.startsWith('9') && phone.length === 10) {
    return `+977${phone}`;
  }
  
  return phone;
}
```

## Step 9: Error Handling & Monitoring

### Failed SMS Handling
Add retry logic in Zapier:
1. **Delay:** 1 minute
2. **Retry:** 3 times
3. **Fallback:** Send email instead

### SMS Analytics Dashboard
Track in Google Sheets:
- SMS sent count
- Delivery success rate
- Response times
- Customer feedback

## Troubleshooting

### Common Issues:

1. **SMS not sending:**
   - Check phone number format
   - Verify Twilio account balance
   - Check webhook URLs

2. **Webhook not triggering:**
   - Test webhook manually
   - Check environment variables
   - Verify Zapier zap is enabled

3. **Message not delivered:**
   - Check recipient phone number
   - Verify SMS provider coverage in Nepal
   - Check for spam filtering

### Debug Commands:
```bash
# Test webhook connectivity
curl -X POST "YOUR_ZAPIER_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"test": "message"}'

# Check current bookings data
curl http://localhost:5000/api/zapier/bookings
```

## Security Best Practices

1. **Webhook Security:** Add signature verification
2. **Rate Limiting:** Prevent SMS spam
3. **PII Protection:** Mask sensitive customer data
4. **Access Control:** Restrict webhook access

Your SMS integration is now ready! Test with real bookings to ensure everything works smoothly.