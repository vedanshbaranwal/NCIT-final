import { CheckCircle, Shield, Clock, Heart, Award, Flag } from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Transparent Pricing",
    description: "Know exactly what you'll pay before booking. No hidden fees, no surprises.",
    color: "from-green-400 to-emerald-600",
  },
  {
    icon: Shield,
    title: "Verified Professionals",
    description: "All service providers are background-checked and skill-verified for your safety.",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: Clock,
    title: "Quick Booking",
    description: "Book services in under 60 seconds with instant confirmation and scheduling.",
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "Supporting local professionals and creating employment opportunities in Nepal.",
    color: "from-red-400 to-pink-600",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "100% satisfaction guarantee with free rework if you're not completely happy.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: Flag,
    title: "Built for Nepal",
    description: "Designed for Nepali culture with local languages, payment methods, and customs.",
    color: "from-[hsl(16,100%,60%)] to-[hsl(218,100%,29%)]",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="font-nepali text-[hsl(16,100%,60%)]">किन जरूरी छ?</span><br />
            Why जरूरी छ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built specifically for Nepal with trust, quality, and community at our core
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center space-y-4 p-6 rounded-2xl hover:bg-[hsl(210,17%,98%)] transition-colors group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                <feature.icon className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
