import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, MapPin, User, Wrench, Clock } from "lucide-react";

interface BookingWithDetails {
  id: string;
  status: string;
  scheduledDate: string;
  location: string;
  address: string;
  estimatedPrice: string;
  paymentMethod: string;
  description: string;
  customer: {
    id: string;
    fullName: string;
    phone: string;
    email: string;
  } | null;
  service: {
    id: string;
    name: string;
    nameNepali: string;
    basePrice: string;
  } | null;
  professional: {
    id: string;
    fullName: string;
    phone: string;
    rating: string;
  } | null;
}

export default function AdminDashboard() {
  const { data: bookings, isLoading } = useQuery<BookingWithDetails[]>({
    queryKey: ["/api/bookings"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "assigned": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const stats = {
    total: bookings?.length || 0,
    pending: bookings?.filter(b => b.status === "pending").length || 0,
    assigned: bookings?.filter(b => b.status === "assigned").length || 0,
    completed: bookings?.filter(b => b.status === "completed").length || 0,
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings and monitor service requests</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-blue-600">जरूरी छ</h2>
          <p className="text-sm text-gray-500">Service Management</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.assigned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        {bookings && bookings.length > 0 ? (
          bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">
                      {booking.service?.name || "Unknown Service"}
                    </CardTitle>
                    {booking.service?.nameNepali && (
                      <span className="text-sm text-gray-500">
                        ({booking.service.nameNepali})
                      </span>
                    )}
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
                <CardDescription>
                  Booking ID: {booking.id.substring(0, 8)}...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Customer Info */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Customer
                    </h4>
                    {booking.customer ? (
                      <div className="text-sm space-y-1">
                        <p>{booking.customer.fullName}</p>
                        <p className="flex items-center text-gray-600">
                          <Phone className="w-3 h-3 mr-1" />
                          {booking.customer.phone || "No phone"}
                        </p>
                        <p className="text-gray-600">{booking.customer.email}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Guest booking</p>
                    )}
                  </div>

                  {/* Service & Schedule */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Schedule
                    </h4>
                    <div className="text-sm space-y-1">
                      <p className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(booking.scheduledDate)}
                      </p>
                      <p className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {booking.location}
                      </p>
                      <p className="text-gray-600">{booking.address}</p>
                    </div>
                  </div>

                  {/* Professional & Price */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Wrench className="w-4 h-4 mr-2" />
                      Assignment
                    </h4>
                    <div className="text-sm space-y-1">
                      {booking.professional ? (
                        <>
                          <p>{booking.professional.fullName}</p>
                          <p className="text-gray-600">{booking.professional.phone}</p>
                          <p className="text-yellow-600">
                            ⭐ {booking.professional.rating}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">Not assigned</p>
                      )}
                      <p className="font-medium text-green-600">
                        Rs. {booking.estimatedPrice}
                      </p>
                    </div>
                  </div>
                </div>

                {booking.description && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Description:</strong> {booking.description}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex space-x-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  {booking.status === "pending" && (
                    <Button size="sm">
                      Assign Professional
                    </Button>
                  )}
                  {booking.status === "assigned" && (
                    <Button size="sm" variant="secondary">
                      Mark In Progress
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No bookings found</p>
              <p className="text-sm text-gray-400 mt-2">
                Bookings will appear here once customers start making service requests
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Zapier Integration Info */}
      <Card className="mt-8 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">Zapier Integration Status</CardTitle>
          <CardDescription>
            Automated SMS and data sync with external services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Active Webhooks:</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  New Booking Notifications
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Professional Assignment SMS
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Status Update Notifications
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Google Sheets Sync
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Setup Instructions:</h4>
              <p className="text-sm text-gray-600 mb-2">
                Follow the guides to connect with Zapier:
              </p>
              <ul className="text-sm space-y-1">
                <li>• ZAPIER_SETUP_GUIDE.md</li>
                <li>• ZAPIER_SMS_INTEGRATION.md</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}