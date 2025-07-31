import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "@/components/ui/service-card";
import { Search, Filter, MapPin, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Services() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [priceSort, setPriceSort] = useState("");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services"],
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["/api/locations"],
  });

  // Combine services with their category data
  const servicesWithCategories = useMemo(() => {
    return services.map((service: any) => {
      const category = categories.find((cat: any) => cat.id === service.categoryId);
      return { ...service, category };
    });
  }, [services, categories]);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let filtered = servicesWithCategories.filter((service: any) => {
      const matchesSearch = !searchQuery || 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.nameNepali && service.nameNepali.includes(searchQuery));
      
      const matchesCategory = !selectedCategory || service.categoryId === selectedCategory;
      
      return matchesSearch && matchesCategory && service.isActive;
    });

    // Sort by price if selected
    if (priceSort === "low-to-high") {
      filtered.sort((a: any, b: any) => parseFloat(a.basePrice) - parseFloat(b.basePrice));
    } else if (priceSort === "high-to-low") {
      filtered.sort((a: any, b: any) => parseFloat(b.basePrice) - parseFloat(a.basePrice));
    }

    return filtered;
  }, [servicesWithCategories, searchQuery, selectedCategory, priceSort]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLocation("");
    setPriceSort("");
  };

  const isLoading = categoriesLoading || servicesLoading;

  return (
    <div className="min-h-screen bg-[hsl(210,17%,98%)] font-inter">
      <Header />
      
      <main className="pt-8">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="font-nepali text-[hsl(16,100%,60%)]">सेवाहरू</span><br />
                Our Services
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find the perfect professional for your needs. All our service providers are verified and rated by customers.
              </p>
            </div>

            {/* Search and Filters */}
            <Card className="p-6 mb-8 mountain-shadow">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Location Filter */}
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.map((location: any) => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Price Sort */}
                <Select value={priceSort} onValueChange={setPriceSort}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Sorting</SelectItem>
                    <SelectItem value="low-to-high">Price: Low to High</SelectItem>
                    <SelectItem value="high-to-low">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                {(searchQuery || selectedCategory || selectedLocation || priceSort) && (
                  <>
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {searchQuery && (
                      <Badge variant="secondary">Search: {searchQuery}</Badge>
                    )}
                    {selectedCategory && (
                      <Badge variant="secondary">
                        Category: {categories.find((c: any) => c.id === selectedCategory)?.name}
                      </Badge>
                    )}
                    {selectedLocation && (
                      <Badge variant="secondary">Location: {selectedLocation}</Badge>
                    )}
                    {priceSort && (
                      <Badge variant="secondary">
                        Sort: {priceSort === "low-to-high" ? "Price ↑" : "Price ↓"}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-[hsl(16,100%,60%)] hover:bg-[hsl(16,100%,60%)]/10"
                    >
                      Clear All
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {/* Services Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-4 mb-2" />
                    <Skeleton className="h-3 mb-3" />
                    <Skeleton className="h-4 mb-3" />
                    <Skeleton className="h-8" />
                  </Card>
                ))}
              </div>
            ) : filteredServices.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600">
                    {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredServices.map((service: any) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onClick={() => setLocation(`/booking/${service.id}`)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or browse all available services.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
