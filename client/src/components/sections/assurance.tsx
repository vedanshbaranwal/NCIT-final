import { Award, Headphones, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";

const assurances = [
  {
    icon: Award,
    title: "Quality Assurance",
    description: "Every service is backed by our quality guarantee. Not satisfied? We'll make it right at no extra cost.",
    badge: "100% Satisfaction Guaranteed",
    badgeColor: "text-green-600",
    iconColor: "from-green-400 to-emerald-600"
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is available round the clock to help you with any questions or concerns.",
    badge: "Always Here to Help",
    badgeColor: "text-blue-600",
    iconColor: "from-blue-400 to-blue-600"
  },
  {
    icon: Scale,
    title: "Fair Resolution",
    description: "Transparent dispute resolution process ensuring fair outcomes for both customers and professionals.",
    badge: "Fair & Transparent",
    badgeColor: "text-purple-600",
    iconColor: "from-purple-400 to-purple-600"
  }
];

export default function Assurance() {
  return (
    <section className="py-20 bg-gradient-to-r from-[hsl(16,100%,60%)]/5 to-[hsl(151,55%,35%)]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="font-nepali text-[hsl(16,100%,60%)]">हाम्रो प्रतिबद्धता</span><br />
            Our Assurance to You
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {assurances.map((assurance, index) => (
            <Card 
              key={assurance.title}
              className="p-8 mountain-shadow text-center space-y-6 hover:transform hover:scale-105 transition-all"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-20 h-20 bg-gradient-to-r ${assurance.iconColor} rounded-full flex items-center justify-center mx-auto`}>
                <assurance.icon className="text-white h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{assurance.title}</h3>
              <p className="text-gray-600 leading-relaxed">{assurance.description}</p>
              <div className={`flex items-center justify-center space-x-2 ${assurance.badgeColor} font-semibold`}>
                <i className="fas fa-check-circle"></i>
                <span>{assurance.badge}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
