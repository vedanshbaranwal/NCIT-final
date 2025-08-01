import { randomUUID } from "crypto";

// Simple types for the new system
export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  location: string;
  userType: "customer" | "professional";
  createdAt: Date;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  nameNepali: string;
  description: string;
  basePrice: string;
  unit: string;
  estimatedDuration: number;
}

export interface Category {
  id: string;
  name: string;
  nameNepali: string;
  description: string;
  icon: string;
}

export interface Location {
  id: string;
  name: string;
  nameNepali: string;
}

export interface Professional {
  id: string;
  userId: string;
  bio: string;
  skills: string[];
  experience: string;
  hourlyRate: string;
  rating: string;
  totalJobs: number;
  serviceAreas: string[];
  createdAt: Date;
}

export interface Booking {
  id: string;
  serviceId: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerLocation: string;
  scheduledDate: Date;
  estimatedPrice: string;
  paymentMethod: string;
  specialRequests?: string;
  status: string;
  createdAt: Date;
}

// In-memory storage with seed data
class SimpleStorage {
  private users = new Map<string, User>();
  private categories = new Map<string, Category>();
  private services = new Map<string, Service>();
  private locations = new Map<string, Location>();
  private professionals = new Map<string, Professional>();
  private bookings = new Map<string, Booking>();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Categories
    const categories = [
      { id: "1", name: "Electrician", nameNepali: "बिजुली मिस्त्री", description: "Electrical services", icon: "zap" },
      { id: "2", name: "Plumber", nameNepali: "नल मिस्त्री", description: "Plumbing services", icon: "droplets" },
      { id: "3", name: "Cleaner", nameNepali: "सफाई कर्मचारी", description: "Cleaning services", icon: "spray-can" },
      { id: "4", name: "Carpenter", nameNepali: "काठ मिस्त्री", description: "Wood work", icon: "hammer" },
      { id: "5", name: "Painter", nameNepali: "रंग लगाउने", description: "Painting services", icon: "paint-brush" }
    ];
    categories.forEach(cat => this.categories.set(cat.id, cat));

    // Services
    const services = [
      { id: "1", categoryId: "1", name: "Electrical Installation", nameNepali: "बिजुली जडान", description: "Complete electrical installation", basePrice: "2500", unit: "service", estimatedDuration: 120 },
      { id: "2", categoryId: "1", name: "Switch & Socket Repair", nameNepali: "स्विच र सकेट मर्मत", description: "Switch and socket repair", basePrice: "800", unit: "piece", estimatedDuration: 30 },
      { id: "3", categoryId: "2", name: "Pipe Repair", nameNepali: "पाइप मर्मत", description: "Fix leaking pipes", basePrice: "1500", unit: "service", estimatedDuration: 90 },
      { id: "4", categoryId: "2", name: "Toilet Installation", nameNepali: "शौचालय जडान", description: "Install toilet systems", basePrice: "3500", unit: "service", estimatedDuration: 180 },
      { id: "5", categoryId: "3", name: "Deep House Cleaning", nameNepali: "घर सफाई", description: "Complete house cleaning", basePrice: "2000", unit: "house", estimatedDuration: 240 }
    ];
    services.forEach(svc => this.services.set(svc.id, svc));

    // Locations
    const locations = [
      { id: "1", name: "Kathmandu", nameNepali: "काठमाडौं" },
      { id: "2", name: "Lalitpur", nameNepali: "ललितपुर" },
      { id: "3", name: "Bhaktapur", nameNepali: "भक्तपुर" },
      { id: "4", name: "Pokhara", nameNepali: "पोखरा" },
      { id: "5", name: "Chitwan", nameNepali: "चितवन" }
    ];
    locations.forEach(loc => this.locations.set(loc.id, loc));

    // Test users
    const users = [
      { 
        id: "test-customer", 
        email: "test@example.com", 
        password: "$2b$10$K2EvdJpYU9G8QI3fA7.EzOTEWCZJvNs2VJqBBJDSKQKXKrYf/YNgC", // password123
        fullName: "Test Customer", 
        phone: "9801234567", 
        location: "Kathmandu", 
        userType: "customer" as const, 
        createdAt: new Date() 
      }
    ];
    users.forEach(user => this.users.set(user.id, user));

    // Professionals
    const professionals = [
      { 
        id: "1", 
        userId: "prof1", 
        bio: "Experienced electrician", 
        skills: ["Electrical Installation", "Switch & Socket Repair"], 
        experience: "10 years", 
        hourlyRate: "1500", 
        rating: "4.8", 
        totalJobs: 127, 
        serviceAreas: ["Kathmandu", "Lalitpur"], 
        createdAt: new Date() 
      }
    ];
    professionals.forEach(prof => this.professionals.set(prof.id, prof));

    console.log("Simple storage initialized with seed data");
  }

  // User methods
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: randomUUID(),
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  // Service methods
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  // Location methods
  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  // Professional methods
  async getProfessionals(): Promise<Professional[]> {
    return Array.from(this.professionals.values());
  }

  // Booking methods
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
    const booking: Booking = {
      ...bookingData,
      id: randomUUID(),
      status: "pending",
      createdAt: new Date()
    };
    this.bookings.set(booking.id, booking);
    console.log("Booking created:", booking);
    return booking;
  }

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  // Stats method
  async getStats() {
    const totalProfessionals = this.professionals.size;
    const totalBookings = this.bookings.size;
    const completedBookings = Array.from(this.bookings.values()).filter(b => b.status === "completed").length;
    
    return {
      professionals: `${totalProfessionals}+`,
      rating: "4.8/5",
      completedJobs: `${completedBookings}+`,
      happyCustomers: `${Math.max(completedBookings * 2, 50)}+`
    };
  }
}

export const simpleStorage = new SimpleStorage();