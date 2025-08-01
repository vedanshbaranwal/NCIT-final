import HeroSection from "@/components/sections/hero";
import PopularServices from "@/components/sections/popular-services";
import TrustStats from "@/components/sections/trust-stats";
import HowItWorks from "@/components/sections/how-it-works";
import TestimonialSection from "@/components/sections/testimonials";
import ContactSection from "@/components/sections/contact";
import Navbar from "@/components/layout/navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
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