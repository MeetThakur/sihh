import React, { useState } from "react";
import {
  MapPin,
  AlertTriangle,
  Users,
  Camera,
  TrendingUp,
  Clock,
  Shield,
  Bug,
  Leaf,
  Eye,
  Filter,
  Search,
  Bell,
  Share2,
  ChevronDown,
  ChevronUp,
  Activity,
  BarChart3,
  MapIcon,
  Star,
  MessageCircle,
  Target,
  Thermometer,
  Cloud,
  Wind,
} from "lucide-react";
import PestImageDetection from "./PestImageDetection";
import { PestAnalysisResult } from "../utils/pestDetectionService";

interface PestReport {
  id: string;
  location: string;
  pestType: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  crop: string;
  reportedBy: string;
  timestamp: string;
  imageUrl?: string;
  description?: string;
  weatherConditions?: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
  treatmentStatus?: "Pending" | "In Progress" | "Completed";
  likes?: number;
  comments?: number;
  verified?: boolean;
}

interface PestAlert {
  id: string;
  type: "outbreak" | "seasonal" | "weather" | "prevention";
  title: string;
  message: string;
  severity: "info" | "warning" | "danger";
  timestamp: string;
  affectedAreas: string[];
}

interface PestStatistics {
  totalReports: number;
  activeOutbreaks: number;
  resolvedCases: number;
  riskLevel: "Low" | "Medium" | "High";
  trendingPests: string[];
  weatherRisk: number;
}

