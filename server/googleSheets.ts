import { google } from 'googleapis';
import type { 
  ServiceCategory, 
  Service, 
  Location, 
  Professional, 
  User, 
  Booking,
  UpsertServiceCategory,
  UpsertService,
  UpsertLocation,
  UpsertProfessional,
  UpsertUser,
  UpsertBooking
} from '@shared/schema';

// Google Sheets configuration
const SPREADSHEET_ID = '1CuqYP9kyYUSszYVN3_ZJAjHV6rHnnONO_wJjBqPUzew';
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

// Initialize Google Sheets API
function getGoogleSheetsAuth() {
  return new google.auth.JWT(
    SERVICE_ACCOUNT_EMAIL,
    undefined,
    PRIVATE_KEY,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
}

const sheets = google.sheets('v4');

// Helper function to convert array to object
function arrayToObject(headers: string[], row: any[]): any {
  const obj: any = {};
  headers.forEach((header, index) => {
    obj[header] = row[index] || '';
  });
  return obj;
}

// Helper function to convert object to array
function objectToArray(headers: string[], obj: any): any[] {
  return headers.map(header => obj[header] || '');
}

export class GoogleSheetsStorage {
  private auth = getGoogleSheetsAuth();

  // Generic method to read sheet data
  private async readSheet(sheetName: string): Promise<any[]> {
    try {
      const response = await sheets.spreadsheets.values.get({
        auth: this.auth,
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) return [];

      const headers = rows[0];
      const data = rows.slice(1);
      
      return data.map(row => arrayToObject(headers, row));
    } catch (error) {
      console.error(`Error reading ${sheetName}:`, error);
      return [];
    }
  }

  // Generic method to write sheet data
  private async writeSheet(sheetName: string, headers: string[], data: any[]): Promise<void> {
    try {
      const values = [headers, ...data.map(item => objectToArray(headers, item))];
      
      await sheets.spreadsheets.values.update({
        auth: this.auth,
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'RAW',
        requestBody: { values },
      });
    } catch (error) {
      console.error(`Error writing ${sheetName}:`, error);
      throw error;
    }
  }

  // Generic method to append to sheet
  private async appendToSheet(sheetName: string, headers: string[], data: any): Promise<void> {
    try {
      const values = [objectToArray(headers, data)];
      
      await sheets.spreadsheets.values.append({
        auth: this.auth,
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'RAW',
        requestBody: { values },
      });
    } catch (error) {
      console.error(`Error appending to ${sheetName}:`, error);
      throw error;
    }
  }

  // Service Categories
  async getServiceCategories(): Promise<ServiceCategory[]> {
    const data = await this.readSheet('Categories');
    return data.map(row => ({
      id: row.id,
      name: row.name,
      nameNepali: row.nameNepali,
      description: row.description,
      icon: row.icon,
      color: row.color,
      isActive: row.isActive === 'TRUE',
      createdAt: new Date(row.createdAt || Date.now()),
      updatedAt: new Date(row.updatedAt || Date.now())
    }));
  }

  async upsertServiceCategory(category: UpsertServiceCategory): Promise<ServiceCategory> {
    const categories = await this.getServiceCategories();
    const existing = categories.find(c => c.id === category.id);
    
    const newCategory = {
      ...category,
      isActive: category.isActive ? 'TRUE' : 'FALSE',
      createdAt: existing?.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existing) {
      // Update existing
      const updatedCategories = categories.map(c => c.id === category.id ? newCategory : c);
      await this.writeSheet('Categories', ['id', 'name', 'nameNepali', 'description', 'icon', 'color', 'isActive', 'createdAt', 'updatedAt'], updatedCategories);
    } else {
      // Add new
      await this.appendToSheet('Categories', ['id', 'name', 'nameNepali', 'description', 'icon', 'color', 'isActive', 'createdAt', 'updatedAt'], newCategory);
    }

    return {
      ...newCategory,
      isActive: category.isActive,
      createdAt: new Date(newCategory.createdAt),
      updatedAt: new Date(newCategory.updatedAt)
    };
  }

  // Services
  async getServices(): Promise<Service[]> {
    const data = await this.readSheet('Services');
    return data.map(row => ({
      id: row.id,
      categoryId: row.categoryId,
      name: row.name,
      nameNepali: row.nameNepali,
      description: row.description,
      basePrice: row.basePrice,
      unit: row.unit,
      estimatedDuration: parseInt(row.estimatedDuration) || 60,
      isActive: row.isActive === 'TRUE',
      createdAt: new Date(row.createdAt || Date.now()),
      updatedAt: new Date(row.updatedAt || Date.now())
    }));
  }

  async upsertService(service: UpsertService): Promise<Service> {
    const services = await this.getServices();
    const existing = services.find(s => s.id === service.id);
    
    const newService = {
      ...service,
      isActive: service.isActive ? 'TRUE' : 'FALSE',
      createdAt: existing?.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existing) {
      const updatedServices = services.map(s => s.id === service.id ? newService : s);
      await this.writeSheet('Services', ['id', 'categoryId', 'name', 'nameNepali', 'description', 'basePrice', 'unit', 'estimatedDuration', 'isActive', 'createdAt', 'updatedAt'], updatedServices);
    } else {
      await this.appendToSheet('Services', ['id', 'categoryId', 'name', 'nameNepali', 'description', 'basePrice', 'unit', 'estimatedDuration', 'isActive', 'createdAt', 'updatedAt'], newService);
    }

    return {
      ...newService,
      isActive: service.isActive,
      estimatedDuration: parseInt(service.estimatedDuration?.toString()) || 60,
      createdAt: new Date(newService.createdAt),
      updatedAt: new Date(newService.updatedAt)
    };
  }

  // Locations
  async getLocations(): Promise<Location[]> {
    const data = await this.readSheet('Locations');
    return data.map(row => ({
      id: row.id,
      name: row.name,
      nameNepali: row.nameNepali,
      type: row.type,
      parentId: row.parentId || null,
      isServiceable: row.isServiceable === 'TRUE',
      createdAt: new Date(row.createdAt || Date.now()),
      updatedAt: new Date(row.updatedAt || Date.now())
    }));
  }

  async upsertLocation(location: UpsertLocation): Promise<Location> {
    const locations = await this.getLocations();
    const existing = locations.find(l => l.id === location.id);
    
    const newLocation = {
      ...location,
      isServiceable: location.isServiceable ? 'TRUE' : 'FALSE',
      createdAt: existing?.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existing) {
      const updatedLocations = locations.map(l => l.id === location.id ? newLocation : l);
      await this.writeSheet('Locations', ['id', 'name', 'nameNepali', 'type', 'parentId', 'isServiceable', 'createdAt', 'updatedAt'], updatedLocations);
    } else {
      await this.appendToSheet('Locations', ['id', 'name', 'nameNepali', 'type', 'parentId', 'isServiceable', 'createdAt', 'updatedAt'], newLocation);
    }

    return {
      ...newLocation,
      isServiceable: location.isServiceable,
      createdAt: new Date(newLocation.createdAt),
      updatedAt: new Date(newLocation.updatedAt)
    };
  }

  // Users
  async getUsers(): Promise<User[]> {
    const data = await this.readSheet('Users');
    return data.map(row => ({
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.passwordHash,
      fullName: row.fullName,
      phone: row.phone,
      role: row.role,
      profilePicture: row.profilePicture || null,
      isVerified: row.isVerified === 'TRUE',
      createdAt: new Date(row.createdAt || Date.now()),
      updatedAt: new Date(row.updatedAt || Date.now())
    }));
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const users = await this.getUsers();
    const existing = users.find(u => u.id === user.id);
    
    const newUser = {
      ...user,
      isVerified: user.isVerified ? 'TRUE' : 'FALSE',
      createdAt: existing?.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existing) {
      const updatedUsers = users.map(u => u.id === user.id ? newUser : u);
      await this.writeSheet('Users', ['id', 'username', 'email', 'passwordHash', 'fullName', 'phone', 'role', 'profilePicture', 'isVerified', 'createdAt', 'updatedAt'], updatedUsers);
    } else {
      await this.appendToSheet('Users', ['id', 'username', 'email', 'passwordHash', 'fullName', 'phone', 'role', 'profilePicture', 'isVerified', 'createdAt', 'updatedAt'], newUser);
    }

    return {
      ...newUser,
      isVerified: user.isVerified,
      createdAt: new Date(newUser.createdAt),
      updatedAt: new Date(newUser.updatedAt)
    };
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    const data = await this.readSheet('Bookings');
    return data.map(row => ({
      id: row.id,
      customerId: row.customerId,
      professionalId: row.professionalId || null,
      serviceId: row.serviceId,
      location: row.location,
      address: row.address,
      coordinates: row.coordinates || null,
      scheduledDate: new Date(row.scheduledDate),
      estimatedPrice: row.estimatedPrice,
      finalPrice: row.finalPrice || null,
      status: row.status,
      description: row.description || null,
      specialRequirements: row.specialRequirements || null,
      paymentMethod: row.paymentMethod,
      paymentStatus: row.paymentStatus,
      customerNotes: row.customerNotes || null,
      professionalNotes: row.professionalNotes || null,
      createdAt: new Date(row.createdAt || Date.now()),
      updatedAt: new Date(row.updatedAt || Date.now())
    }));
  }

  async upsertBooking(booking: UpsertBooking): Promise<Booking> {
    const bookings = await this.getBookings();
    const existing = bookings.find(b => b.id === booking.id);
    
    const newBooking = {
      ...booking,
      scheduledDate: booking.scheduledDate?.toISOString() || new Date().toISOString(),
      createdAt: existing?.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existing) {
      const updatedBookings = bookings.map(b => b.id === booking.id ? newBooking : b);
      await this.writeSheet('Bookings', [
        'id', 'customerId', 'professionalId', 'serviceId', 'location', 'address', 'coordinates', 
        'scheduledDate', 'estimatedPrice', 'finalPrice', 'status', 'description', 'specialRequirements',
        'paymentMethod', 'paymentStatus', 'customerNotes', 'professionalNotes', 'createdAt', 'updatedAt'
      ], updatedBookings);
    } else {
      await this.appendToSheet('Bookings', [
        'id', 'customerId', 'professionalId', 'serviceId', 'location', 'address', 'coordinates', 
        'scheduledDate', 'estimatedPrice', 'finalPrice', 'status', 'description', 'specialRequirements',
        'paymentMethod', 'paymentStatus', 'customerNotes', 'professionalNotes', 'createdAt', 'updatedAt'
      ], newBooking);
    }

    return {
      ...newBooking,
      scheduledDate: new Date(newBooking.scheduledDate),
      createdAt: new Date(newBooking.createdAt),
      updatedAt: new Date(newBooking.updatedAt)
    };
  }

  // Additional methods
  async getService(id: string): Promise<Service | undefined> {
    const services = await this.getServices();
    return services.find(s => s.id === id);
  }

  async getUser(id: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(u => u.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(u => u.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(u => u.username === username);
  }

  async getProfessionals(): Promise<Professional[]> {
    const data = await this.readSheet('Professionals');
    return data.map(row => ({
      id: row.id,
      userId: row.userId,
      locationId: row.locationId,
      skills: row.skills ? row.skills.split(',').map((s: string) => s.trim()) : [],
      experience: row.experience,
      rating: parseFloat(row.rating) || 0,
      hourlyRate: row.hourlyRate,
      isAvailable: row.isAvailable === 'TRUE',
      isVerified: row.isVerified === 'TRUE',
      createdAt: new Date(row.createdAt || Date.now()),
      updatedAt: new Date(row.updatedAt || Date.now())
    }));
  }

  async upsertProfessional(professional: UpsertProfessional): Promise<Professional> {
    const professionals = await this.getProfessionals();
    const existing = professionals.find(p => p.id === professional.id);
    
    const newProfessional = {
      ...professional,
      skills: professional.skills.join(','),
      isAvailable: professional.isAvailable ? 'TRUE' : 'FALSE',
      isVerified: professional.isVerified ? 'TRUE' : 'FALSE',
      createdAt: existing?.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existing) {
      const updatedProfessionals = professionals.map(p => p.id === professional.id ? newProfessional : p);
      await this.writeSheet('Professionals', ['id', 'userId', 'locationId', 'skills', 'experience', 'rating', 'hourlyRate', 'isAvailable', 'isVerified', 'createdAt', 'updatedAt'], updatedProfessionals);
    } else {
      await this.appendToSheet('Professionals', ['id', 'userId', 'locationId', 'skills', 'experience', 'rating', 'hourlyRate', 'isAvailable', 'isVerified', 'createdAt', 'updatedAt'], newProfessional);
    }

    return {
      ...newProfessional,
      skills: professional.skills,
      isAvailable: professional.isAvailable,
      isVerified: professional.isVerified,
      rating: professional.rating,
      createdAt: new Date(newProfessional.createdAt),
      updatedAt: new Date(newProfessional.updatedAt)
    };
  }
}