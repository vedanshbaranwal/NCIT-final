import express from "express";
import bcrypt from "bcrypt";
import { simpleStorage } from "./simple-storage";
import "./types"; // Import session types

const router = express.Router();

// Auth routes
router.post("/auth/register", async (req, res) => {
  try {
    const { email, password, fullName, phone, location, userType } = req.body;
    
    // Check if user exists
    const existingUser = await simpleStorage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await simpleStorage.createUser({
      email,
      password: hashedPassword,
      fullName,
      phone,
      location,
      userType: userType || "customer"
    });

    // Set session
    req.session.userId = user.id;
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await simpleStorage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Set session
    req.session.userId = user.id;
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

router.get("/auth/user", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await simpleStorage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ message: "Authentication check failed" });
  }
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Data routes
router.get("/categories", async (req, res) => {
  try {
    const categories = await simpleStorage.getCategories();
    res.json(categories);
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

router.get("/services", async (req, res) => {
  try {
    const services = await simpleStorage.getServices();
    res.json(services);
  } catch (error) {
    console.error("Services error:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

router.get("/services/:id", async (req, res) => {
  try {
    const service = await simpleStorage.getService(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    console.error("Service error:", error);
    res.status(500).json({ message: "Failed to fetch service" });
  }
});

router.get("/locations", async (req, res) => {
  try {
    const locations = await simpleStorage.getLocations();
    res.json(locations);
  } catch (error) {
    console.error("Locations error:", error);
    res.status(500).json({ message: "Failed to fetch locations" });
  }
});

router.get("/professionals", async (req, res) => {
  try {
    const professionals = await simpleStorage.getProfessionals();
    res.json(professionals);
  } catch (error) {
    console.error("Professionals error:", error);
    res.status(500).json({ message: "Failed to fetch professionals" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const stats = await simpleStorage.getStats();
    res.json(stats);
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// Booking routes
router.post("/bookings", async (req, res) => {
  try {
    const {
      serviceId,
      customerName,
      customerEmail,
      customerPhone,
      customerLocation,
      scheduledDate,
      estimatedPrice,
      paymentMethod,
      specialRequests
    } = req.body;

    console.log("Creating booking with data:", req.body);

    // Create booking
    const booking = await simpleStorage.createBooking({
      serviceId,
      customerId: req.session.userId, // Optional - can be undefined for guest bookings
      customerName,
      customerEmail,
      customerPhone,
      customerLocation,
      scheduledDate: new Date(scheduledDate),
      estimatedPrice,
      paymentMethod,
      specialRequests
    });

    console.log("Booking created successfully:", booking.id);
    res.status(201).json(booking);
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
});

router.get("/bookings", async (req, res) => {
  try {
    const bookings = await simpleStorage.getBookings();
    res.json(bookings);
  } catch (error) {
    console.error("Bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

router.get("/bookings/:id", async (req, res) => {
  try {
    const booking = await simpleStorage.getBooking(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
});

export default router;