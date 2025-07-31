import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertProfessionalSchema, 
  insertBookingSchema, 
  insertReviewSchema,
  insertContactRequestSchema,
  insertNotificationSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }
      
      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(409).json({ message: "Username already taken" });
      }
      
      const user = await storage.createUser(validatedData);
      
      // Store user session
      (req.session as any).userId = user.id;
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error: error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Store user session
      (req.session as any).userId = user.id;
      
      // Don't return password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Service Categories Routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getServiceCategories();
      res.json(categories.filter(cat => cat.isActive));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service categories" });
    }
  });

  // Services Routes
  app.get("/api/services", async (req, res) => {
    try {
      const { categoryId } = req.query;
      const services = categoryId 
        ? await storage.getServicesByCategory(categoryId as string)
        : await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  // Professionals Routes
  app.get("/api/professionals", async (req, res) => {
    try {
      const { serviceId, location } = req.query;
      let professionals;
      
      if (serviceId) {
        professionals = await storage.getProfessionalsByService(serviceId as string);
      } else if (location) {
        professionals = await storage.getProfessionalsByLocation(location as string);
      } else {
        professionals = await storage.getProfessionals();
      }
      
      res.json(professionals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch professionals" });
    }
  });

  app.post("/api/professionals", async (req, res) => {
    try {
      const validatedData = insertProfessionalSchema.parse(req.body);
      const professional = await storage.createProfessional(validatedData);
      res.status(201).json(professional);
    } catch (error) {
      res.status(400).json({ message: "Invalid professional data", error: error });
    }
  });

  // Bookings Routes
  app.get("/api/bookings", async (req, res) => {
    try {
      const { customerId, professionalId } = req.query;
      let bookings;
      
      if (customerId) {
        bookings = await storage.getBookingsByCustomer(customerId as string);
      } else if (professionalId) {
        bookings = await storage.getBookingsByProfessional(professionalId as string);
      } else {
        bookings = await storage.getBookings();
      }
      
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = req.body;
      
      // Get service to calculate price
      const service = await storage.getService(bookingData.serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      // Set estimated price if not provided
      if (!bookingData.estimatedPrice) {
        bookingData.estimatedPrice = service.basePrice;
      }
      
      // Convert scheduledDate string to Date object if needed
      if (typeof bookingData.scheduledDate === 'string') {
        const parsedDate = new Date(bookingData.scheduledDate);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({ message: "Invalid date format" });
        }
        bookingData.scheduledDate = parsedDate;
      }
      
      // Get current user or create guest user
      const userId = (req.session as any)?.userId;
      if (!bookingData.customerId) {
        if (userId) {
          bookingData.customerId = userId;
        } else {
          // Create a guest user
          const guestUser = await storage.createUser({
            username: `guest_${Date.now()}`,
            email: `guest_${Date.now()}@temp.com`,
            password: "temp_password",
            fullName: bookingData.address ? bookingData.address.split(',')[0] : "Guest User",
            role: "customer"
          });
          bookingData.customerId = guestUser.id;
        }
      }
      
      const validatedData = insertBookingSchema.parse(bookingData);
      const booking = await storage.createBooking(validatedData);
      
      // Auto-assign professional based on service and location
      const professionals = await storage.getProfessionalsByService(validatedData.serviceId);
      const localProfessionals = professionals.filter(prof => 
        prof.serviceAreas && prof.serviceAreas.some(area => 
          validatedData.location.toLowerCase().includes(area.toLowerCase())
        )
      );
      
      if (localProfessionals.length > 0) {
        // Simple assignment to first available professional
        // In production, this would be more sophisticated with matching algorithms
        const assignedProfessional = localProfessionals[0];
        await storage.updateBookingStatus(booking.id, "assigned");
      }
      
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: "Invalid booking data", error: error });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const booking = await storage.updateBookingStatus(req.params.id, status);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Reviews Routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const { professionalId } = req.query;
      const reviews = professionalId 
        ? await storage.getReviewsByProfessional(professionalId as string)
        : await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data", error: error });
    }
  });

  // Locations Routes
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getServiceableLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  // Users Routes
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }
      
      const user = await storage.createUser(validatedData);
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error: error });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Contact Routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactRequestSchema.parse(req.body);
      const contactRequest = await storage.createContactRequest(validatedData);
      res.status(201).json({ message: "Contact request submitted successfully", id: contactRequest.id });
    } catch (error) {
      res.status(400).json({ message: "Invalid contact data", error: error });
    }
  });

  // Notification Subscription Routes
  app.post("/api/notifications/subscribe", async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotificationSubscription(validatedData);
      res.status(201).json({ message: "Subscription successful", id: notification.id });
    } catch (error) {
      res.status(400).json({ message: "Invalid notification data", error: error });
    }
  });

  // Stats endpoint for trust indicators
  app.get("/api/stats", async (req, res) => {
    try {
      const professionals = await storage.getProfessionals();
      const bookings = await storage.getBookings();
      const reviews = await storage.getReviews();
      
      const verifiedProfessionals = professionals.filter(p => p.isVerified).length;
      const completedBookings = bookings.filter(b => b.status === "completed").length;
      const avgRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";
      
      res.json({
        professionals: `${verifiedProfessionals}+`,
        rating: `${avgRating}/5`,
        completedBookings: `${completedBookings}+`,
        support: "24/7"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
