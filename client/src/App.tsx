import { Switch, Route } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { Chatbot } from "@/components/chatbot/chatbot";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Booking from "@/pages/booking";
import WorkerSignup from "@/pages/worker-signup";
import Login from "@/pages/login";
import Register from "@/pages/register";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/booking/:serviceId?" component={Booking} />
      <Route path="/worker-signup" component={WorkerSignup} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { data: services } = useQuery({
    queryKey: ['/api/services'],
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  return (
    <>
      <Router />
      {/* Global AI Chatbot - Available on all pages */}
      <Chatbot services={services as any[]} categories={categories as any[]} />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
