import React, { useState, useEffect, useCallback } from "react";
import {
  Leaf,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Droplets,
  Map as MapIcon,
  Clock,
  CloudRain,
  Thermometer,
  ArrowUp,
  ArrowDown,
  Plus,
  Loader2,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import farmService, { DashboardData } from "../services/farmService";
import weatherService from "../services/weatherService";

const Dashboard: React.FC = () => {
  const { state } = useAuth();
  const user = state.user;
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<{
    temperature: number;
    monthlyRainfall: number;
    currentRainfall: number;
  } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Get user's location for weather widget
  const getUserLocation = useCallback((): string => {
    if (user?.profile?.location) {
      const { district, state } = user.profile.location;
      if (district && state) {
        return `${district}, ${state}, India`;
      }
      if (state) {
        return `${state}, India`;
      }
    }
    return "Delhi, India"; // Default fallback
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await farmService.getDashboardData();

      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        setError(response.message || "Failed to load dashboard data");
      }
    } catch (err) {
      console.error("Dashboard data error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadWeatherData = useCallback(async () => {
    try {
      setWeatherLoading(true);
      const location = getUserLocation();
      const response = await weatherService.getDashboardWeather(location);

      if (response.success && response.data) {
        // Calculate estimated monthly rainfall
        // Current rainfall represents today's rainfall, multiply by ~30 days for monthly estimate
        const dailyAverage =
          response.data.current.rainfall > 0
            ? response.data.current.rainfall
            : 0.5;
        const monthlyEstimate = dailyAverage * 30;

        setWeatherData({
          temperature: response.data.current.temperature,
          monthlyRainfall: monthlyEstimate,
          currentRainfall: response.data.current.rainfall,
        });
      }
    } catch (error) {
      console.error("Failed to load weather data:", error);
      // Set fallback data to show API is not working
      setWeatherData(null);
    } finally {
      setWeatherLoading(false);
    }
  }, [getUserLocation]);

  useEffect(() => {
    loadDashboardData();
    loadWeatherData();
  }, [loadWeatherData]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "planting":
        return <Leaf className="text-green-600" size={16} />;
      case "watering":
        return <Droplets className="text-blue-600" size={16} />;
      case "fertilizing":
        return <TrendingUp className="text-purple-600" size={16} />;
      case "pesticide":
        return <AlertTriangle className="text-orange-600" size={16} />;
      case "harvesting":
        return <Calendar className="text-yellow-600" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getHealthColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthBgColor = (score: number): string => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your farm dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Dashboard Error
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Data Available
        </h3>
        <p className="text-gray-600">Unable to load dashboard information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome back, {user?.name || "Farmer"}!
        </h1>
        <p className="text-gray-600">Your Smart Farming Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="minimal-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Current Season
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData.currentSeason}
              </p>
              <p className="text-xs text-gray-500 mt-1">Agricultural season</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Calendar className="text-gray-600" size={24} />
            </div>
          </div>
        </div>

        <div className="minimal-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Crops</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData.activeCrops}
              </p>
              <div className="flex items-center mt-1">
                <p className="text-xs text-gray-600">
                  {dashboardData.cropVariety &&
                  dashboardData.cropVariety.length > 0
                    ? `${dashboardData.cropVariety.slice(0, 2).join(", ")}${dashboardData.cropVariety.length > 2 ? "..." : ""}`
                    : "No crops planted"}
                </p>
              </div>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Leaf className="text-gray-600" size={24} />
            </div>
          </div>
        </div>

        <div className="minimal-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pest Alerts</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData.pestAlerts}
              </p>
              <div className="flex items-center mt-1">
                {dashboardData.pestAlerts > 0 ? (
                  <>
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                    <p className="text-xs text-orange-600">
                      Requires attention
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <p className="text-xs text-green-600">All clear</p>
                  </>
                )}
              </div>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <AlertTriangle className="text-gray-600" size={24} />
            </div>
          </div>
        </div>

        <div className="minimal-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Farm Health</p>
              <p
                className={`text-2xl font-semibold ${getHealthColor(dashboardData.healthScore)}`}
              >
                {dashboardData.healthScore}%
              </p>
              <div className="flex items-center mt-1">
                {dashboardData.healthScore >= 80 ? (
                  <ArrowUp className="w-3 h-3 text-green-600 mr-1" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-red-600 mr-1" />
                )}
                <p
                  className={`text-xs ${getHealthColor(dashboardData.healthScore)}`}
                >
                  {dashboardData.healthScore >= 80
                    ? "Excellent"
                    : dashboardData.healthScore >= 60
                      ? "Good"
                      : "Needs attention"}
                </p>
              </div>
            </div>
            <div
              className={`p-3 rounded-lg ${getHealthBgColor(dashboardData.healthScore)}`}
            >
              <BarChart3 className="text-gray-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Farm Overview */}
      {dashboardData.totalFarms > 0 && (
        <div className="minimal-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapIcon className="text-gray-600 mr-2" size={20} />
            Farm Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600 mb-1">
                {dashboardData.totalFarms}
              </p>
              <p className="text-sm font-medium text-gray-700">Total Farms</p>
              <p className="text-xs text-gray-600 mt-1">
                {dashboardData.totalAcreage} acres total
              </p>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 mb-1">
                {dashboardData.totalPlots}
              </p>
              <p className="text-sm font-medium text-gray-700">Total Plots</p>
              <p className="text-xs text-gray-600 mt-1">
                Avg {dashboardData.averageFarmSize} acres
              </p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600 mb-1">
                {dashboardData.cropVariety
                  ? dashboardData.cropVariety.length
                  : 0}
              </p>
              <p className="text-sm font-medium text-gray-700">Crop Types</p>
              <p className="text-xs text-gray-600 mt-1">Diverse cultivation</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="minimal-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="text-gray-600 mr-2" size={20} />
            Recent Activities
          </h3>
          <div className="space-y-3">
            {dashboardData.recentActivities &&
            dashboardData.recentActivities.length > 0 ? (
              dashboardData.recentActivities
                .slice(0, 5)
                .map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {activity.type.replace("_", " ")} - {activity.farmName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          {formatDate(activity.date)}
                        </p>
                        {activity.cost && (
                          <p className="text-xs text-green-600">
                            {formatCurrency(activity.cost)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">No recent activities</p>
                <p className="text-xs text-gray-400">
                  Start logging your farm activities to see them here
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="minimal-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Leaf className="text-gray-600 mr-2" size={20} />
            Recommendations
          </h3>
          <div className="space-y-3">
            {dashboardData.recommendations &&
              dashboardData.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
                >
                  <div className="p-1 bg-blue-100 rounded-full mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{recommendation}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Quick Actions & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="minimal-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="text-gray-600 mr-2" size={20} />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => (window.location.href = "/farm-visualization")}
              className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <MapIcon className="text-green-600 mb-2" size={20} />
              <p className="text-sm font-medium text-gray-900">View Farm</p>
              <p className="text-xs text-gray-600">Manage plots</p>
            </button>

            <button
              onClick={() => (window.location.href = "/crop-advisory")}
              className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Leaf className="text-blue-600 mb-2" size={20} />
              <p className="text-sm font-medium text-gray-900">Crop Advisory</p>
              <p className="text-xs text-gray-600">Get recommendations</p>
            </button>

            <button
              onClick={() => (window.location.href = "/pest-watch")}
              className="p-4 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <AlertTriangle className="text-orange-600 mb-2" size={20} />
              <p className="text-sm font-medium text-gray-900">Pest Watch</p>
              <p className="text-xs text-gray-600">Monitor threats</p>
            </button>

            <button
              onClick={() => (window.location.href = "/market-linkage")}
              className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <TrendingUp className="text-purple-600 mb-2" size={20} />
              <p className="text-sm font-medium text-gray-900">Market Prices</p>
              <p className="text-xs text-gray-600">Check rates</p>
            </button>
          </div>
        </div>

        <div className="minimal-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="text-gray-600 mr-2" size={20} />
            Farm Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapIcon className="text-green-600" size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Total Area
                  </p>
                  <p className="text-xs text-gray-600">
                    {dashboardData.totalAcreage} acres
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {dashboardData.totalFarms}
                </p>
                <p className="text-xs text-gray-600">
                  {dashboardData.totalFarms === 1 ? "Farm" : "Farms"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${getHealthBgColor(dashboardData.healthScore)}`}
                >
                  <Leaf
                    className={`${getHealthColor(dashboardData.healthScore).replace("text-", "text-")}`}
                    size={16}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Crop Health
                  </p>
                  <p className="text-xs text-gray-600">
                    Overall farm condition
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-semibold ${getHealthColor(dashboardData.healthScore)}`}
                >
                  {dashboardData.healthScore}%
                </p>
                <p className="text-xs text-gray-600">Health score</p>
              </div>
            </div>

            {dashboardData.pestAlerts > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="text-orange-600" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Active Alerts
                    </p>
                    <p className="text-xs text-gray-600">
                      Pest monitoring required
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-orange-600">
                    {dashboardData.pestAlerts}
                  </p>
                  <p className="text-xs text-orange-600">
                    {dashboardData.pestAlerts === 1 ? "Alert" : "Alerts"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Farm CTA for new users */}
      {dashboardData.totalFarms === 0 && (
        <div className="text-center py-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-green-200">
          <MapIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome to KhetSetu!
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by creating your first farm. Add your plots, crops, and
            start tracking your agricultural journey.
          </p>
          <button
            onClick={() => (window.location.href = "/farm-visualization")}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Farm
          </button>
        </div>
      )}

      {/* Weather & Soil Info Placeholder */}
      {dashboardData.totalFarms > 0 && (
        <div className="minimal-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <CloudRain className="text-gray-600 mr-2" size={20} />
            Weather & Soil Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Droplets className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Rainfall</p>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {weatherLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin inline" />
                  ) : weatherData ? (
                    `${weatherData.monthlyRainfall.toFixed(1)}mm`
                  ) : (
                    "--mm"
                  )}
                </p>
                <p className="text-xs text-gray-600">
                  {weatherLoading
                    ? "Loading..."
                    : weatherData
                      ? "Live data"
                      : "Weather API integration pending"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Thermometer className="text-yellow-600" size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Temperature</p>
                  <p className="text-sm text-gray-600">Current avg</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {weatherLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin inline" />
                  ) : weatherData ? (
                    `${weatherData.temperature}°C`
                  ) : (
                    "--°C"
                  )}
                </p>
                <p className="text-xs text-gray-600">
                  {weatherLoading
                    ? "Loading..."
                    : weatherData
                      ? "Live data"
                      : "Weather API integration pending"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Leaf className="text-green-600" size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Soil Health</p>
                  <p className="text-sm text-gray-600">Average condition</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-semibold ${getHealthColor(dashboardData.healthScore)}`}
                >
                  {dashboardData.healthScore >= 80
                    ? "Good"
                    : dashboardData.healthScore >= 60
                      ? "Fair"
                      : "Poor"}
                </p>
                <p className="text-xs text-gray-600">Based on plot data</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
          ) : (
            <CloudRain className="w-4 h-4 mr-2" />
          )}
          {loading ? "Loading..." : "Refresh Data"}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
