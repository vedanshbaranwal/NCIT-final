import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from "lucide-react";

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    nameNepali?: string;
    description: string;
    basePrice: string;
    unit: string;
    estimatedDuration?: number;
    category?: {
      id: string;
      name: string;
      nameNepali: string;
      icon: string;
      color: string;
    };
  };
  onClick?: () => void;
  className?: string;
}

// Nepal-specific service images with proper context for each service type
const serviceImages: Record<string, string> = {
  // Electrical Services - different images for each type
  "1": "https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Electrical Repairs
  "2": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Switch & Socket Installation
  "3": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Fan Installation
  
  // Plumbing Services - unique images for each  
  "4": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Pipe Repair
  "5": "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Bathroom Fitting
  "6": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Tap & Faucet Repair
  
  // Cleaning Services - different cleaning contexts
  "7": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Deep House Cleaning
  "8": "https://images.unsplash.com/photo-1585421514738-01798e348ce1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Regular Cleaning
  
  // AC Services - air conditioning specific
  "9": "https://images.unsplash.com/photo-1604709177225-055f99402ea3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // AC Service & Cleaning
  "10": "https://images.unsplash.com/photo-1621401158159-2d4e5d0e8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // AC Installation
  
  // Carpentry Services - wood work and furniture
  "11": "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Furniture Assembly
  "12": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Custom Furniture Making
  
  // Painting Services - wall painting context
  "13": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Wall Painting
  
  // Electronics Services - TV and appliance repair
  "14": "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // TV Repair
  
  // Pest Control - pest control specific
  "15": "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Home Pest Control
};

// Fallback image for any missing service
const fallbackServiceImage = "https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";

const getIconColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    yellow: "from-yellow-400 to-orange-500",
    blue: "from-blue-400 to-blue-600",
    green: "from-green-400 to-emerald-600",
    cyan: "from-cyan-400 to-blue-500",
    amber: "from-amber-500 to-orange-600",
    purple: "from-purple-500 to-pink-500",
    red: "from-red-500 to-pink-600",
    teal: "from-teal-500 to-green-600",
  };
  return colorMap[color] || "from-gray-400 to-gray-600";
};

export function ServiceCard({ service, onClick, className = "" }: ServiceCardProps) {
  const iconColorClass = service.category ? getIconColorClass(service.category.color) : "from-gray-400 to-gray-600";
  const serviceImage = serviceImages[service.id] || fallbackServiceImage;
  
  return (
    <Card 
      className={`overflow-hidden mountain-shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Service Image Header */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        <img 
          src={serviceImage}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback to icon if image fails to load
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className={`hidden absolute inset-0 bg-gradient-to-r ${iconColorClass} flex items-center justify-center`}>
          {service.category?.icon ? (
            <i className={`${service.category.icon} text-white text-4xl`}></i>
          ) : (
            <i className="fas fa-cog text-white text-4xl"></i>
          )}
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-[hsl(16,100%,60%)] font-bold text-sm">
            NPR {service.basePrice}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="text-center space-y-4">
        
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
            {service.nameNepali && (
              <p className="text-sm text-gray-500 font-nepali mb-2">{service.nameNepali}</p>
            )}
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
            
            <div className="space-y-2 mb-4">
              {service.unit && service.unit !== "fixed" && (
                <p className="text-gray-500 text-sm">per {service.unit}</p>
              )}
              
              {service.estimatedDuration && (
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{service.estimatedDuration} mins</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center space-x-1 mb-4">
              <Star className="h-4 w-4 text-[hsl(51,85%,55%)] fill-current" />
              <span className="text-sm font-medium text-gray-700">4.8</span>
              <span className="text-xs text-gray-500">(120+ reviews)</span>
            </div>
            
            <Button 
              className="w-full bg-[hsl(16,100%,60%)] text-white rounded-lg font-medium hover:bg-[hsl(16,100%,55%)] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
