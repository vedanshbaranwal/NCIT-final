import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Bot, User, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  services?: any[];
  categories?: any[];
}

export function Chatbot({ services = [], categories = [] }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "नमस्ते! Welcome to जरूरी छ! I'm your service assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
      suggestions: [
        "What services do you offer?",
        "सेवाहरू के के छ?",
        "How do I book a service?",
        "Pricing information",
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Smart response generator based on service data and patterns
  const generateResponse = (userMessage: string): { text: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();
    
    // Greeting patterns
    if (message.includes('hi') || message.includes('hello') || message.includes('नमस्ते') || message.includes('हैलो')) {
      return {
        text: "नमस्ते! Hello! Welcome to जरूरी छ - Nepal's trusted service platform. How can I assist you today?",
        suggestions: ["Show me available services", "How to book?", "Service areas", "Pricing"]
      };
    }

    // Service inquiry patterns
    if (message.includes('service') || message.includes('सेवा') || message.includes('what do you offer') || message.includes('available')) {
      const serviceList = categories.map(cat => `• ${cat.name} (${cat.nameNepali})`).join('\n');
      return {
        text: `We offer these professional services across Nepal:\n\n${serviceList}\n\nEach service is provided by verified professionals. Which service interests you?`,
        suggestions: ["Electrician services", "Plumber services", "House cleaning", "AC repair"]
      };
    }

    // Electrician specific
    if (message.includes('electric') || message.includes('बिजुली') || message.includes('wiring') || message.includes('fan')) {
      return {
        text: "Our electrical services include:\n• Electrical repairs & troubleshooting\n• Switch & socket installation\n• Fan installation & repair\n• Wiring work\n\nAll electricians are experienced and safety-certified. Prices start from NPR 500/hour.",
        suggestions: ["Book electrician", "Electrical pricing", "Service areas", "Other services"]
      };
    }

    // Plumber specific
    if (message.includes('plumb') || message.includes('pipe') || message.includes('प्लम्बर') || message.includes('पाइप')) {
      return {
        text: "Our plumbing services include:\n• Pipe repair & replacement\n• Bathroom fitting installation\n• Tap & faucet repair\n• Water line installation\n\nExperienced plumbers available 7 days a week. Starting from NPR 400/hour.",
        suggestions: ["Book plumber", "Plumbing pricing", "Emergency service", "Other services"]
      };
    }

    // Cleaning specific
    if (message.includes('clean') || message.includes('सफाई') || message.includes('housekeeping')) {
      return {
        text: "Our cleaning services include:\n• Deep house cleaning\n• Regular maintenance cleaning\n• Post-construction cleaning\n• Office cleaning\n\nProfessional cleaners with eco-friendly products. Deep cleaning from NPR 800.",
        suggestions: ["Book cleaning", "Cleaning packages", "Eco-friendly products", "Other services"]
      };
    }

    // AC/Cooling specific
    if (message.includes('ac') || message.includes('air condition') || message.includes('ए.सी') || message.includes('cooling')) {
      return {
        text: "Our AC services include:\n• AC service & cleaning\n• AC installation\n• AC repair & maintenance\n• Split/Window AC support\n\nCertified technicians for all major brands. Service starts from NPR 1200.",
        suggestions: ["Book AC service", "AC brands supported", "Installation cost", "Other services"]
      };
    }

    // Booking process
    if (message.includes('book') || message.includes('how to') || message.includes('process') || message.includes('बुक')) {
      return {
        text: "Booking is simple:\n\n1. Browse services or search what you need\n2. Select your preferred service\n3. Choose date & time\n4. Add your location details\n5. Confirm booking\n\nYou can book as guest or create an account for faster future bookings.",
        suggestions: ["Browse services", "Create account", "Service areas", "Payment options"]
      };
    }

    // Pricing
    if (message.includes('price') || message.includes('cost') || message.includes('rate') || message.includes('मूल्य')) {
      return {
        text: "Our competitive pricing:\n• Electrician: NPR 500/hour\n• Plumber: NPR 400/hour\n• House Cleaning: NPR 800 (deep clean)\n• AC Service: NPR 1200/service\n• Carpenter: NPR 600/hour\n• Painting: NPR 300/sq ft\n\nActual prices may vary based on work complexity and materials.",
        suggestions: ["Get quote", "Service details", "Book now", "Payment methods"]
      };
    }

    // Service areas
    if (message.includes('area') || message.includes('location') || message.includes('where') || message.includes('क्षेत्र')) {
      return {
        text: "We currently serve these major areas in Nepal:\n• Kathmandu Valley (काठमाडौं उपत्यका)\n• Pokhara (पोखरा)\n• Chitwan (चितवन)\n• Lalitpur (ललितपुर)\n• Bhaktapur (भक्तपुर)\n\nExpanding to more cities soon! Is your area covered?",
        suggestions: ["Check my area", "Request new area", "Book service", "Contact support"]
      };
    }

    // Payment methods
    if (message.includes('payment') || message.includes('pay') || message.includes('भुक्तानी')) {
      return {
        text: "Payment options available:\n• Cash on Delivery (COD)\n• Online Payment (eSewa, Khalti)\n• Bank Transfer\n\nPayment is made after service completion and your satisfaction. No advance payment required!",
        suggestions: ["Book service", "Service guarantee", "Refund policy", "Other questions"]
      };
    }

    // Professional/Worker related
    if (message.includes('professional') || message.includes('worker') || message.includes('expert') || message.includes('पेशेवर')) {
      return {
        text: "All our professionals are:\n• Background verified\n• Skill certified\n• Highly rated by customers\n• Insured for your protection\n\nWe maintain strict quality standards. Not satisfied? We'll make it right!",
        suggestions: ["View professionals", "Become a professional", "Quality guarantee", "Book service"]
      };
    }

    // Help/Support
    if (message.includes('help') || message.includes('support') || message.includes('problem') || message.includes('सहायता')) {
      return {
        text: "I'm here to help! You can:\n• Browse services and book online\n• Get instant quotes\n• Track your bookings\n• Contact customer support\n\nFor urgent issues, call our 24/7 helpline. What specific help do you need?",
        suggestions: ["Contact support", "Track booking", "Cancel booking", "Service issues"]
      };
    }

    // Default response with smart suggestions
    return {
      text: "I'd be happy to help you with जरूरी छ services! I can assist you with:\n• Service information and pricing\n• Booking process\n• Service areas\n• Professional details\n\nWhat would you like to know?",
      suggestions: ["Available services", "How to book", "Pricing info", "Service areas"]
    };
  };

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate thinking time
    setTimeout(() => {
      const response = generateResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay for natural feel
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-[hsl(16,100%,60%)] hover:bg-[hsl(16,100%,55%)] shadow-lg"
            data-testid="button-open-chat"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className={`w-96 bg-white shadow-2xl border-0 ${isMinimized ? 'h-16' : 'h-[500px]'} transition-all duration-300`}>
              {/* Chat Header */}
              <div className="bg-[hsl(16,100%,60%)] text-white p-4 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">जरूरी छ Assistant</h3>
                    <p className="text-xs opacity-90">Always here to help</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    data-testid="button-minimize-chat"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    data-testid="button-close-chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages Area */}
                  <ScrollArea className="h-80 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[80%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                            <div className={`flex items-start space-x-2 ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.isBot ? 'bg-[hsl(16,100%,60%)]' : 'bg-gray-500'}`}>
                                {message.isBot ? (
                                  <Bot className="h-4 w-4 text-white" />
                                ) : (
                                  <User className="h-4 w-4 text-white" />
                                )}
                              </div>
                              <div className={`rounded-lg p-3 ${message.isBot ? 'bg-gray-100 text-gray-800' : 'bg-[hsl(16,100%,60%)] text-white'}`}>
                                <p className="text-sm whitespace-pre-line">{message.text}</p>
                                <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-white/80'}`}>
                                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            
                            {/* Suggestions */}
                            {message.suggestions && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-[hsl(16,100%,60%)] hover:text-white transition-colors text-xs"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    data-testid={`suggestion-${index}`}
                                  >
                                    {suggestion}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-start space-x-2">
                            <div className="w-8 h-8 rounded-full bg-[hsl(16,100%,60%)] flex items-center justify-center">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                            <div className="bg-gray-100 rounded-lg p-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="p-4 border-t">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="flex space-x-2"
                    >
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message... | आफ्नो सन्देश टाइप गर्नुहोस्..."
                        className="flex-1"
                        data-testid="input-chat-message"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="bg-[hsl(16,100%,60%)] hover:bg-[hsl(16,100%,55%)]"
                        disabled={!inputValue.trim() || isTyping}
                        data-testid="button-send-message"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}