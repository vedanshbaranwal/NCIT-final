import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Clock, MapPin, Calendar as CalendarIcon, CreditCard, Banknote, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const bookingFormSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  customerLocation: z.string().min(1, "Location is required"),
  scheduledDate: z.date({ required_error: "Date is required" }),
  paymentMethod: z.enum(["cash", "online", "card"], {
    required_error: "Payment method is required",
  }),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function NewBooking() {
  const params = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const serviceId = params.serviceId;
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Fetch service details
  const { data: service, isLoading: serviceLoading } = useQuery({
    queryKey: ["/api/services", serviceId],
    queryFn: async () => {
      if (!serviceId) return null;
      const response = await fetch(`/api/services/${serviceId}`);
      if (!response.ok) throw new Error("Failed to fetch service");
      return response.json();
    },
    enabled: !!serviceId,
  });

  // Fetch locations
  const { data: locations } = useQuery({
    queryKey: ["/api/locations"],
    queryFn: async () => {
      const response = await fetch("/api/locations");
      if (!response.ok) throw new Error("Failed to fetch locations");
      return response.json();
    },
  });

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceId: serviceId || "",
      customerName: user?.fullName || "",
      customerEmail: user?.email || "",
      customerPhone: user?.phone || "",
      customerLocation: user?.location || "",
      paymentMethod: "cash",
      specialRequests: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      console.log("Submitting booking data:", data);
      
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          estimatedPrice: service ? service.basePrice : "0",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create booking");
      }

      return response.json();
    },
    onSuccess: (booking) => {
      toast({
        title: "Booking Successful!",
        description: `Your service has been booked! Booking ID: ${booking.id}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Please check your details and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    if (!selectedDate) {
      toast({
        title: "Date Required",
        description: "Please select a date for your service.",
        variant: "destructive",
      });
      return;
    }

    bookingMutation.mutate({
      ...data,
      scheduledDate: selectedDate,
    });
  };

  if (serviceLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-8 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-8 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
              <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
              <Button onClick={() => setLocation("/services")}>
                Browse All Services
              </Button>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Authentication Alert */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You can book as a guest, but{" "}
                <Button variant="link" className="p-0 h-auto" onClick={() => setLocation("/login")}>
                  sign in
                </Button>
                {" "}to track your bookings and get updates.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      <main className="pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Book {service.name}
            </h1>
            <p className="text-gray-600">{service.description}</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Details */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.nameNepali}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.estimatedDuration} mins
                      </span>
                      <span>NPR {service.basePrice}/{service.unit}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Customer Information */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      {...form.register("customerName")}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                    {form.formState.errors.customerName && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="customerEmail">Email *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      {...form.register("customerEmail")}
                      placeholder="your.email@example.com"
                      className="mt-1"
                    />
                    {form.formState.errors.customerEmail && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerEmail.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input
                      id="customerPhone"
                      {...form.register("customerPhone")}
                      placeholder="98xxxxxxxx"
                      className="mt-1"
                    />
                    {form.formState.errors.customerPhone && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerPhone.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="customerLocation">Location *</Label>
                    <Select onValueChange={(value) => form.setValue("customerLocation", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations?.map((location: any) => (
                          <SelectItem key={location.id} value={location.name}>
                            {location.name} ({location.nameNepali})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.customerLocation && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerLocation.message}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Date Selection */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  <CalendarIcon className="inline h-5 w-5 mr-2" />
                  Select Date & Time
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label>Preferred Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                <RadioGroup 
                  value={form.watch("paymentMethod")} 
                  onValueChange={(value) => form.setValue("paymentMethod", value as "cash" | "online" | "card")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center">
                      <Banknote className="h-4 w-4 mr-2" />
                      Cash on Delivery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Online Payment
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Card Payment
                    </Label>
                  </div>
                </RadioGroup>
              </Card>

              {/* Special Requests */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Special Requests</h2>
                <Textarea
                  {...form.register("specialRequests")}
                  placeholder="Any special instructions or requirements..."
                  className="min-h-[100px]"
                />
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Service Price</span>
                    <span>NPR {service.basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>NPR {Math.round(parseFloat(service.basePrice) * 0.1)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>NPR {Math.round(parseFloat(service.basePrice) * 1.1)}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? (
                    "Booking..."
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </Button>
              </Card>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}