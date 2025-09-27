import React, { useState, useEffect } from "react";
import {
  Globe,
  FileText,
  Truck,
  CheckCircle,
  TrendingUp,
  Users,
  Clock,
  Star,
  Phone,
  Mail,
  ExternalLink,
  Download,
  Upload,
  Calculator,
  Shield,
  Target,
  ChevronDown,
  Building2,
  Award,
  BookOpen,
  HelpCircle,
  Calendar,
  Plus,
} from "lucide-react";

// Interfaces
interface ExportOpportunity {
  id: string;
  country: string;
  crop: string;
  demand: "High" | "Medium" | "Low";
  price: number;
  volume: string;
  season: string;
  requirements: string[];
  roi: string;
  risk: "Low" | "Medium" | "High";
  deadline: string;
  contactPerson: string;
  flag: string;
}

interface ExportDocument {
  id: string;
  name: string;
  type: "certificate" | "license" | "form" | "guide";
  status: "required" | "optional" | "completed";
  description: string;
  validUntil?: string;
  downloadUrl?: string;
}

interface MarketInsight {
  id: string;
  country: string;
  crop: string;
  insight: string;
  trend: "up" | "down" | "stable";
  confidence: number;
  lastUpdated: string;
}

interface ExportService {
  id: string;
  name: string;
  type: "logistics" | "documentation" | "certification" | "consultation";
  provider: string;
  rating: number;
  price: string;
  description: string;
  features: string[];
  contact: string;
}

