import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import TrustStats from "@/components/sections/trust-stats";
import PopularServices from "@/components/sections/popular-services";
import WhyChooseUs from "@/components/sections/why-choose-us";
import Testimonials from "@/components/sections/testimonials";
import HowItWorks from "@/components/sections/how-it-works";
import Assurance from "@/components/sections/assurance";
import CTASection from "@/components/sections/cta-section";
import Contact from "@/components/sections/contact";
import MobileAppPromo from "@/components/sections/mobile-app-promo";
import FloatingCTA from "@/components/ui/floating-cta";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-inter">
      <Header />
      <main>
        <Hero />
        <TrustStats />
        <PopularServices />
        <WhyChooseUs />
        <Testimonials />
        <HowItWorks />
        <Assurance />
        <CTASection />
        <Contact />
        <MobileAppPromo />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
