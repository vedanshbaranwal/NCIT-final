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
  
  return (
    <Card 
      className={`p-6 mountain-shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div className="text-center space-y-4">
        <div className={`w-16 h-16 bg-gradient-to-r ${iconColorClass} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
          {service.category?.icon ? (
            <i className={`${service.category.icon} text-white text-2xl`}></i>
          ) : (
            <i className="fas fa-cog text-white text-2xl"></i>
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
          {service.nameNepali && (
            <p className="text-sm text-gray-500 font-nepali mb-2">{service.nameNepali}</p>
          )}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
          
          <div className="space-y-2 mb-4">
            <p className="text-[hsl(16,100%,60%)] font-semibold">
              Starting from NPR {service.basePrice}
              {service.unit && service.unit !== "fixed" && `/${service.unit}`}
            </p>
            
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
    </Card>
  );
}
