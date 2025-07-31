import { useState } from "react";
import HeroSection from "@/components/sections/hero";
import PopularServices from "@/components/sections/popular-services";
import TrustStats from "@/components/sections/trust-stats";
import HowItWorks from "@/components/sections/how-it-works";
import TestimonialSection from "@/components/sections/testimonials";
import ContactSection from "@/components/sections/contact";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [language, setLanguage] = useState<'en' | 'ne'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ne' : 'en');
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-[hsl(16,100%,60%)] font-nepali">जरूरी छ</h1>
              </div>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
              <Link href="/services" className="text-gray-900 hover:text-[hsl(16,100%,60%)] px-3 py-2 text-sm font-medium">
                Services
              </Link>
              <Link href="/worker-signup" className="text-gray-900 hover:text-[hsl(16,100%,60%)] px-3 py-2 text-sm font-medium">
                Become a Professional
              </Link>
              <Button variant="outline" size="sm" onClick={toggleLanguage}>
                {language === 'en' ? 'नेपाली' : 'English'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Sections */}
      <HeroSection />
      <PopularServices />
      <TrustStats />
      <HowItWorks />
      <TestimonialSection />
      <ContactSection />
    </div>
  );
}