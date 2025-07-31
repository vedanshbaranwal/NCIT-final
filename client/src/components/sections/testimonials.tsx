import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    rating: 5,
    comment: "जरूरी छले मेरो घरको काम धेरै सजिलो बनायो। The electrician was professional and fixed my wiring issue quickly. Highly recommended!",
    customer: {
      name: "Bibisha Shrestha",
      role: "Homemaker, Kathmandu",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64"
    }
  },
  {
    id: 2,
    rating: 5,
    comment: "Amazing service! The plumber arrived on time and solved my water leak problem efficiently. The pricing was very fair too.",
    customer: {
      name: "Rajesh Pradhan",
      role: "Business Owner, Pokhara",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64"
    }
  },
  {
    id: 3,
    rating: 5,
    comment: "Excellent cleaning service! My house looks brand new. The team was professional and used eco-friendly products.",
    customer: {
      name: "Sunita Gurung",
      role: "Teacher, Chitwan",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64"
    }
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-[hsl(210,17%,98%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="font-nepali text-[hsl(16,100%,60%)]">ग्राहक समीक्षा</span><br />
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600">Real experiences from real people across Nepal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="p-8 mountain-shadow space-y-6 hover:shadow-xl transition-shadow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-1 text-[hsl(51,85%,55%)]">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-700 leading-relaxed">
                "{testimonial.comment}"
              </blockquote>
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.customer.avatar} 
                  alt={testimonial.customer.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.customer.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.customer.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
