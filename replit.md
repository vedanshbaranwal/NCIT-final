# जरूरी छ - Service Platform

## Overview

This is a clean, simplified service booking platform named **"जरूरी छ - आवश्यकतामा रोजगार"** designed to connect customers with trusted professionals across Nepal. The platform facilitates booking various home services like electricians, plumbers, cleaners, and other skilled professionals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Form Management**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with Express routes
- **Validation**: Zod schemas shared between client and server

### Key Components

#### Database Schema
- **Users**: Customer and professional accounts with role-based access
- **Service Categories**: Organized service types (electrical, plumbing, etc.)
- **Services**: Individual services with pricing and descriptions
- **Professionals**: Service provider profiles with skills and ratings
- **Bookings**: Service reservations with status tracking
- **Reviews**: Customer feedback and ratings system
- **Notifications**: System alerts and communications
- **Contact Requests**: Customer inquiry management

#### Pages and Features
- **Home Page**: Hero section, service categories, testimonials, how-it-works
- **Services Page**: Browse and filter available services
- **Booking Page**: Service booking with date/time selection and payment options
- **Worker Signup**: Professional registration with skill verification
- **Contact System**: Customer support and inquiries

#### UI Components
- Responsive design with mobile-first approach
- Bilingual support (English/Nepali)
- Accessibility-compliant components
- Loading states and error handling
- Toast notifications for user feedback

### Data Flow

1. **Service Discovery**: Users browse categories and services through the frontend
2. **Professional Matching**: System queries professionals based on location and skills
3. **Booking Process**: Customers select services, schedule appointments, and submit bookings
4. **Notification System**: Professionals receive job notifications (planned: SMS/WhatsApp integration)
5. **Review System**: Post-service feedback and rating collection

### External Dependencies

#### Core Dependencies
- **Database**: Supabase PostgreSQL for data storage (fallback to memory storage in development)
- **Authentication**: Session-based authentication with login/register functionality  
- **UI Components**: Radix UI primitives for accessible components
- **Date Management**: date-fns for date formatting and manipulation
- **Form Validation**: Hookform resolvers with Zod for type-safe validation

#### Current Implementation Status
- **Database Integration**: Local PostgreSQL database active, Supabase connection string saved for migration
- **Authentication System**: Complete user registration, login, and session management working with real database
- **Booking System**: Guest and authenticated user booking capabilities with persistent storage
- **Data Storage**: All user data, bookings, and service information stored in PostgreSQL for Zapier integration
- **Migration Ready**: Script available to switch to Supabase when hostname resolves

#### Planned Integrations
- **SMS/WhatsApp Notifications**: Zapier or Make.com for worker notifications
- **Payment Processing**: Currently simulated (COD and online payment options)
- **Geolocation Services**: Browser geolocation with fallback to Kathmandu coordinates

### Deployment Strategy

#### Development Environment
- **Build Tool**: Vite with React plugin and runtime error overlay
- **Development Server**: Express with Vite middleware in development mode
- **TypeScript**: Strict mode with path mapping for clean imports

#### Production Build
- **Frontend**: Vite build output to `dist/public`
- **Backend**: esbuild compilation of Express server to `dist/index.js`
- **Database**: Drizzle Kit for schema migrations and database management
- **Environment**: NODE_ENV-based configuration for development/production modes

#### File Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared types and schemas
├── migrations/      # Database migration files
└── attached_assets/ # Design specifications and requirements
```

The application uses a monorepo structure with clear separation between client, server, and shared code, enabling type safety across the full stack while maintaining clean architecture boundaries.