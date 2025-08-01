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

// Service images mapping for Nepali context
const serviceImages: Record<string, string> = {
  "1": "https://i.imgur.com/cwUbp8e.png", // Electrical Repair - fallback to logo for now
  "2": "https://i.imgur.com/cwUbp8e.png", // Switch & Socket Installation  
  "3": "https://i.imgur.com/cwUbp8e.png", // Fan Installation
  "4": "https://i.imgur.com/cwUbp8e.png", // Plumbing
  "5": "https://i.imgur.com/cwUbp8e.png", // Cleaning
};

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
  const serviceImage = serviceImages[service.id] || "https://i.imgur.com/cwUbp8e.png";
  
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
