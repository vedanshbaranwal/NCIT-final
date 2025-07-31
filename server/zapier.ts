import { db } from "./db";
import { bookings, users, professionals, services } from "@shared/schema";
import { eq } from "drizzle-orm";

// Zapier webhook endpoints for different triggers
export interface ZapierWebhookData {
  event: string;
  data: any;
  timestamp: string;
}

export class ZapierIntegration {
  private static webhookUrls = {
    newBooking: process.env.ZAPIER_NEW_BOOKING_WEBHOOK,
    bookingStatusUpdate: process.env.ZAPIER_BOOKING_STATUS_WEBHOOK,
    newUserRegistration: process.env.ZAPIER_NEW_USER_WEBHOOK,
    professionalAssignment: process.env.ZAPIER_PROFESSIONAL_ASSIGNMENT_WEBHOOK,
  };

  // Send new booking notification to Zapier
  static async notifyNewBooking(bookingId: string) {
    try {
      const [booking] = await db.select({
        booking: bookings,
        customer: users,
        service: services,
      })
      .from(bookings)
      .leftJoin(users, eq(bookings.customerId, users.id))
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .where(eq(bookings.id, bookingId));

      if (!booking) return;

      const webhookData: ZapierWebhookData = {
        event: "new_booking",
        data: {
          booking_id: booking.booking.id,
          customer_name: booking.customer?.fullName || "Guest",
          customer_phone: booking.customer?.phone || "N/A",
          customer_email: booking.customer?.email || "N/A",
          service_name: booking.service?.name || "Unknown Service",
          service_name_nepali: booking.service?.nameNepali || "",
          location: booking.booking.location,
          address: booking.booking.address,
          scheduled_date: booking.booking.scheduledDate,
          estimated_price: booking.booking.estimatedPrice,
          payment_method: booking.booking.paymentMethod,
          description: booking.booking.description,
          status: booking.booking.status,
        },
        timestamp: new Date().toISOString(),
      };

      if (this.webhookUrls.newBooking) {
        await this.sendWebhook(this.webhookUrls.newBooking, webhookData);
      }

      // Also prepare data for Google Sheets export
      return this.formatForGoogleSheets(webhookData.data);
    } catch (error) {
      console.error("Error notifying Zapier about new booking:", error);
    }
  }

  // Send booking status update notification
  static async notifyBookingStatusUpdate(bookingId: string, oldStatus: string, newStatus: string) {
    try {
      const [booking] = await db.select({
        booking: bookings,
        customer: users,
        professional: professionals,
        professionalUser: users,
        service: services,
      })
      .from(bookings)
      .leftJoin(users, eq(bookings.customerId, users.id))
      .leftJoin(professionals, eq(bookings.professionalId, professionals.id))
      .leftJoin(users.as("professionalUser"), eq(professionals.userId, users.id))
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .where(eq(bookings.id, bookingId));

      if (!booking) return;

      const webhookData: ZapierWebhookData = {
        event: "booking_status_update",
        data: {
          booking_id: booking.booking.id,
          old_status: oldStatus,
          new_status: newStatus,
          customer_name: booking.customer?.fullName || "Guest",
          customer_phone: booking.customer?.phone || "N/A",
          professional_name: booking.professionalUser?.fullName || "Not assigned",
          professional_phone: booking.professionalUser?.phone || "N/A",
          service_name: booking.service?.name || "Unknown Service",
          location: booking.booking.location,
          scheduled_date: booking.booking.scheduledDate,
        },
        timestamp: new Date().toISOString(),
      };

      if (this.webhookUrls.bookingStatusUpdate) {
        await this.sendWebhook(this.webhookUrls.bookingStatusUpdate, webhookData);
      }

      return webhookData.data;
    } catch (error) {
      console.error("Error notifying Zapier about booking status update:", error);
    }
  }

  // Send new user registration notification
  static async notifyNewUserRegistration(userId: string) {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) return;

      const webhookData: ZapierWebhookData = {
        event: "new_user_registration",
        data: {
          user_id: user.id,
          username: user.username,
          full_name: user.fullName,
          email: user.email,
          phone: user.phone || "N/A",
          role: user.role,
          registration_date: user.createdAt,
        },
        timestamp: new Date().toISOString(),
      };

