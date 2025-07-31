import * as XLSX from 'xlsx';
import { storage } from './storage';

// Export all data to Excel format
export async function exportDataToExcel() {
  try {
    // Get all data from storage
    const [categories, services, locations, professionals, users, bookings] = await Promise.all([
      storage.getServiceCategories(),
      storage.getServices(),
      storage.getLocations(),
      storage.getProfessionals(),
      storage.getUsers(),
      storage.getBookings()
    ]);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Service Categories sheet
    const categoriesSheet = XLSX.utils.json_to_sheet(categories.map(cat => ({
      ID: cat.id,
      Name: cat.name,
      'Name (Nepali)': cat.nameNepali,
      Description: cat.description,
      Icon: cat.icon,
      Color: cat.color,
      'Is Active': cat.isActive ? 'YES' : 'NO'
    })));
    XLSX.utils.book_append_sheet(workbook, categoriesSheet, 'Service Categories');

    // Services sheet
    const servicesSheet = XLSX.utils.json_to_sheet(services.map(service => ({
      ID: service.id,
      'Category ID': service.categoryId,
      Name: service.name,
      'Name (Nepali)': service.nameNepali,
      Description: service.description,
      'Base Price (NPR)': service.basePrice,
      Unit: service.unit,
      'Duration (mins)': service.estimatedDuration,
      'Is Active': service.isActive ? 'YES' : 'NO'
    })));
    XLSX.utils.book_append_sheet(workbook, servicesSheet, 'Services');

    // Locations sheet
    const locationsSheet = XLSX.utils.json_to_sheet(locations.map(location => ({
      ID: location.id,
      Name: location.name,
      'Name (Nepali)': location.nameNepali,
      Type: location.type,
      'Parent ID': location.parentId || '',
      'Is Serviceable': location.isServiceable ? 'YES' : 'NO'
    })));
    XLSX.utils.book_append_sheet(workbook, locationsSheet, 'Locations');

    // Professionals sheet
    const professionalsSheet = XLSX.utils.json_to_sheet(professionals.map(prof => ({
      ID: prof.id,
      'User ID': prof.userId,
      'Location ID': prof.locationId,
      Skills: prof.skills.join(', '),
      Experience: prof.experience,
      Rating: prof.rating,
      'Hourly Rate (NPR)': prof.hourlyRate,
      'Is Available': prof.isAvailable ? 'YES' : 'NO',
      'Is Verified': prof.isVerified ? 'YES' : 'NO'
    })));
    XLSX.utils.book_append_sheet(workbook, professionalsSheet, 'Professionals');

    // Users sheet (excluding sensitive data)
    const usersSheet = XLSX.utils.json_to_sheet(users.map(user => ({
      ID: user.id,
      Username: user.username,
      Email: user.email,
      'Full Name': user.fullName,
      Phone: user.phone,
      Role: user.role,
      'Is Verified': user.isVerified ? 'YES' : 'NO',
      'Created At': user.createdAt
    })));
    XLSX.utils.book_append_sheet(workbook, usersSheet, 'Users');

    // Bookings sheet
    const bookingsSheet = XLSX.utils.json_to_sheet(bookings.map(booking => ({
      ID: booking.id,
      'Customer ID': booking.customerId,
      'Professional ID': booking.professionalId || '',
      'Service ID': booking.serviceId,
      Location: booking.location,
      Address: booking.address,
      'Scheduled Date': booking.scheduledDate,
      'Estimated Price (NPR)': booking.estimatedPrice,
      'Final Price (NPR)': booking.finalPrice || '',
      Status: booking.status,
      Description: booking.description || '',
      'Payment Method': booking.paymentMethod,
      'Payment Status': booking.paymentStatus,
      'Created At': booking.createdAt
    })));
    XLSX.utils.book_append_sheet(workbook, bookingsSheet, 'Bookings');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buffer;

  } catch (error) {
    console.error('Excel export error:', error);
    throw new Error('Failed to export data to Excel');
  }
}

// Import data from Excel
export async function importDataFromExcel(buffer: Buffer) {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const results = {
      categories: 0,
      services: 0,
      locations: 0,
      professionals: 0,
      errors: [] as string[]
    };

    // Import Service Categories
    if (workbook.SheetNames.includes('Service Categories')) {
      const sheet = workbook.Sheets['Service Categories'];
      const data = XLSX.utils.sheet_to_json(sheet);
      
      for (const row of data as any[]) {
        try {
          await storage.upsertServiceCategory({
            id: row.ID,
            name: row.Name,
            nameNepali: row['Name (Nepali)'],
            description: row.Description,
            icon: row.Icon,
            color: row.Color,
            isActive: row['Is Active'] === 'YES'
          });
          results.categories++;
        } catch (error) {
          results.errors.push(`Category row ${row.ID}: ${error}`);
        }
      }
    }

    // Import Services
    if (workbook.SheetNames.includes('Services')) {
      const sheet = workbook.Sheets['Services'];
      const data = XLSX.utils.sheet_to_json(sheet);
      
      for (const row of data as any[]) {
        try {
          await storage.upsertService({
            id: row.ID,
            categoryId: row['Category ID'],
            name: row.Name,
            nameNepali: row['Name (Nepali)'],
            description: row.Description,
            basePrice: row['Base Price (NPR)'].toString(),
            unit: row.Unit,
            estimatedDuration: Number(row['Duration (mins)']),
            isActive: row['Is Active'] === 'YES'
          });
          results.services++;
        } catch (error) {
          results.errors.push(`Service row ${row.ID}: ${error}`);
        }
      }
    }

    // Import Locations
    if (workbook.SheetNames.includes('Locations')) {
      const sheet = workbook.Sheets['Locations'];
      const data = XLSX.utils.sheet_to_json(sheet);
      
      for (const row of data as any[]) {
        try {
          await storage.upsertLocation({
            id: row.ID,
            name: row.Name,
            nameNepali: row['Name (Nepali)'],
            type: row.Type,
            parentId: row['Parent ID'] || null,
            isServiceable: row['Is Serviceable'] === 'YES'
          });
          results.locations++;
        } catch (error) {
          results.errors.push(`Location row ${row.ID}: ${error}`);
        }
      }
    }

    // Import Professionals
    if (workbook.SheetNames.includes('Professionals')) {
      const sheet = workbook.Sheets['Professionals'];
      const data = XLSX.utils.sheet_to_json(sheet);
      
      for (const row of data as any[]) {
        try {
          await storage.upsertProfessional({
            id: row.ID,
            userId: row['User ID'],
            locationId: row['Location ID'],
            skills: row.Skills.split(', '),
            experience: row.Experience,
            rating: Number(row.Rating),
            hourlyRate: row['Hourly Rate (NPR)'].toString(),
            isAvailable: row['Is Available'] === 'YES',
            isVerified: row['Is Verified'] === 'YES'
          });
          results.professionals++;
        } catch (error) {
          results.errors.push(`Professional row ${row.ID}: ${error}`);
        }
      }
    }

    return results;

  } catch (error) {
    console.error('Excel import error:', error);
    throw new Error('Failed to import data from Excel');
  }
}