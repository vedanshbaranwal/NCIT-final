import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Phone, Mail } from "lucide-react";

export default function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Popup */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 z-50 p-6 mountain-shadow animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Need Help?</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="h-6 w-6 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Our support team is here to help you with any questions about our services.
          </p>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open('tel:+977-1-4444444')}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call: +977-1-4444444
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open('mailto:support@jaruricha.com')}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email: support@jaruricha.com
            </Button>
            
            <Button className="w-full bg-[hsl(16,100%,60%)] hover:bg-[hsl(16,100%,55%)] text-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Live Chat
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4 text-center">
            Available 24/7 for your convenience
          </p>
        </Card>
      )}
      
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={toggleChat}
          className="w-14 h-14 bg-[hsl(16,100%,60%)] text-white rounded-full shadow-2xl hover:bg-[hsl(16,100%,55%)] transition-all transform hover:scale-110 flex items-center justify-center group"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6 group-hover:animate-pulse" />
          )}
        </Button>
      </div>
    </>
  );
}
