import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Cloud, CloudSnow, Sun, CloudRain, Wind } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'snowy' | 'rainy';
  location: string;
}

export default function WeatherSnapshot() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 32,
    condition: 'snowy',
    location: 'North Pole',
  });

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="w-12 h-12 text-yellow-400" />;
      case 'cloudy':
        return <Cloud className="w-12 h-12 text-gray-300" />;
      case 'snowy':
        return <CloudSnow className="w-12 h-12 text-blue-300" />;
      case 'rainy':
        return <CloudRain className="w-12 h-12 text-blue-400" />;
      default:
        return <Wind className="w-12 h-12 text-white" />;
    }
  };

  const getWeatherMessage = () => {
    if (weather.temp < 32) {
      return "Perfect weather for building snowmen! ⛄";
    } else if (weather.temp < 50) {
      return "Bundle up for Christmas cheer! 🧣";
    } else {
      return "Warm Christmas vibes! 🎄";
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 w-full max-w-sm">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <CloudSnow className="w-5 h-5" />
          Christmas Weather
        </h3>
        
        <div className="flex items-center justify-center">
          {getWeatherIcon()}
        </div>
        
        <div className="space-y-2">
          <div className="text-4xl font-bold text-white">
            {weather.temp}°F
          </div>
          <div className="text-white/80 capitalize">
            {weather.condition} in {weather.location}
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-white/90 text-sm">
            {getWeatherMessage()}
          </p>
        </div>
      </div>
    </Card>
  );
}
