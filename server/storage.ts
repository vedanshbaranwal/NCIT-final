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
import { randomUUID } from "crypto";
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private serviceCategories: Map<string, ServiceCategory>;
  private services: Map<string, Service>;
  private professionals: Map<string, Professional>;
  private bookings: Map<string, Booking>;
  private reviews: Map<string, Review>;
  private locations: Map<string, Location>;
  private contactRequests: Map<string, ContactRequest>;
  private notifications: Map<string, AppNotification>;

  constructor() {
    this.users = new Map();
    this.serviceCategories = new Map();
    this.services = new Map();
    this.professionals = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.locations = new Map();
    this.contactRequests = new Map();
    this.notifications = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize service categories
    const categories: ServiceCategory[] = [
      { id: "1", name: "Electrician", nameNepali: "बिजुली मिस्त्री", description: "Electrical repairs and installations", icon: "fas fa-bolt", color: "yellow", isActive: true },
      { id: "2", name: "Plumber", nameNepali: "प्लम्बर", description: "Pipe and fixture repairs", icon: "fas fa-wrench", color: "blue", isActive: true },
      { id: "3", name: "House Cleaning", nameNepali: "घर सफाई", description: "Deep and regular cleaning", icon: "fas fa-broom", color: "green", isActive: true },
      { id: "4", name: "AC Repair", nameNepali: "ए.सी. मर्मत", description: "AC service and installation", icon: "fas fa-snowflake", color: "cyan", isActive: true },
      { id: "5", name: "Carpenter", nameNepali: "सुतारी", description: "Furniture and wood work", icon: "fas fa-hammer", color: "amber", isActive: true },
      { id: "6", name: "Painting", nameNepali: "रंगाई", description: "Interior and exterior painting", icon: "fas fa-paint-roller", color: "purple", isActive: true },
      { id: "7", name: "Appliance Repair", nameNepali: "उपकरण मर्मत", description: "TV, washing machine repairs", icon: "fas fa-tools", color: "red", isActive: true },
      { id: "8", name: "Pest Control", nameNepali: "कीरा नियन्त्रण", description: "Safe and effective pest control", icon: "fas fa-bug", color: "teal", isActive: true },
    ];

    categories.forEach(cat => this.serviceCategories.set(cat.id, cat));

    // Initialize services
    const services: Service[] = [
      { id: "1", categoryId: "1", name: "Electrical Repairs", nameNepali: "बिजुली मर्मत", description: "Fix electrical issues and installations", basePrice: "500.00", unit: "hour", estimatedDuration: 60, isActive: true },
      { id: "2", categoryId: "2", name: "Pipe Repair", nameNepali: "पाइप मर्मत", description: "Fix leaky pipes and faucets", basePrice: "400.00", unit: "hour", estimatedDuration: 45, isActive: true },
      { id: "3", categoryId: "3", name: "Deep Cleaning", nameNepali: "गहिरो सफाई", description: "Thorough house cleaning service", basePrice: "800.00", unit: "fixed", estimatedDuration: 180, isActive: true },
      { id: "4", categoryId: "4", name: "AC Service", nameNepali: "ए.सी. सेवा", description: "AC cleaning and maintenance", basePrice: "1200.00", unit: "fixed", estimatedDuration: 90, isActive: true },
      { id: "5", categoryId: "5", name: "Furniture Assembly", nameNepali: "फर्निचर जोड्ने", description: "Assemble furniture and cabinets", basePrice: "600.00", unit: "hour", estimatedDuration: 120, isActive: true },
      { id: "6", categoryId: "6", name: "Wall Painting", nameNepali: "भित्ता रंगाई", description: "Interior wall painting service", basePrice: "300.00", unit: "sq_ft", estimatedDuration: 240, isActive: true },
      { id: "7", categoryId: "7", name: "TV Repair", nameNepali: "टि.भी. मर्मत", description: "Television repair and setup", basePrice: "700.00", unit: "fixed", estimatedDuration: 75, isActive: true },
      { id: "8", categoryId: "8", name: "Home Pest Control", nameNepali: "घर कीरा नियन्त्रण", description: "Safe pest control for homes", basePrice: "1000.00", unit: "fixed", estimatedDuration: 120, isActive: true },
    ];

    services.forEach(service => this.services.set(service.id, service));

    // Initialize locations
    const locations: Location[] = [
      { id: "1", name: "Kathmandu", nameNepali: "काठमाडौं", type: "city", parentId: null, isServiceable: true },
      { id: "2", name: "Pokhara", nameNepali: "पोखरा", type: "city", parentId: null, isServiceable: true },
      { id: "3", name: "Chitwan", nameNepali: "चितवन", type: "city", parentId: null, isServiceable: true },
      { id: "4", name: "Lalitpur", nameNepali: "ललितपुर", type: "city", parentId: null, isServiceable: true },
      { id: "5", name: "Bhaktapur", nameNepali: "भक्तपुर", type: "city", parentId: null, isServiceable: true },
    ];

    locations.forEach(location => this.locations.set(location.id, location));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "customer",
      phone: insertUser.phone || null,
      profilePicture: insertUser.profilePicture || null,
      createdAt: now, 
      updatedAt: now,
      isVerified: false 
    };
    this.users.set(id, user);
    return user;
  }

  // Service Categories methods
  async getServiceCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.serviceCategories.values());
  }

  async getActiveServiceCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.serviceCategories.values()).filter(cat => cat.isActive);
  }

  // Services methods
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServicesByCategory(categoryId: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.categoryId === categoryId);
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  // Professional methods
  async getProfessionals(): Promise<Professional[]> {
    return Array.from(this.professionals.values());
  }

  async getProfessional(id: string): Promise<Professional | undefined> {
    return this.professionals.get(id);
  }

  async getProfessionalByUserId(userId: string): Promise<Professional | undefined> {
    return Array.from(this.professionals.values()).find(prof => prof.userId === userId);
  }

  async createProfessional(insertProfessional: InsertProfessional): Promise<Professional> {
    const id = randomUUID();
    const now = new Date();
    const professional: Professional = { 
      ...insertProfessional, 
      id, 
      isVerified: insertProfessional.isVerified || false,
      bio: insertProfessional.bio || null,
      experience: insertProfessional.experience || null,
      hourlyRate: insertProfessional.hourlyRate || null,
      rating: "0.00",
      totalJobs: 0,
      availabilityStatus: insertProfessional.availabilityStatus || "available",
      documents: insertProfessional.documents || null,
      createdAt: now 
    };
    this.professionals.set(id, professional);
    return professional;
  }

  async getProfessionalsByService(serviceId: string): Promise<Professional[]> {
    const service = await this.getService(serviceId);
    if (!service) return [];
    
    return Array.from(this.professionals.values()).filter(prof => 
      prof.skills.includes(service.name) && prof.isVerified && prof.availabilityStatus === "available"
    );
  }

  async getProfessionalsByLocation(location: string): Promise<Professional[]> {
    return Array.from(this.professionals.values()).filter(prof => 
      prof.serviceAreas.includes(location)
    );
  }

  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const now = new Date();
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      description: insertBooking.description || null,
      specialRequirements: insertBooking.specialRequirements || null,
      professionalId: null,
      finalPrice: null,
      status: "pending",
      paymentStatus: "pending",
      customerNotes: insertBooking.customerNotes || null,
      professionalNotes: insertBooking.professionalNotes || null,
      coordinates: insertBooking.coordinates || null,
      createdAt: now, 
      updatedAt: now 
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status: status as any, updatedAt: new Date() };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.customerId === customerId);
  }

  async getBookingsByProfessional(professionalId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.professionalId === professionalId);
  }

  // Review methods
  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async getReviewsByProfessional(professionalId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.professionalId === professionalId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const now = new Date();
    const review: Review = { 
      ...insertReview, 
      id, 
      comment: insertReview.comment || null,
      response: insertReview.response || null,
      isVerified: false,
      createdAt: now 
    };
    this.reviews.set(id, review);
    return review;
  }

  // Location methods
  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getServiceableLocations(): Promise<Location[]> {
    return Array.from(this.locations.values()).filter(location => location.isServiceable);
  }

  // Contact methods
  async createContactRequest(insertRequest: InsertContactRequest): Promise<ContactRequest> {
    const id = randomUUID();
    const now = new Date();
    const request: ContactRequest = { 
      ...insertRequest, 
      id, 
      status: "new",
      createdAt: now 
    };
    this.contactRequests.set(id, request);
    return request;
  }

  // Notification methods
  async createNotificationSubscription(insertNotification: InsertNotification): Promise<AppNotification> {
    const id = randomUUID();
    const now = new Date();
    const notification: AppNotification = { 
      ...insertNotification, 
      id, 
      createdAt: now 
    };
    this.notifications.set(id, notification);
    return notification;
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Service Categories methods
  async getServiceCategories(): Promise<ServiceCategory[]> {
    return await db.select().from(serviceCategories);
  }

  async getActiveServiceCategories(): Promise<ServiceCategory[]> {
    return await db.select().from(serviceCategories).where(eq(serviceCategories.isActive, true));
  }

  // Services methods
  async getServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getServicesByCategory(categoryId: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.categoryId, categoryId));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  // Professional methods
  async getProfessionals(): Promise<Professional[]> {
    return await db.select().from(professionals);
  }

  async getProfessional(id: string): Promise<Professional | undefined> {
    const [professional] = await db.select().from(professionals).where(eq(professionals.id, id));
    return professional;
  }

  async getProfessionalByUserId(userId: string): Promise<Professional | undefined> {
    const [professional] = await db.select().from(professionals).where(eq(professionals.userId, userId));
    return professional;
  }

  async createProfessional(insertProfessional: InsertProfessional): Promise<Professional> {
    const [professional] = await db.insert(professionals).values(insertProfessional).returning();
    return professional;
  }

  async getProfessionalsByService(serviceId: string): Promise<Professional[]> {
    const service = await this.getService(serviceId);
    if (!service) return [];
    
    return await db.select().from(professionals).where(
      and(
        eq(professionals.isVerified, true),
        eq(professionals.availabilityStatus, "available")
      )
    );
  }

  async getProfessionalsByLocation(location: string): Promise<Professional[]> {
    return await db.select().from(professionals);
  }

  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    return booking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const [booking] = await db.update(bookings)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.customerId, customerId));
  }

  async getBookingsByProfessional(professionalId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.professionalId, professionalId));
  }

  // Review methods
  async getReviews(): Promise<Review[]> {
    return await db.select().from(reviews);
  }

  async getReviewsByProfessional(professionalId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.professionalId, professionalId));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  // Location methods
  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations);
  }

  async getServiceableLocations(): Promise<Location[]> {
    return await db.select().from(locations).where(eq(locations.isServiceable, true));
  }

  // Contact methods
  async createContactRequest(insertRequest: InsertContactRequest): Promise<ContactRequest> {
    const [request] = await db.insert(contactRequests).values(insertRequest).returning();
    return request;
  }

  // Notification methods
  async createNotificationSubscription(insertNotification: InsertNotification): Promise<AppNotification> {
    const [notification] = await db.insert(appNotifications).values(insertNotification).returning();
    return notification;
  }
}

// Use database storage with local PostgreSQL
export const storage = new DatabaseStorage();
