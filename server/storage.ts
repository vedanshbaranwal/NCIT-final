import { 
  type User, 
  type InsertUser, 
  type ServiceCategory, 
  type Service, 
  type Professional, 
  type InsertProfessional,
  type Booking, 
  type InsertBooking,
  type Review,
  type InsertReview,
  type Location,
  type ContactRequest,
  type InsertContactRequest,
  type AppNotification,
  type InsertNotification,
  users,
  serviceCategories,
  services,
  professionals,
  bookings,
  reviews,
  locations,
  contactRequests,
  appNotifications
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Service Categories
  getServiceCategories(): Promise<ServiceCategory[]>;
  getActiveServiceCategories(): Promise<ServiceCategory[]>;
  
  // Services
  getServices(): Promise<Service[]>;
  getServicesByCategory(categoryId: string): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  
  // Professionals
  getProfessionals(): Promise<Professional[]>;
  getProfessional(id: string): Promise<Professional | undefined>;
  getProfessionalByUserId(userId: string): Promise<Professional | undefined>;
  createProfessional(professional: InsertProfessional): Promise<Professional>;
  getProfessionalsByService(serviceId: string): Promise<Professional[]>;
  getProfessionalsByLocation(location: string): Promise<Professional[]>;
  
  // Bookings
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;
  getBookingsByCustomer(customerId: string): Promise<Booking[]>;
  getBookingsByProfessional(professionalId: string): Promise<Booking[]>;
  
  // Reviews
  getReviews(): Promise<Review[]>;
  getReviewsByProfessional(professionalId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Locations
  getLocations(): Promise<Location[]>;
  getServiceableLocations(): Promise<Location[]>;
  
  // Contact
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  
  // Notifications
  createNotificationSubscription(notification: InsertNotification): Promise<AppNotification>;
  
  // Stats
  getStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeData();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Service Categories
  async getServiceCategories(): Promise<ServiceCategory[]> {
    return await db.select().from(serviceCategories);
  }

  async getActiveServiceCategories(): Promise<ServiceCategory[]> {
    return await db.select().from(serviceCategories).where(eq(serviceCategories.isActive, true));
  }

  // Services
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.isActive, true));
  }

  async getServicesByCategory(categoryId: string): Promise<Service[]> {
    return await db.select().from(services)
      .where(and(eq(services.categoryId, categoryId), eq(services.isActive, true)));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  // Professionals
  async getProfessionals(): Promise<Professional[]> {
    return await db.select().from(professionals);
  }

  async getProfessional(id: string): Promise<Professional | undefined> {
    const [professional] = await db.select().from(professionals).where(eq(professionals.id, id));
    return professional || undefined;
  }

  async getProfessionalByUserId(userId: string): Promise<Professional | undefined> {
    const [professional] = await db.select().from(professionals).where(eq(professionals.userId, userId));
    return professional || undefined;
  }

  async createProfessional(professional: InsertProfessional): Promise<Professional> {
    const [newProfessional] = await db
      .insert(professionals)
      .values({
        ...professional,
        skills: professional.skills as string[],
        serviceAreas: professional.serviceAreas as string[]
      })
      .returning();
    return newProfessional;
  }

  async getProfessionalsByService(serviceId: string): Promise<Professional[]> {
    // This would need a junction table in a real app, for now return all professionals
    return await db.select().from(professionals).where(eq(professionals.isVerified, true));
  }

  async getProfessionalsByLocation(location: string): Promise<Professional[]> {
    // Filter professionals who serve this location
    return await db.select().from(professionals);
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return newBooking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking || undefined;
  }

  async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.customerId, customerId));
  }

  async getBookingsByProfessional(professionalId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.professionalId, professionalId));
  }

  // Reviews
  async getReviews(): Promise<Review[]> {
    return await db.select().from(reviews);
  }

  async getReviewsByProfessional(professionalId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.professionalId, professionalId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  // Locations
  async getLocations(): Promise<Location[]> {
    const result = await db.select().from(locations);
    return result as Location[];
  }

  async getServiceableLocations(): Promise<Location[]> {
    const result = await db.select().from(locations).where(eq(locations.isServiceable, true));
    return result as Location[];
  }

  // Contact
  async createContactRequest(request: InsertContactRequest): Promise<ContactRequest> {
    const [newRequest] = await db
      .insert(contactRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  // Notifications
  async createNotificationSubscription(notification: InsertNotification): Promise<AppNotification> {
    const [newNotification] = await db
      .insert(appNotifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  // Stats
  async getStats(): Promise<any> {
    const totalBookings = await db.select().from(bookings);
    const totalProfessionals = await db.select().from(professionals);
    const totalUsers = await db.select().from(users);
    
    return {
      totalBookings: totalBookings.length,
      totalProfessionals: totalProfessionals.length,
      totalUsers: totalUsers.length,
      activeServices: 8
    };
  }

  private async initializeData() {
    try {
      // Check if data already exists
      const existingCategories = await db.select().from(serviceCategories);
      if (existingCategories.length > 0) {
        return; // Data already initialized
      }

      // Initialize service categories with Nepal-context images
      const categoriesData = [
        { name: "Electrician", nameNepali: "बिजुली मिस्त्री", description: "Electrical repairs and installations", icon: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", color: "yellow", isActive: true },
        { name: "Plumber", nameNepali: "प्लम्बर", description: "Pipe and fixture repairs", icon: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", color: "blue", isActive: true },
        { name: "House Cleaning", nameNepali: "घर सफाई", description: "Deep and regular cleaning", icon: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", color: "green", isActive: true },
        { name: "AC Repair", nameNepali: "ए.सी. मर्मत", description: "AC service and installation", icon: "https://images.unsplash.com/photo-1604709177225-055f99402ea3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", color: "cyan", isActive: true },
        { name: "Carpenter", nameNepali: "सुतारी", description: "Furniture and wood work", icon: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", color: "amber", isActive: true },
        { name: "Painting", nameNepali: "रंगाई", description: "Interior and exterior painting", icon: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", color: "purple", isActive: true },
        { name: "Appliance Repair", nameNepali: "उपकरण मर्मत", description: "TV, washing machine repairs", icon: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", color: "red", isActive: true },
        { name: "Pest Control", nameNepali: "कीरा नियन्त्रण", description: "Safe and effective pest control", icon: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", color: "teal", isActive: true },
      ];

      const insertedCategories = await db.insert(serviceCategories).values(categoriesData).returning();

      // Initialize services
      const servicesData = [
        { categoryId: insertedCategories[0].id, name: "Electrical Repairs", nameNepali: "बिजुली मर्मत", description: "Fix electrical issues and installations", basePrice: "500.00", unit: "hour", estimatedDuration: 60, isActive: true },
        { categoryId: insertedCategories[1].id, name: "Pipe Repair", nameNepali: "पाइप मर्मत", description: "Fix leaky pipes and faucets", basePrice: "400.00", unit: "hour", estimatedDuration: 45, isActive: true },
        { categoryId: insertedCategories[2].id, name: "Deep Cleaning", nameNepali: "गहिरो सफाई", description: "Thorough house cleaning service", basePrice: "800.00", unit: "fixed", estimatedDuration: 180, isActive: true },
        { categoryId: insertedCategories[3].id, name: "AC Service", nameNepali: "ए.सी. सेवा", description: "AC cleaning and maintenance", basePrice: "1200.00", unit: "fixed", estimatedDuration: 90, isActive: true },
        { categoryId: insertedCategories[4].id, name: "Furniture Assembly", nameNepali: "फर्निचर जोड्ने", description: "Assemble furniture and cabinets", basePrice: "600.00", unit: "hour", estimatedDuration: 120, isActive: true },
        { categoryId: insertedCategories[5].id, name: "Wall Painting", nameNepali: "भित्ता रंगाई", description: "Interior wall painting service", basePrice: "300.00", unit: "sq_ft", estimatedDuration: 240, isActive: true },
        { categoryId: insertedCategories[6].id, name: "TV Repair", nameNepali: "टि.भी. मर्मत", description: "Television repair and setup", basePrice: "700.00", unit: "fixed", estimatedDuration: 75, isActive: true },
        { categoryId: insertedCategories[7].id, name: "Home Pest Control", nameNepali: "घर कीरा नियन्त्रण", description: "Safe pest control for homes", basePrice: "1000.00", unit: "fixed", estimatedDuration: 120, isActive: true },
      ];

      await db.insert(services).values(servicesData);

      // Initialize locations
      const locationsData = [
        { name: "Kathmandu", nameNepali: "काठमाडौं", type: "city" as const, parentId: null, isServiceable: true },
        { name: "Pokhara", nameNepali: "पोखरा", type: "city" as const, parentId: null, isServiceable: true },
        { name: "Chitwan", nameNepali: "चितवन", type: "city" as const, parentId: null, isServiceable: true },
        { name: "Lalitpur", nameNepali: "ललितपुर", type: "city" as const, parentId: null, isServiceable: true },
        { name: "Bhaktapur", nameNepali: "भक्तपुर", type: "city" as const, parentId: null, isServiceable: true },
      ];

      await db.insert(locations).values(locationsData);

      console.log("Database initialized with service data");
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }
}

export const storage = new DatabaseStorage();