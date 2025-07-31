import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ui/service-card";
import { useLocation } from "wouter";

export default function PopularServices() {
  const [, setLocation] = useLocation();
  
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
  });

  // Combine services with their category data
  const servicesWithCategories = services.map((service: any) => {
    const category = categories.find((cat: any) => cat.id === service.categoryId);
    return {
      ...service,
      category,
    };
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-[hsl(210,17%,98%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[hsl(210,17%,98%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="font-nepali text-[hsl(16,100%,60%)]">लोकप्रिय सेवाहरू</span><br />
            Popular Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most requested services with verified professionals ready to help
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {servicesWithCategories.slice(0, 8).map((service: any) => (
            <ServiceCard 
              key={service.id} 
              service={service}
              onClick={() => setLocation(`/booking/${service.id}`)}
            />
          ))}
        </div>

        {/* View All Services Button */}
        <div className="text-center">
          <Button 
            onClick={() => setLocation('/services')}
            variant="outline"
            className="px-8 py-4 border-2 border-[hsl(16,100%,60%)] text-[hsl(16,100%,60%)] font-semibold rounded-lg hover:bg-[hsl(16,100%,60%)] hover:text-white transition-all transform hover:scale-105"
          >
            <i className="fas fa-grid-3x3 mr-2"></i>
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
}
