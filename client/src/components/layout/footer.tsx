import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscriptionMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("POST", "/api/notifications/subscribe", { email });
    },
    onSuccess: () => {
      toast({
        title: "Subscription Successful",
        description: "You'll be notified when we launch our mobile app!",
      });
      setEmail("");
    },
    onError: () => {
      toast({
        title: "Subscription Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscriptionMutation.mutate(email);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-[hsl(16,100%,60%)] to-[hsl(51,85%,55%)] rounded-lg flex items-center justify-center">
                <i className="fas fa-hands-helping text-white"></i>
              </div>
              <div>
                <h1 className="font-nepali font-bold text-xl">जरूरी छ</h1>
                <p className="text-xs text-gray-400 leading-none">आवश्यकतामा रोजगार</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Nepal's trusted platform connecting customers with skilled professionals for all your service needs.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p><i className="fas fa-phone mr-2"></i> +977-1-4444444</p>
              <p><i className="fas fa-envelope mr-2"></i> support@jaruricha.com</p>
              <p><i className="fas fa-map-marker-alt mr-2"></i> Kathmandu, Nepal</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[hsl(16,100%,60%)]">Services</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/services?category=electrician" className="hover:text-[hsl(16,100%,60%)] transition-colors">Electrician</Link></li>
              <li><Link href="/services?category=plumber" className="hover:text-[hsl(16,100%,60%)] transition-colors">Plumber</Link></li>
              <li><Link href="/services?category=cleaning" className="hover:text-[hsl(16,100%,60%)] transition-colors">House Cleaning</Link></li>
              <li><Link href="/services?category=ac-repair" className="hover:text-[hsl(16,100%,60%)] transition-colors">AC Repair</Link></li>
              <li><Link href="/services?category=carpenter" className="hover:text-[hsl(16,100%,60%)] transition-colors">Carpenter</Link></li>
              <li><Link href="/services?category=painting" className="hover:text-[hsl(16,100%,60%)] transition-colors">Painting</Link></li>
              <li><Link href="/services?category=appliance" className="hover:text-[hsl(16,100%,60%)] transition-colors">Appliance Repair</Link></li>
              <li><Link href="/services?category=pest-control" className="hover:text-[hsl(16,100%,60%)] transition-colors">Pest Control</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[hsl(16,100%,60%)]">Company</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/#about" className="hover:text-[hsl(16,100%,60%)] transition-colors">About Us</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-[hsl(16,100%,60%)] transition-colors">How It Works</Link></li>
              <li><Link href="/careers" className="hover:text-[hsl(16,100%,60%)] transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-[hsl(16,100%,60%)] transition-colors">Press</Link></li>
              <li><Link href="/blog" className="hover:text-[hsl(16,100%,60%)] transition-colors">Blog</Link></li>
              <li><Link href="/worker-signup" className="hover:text-[hsl(16,100%,60%)] transition-colors">Partner With Us</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[hsl(16,100%,60%)]">Support & Legal</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/help" className="hover:text-[hsl(16,100%,60%)] transition-colors">Help Center</Link></li>
              <li><Link href="/#contact" className="hover:text-[hsl(16,100%,60%)] transition-colors">Contact Us</Link></li>
              <li><Link href="/safety" className="hover:text-[hsl(16,100%,60%)] transition-colors">Safety</Link></li>
              <li><Link href="/privacy" className="hover:text-[hsl(16,100%,60%)] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[hsl(16,100%,60%)] transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-[hsl(16,100%,60%)] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-md">
            <h4 className="text-lg font-semibold mb-4 text-[hsl(16,100%,60%)]">Get App Notifications</h4>
            <p className="text-gray-300 mb-4 text-sm">Be the first to know when we launch our mobile app!</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                required
              />
              <Button 
                type="submit" 
                disabled={subscriptionMutation.isPending}
                className="bg-[hsl(16,100%,60%)] hover:bg-[hsl(16,100%,55%)] shrink-0"
              >
                {subscriptionMutation.isPending ? "..." : "Notify Me"}
              </Button>
            </form>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 जरूरी छ. All rights reserved. Supporting SDG 8 - Decent Work and Economic Growth.
          </p>
          
          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[hsl(16,100%,60%)] transition-colors">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[hsl(16,100%,60%)] transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[hsl(16,100%,60%)] transition-colors">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[hsl(16,100%,60%)] transition-colors">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[hsl(16,100%,60%)] transition-colors">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
