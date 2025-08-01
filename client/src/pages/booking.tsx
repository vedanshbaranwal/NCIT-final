import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Clock, MapPin, Star, Calendar as CalendarIcon, CreditCard, Banknote, Smartphone, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertBookingSchema } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

type BookingFormData = z.infer<typeof insertBookingSchema>;

const bookingFormSchema = insertBookingSchema.extend({
  scheduledDate: z.date({
    required_error: "Please select a date and time for your service.",
  }),
});

type ExtendedBookingFormData = z.infer<typeof bookingFormSchema>;

export default function Booking() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const serviceId = params.serviceId;
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");

  const { data: service, isLoading: serviceLoading } = useQuery({
    queryKey: ["/api/services", serviceId],
    enabled: !!serviceId,
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["/api/locations"],
  });

  const { data: professionals = [] } = useQuery({
    queryKey: ["/api/professionals"],
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExtendedBookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceId: serviceId || "",
      customerName: user?.fullName || "",
      customerEmail: user?.email || "",
      customerPhone: user?.phone || "",
      location: user?.location || "",
      paymentMethod: "cash",
      address: "",
      specialRequests: "",
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (serviceId) {
      setValue("serviceId", serviceId);
    }
  }, [serviceId, setValue]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const scheduledDate = new Date(selectedDate);
      scheduledDate.setHours(hours, minutes, 0, 0);
      setValue("scheduledDate", scheduledDate);
    }
  }, [selectedDate, selectedTime, setValue]);

  const bookingMutation = useMutation({
    mutationFn: async (data: ExtendedBookingFormData) => {
      // Prepare booking data with estimated price
      const bookingData = {
        serviceId: data.serviceId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        location: data.location,
        address: data.address,
        scheduledDate: data.scheduledDate,
        specialRequests: data.specialRequests || "",
        paymentMethod: data.paymentMethod,
        estimatedPrice: estimatedPrice.toString(),
        customerId: user?.id || null,
      };
      
      console.log("Submitting booking data:", bookingData);
      
      const response = await apiRequest("/api/bookings", {
        method: "POST",
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Booking failed");
      }
      
      return await response.json();
    },
    onSuccess: (booking: any) => {
      console.log("Booking successful:", booking);
      toast({
        title: "Booking Confirmed! ✅",
        description: `Your ${service?.name} has been booked successfully. Booking ID: ${booking.id}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      
      // Reset form state
      setSelectedDate(undefined);
      setSelectedTime("");
      
      // Redirect after 2 seconds
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    },
    onError: (error: any) => {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed ❌",
        description: error.message || "Please check your details and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ExtendedBookingFormData) => {
    bookingMutation.mutate(data);
  };

  // Calculate estimated price
  const estimatedPrice = service ? parseFloat((service as any).basePrice) : 0;
  const serviceFee = estimatedPrice * 0.1; // 10% service fee
  const totalPrice = estimatedPrice + serviceFee;

  // Generate time slots
  const timeSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      timeSlots.push(timeString);
    }
  }

  if (serviceLoading) {
    return (
      <div className="min-h-screen bg-[hsl(210,17%,98%)] font-inter">
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
      <div className="min-h-screen bg-[hsl(210,17%,98%)] font-inter">
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
    <div className="min-h-screen bg-[hsl(210,17%,98%)] font-inter">
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
      
      {/* Success Message */}
      {bookingMutation.isSuccess && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-800">
                Booking successfully submitted! You will receive confirmation shortly.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
      
      <main className="pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Book {(service as any).name}
            </h1>
            <p className="text-gray-600">{(service as any).description}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Details */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[hsl(16,100%,60%)] to-[hsl(51,85%,55%)] rounded-lg flex items-center justify-center">
                    <i className="fas fa-bolt text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{(service as any).name}</h3>
                    {(service as any).nameNepali && (
                      <p className="text-sm text-gray-600 font-nepali">{(service as any).nameNepali}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {(service as any).estimatedDuration} mins
                      </span>
                      <span>NPR {(service as any).basePrice}/{(service as any).unit}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Location */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  <MapPin className="inline h-5 w-5 mr-2" />
                  Service Location
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location">City/Area *</Label>
                    <Select onValueChange={(value) => setValue("location", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your location" />
                      </SelectTrigger>
                      <SelectContent>
                        {(locations as any[])?.map((location: any) => (
                          <SelectItem key={location.id} value={location.name}>
                            {location.name} ({location.nameNepali})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      {...register("address")}
                      placeholder="Enter your complete address including landmarks"
                      rows={3}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Date & Time */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  <CalendarIcon className="inline h-5 w-5 mr-2" />
                  Schedule Service
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Select Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date: Date) => date < new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label>Select Time *</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {errors.scheduledDate && (
                  <p className="text-red-500 text-sm mt-2">{errors.scheduledDate.message}</p>
                )}
              </Card>

              {/* Additional Details */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Service Description</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Describe what exactly needs to be done"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="specialRequirements">Special Requirements</Label>
                    <Textarea
                      id="specialRequirements"
                      {...register("specialRequirements")}
                      placeholder="Any special tools, materials, or requirements"
                      rows={2}
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                <RadioGroup
                  defaultValue="cash"
                  onValueChange={(value) => setValue("paymentMethod", value as "cash" | "online" | "card")}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center cursor-pointer">
                        <Banknote className="h-5 w-5 mr-2 text-green-600" />
                        Cash on Service Completion
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex items-center cursor-pointer">
                        <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
                        Online Payment (eSewa, Khalti)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center cursor-pointer">
                        <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                        Credit/Debit Card
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium">{(service as any).name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price</span>
                    <span className="font-medium">NPR {estimatedPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">NPR {serviceFee.toFixed(2)}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-[hsl(16,100%,60%)]">NPR {totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {selectedDate && selectedTime && (
                  <div className="mb-6 p-4 bg-[hsl(210,17%,98%)] rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Scheduled For:</h3>
                    <p className="text-sm text-gray-600">
                      {format(selectedDate, "EEEE, MMMM do, yyyy")} at {selectedTime}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!selectedDate || !selectedTime || bookingMutation.isPending}
                  className="w-full bg-[hsl(16,100%,60%)] hover:bg-[hsl(16,100%,55%)] text-white py-3 rounded-lg font-semibold"
                >
                  {bookingMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Booking...
                    </>
                  ) : (
                    `Book Service - NPR ${totalPrice.toFixed(2)}`
                  )}
                </Button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  By booking, you agree to our Terms of Service and Privacy Policy
                </p>
              </Card>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
