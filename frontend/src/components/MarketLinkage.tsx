import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  MapPin,
  Phone,
  Users,
  ExternalLink,
  RefreshCw,
  Search,
  Bell,
  Star,
  Calendar,
  DollarSign,
  BarChart3,
  Activity,
  Target,
  Zap,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Building2,
  Truck,
  FileText,
  Handshake,
  Globe,
  Eye,
  MessageCircle,
  X,
  Plus,
} from "lucide-react";

interface MarketPrice {
  id: string;
  crop: string;
  variety: string;
  market: string;
  price: number;
  change: number;
  volume: number;
  distance: string;
  lastUpdated: string;
  grade: string;
  trend: "up" | "down" | "stable";
  historical: number[];
}

interface Buyer {
  id: string;
  name: string;
  type: "FPO" | "Trader" | "Processor" | "Exporter" | "Retailer";
  location: string;
  crops: string[];
  rating: number;
  contact: string;
  verified: boolean;
  activeDeals: number;
  lastActive: string;
  preferredQuantity: string;
  paymentTerms: string;
}

interface MarketOpportunity {
  id: string;
  title: string;
  crop: string;
  type: "export" | "contract" | "spot" | "premium";
  price: number;
  quantity: string;
  deadline: string;
  roi: string;
  risk: "low" | "medium" | "high";
  requirements: string[];
  company: string;
  location: string;
}

interface PriceAlert {
  id: string;
  crop: string;
  targetPrice: number;
  currentPrice: number;
  condition: "above" | "below";
  active: boolean;
}

