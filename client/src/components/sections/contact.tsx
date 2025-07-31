import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactRequestSchema } from "@shared/schema";
import { z } from "zod";

type ContactFormData = z.infer<typeof insertContactRequestSchema>;

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    detail: "+977-1-4444444",
    color: "from-[hsl(16,100%,60%)] to-[hsl(51,85%,55%)]"
  },
  {
    icon: Mail,
    title: "Email", 
    detail: "support@jaruricha.com",
    color: "from-[hsl(151,55%,35%)] to-emerald-600"
  },
  {
    icon: MapPin,
    title: "Address",
    detail: "Kathmandu, Nepal",
    color: "from-[hsl(51,85%,55%)] to-yellow-500"
  }
];

export default function Contact() {
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(insertContactRequestSchema)
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully",
        description: "We'll get back to you as soon as possible!",
      });
      reset();
    },
    onError: () => {
      toast({
        title: "Failed to Send Message",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 bg-[hsl(210,17%,98%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                <span className="font-nepali text-[hsl(16,100%,60%)]">सम्पर्क गर्नुहोस्</span><br />
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600">We're here to help you with any questions or concerns</p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={info.title} className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-lg flex items-center justify-center`}>
                    <info.icon className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{info.title}</p>
                    <p className="text-gray-600">{info.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <Card className="p-8 mountain-shadow">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </Label>
                  <Input 
                    id="name"
                    {...register("name")}
                    placeholder="Enter your name" 
                    className="focus:ring-2 focus:ring-[hsl(16,100%,60%)] focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </Label>
                  <Input 
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email" 
                    className="focus:ring-2 focus:ring-[hsl(16,100%,60%)] focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </Label>
                <Input 
                  id="subject"
                  {...register("subject")}
                  placeholder="What is this about?" 
                  className="focus:ring-2 focus:ring-[hsl(16,100%,60%)] focus:border-transparent"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </Label>
                <Textarea 
                  id="message"
                  rows={5}
                  {...register("message")}
                  placeholder="Tell us more about your inquiry..." 
                  className="focus:ring-2 focus:ring-[hsl(16,100%,60%)] focus:border-transparent"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                disabled={contactMutation.isPending}
                className="w-full bg-[hsl(16,100%,60%)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[hsl(16,100%,55%)] transition-colors mountain-shadow"
              >
                <i className="fas fa-paper-plane mr-2"></i>
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
