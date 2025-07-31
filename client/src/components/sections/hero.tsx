import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation as useCurrentLocation } from "@/hooks/use-location";

export default function Hero() {
  const [, setLocation] = useLocation();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { location: currentLocation } = useCurrentLocation();

  const { data: locations = [] } = useQuery({
    queryKey: ["/api/locations"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const handleSearch = () => {
    if (searchQuery || selectedLocation) {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedLocation) params.set('location', selectedLocation);
      setLocation(`/services?${params.toString()}`);
    } else {
      setLocation('/services');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background with mountain-inspired gradient */}
      <div className="absolute inset-0 hero-gradient opacity-5"></div>
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[hsl(16,100%,60%)]/10 rounded-full animate-float hidden lg:block"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[hsl(151,55%,35%)]/10 rounded-full animate-float hidden lg:block" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="text-center lg:text-left space-y-8 animate-slide-up">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                <span className="font-nepali text-[hsl(16,100%,60%)]">कहाँ चाहिन्छ</span><br />
                <span className="bg-gradient-to-r from-[hsl(16,100%,60%)] to-[hsl(51,85%,55%)] bg-clip-text text-transparent">सेवा?</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 font-medium">
                Connect with trusted professionals in Nepal.
              </p>
              <p className="text-lg text-gray-600 max-w-xl">
                From electricians to cooks, plumbers to cleaners — quality service at your fingertips.
              </p>
            </div>

            {/* Search Bar */}
            <Card className="p-6 mountain-shadow glass-morphism max-w-lg mx-auto lg:mx-0 bg-white/95">
              <div className="space-y-4">
                {/* Location Input */}
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[hsl(16,100%,60%)] h-5 w-5" />
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="pl-12 h-12 border-gray-200 focus:ring-2 focus:ring-[hsl(16,100%,60%)] focus:border-transparent">
                      <SelectValue placeholder={currentLocation?.city || "Select your location"} />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location: any) => (
                        <SelectItem key={location.id} value={location.name}>
                          {location.name} ({location.nameNepali})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Service Input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[hsl(16,100%,60%)] h-5 w-5" />
                  <Input 
                    type="text" 
                    placeholder="What service do you need?" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-12 h-12 border-gray-200 focus:ring-2 focus:ring-[hsl(16,100%,60%)] focus:border-transparent"
                  />
                </div>
                
                {/* Search Button */}
                <Button 
                  onClick={handleSearch}
                  className="w-full bg-[hsl(16,100%,60%)] text-white h-12 rounded-lg font-semibold hover:bg-[hsl(16,100%,55%)] transition-colors mountain-shadow"
                >
                  <Search className="mr-2 h-5 w-5" />
                  खोज्नुहोस् (Search)
                </Button>
              </div>
            </Card>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => setLocation('/services')}
                className="px-8 py-4 bg-[hsl(16,100%,60%)] text-white font-semibold rounded-lg hover:bg-[hsl(16,100%,55%)] transition-all transform hover:scale-105 mountain-shadow"
              >
                <i className="fas fa-calendar-check mr-2"></i>
                Book Now
              </Button>
              <Button 
                onClick={() => setLocation('/worker-signup')}
                variant="outline"
                className="px-8 py-4 border-2 border-[hsl(151,55%,35%)] text-[hsl(151,55%,35%)] font-semibold rounded-lg hover:bg-[hsl(151,55%,35%)] hover:text-white transition-all transform hover:scale-105"
              >
                <i className="fas fa-user-tie mr-2"></i>
                Become a Professional
              </Button>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="relative lg:h-96 animate-scale-in">
            <div className="relative h-80 lg:h-full rounded-2xl overflow-hidden mountain-shadow">
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Professional service workers in Nepal helping customers" 
                className="w-full h-full object-cover"
              />
              
              {/* Floating cards for engagement */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg animate-float">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">24/7 Available</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-star text-[hsl(51,85%,55%)]"></i>
                  <span className="text-sm font-medium">4.8 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
