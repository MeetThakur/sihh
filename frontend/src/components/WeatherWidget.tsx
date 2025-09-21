import React, { useState, useEffect, useCallback } from "react";
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Wind,
  Droplets,
  AlertTriangle,
  RefreshCw,
  MapPin,
  Calendar,
  ArrowUp,
  ArrowDown,
  Umbrella,
} from "lucide-react";
import weatherService from "../services/weatherService";

interface WeatherWidgetProps {
  location?: string;
  showForecast?: boolean;
  compact?: boolean;
  className?: string;
}

interface DashboardWeatherData {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    rainfall: number;
    uvIndex: number;
    icon: string;
  };
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
    chanceOfRain: number;
    icon: string;
  }>;
  alerts: Array<{
    headline: string;
    desc: string;
  }>;
  lastUpdated: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  location = "Delhi, India",
  showForecast = true,
  compact = false,
  className = "",
}) => {
  const [weatherData, setWeatherData] = useState<DashboardWeatherData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await weatherService.getDashboardWeather(location);

      if (response.success && response.data) {
        setWeatherData(response.data);
      } else {
        setError(response.message || "Failed to fetch weather data");
      }
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchWeatherData();
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeatherData]);

  const getWeatherIcon = (condition: string, isLarge: boolean = false) => {
    const iconSize = isLarge ? 48 : 24;
    const condition_lower = condition.toLowerCase();

    if (
      condition_lower.includes("rain") ||
      condition_lower.includes("drizzle")
    ) {
      return <CloudRain size={iconSize} className="text-blue-500" />;
    } else if (condition_lower.includes("snow")) {
      return <CloudSnow size={iconSize} className="text-blue-200" />;
    } else if (
      condition_lower.includes("cloud") ||
      condition_lower.includes("overcast")
    ) {
      return <Cloud size={iconSize} className="text-gray-500" />;
    } else if (
      condition_lower.includes("sun") ||
      condition_lower.includes("clear")
    ) {
      return <Sun size={iconSize} className="text-yellow-500" />;
    } else {
      return <Cloud size={iconSize} className="text-gray-500" />;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return "text-green-600";
    if (uvIndex <= 5) return "text-yellow-600";
    if (uvIndex <= 7) return "text-orange-600";
    if (uvIndex <= 10) return "text-red-600";
    return "text-purple-600";
  };

  const getUVIndexLabel = (uvIndex: number) => {
    if (uvIndex <= 2) return "Low";
    if (uvIndex <= 5) return "Moderate";
    if (uvIndex <= 7) return "High";
    if (uvIndex <= 10) return "Very High";
    return "Extreme";
  };

  if (loading) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading weather...</span>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Cloud className="w-5 h-5 mr-2" />
            Weather
          </h3>
          <button
            onClick={fetchWeatherData}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Refresh weather data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">{error}</p>
          <button
            onClick={fetchWeatherData}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { current, forecast, alerts } = weatherData;

  if (compact) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getWeatherIcon(current.condition)}
            <div className="ml-3">
              <p className="text-lg font-semibold text-gray-900">
                {current.temperature}°C
              </p>
              <p className="text-sm text-gray-500">{current.condition}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Droplets className="w-3 h-3 mr-1" />
              {current.humidity}%
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Wind className="w-3 h-3 mr-1" />
              {current.windSpeed} km/h
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Weather Overview
            </h3>
            <p className="text-blue-100 text-sm">{location}</p>
          </div>
          <button
            onClick={fetchWeatherData}
            className="p-2 text-blue-100 hover:text-white hover:bg-blue-700 rounded-md transition-colors"
            title="Refresh weather data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Current Weather */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {getWeatherIcon(current.condition, true)}
            <div className="ml-4">
              <p className="text-3xl font-bold text-gray-900">
                {current.temperature}°C
              </p>
              <p className="text-gray-600">{current.condition}</p>
              <p className="text-sm text-gray-500">
                Last updated:{" "}
                {new Date(weatherData.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <Droplets className="w-5 h-5 text-blue-500" />
              <span className="text-lg font-semibold text-gray-900">
                {current.humidity}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Humidity</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <Wind className="w-5 h-5 text-gray-500" />
              <span className="text-lg font-semibold text-gray-900">
                {current.windSpeed}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Wind (km/h)</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <Umbrella className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">
                {current.rainfall}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Rainfall (mm)</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <Sun className="w-5 h-5 text-yellow-500" />
              <span
                className={`text-lg font-semibold ${getUVIndexColor(current.uvIndex)}`}
              >
                {current.uvIndex}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">UV Index</p>
            <p
              className={`text-xs ${getUVIndexColor(current.uvIndex)} font-medium`}
            >
              {getUVIndexLabel(current.uvIndex)}
            </p>
          </div>
        </div>

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 flex items-center mb-3">
              <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
              Weather Alerts
            </h4>
            <div className="space-y-2">
              {alerts.slice(0, 3).map((alert, index) => (
                <div
                  key={index}
                  className="bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  <p className="text-sm font-medium text-red-800">
                    {alert.headline}
                  </p>
                  <p className="text-xs text-red-600 mt-1">{alert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4-Day Forecast */}
        {showForecast && forecast.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-900 flex items-center mb-3">
              <Calendar className="w-4 h-4 mr-2" />
              4-Day Forecast
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {forecast.map((day, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 text-center"
                >
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    {formatDate(day.date)}
                  </p>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900 flex items-center">
                      <ArrowUp className="w-3 h-3 mr-1 text-red-500" />
                      {day.maxTemp}°
                    </span>
                    <span className="text-sm text-gray-600 flex items-center">
                      <ArrowDown className="w-3 h-3 mr-1 text-blue-500" />
                      {day.minTemp}°
                    </span>
                  </div>
                  <div className="flex items-center justify-center text-xs text-blue-600">
                    <Droplets className="w-3 h-3 mr-1" />
                    {day.chanceOfRain}%
                  </div>
                  <p
                    className="text-xs text-gray-500 mt-1 truncate"
                    title={day.condition}
                  >
                    {day.condition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agricultural Insights */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Agricultural Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Irrigation Status */}
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-3 ${
                  current.rainfall > 5 ? "bg-green-500" : "bg-orange-500"
                }`}
              ></div>
              <span className="text-sm text-gray-700">
                {current.rainfall > 5
                  ? "Good moisture levels"
                  : "Consider irrigation"}
              </span>
            </div>

            {/* Pest Risk */}
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-3 ${
                  current.humidity > 80
                    ? "bg-red-500"
                    : current.humidity > 60
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
              ></div>
              <span className="text-sm text-gray-700">
                {current.humidity > 80
                  ? "High pest risk"
                  : current.humidity > 60
                    ? "Medium pest risk"
                    : "Low pest risk"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
