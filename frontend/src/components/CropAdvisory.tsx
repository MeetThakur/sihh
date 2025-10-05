import React, { useState, useEffect } from "react";
import {
  Leaf,
  Calendar,
  DollarSign,
  Clock,
  Bell,
  CheckCircle,
  Droplet,
  AlertCircle,
  TrendingUp,
  MapPin,
  Thermometer,
  Cloud,
  Sun,
  BarChart3,
  PieChart,
  Target,
  Shield,
  Lightbulb,
  Camera,
  Users,
  BookOpen,
  Star,
  Filter,
  RefreshCw,
  Download,
  Share2,
} from "lucide-react";
import { generateCropRecommendations } from "../utils/aiService";
import { useLanguage } from "../contexts/LanguageContext";
import SoilDetection from "./SoilDetection";

interface FarmInput {
  budget: string;
  season: string;
  soilType: string;
  weather: string;
  farmSize: string;
  location?: string;
  previousCrop?: string;
  irrigationType?: string;
  organicPreference?: boolean;
}

interface CropRecommendation {
  name: string;
  suitability: "High" | "Medium" | "Low";
  expectedYield: string;
  roi: string;
  requirements: string[];
  tips: string[];
  estimatedCost?: number;
  suitabilityScore?: string;
  marketPrice?: string;
  demandTrend?: "High" | "Medium" | "Low";
  riskLevel?: "Low" | "Medium" | "High";
  sustainabilityScore?: number;
}

interface CalendarActivity {
  id: string;
  week: number;
  activity: string;
  description: string;
  icon: string;
  type:
    | "sowing"
    | "irrigation"
    | "fertilizer"
    | "pest"
    | "harvest"
    | "monitoring";
  budget?: string;
  completed?: boolean;
  weatherDependent?: boolean;
  alternatives?: string[];
  priority: "High" | "Medium" | "Low";
  estimatedHours?: number;
}

interface FasalCalendar {
  cropName: string;
  season: string;
  totalWeeks: number;
  activities: CalendarActivity[];
  weatherAlerts: string[];
  budgetTotal: string;
  progressPercentage: number;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  forecast: string;
}

interface MarketData {
  currentPrice: string;
  trend: "up" | "down" | "stable";
  demandLevel: "High" | "Medium" | "Low";
}

type TabType = "quick" | "detailed" | "calendar" | "analytics" | "history";

