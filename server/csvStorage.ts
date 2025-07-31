// CSV-based storage that can easily export to Google Sheets
import fs from 'fs/promises';
import path from 'path';
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

const DATA_DIR = 'data';

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// CSV helper functions
function objectToCsvRow(obj: any, headers: string[]): string {
  return headers.map(header => {
    const value = obj[header];
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return `"${String(value).replace(/"/g, '""')}"`;
  }).join(',');
}

function csvRowToObject(row: string, headers: string[]): any {
  // Better CSV parsing that handles quoted commas
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"' && (i === 0 || row[i-1] === ',')) {
      inQuotes = true;
    } else if (char === '"' && inQuotes && (i === row.length - 1 || row[i+1] === ',')) {
      inQuotes = false;
    } else if (char === ',' && !inQuotes) {
      values.push(current.replace(/^"|"$/g, '').replace(/""/g, '"'));
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.replace(/^"|"$/g, '').replace(/""/g, '"'));
  
  const obj: any = {};
  headers.forEach((header, index) => {
    const value = values[index] || '';
    if (value === 'true') obj[header] = true;
    else if (value === 'false') obj[header] = false;
    else if (value === '') obj[header] = null;
    else if (value.startsWith('{') || value.startsWith('[')) {
      try { obj[header] = JSON.parse(value); } catch { obj[header] = value; }
    }
    else obj[header] = value;
  });
  return obj;
}

export class CSVStorage {
  private async readCsv<T>(filename: string, headers: string[]): Promise<T[]> {
    await ensureDataDir();
    const filepath = path.join(DATA_DIR, filename);
    
    try {
      const content = await fs.readFile(filepath, 'utf-8');
      const lines = content.trim().split('\n');
      if (lines.length <= 1) return [];
      
      return lines.slice(1).map(line => csvRowToObject(line, headers) as T);
    } catch {
      return [];
    }
  }

  private async writeCsv<T>(filename: string, headers: string[], data: T[]): Promise<void> {
    await ensureDataDir();
    const filepath = path.join(DATA_DIR, filename);
    
    const csvContent = [
      headers.join(','),
      ...data.map(item => objectToCsvRow(item, headers))
    ].join('\n');
    
    await fs.writeFile(filepath, csvContent, 'utf-8');
  }

  // Service Categories
  async getServiceCategories(): Promise<ServiceCategory[]> {
    const headers = ['id', 'name', 'nameNepali', 'description', 'icon', 'color', 'isActive', 'createdAt', 'updatedAt'];
    const data = await this.readCsv<any>('categories.csv', headers);
    return data.map(item => ({
      ...item,
      isActive: item.isActive === 'true',
      createdAt: new Date(item.createdAt || Date.now()),
      updatedAt: new Date(item.updatedAt || Date.now())
    }));
  }

  async getActiveServiceCategories(): Promise<ServiceCategory[]> {
    const categories = await this.getServiceCategories();
    return categories.filter(cat => cat.isActive);
  }

