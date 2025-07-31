import { db } from "./db";
import { serviceCategories, services, locations, professionals, users } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  try {
    // Check if data already exists to avoid re-seeding
    const existingCategories = await db.select().from(serviceCategories).limit(1);
    if (existingCategories.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Seed service categories with comprehensive data
    const categoriesData = [
      { id: "1", name: "Electrician", nameNepali: "बिजुली मिस्त्री", description: "Electrical repairs, wiring, and installations", icon: "fas fa-bolt", color: "yellow", isActive: true },
      { id: "2", name: "Plumber", nameNepali: "प्लम्बर", description: "Pipe repairs, bathroom fittings, and water systems", icon: "fas fa-wrench", color: "blue", isActive: true },
      { id: "3", name: "House Cleaning", nameNepali: "घर सफाई", description: "Deep cleaning, regular cleaning, and sanitization", icon: "fas fa-broom", color: "green", isActive: true },
      { id: "4", name: "AC Repair", nameNepali: "ए.सी. मर्मत", description: "AC service, repair, and installation", icon: "fas fa-snowflake", color: "cyan", isActive: true },
      { id: "5", name: "Carpenter", nameNepali: "सुतारी", description: "Furniture making, repairs, and woodwork", icon: "fas fa-hammer", color: "amber", isActive: true },
      { id: "6", name: "Painting", nameNepali: "रंगाई", description: "Interior and exterior painting services", icon: "fas fa-paint-roller", color: "purple", isActive: true },
      { id: "7", name: "Appliance Repair", nameNepali: "उपकरण मर्मत", description: "TV, washing machine, and appliance repairs", icon: "fas fa-tools", color: "red", isActive: true },
      { id: "8", name: "Pest Control", nameNepali: "कीरा नियन्त्रण", description: "Safe and effective pest control services", icon: "fas fa-bug", color: "teal", isActive: true },
      { id: "9", name: "Gardening", nameNepali: "बगैंचा", description: "Garden maintenance and landscaping", icon: "fas fa-leaf", color: "emerald", isActive: true },
      { id: "10", name: "Security Guard", nameNepali: "सुरक्षा गार्ड", description: "Professional security services", icon: "fas fa-shield-alt", color: "gray", isActive: true },
    ];

    await db.insert(serviceCategories).values(categoriesData).onConflictDoNothing();

    // Seed services with detailed pricing
    const servicesData = [
      // Electrician Services
      { id: "1", categoryId: "1", name: "Electrical Wiring", nameNepali: "बिजुली तार", description: "Complete house wiring and rewiring", basePrice: "800.00", unit: "hour", estimatedDuration: 120, isActive: true },
      { id: "2", categoryId: "1", name: "Switch & Socket Installation", nameNepali: "स्विच र सकेट", description: "Install switches, sockets, and electrical outlets", basePrice: "300.00", unit: "fixed", estimatedDuration: 30, isActive: true },
      { id: "3", categoryId: "1", name: "Fan Installation", nameNepali: "पंखा जडान", description: "Ceiling fan installation and repair", basePrice: "500.00", unit: "fixed", estimatedDuration: 45, isActive: true },
      
      // Plumber Services
      { id: "4", categoryId: "2", name: "Pipe Repair", nameNepali: "पाइप मर्मत", description: "Fix leaky pipes and water lines", basePrice: "600.00", unit: "hour", estimatedDuration: 60, isActive: true },
      { id: "5", categoryId: "2", name: "Bathroom Fitting", nameNepali: "बाथरुम फिटिंग", description: "Complete bathroom fixtures installation", basePrice: "1500.00", unit: "fixed", estimatedDuration: 180, isActive: true },
      { id: "6", categoryId: "2", name: "Tap & Faucet Repair", nameNepali: "धारा मर्मत", description: "Fix and replace taps and faucets", basePrice: "400.00", unit: "fixed", estimatedDuration: 30, isActive: true },
      
      // Cleaning Services
      { id: "7", categoryId: "3", name: "Deep House Cleaning", nameNepali: "गहिरो सफाई", description: "Complete house deep cleaning service", basePrice: "1200.00", unit: "fixed", estimatedDuration: 240, isActive: true },
      { id: "8", categoryId: "3", name: "Regular Cleaning", nameNepali: "नियमित सफाई", description: "Daily or weekly house cleaning", basePrice: "800.00", unit: "fixed", estimatedDuration: 120, isActive: true },
      
      // AC Services
      { id: "9", categoryId: "4", name: "AC Service & Cleaning", nameNepali: "ए.सी. सेवा", description: "AC cleaning and maintenance", basePrice: "1500.00", unit: "fixed", estimatedDuration: 90, isActive: true },
      { id: "10", categoryId: "4", name: "AC Installation", nameNepali: "ए.सी. जडान", description: "New AC installation service", basePrice: "2500.00", unit: "fixed", estimatedDuration: 180, isActive: true },
      
      // Carpenter Services
      { id: "11", categoryId: "5", name: "Furniture Repair", nameNepali: "फर्निचर मर्मत", description: "Repair and restore furniture", basePrice: "700.00", unit: "hour", estimatedDuration: 90, isActive: true },
      { id: "12", categoryId: "5", name: "Custom Furniture", nameNepali: "कस्टम फर्निचर", description: "Make custom furniture pieces", basePrice: "1000.00", unit: "hour", estimatedDuration: 360, isActive: true },
      
      // Other services
      { id: "13", categoryId: "6", name: "Interior Painting", nameNepali: "भित्री रंगाई", description: "Interior wall painting", basePrice: "400.00", unit: "sq_ft", estimatedDuration: 480, isActive: true },
      { id: "14", categoryId: "7", name: "TV Repair", nameNepali: "टि.भी. मर्मत", description: "Television and electronics repair", basePrice: "800.00", unit: "fixed", estimatedDuration: 75, isActive: true },
      { id: "15", categoryId: "8", name: "Home Pest Control", nameNepali: "घर कीरा नियन्त्रण", description: "Complete home pest control treatment", basePrice: "1200.00", unit: "fixed", estimatedDuration: 120, isActive: true },
    ];

    await db.insert(services).values(servicesData).onConflictDoNothing();

    // Seed locations with major Nepali cities
    const locationsData = [
      { id: "1", name: "Kathmandu", nameNepali: "काठमाडौं", type: "city" as const, parentId: null, isServiceable: true },
      { id: "2", name: "Pokhara", nameNepali: "पोखरा", type: "city" as const, parentId: null, isServiceable: true },
      { id: "3", name: "Lalitpur", nameNepali: "ललितपुर", type: "city" as const, parentId: null, isServiceable: true },
      { id: "4", name: "Bhaktapur", nameNepali: "भक्तपुर", type: "city" as const, parentId: null, isServiceable: true },
      { id: "5", name: "Chitwan", nameNepali: "चितवन", type: "city" as const, parentId: null, isServiceable: true },
      { id: "6", name: "Butwal", nameNepali: "बुटवल", type: "city" as const, parentId: null, isServiceable: true },
      { id: "7", name: "Biratnagar", nameNepali: "विराटनगर", type: "city" as const, parentId: null, isServiceable: true },
      { id: "8", name: "Birgunj", nameNepali: "वीरगंज", type: "city" as const, parentId: null, isServiceable: true },
    ];

    await db.insert(locations).values(locationsData).onConflictDoNothing();

    // Create sample professional users first
    const professionalUsers = [
      { id: "prof1", username: "ram_electrician", email: "ram@example.com", password: "password123", fullName: "Ram Bahadur Thapa", phone: "9841234567", role: "professional" as const, isVerified: true },
      { id: "prof2", username: "sita_cleaner", email: "sita@example.com", password: "password123", fullName: "Sita Kumari Shrestha", phone: "9841234568", role: "professional" as const, isVerified: true },
      { id: "prof3", username: "hari_plumber", email: "hari@example.com", password: "password123", fullName: "Hari Prasad Sharma", phone: "9841234569", role: "professional" as const, isVerified: true },
    ];

    await db.insert(users).values(professionalUsers).onConflictDoNothing();

    // Seed sample professionals
    const professionalsData = [
      {
        id: "1",
        userId: "prof1", 
        bio: "Experienced electrician with 10+ years in residential and commercial projects",
        skills: ["Electrical Wiring", "Switch Installation", "Fan Installation"],
        experience: 10,
        hourlyRate: "800.00",
        availability: "full_time" as const,
        serviceAreas: ["Kathmandu", "Lalitpur", "Bhaktapur"],
        rating: 4.8,
        completedJobs: 156,
        isVerified: true,
        availabilityStatus: "available" as const
      },
      {
        id: "2", 
        userId: "prof2",
        bio: "Professional house cleaning service with eco-friendly products",
        skills: ["Deep Cleaning", "Regular Cleaning", "Sanitization"],
        experience: 5,
        hourlyRate: "600.00",
        availability: "part_time" as const,
        serviceAreas: ["Kathmandu", "Lalitpur"],
        rating: 4.9,
        completedJobs: 89,
        isVerified: true,
        availabilityStatus: "available" as const
      },
      {
        id: "3",
        userId: "prof3", 
        bio: "Expert plumber specializing in modern bathroom fittings and repairs",
        skills: ["Pipe Repair", "Bathroom Fitting", "Tap Repair"],
        experience: 8,
        hourlyRate: "750.00",
        availability: "full_time" as const,
        serviceAreas: ["Kathmandu", "Pokhara"],
        rating: 4.7,
        completedJobs: 124,
        isVerified: true,
        availabilityStatus: "available" as const
      }
    ];

    await db.insert(professionals).values(professionalsData).onConflictDoNothing();

    console.log("Database seeded successfully with comprehensive data!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}