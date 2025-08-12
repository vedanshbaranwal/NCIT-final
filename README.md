# Jaruri Xa

## AI-Powered Gig Economy Platform for Nepal

---

## Overview  
Jaruri Xa is a unique AI-driven platform designed to empower skilled service workers in Nepal by connecting them with clients through automated voice calls and SMS, eliminating the need for smartphones or internet access. Built with Replit AI assistance, the platform leverages AI automation, Supabase/PostgreSQL as the backend database, and Zapier for workflow automation to deliver seamless gig economy services.

---

## Screenshots & UI Overview

### Homepage and Location Selection  
![Homepage showing service categories and location selection](https://github.com/user-attachments/assets/891da020-ad7f-4ac9-9996-c36367180bb9)  
Users start by selecting their city or location to personalize the service offerings.

---

### Service Selection Cards  
![Service cards showcasing various available services](https://github.com/user-attachments/assets/9c9d0ec1-b4ca-48ad-a848-a1b39c287d75)  
Interactive, animated cards present services such as electricians, plumbers, cleaners, tailors, and more.

---

### Booking Cart Interface  
![Booking cart interface with selected services and checkout options](https://github.com/user-attachments/assets/ee8e27a4-1bb9-4894-a0ae-43cd71e14128)  
Users can review their chosen services, select payment method (cash on delivery or mobile payments), and finalize booking.

---

### Worker Job Notification Workflow  
![Automated notifications workflow for workers](https://github.com/user-attachments/assets/4c8b193c-c5b9-4f70-a6d2-9082cdad3284)  
The platform automatically notifies the nearest suitable workers via SMS or automated voice calls to accept jobs.

---

### Admin Dashboard  
![Admin dashboard showing bookings, worker profiles, and verification status](https://github.com/user-attachments/assets/f73bb6a6-15f0-4382-aa71-86c22ac7768e)  
Administrators can verify workers, manage bookings, track payments, and resolve disputes.

---

### Service Provider Profiles  
![Worker profile example](https://github.com/user-attachments/assets/b4706af1-32a4-4536-8a2e-e702186ddc93)  
Each worker has a detailed profile including skill verification badges and ratings to build client trust.

---

## Key Features  
- AI-driven job matching connecting clients with verified workers  
- Automated voice call and SMS notifications for workers without smartphones  
- Responsive React frontend with a clean, minimal, and modern design  
- Supabase/PostgreSQL real-time backend database for booking and user management  
- Workflow automation using Zapier to trigger SMS and call alerts  
- Secure booking process supporting cash on delivery and mobile payment options (eSewa, Khalti planned)  
- Worker onboarding with NGO partnerships for skill verification and training  
- Admin dashboard for comprehensive platform management  
- Rating and feedback system to ensure service quality  

---

## Technology Stack  
- Frontend: React.js (built with Replit AI assistance)  
- Backend: Supabase (PostgreSQL) for real-time data management  
- Automation: Zapier workflows for notification triggers  
- Communication APIs: Twilio, Sparrow, or local SMS/voice services  
- AI Components: Replica AI agents for automated calls and message handling  

---

## Project Setup Instructions

1. **Clone or Fork the Repository**  
   Download the project files or fork the repository to your Replit workspace or local machine.

2. **Configure Supabase/PostgreSQL Database**  
   - Create a free Supabase project and set up the PostgreSQL database.  
   - Use the provided schema to create tables for bookings, users, and services.  
   - Update your `.env` or config files with Supabase credentials (DATABASE_URL, API keys).

3. **Connect React Frontend**  
   - Update your React app environment variables to connect to the Supabase database.  
   - Deploy locally or use Vercel/Netlify for hosting.

4. **Set Up Zapier Automation**  
   - Create a Zap that watches for new bookings in the Supabase database.  
   - Configure Zapier to send SMS or voice call notifications via Twilio or Sparrow API.  
   - Test workflows to ensure workers receive job alerts and clients get booking confirmations.

5. **Integrate Payment Gateways (Optional for MVP)**  
   - Setup eSewa or Khalti SDKs for secure digital payments.  
   - Enable payment options in the booking flow.

6. **Worker Onboarding & Verification**  
   - Coordinate with local NGOs or INGOs to onboard workers.  
   - Upload verified skill credentials to the platform linked to worker profiles.

7. **Run & Test**  
   - Test full workflow: client books → AI matches → notification sent → worker accepts → booking confirmed.

---

## How It Works  
- Clients select location and service on the website.  
- The system auto-assigns the job to the closest qualified worker.  
- Worker gets notified via SMS or AI-powered voice call and can accept or decline with simple responses.  
- Admin monitors all activities and verifies workers.  
- Payments are processed via mobile wallets or cash on delivery.  
- Ratings and feedback help maintain high service quality.

---

## Societal Impact  
Jaruri Xa empowers digitally marginalized workers by providing equal access to gig opportunities without requiring smartphones or internet. This drives local economic growth, formalizes informal jobs, and supports SDG #8: Decent Work and Economic Growth.

---

## Contact  
For questions or collaboration:  
**Vedansh Baranwal**  
Email: vedanshbarnwal22@gmail.com

---

Thank you for exploring **Jaruri Xa** — bridging opportunity and talent through AI and smart automation!

