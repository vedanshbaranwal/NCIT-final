import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Shield, CheckCircle, DollarSign, Star, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProfessionalSchema, insertUserSchema } from "@shared/schema";

const userRegistrationSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const professionalDetailsSchema = insertProfessionalSchema.extend({
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type UserFormData = z.infer<typeof userRegistrationSchema>;
type ProfessionalFormData = z.infer<typeof professionalDetailsSchema>;

const benefits = [
  {
    icon: DollarSign,
    title: "Flexible Earnings",
    description: "Set your own rates and work when you want",
    color: "text-green-600"
  },
  {
    icon: Star,
    title: "Build Reputation",
    description: "Get rated by customers and build your profile",
    color: "text-yellow-600"
  },
  {
    icon: Users,
    title: "Growing Customer Base",
    description: "Access thousands of customers looking for your skills",
    color: "text-blue-600"
  },
  {
    icon: Shield,
    title: "Insurance Coverage",
    description: "Professional liability coverage for verified workers",
    color: "text-purple-600"
  }
];

const skillOptions = [
  "Electrical Work", "Plumbing", "House Cleaning", "AC Repair", 
  "Carpentry", "Painting", "Appliance Repair", "Pest Control",
  "Gardening", "Construction", "Interior Design", "Moving Services"
];

const locationOptions = [
  "Kathmandu", "Pokhara", "Chitwan", "Lalitpur", "Bhaktapur",
  "Biratnagar", "Butwal", "Dharan", "Janakpur", "Hetauda"
];

export default function WorkerSignup() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [userFormData, setUserFormData] = useState<UserFormData | null>(null);
  const { toast } = useToast();

  const userForm = useForm<UserFormData>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      role: "professional",
    },
  });

  const professionalForm = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalDetailsSchema),
    defaultValues: {
      skills: [],
      serviceAreas: [],
      availabilityStatus: "available",
      isVerified: false,
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: Omit<UserFormData, "confirmPassword">) => {
      return apiRequest("POST", "/api/users", userData);
    },
  });

  const createProfessionalMutation = useMutation({
    mutationFn: async (data: { userId: string; professionalData: Omit<ProfessionalFormData, "terms"> }) => {
      return apiRequest("POST", "/api/professionals", {
        ...data.professionalData,
        userId: data.userId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "Welcome to जरूरी छ! Your profile is being reviewed and you'll hear from us soon.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Registration Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onUserSubmit = async (data: UserFormData) => {
    try {
      const { confirmPassword, ...userData } = data;
      const response = await createUserMutation.mutateAsync(userData);
      setUserFormData(data);
      setStep(2);
      toast({
        title: "Step 1 Complete",
        description: "Now let's set up your professional profile.",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "A user with this email may already exist.",
        variant: "destructive",
      });
    }
  };

  const onProfessionalSubmit = async (data: ProfessionalFormData) => {
    if (!userFormData) return;
    
    // Mock user ID for demo - in real app this would come from the user creation response
    const userId = "demo-user-id";
    const { terms, ...professionalData } = data;
    
    createProfessionalMutation.mutate({
      userId,
      professionalData,
    });
  };

  const handleSkillToggle = (skill: string) => {
    const currentSkills = professionalForm.watch("skills") || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    professionalForm.setValue("skills", newSkills);
  };

  const handleLocationToggle = (location: string) => {
    const currentAreas = professionalForm.watch("serviceAreas") || [];
    const newAreas = currentAreas.includes(location)
      ? currentAreas.filter(l => l !== location)
      : [...currentAreas, location];
    professionalForm.setValue("serviceAreas", newAreas);
  };

  const progress = (step / 2) * 100;

  return (
    <div className="min-h-screen bg-[hsl(210,17%,98%)] font-inter">
      <Header />
      
      <main className="pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="font-nepali text-[hsl(16,100%,60%)]">पेशेवर बन्नुहोस्</span><br />
              Become a Professional
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Join thousands of professionals earning money by providing quality services to customers across Nepal.
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Step {step} of 2</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Benefits Section */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <Card key={benefit.title} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <benefit.icon className={`h-12 w-12 mx-auto mb-4 ${benefit.color}`} />
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </Card>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {step === 1 ? (
                <Card className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-[hsl(16,100%,60%)] rounded-full flex items-center justify-center mr-4">
                      <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
                      <p className="text-gray-600">Let's start with your basic information</p>
                    </div>
                  </div>

                  <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          {...userForm.register("fullName")}
                          placeholder="Your full name"
                        />
                        {userForm.formState.errors.fullName && (
                          <p className="text-red-500 text-sm mt-1">{userForm.formState.errors.fullName.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="username">Username *</Label>
                        <Input
                          id="username"
                          {...userForm.register("username")}
                          placeholder="Choose a username"
                        />
                        {userForm.formState.errors.username && (
                          <p className="text-red-500 text-sm mt-1">{userForm.formState.errors.username.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...userForm.register("email")}
                          placeholder="your@email.com"
                        />
                        {userForm.formState.errors.email && (
                          <p className="text-red-500 text-sm mt-1">{userForm.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          {...userForm.register("phone")}
                          placeholder="+977-1-2345678"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          {...userForm.register("password")}
                          placeholder="Create a strong password"
                        />
                        {userForm.formState.errors.password && (
                          <p className="text-red-500 text-sm mt-1">{userForm.formState.errors.password.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...userForm.register("confirmPassword")}
                          placeholder="Confirm your password"
                        />
                        {userForm.formState.errors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">{userForm.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={createUserMutation.isPending}
                      className="w-full bg-[hsl(16,100%,60%)] hover:bg-[hsl(16,100%,55%)] text-white py-3 rounded-lg font-semibold mountain-shadow"
                    >
                      {createUserMutation.isPending ? "Creating Account..." : "Continue to Professional Details"}
                    </Button>
                  </form>
                </Card>
              ) : (
                <Card className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-[hsl(151,55%,35%)] rounded-full flex items-center justify-center mr-4">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Professional Details</h2>
                      <p className="text-gray-600">Tell us about your skills and experience</p>
                    </div>
                  </div>

                  <form onSubmit={professionalForm.handleSubmit(onProfessionalSubmit)} className="space-y-6">
                    <div>
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        {...professionalForm.register("bio")}
                        placeholder="Tell customers about your experience and expertise..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                          id="experience"
                          type="number"
                          {...professionalForm.register("experience", { valueAsNumber: true })}
                          placeholder="e.g., 5"
                          min="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor="hourlyRate">Hourly Rate (NPR)</Label>
                        <Input
                          id="hourlyRate"
                          {...professionalForm.register("hourlyRate")}
                          placeholder="e.g., 500"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold">Skills & Services *</Label>
                      <p className="text-sm text-gray-600 mb-3">Select all services you can provide</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {skillOptions.map((skill) => {
                          const isSelected = professionalForm.watch("skills")?.includes(skill);
                          return (
                            <div
                              key={skill}
                              onClick={() => handleSkillToggle(skill)}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                isSelected
                                  ? "border-[hsl(16,100%,60%)] bg-[hsl(16,100%,60%)]/10"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox checked={isSelected} readOnly />
                                <span className="text-sm font-medium">{skill}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {professionalForm.formState.errors.skills && (
                        <p className="text-red-500 text-sm mt-1">{professionalForm.formState.errors.skills.message}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-semibold">Service Areas *</Label>
                      <p className="text-sm text-gray-600 mb-3">Select locations where you can provide services</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {locationOptions.map((location) => {
                          const isSelected = professionalForm.watch("serviceAreas")?.includes(location);
                          return (
                            <div
                              key={location}
                              onClick={() => handleLocationToggle(location)}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                isSelected
                                  ? "border-[hsl(16,100%,60%)] bg-[hsl(16,100%,60%)]/10"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox checked={isSelected} readOnly />
                                <span className="text-sm font-medium">{location}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {professionalForm.formState.errors.serviceAreas && (
                        <p className="text-red-500 text-sm mt-1">{professionalForm.formState.errors.serviceAreas.message}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={professionalForm.watch("terms")}
                        onCheckedChange={(checked) => professionalForm.setValue("terms", checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the <a href="/terms" className="text-[hsl(16,100%,60%)] hover:underline">Terms of Service</a> and <a href="/privacy" className="text-[hsl(16,100%,60%)] hover:underline">Privacy Policy</a>
                      </Label>
                    </div>
                    {professionalForm.formState.errors.terms && (
                      <p className="text-red-500 text-sm">{professionalForm.formState.errors.terms.message}</p>
                    )}

                    <div className="flex space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={createProfessionalMutation.isPending}
                        className="flex-1 bg-[hsl(16,100%,60%)] hover:bg-[hsl(16,100%,55%)] text-white py-3 rounded-lg font-semibold mountain-shadow"
                      >
                        {createProfessionalMutation.isPending ? "Registering..." : "Complete Registration"}
                      </Button>
                    </div>
                  </form>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[hsl(16,100%,60%)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Profile Review</h4>
                      <p className="text-sm text-gray-600">We'll review your application within 24-48 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[hsl(151,55%,35%)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Background Check</h4>
                      <p className="text-sm text-gray-600">Identity and skill verification process</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[hsl(51,85%,55%)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Start Earning</h4>
                      <p className="text-sm text-gray-600">Get your first jobs and start building your reputation</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[hsl(210,17%,98%)] rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Our support team is here to help you get started.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
