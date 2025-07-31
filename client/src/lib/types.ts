export interface SearchFilters {
  location?: string;
  serviceCategory?: string;
  priceRange?: [number, number];
  rating?: number;
  availability?: 'immediate' | 'today' | 'this_week';
}

export interface ServiceWithCategory {
  id: string;
  name: string;
  nameNepali?: string;
  description: string;
  basePrice: string;
  unit: string;
  estimatedDuration: number;
  category: {
    id: string;
    name: string;
    nameNepali: string;
    icon: string;
    color: string;
  };
}

export interface ProfessionalWithUser {
  id: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    profilePicture?: string;
  };
  bio?: string;
  experience?: number;
  skills: string[];
  serviceAreas: string[];
  hourlyRate?: string;
  rating: string;
  totalJobs: number;
  isVerified: boolean;
  availabilityStatus: 'available' | 'busy' | 'offline';
}

export interface BookingWithDetails {
  id: string;
  customer: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  professional?: {
    id: string;
    fullName: string;
    rating: string;
    totalJobs: number;
  };
  service: {
    id: string;
    name: string;
    nameNepali?: string;
    basePrice: string;
    unit: string;
  };
  location: string;
  address: string;
  scheduledDate: Date;
  estimatedPrice: string;
  finalPrice?: string;
  status: 'pending' | 'assigned' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  description?: string;
  specialRequirements?: string;
  paymentMethod: 'cash' | 'online' | 'card';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

export interface StatsData {
  professionals: string;
  rating: string;
  completedBookings: string;
  support: string;
}
