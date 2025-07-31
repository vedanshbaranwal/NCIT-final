import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Phone, Mail, MapPin } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-[hsl(16,100%,60%)] to-[hsl(51,85%,55%)] rounded-lg flex items-center justify-center">
              <i className="fas fa-hands-helping text-white text-lg"></i>
            </div>
            <div>
              <h1 className="font-nepali font-bold text-xl text-gray-900">जरूरी छ</h1>
              <p className="text-xs text-gray-600 leading-none">आवश्यकतामा रोजगार</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/" 
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      isActive('/') ? 'text-[hsl(16,100%,60%)]' : 'text-gray-700 hover:text-[hsl(16,100%,60%)]'
                    }`}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-[hsl(16,100%,60%)] font-medium">
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-96">
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/services?category=electrician" className="block p-3 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-bolt text-yellow-500"></i>
                          <span className="font-medium">Electrician</span>
                        </div>
                      </Link>
                      <Link href="/services?category=plumber" className="block p-3 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-wrench text-blue-500"></i>
                          <span className="font-medium">Plumber</span>
                        </div>
                      </Link>
                      <Link href="/services?category=cleaning" className="block p-3 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-broom text-green-500"></i>
                          <span className="font-medium">Cleaning</span>
                        </div>
                      </Link>
                      <Link href="/services?category=carpenter" className="block p-3 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-hammer text-amber-500"></i>
                          <span className="font-medium">Carpenter</span>
                        </div>
                      </Link>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Link href="/services" className="text-sm text-[hsl(16,100%,60%)] hover:underline">
                        View All Services →
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/#why-us" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[hsl(16,100%,60%)] transition-colors">
                    Why Us
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/#how-it-works" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[hsl(16,100%,60%)] transition-colors">
                    How It Works
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/worker-signup" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[hsl(16,100%,60%)] transition-colors">
                    For Professionals
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
              <button className="px-3 py-1 text-sm font-medium bg-white text-[hsl(16,100%,60%)] rounded-md shadow-sm">
                EN
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-[hsl(16,100%,60%)]">
                NP
              </button>
            </div>
            
            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" className="text-gray-700 hover:text-[hsl(16,100%,60%)]">
                Login
              </Button>
              <Button className="bg-[hsl(16,100%,60%)] hover:bg-[hsl(16,100%,55%)] text-white mountain-shadow">
                Sign Up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[hsl(16,100%,60%)] to-[hsl(51,85%,55%)] rounded-lg flex items-center justify-center">
                      <i className="fas fa-hands-helping text-white text-sm"></i>
                    </div>
                    <span className="font-nepali font-bold">जरूरी छ</span>
                  </SheetTitle>
                  <SheetDescription>
                    Nepal's trusted service platform
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-8 space-y-4">
                  <Link href="/" className="block py-2 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Home
                  </Link>
                  <Link href="/services" className="block py-2 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Services
                  </Link>
                  <Link href="/worker-signup" className="block py-2 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                    For Professionals
                  </Link>
                  
                  <div className="pt-4 border-t space-y-3">
                    <Button className="w-full bg-[hsl(16,100%,60%)] hover:bg-[hsl(16,100%,55%)]">
                      Sign Up
                    </Button>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </div>

                  <div className="pt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>+977-1-4444444</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>support@jaruricha.com</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Kathmandu, Nepal</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
