# जरूरी छ - Complete Zapier Integration Guide

## 🎯 Your Google Sheets is Ready!

### Spreadsheet Details:
- **URL**: https://docs.google.com/spreadsheets/d/1CuqYP9kyYUSszYVN3_ZJAjHV6rHnnONO_wJjBqPUzew
- **Service Account**: jaruri@jaruri.iam.gserviceaccount.com

### Required Sheets (create these tabs):
1. **Categories** - Service types (Electrician, Plumber, etc.)
2. **Services** - Individual services with pricing  
3. **Locations** - Service areas (Kathmandu, Pokhara, etc.)
4. **Users** - Customer accounts
5. **Bookings** - Service appointments ← **Main trigger for Zapier**
6. **Professionals** - Worker profiles

---

## 📋 Step-by-Step Setup

### Step 1: Import CSV Data
From the `google-sheets-setup` folder, import these files:

```
Categories Sheet    ← categories-for-sheets.csv (8 categories)
Services Sheet      ← services-for-sheets.csv (8 services)  
Locations Sheet     ← locations-for-sheets.csv (5 cities)
Users Sheet         ← users-template.csv (headers only)
Bookings Sheet      ← bookings-template.csv (headers only)
Professionals Sheet ← professionals-template.csv (headers only)
```

### Step 2: Share Spreadsheet
Share with: **jaruri@jaruri.iam.gserviceaccount.com**
Permission: **Editor**

---

## 🤖 Zapier Automation Workflows

### Workflow 1: New Booking → Notify Professional

**Trigger:** Google Sheets - New Spreadsheet Row
- **Spreadsheet**: Your जरूरी छ spreadsheet
- **Worksheet**: Bookings

**Action 1:** WhatsApp Business (or SMS via Twilio)
- **To**: Professional's phone number
- **Message**:
```
🔧 New जरूरी छ Job Available!

Service: {{Service Name}}
Location: {{Address}}
Date: {{Scheduled Date}} 
Customer Phone: {{Customer Phone}}
Estimated Price: Rs. {{Estimated Price}}

Reply YES to accept this job.
Details: {{Description}}
```

### Workflow 2: User Registration → Welcome Message

**Trigger:** Google Sheets - New Spreadsheet Row
- **Worksheet**: Users

**Action:** SMS/Email
- **Message**: "Welcome to जरूरी छ! Book home services easily. Need help? Call 01-1234567"

### Workflow 3: Booking Status Change → Customer Update

**Trigger:** Google Sheets - Updated Spreadsheet Row  
- **Worksheet**: Bookings
- **Trigger Column**: status

**Action:** SMS to Customer
- **When status = "confirmed"**: "✅ Your booking is confirmed! Professional will arrive on {{date}}"
- **When status = "completed"**: "🎉 Service completed! Please rate your experience."
- **When status = "cancelled"**: "❌ Booking cancelled. Full refund processed."

---

## 📊 Data Flow Architecture

```
जरूरी छ Website → CSV Files → Google Sheets → Zapier → WhatsApp/SMS
```

### Real-time Process:
1. **Customer books service** → New row added to Bookings sheet
2. **Zapier detects change** → Looks up service details  
3. **Finds matching professional** → Based on serviceId + location
4. **Sends WhatsApp notification** → Professional gets job offer
5. **Professional responds** → Booking status updated
6. **Customer notified** → Automatic confirmation message

---

## 🔍 Professional Matching Logic

### In Zapier Formatter/Lookup:

1. **Get Service Details:**
   - Use `serviceId` from Bookings row
   - Lookup in Services sheet → get `categoryId` 
   - Lookup in Categories sheet → get category name

2. **Find Available Professionals:**
   - Filter Professionals sheet by:
     - `skills` contains category name (e.g., "Electrician")
     - `availability` = "available"
     - `serviceAreas` contains booking location

3. **Send Notification:**
   - Get professional's phone from Users sheet (userId lookup)
   - Send personalized WhatsApp message

