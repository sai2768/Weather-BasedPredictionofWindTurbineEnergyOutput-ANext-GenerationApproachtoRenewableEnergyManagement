import { Cloud, Wind, Droplets, Gauge } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherCardProps {
  weather: WeatherData | null;
  loading: boolean;
}

export default function WeatherCard({ weather, loading }: WeatherCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500">
          <Cloud className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Enter a city name to get weather data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
      <div className="mb-4">
        <h2 className="text-3xl font-bold">{weather.city}</h2>
        <p className="text-blue-100 capitalize">{weather.description}</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="text-6xl font-bold">{Math.round(weather.temperature)}°C</div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="w-24 h-24"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Wind className="w-5 h-5" />
          <div>
            <p className="text-sm text-blue-100">Wind Speed</p>
            <p className="font-semibold">{weather.windSpeed} m/s</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Cloud className="w-5 h-5" />
          <div>
            <p className="text-sm text-blue-100">Direction</p>
            <p className="font-semibold">{weather.windDirection}°</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Droplets className="w-5 h-5" />
          <div>
            <p className="text-sm text-blue-100">Humidity</p>
            <p className="font-semibold">{weather.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Gauge className="w-5 h-5" />
          <div>
            <p className="text-sm text-blue-100">Pressure</p>
            <p className="font-semibold">{weather.pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
