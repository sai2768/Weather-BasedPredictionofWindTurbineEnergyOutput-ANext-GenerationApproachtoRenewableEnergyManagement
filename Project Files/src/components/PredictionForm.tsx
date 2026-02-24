import { useState } from 'react';
import { Zap, TrendingUp } from 'lucide-react';
import { PredictionInput, WeatherData } from '../types';

interface PredictionFormProps {
  weather: WeatherData | null;
  onPredict: (input: PredictionInput) => void;
  prediction: number | null;
  loading: boolean;
}

export default function PredictionForm({
  weather,
  onPredict,
  prediction,
  loading,
}: PredictionFormProps) {
  const [formData, setFormData] = useState<PredictionInput>({
    windSpeed: 0,
    windDirection: 0,
    temperature: 0,
    pressure: 0,
    humidity: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict(formData);
  };

  const handleUseWeatherData = () => {
    if (weather) {
      setFormData({
        windSpeed: weather.windSpeed,
        windDirection: weather.windDirection,
        temperature: weather.temperature,
        pressure: weather.pressure,
        humidity: weather.humidity,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Zap className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-800">Energy Prediction</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wind Speed (m/s)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.windSpeed}
            onChange={(e) =>
              setFormData({ ...formData, windSpeed: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wind Direction (degrees)
          </label>
          <input
            type="number"
            step="1"
            min="0"
            max="360"
            value={formData.windDirection}
            onChange={(e) =>
              setFormData({ ...formData, windDirection: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temperature (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.temperature}
            onChange={(e) =>
              setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pressure (hPa)
          </label>
          <input
            type="number"
            step="1"
            value={formData.pressure}
            onChange={(e) =>
              setFormData({ ...formData, pressure: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Humidity (%)
          </label>
          <input
            type="number"
            step="1"
            min="0"
            max="100"
            value={formData.humidity}
            onChange={(e) =>
              setFormData({ ...formData, humidity: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {weather && (
          <button
            type="button"
            onClick={handleUseWeatherData}
            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Use Current Weather Data
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Predicting...' : 'Predict Energy Output'}
        </button>
      </form>

      {prediction !== null && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Predicted Power Output</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{prediction.toFixed(2)} kW</p>
          <p className="text-sm text-green-700 mt-1">
            Based on provided weather conditions
          </p>
        </div>
      )}
    </div>
  );
}
