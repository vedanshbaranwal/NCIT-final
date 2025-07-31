import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Search, Briefcase } from "lucide-react";

export default function CTASection() {
  const [, setLocation] = useLocation();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative bg-gradient-to-r from-[hsl(16,100%,60%)] to-[hsl(51,85%,55%)] rounded-3xl p-12 md:p-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30" 
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1605640840605-14ac1855827b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
            }}
          />
          
          <div className="relative z-10 space-y-8 text-white">
            <h2 className="text-3xl md:text-5xl font-bold">
              <span className="font-nepali">तयार हुनुहोस्?</span><br />
              Ready to Simplify Your Life?
            </h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust जरूरी छ for their daily needs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                onClick={() => setLocation('/services')}
                className="px-10 py-4 bg-white text-[hsl(16,100%,60%)] font-bold text-lg rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 mountain-shadow"
              >
                <Search className="mr-3 h-5 w-5" />
                Book a Service
              </Button>
              <Button 
                onClick={() => setLocation('/worker-signup')}
                variant="outline"
                className="px-10 py-4 border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-[hsl(16,100%,60%)] transition-all transform hover:scale-105"
              >
                <Briefcase className="mr-3 h-5 w-5" />
                Become a Professional
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
