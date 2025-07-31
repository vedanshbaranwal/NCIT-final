import { useState, useEffect, createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Shield, 
  Zap, 
  Users, 
  CheckCircle,
  ArrowRight,
  Play,
  Quote,
  Award,
  Calendar,
  Heart
} from "lucide-react";

// Language Context
const LanguageContext = createContext({ 
  language: 'en' as 'en' | 'ne', 
  setLanguage: (lang: 'en' | 'ne') => {} 
});

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState<'en' | 'ne'>('en');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Fetch data
  const { data: services = [] } = useQuery({ queryKey: ['/api/services'] });
  const { data: categories = [] } = useQuery({ queryKey: ['/api/categories'] });
  const { data: locations = [] } = useQuery({ queryKey: ['/api/locations'] });
  const { data: stats = {} } = useQuery({ queryKey: ['/api/stats'] });

  const t = (en: string, ne: string) => language === 'ne' ? ne : en;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedLocation) params.set('location', selectedLocation);
    setLocation(`/services?${params.toString()}`);
  };

  const handleServiceBooking = (serviceId: string) => {
    setLocation(`/booking?service=${serviceId}`);
  };

  const handleCategoryClick = (categoryId: string) => {
    setLocation(`/services?category=${categoryId}`);
  };

  // Popular categories for quick access
  const popularCategories = Array.isArray(categories) ? categories.slice(0, 8) : [];
  const featuredServices = Array.isArray(services) ? services.slice(0, 6) : [];

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ज</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("जरूरी छ", "जरूरी छ")}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("Trusted Service Platform", "आवश्यकतामा रोजगार")}
                  </p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                  {t("Services", "सेवाहरू")}
                </Link>
                <Link href="/worker-signup" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                  {t("Become a Pro", "व्यावसायिक बन्नुहोस्")}
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
                  className="text-gray-700 dark:text-gray-300"
                >
                  {language === 'en' ? 'नेपाली' : 'English'}
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-6 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                <Star className="w-3 h-3 mr-1" />
                {t("Nepal's #1 Service Platform", "नेपालको नम्बर १ सेवा प्लेटफर्म")}
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="block">
                  {t("Your needs,", "तपाईंको आवश्यकता,")}
                </span>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {t("our experts", "हाम्रो विशेषज्ञ")}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                {t(
                  "Connect with verified professionals for all your home and business needs. Quick, reliable, and affordable services across Nepal.",
                  "तपाईंको घर र व्यवसायका सबै आवश्यकताहरूका लागि प्रमाणित व्यावसायिकहरूसँग जोडिनुहोस्। छिटो, भरपर्दो र किफायती सेवाहरू।"
                )}
              </p>

              {/* Search Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto border border-gray-200/50 dark:border-gray-700/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder={t("What service do you need?", "तपाईंलाई कुन सेवा चाहिन्छ?")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-emerald-500">
                        <SelectValue placeholder={t("Select location", "स्थान छान्नुहोस्")} />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(locations) && locations.map((location: any) => (
                          <SelectItem key={location.id} value={location.id}>
                            {language === 'ne' ? location.nameNepali : location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleSearch}
                    className="h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold"
                  >
                    {t("Find Services", "सेवा खोज्नुहोस्")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">50+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t("Service Types", "सेवा प्रकारहरू")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">1000+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t("Professionals", "व्यावसायिकहरू")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">4.8★</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t("Average Rating", "औसत मूल्याङ्कन")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t("Support", "सहायता")}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("Popular Services", "लोकप्रिय सेवाहरू")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t("Book trusted professionals for your everyday needs", "तपाईंको दैनिक आवश्यकताहरूका लागि भरपर्दो व्यावसायिकहरू बुक गर्नुहोस्")}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {popularCategories.map((category: any) => (
                <Card 
                  key={category.id}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-200/50 dark:border-gray-700/50"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {language === 'ne' ? category.nameNepali : category.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("Available", "उपलब्ध")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("Featured Services", "विशेष सेवाहरू")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t("Most requested services by our customers", "हाम्रा ग्राहकहरूले सबैभन्दा धेरै मागेका सेवाहरू")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map((service: any) => (
                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-gray-200/50 dark:border-gray-700/50">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                        {t("Popular", "लोकप्रिय")}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {language === 'ne' ? service.nameNepali || service.name : service.name}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {service.estimatedDuration} {t("mins", "मिनेट")}
                        </span>
                      </div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">
                        Rs. {service.basePrice}+
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleServiceBooking(service.id)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    >
                      {t("Book Now", "अहिले बुक गर्नुहोस्")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/services">
                <Button variant="outline" size="lg" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950">
                  {t("View All Services", "सबै सेवाहरू हेर्नुहोस्")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("How जरूरी छ Works", "जरूरी छ कसरी काम गर्छ")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t("Get your work done in 3 simple steps", "३ सजिलो चरणहरूमा आफ्नो काम पूरा गर्नुहोस्")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: t("Choose Service", "सेवा छान्नुहोस्"),
                  description: t("Browse and select from 50+ services", "५०+ सेवाहरूबाट ब्राउज र छनोट गर्नुहोस्"),
                  icon: Search
                },
                {
                  step: "2", 
                  title: t("Book Professional", "व्यावसायिक बुक गर्नुहोस्"),
                  description: t("Get matched with verified experts", "प्रमाणित विशेषज्ञहरूसँग मिलाउनुहोस्"),
                  icon: Calendar
                },
                {
                  step: "3",
                  title: t("Get It Done", "काम पूरा गर्नुहोस्"),
                  description: t("Relax while we handle everything", "हामी सबै व्यवस्थापना गर्दा आराम गर्नुहोस्"),
                  icon: CheckCircle
                }
              ].map((step, index) => (
                <Card key={index} className="relative text-center p-8 border-gray-200/50 dark:border-gray-700/50">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="pt-8">
                    <step.icon className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-20 bg-emerald-50 dark:bg-emerald-950/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { icon: Shield, title: t("100% Verified", "१००% प्रमाणित"), subtitle: t("Professionals", "व्यावसायिकहरू") },
                { icon: Award, title: t("24/7 Support", "२४/७ सहायता"), subtitle: t("Always Available", "सधैं उपलब्ध") },
                { icon: Heart, title: t("Satisfaction", "सन्तुष्टि"), subtitle: t("Guaranteed", "ग्यारेन्टी") },
                { icon: Star, title: t("4.8+ Rating", "४.८+ मूल्याङ्कन"), subtitle: t("Average Score", "औसत स्कोर") }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <item.icon className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("Ready to get started?", "सुरु गर्न तयार हुनुहुन्छ?")}
            </h2>
            <p className="text-xl mb-8 text-emerald-100">
              {t("Join thousands of satisfied customers", "हजारौं सन्तुष्ट ग्राहकहरूमा सामेल हुनुहोस्")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                  {t("Browse Services", "सेवाहरू ब्राउज गर्नुहोस्")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/worker-signup">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                  {t("Become a Professional", "व्यावसायिक बन्नुहोस्")}
                  <Users className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">ज</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">जरूरी छ</h3>
                    <p className="text-sm text-gray-400">आवश्यकतामा रोजगार</p>
                  </div>
                </div>
                <p className="text-gray-400 max-w-md">
                  {t(
                    "Nepal's most trusted service platform connecting you with verified professionals for all your needs.",
                    "तपाईंका सबै आवश्यकताहरूका लागि प्रमाणित व्यावसायिकहरूसँग जोड्ने नेपालको सबैभन्दा भरपर्दो सेवा प्लेटफर्म।"
                  )}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">{t("Quick Links", "छिटो लिङ्कहरू")}</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/services" className="hover:text-white transition-colors">{t("All Services", "सबै सेवाहरू")}</Link></li>
                  <li><Link href="/worker-signup" className="hover:text-white transition-colors">{t("Become Professional", "व्यावसायिक बन्नुहोस्")}</Link></li>
                  <li><a href="#" className="hover:text-white transition-colors">{t("Help Center", "सहायता केन्द्र")}</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">{t("Contact Us", "सम्पर्क गर्नुहोस्")}</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">{t("Company", "कम्पनी")}</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">{t("About Us", "हाम्रो बारेमा")}</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">{t("Privacy Policy", "गोपनीयता नीति")}</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">{t("Terms of Service", "सेवाका सर्तहरू")}</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">{t("Careers", "करियर")}</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 जरूरी छ. {t("All rights reserved.", "सबै अधिकार सुरक्षित।")}</p>
            </div>
          </div>
        </footer>
      </div>
    </LanguageContext.Provider>
  );
}