import { randomUUID } from "crypto";
import type {
  User,
  InsertUser,
  ServiceCategory,
  Service,
  Professional,
  InsertProfessional,
  Booking,
  InsertBooking,
  Review,
  InsertReview,
  Location,
  ContactRequest,
  InsertContactRequest,
  AppNotification,
  InsertNotification
} from "@shared/schema";

// Seed data for in-memory storage (Bolt migration approach)
const seedData = {
  categories: [
    { id: "1", name: "Electrician", nameNepali: "बिजुली मिस्त्री", description: "Electrical services for home and office", icon: "zap", isActive: true },
    { id: "2", name: "Plumber", nameNepali: "नल मिस्त्री", description: "Plumbing and water services", icon: "droplets", isActive: true },
    { id: "3", name: "Cleaner", nameNepali: "सफाई कर्मचारी", description: "Professional cleaning services", icon: "spray-can", isActive: true },
    { id: "4", name: "Carpenter", nameNepali: "काठ मिस्त्री", description: "Wood work and furniture repair", icon: "hammer", isActive: true },
    { id: "5", name: "Painter", nameNepali: "रंग लगाउने", description: "House and building painting services", icon: "paint-brush", isActive: true }
  ],
  
  services: [
    { id: "1", categoryId: "1", name: "Electrical Installation", nameNepali: "बिजुली जडान", description: "Complete electrical installation service", basePrice: "2500", unit: "service", estimatedDuration: 120, isActive: true },
    { id: "2", categoryId: "1", name: "Switch & Socket Repair", nameNepali: "स्विच र सकेट मर्मत", description: "Repair or replace switches and sockets", basePrice: "800", unit: "piece", estimatedDuration: 30, isActive: true },
    { id: "3", categoryId: "2", name: "Pipe Repair", nameNepali: "पाइप मर्मत", description: "Fix leaking or broken pipes", basePrice: "1500", unit: "service", estimatedDuration: 90, isActive: true },
    { id: "4", categoryId: "2", name: "Toilet Installation", nameNepali: "शौचालय जडान", description: "Install new toilet systems", basePrice: "3500", unit: "service", estimatedDuration: 180, isActive: true },
    { id: "5", categoryId: "3", name: "Deep House Cleaning", nameNepali: "घर सफाई", description: "Complete house cleaning service", basePrice: "2000", unit: "house", estimatedDuration: 240, isActive: true }
  ],
  
  locations: [
    { id: "1", name: "Kathmandu", nameNepali: "काठमाडौं", isServiceable: true },
    { id: "2", name: "Lalitpur", nameNepali: "ललितपुर", isServiceable: true },
    { id: "3", name: "Bhaktapur", nameNepali: "भक्तपुर", isServiceable: true },
    { id: "4", name: "Pokhara", nameNepali: "पोखरा", isServiceable: true },
    { id: "5", name: "Chitwan", nameNepali: "चितवन", isServiceable: true }
  ],
  
  professionals: [
    { 
      id: "1", 
      userId: "prof1", 
      bio: "Experienced electrician with 10+ years", 
      skills: ["Electrical Installation", "Switch & Socket Repair"], 
      experience: "10 years", 
      hourlyRate: "1500", 
      isVerified: true, 
      rating: "4.8", 
      totalJobs: 127, 
      availabilityStatus: "available", 
      serviceAreas: ["Kathmandu", "Lalitpur"], 
      documents: null, 
      createdAt: new Date("2024-01-15") 
    },
    { 
      id: "2", 
      userId: "prof2", 
      bio: "Professional plumber serving Kathmandu valley", 
      skills: ["Pipe Repair", "Toilet Installation"], 
      experience: "8 years", 
      hourlyRate: "1200", 
      isVerified: true, 
      rating: "4.6", 
      totalJobs: 89, 
      availabilityStatus: "available", 
      serviceAreas: ["Kathmandu", "Bhaktapur"], 
      documents: null, 
      createdAt: new Date("2024-02-10") 
    }
  ],
  
  users: [
    { 
      id: "prof1", 
      email: "electrician@example.com", 
      password: "$2b$10$hashedpassword1", 
      fullName: "Ram Bahadur", 
      phone: "9841234567", 
      location: "Kathmandu", 
      userType: "professional", 
      createdAt: new Date("2024-01-15") 
    },
    { 
      id: "prof2", 
      email: "plumber@example.com", 
      password: "$2b$10$hashedpassword2", 
      fullName: "Hari Sharma", 
      phone: "9851234567", 
      location: "Lalitpur", 
      userType: "professional", 
      createdAt: new Date("2024-02-10") 
    },
    { 
      id: "customer1", 
      email: "test@example.com", 
      password: "$2b$10$K2EvdJpYU9G8QI3fA7.EzOTEWCZJvNs2VJqBBJDSKQKXKrYf/YNgC", // password: "password123"
      fullName: "Test Customer", 
      phone: "9801234567", 
      location: "Kathmandu", 
      userType: "customer", 
      createdAt: new Date("2024-01-01") 
    }
  ],
  
  bookings: [],
  reviews: [],
  contactRequests: [],
  notifications: []
};

