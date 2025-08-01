# Quick Migration Guide

## For Bolt.new Migration

### Export Your Data
```bash
curl http://localhost:5000/api/categories > categories.json
curl http://localhost:5000/api/services > services.json
curl http://localhost:5000/api/bookings > bookings.json
```

### Use In-Memory Storage
Replace database storage with in-memory storage and seed with your exported data.

## For Zapier Integration

### Add Webhook URLs to Environment
```
ZAPIER_NEW_BOOKING_WEBHOOK=your_webhook_url
ZAPIER_BOOKING_STATUS_WEBHOOK=your_webhook_url
```

### Test Webhook
```bash
curl -X POST /api/zapier/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "new_booking", "data": {"bookingId": "test-123"}}'
```

Your platform automatically sends booking data to Zapier for SMS notifications and Google Sheets integration.