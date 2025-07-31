import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Users, Star, Headphones } from "lucide-react";

export default function TrustStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-8 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-4 animate-slide-up">
            <div className="w-16 h-16 bg-gradient-to-r from-[hsl(16,100%,60%)] to-[hsl(51,85%,55%)] rounded-full flex items-center justify-center mx-auto">
              <Users className="text-white h-8 w-8" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stats?.professionals || "10,000+"}</h3>
              <p className="text-gray-600 font-medium">Trusted Professionals</p>
            </div>
          </div>
          
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-[hsl(151,55%,35%)] to-[hsl(218,100%,29%)] rounded-full flex items-center justify-center mx-auto">
              <Star className="text-white h-8 w-8" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stats?.rating || "4.8/5"}</h3>
              <p className="text-gray-600 font-medium">Average Rating</p>
            </div>
          </div>
          
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-[hsl(51,85%,55%)] to-[hsl(16,100%,60%)] rounded-full flex items-center justify-center mx-auto">
              <Headphones className="text-white h-8 w-8" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stats?.support || "24/7"}</h3>
              <p className="text-gray-600 font-medium">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
