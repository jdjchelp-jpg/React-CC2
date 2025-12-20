import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plane, Globe2, Clock, MapPin, Users, Calendar } from 'lucide-react';
import SantaTracker3D from './SantaTracker3D';

interface SantaInfo {
  now: number;
  takeoff: number;
  location?: {
    lat: number;
    lng: number;
  };
  route?: {
    destinations: string;
  };
}

interface Destination {
  id: string;
  arrival: number;
  departure: number;
  city: string;
  region: string;
  location: {
    lat: number;
    lng: number;
  };
  population?: number;
}

export default function TrackSanta() {
  const [santaInfo, setSantaInfo] = useState<SantaInfo | null>(null);
  const [route, setRoute] = useState<Destination[]>([]);
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view3D, setView3D] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const santaMarker = useRef<any>(null);
  const routeLine = useRef<any>(null);

  useEffect(() => {
    const checkSecretCode = () => {
      const saved = localStorage.getItem('santaTrackerSecretCode');
      if (saved === '333') {
        setPreviewMode(true);
      }
    };
    checkSecretCode();

    fetchSantaInfo();
    const interval = setInterval(fetchSantaInfo, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (santaInfo?.route?.destinations) {
      fetchRoute(santaInfo.route.destinations);
    }
  }, [santaInfo]);

  useEffect(() => {
    if (route.length > 0 && santaInfo) {
      updateCurrentDestination();
      const interval = setInterval(updateCurrentDestination, 1000);
      return () => clearInterval(interval);
    }
  }, [route, santaInfo]);

  useEffect(() => {
    if (!view3D && mapRef.current && !mapInstance.current) {
      loadLeafletAndInitMap();
    }
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [view3D]);

  useEffect(() => {
    if (currentDestination && mapInstance.current && !view3D) {
      updateMap();
    }
  }, [currentDestination, view3D]);

  const loadLeafletAndInitMap = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      const leafletModule = await import('leaflet' as any);
      const L = leafletModule.default;
      
      if (!mapRef.current || mapInstance.current) return;

      const map = L.map(mapRef.current).setView([0, 0], 2);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstance.current = map;

      const santaIcon = L.divIcon({
        className: 'santa-marker',
        html: '<div style="font-size: 32px;">🎅</div>',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      santaMarker.current = L.marker([0, 0], { icon: santaIcon }).addTo(map);
    } catch (err) {
      console.error('Failed to load Leaflet:', err);
    }
  };

  const fetchSantaInfo = async () => {
    try {
      const response = await fetch('https://santa-api.appspot.com/info?client=web');
      const data = await response.json();
      setSantaInfo(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch Santa info:', err);
      setError('Failed to load Santa tracker');
      setLoading(false);
    }
  };

  const fetchRoute = async (routeUrl: string) => {
    try {
      const response = await fetch(routeUrl);
      const data = await response.json();
      if (data.destinations) {
        setRoute(data.destinations);
      }
    } catch (err) {
      console.error('Failed to fetch route:', err);
    }
  };

  const updateCurrentDestination = () => {
    if (!santaInfo || route.length === 0) return;

    const now = Date.now();
    
    for (const dest of route) {
      if (now >= dest.arrival && now <= dest.departure) {
        setCurrentDestination(dest);
        return;
      }
    }

    const nextDest = route.find(dest => now < dest.arrival);
    if (nextDest) {
      const prevIndex = route.indexOf(nextDest) - 1;
      if (prevIndex >= 0) {
        setCurrentDestination(route[prevIndex]);
      }
    } else if (route.length > 0) {
      setCurrentDestination(route[route.length - 1]);
    }
  };

  const updateMap = async () => {
    if (!currentDestination || !mapInstance.current || !santaMarker.current) return;

    try {
      const leafletModule = await import('leaflet' as any);
      const L = leafletModule.default;
      const { lat, lng } = currentDestination.location;
      
      santaMarker.current.setLatLng([lat, lng]);
      mapInstance.current.setView([lat, lng], 6, { animate: true });

      if (routeLine.current) {
        routeLine.current.remove();
      }

      const routeCoords = route.map(dest => [dest.location.lat, dest.location.lng] as [number, number]);
      routeLine.current = L.polyline(routeCoords, {
        color: '#ef4444',
        weight: 3,
        opacity: 0.6,
        dashArray: '10, 10',
      }).addTo(mapInstance.current);
    } catch (err) {
      console.error('Failed to update map:', err);
    }
  };

  const getTimeUntilTakeoff = () => {
    if (!santaInfo) return 'Loading...';
    
    if (previewMode) {
      return 'Preview Mode Active';
    }
    
    const diff = santaInfo.takeoff - santaInfo.now;
    if (diff <= 0) return 'Santa is flying!';
    
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    
    if (totalHours >= 24) {
      const days = Math.floor(totalHours / 24);
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else {
      const hours = totalHours;
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return `${hours}h ${minutes}m ${seconds}s`;
    }
  };

  const hasLaunched = (santaInfo && santaInfo.now >= santaInfo.takeoff) || previewMode;

  const handleSecretCodeInput = (e: React.KeyboardEvent) => {
    const key = e.key;
    if (key >= '0' && key <= '9') {
      const newCode = (secretCode + key).slice(-3);
      setSecretCode(newCode);
      if (newCode === '333') {
        localStorage.setItem('santaTrackerSecretCode', '333');
        setPreviewMode(true);
      }
    } else if (key === 'Escape') {
      setSecretCode('');
      localStorage.removeItem('santaTrackerSecretCode');
      setPreviewMode(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
        <div className="text-center text-white">
          <Plane className="w-16 h-16 mx-auto mb-4 animate-bounce" />
          <p className="text-xl">Loading Santa Tracker...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
        <div className="text-center text-white">
          <p className="text-xl text-red-300">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4" onKeyDown={handleSecretCodeInput} tabIndex={0}>
      <Card className="p-4 bg-gradient-to-br from-red-600/30 to-green-700/30 border-4 border-yellow-400/70 backdrop-blur-md min-h-[600px]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plane className="w-6 h-6 text-yellow-300" />
            Track Santa
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setView3D(false)}
              variant={!view3D ? 'default' : 'outline'}
              size="sm"
              className={!view3D ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white'}
            >
              <MapPin className="w-4 h-4 mr-1" />
              2D Map
            </Button>
            <Button
              onClick={() => setView3D(true)}
              variant={view3D ? 'default' : 'outline'}
              size="sm"
              className={view3D ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white'}
            >
              <Globe2 className="w-4 h-4 mr-1" />
              3D Globe
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-white mb-1">
              <Clock className="w-4 h-4" />
              <span className="font-semibold text-sm">Status</span>
            </div>
            <Badge className={`text-base ${hasLaunched ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
              {hasLaunched ? 'Flying!' : 'Preparing'}
            </Badge>
          </div>

          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-white mb-1">
              <Clock className="w-4 h-4" />
              <span className="font-semibold text-sm">{hasLaunched ? 'Current Location' : 'Launch In'}</span>
            </div>
            <p className="text-white text-base">
              {hasLaunched ? (currentDestination?.city || 'Traveling') : getTimeUntilTakeoff()}
            </p>
          </div>

          {currentDestination && hasLaunched && (
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm md:col-span-2">
              <div className="flex items-center gap-2 text-white mb-1">
                <Users className="w-4 h-4" />
                <span className="font-semibold text-sm">Population</span>
              </div>
              <p className="text-white text-base">
                {currentDestination.population?.toLocaleString() || 'N/A'}
              </p>
            </div>
          )}
        </div>

        {!hasLaunched && (
          <div className="bg-blue-500/20 border-2 border-blue-400/50 rounded-lg p-6 mt-4">
            <p className="text-lg mb-3 font-semibold text-white">ℹ️ Information</p>
            <p className="text-base leading-relaxed text-white">
              Santa has not taken off yet.<br />
              Check back on Christmas Eve to track Santa's journey across the world.
            </p>
          </div>
        )}

        {hasLaunched && (
          <div className="mt-4 h-[400px] rounded-lg overflow-hidden">
            {!view3D ? (
              <div ref={mapRef} className="w-full h-full" />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-blue-900 to-black">
                <SantaTracker3D 
                  currentDestination={currentDestination}
                  route={route}
                  santaInfo={santaInfo}
                />
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