const MarketLinkage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "prices" | "buyers" | "opportunities" | "contracts"
  >("prices");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [sortBy, setSortBy] = useState<"price" | "change" | "distance">(
    "change",
  );
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [priceAlerts] = useState<PriceAlert[]>([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [selectedPricesForComparison, setSelectedPricesForComparison] =
    useState<string[]>([]);
  const [filterByDistance, setFilterByDistance] = useState<string>("all");
  const [filterByTrend, setFilterByTrend] = useState<string>("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [notifications, setNotifications] = useState<
    {
      id: string;
      type: "price" | "opportunity" | "alert";
      message: string;
      timestamp: Date;
    }[]
  >([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Enhanced mock data with more realistic information
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([
    {
      id: "1",
      crop: "Rice",
      variety: "Basmati 1121",
      market: "Delhi Azadpur",
      price: 2650,
      change: 12.5,
      volume: 2500,
      distance: "45 km",
      lastUpdated: "5 mins ago",
      grade: "Grade A",
      trend: "up",
      historical: [2400, 2420, 2380, 2450, 2500, 2580, 2650],
    },
    {
      id: "2",
      crop: "Rice",
      variety: "Basmati 1121",
      market: "Rampur Mandi",
      price: 2450,
      change: 8.2,
      volume: 1800,
      distance: "5 km",
      lastUpdated: "2 mins ago",
      grade: "Grade A",
      trend: "up",
      historical: [2300, 2320, 2280, 2350, 2400, 2430, 2450],
    },
    {
      id: "3",
      crop: "Wheat",
      variety: "HD-2967",
      market: "Rampur Mandi",
      price: 2150,
      change: -2.3,
      volume: 3200,
      distance: "5 km",
      lastUpdated: "8 mins ago",
      grade: "Grade B",
      trend: "down",
      historical: [2200, 2180, 2220, 2200, 2180, 2160, 2150],
    },
    {
      id: "4",
      crop: "Sugarcane",
      variety: "Co-238",
      market: "Sugar Mill Rampur",
      price: 320,
      change: 5.1,
      volume: 15000,
      distance: "8 km",
      lastUpdated: "15 mins ago",
      grade: "Standard",
      trend: "up",
      historical: [300, 305, 302, 310, 315, 318, 320],
    },
    {
      id: "5",
      crop: "Tomato",
      variety: "Hybrid",
      market: "Delhi Okhla",
      price: 4500,
      change: -8.5,
      volume: 800,
      distance: "50 km",
      lastUpdated: "3 mins ago",
      grade: "Grade A",
      trend: "down",
      historical: [5000, 4900, 4800, 4700, 4600, 4550, 4500],
    },
    {
      id: "6",
      crop: "Onion",
      variety: "Red Onion",
      market: "Nashik APMC",
      price: 1800,
      change: 15.3,
      volume: 5500,
      distance: "180 km",
      lastUpdated: "12 mins ago",
      grade: "Grade A",
      trend: "up",
      historical: [1500, 1520, 1580, 1620, 1680, 1750, 1800],
    },
  ]);

  const buyers: Buyer[] = [
    {
      id: "1",
      name: "Rampur Farmers Producer Organization",
      type: "FPO",
      location: "Rampur, UP",
      crops: ["Rice", "Wheat", "Sugarcane"],
      rating: 4.8,
      contact: "+91 98765 43210",
      verified: true,
      activeDeals: 15,
      lastActive: "2 hours ago",
      preferredQuantity: "50-500 quintals",
      paymentTerms: "15 days",
    },
    {
      id: "2",
      name: "Modern Food Processing Ltd",
      type: "Processor",
      location: "Ghaziabad, UP",
      crops: ["Rice", "Wheat", "Tomato"],
      rating: 4.5,
      contact: "+91 98765 43211",
      verified: true,
      activeDeals: 8,
      lastActive: "1 hour ago",
      preferredQuantity: "100+ quintals",
      paymentTerms: "30 days",
    },
    {
      id: "3",
      name: "Green Valley Export House",
      type: "Exporter",
      location: "Mumbai, MH",
      crops: ["Rice", "Onion"],
      rating: 4.7,
      contact: "+91 98765 43212",
      verified: true,
      activeDeals: 25,
      lastActive: "30 mins ago",
      preferredQuantity: "1000+ quintals",
      paymentTerms: "Advance payment",
    },
    {
      id: "4",
      name: "Fresh Mart Retail Chain",
      type: "Retailer",
      location: "Delhi NCR",
      crops: ["Tomato", "Onion"],
      rating: 4.2,
      contact: "+91 98765 43213",
      verified: false,
      activeDeals: 12,
      lastActive: "4 hours ago",
      preferredQuantity: "10-50 quintals",
      paymentTerms: "7 days",
    },
  ];

  const marketOpportunities: MarketOpportunity[] = [
    {
      id: "1",
      title: "Organic Basmati Export Contract",
      crop: "Rice",
      type: "export",
      price: 4500,
      quantity: "500+ quintals",
      deadline: "2024-02-15",
      roi: "40%",
      risk: "medium",
      requirements: [
        "Organic certification",
        "Grade A quality",
        "Minimum 500 quintals",
      ],
      company: "Global Exports Ltd",
      location: "Mumbai",
    },
    {
      id: "2",
      title: "Premium Onion Spot Deal",
      crop: "Onion",
      type: "spot",
      price: 2200,
      quantity: "100-300 quintals",
      deadline: "2024-01-25",
      roi: "25%",
      risk: "low",
      requirements: ["Grade A", "Immediate delivery", "Proper packaging"],
      company: "Metro Markets",
      location: "Delhi",
    },
    {
      id: "3",
      title: "Contract Farming - Sugarcane",
      crop: "Sugarcane",
      type: "contract",
      price: 350,
      quantity: "10+ acres",
      deadline: "2024-03-01",
      roi: "30%",
      risk: "low",
      requirements: [
        "12-month contract",
        "Quality assurance",
        "Timely delivery",
      ],
      company: "Sugar Mills Cooperative",
      location: "Rampur",
    },
  ];

  // Simulate live price updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setMarketPrices((prevPrices) =>
        prevPrices.map((price) => {
          const changePercent = (Math.random() - 0.5) * 2; // -1% to +1%
          const newPrice = Math.max(
            price.price * (1 + changePercent / 100),
            50,
          );
          const newChange =
            ((newPrice - price.historical[price.historical.length - 2]) /
              price.historical[price.historical.length - 2]) *
            100;

          return {
            ...price,
            price: Math.round(newPrice),
            change: Number(newChange.toFixed(1)),
            trend: newChange > 1 ? "up" : newChange < -1 ? "down" : "stable",
            historical: [...price.historical.slice(1), Math.round(newPrice)],
            lastUpdated: "Just now",
          };
        }),
      );
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isLiveMode]);

  // Enhanced filtering
  const filteredPrices = marketPrices
    .filter((price) => {
      const matchesSearch =
        price.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.market.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCrop =
        selectedCrop === "all" ||
        price.crop.toLowerCase() === selectedCrop.toLowerCase();
      const matchesDistance =
        filterByDistance === "all" ||
        (filterByDistance === "near" && parseInt(price.distance) <= 10) ||
        (filterByDistance === "medium" && parseInt(price.distance) <= 50) ||
        (filterByDistance === "far" && parseInt(price.distance) > 50);
      const matchesTrend =
        filterByTrend === "all" || price.trend === filterByTrend;
      const matchesPriceRange =
        price.price >= priceRange.min && price.price <= priceRange.max;

      return (
        matchesSearch &&
        matchesCrop &&
        matchesDistance &&
        matchesTrend &&
        matchesPriceRange
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return b.price - a.price;
        case "change":
          return Math.abs(b.change) - Math.abs(a.change);
        case "distance":
          return parseInt(a.distance) - parseInt(b.distance);
        default:
          return 0;
      }
    });

  const getUniqueCrops = () => {
    const crops = [...new Set(marketPrices.map((p) => p.crop))];
    return crops;
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up" || change > 0)
      return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (trend === "down" || change < 0)
      return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getBuyerTypeIcon = (type: string) => {
    switch (type) {
      case "FPO":
        return <Users className="w-4 h-4" />;
      case "Processor":
        return <Building2 className="w-4 h-4" />;
      case "Trader":
        return <Handshake className="w-4 h-4" />;
      case "Exporter":
        return <Globe className="w-4 h-4" />;
      case "Retailer":
        return <Truck className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  const getBuyerTypeColor = (type: string) => {
    switch (type) {
      case "FPO":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700";
      case "Processor":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700";
      case "Trader":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700";
      case "Exporter":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700";
      case "Retailer":
        return "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  const MiniChart = ({ data, trend }: { data: number[]; trend: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 60;
        const y = 20 - ((value - min) / range) * 15;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width="60" height="20" className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke={
            trend === "up"
              ? "#10b981"
              : trend === "down"
                ? "#ef4444"
                : "#6b7280"
          }
          strokeWidth="1.5"
        />
      </svg>
    );
  };

  const togglePriceComparison = (priceId: string) => {
    setSelectedPricesForComparison((prev) =>
      prev.includes(priceId)
        ? prev.filter((id) => id !== priceId)
        : [...prev, priceId],
    );
  };

  const ComparisonModal = () => {
    const comparisonPrices = marketPrices.filter((price) =>
      selectedPricesForComparison.includes(price.id),
    );

    if (!showComparisonModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Price Comparison
              </h2>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {comparisonPrices.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  Select prices to compare
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-900 dark:text-gray-100">
                        Crop
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-900 dark:text-gray-100">
                        Variety
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-900 dark:text-gray-100">
                        Market
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-900 dark:text-gray-100">
                        Price
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-900 dark:text-gray-100">
                        Change
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-900 dark:text-gray-100">
                        Distance
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-900 dark:text-gray-100">
                        Volume
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-900 dark:text-gray-100">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonPrices.map((price, index) => (
                      <tr
                        key={price.id}
                        className={
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-50 dark:bg-gray-700"
                        }
                      >
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                          {price.crop}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100">
                          {price.variety}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100">
                          {price.market}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 font-bold text-lg text-gray-900 dark:text-gray-100">
                          ₹{price.price.toLocaleString()}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                              price.change >= 0
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                            }`}
                          >
                            {getTrendIcon(price.trend, price.change)}
                            {Math.abs(price.change)}%
                          </span>
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100">
                          {price.distance}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100">
                          {price.volume} qtl
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          <MiniChart
                            data={price.historical}
                            trend={price.trend}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Live Indicator */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-green-600" />
                <span className="break-words">Market Intelligence Hub</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Real-time prices, verified buyers, and market opportunities
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${isLiveMode ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                ></div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {isLiveMode ? "Live" : "Static"} • Last updated:{" "}
                  <span className="hidden sm:inline">
                    {lastUpdate.toLocaleTimeString()}
                  </span>
                  <span className="sm:hidden">
                    {lastUpdate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </span>
              </div>

              <button
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg border transition-colors text-sm ${
                  isLiveMode
                    ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                    : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <Activity className="w-4 h-4 mr-1 sm:mr-2 inline" />
                <span className="hidden sm:inline">
                  {isLiveMode ? "Live Mode" : "Static Mode"}
                </span>
                <span className="sm:hidden">
                  {isLiveMode ? "Live" : "Static"}
                </span>
              </button>
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
                  id: "prices",
                  label: "Live Prices",
                  shortLabel: "Prices",
                  icon: TrendingUp,
                  count: filteredPrices.length,
                },
                {
                  id: "buyers",
                  label: "Verified Buyers",
                  shortLabel: "Buyers",
                  icon: Users,
                  count: buyers.length,
                },
                {
                  id: "opportunities",
                  label: "Market Opportunities",
                  shortLabel: "Opportunities",
                  icon: Target,
                  count: marketOpportunities.length,
                },
                {
                  id: "contracts",
                  label: "Contract Farming",
                  shortLabel: "Contracts",
                  icon: FileText,
                  count: 3,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as
                        | "prices"
                        | "buyers"
                        | "opportunities"
                        | "contracts",
                    )
                  }
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 sm:space-x-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-green-500 text-green-600 dark:text-green-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full flex-shrink-0 ${
                      activeTab === tab.id
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "prices" && (
              <div className="space-y-6">
                {/* Search and Filter Controls */}
                <div className="space-y-4">
                  {/* Top Row - Search */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search crops, varieties, or markets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Bottom Row - Filters and Actions */}
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-wrap gap-3 flex-1">
                      <select
                        value={selectedCrop}
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm min-w-[120px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="all">All Crops</option>
                        {getUniqueCrops().map((crop) => (
                          <option key={crop} value={crop}>
                            {crop}
                          </option>
                        ))}
                      </select>

                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(
                            e.target.value as "price" | "change" | "distance",
                          )
                        }
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm min-w-[140px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="change">Sort by Price Change</option>
                        <option value="price">Sort by Price</option>
                        <option value="distance">Sort by Distance</option>
                      </select>

                      <select
                        value={filterByDistance}
                        onChange={(e) => setFilterByDistance(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm min-w-[120px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="all">All Distances</option>
                        <option value="near">Near (≤10 km)</option>
                        <option value="medium">Medium (≤50 km)</option>
                        <option value="far">Far (&gt;50 km)</option>
                      </select>

                      <select
                        value={filterByTrend}
                        onChange={(e) => setFilterByTrend(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm min-w-[110px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="all">All Trends</option>
                        <option value="up">Rising</option>
                        <option value="down">Falling</option>
                        <option value="stable">Stable</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowNotifications(!showNotifications)
                          }
                          className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg border border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center relative text-sm"
                        >
                          <Bell className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">
                            Notifications
                          </span>
                          {notifications.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {notifications.length}
                            </span>
                          )}
                        </button>

                        {showNotifications && (
                          <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                Market Notifications
                              </h3>
                            </div>
                            <div className="p-2">
                              {notifications.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                  No new notifications
                                </p>
                              ) : (
                                notifications.map((notification) => (
                                  <div
                                    key={notification.id}
                                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                                  >
                                    <div className="flex items-start space-x-3">
                                      <div
                                        className={`w-2 h-2 rounded-full mt-2 ${
                                          notification.type === "price"
                                            ? "bg-green-500"
                                            : notification.type ===
                                                "opportunity"
                                              ? "bg-blue-500"
                                              : "bg-yellow-500"
                                        }`}
                                      ></div>
                                      <div className="flex-1">
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                          {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                          {notification.timestamp.toLocaleTimeString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setShowAlertModal(true)}
                        className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg border border-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors flex items-center"
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        Price Alerts ({priceAlerts.length})
                      </button>

                      <button
                        onClick={() => setShowComparisonModal(true)}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center text-sm"
                        disabled={selectedPricesForComparison.length < 2}
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">
                          Compare ({selectedPricesForComparison.length})
                        </span>
                        <span className="sm:hidden">
                          ({selectedPricesForComparison.length})
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          const newNotification = {
                            id: Date.now().toString(),
                            type: "price" as const,
                            message: `Price updated: ${filteredPrices[0]?.crop} now at ₹${filteredPrices[0]?.price}`,
                            timestamp: new Date(),
                          };
                          setNotifications((prev) =>
                            [newNotification, ...prev].slice(0, 10),
                          );
                          setLastUpdate(new Date());
                        }}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center text-sm"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Refresh</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Market Insights Dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-5 border border-green-200 dark:border-green-700 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                          <p className="text-green-700 dark:text-green-300 text-sm font-semibold">
                            Best Deal Today
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-green-800 dark:text-green-200 mb-1">
                          ₹
                          {Math.max(
                            ...filteredPrices.map((p) => p.price),
                          ).toLocaleString()}
                        </p>
                        <p className="text-green-600 dark:text-green-400 text-xs font-medium">
                          {
                            filteredPrices.find(
                              (p) =>
                                p.price ===
                                Math.max(...filteredPrices.map((p) => p.price)),
                            )?.crop
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-5 border border-blue-200 dark:border-blue-700 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <ArrowUpRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                          <p className="text-blue-700 dark:text-blue-300 text-sm font-semibold">
                            Rising Markets
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-1">
                          {
                            filteredPrices.filter((p) => p.trend === "up")
                              .length
                          }
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 text-xs font-medium">
                          Markets trending up
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-5 border border-purple-200 dark:border-purple-700 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                          <p className="text-purple-700 dark:text-purple-300 text-sm font-semibold">
                            Avg Price Change
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-1">
                          {(
                            filteredPrices.reduce(
                              (acc, p) => acc + p.change,
                              0,
                            ) / filteredPrices.length || 0
                          ).toFixed(1)}
                          %
                        </p>
                        <p className="text-purple-600 dark:text-purple-400 text-xs font-medium">
                          Market sentiment
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-5 border border-orange-200 dark:border-orange-700 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                          <p className="text-orange-700 dark:text-orange-300 text-sm font-semibold">
                            Total Volume
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-orange-800 dark:text-orange-200 mb-1">
                          {(
                            filteredPrices.reduce(
                              (acc, p) => acc + p.volume,
                              0,
                            ) / 1000
                          ).toFixed(1)}
                          K
                        </p>
                        <p className="text-orange-600 dark:text-orange-400 text-xs font-medium">
                          Quintals traded
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Price Range Filter
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Min Price (₹)
                      </label>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            min: Number(e.target.value),
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Max Price (₹)
                      </label>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            max: Number(e.target.value),
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="10000"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => setPriceRange({ min: 0, max: 10000 })}
                        className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredPrices.map((price) => (
                    <div
                      key={price.id}
                      className={`bg-white dark:bg-gray-800 border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer ${
                        selectedPricesForComparison.includes(price.id)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600"
                      }`}
                      onClick={() => togglePriceComparison(price.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                            {price.crop}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {price.variety}
                          </p>
                          <p className="text-gray-500 dark:text-gray-500 text-xs">
                            {price.grade}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedPricesForComparison.includes(
                              price.id,
                            )}
                            onChange={() => togglePriceComparison(price.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              price.change >= 0
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                            }`}
                          >
                            {getTrendIcon(price.trend, price.change)}
                            <span className="ml-1">
                              {Math.abs(price.change)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Market:
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {price.market}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Price:
                          </span>
                          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            ₹{price.price.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Volume:
                          </span>
                          <span className="text-gray-900 dark:text-gray-100">
                            {price.volume} qtl
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Distance:
                          </span>
                          <span className="text-gray-900 dark:text-gray-100 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {price.distance}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Trend:
                          </span>
                          <MiniChart
                            data={price.historical}
                            trend={price.trend}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {price.lastUpdated}
                        </span>
                        <span
                          className={`px-2 py-1 rounded ${
                            price.trend === "up"
                              ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : price.trend === "down"
                                ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {price.trend === "up"
                            ? "Rising"
                            : price.trend === "down"
                              ? "Falling"
                              : "Stable"}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Get Directions
                        </button>
                        <button
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Bell className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "buyers" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Verified Buyers & Suppliers
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search buyers..."
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Connect
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {buyers.map((buyer) => (
                    <div
                      key={buyer.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {buyer.name}
                            </h4>
                            {buyer.verified && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getBuyerTypeColor(buyer.type)}`}
                            >
                              {getBuyerTypeIcon(buyer.type)}
                              <span className="ml-1">{buyer.type}</span>
                            </span>
                            <div className="flex items-center text-yellow-400">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                                {buyer.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Active Deals
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            {buyer.activeDeals}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{buyer.location}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>Payment: {buyer.paymentTerms}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Truck className="w-4 h-4 mr-2" />
                          <span>Quantity: {buyer.preferredQuantity}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Activity className="w-4 h-4 mr-2" />
                          <span>Last active: {buyer.lastActive}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Currently Buying:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {buyer.crops.map((crop, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm border border-green-200 dark:border-green-700"
                            >
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center justify-center">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact
                        </button>
                        <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </button>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "opportunities" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Market Opportunities
                  </h3>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Get Recommendations
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {marketOpportunities.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                            {opportunity.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {opportunity.company}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(opportunity.risk)}`}
                        >
                          {opportunity.risk} risk
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Crop:
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {opportunity.crop}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Price:
                          </span>
                          <span className="text-xl font-bold text-green-600">
                            ₹{opportunity.price.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Quantity:
                          </span>
                          <span className="text-gray-900 dark:text-gray-100">
                            {opportunity.quantity}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            ROI:
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            {opportunity.roi}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Deadline:
                          </span>
                          <span className="text-gray-900 dark:text-gray-100 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(
                              opportunity.deadline,
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Location:
                          </span>
                          <span className="text-gray-900 dark:text-gray-100">
                            {opportunity.location}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Requirements:
                        </p>
                        <ul className="space-y-1">
                          {opportunity.requirements.map((req, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 dark:text-gray-400 flex items-center"
                            >
                              <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center justify-center">
                          <Target className="w-4 h-4 mr-2" />
                          Apply Now
                        </button>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "contracts" && (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Contract Farming
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Secure contracts with guaranteed prices and support
                  </p>
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors">
                    Explore Contracts
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Today's Best Price
                </p>
                <p className="text-2xl font-bold text-green-600">₹2,650</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Basmati Rice
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Active Buyers
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {buyers.length}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Verified profiles
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Opportunities
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {marketOpportunities.length}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  High ROI available
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Price Alerts
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {priceAlerts.length}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Active notifications
                </p>
              </div>
              <Bell className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Price Alert Modal */}
        {showAlertModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Create Price Alert
                  </h2>
                  <button
                    onClick={() => setShowAlertModal(false)}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Crop
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                      <option>Select Crop</option>
                      {getUniqueCrops().map((crop) => (
                        <option key={crop} value={crop}>
                          {crop}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Price (₹)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Enter target price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alert When Price
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                      <option value="above">Goes Above Target</option>
                      <option value="below">Goes Below Target</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAlertModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
                    Create Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Market Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Live Market Feed
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Live
              </span>
            </div>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {filteredPrices.slice(0, 5).map((price) => (
              <div
                key={price.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      price.trend === "up"
                        ? "bg-green-500"
                        : price.trend === "down"
                          ? "bg-red-500"
                          : "bg-gray-500"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {price.crop} - {price.variety}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {price.market}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    ₹{price.price.toLocaleString()}
                  </p>
                  <p
                    className={`text-sm ${
                      price.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {price.change >= 0 ? "+" : ""}
                    {price.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modals */}
        <ComparisonModal />
      </div>
    </div>
  );
};

export default MarketLinkage;