      if (this.webhookUrls.newUserRegistration) {
        await this.sendWebhook(this.webhookUrls.newUserRegistration, webhookData);
      }

      return webhookData.data;
    } catch (error) {
      console.error("Error notifying Zapier about new user registration:", error);
    }
  }

  // Send professional assignment notification
  static async notifyProfessionalAssignment(bookingId: string, professionalId: string) {
    try {
      const [assignment] = await db.select({
        booking: bookings,
        customer: users,
        professional: professionals,
        professionalUser: users,
        service: services,
      })
      .from(bookings)
      .leftJoin(users, eq(bookings.customerId, users.id))
      .leftJoin(professionals, eq(bookings.professionalId, professionals.id))
      .leftJoin(users.as("professionalUser"), eq(professionals.userId, users.id))
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .where(eq(bookings.id, bookingId));

      if (!assignment) return;

      const webhookData: ZapierWebhookData = {
        event: "professional_assignment",
        data: {
          booking_id: assignment.booking.id,
          professional_id: professionalId,
          professional_name: assignment.professionalUser?.fullName || "Unknown",
          professional_phone: assignment.professionalUser?.phone || "N/A",
          customer_name: assignment.customer?.fullName || "Guest",
          customer_phone: assignment.customer?.phone || "N/A",
          service_name: assignment.service?.name || "Unknown Service",
          location: assignment.booking.location,
          address: assignment.booking.address,
          scheduled_date: assignment.booking.scheduledDate,
          estimated_price: assignment.booking.estimatedPrice,
        },
        timestamp: new Date().toISOString(),
      };

      if (this.webhookUrls.professionalAssignment) {
        await this.sendWebhook(this.webhookUrls.professionalAssignment, webhookData);
      }

      return webhookData.data;
    } catch (error) {
      console.error("Error notifying Zapier about professional assignment:", error);
    }
  }

  // Generic webhook sender
  private static async sendWebhook(url: string, data: ZapierWebhookData) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(`Zapier webhook failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error sending webhook to Zapier:", error);
    }
  }

  // Format data for Google Sheets export via Zapier
  private static formatForGoogleSheets(data: any) {
    return {
      // Flatten the data for easy Google Sheets insertion
      ...data,
      scheduled_date_formatted: new Date(data.scheduled_date).toLocaleDateString('en-US'),
      scheduled_time_formatted: new Date(data.scheduled_date).toLocaleTimeString('en-US'),
    };
  }

  // Get all bookings data for bulk export to Google Sheets
  static async getBookingsForExport() {
    try {
      const allBookings = await db.select({
        booking: bookings,
        customer: users,
        professional: professionals,
        professionalUser: users,
        service: services,
      })
      .from(bookings)
      .leftJoin(users, eq(bookings.customerId, users.id))
      .leftJoin(professionals, eq(bookings.professionalId, professionals.id))
      .leftJoin(users.as("professionalUser"), eq(professionals.userId, users.id))
      .leftJoin(services, eq(bookings.serviceId, services.id));

      return allBookings.map(booking => ({
        booking_id: booking.booking.id,
        customer_name: booking.customer?.fullName || "Guest",
        customer_phone: booking.customer?.phone || "N/A",
        customer_email: booking.customer?.email || "N/A",
        professional_name: booking.professionalUser?.fullName || "Not assigned",
        professional_phone: booking.professionalUser?.phone || "N/A",
        service_name: booking.service?.name || "Unknown Service",
        service_name_nepali: booking.service?.nameNepali || "",
        location: booking.booking.location,
        address: booking.booking.address,
        scheduled_date: booking.booking.scheduledDate,
        scheduled_date_formatted: new Date(booking.booking.scheduledDate).toLocaleDateString('en-US'),
        estimated_price: booking.booking.estimatedPrice,
        final_price: booking.booking.finalPrice || "Not set",
        status: booking.booking.status,
        payment_method: booking.booking.paymentMethod,
        payment_status: booking.booking.paymentStatus,
        created_date: booking.booking.createdAt,
        description: booking.booking.description || "",
      }));
    } catch (error) {
      console.error("Error getting bookings for export:", error);
      return [];
    }
  }
}