const CropAdvisory: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("quick");
  const [farmInput, setFarmInput] = useState<FarmInput>({
    budget: "",
    season: "",
    soilType: "",
    weather: "",
    farmSize: "",
    location: "",
    previousCrop: "",
    irrigationType: "",
    organicPreference: false,
  });

  const [recommendations, setRecommendations] = useState<CropRecommendation[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [calendarData, setCalendarData] = useState<FasalCalendar | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [compareMode, setCompareMode] = useState(false);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showTabDropdown, setShowTabDropdown] = useState(false);
  const [filters, setFilters] = useState({
    suitability: "",
    riskLevel: "",
    sustainabilityMin: 0,
  });

  // Close dropdown on click outside or ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showTabDropdown && !target.closest("[data-dropdown]")) {
        setShowTabDropdown(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showTabDropdown) {
        setShowTabDropdown(false);
      }
    };

    if (showTabDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showTabDropdown]);

  // Mock weather data
  useEffect(() => {
    setWeatherData({
      temperature: 28,
      humidity: 65,
      rainfall: 120,
      forecast: "Partly cloudy with chance of rain",
    });

    setMarketData({
      "Rice (Paddy)": {
        currentPrice: "₹2,200/quintal",
        trend: "up",
        demandLevel: "High",
      },
      Wheat: {
        currentPrice: "₹2,150/quintal",
        trend: "stable",
        demandLevel: "Medium",
      },
      "Maize (Corn)": {
        currentPrice: "₹1,800/quintal",
        trend: "up",
        demandLevel: "High",
      },
      Sugarcane: {
        currentPrice: "₹380/quintal",
        trend: "down",
        demandLevel: "Medium",
      },
    });
  }, []);

  const tabs = [
    {
      id: "quick",
      label: "Quick Advisory",
      icon: Leaf,
      desc: "Get instant recommendations",
    },
    {
      id: "detailed",
      label: "Detailed Analysis",
      icon: BarChart3,
      desc: "Comprehensive crop analysis",
    },
    {
      id: "calendar",
      label: "Fasal Calendar",
      icon: Calendar,
      desc: "Step-by-step farming plan",
    },
    {
      id: "analytics",
      label: "Farm Analytics",
      icon: PieChart,
      desc: "Performance insights",
    },
    {
      id: "history",
      label: "Advisory History",
      icon: BookOpen,
      desc: "Past recommendations",
    },
  ];

  const generateFasalCalendar = (cropName: string): FasalCalendar => {
    const baseActivities: CalendarActivity[] = [
      {
        id: "1",
        week: 1,
        activity: "Land Preparation & Soil Testing",
        description:
          "Prepare soil, conduct pH and nutrient testing, select quality seeds",
        icon: "🌱",
        type: "sowing",
        budget: "₹2,500-4,000",
        completed: false,
        weatherDependent: true,
        alternatives: ["Use organic compost instead of chemical fertilizers"],
        priority: "High",
        estimatedHours: 16,
      },
      {
        id: "2",
        week: 2,
        activity: "Sowing & Initial Irrigation",
        description:
          "Sow seeds with proper spacing and provide initial watering",
        icon: "💧",
        type: "irrigation",
        budget: "₹800-1,200",
        completed: false,
        weatherDependent: true,
        alternatives: [
          "Rainwater harvesting if available",
          "Drip irrigation for water efficiency",
        ],
        priority: "High",
        estimatedHours: 12,
      },
      {
        id: "3",
        week: 4,
        activity: "First Fertilizer Application",
        description: "Apply nitrogen-rich fertilizer for initial growth boost",
        icon: "🧪",
        type: "fertilizer",
        budget: "₹2,000-3,500",
        completed: false,
        alternatives: [
          "Use vermicompost or organic manure",
          "Biofertilizers for sustainable farming",
        ],
        priority: "High",
        estimatedHours: 8,
      },
      {
        id: "4",
        week: 6,
        activity: "Pest & Disease Monitoring",
        description: "Regular inspection for early signs of pests and diseases",
        icon: "🐛",
        type: "pest",
        budget: "₹1,000-1,500",
        completed: false,
        alternatives: [
          "Use neem oil or biological pest control",
          "Integrated pest management",
        ],
        priority: "Medium",
        estimatedHours: 6,
      },
      {
        id: "5",
        week: 8,
        activity: "Mid-season Care & Weeding",
        description:
          "Remove weeds, check plant health, apply secondary fertilizers",
        icon: "🌿",
        type: "monitoring",
        budget: "₹1,200-1,800",
        completed: false,
        weatherDependent: false,
        priority: "Medium",
        estimatedHours: 14,
      },
      {
        id: "6",
        week: 12,
        activity: "Pre-harvest Preparation",
        description: "Final pest check, prepare harvesting equipment",
        icon: "🔧",
        type: "monitoring",
        budget: "₹800-1,200",
        completed: false,
        priority: "Medium",
        estimatedHours: 8,
      },
      {
        id: "7",
        week: 16,
        activity: "Harvest & Post-harvest",
        description:
          "Harvest at optimal time, proper storage and market preparation",
        icon: "🌾",
        type: "harvest",
        budget: "₹3,000-5,000",
        completed: false,
        weatherDependent: true,
        priority: "High",
        estimatedHours: 24,
      },
    ];

    const completedCount = baseActivities.filter((a) => a.completed).length;
    const progressPercentage = (completedCount / baseActivities.length) * 100;

    return {
      cropName,
      season: farmInput.season || "Kharif 2025",
      totalWeeks: 16,
      activities: baseActivities,
      weatherAlerts: [
        "Monitor rainfall patterns - excess water can damage young plants",
        "Watch for drought conditions during weeks 8-12",
        "Heavy rain expected next week - postpone fertilizer application",
      ],
      budgetTotal: "₹12,000-18,000",
      progressPercentage,
    };
  };

  const generateRecommendations = async () => {
    setLoading(true);

    try {
      const aiRecommendations = await generateCropRecommendations(farmInput);

      let filtered = aiRecommendations.map((rec) => ({
        ...rec,
        marketPrice: marketData[rec.name]?.currentPrice || "N/A",
        demandTrend: marketData[rec.name]?.demandLevel || "Medium",
        riskLevel: farmInput.weather === "rainy" ? "Medium" : "Low",
        sustainabilityScore: Math.floor(Math.random() * 40) + 60, // 60-100
      }));

      const budget = farmInput.budget ? Number(farmInput.budget) : 0;
      if (budget >= 10000) {
        filtered = filtered.filter((rec) => {
          const cost =
            ((rec as Record<string, unknown>).estimatedCost as number) || 0;
          return cost <= budget;
        });
      }

      // Apply filters
      if (filters.suitability) {
        filtered = filtered.filter(
          (rec) => rec.suitability === filters.suitability,
        );
      }
      if (filters.riskLevel) {
        filtered = filtered.filter(
          (rec) => rec.riskLevel === filters.riskLevel,
        );
      }
      if (filters.sustainabilityMin > 0) {
        filtered = filtered.filter(
          (rec) => (rec.sustainabilityScore || 0) >= filters.sustainabilityMin,
        );
      }

      setRecommendations(filtered);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      const fallbackRecommendations = getEnhancedStaticFallback(farmInput);
      setRecommendations(fallbackRecommendations || []);
    }

    setLoading(false);
  };

  const getEnhancedStaticFallback = (
    farmInput: FarmInput,
  ): CropRecommendation[] => {
    const budget = Number(farmInput.budget) || 0;

    if (farmInput.season === "kharif") {
      if (farmInput.weather === "rainy") {
        return [
          {
            name: "Rice (Paddy)",
            suitability: "High" as const,
            expectedYield: "45-55 quintals/hectare",
            roi: "₹45,000 - ₹65,000",
            requirements: [
              "Abundant water supply",
              "Well-prepared field",
              "Pest management",
            ],
            tips: [
              "Monitor for blast disease",
              "Ensure proper drainage",
              "Use resistant varieties",
            ],
            estimatedCost: 25000,
            marketPrice: "₹2,200/quintal",
            demandTrend: "High" as const,
            riskLevel: "Medium" as const,
            sustainabilityScore: 75,
          },
          {
            name: "Maize (Corn)",
            suitability: "High" as const,
            expectedYield: "65-85 quintals/hectare",
            roi: "₹45,000 - ₹65,000",
            requirements: [
              "Well-drained soil",
              "Balanced nutrition",
              "Fall armyworm monitoring",
            ],
            tips: [
              "Ensure good drainage",
              "Apply fertilizers before rains",
              "Monitor diseases",
            ],
            estimatedCost: 20000,
            marketPrice: "₹1,800/quintal",
            demandTrend: "High" as const,
            riskLevel: "Low" as const,
            sustainabilityScore: 80,
          },
        ].filter((rec) => budget === 0 || rec.estimatedCost <= budget);
      }
    }

    return [
      {
        name: "Mixed Farming",
        suitability: "Medium" as const,
        expectedYield: "200-300 quintals/hectare",
        roi: "₹50,000 - ₹80,000",
        requirements: [
          "Diversified approach",
          "Weather-appropriate crops",
          "Risk management",
        ],
        tips: [
          "Consult local officer",
          "Choose suitable varieties",
          "Market timing important",
        ],
        estimatedCost: 30000,
        marketPrice: "Variable",
        demandTrend: "Medium" as const,
        riskLevel: "Low" as const,
        sustainabilityScore: 85,
      },
    ];
  };

  const handleInputChange = (
    field: keyof FarmInput,
    value: string | boolean,
  ) => {
    setFarmInput((prev) => ({ ...prev, [field]: value }));
  };

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case "High":
        return "text-emerald-600 bg-emerald-100 border-emerald-200";
      case "Medium":
        return "text-amber-600 bg-amber-100 border-amber-200";
      case "Low":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-600 bg-green-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "High":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="text-green-500" size={16} />;
      case "down":
        return <TrendingUp className="text-red-500 rotate-180" size={16} />;
      default:
        return <TrendingUp className="text-gray-500" size={16} />;
    }
  };

  const toggleCropSelection = (cropName: string) => {
    if (selectedCrops.includes(cropName)) {
      setSelectedCrops(selectedCrops.filter((name) => name !== cropName));
    } else if (selectedCrops.length < 3) {
      setSelectedCrops([...selectedCrops, cropName]);
    }
  };

  const QuickAdvisoryTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Weather Integration */}
      {weatherData && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-700 rounded-lg sm:rounded-xl p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center transition-colors duration-200">
              <Cloud
                className="mr-2 text-blue-600 dark:text-blue-400"
                size={18}
              />
              <span className="hidden sm:inline">
                Current Weather Conditions
              </span>
              <span className="sm:hidden">Weather</span>
            </h3>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
              <RefreshCw size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="text-center">
              <Thermometer
                className="text-orange-500 dark:text-orange-400 mx-auto mb-1 sm:mb-2"
                size={16}
              />
              <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-300">
                Temperature
              </p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                {weatherData.temperature}°C
              </p>
            </div>
            <div className="text-center">
              <Droplet
                className="text-blue-500 dark:text-blue-400 mx-auto mb-1 sm:mb-2"
                size={16}
              />
              <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-300">
                Humidity
              </p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                {weatherData.humidity}%
              </p>
            </div>
            <div className="text-center">
              <Cloud
                className="text-gray-500 dark:text-dark-400 mx-auto mb-1 sm:mb-2"
                size={16}
              />
              <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-300">
                Rainfall
              </p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                {weatherData.rainfall}mm
              </p>
            </div>
            <div className="text-center">
              <Sun
                className="text-yellow-500 dark:text-yellow-400 mx-auto mb-1 sm:mb-2"
                size={16}
              />
              <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-300">
                Forecast
              </p>
              <p className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                Partly Cloudy
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Input Form */}
      <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center transition-colors duration-200">
            <Leaf
              className="text-green-600 dark:text-green-400 mr-2 sm:mr-3"
              size={20}
            />
            <span className="hidden sm:inline">Farm Information</span>
            <span className="sm:hidden">Farm Info</span>
          </h2>
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2 transition-colors duration-200 ${
                showFilters
                  ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                  : "bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-dark-200 hover:bg-gray-200 dark:hover:bg-dark-600"
              }`}
            >
              <Filter size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-700 transition-colors duration-200">
            <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-3 transition-colors duration-200">
              Filter Recommendations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-dark-200 mb-1 sm:mb-2">
                  Suitability
                </label>
                <select
                  value={filters.suitability}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      suitability: e.target.value,
                    }))
                  }
                  className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white transition-colors duration-200"
                >
                  <option value="">All Levels</option>
                  <option value="High">High Suitability</option>
                  <option value="Medium">Medium Suitability</option>
                  <option value="Low">Low Suitability</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-dark-200 mb-1 sm:mb-2">
                  Risk Level
                </label>
                <select
                  value={filters.riskLevel}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      riskLevel: e.target.value,
                    }))
                  }
                  className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white transition-colors duration-200"
                >
                  <option value="">All Risk Levels</option>
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-dark-200 mb-1 sm:mb-2">
                  Min Sustainability Score
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.sustainabilityMin}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sustainabilityMin: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
                <div className="text-xs text-gray-600 dark:text-dark-300 mt-1">
                  {filters.sustainabilityMin}/100
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-200 transition-colors duration-200">
              <span className="hidden sm:inline">
                {t("cropAdvisory.budget")} (Min: ₹10,000)
              </span>
              <span className="sm:hidden">Budget (Min: ₹10k)</span>
            </label>
            <div className="relative">
              <DollarSign
                className="absolute left-2 sm:left-3 top-2.5 sm:top-3 text-gray-400 dark:text-dark-400"
                size={16}
              />
              <input
                type="number"
                value={farmInput.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-400 transition-colors duration-200"
                placeholder="50000"
                min="10000"
              />
            </div>
            {farmInput.budget && Number(farmInput.budget) < 10000 && (
              <p className="text-xs text-red-600 dark:text-red-400">
                Minimum budget is ₹10,000
              </p>
            )}
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-200 transition-colors duration-200">
              {t("cropAdvisory.season")}
            </label>
            <select
              value={farmInput.season}
              onChange={(e) => handleInputChange("season", e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white transition-colors duration-200"
            >
              <option value="">Select Season</option>
              <option value="kharif">Kharif (June-October)</option>
              <option value="rabi">Rabi (November-April)</option>
              <option value="zaid">Zaid (April-June)</option>
            </select>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-200 transition-colors duration-200">
              <span className="hidden sm:inline">Farm Size (acres)</span>
              <span className="sm:hidden">Size (acres)</span>
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-2 sm:left-3 top-2.5 sm:top-3 text-gray-400 dark:text-dark-400"
                size={16}
              />
              <input
                type="number"
                value={farmInput.farmSize}
                onChange={(e) => handleInputChange("farmSize", e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-400 transition-colors duration-200"
                placeholder="2.5"
                step="0.1"
              />
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-200 transition-colors duration-200">
              Soil Type
            </label>
            <select
              value={farmInput.soilType}
              onChange={(e) => handleInputChange("soilType", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white transition-colors duration-200"
            >
              <option value="">Select Soil Type</option>
              <option value="clay">Clay Soil</option>
              <option value="sandy">Sandy Soil</option>
              <option value="loam">Loam Soil</option>
              <option value="silt">Silt Soil</option>
              <option value="black_cotton">Black Cotton Soil</option>
              <option value="red">Red Soil</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 transition-colors duration-200">
              Weather Conditions
            </label>
            <select
              value={farmInput.weather}
              onChange={(e) => handleInputChange("weather", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white transition-colors duration-200"
            >
              <option value="">Select Weather</option>
              <option value="hot_humid">Hot & Humid</option>
              <option value="moderate">Moderate</option>
              <option value="cool_dry">Cool & Dry</option>
              <option value="rainy">Rainy</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 transition-colors duration-200">
              Irrigation Type
            </label>
            <select
              value={farmInput.irrigationType}
              onChange={(e) =>
                handleInputChange("irrigationType", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white transition-colors duration-200"
            >
              <option value="">Select Irrigation</option>
              <option value="flood">Flood Irrigation</option>
              <option value="drip">Drip Irrigation</option>
              <option value="sprinkler">Sprinkler System</option>
              <option value="rainfed">Rain-fed</option>
            </select>
          </div>
        </div>

        {/* Soil Detection Integration */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg border border-green-200 dark:border-green-700 transition-colors duration-200">
          <SoilDetection
            onSoilTypeDetected={(detectedSoilType) =>
              handleInputChange("soilType", detectedSoilType)
            }
            currentSoilType={farmInput.soilType}
          />
        </div>

        {/* Organic Preference Toggle */}
        <div className="mt-6 flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700 transition-colors duration-200">
          <div className="flex items-center space-x-3">
            <Leaf className="text-green-600 dark:text-green-400" size={20} />
            <div>
              <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                Organic Farming Preference
              </p>
              <p className="text-sm text-gray-600 dark:text-dark-300 transition-colors duration-200">
                Get recommendations for sustainable farming practices
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              handleInputChange(
                "organicPreference",
                !farmInput.organicPreference,
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
              farmInput.organicPreference
                ? "bg-green-600 dark:bg-green-500"
                : "bg-gray-200 dark:bg-dark-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                farmInput.organicPreference ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={generateRecommendations}
            disabled={
              loading ||
              !farmInput.budget ||
              Number(farmInput.budget) < 10000 ||
              !farmInput.season ||
              !farmInput.soilType
            }
            className="w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-500 dark:to-blue-500 text-white font-semibold rounded-lg sm:rounded-xl hover:from-green-700 hover:to-blue-700 dark:hover:from-green-600 dark:hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                  <span className="text-sm sm:text-base">
                    <span className="hidden sm:inline">
                      Generating AI Recommendations...
                    </span>
                    <span className="sm:hidden">Generating...</span>
                  </span>
                </>
              ) : (
                <>
                  <Lightbulb className="animate-pulse" size={20} />
                  <span className="text-sm sm:text-base">
                    <span className="hidden sm:inline">
                      Get Smart Crop Advisory
                    </span>
                    <span className="sm:hidden">Get Advisory</span>
                  </span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center transition-colors duration-200">
              <Target
                className="text-green-600 dark:text-green-400 mr-2 sm:mr-3"
                size={20}
              />
              <span className="hidden sm:inline">AI Crop Recommendations</span>
              <span className="sm:hidden">Recommendations</span>
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  compareMode
                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                    : "bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-dark-200 hover:bg-gray-200 dark:hover:bg-dark-600"
                }`}
              >
                {compareMode ? "Exit Compare" : "Compare Crops"}
              </button>
              <button className="p-2 text-gray-600 dark:text-dark-300 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-lg transition-colors duration-200">
                <Download size={16} />
              </button>
              <button className="p-2 text-gray-600 dark:text-dark-300 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-lg transition-colors duration-200">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendations.map((crop, index) => (
              <div
                key={index}
                className={`relative bg-white dark:bg-dark-800 border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105 ${
                  compareMode && selectedCrops.includes(crop.name)
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600"
                }`}
              >
                {compareMode && (
                  <button
                    onClick={() => toggleCropSelection(crop.name)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200"
                  >
                    {selectedCrops.includes(crop.name) ? (
                      <CheckCircle
                        className="text-blue-600 dark:text-blue-400"
                        size={16}
                      />
                    ) : (
                      <div className="w-4 h-4 border border-gray-400 dark:border-dark-500 rounded-full" />
                    )}
                  </button>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                      {crop.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getSuitabilityColor(crop.suitability)}`}
                      >
                        {crop.suitability} Suitability
                      </span>
                      {crop.sustainabilityScore && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                          🌱 {crop.sustainabilityScore}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Market Data Integration */}
                {crop.marketPrice && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-dark-900 rounded-lg transition-colors duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                        Market Price
                      </span>
                      {marketData[crop.name] &&
                        getTrendIcon(marketData[crop.name].trend)}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {crop.marketPrice}
                    </div>
                    <div className="text-xs text-gray-600">
                      Demand:{" "}
                      <span
                        className={`font-medium ${
                          crop.demandTrend === "High"
                            ? "text-green-600"
                            : crop.demandTrend === "Medium"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {crop.demandTrend}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-xs font-medium text-blue-700">
                        Expected Yield
                      </span>
                      <div className="font-bold text-blue-900 text-sm">
                        {crop.expectedYield}
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-xs font-medium text-green-700">
                        Potential ROI
                      </span>
                      <div className="font-bold text-green-900 text-sm">
                        {crop.roi}
                      </div>
                    </div>
                  </div>

                  {crop.riskLevel && (
                    <div
                      className={`p-3 rounded-lg ${getRiskColor(crop.riskLevel)}`}
                    >
                      <div className="flex items-center space-x-2">
                        <Shield size={16} />
                        <span className="text-sm font-medium">
                          Risk Level: {crop.riskLevel}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                      <CheckCircle className="mr-2 text-green-600" size={16} />
                      Key Requirements
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {crop.requirements.slice(0, 2).map((req, i) => (
                        <li key={i} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                      <Lightbulb className="mr-2 text-yellow-600" size={16} />
                      Smart Tips
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {crop.tips.slice(0, 2).map((tip, i) => (
                        <li key={i} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const calendar = generateFasalCalendar(crop.name);
                      setCalendarData(calendar);
                      setActiveTab("calendar");
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                  >
                    <Calendar size={16} className="mr-2" />
                    View Calendar
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200 text-sm font-medium">
                    <Star size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Crop Comparison */}
          {compareMode && selectedCrops.length > 1 && (
            <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-6 shadow-sm transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
                Crop Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-dark-700">
                      <th className="text-left py-2 text-gray-900 dark:text-white">
                        Criteria
                      </th>
                      {selectedCrops.map((cropName) => (
                        <th
                          key={cropName}
                          className="text-left py-2 px-4 text-gray-900 dark:text-white"
                        >
                          {cropName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "suitability",
                      "expectedYield",
                      "roi",
                      "riskLevel",
                      "sustainabilityScore",
                    ].map((criteria) => (
                      <tr
                        key={criteria}
                        className="border-b border-gray-100 dark:border-dark-700"
                      >
                        <td className="py-3 font-medium capitalize text-gray-900 dark:text-white">
                          {criteria.replace(/([A-Z])/g, " $1")}
                        </td>
                        {selectedCrops.map((cropName) => {
                          const crop = recommendations.find(
                            (r) => r.name === cropName,
                          );
                          return (
                            <td
                              key={cropName}
                              className="py-3 px-4 text-gray-700 dark:text-dark-200"
                            >
                              {crop
                                ? String(
                                    (
                                      crop as unknown as Record<string, unknown>
                                    )[criteria],
                                  ) || "N/A"
                                : "N/A"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const FasalCalendarTab = () => (
    <div className="space-y-6">
      {calendarData ? (
        <>
          <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-6 shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center transition-colors duration-200">
                  <Calendar
                    className="mr-3 text-green-600 dark:text-green-400"
                    size={24}
                  />
                  Fasal Calendar - {calendarData.cropName}
                </h2>
                <p className="text-gray-600 dark:text-dark-300 mt-1 transition-colors duration-200">
                  AI-powered seasonal activity plan for {calendarData.season}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.round(calendarData.progressPercentage)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-dark-300">
                  Completed
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-dark-200 transition-colors duration-200">
                  Overall Progress
                </span>
                <span className="text-sm text-gray-600 dark:text-dark-300 transition-colors duration-200">
                  {calendarData.activities.filter((a) => a.completed).length} of{" "}
                  {calendarData.activities.length} tasks
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3 transition-colors duration-200">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-400 dark:to-blue-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${calendarData.progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Calendar Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 transition-colors duration-200">
                <div className="flex items-center">
                  <Clock
                    className="text-blue-600 dark:text-blue-400 mr-3"
                    size={20}
                  />
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Duration
                    </p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-200">
                      {calendarData.totalWeeks} weeks
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4 transition-colors duration-200">
                <div className="flex items-center">
                  <DollarSign
                    className="text-green-600 dark:text-green-400 mr-3"
                    size={20}
                  />
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Total Budget
                    </p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-200">
                      {calendarData.budgetTotal}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Bell className="text-purple-600 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-purple-600 font-medium">
                      Activities
                    </p>
                    <p className="text-lg font-bold text-purple-900">
                      {calendarData.activities.length} planned
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="text-orange-600 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-orange-600 font-medium">
                      Alerts
                    </p>
                    <p className="text-lg font-bold text-orange-900">
                      {calendarData.weatherAlerts.length} active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Alerts */}
          {calendarData.weatherAlerts.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start">
                <AlertCircle className="text-yellow-600 mr-3 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-3">
                    Weather Alerts & Recommendations
                  </h4>
                  <div className="space-y-2">
                    {calendarData.weatherAlerts.map((alert, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                        <p className="text-sm text-yellow-700">{alert}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Step-by-Step Timeline
            </h3>

            <div className="space-y-4">
              {calendarData.activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`relative border-2 rounded-xl p-6 transition-all duration-200 ${
                    activity.completed
                      ? "bg-green-50 border-green-200 shadow-sm"
                      : index === 0
                        ? "bg-blue-50 border-blue-200 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Week Badge */}
                  <div className="absolute -top-3 left-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        activity.completed
                          ? "bg-green-500 text-white"
                          : index === 0
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      Week {activity.week}
                    </span>
                  </div>

                  <div className="flex items-start justify-between pt-3">
                    <div className="flex items-start space-x-4 flex-1">
                      <button
                        onClick={() => {
                          const updatedActivities = calendarData.activities.map(
                            (a) =>
                              a.id === activity.id
                                ? { ...a, completed: !a.completed }
                                : a,
                          );
                          const completedCount = updatedActivities.filter(
                            (a) => a.completed,
                          ).length;
                          const progressPercentage =
                            (completedCount / updatedActivities.length) * 100;
                          setCalendarData({
                            ...calendarData,
                            activities: updatedActivities,
                            progressPercentage,
                          });
                        }}
                        className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          activity.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                        }`}
                      >
                        {activity.completed && <CheckCircle size={14} />}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">{activity.icon}</span>
                          <div>
                            <h4
                              className={`font-bold text-lg ${
                                activity.completed
                                  ? "text-green-800"
                                  : "text-gray-900"
                              }`}
                            >
                              {activity.activity}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  activity.type === "sowing"
                                    ? "bg-green-100 text-green-800"
                                    : activity.type === "irrigation"
                                      ? "bg-blue-100 text-blue-800"
                                      : activity.type === "fertilizer"
                                        ? "bg-purple-100 text-purple-800"
                                        : activity.type === "pest"
                                          ? "bg-red-100 text-red-800"
                                          : activity.type === "harvest"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {activity.type}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  activity.priority === "High"
                                    ? "bg-red-100 text-red-800"
                                    : activity.priority === "Medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {activity.priority} Priority
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {activity.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {activity.budget && (
                            <div className="flex items-center space-x-2 text-sm">
                              <DollarSign
                                className="text-green-600"
                                size={16}
                              />
                              <span className="font-medium text-gray-700">
                                Budget:
                              </span>
                              <span className="text-green-700 font-semibold">
                                {activity.budget}
                              </span>
                            </div>
                          )}

                          {activity.estimatedHours && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="text-blue-600" size={16} />
                              <span className="font-medium text-gray-700">
                                Time:
                              </span>
                              <span className="text-blue-700 font-semibold">
                                {activity.estimatedHours}hrs
                              </span>
                            </div>
                          )}

                          {activity.weatherDependent && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Droplet className="text-blue-600" size={16} />
                              <span className="text-blue-700 font-medium">
                                Weather dependent
                              </span>
                            </div>
                          )}
                        </div>

                        {activity.alternatives &&
                          activity.alternatives.length > 0 && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                <Lightbulb
                                  className="mr-2 text-yellow-600"
                                  size={16}
                                />
                                Budget-friendly alternatives:
                              </p>
                              <ul className="space-y-2">
                                {activity.alternatives.map((alt, altIndex) => (
                                  <li
                                    key={altIndex}
                                    className="flex items-start text-sm"
                                  >
                                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span className="text-gray-700">{alt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:bg-blue-50">
                        <Camera size={16} />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 border border-gray-300 rounded-lg hover:bg-green-50">
                        <Bell size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Notice */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start">
              <Leaf className="text-green-600 mr-3 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-green-800 mb-2">
                  Digital Farm Health Card Integration
                </h4>
                <p className="text-green-700 leading-relaxed">
                  Each completed task is automatically logged into your Farm
                  Health Report. Track your farming progress, maintain detailed
                  records, and get insights for better decision making. Your
                  data helps improve future AI recommendations.
                </p>
                <div className="mt-3 flex space-x-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                    View Health Card
                  </button>
                  <button className="px-4 py-2 border border-green-600 text-green-700 rounded-lg hover:bg-green-50 text-sm font-medium">
                    Download Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Calendar Selected
          </h3>
          <p className="text-gray-600 mb-6">
            Generate crop recommendations first to view the fasal calendar
          </p>
          <button
            onClick={() => setActiveTab("quick")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Get Recommendations
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 sticky top-0 z-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/50 rounded-lg transition-colors duration-200 flex-shrink-0">
                <Leaf
                  className="text-green-600 dark:text-green-400"
                  size={20}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200 truncate">
                  Smart Crop Advisory
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-300 transition-colors duration-200 hidden xs:block truncate">
                  AI-powered farming recommendations
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
              <button className="p-1.5 sm:p-2 text-gray-600 dark:text-dark-300 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-lg transition-colors duration-200 hidden sm:block">
                <Users size={16} />
              </button>
              <button className="px-2 sm:px-4 py-1.5 sm:py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 text-xs sm:text-sm font-medium transition-colors duration-200">
                <span className="hidden sm:inline">Save Session</span>
                <span className="sm:hidden">Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Tabs on Desktop, Dropdown on Mobile */}
      <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          {/* Mobile Dropdown (hidden on lg and up) */}
          <div className="lg:hidden py-3">
            <div className="relative" data-dropdown>
              <button
                onClick={() => setShowTabDropdown(!showTabDropdown)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowTabDropdown(!showTabDropdown);
                  }
                }}
                aria-expanded={showTabDropdown}
                aria-haspopup="true"
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
              >
                <div className="flex items-center space-x-3">
                  {(() => {
                    const currentTab = tabs.find((tab) => tab.id === activeTab);
                    const Icon = currentTab?.icon || tabs[0].icon;
                    return (
                      <>
                        <Icon
                          size={20}
                          className="text-green-600 dark:text-green-400"
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {currentTab?.label || tabs[0].label}
                        </span>
                      </>
                    );
                  })()}
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                    showTabDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showTabDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg shadow-lg z-20">
                  <div className="py-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id as TabType);
                            setShowTabDropdown(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setActiveTab(tab.id as TabType);
                              setShowTabDropdown(false);
                            }
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200 focus:outline-none focus:bg-gray-100 dark:focus:bg-dark-600 ${
                            isActive
                              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <Icon
                            size={18}
                            className={
                              isActive
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500 dark:text-gray-400"
                            }
                          />
                          <span className="font-medium">{tab.label}</span>
                          {isActive && (
                            <CheckCircle
                              size={16}
                              className="ml-auto text-green-600 dark:text-green-400"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Tabs (hidden on mobile) */}
          <div className="hidden lg:flex space-x-6 py-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-green-500 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20"
                      : "border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {activeTab === "quick" && <QuickAdvisoryTab />}
        {activeTab === "calendar" && <FasalCalendarTab />}
        {activeTab === "detailed" && (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
              Detailed Analysis
            </h3>
            <p className="text-gray-600 dark:text-dark-300 transition-colors duration-200">
              Advanced crop analysis and recommendations coming soon
            </p>
          </div>
        )}
        {activeTab === "analytics" && (
          <div className="text-center py-12">
            <PieChart className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
              Farm Analytics
            </h3>
            <p className="text-gray-600 dark:text-dark-300 transition-colors duration-200">
              Performance insights and data visualization coming soon
            </p>
          </div>
        )}
        {activeTab === "history" && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
              Advisory History
            </h3>
            <p className="text-gray-600 dark:text-dark-300 transition-colors duration-200">
              Past recommendations and progress tracking coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropAdvisory;