  async upsertServiceCategory(category: UpsertServiceCategory): Promise<ServiceCategory> {
    const categories = await this.getServiceCategories();
    const existing = categories.find(c => c.id === category.id);
    
    const newCategory = {
      ...category,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (existing) {
      const updated = categories.map(c => c.id === category.id ? newCategory : c);
      await this.writeCsv('categories.csv', ['id', 'name', 'nameNepali', 'description', 'icon', 'color', 'isActive', 'createdAt', 'updatedAt'], updated);
    } else {
      categories.push(newCategory);
      await this.writeCsv('categories.csv', ['id', 'name', 'nameNepali', 'description', 'icon', 'color', 'isActive', 'createdAt', 'updatedAt'], categories);
    }

    return newCategory;
  }

  // Services
  async getServices(): Promise<Service[]> {
    const headers = ['id', 'categoryId', 'name', 'nameNepali', 'description', 'basePrice', 'unit', 'estimatedDuration', 'isActive', 'createdAt', 'updatedAt'];
    const data = await this.readCsv<any>('services.csv', headers);
    return data.map(item => ({
      ...item,
      estimatedDuration: parseInt(item.estimatedDuration) || 60,
      isActive: item.isActive === 'true',
      createdAt: new Date(item.createdAt || Date.now()),
      updatedAt: new Date(item.updatedAt || Date.now())
    }));
  }

  async upsertService(service: UpsertService): Promise<Service> {
    const services = await this.getServices();
    const existing = services.find(s => s.id === service.id);
    
    const newService = {
      ...service,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (existing) {
      const updated = services.map(s => s.id === service.id ? newService : s);
      await this.writeCsv('services.csv', ['id', 'categoryId', 'name', 'nameNepali', 'description', 'basePrice', 'unit', 'estimatedDuration', 'isActive', 'createdAt', 'updatedAt'], updated);
    } else {
      services.push(newService);
      await this.writeCsv('services.csv', ['id', 'categoryId', 'name', 'nameNepali', 'description', 'basePrice', 'unit', 'estimatedDuration', 'isActive', 'createdAt', 'updatedAt'], services);
    }

    return newService;
  }

  // Locations
  async getLocations(): Promise<Location[]> {
    const headers = ['id', 'name', 'nameNepali', 'type', 'parentId', 'isServiceable', 'createdAt', 'updatedAt'];
    const data = await this.readCsv<any>('locations.csv', headers);
    return data.map(item => ({
      ...item,
      isServiceable: item.isServiceable === 'true',
      createdAt: new Date(item.createdAt || Date.now()),
      updatedAt: new Date(item.updatedAt || Date.now())
    }));
  }

  async upsertLocation(location: UpsertLocation): Promise<Location> {
    const locations = await this.getLocations();
    const existing = locations.find(l => l.id === location.id);
    
    const newLocation = {
      ...location,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (existing) {
      const updated = locations.map(l => l.id === location.id ? newLocation : l);
      await this.writeCsv('locations.csv', ['id', 'name', 'nameNepali', 'type', 'parentId', 'isServiceable', 'createdAt', 'updatedAt'], updated);
    } else {
      locations.push(newLocation);
      await this.writeCsv('locations.csv', ['id', 'name', 'nameNepali', 'type', 'parentId', 'isServiceable', 'createdAt', 'updatedAt'], locations);
    }

    return newLocation;
  }

  // Users
  async getUsers(): Promise<User[]> {
    const headers = ['id', 'username', 'email', 'passwordHash', 'fullName', 'phone', 'role', 'profilePicture', 'isVerified', 'createdAt', 'updatedAt'];
    const data = await this.readCsv<any>('users.csv', headers);
    return data.map(item => ({
      ...item,
      isVerified: item.isVerified === 'true',
      createdAt: new Date(item.createdAt || Date.now()),
      updatedAt: new Date(item.updatedAt || Date.now())
    }));
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const users = await this.getUsers();
    const existing = users.find(u => u.id === user.id);
    
    const newUser = {
      ...user,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (existing) {
      const updated = users.map(u => u.id === user.id ? newUser : u);
      await this.writeCsv('users.csv', ['id', 'username', 'email', 'passwordHash', 'fullName', 'phone', 'role', 'profilePicture', 'isVerified', 'createdAt', 'updatedAt'], updated);
    } else {
      users.push(newUser);
      await this.writeCsv('users.csv', ['id', 'username', 'email', 'passwordHash', 'fullName', 'phone', 'role', 'profilePicture', 'isVerified', 'createdAt', 'updatedAt'], users);
    }

    return newUser;
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    const headers = ['id', 'customerId', 'professionalId', 'serviceId', 'location', 'address', 'coordinates', 'scheduledDate', 'estimatedPrice', 'finalPrice', 'status', 'description', 'specialRequirements', 'paymentMethod', 'paymentStatus', 'customerNotes', 'professionalNotes', 'createdAt', 'updatedAt'];
    const data = await this.readCsv<any>('bookings.csv', headers);
    return data.map(item => ({
      ...item,
      scheduledDate: new Date(item.scheduledDate),
      createdAt: new Date(item.createdAt || Date.now()),
      updatedAt: new Date(item.updatedAt || Date.now())
    }));
  }

  async upsertBooking(booking: UpsertBooking): Promise<Booking> {
    const bookings = await this.getBookings();
    const existing = bookings.find(b => b.id === booking.id);
    
    const newBooking = {
      ...booking,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (existing) {
      const updated = bookings.map(b => b.id === booking.id ? newBooking : b);
      await this.writeCsv('bookings.csv', ['id', 'customerId', 'professionalId', 'serviceId', 'location', 'address', 'coordinates', 'scheduledDate', 'estimatedPrice', 'finalPrice', 'status', 'description', 'specialRequirements', 'paymentMethod', 'paymentStatus', 'customerNotes', 'professionalNotes', 'createdAt', 'updatedAt'], updated);
    } else {
      bookings.push(newBooking);
      await this.writeCsv('bookings.csv', ['id', 'customerId', 'professionalId', 'serviceId', 'location', 'address', 'coordinates', 'scheduledDate', 'estimatedPrice', 'finalPrice', 'status', 'description', 'specialRequirements', 'paymentMethod', 'paymentStatus', 'customerNotes', 'professionalNotes', 'createdAt', 'updatedAt'], bookings);
    }

    return newBooking;
  }

  // Additional methods for compatibility
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
    return []; // Placeholder for now
  }

  async upsertProfessional(professional: UpsertProfessional): Promise<Professional> {
    return professional as any; // Placeholder for now
  }

  // Export all data to CSV files that can be imported to Google Sheets
  async exportAllToCSV(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportDir = `export-${timestamp}`;
    
    await fs.mkdir(exportDir, { recursive: true });
    
    const categories = await this.getServiceCategories();
    const services = await this.getServices();
    const locations = await this.getLocations();
    const users = await this.getUsers();
    const bookings = await this.getBookings();
    
    await Promise.all([
      this.writeCsv(`${exportDir}/categories.csv`, ['id', 'name', 'nameNepali', 'description', 'icon', 'color', 'isActive', 'createdAt', 'updatedAt'], categories),
      this.writeCsv(`${exportDir}/services.csv`, ['id', 'categoryId', 'name', 'nameNepali', 'description', 'basePrice', 'unit', 'estimatedDuration', 'isActive', 'createdAt', 'updatedAt'], services),
      this.writeCsv(`${exportDir}/locations.csv`, ['id', 'name', 'nameNepali', 'type', 'parentId', 'isServiceable', 'createdAt', 'updatedAt'], locations),
      this.writeCsv(`${exportDir}/users.csv`, ['id', 'username', 'email', 'fullName', 'phone', 'role', 'isVerified', 'createdAt', 'updatedAt'], users.map(u => ({ ...u, passwordHash: undefined }))),
      this.writeCsv(`${exportDir}/bookings.csv`, ['id', 'customerId', 'professionalId', 'serviceId', 'location', 'address', 'scheduledDate', 'estimatedPrice', 'finalPrice', 'status', 'description', 'paymentMethod', 'paymentStatus', 'createdAt', 'updatedAt'], bookings)
    ]);
    
    return exportDir;
  }
}