const ExportAssistance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "opportunities" | "documentation" | "insights" | "services"
  >("opportunities");
  const [showTabDropdown, setShowTabDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const [exportOpportunities] = useState<ExportOpportunity[]>([
    {
      id: "1",
      country: "United Arab Emirates",
      crop: "Basmati Rice",
      demand: "High",
      price: 1200,
      volume: "500+ tonnes",
      season: "Year-round",
      requirements: ["Organic Certification", "HACCP", "Halal Certificate"],
      roi: "35%",
      risk: "Low",
      deadline: "2024-03-15",
      contactPerson: "Ahmed Al-Rashid",
      flag: "🇦🇪",
    },
    {
      id: "2",
      country: "United Kingdom",
      crop: "Turmeric",
      demand: "Medium",
      price: 850,
      volume: "200+ tonnes",
      season: "Oct-Mar",
      requirements: ["EU Organic", "Fair Trade", "Pesticide Residue Test"],
      roi: "42%",
      risk: "Medium",
      deadline: "2024-02-28",
      contactPerson: "Sarah Thompson",
      flag: "🇬🇧",
    },
    {
      id: "3",
      country: "Singapore",
      crop: "Fresh Vegetables",
      demand: "High",
      price: 950,
      volume: "100+ tonnes",
      season: "Year-round",
      requirements: ["GLOBALG.A.P.", "Traceability", "Cold Chain"],
      roi: "28%",
      risk: "Low",
      deadline: "2024-04-10",
      contactPerson: "Li Wei",
      flag: "🇸🇬",
    },
  ]);

  const [exportDocuments] = useState<ExportDocument[]>([
    {
      id: "1",
      name: "Export License",
      type: "license",
      status: "required",
      description: "Mandatory license for agricultural exports",
      validUntil: "2024-12-31",
    },
    {
      id: "2",
      name: "Phytosanitary Certificate",
      type: "certificate",
      status: "required",
      description: "Plant health certificate from authorized agency",
    },
    {
      id: "3",
      name: "Certificate of Origin",
      type: "certificate",
      status: "required",
      description: "Document certifying the country of origin",
    },
    {
      id: "4",
      name: "HACCP Certificate",
      type: "certificate",
      status: "optional",
      description: "Food safety management system certification",
      validUntil: "2025-06-15",
    },
    {
      id: "5",
      name: "Export Procedure Guide",
      type: "guide",
      status: "optional",
      description: "Step-by-step guide for first-time exporters",
      downloadUrl: "#",
    },
  ]);

  const [marketInsights] = useState<MarketInsight[]>([
    {
      id: "1",
      country: "UAE",
      crop: "Basmati Rice",
      insight:
        "Demand for premium basmati rice increasing by 15% annually. Best market window: Oct-Dec.",
      trend: "up",
      confidence: 92,
      lastUpdated: "2 days ago",
    },
    {
      id: "2",
      country: "UK",
      crop: "Organic Spices",
      insight:
        "Growing interest in organic turmeric and ginger. Health trend driving 25% growth.",
      trend: "up",
      confidence: 88,
      lastUpdated: "1 week ago",
    },
    {
      id: "3",
      country: "Singapore",
      crop: "Fresh Produce",
      insight:
        "Supply chain disruptions creating opportunities for reliable Indian suppliers.",
      trend: "up",
      confidence: 85,
      lastUpdated: "3 days ago",
    },
  ]);

  const [exportServices] = useState<ExportService[]>([
    {
      id: "1",
      name: "Global Logistics Pro",
      type: "logistics",
      provider: "ShipFast International",
      rating: 4.8,
      price: "₹15,000/shipment",
      description: "End-to-end logistics solution for agricultural exports",
      features: [
        "Door-to-door delivery",
        "Real-time tracking",
        "Insurance included",
        "Documentation support",
      ],
      contact: "+91 98765 43210",
    },
    {
      id: "2",
      name: "Export Doc Assistant",
      type: "documentation",
      provider: "TradeEase Solutions",
      rating: 4.6,
      price: "₹8,000/process",
      description: "Complete documentation and compliance management",
      features: [
        "Document preparation",
        "Government liaison",
        "Compliance check",
        "Digital storage",
      ],
      contact: "+91 98765 43211",
    },
    {
      id: "3",
      name: "Organic Certification Fast Track",
      type: "certification",
      provider: "CertifyIndia",
      rating: 4.7,
      price: "₹25,000/certificate",
      description: "Quick organic and quality certifications for exports",
      features: [
        "USDA Organic",
        "EU Organic",
        "JAS Organic",
        "30-day processing",
      ],
      contact: "+91 98765 43212",
    },
  ]);

  // Tab configuration
  const tabs = [
    {
      id: "opportunities",
      label: "Export Opportunities",
      icon: Globe,
      count: exportOpportunities.length,
    },
    {
      id: "documentation",
      label: "Documentation",
      icon: FileText,
      count: exportDocuments.filter((doc) => doc.status === "required").length,
    },
    {
      id: "insights",
      label: "Market Insights",
      icon: TrendingUp,
      count: marketInsights.length,
    },
    {
      id: "services",
      label: "Export Services",
      icon: Users,
      count: exportServices.length,
    },
  ];

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

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "High":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "Medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      case "Low":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-600 dark:text-green-400";
      case "Medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "High":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case "required":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "optional":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case "logistics":
        return <Truck className="w-5 h-5" />;
      case "documentation":
        return <FileText className="w-5 h-5" />;
      case "certification":
        return <Award className="w-5 h-5" />;
      case "consultation":
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
                <span>Export Assistance</span>
                <span className="ml-3 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                  Global Markets
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Expand your reach with AI-powered export opportunities and
                comprehensive support
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {
                    exportOpportunities.filter((op) => op.demand === "High")
                      .length
                  }
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  High Demand
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {exportOpportunities.length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Opportunities
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Tabs on Desktop, Dropdown on Mobile */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-visible">
          {/* Mobile Dropdown (hidden on lg and up) */}
          <div className="lg:hidden border-b border-gray-200 dark:border-gray-700 p-4">
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
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <div className="flex items-center space-x-3">
                  {(() => {
                    const currentTab = tabs.find((tab) => tab.id === activeTab);
                    const Icon = currentTab?.icon || tabs[0].icon;
                    return (
                      <>
                        <Icon
                          size={20}
                          className="text-blue-600 dark:text-blue-400"
                        />
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {currentTab?.label || tabs[0].label}
                          </span>
                          {currentTab?.count !== null &&
                            currentTab?.count !== undefined && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
                                {currentTab.count}
                              </span>
                            )}
                        </div>
                      </>
                    );
                  })()}
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                    showTabDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {showTabDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20">
                  <div className="py-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id as typeof activeTab);
                            setShowTabDropdown(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setActiveTab(tab.id as typeof activeTab);
                              setShowTabDropdown(false);
                            }
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 ${
                            isActive
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <Icon
                            size={18}
                            className={
                              isActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-500 dark:text-gray-400"
                            }
                          />
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{tab.label}</span>
                            {tab.count !== null && (
                              <span
                                className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  isActive
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                }`}
                              >
                                {tab.count}
                              </span>
                            )}
                          </div>
                          {isActive && (
                            <CheckCircle
                              size={16}
                              className="ml-auto text-blue-600 dark:text-blue-400"
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

          {/* Desktop Tabs (hidden on mobile, shown on lg and up) */}
          <div className="hidden lg:block border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <nav
              className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max"
              aria-label="Tabs"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        activeTab === tab.id
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
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
          <div className="p-6 overflow-visible">
            {activeTab === "opportunities" && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search opportunities, countries, crops..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:w-auto">
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[140px]"
                      >
                        <option value="all">All Countries</option>
                        <option value="uae">UAE</option>
                        <option value="uk">UK</option>
                        <option value="singapore">Singapore</option>
                      </select>

                      <select
                        value={selectedCrop}
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[120px]"
                      >
                        <option value="all">All Crops</option>
                        <option value="rice">Rice</option>
                        <option value="spices">Spices</option>
                        <option value="vegetables">Vegetables</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Opportunities Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {exportOpportunities.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{opportunity.flag}</span>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {opportunity.country}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getDemandColor(opportunity.demand)}`}
                            >
                              {opportunity.demand} Demand
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {opportunity.crop} • {opportunity.volume}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ${opportunity.price}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            per tonne
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            {opportunity.roi}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Expected ROI
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div
                            className={`text-lg font-bold ${getRiskColor(opportunity.risk)}`}
                          >
                            {opportunity.risk}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Risk Level
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Requirements:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {opportunity.requirements.map((req, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs border border-blue-200 dark:border-blue-700"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Deadline: {opportunity.deadline}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{opportunity.contactPerson}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm font-medium">
                          <Target className="w-4 h-4 mr-2" />
                          Apply Now
                        </button>
                        <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-sm font-medium">
                          <Calculator className="w-4 h-4 mr-2" />
                          Calculate Cost
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "documentation" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Export Documentation
                  </h3>
                  <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {exportDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {doc.name}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentStatusColor(doc.status)}`}
                          >
                            {doc.status.charAt(0).toUpperCase() +
                              doc.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-blue-600">
                          {doc.type === "certificate" && (
                            <Award className="w-6 h-6" />
                          )}
                          {doc.type === "license" && (
                            <Shield className="w-6 h-6" />
                          )}
                          {doc.type === "form" && (
                            <FileText className="w-6 h-6" />
                          )}
                          {doc.type === "guide" && (
                            <BookOpen className="w-6 h-6" />
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {doc.description}
                      </p>

                      {doc.validUntil && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Valid until: {doc.validUntil}</span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {doc.downloadUrl ? (
                          <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm font-medium">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </button>
                        ) : (
                          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm font-medium">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Apply
                          </button>
                        )}
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <HelpCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "insights" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Market Insights & Trends
                </h3>

                <div className="space-y-4">
                  {marketInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {insight.country} - {insight.crop}
                            </h4>
                            <div className="flex items-center">
                              {insight.trend === "up" && (
                                <TrendingUp className="w-4 h-4 text-green-600" />
                              )}
                              {insight.trend === "down" && (
                                <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                              )}
                              {insight.trend === "stable" && (
                                <TrendingUp className="w-4 h-4 text-gray-600" />
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {insight.insight}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Updated {insight.lastUpdated}</span>
                          </div>
                        </div>
                        <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="text-2xl font-bold text-blue-600">
                            {insight.confidence}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Confidence
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Export Services
                  </h3>
                  <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Request Quote
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {exportServices.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-blue-600">
                              {getServiceTypeIcon(service.type)}
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {service.name}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            by {service.provider}
                          </p>
                          <div className="flex items-center mb-3">
                            <div className="flex items-center text-yellow-400 mr-2">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                                {service.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {service.price}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {service.description}
                      </p>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Features:
                        </p>
                        <div className="space-y-1">
                          {service.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                            >
                              <CheckCircle className="w-3 h-3 text-green-600 mr-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{service.contact}</span>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm font-medium">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact
                        </button>
                        <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-sm font-medium">
                          <Mail className="w-4 h-4 mr-2" />
                          Get Quote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportAssistance;