### Example Matching:
```
Booking: serviceId="1", location="Kathmandu"
↓
Service: id="1", categoryId="1", name="Electrical Repairs"  
↓
Category: id="1", name="Electrician"
↓  
Find Professionals: skills contains "Electrician" AND serviceAreas contains "Kathmandu"
↓
Send to: Professional's WhatsApp number
```

---

## 📱 WhatsApp Message Templates

### New Job Notification:
```
🔧 जरूरी छ - New Job Alert!

Service: Electrical Repairs
Location: Thamel, Kathmandu  
Date: Tomorrow 2:00 PM
Customer: 9841234567
Price: Rs. 500

Accept? Reply:
✅ YES - I'll take this job
❌ NO - Not available

Job ID: #B001
```

### Customer Confirmation:
```
✅ Booking Confirmed - जरूरी छ

Your electrician will arrive:
📅 Date: Jan 15, 2025 
⏰ Time: 2:00 PM
📍 Location: Your address
💰 Price: Rs. 500

Professional: Ram Sharma
📞 Contact: 9841234568

Need changes? Reply RESCHEDULE
```

### Job Completion:
```
🎉 Service Completed - जरूरी छ

Thank you for using our service!

Rate your experience:
⭐ Reply: RATE 5 (Excellent)
⭐ Reply: RATE 4 (Good)  
⭐ Reply: RATE 3 (Average)

💳 Payment: Rs. 500 (Cash on Delivery)
🧾 Invoice sent to your email
```

---

## 🛠️ Advanced Zapier Features

### Multi-Step Zaps:

**Zap 1: Smart Professional Selection**
1. New booking trigger
2. Lookup service details  
3. Filter professionals by skills + location
4. Send to 3 professionals simultaneously
5. First to reply "YES" gets the job

**Zap 2: Customer Journey**
1. User registration → Welcome SMS
2. First booking → Tutorial tips
3. Booking confirmed → Instructions SMS  
4. Service completed → Review request
5. Repeat customer → Loyalty discount

**Zap 3: Business Intelligence**
1. Daily booking summary → Email to admin
2. Popular services → Inventory alerts
3. Customer feedback → Service improvements
4. Professional ratings → Quality monitoring

---

## 📈 Analytics & Reporting

### Google Sheets Formulas:
```
Total Bookings Today: =COUNTIF(Bookings!R:R, TODAY())
Revenue This Month: =SUMIF(Bookings!S:S, ">="&EOMONTH(TODAY(),-1)+1, Bookings!I:I)
Top Service: =INDEX(Services!C:C, MATCH(MAX(COUNTIF(Bookings!D:D, Services!A:A)), COUNTIF(Bookings!D:D, Services!A:A), 0))
```

### Zapier Analytics Zaps:
- **Daily Reports**: Email summary of bookings, revenue, new users
- **Performance Alerts**: Notify when booking response time > 1 hour
- **Growth Tracking**: Weekly customer acquisition reports

---

## 🚨 Error Handling & Monitoring

### Zapier Error Notifications:
1. **Failed SMS**: Retry with email backup
2. **Invalid Phone**: Log error + manual follow-up  
3. **No Available Professional**: Auto-expand search radius
4. **Booking Conflicts**: Alert admin immediately

### Monitoring Zaps:
- **Health Check**: Daily test booking to verify system
- **Response Time**: Alert if professionals don't respond within 30 min
- **Customer Satisfaction**: Auto-escalate low ratings

---

## 🎯 Success Metrics

Track these KPIs through Zapier + Google Sheets:
- **Booking Conversion**: Leads → Confirmed bookings
- **Professional Response Time**: Job offer → Acceptance  
- **Customer Satisfaction**: Average rating per service
- **Revenue per User**: Total customer lifetime value
- **Service Coverage**: % of booking requests fulfilled

This complete system gives you a fully automated service marketplace with real-time notifications!