export class MemoryStorage {
  private users = new Map<string, User>();
  private categories = new Map<string, ServiceCategory>();
  private services = new Map<string, Service>();
  private professionals = new Map<string, Professional>();
  private bookings = new Map<string, Booking>();
  private reviews = new Map<string, Review>();
  private locations = new Map<string, Location>();
  private contactRequests = new Map<string, ContactRequest>();
  private notifications = new Map<string, AppNotification>();

  constructor() {
    this.initWithSeedData();
  }

  private initWithSeedData() {
    // Load seed data into memory maps
    seedData.users.forEach(item => this.users.set(item.id, item as User));
    seedData.categories.forEach(item => this.categories.set(item.id, item as ServiceCategory));
    seedData.services.forEach(item => this.services.set(item.id, item as Service));
    seedData.locations.forEach(item => this.locations.set(item.id, item as Location));
    seedData.professionals.forEach(item => this.professionals.set(item.id, item as Professional));
    seedData.bookings.forEach(item => this.bookings.set(item.id, item as Booking));
    seedData.reviews.forEach(item => this.reviews.set(item.id, item as Review));
    seedData.contactRequests.forEach(item => this.contactRequests.set(item.id, item as ContactRequest));
    seedData.notifications.forEach(item => this.notifications.set(item.id, item as AppNotification));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === username);
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
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Service Category methods
  async getServiceCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.categories.values());
  }

  async getActiveServiceCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.categories.values()).filter(cat => cat.isActive);
  }

  // Service methods
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
      status: "pending",
      createdAt: now,
      updatedAt: now
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      booking.updatedAt = new Date();
      this.bookings.set(id, booking);
    }
    return booking;
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
    return Array.from(this.locations.values()).filter(loc => loc.isServiceable);
  }

  // Contact methods
  async createContactRequest(insertRequest: InsertContactRequest): Promise<ContactRequest> {
    const id = randomUUID();
    const now = new Date();
    const request: ContactRequest = {
      ...insertRequest,
      id,
      status: "pending",
      createdAt: now
    };
    this.contactRequests.set(id, request);
    return request;
  }

  // Notification methods
  async createNotification(insertNotification: InsertNotification): Promise<AppNotification> {
    const id = randomUUID();
    const now = new Date();
    const notification: AppNotification = {
      ...insertNotification,
      id,
      isRead: false,
      createdAt: now
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async getNotificationsByUser(userId: string): Promise<AppNotification[]> {
    return Array.from(this.notifications.values()).filter(notif => notif.userId === userId);
  }

  async markNotificationAsRead(id: string): Promise<AppNotification | undefined> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(id, notification);
    }
    return notification;
  }
}