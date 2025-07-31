import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Smartphone, Download } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function MobileAppPromo() {
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                <span className="font-nepali text-[hsl(16,100%,60%)]">मोबाइल एप</span><br />
                Coming Soon
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Get the जरूरी छ app for faster bookings and a better experience on the go.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Book services, track progress, chat with professionals, and manage your account - all from your mobile device. Be the first to know when we launch!
              </p>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                disabled
                className="flex items-center justify-center space-x-3 bg-black text-white px-6 py-3 rounded-lg font-semibold opacity-60 cursor-not-allowed"
              >
                <i className="fab fa-apple text-2xl"></i>
                <div className="text-left">
                  <p className="text-xs">Coming Soon on</p>
                  <p className="text-sm font-bold">App Store</p>
                </div>
              </Button>
              <Button
                disabled
                className="flex items-center justify-center space-x-3 bg-black text-white px-6 py-3 rounded-lg font-semibold opacity-60 cursor-not-allowed"
              >
                <i className="fab fa-google-play text-2xl"></i>
                <div className="text-left">
                  <p className="text-xs">Coming Soon on</p>
                  <p className="text-sm font-bold">Google Play</p>
                </div>
              </Button>
            </div>

            {/* Notify Me */}
            <Card className="p-6 bg-[hsl(210,17%,98%)]">
              <h3 className="font-semibold text-gray-900 mb-3">Get notified when we launch!</h3>
              <form onSubmit={handleSubscribe} className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 focus:ring-2 focus:ring-[hsl(16,100%,60%)] focus:border-transparent"
                  required
                />
                <Button
                  type="submit"
                  disabled={subscriptionMutation.isPending}
                  className="px-6 bg-[hsl(16,100%,60%)] text-white rounded-lg font-semibold hover:bg-[hsl(16,100%,55%)] transition-colors shrink-0"
                >
                  {subscriptionMutation.isPending ? "..." : "Notify Me"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Phone Mockup */}
          <div className="relative">
            <div className="relative mx-auto w-80 h-96 bg-gray-900 rounded-3xl p-2 mountain-shadow">
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                {/* Phone screen showing app UI mockup */}
                <div className="absolute inset-0 bg-gradient-to-b from-[hsl(16,100%,60%)]/10 to-[hsl(151,55%,35%)]/10 flex flex-col">
                  {/* Status bar */}
                  <div className="flex justify-between items-center p-4 text-xs font-semibold">
                    <span>9:41</span>
                    <span>100%</span>
                  </div>
                  
                  {/* App header */}
                  <div className="px-4 pb-4">
                    <h3 className="font-nepali text-2xl font-bold text-[hsl(16,100%,60%)]">जरूरी छ</h3>
                    <p className="text-sm text-gray-600">Find services near you</p>
                  </div>
                  
                  {/* Search bar */}
                  <div className="px-4 mb-4">
                    <div className="bg-white p-3 rounded-xl shadow-md">
                      <i className="fas fa-search text-[hsl(16,100%,60%)] mr-2"></i>
                      <span className="text-gray-500 text-sm">What do you need?</span>
                    </div>
                  </div>
                  
                  {/* Service categories */}
                  <div className="px-4 flex-1">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-xl text-center shadow-sm">
                        <i className="fas fa-bolt text-yellow-500 text-lg mb-1"></i>
                        <p className="text-xs font-semibold">Electrician</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl text-center shadow-sm">
                        <i className="fas fa-wrench text-blue-500 text-lg mb-1"></i>
                        <p className="text-xs font-semibold">Plumber</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl text-center shadow-sm">
                        <i className="fas fa-broom text-green-500 text-lg mb-1"></i>
                        <p className="text-xs font-semibold">Cleaning</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl text-center shadow-sm">
                        <i className="fas fa-hammer text-orange-500 text-lg mb-1"></i>
                        <p className="text-xs font-semibold">Carpenter</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-[hsl(16,100%,60%)] to-[hsl(51,85%,55%)] rounded-full flex items-center justify-center animate-float">
              <Smartphone className="text-white h-8 w-8" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-[hsl(151,55%,35%)] to-emerald-600 rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '2s' }}>
              <Download className="text-white h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
