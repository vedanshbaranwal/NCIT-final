import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, Calendar, CheckCircle, UserPlus, Shield, Bell, DollarSign } from "lucide-react";

const customerSteps = [
  {
    number: 1,
    icon: Search,
    title: "Search Service",
    description: "Enter your location and describe what service you need",
    color: "from-[hsl(16,100%,60%)] to-[hsl(51,85%,55%)]",
    iconBg: "bg-green-500"
  },
  {
    number: 2,
    icon: UserCheck,
    title: "Choose Professional",
    description: "Browse verified professionals, check ratings and select the best fit",
    color: "from-[hsl(151,55%,35%)] to-emerald-600",
    iconBg: "bg-blue-500"
  },
  {
    number: 3,
    icon: Calendar,
    title: "Book & Schedule",
    description: "Select your preferred time slot and confirm your booking",
    color: "from-[hsl(51,85%,55%)] to-yellow-500",
    iconBg: "bg-purple-500"
  },
  {
    number: 4,
    icon: CheckCircle,
    title: "Track & Pay",
    description: "Track your service progress and pay securely after completion",
    color: "from-red-500 to-pink-600",
    iconBg: "bg-green-500"
  }
];

const professionalSteps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Register Profile",
    description: "Create your professional profile with skills and experience",
    color: "from-[hsl(16,100%,60%)] to-[hsl(51,85%,55%)]",
    iconBg: "bg-blue-500"
  },
  {
    number: 2,
    icon: Shield,
    title: "Get Verified",
    description: "Complete background check and skill verification process",
    color: "from-[hsl(151,55%,35%)] to-emerald-600",
    iconBg: "bg-green-500"
  },
  {
    number: 3,
    icon: Bell,
    title: "Receive Jobs",
    description: "Get notifications for jobs matching your skills and location",
    color: "from-[hsl(51,85%,55%)] to-yellow-500",
    iconBg: "bg-orange-500"
  },
  {
    number: 4,
    icon: DollarSign,
    title: "Complete & Earn",
    description: "Finish the job, get paid, and build your reputation",
    color: "from-red-500 to-pink-600",
    iconBg: "bg-green-500"
  }
];

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<'customers' | 'professionals'>('customers');
  
  const currentSteps = activeTab === 'customers' ? customerSteps : professionalSteps;

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="font-nepali text-[hsl(16,100%,60%)]">कसरी काम गर्छ?</span><br />
            How It Works
          </h2>
          <p className="text-xl text-gray-600">Simple steps to get your work done</p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-2 rounded-xl">
            <Button 
              onClick={() => setActiveTab('customers')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'customers' 
                  ? 'bg-[hsl(16,100%,60%)] text-white' 
                  : 'bg-transparent text-gray-600 hover:text-[hsl(16,100%,60%)]'
              }`}
            >
              For Customers
            </Button>
            <Button 
              onClick={() => setActiveTab('professionals')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'professionals' 
                  ? 'bg-[hsl(16,100%,60%)] text-white' 
                  : 'bg-transparent text-gray-600 hover:text-[hsl(16,100%,60%)]'
              }`}
            >
              For Professionals
            </Button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {currentSteps.map((step, index) => (
            <div 
              key={step.number} 
              className="text-center space-y-4"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold`}>
                  {step.number}
                </div>
                <div className={`absolute -top-2 -right-2 w-8 h-8 ${step.iconBg} rounded-full flex items-center justify-center`}>
                  <step.icon className="text-white h-4 w-4" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
