 import { useState } from "react";
import { Wind, Search } from "lucide-react";
import WeatherCard from "./components/WeatherCard";
import PredictionForm from "./components/PredictionForm";
import Turbine3D from "./components/Turbine3D";
import EnergyGauge from "./components/EnergyGauge";
import EnergyChart from "./components/EnergyChart";
import { WeatherData, PredictionInput } from "./types";

function App() {
  const [started, setStarted] = useState(false);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<{ time: string; value: number }[]>([]);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const BACKEND_URL = "http://localhost:5000";

  // 🎨 Dynamic Background
  const getBackground = () => {
    if (!weather)
      return "bg-gradient-to-br from-blue-900 via-cyan-800 to-green-700";

    const desc = weather.description.toLowerCase();

    if (desc.includes("rain"))
      return "bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900";

    if (desc.includes("clear"))
      return "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500";

    if (desc.includes("cloud"))
      return "bg-gradient-to-br from-gray-600 to-gray-900";

    if (desc.includes("storm"))
      return "bg-gradient-to-br from-black via-purple-900 to-gray-900";

    return "bg-gradient-to-br from-blue-900 via-cyan-800 to-green-700";
  };

  const fetchWeather = async () => {
    if (!city.trim()) return;

    setWeatherLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) throw new Error();

      const data = await response.json();

      setWeather({
        city: data.name,
        temperature: data.main.temp,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg || 0,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      });
    } catch {
      setError("Failed to fetch weather data");
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handlePredict = async (input: PredictionInput) => {
    setPredictionLoading(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await response.json();
      setPrediction(data.prediction);

      // Save history
      setHistory((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          value: data.prediction,
        },
      ]);
    } catch {
      setError("Backend not running");
    } finally {
      setPredictionLoading(false);
    }
  };

  const efficiency =
    prediction !== null
      ? Math.min((prediction / 2500) * 100, 100).toFixed(1)
      : "0";

  // 🌟 Landing Page
  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-green-700 text-white text-center">
        <Wind className="w-32 h-32 animate-spin" />
        <h1 className="text-5xl font-bold mt-6">
          Wind Energy AI Command Center
        </h1>
        <p className="mt-4 opacity-80 max-w-xl">
          Real-time weather. AI prediction. 3D turbine simulation.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="mt-8 px-12 py-4 bg-white text-blue-700 font-semibold rounded-xl shadow-xl hover:scale-110 transition"
        >
          Enter Control Center
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen ${getBackground()} transition-all duration-1000 overflow-hidden`}
    >
      {/* 3D Turbine */}
      {weather && <Turbine3D windSpeed={weather.windSpeed} />}

      <div className="relative z-10 container mx-auto px-4 py-8">

        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold">
            Wind Turbine Energy Predictor
          </h1>
        </div>

        {/* City Search */}
        <div className="max-w-4xl mx-auto mb-8 bg-white/20 backdrop-blur-xl p-6 rounded-xl">
          <div className="flex space-x-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="flex-1 px-4 py-3 rounded-lg text-black"
            />
            <button
              onClick={fetchWeather}
              className="px-6 py-3 bg-white text-blue-700 rounded-lg"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-200 text-center mb-4">{error}</div>
        )}

        {/* Weather + Prediction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <WeatherCard weather={weather} loading={weatherLoading} />
          <PredictionForm
            weather={weather}
            onPredict={handlePredict}
            prediction={prediction}
            loading={predictionLoading}
          />
        </div>

        {/* Analytics Section */}
        {prediction !== null && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 max-w-6xl mx-auto">

            <EnergyGauge value={prediction} />
            <EnergyChart data={history} />

            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">
                AI Efficiency Score
              </h3>
              <p className="text-4xl text-green-400 font-bold">
                {efficiency}%
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;