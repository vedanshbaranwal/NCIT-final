# How to Add Your Data to Zapier - Step by Step Guide

## Your Current Data Structure

Your platform sends this rich data to Zapier for each booking:

```json
{
  "event": "new_booking",
  "data": {
    "booking_id": "73c13793-8688-47d4-be80-55040a6b7500",
    "customer_name": "Test User",
    "customer_phone": "9841234567",
    "customer_email": "test@example.com",
    "service_name": "Electrical Wiring",
    "service_name_nepali": "बिजुली तार",
    "location": "Kathmandu",
    "address": "Test Address",
    "scheduled_date": "2025-08-01T10:00:00.000Z",
    "estimated_price": "800.00",
    "payment_method": "cash",
    "description": "Test booking",
    "status": "pending"
  },
  "timestamp": "2025-07-31T20:30:00.000Z"
}
```

## Step 1: Create Zapier Webhook Receiver

### 1.1 Set Up New Zap
1. Go to zapier.com and click "Create Zap"
2. Choose **"Webhooks by Zapier"** as trigger
3. Select **"Catch Hook"** as trigger event
4. Copy the webhook URL (looks like: `https://hooks.zapier.com/hooks/catch/12345/abcdef`)

### 1.2 Test Your Webhook
1. Add the webhook URL to your Replit environment:
   - Go to your Replit project
   - Click the lock icon (Secrets)
   - Add: `ZAPIER_NEW_BOOKING_WEBHOOK = your_webhook_url`

2. Test the connection:
```bash
curl -X POST http://localhost:5000/api/zapier/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "new_booking", "data": {"bookingId": "73c13793-8688-47d4-be80-55040a6b7500"}}'
```

## Step 2: Connect to Google Sheets

### 2.1 Create Google Sheet
Create a new Google Sheet with these columns:
- A: booking_id
- B: customer_name  
- C: customer_phone
- D: customer_email
- E: service_name
- F: service_name_nepali
- G: location
- H: address
- I: scheduled_date
- J: estimated_price
- K: payment_method
- L: status
- M: description
- N: created_date

### 2.2 Add Google Sheets Action
1. In your Zapier zap, click "+ Add Step"
2. Choose **"Google Sheets"**
3. Select **"Create Spreadsheet Row"**
4. Connect your Google account
5. Select your spreadsheet and worksheet

### 2.3 Map the Data Fields
Map each Zapier field to your sheet columns:
- **booking_id** → Column A: `{{booking_id}}`
- **customer_name** → Column B: `{{customer_name}}`
- **customer_phone** → Column C: `{{customer_phone}}`
- **customer_email** → Column D: `{{customer_email}}`
- **service_name** → Column E: `{{service_name}}`
- **service_name_nepali** → Column F: `{{service_name_nepali}}`
- **location** → Column G: `{{location}}`
- **address** → Column H: `{{address}}`
- **scheduled_date** → Column I: `{{scheduled_date}}`
- **estimated_price** → Column J: `{{estimated_price}}`
- **payment_method** → Column K: `{{payment_method}}`
- **status** → Column L: `{{status}}`
- **description** → Column M: `{{description}}`
- **created_date** → Column N: `{{timestamp}}`

## Step 3: Set Up SMS Notifications

### 3.1 Customer SMS Confirmation
**Add Second Action: SMS**
1. Choose **"SMS by Zapier"** or **"Twilio"**
2. Set **To**: `{{customer_phone}}`
3. Set **Message**:
```
🔔 बुकिङ पुष्टि / Booking Confirmed!

सेवा: {{service_name}} ({{service_name_nepali}})
स्थान: {{location}}
मिति: {{scheduled_date}}
मूल्य: रु. {{estimated_price}}

हाम्रो टिमले चाँडै सम्पर्क गर्नेछ।
धन्यवाद! - जरूरी छ
```

### 3.2 Professional SMS Alert
**Create Second Zap for Professional Notifications**
1. Trigger: Webhook (Professional Assignment)
2. Add environment variable: `ZAPIER_PROFESSIONAL_ASSIGNMENT_WEBHOOK`
3. SMS Action with message:
```
🚨 नयाँ काम / New Job Alert!

ग्राहक: {{customer_name}}
फोन: {{customer_phone}}
सेवा: {{service_name}}
स्थान: {{location}} - {{address}}
मिति: {{scheduled_date}}
मूल्य: रु. {{estimated_price}}

कृपया उपलब्धता पुष्टि गर्नुहोस्।
Booking ID: {{booking_id}}
```

## Step 4: Environment Variables Setup

Add all these webhook URLs to your Replit environment:

```bash
# Customer notifications
ZAPIER_NEW_BOOKING_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_ID/customer

# Professional notifications  
ZAPIER_PROFESSIONAL_ASSIGNMENT_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_ID/professional

# Status updates
ZAPIER_BOOKING_STATUS_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_ID/status

# User registration
ZAPIER_NEW_USER_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_ID/users
```

## Step 5: Test Everything

### 5.1 Test with Real Booking
1. Go to your booking page: `http://localhost:5000/booking/1`
2. Fill out the form and submit
3. Check your Google Sheet - new row should appear
4. Check SMS delivery (if phone number is valid)

### 5.2 Test All Webhook Types
```bash
# Test new booking
curl -X POST http://localhost:5000/api/zapier/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "new_booking", "data": {"bookingId": "73c13793-8688-47d4-be80-55040a6b7500"}}'

# Test professional assignment
curl -X POST http://localhost:5000/api/zapier/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "professional_assignment", "data": {"bookingId": "73c13793-8688-47d4-be80-55040a6b7500", "professionalId": "1"}}'

# Test status update
curl -X POST http://localhost:5000/api/zapier/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "status_update", "data": {"bookingId": "73c13793-8688-47d4-be80-55040a6b7500", "oldStatus": "pending", "newStatus": "assigned"}}'
```

## Step 6: Advanced Data Processing

### 6.1 Format Dates in Zapier
Use Zapier's **Formatter** to convert dates:
- Input: `{{scheduled_date}}`
- Output Format: `MM/DD/YYYY hh:mm AM/PM`

### 6.2 Add Filters
Add **Filter** step to only process certain statuses:
- Continue only if `{{status}}` equals "pending"
- Or continue only if `{{estimated_price}}` is greater than "500"

### 6.3 Multiple Actions per Trigger
Each webhook can trigger multiple actions:
1. Add row to Google Sheets
2. Send SMS to customer
3. Send SMS to professional
4. Send email notification
5. Create calendar event

## Step 7: Monitor & Debug

### 7.1 Check Zapier Task History
- Go to your Zap dashboard
- Click "Task History" to see all executions
- Check for errors or failed tasks

### 7.2 Debug Failed Tasks
- Click on failed task
- Check the input data received
- Verify field mappings
- Test individual steps

### 7.3 View Your Data Export
Get all your booking data for bulk upload:
```bash
curl http://localhost:5000/api/zapier/bookings
```

## Your Data is Production Ready!

Your platform automatically sends:
- **Customer details** with phone numbers for SMS
- **Service information** in English and Nepali
- **Location and scheduling** data
- **Professional assignment** information
- **Payment and status** tracking

The webhook triggers work immediately when customers book services, professionals are assigned, or statuses change. Your Zapier integration will receive real data from actual bookings on your platform.