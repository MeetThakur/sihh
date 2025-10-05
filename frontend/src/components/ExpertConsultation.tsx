import React, { useState } from "react";
import {
  Star,
  MessageCircle,
  Phone,
  Video,
  Calendar,
  User,
  Clock,
  MapPin,
  Users,
  Search,
  Heart,
  Zap,
  X,
  Languages,
  Award,
  CheckCircle,
} from "lucide-react";

interface Expert {
  id: string;
  name: string;
  specialty: string;
  subSpecialties: string[];
  experience: number;
  rating: number;
  totalConsultations: number;
  languages: string[];
  availability: "available" | "busy" | "offline";
  pricePerSession: number;
  imageUrl?: string;
  qualifications: string[];
  description: string;
  location: string;
  responseTime: string;
  successRate: number;
  specialOffers?: string[];
  certifications: string[];
  expertise: string[];
  consultationTypes: ("chat" | "voice" | "video" | "field")[];
  slots: string[];
  reviews: Review[];
  featured?: boolean;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  consultationType: string;
}

interface Consultation {
  id: string;
  expertId: string;
  expertName: string;
  specialty: string;
  date: string;
  time: string;
  type: "chat" | "voice" | "video" | "field";
  status: "completed" | "upcoming" | "cancelled";
  rating?: number;
  notes?: string;
  price: number;
}

