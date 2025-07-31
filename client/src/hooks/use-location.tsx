import { useState, useEffect } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  error?: string;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocation({ 
        latitude: 0, 
        longitude: 0, 
        error: 'Geolocation is not supported by this browser.' 
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // In a real app, you'd use a geocoding service to get city name
          // For now, we'll just set default to Kathmandu
          const city = 'Kathmandu';
          
          setLocation({ latitude, longitude, city });
        } catch (error) {
          setLocation({ latitude, longitude, error: 'Failed to get location details' });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLocation({ 
          latitude: 27.7172, // Default to Kathmandu coordinates
          longitude: 85.3240,
          city: 'Kathmandu',
          error: 'Location access denied. Showing default location.' 
        });
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return { location, loading, getCurrentLocation };
}