const PestWatch: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "detection" | "reports" | "alerts" | "analytics"
  >("detection");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced mock data
  const [pestReports, setPestReports] = useState<PestReport[]>([
    {
      id: "1",
      location: "Sector 12, Village Rampur",
      pestType: "Brown Planthopper",
      severity: "Critical",
      crop: "Rice",
      reportedBy: "Farmer Kumar",
      timestamp: "2 hours ago",
      description:
        "Severe infestation observed across 5 acres. Plants showing yellowing and stunted growth.",
      weatherConditions: { temperature: 28, humidity: 85, rainfall: 15 },
      treatmentStatus: "In Progress",
      likes: 12,
      comments: 8,
      verified: true,
    },
    {
      id: "2",
      location: "Sector 8, Village Rampur",
      pestType: "Aphids",
      severity: "Medium",
      crop: "Wheat",
      reportedBy: "Farmer Singh",
      timestamp: "5 hours ago",
      description:
        "Moderate aphid population on wheat leaves. Early intervention recommended.",
      weatherConditions: { temperature: 25, humidity: 70, rainfall: 5 },
      treatmentStatus: "Pending",
      likes: 7,
      comments: 3,
      verified: true,
    },
    {
      id: "3",
      location: "Sector 15, Village Rampur",
      pestType: "Stem Borer",
      severity: "High",
      crop: "Rice",
      reportedBy: "Farmer Patel",
      timestamp: "1 day ago",
      description:
        "Dead hearts observed in rice plants. Larvae found in stem boring.",
      weatherConditions: { temperature: 30, humidity: 80, rainfall: 10 },
      treatmentStatus: "Completed",
      likes: 15,
      comments: 12,
      verified: true,
    },
    {
      id: "4",
      location: "Sector 5, Village Rampur",
      pestType: "Powdery Mildew",
      severity: "Medium",
      crop: "Tomato",
      reportedBy: "Farmer Devi",
      timestamp: "6 hours ago",
      description: "White powdery coating observed on tomato leaves and stems.",
      weatherConditions: { temperature: 26, humidity: 90, rainfall: 0 },
      treatmentStatus: "Pending",
      likes: 5,
      comments: 2,
      verified: false,
    },
  ]);

  const [pestAlerts] = useState<PestAlert[]>([
    {
      id: "1",
      type: "outbreak",
      title: "Brown Planthopper Outbreak Alert",
      message:
        "High risk of brown planthopper outbreak in rice fields due to favorable weather conditions.",
      severity: "danger",
      timestamp: "3 hours ago",
      affectedAreas: ["Sector 12", "Sector 13", "Sector 14"],
    },
    {
      id: "2",
      type: "seasonal",
      title: "Seasonal Aphid Activity",
      message:
        "Increased aphid activity expected in wheat crops during current weather conditions.",
      severity: "warning",
      timestamp: "1 day ago",
      affectedAreas: ["Sector 8", "Sector 9"],
    },
    {
      id: "3",
      type: "weather",
      title: "Weather-Related Fungal Risk",
      message:
        "High humidity levels may lead to increased fungal disease pressure.",
      severity: "warning",
      timestamp: "2 days ago",
      affectedAreas: ["All Areas"],
    },
  ]);

  const [statistics] = useState<PestStatistics>({
    totalReports: 47,
    activeOutbreaks: 3,
    resolvedCases: 28,
    riskLevel: "High",
    trendingPests: ["Brown Planthopper", "Aphids", "Stem Borer"],
    weatherRisk: 75,
  });

  const handlePestDetection = (pestData: PestAnalysisResult) => {
    console.log("Pest detected:", pestData);
    // Add new report from detection
    const newReport: PestReport = {
      id: Date.now().toString(),
      location: "Current Location",
      pestType: pestData.pestType,
      severity:
        pestData.severity === "Critical" ? "Critical" : pestData.severity,
      crop: "Detected Crop",
      reportedBy: "AI Detection",
      timestamp: "Just now",
      description: `AI-detected ${pestData.pestType} with ${pestData.confidence}% confidence`,
      treatmentStatus: "Pending",
      likes: 0,
      comments: 0,
      verified: false,
    };
    setPestReports((prev) => [newReport, ...prev]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500 dark:bg-red-600 text-white";
      case "High":
        return "bg-red-400 dark:bg-red-500 text-white";
      case "Medium":
        return "bg-yellow-500 dark:bg-yellow-600 text-white dark:text-gray-100";
      case "Low":
        return "bg-green-500 dark:bg-green-600 text-white";
      default:
        return "bg-gray-500 dark:bg-gray-600 text-white";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700";
      case "High":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700";
      case "Medium":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700";
      case "Low":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700";
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "danger":
        return "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300";
      case "warning":
        return "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300";
      case "info":
        return "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200";
    }
  };

  const filteredReports = pestReports.filter((report) => {
    const matchesSeverity =
      selectedSeverity === "all" ||
      report.severity.toLowerCase() === selectedSeverity;
    const matchesCrop =
      selectedCrop === "all" ||
      report.crop.toLowerCase().includes(selectedCrop.toLowerCase());
    const matchesSearch =
      searchTerm === "" ||
      report.pestType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.crop.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSeverity && matchesCrop && matchesSearch;
  });

  const uniqueCrops = [...new Set(pestReports.map((report) => report.crop))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                <Bug className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-red-600" />
                <span>Pest Watch</span>
                <span className="ml-3 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium rounded-full">
                  {statistics.riskLevel} Risk
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                AI-powered pest detection, community reporting, and smart
                monitoring
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
                  {statistics.activeOutbreaks}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Active Outbreaks
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {statistics.totalReports}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Total Reports
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <nav
              className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max"
              aria-label="Tabs"
            >
              {[
                {
                  id: "detection",
                  label: "AI Detection",
                  icon: Camera,
                  count: null,
                },
                {
                  id: "reports",
                  label: "Community Reports",
                  icon: Users,
                  count: filteredReports.length,
                },
                {
                  id: "alerts",
                  label: "Pest Alerts",
                  icon: Bell,
                  count: pestAlerts.length,
                },
                {
                  id: "analytics",
                  label: "Analytics",
                  icon: BarChart3,
                  count: null,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        activeTab === tab.id
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "detection" && (
              <div className="space-y-6">
                <PestImageDetection onPestDetected={handlePestDetection} />

                {/* Quick Stats for Detection */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                          95%
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                          AI Accuracy
                        </div>
                      </div>
                      <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-xl p-4 border border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                          150+
                        </div>
                        <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                          Pests Identified
                        </div>
                      </div>
                      <Bug className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                          24/7
                        </div>
                        <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                          Monitoring
                        </div>
                      </div>
                      <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-3 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search pests, locations, crops..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                      />
                    </div>

                    <select
                      value={selectedSeverity}
                      onChange={(e) => setSelectedSeverity(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    >
                      <option value="all">All Severities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>

                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    >
                      <option value="all">All Crops</option>
                      {uniqueCrops.map((crop) => (
                        <option key={crop} value={crop}>
                          {crop}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center text-sm"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {showFilters ? (
                      <ChevronUp className="w-4 h-4 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-2" />
                    )}
                  </button>
                </div>

                {/* Enhanced Reports Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className={`bg-white dark:bg-gray-800 border rounded-xl p-6 hover:shadow-lg transition-all duration-200 ${getSeverityBg(report.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {report.pestType}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}
                            >
                              {report.severity}
                            </span>
                            {report.verified && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium flex items-center">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified
                              </span>
                            )}
                          </div>

                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {report.location}
                            </div>
                            <div className="flex items-center">
                              <Leaf className="w-4 h-4 mr-2" />
                              {report.crop}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              {report.reportedBy}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {report.timestamp}
                            </div>
                          </div>

                          {report.description && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                              {report.description}
                            </p>
                          )}

                          {report.weatherConditions && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                              <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">
                                Weather Conditions
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs text-gray-700 dark:text-gray-300">
                                <div className="flex items-center">
                                  <Thermometer className="w-3 h-3 mr-1 text-red-500" />
                                  {report.weatherConditions.temperature}°C
                                </div>
                                <div className="flex items-center">
                                  <Cloud className="w-3 h-3 mr-1 text-blue-500" />
                                  {report.weatherConditions.humidity}%
                                </div>
                                <div className="flex items-center">
                                  <Wind className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
                                  {report.weatherConditions.rainfall}mm
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <button className="flex items-center hover:text-red-600 transition-colors">
                            <Star className="w-4 h-4 mr-1" />
                            {report.likes}
                          </button>
                          <button className="flex items-center hover:text-blue-600 transition-colors">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {report.comments}
                          </button>
                          <button className="flex items-center hover:text-green-600 transition-colors">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </button>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            report.treatmentStatus === "Completed"
                              ? "bg-green-100 text-green-700"
                              : report.treatmentStatus === "In Progress"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {report.treatmentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "alerts" && (
              <div className="space-y-6">
                {/* Alert Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 rounded-xl p-4 border border-red-200 dark:border-red-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-red-800 dark:text-red-300">
                          {
                            pestAlerts.filter((a) => a.severity === "danger")
                              .length
                          }
                        </div>
                        <div className="text-red-600 dark:text-red-400 text-sm font-medium">
                          Critical Alerts
                        </div>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">
                          {
                            pestAlerts.filter((a) => a.severity === "warning")
                              .length
                          }
                        </div>
                        <div className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                          Warnings
                        </div>
                      </div>
                      <Bell className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                          {statistics.weatherRisk}%
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                          Weather Risk
                        </div>
                      </div>
                      <Cloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-xl p-4 border border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                          {statistics.resolvedCases}
                        </div>
                        <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                          Resolved
                        </div>
                      </div>
                      <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>

                {/* Alerts List */}
                <div className="space-y-4">
                  {pestAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`border rounded-xl p-6 ${getAlertColor(alert.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {alert.title}
                            </h3>
                            <span className="px-2 py-1 bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-70 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium">
                              {alert.type.charAt(0).toUpperCase() +
                                alert.type.slice(1)}
                            </span>
                          </div>

                          <p className="text-sm mb-3">{alert.message}</p>

                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {alert.timestamp}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {alert.affectedAreas.join(", ")}
                            </div>
                          </div>
                        </div>

                        <button className="px-4 py-2 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-80 hover:bg-opacity-90 dark:hover:bg-opacity-100 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                {/* Analytics Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Trending Pests */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
                      Trending Pests
                    </h3>
                    <div className="space-y-3">
                      {statistics.trendingPests.map((pest, index) => (
                        <div
                          key={pest}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center">
                            <span className="w-6 h-6 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                              {index + 1}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {pest}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {Math.floor(Math.random() * 20) + 5} reports
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regional Risk Map */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                      <MapIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Risk Distribution
                    </h3>
                    <div className="space-y-3">
                      {[
                        { sector: "Sector 12", risk: "Critical", reports: 8 },
                        { sector: "Sector 8", risk: "High", reports: 5 },
                        { sector: "Sector 15", risk: "Medium", reports: 3 },
                        { sector: "Sector 5", risk: "Low", reports: 1 },
                      ].map((area) => (
                        <div
                          key={area.sector}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-3 ${
                                area.risk === "Critical"
                                  ? "bg-red-500"
                                  : area.risk === "High"
                                    ? "bg-orange-500"
                                    : area.risk === "Medium"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                              }`}
                            ></div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {area.sector}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {area.reports} reports
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {area.risk} risk
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-green-600" />
                    System Performance
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                        2.5s
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 text-sm">
                        Avg Detection Time
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                        94%
                      </div>
                      <div className="text-green-600 dark:text-green-400 text-sm">
                        Resolution Rate
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                      <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                        156
                      </div>
                      <div className="text-purple-600 dark:text-purple-400 text-sm">
                        Active Users
                      </div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                      <div className="text-2xl font-bold text-orange-800 dark:text-orange-300">
                        48h
                      </div>
                      <div className="text-orange-600 dark:text-orange-400 text-sm">
                        Avg Response Time
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestWatch;