const ExpertConsultation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"experts" | "history">("experts");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showExpertDetails, setShowExpertDetails] = useState(false);
  const [favoriteExperts, setFavoriteExperts] = useState<string[]>([]);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [selectedConsultationType, setSelectedConsultationType] = useState<
    "chat" | "voice" | "video" | "field"
  >("chat");
  const [selectedSlot, setSelectedSlot] = useState("");

  // Mock data
  const [experts] = useState<Expert[]>([
    {
      id: "1",
      name: "Dr. Ramesh Kumar",
      specialty: "Crop Disease Management",
      subSpecialties: [
        "Plant Pathology",
        "Disease Prevention",
        "Fungal Control",
      ],
      experience: 15,
      rating: 4.8,
      totalConsultations: 1250,
      languages: ["Hindi", "English", "Punjabi"],
      availability: "available",
      pricePerSession: 250,
      qualifications: ["PhD Agronomy", "Plant Pathologist"],
      description:
        "Expert in identifying and treating crop diseases with 15+ years of field experience.",
      location: "Punjab, India",
      responseTime: "< 2 hours",
      successRate: 95,
      certifications: ["Certified Plant Pathologist", "Agricultural Expert"],
      expertise: [
        "Disease Diagnosis",
        "Treatment Plans",
        "Prevention Strategies",
      ],
      consultationTypes: ["chat", "voice", "video", "field"],
      slots: ["9:00 AM", "2:00 PM", "6:00 PM"],
      reviews: [],
      featured: true,
    },
    {
      id: "2",
      name: "Priya Sharma",
      specialty: "Organic Farming",
      subSpecialties: ["Soil Health", "Natural Fertilizers", "Pest Control"],
      experience: 12,
      rating: 4.7,
      totalConsultations: 890,
      languages: ["Hindi", "English"],
      availability: "available",
      pricePerSession: 200,
      qualifications: ["MSc Agriculture", "Organic Farming Certified"],
      description:
        "Specializes in sustainable and organic farming practices for better yields.",
      location: "Haryana, India",
      responseTime: "< 3 hours",
      successRate: 92,
      certifications: ["Organic Farming Expert", "Soil Health Specialist"],
      expertise: ["Organic Methods", "Soil Testing", "Natural Solutions"],
      consultationTypes: ["chat", "voice", "video"],
      slots: ["10:00 AM", "3:00 PM"],
      reviews: [],
      featured: false,
    },
    {
      id: "3",
      name: "Rajesh Patel",
      specialty: "Irrigation & Water Management",
      subSpecialties: [
        "Drip Irrigation",
        "Water Conservation",
        "Soil Moisture",
      ],
      experience: 18,
      rating: 4.9,
      totalConsultations: 1450,
      languages: ["Hindi", "Gujarati", "English"],
      availability: "busy",
      pricePerSession: 300,
      qualifications: [
        "BE Agricultural Engineering",
        "Water Management Expert",
      ],
      description:
        "Leading expert in modern irrigation techniques and water conservation methods.",
      location: "Gujarat, India",
      responseTime: "< 1 hour",
      successRate: 97,
      certifications: ["Irrigation Specialist", "Water Conservation Expert"],
      expertise: ["Smart Irrigation", "Water Efficiency", "System Design"],
      consultationTypes: ["chat", "voice", "video", "field"],
      slots: ["8:00 AM", "1:00 PM", "5:00 PM"],
      reviews: [],
      featured: true,
    },
    {
      id: "4",
      name: "Dr. Sunita Singh",
      specialty: "Soil Health & Fertility",
      subSpecialties: ["Soil Testing", "Nutrient Management", "pH Balance"],
      experience: 20,
      rating: 4.6,
      totalConsultations: 1680,
      languages: ["Hindi", "English", "Bengali"],
      availability: "available",
      pricePerSession: 275,
      qualifications: ["PhD Soil Science", "Agricultural Consultant"],
      description:
        "Soil science expert helping farmers optimize soil health for maximum productivity.",
      location: "West Bengal, India",
      responseTime: "< 4 hours",
      successRate: 94,
      certifications: ["Soil Scientist", "Fertility Expert"],
      expertise: ["Soil Analysis", "Fertilizer Planning", "Nutrient Balance"],
      consultationTypes: ["chat", "voice", "video"],
      slots: ["11:00 AM", "4:00 PM"],
      reviews: [],
      featured: false,
    },
    {
      id: "5",
      name: "Vikram Joshi",
      specialty: "Market Linkage & Pricing",
      subSpecialties: ["Price Analysis", "Marketing Strategy", "Local Markets"],
      experience: 8,
      rating: 4.5,
      totalConsultations: 600,
      languages: ["Hindi", "English", "Marathi"],
      availability: "available",
      pricePerSession: 350,
      qualifications: ["MBA Agribusiness", "Market Analysis Expert"],
      description:
        "Expert in crop pricing, market trends, and connecting farmers with buyers for maximum profitability.",
      location: "Maharashtra, India",
      responseTime: "< 4 hours",
      successRate: 89,
      certifications: ["Market Analyst", "Price Consultant"],
      expertise: [
        "Price Forecasting",
        "Market Research",
        "Supply Chain Management",
        "Value Addition",
      ],
      consultationTypes: ["chat", "voice", "video"],
      slots: ["11:00 AM", "4:00 PM"],
      reviews: [],
      featured: false,
    },
  ]);

  const [consultationHistory] = useState<Consultation[]>([
    {
      id: "1",
      expertId: "1",
      expertName: "Dr. Ramesh Kumar",
      specialty: "Crop Disease Management",
      date: "2024-01-15",
      time: "2:00 PM",
      type: "video",
      status: "completed",
      rating: 5,
      notes: "Very helpful advice on wheat rust treatment",
      price: 0,
    },
    {
      id: "2",
      expertId: "2",
      expertName: "Priya Sharma",
      specialty: "Organic Farming",
      date: "2024-01-10",
      time: "10:00 AM",
      type: "chat",
      status: "completed",
      rating: 4,
      notes: "Good tips on organic pest control",
      price: 200,
    },
  ]);

  const specialties = [
    "All Specialties",
    "Crop Disease Management",
    "Organic Farming",
    "Irrigation & Water Management",
    "Soil Health & Fertility",
    "Market Linkage & Pricing",
  ];

  const filteredExperts = experts.filter((expert) => {
    const matchesSpecialty =
      selectedSpecialty === "all" ||
      selectedSpecialty === "All Specialties" ||
      expert.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    const matchesSearch =
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.subSpecialties.some((sub) =>
        sub.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    return matchesSpecialty && matchesSearch;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "available":
        return "Available";
      case "busy":
        return "Busy";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  const toggleFavorite = (expertId: string) => {
    setFavoriteExperts((prev) =>
      prev.includes(expertId)
        ? prev.filter((id) => id !== expertId)
        : [...prev, expertId],
    );
  };

  const handleBookConsultation = (expert: Expert) => {
    setSelectedExpert(expert);
    setShowConsultationForm(true);
  };

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case "chat":
        return <MessageCircle className="w-4 h-4" />;
      case "voice":
        return <Phone className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "field":
        return <MapPin className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Expert Consultation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Get personalized advice from agricultural experts
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("experts")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "experts"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Find Experts
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "history"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            History
          </button>
        </div>

        {activeTab === "experts" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Search and Filters */}
            <div className="space-y-3 sm:space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search experts or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Mobile Filter Toggle */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {specialties.map((specialty) => (
                    <option
                      key={specialty}
                      value={
                        specialty === "All Specialties" ? "all" : specialty
                      }
                    >
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured Experts Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2 flex items-center">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" />
                    Featured Experts
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                    Top-rated experts with proven results
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-2xl font-bold text-green-600">
                    FREE
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    First Session
                  </div>
                </div>
              </div>
            </div>

            {/* Expert Cards */}
            <div className="space-y-4">
              {filteredExperts.map((expert) => (
                <div
                  key={expert.id}
                  className={`bg-white dark:bg-gray-800 border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200 ${
                    expert.featured
                      ? "border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="text-gray-600 dark:text-gray-400 w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white dark:border-gray-800 ${getAvailabilityColor(expert.availability)}`}
                      ></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                              {expert.name}
                            </h3>
                            {expert.featured && (
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full shrink-0">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                            {expert.specialty}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            {expert.location}
                          </p>
                        </div>

                        <button
                          onClick={() => toggleFavorite(expert.id)}
                          className={`p-2 rounded-full transition-colors shrink-0 ${
                            favoriteExperts.includes(expert.id)
                              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favoriteExperts.includes(expert.id)
                                ? "fill-current"
                                : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
                    <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">
                          {expert.rating}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {expert.totalConsultations} reviews
                      </div>
                    </div>

                    <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {expert.experience}Y
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Experience
                      </div>
                    </div>

                    <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-sm font-bold text-green-600 mb-1">
                        {expert.successRate}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Success
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {expert.subSpecialties.slice(0, 2).map((sub, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                        >
                          {sub}
                        </span>
                      ))}
                      {expert.subSpecialties.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          +{expert.subSpecialties.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="flex items-center justify-between mb-4 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Languages className="w-3 h-3 mr-1" />
                      <span>{expert.languages.slice(0, 2).join(", ")}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{expert.responseTime}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base sm:text-lg font-bold text-green-700 dark:text-green-300">
                          First Session: FREE
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                          Next: ₹{expert.pricePerSession}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          expert.availability === "available"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : expert.availability === "busy"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {getAvailabilityText(expert.availability)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleBookConsultation(expert)}
                      disabled={expert.availability === "offline"}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm font-medium"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </button>
                    <button
                      onClick={() => {
                        setSelectedExpert(expert);
                        setShowExpertDetails(true);
                      }}
                      className="flex-1 px-4 py-2 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Consultation Types */}
                  <div className="flex justify-center mt-3 space-x-4">
                    {expert.consultationTypes.slice(0, 3).map((type) => (
                      <div
                        key={type}
                        className="flex items-center text-xs text-gray-500 dark:text-gray-400"
                      >
                        {getConsultationIcon(type)}
                        <span className="ml-1 capitalize">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredExperts.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No experts found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Consultation History
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {consultationHistory.length} consultations
              </span>
            </div>

            <div className="space-y-4">
              {consultationHistory.map((consultation) => (
                <div
                  key={consultation.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="text-gray-600 dark:text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                        {consultation.expertName}
                      </h4>
                      <p className="text-blue-600 dark:text-blue-400 text-sm">
                        {consultation.specialty}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {consultation.date}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {consultation.time}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {getConsultationIcon(consultation.type)}
                      <span className="capitalize text-gray-600 dark:text-gray-400">
                        {consultation.type}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          consultation.status === "completed"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : consultation.status === "upcoming"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {consultation.status}
                      </span>
                    </div>
                    {consultation.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-gray-900 dark:text-gray-100">
                          {consultation.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  {consultation.notes && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {consultation.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {consultationHistory.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No consultations yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Book your first consultation to see history here
                </p>
              </div>
            )}
          </div>
        )}

        {/* Expert Details Modal */}
        {showExpertDetails && selectedExpert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Expert Details
                </h3>
                <button
                  onClick={() => setShowExpertDetails(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Expert Info */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="text-gray-600 dark:text-gray-400 w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedExpert.name}
                  </h4>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">
                    {selectedExpert.specialty}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {selectedExpert.location}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    About
                  </h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {selectedExpert.description}
                  </p>
                </div>

                {/* Qualifications */}
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Qualifications
                  </h5>
                  <div className="space-y-1">
                    {selectedExpert.qualifications.map((qual, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                      >
                        <Award className="w-4 h-4 mr-2 text-blue-500" />
                        {qual}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expertise */}
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Expertise Areas
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedExpert.expertise.map((exp, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Languages
                  </h5>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Languages className="w-4 h-4 mr-2" />
                    {selectedExpert.languages.join(", ")}
                  </div>
                </div>

                {/* Book Consultation */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setShowExpertDetails(false);
                      handleBookConsultation(selectedExpert);
                    }}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center justify-center font-medium"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Consultation Booking Modal */}
        {showConsultationForm && selectedExpert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Book Consultation
                </h3>
                <button
                  onClick={() => setShowConsultationForm(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Expert Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="text-gray-600 dark:text-gray-400 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {selectedExpert.name}
                    </h4>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      {selectedExpert.specialty}
                    </p>
                  </div>
                </div>

                {/* Consultation Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Consultation Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedExpert.consultationTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedConsultationType(type)}
                        className={`p-3 border rounded-lg transition-colors flex items-center justify-center ${
                          selectedConsultationType === type
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {getConsultationIcon(type)}
                        <span className="ml-2 capitalize text-sm">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedExpert.slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 border rounded-lg transition-colors text-sm ${
                          selectedSlot === slot
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing Info */}
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-700 dark:text-green-300">
                      First Session: FREE
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      Usually ₹{selectedExpert.pricePerSession}
                    </div>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={() => {
                    // Handle booking logic here
                    setShowConsultationForm(false);
                    // Show success message or redirect
                  }}
                  disabled={!selectedSlot}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-medium"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertConsultation;
