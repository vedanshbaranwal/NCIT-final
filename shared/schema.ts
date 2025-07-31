import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role", { enum: ["customer", "professional", "admin"] }).notNull().default("customer"),
  profilePicture: text("profile_picture"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const serviceCategories = pgTable("service_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameNepali: text("name_nepali").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => serviceCategories.id),
  name: text("name").notNull(),
  nameNepali: text("name_nepali"),
  description: text("description").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // "hour", "fixed", "sq_ft", etc.
  estimatedDuration: integer("estimated_duration"), // in minutes
  isActive: boolean("is_active").notNull().default(true),
});

export const professionals = pgTable("professionals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  bio: text("bio"),
  experience: integer("experience"), // years
  skills: jsonb("skills").$type<string[]>().notNull(),
  serviceAreas: jsonb("service_areas").$type<string[]>().notNull(), // locations they serve
  hourlyRate: decimal("hourly_rate", { precision: 8, scale: 2 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalJobs: integer("total_jobs").notNull().default(0),
  isVerified: boolean("is_verified").notNull().default(false),
  availabilityStatus: text("availability_status", { enum: ["available", "busy", "offline"] }).notNull().default("available"),
  documents: jsonb("documents").$type<{ type: string; url: string; verified: boolean }[]>(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  professionalId: varchar("professional_id").references(() => professionals.id),
  serviceId: varchar("service_id").notNull().references(() => services.id),
  location: text("location").notNull(),
  address: text("address").notNull(),
  coordinates: jsonb("coordinates").$type<{ lat: number; lng: number }>(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  estimatedPrice: decimal("estimated_price", { precision: 10, scale: 2 }).notNull(),
  finalPrice: decimal("final_price", { precision: 10, scale: 2 }),
  status: text("status", { 
    enum: ["pending", "assigned", "confirmed", "in_progress", "completed", "cancelled", "refunded"] 
  }).notNull().default("pending"),
  description: text("description"),
  specialRequirements: text("special_requirements"),
  paymentMethod: text("payment_method", { enum: ["cash", "online", "card"] }).notNull(),
  paymentStatus: text("payment_status", { enum: ["pending", "paid", "refunded"] }).notNull().default("pending"),
  customerNotes: text("customer_notes"),
  professionalNotes: text("professional_notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  professionalId: varchar("professional_id").notNull().references(() => professionals.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  response: text("response"), // professional's response
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameNepali: text("name_nepali").notNull(),
  type: text("type", { enum: ["city", "district", "zone"] }).notNull(),
  parentId: varchar("parent_id").references(() => locations.id),
  isServiceable: boolean("is_serviceable").notNull().default(true),
});

export const contactRequests = pgTable("contact_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: ["new", "in_progress", "resolved"] }).notNull().default("new"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const appNotifications = pgTable("app_notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Schema exports for forms
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProfessionalSchema = createInsertSchema(professionals).omit({
  id: true,
  createdAt: true,
  rating: true,
  totalJobs: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  professionalId: true,
  finalPrice: true,
  status: true,
  paymentStatus: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  isVerified: true,
});

export const insertContactRequestSchema = createInsertSchema(contactRequests).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(appNotifications).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Professional = typeof professionals.$inferSelect;
export type InsertProfessional = z.infer<typeof insertProfessionalSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Location = typeof locations.$inferSelect;
export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;
export type AppNotification = typeof appNotifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Static data exports
const locationData: Location[] = [
  { id: "1", name: "Kathmandu", nameNepali: "काठमाडौं", type: "city", parentId: null, isServiceable: true },
  { id: "2", name: "Lalitpur", nameNepali: "ललितपुर", type: "city", parentId: null, isServiceable: true },
  { id: "3", name: "Bhaktapur", nameNepali: "भक्तपुर", type: "city", parentId: null, isServiceable: true },
  { id: "4", name: "Pokhara", nameNepali: "पोखरा", type: "city", parentId: null, isServiceable: false }
];

export function getNepalLocations(): Location[] {
  return locationData;
}
