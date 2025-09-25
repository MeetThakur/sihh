import React, { useState } from "react";
import {
  Star,
  MessageCircle,
  Phone,
  Video,
  Calendar,
  User,
  Award,
  Send,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  Filter,
  Search,
  Heart,
  Zap,
  ChevronRight,
  ChevronDown,
  X,
  GraduationCap,
  Languages,
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
  verified: boolean;
}

interface ConsultationRequest {
  expertId: string;
  type: "chat" | "voice" | "video" | "field";
  description: string;
  preferredTime?: string;
  urgency: "low" | "medium" | "high";
  budget?: number;
  attachments?: File[];
}

interface ConsultationHistory {
  id: string;
  expertName: string;
  date: string;
  type: string;
  status: "completed" | "scheduled" | "cancelled";
  rating?: number;
  notes?: string;
}

const ExpertConsultation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "browse" | "history" | "favorites" | "messages"
  >("browse");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showExpertDetails, setShowExpertDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteExperts, setFavoriteExperts] = useState<string[]>([]);

  const [consultationRequest, setConsultationRequest] =
    useState<ConsultationRequest>({
      expertId: "",
      type: "chat",
      description: "",
      urgency: "medium",
      attachments: [],
    });

  // Enhanced mock expert data
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
      pricePerSession: 500,
      qualifications: ["PhD in Plant Pathology", "Certified Crop Advisor"],
      description:
        "Expert in identifying and treating crop diseases with 15+ years of field experience. Specializes in integrated disease management and sustainable farming practices.",
      location: "Punjab, India",
      responseTime: "< 2 hours",
      successRate: 95,
      specialOffers: ["First consultation FREE", "Package deals available"],
      certifications: ["ICAR Certified", "Plant Protection Specialist"],
      expertise: [
        "Fungal Disease Control",
        "Bacterial Infections",
        "Viral Disease Management",
        "IPM Strategies",
      ],
      consultationTypes: ["chat", "voice", "video", "field"],
      slots: ["9:00 AM", "2:00 PM", "6:00 PM"],
      reviews: [
        {
          id: "1",
          userId: "u1",
          userName: "Farmer Singh",
          rating: 5,
          comment: "Excellent advice on wheat rust management. Saved my crop!",
          date: "2024-01-15",
          verified: true,
        },
      ],
      featured: true,
    },
    {
      id: "2",
      name: "Priya Sharma",
      specialty: "Organic Farming",
      subSpecialties: ["Soil Health", "Composting", "Natural Pest Control"],
      experience: 12,
      rating: 4.9,
      totalConsultations: 890,
      languages: ["Hindi", "English"],
      availability: "available",
      pricePerSession: 450,
      qualifications: ["MSc Agriculture", "Organic Certification Expert"],
      description:
        "Specialist in sustainable and organic farming practices, soil health management, and natural pest control methods.",
      location: "Maharashtra, India",
      responseTime: "< 1 hour",
      successRate: 98,
      specialOffers: ["Organic certification guidance included"],
      certifications: ["Organic India Certified", "Permaculture Design"],
      expertise: [
        "Organic Certification",
        "Composting Techniques",
        "Biofertilizers",
        "Natural Pesticides",
      ],
      consultationTypes: ["chat", "voice", "video"],
      slots: ["8:00 AM", "1:00 PM", "5:00 PM"],
      reviews: [
        {
          id: "2",
          userId: "u2",
          userName: "Organic Farmer",
          rating: 5,
          comment: "Helped me transition to organic farming successfully!",
          date: "2024-01-10",
          verified: true,
        },
      ],
      featured: true,
    },
    {
      id: "3",
      name: "Suresh Patel",
      specialty: "Irrigation & Water Management",
      subSpecialties: ["Drip Irrigation", "Water Conservation", "Hydroponics"],
      experience: 18,
      rating: 4.7,
      totalConsultations: 1500,
      languages: ["Hindi", "Gujarati", "English"],
      availability: "busy",
      pricePerSession: 600,
      qualifications: [
        "Water Management Engineer",
        "20+ Years Field Experience",
      ],
      description:
        "Expert in modern irrigation techniques, water conservation, and efficient farming with focus on sustainable water usage.",
      location: "Gujarat, India",
      responseTime: "< 3 hours",
      successRate: 92,
      certifications: ["Water Management Expert", "Irrigation Specialist"],
      expertise: [
        "Drip Irrigation Design",
        "Sprinkler Systems",
        "Water Quality Testing",
        "Smart Irrigation",
      ],
      consultationTypes: ["chat", "video", "field"],
      slots: ["10:00 AM", "3:00 PM"],
      reviews: [],
    },
    {
      id: "4",
      name: "Dr. Anjali Singh",
      specialty: "Soil Science & Fertilizers",
      subSpecialties: ["Soil Testing", "Nutrient Management", "pH Correction"],
      experience: 10,
      rating: 4.6,
      totalConsultations: 750,
      languages: ["Hindi", "English"],
      availability: "available",
      pricePerSession: 400,
      qualifications: ["PhD Soil Science", "Fertilizer Specialist"],
      description:
        "Soil testing expert and fertilizer recommendation specialist for better yields and sustainable farming.",
      location: "Uttar Pradesh, India",
      responseTime: "< 2 hours",
      successRate: 94,
      certifications: ["Soil Science Society Member", "Nutrient Expert"],
      expertise: [
        "Soil Analysis",
        "Micronutrient Management",
        "Fertilizer Planning",
        "Soil Health Cards",
      ],
      consultationTypes: ["chat", "voice", "video"],
      slots: ["9:00 AM", "2:00 PM", "7:00 PM"],
      reviews: [],
    },
    {
      id: "5",
      name: "Vikram Joshi",
      specialty: "Market Linkage & Pricing",
      subSpecialties: [
        "Price Analysis",
        "Marketing Strategy",
        "Export Markets",
      ],
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
      certifications: ["Market Analyst", "Export Consultant"],
      expertise: [
        "Price Forecasting",
        "Market Research",
        "Export Documentation",
        "Value Addition",
      ],
      consultationTypes: ["chat", "voice", "video"],
      slots: ["11:00 AM", "4:00 PM"],
      reviews: [],
    },
  ]);

  const [consultationHistory] = useState<ConsultationHistory[]>([
    {
      id: "1",
      expertName: "Dr. Ramesh Kumar",
      date: "2024-01-20",
      type: "Video Call",
      status: "completed",
      rating: 5,
      notes: "Excellent guidance on wheat disease management",
    },
    {
      id: "2",
      expertName: "Priya Sharma",
      date: "2024-01-25",
      type: "Chat",
      status: "scheduled",
    },
  ]);

  // Filter experts based on search and filters
  const filteredExperts = experts.filter((expert) => {
    const matchesSearch =
      searchTerm === "" ||
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.subSpecialties.some((sub) =>
        sub.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesSpecialty =
      selectedSpecialty === "all" ||
      expert.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());

    const matchesLanguage =
      selectedLanguage === "all" ||
      expert.languages.some((lang) =>
        lang.toLowerCase().includes(selectedLanguage.toLowerCase()),
      );

    const matchesPrice =
      expert.pricePerSession >= priceRange.min &&
      expert.pricePerSession <= priceRange.max;

    const matchesAvailability =
      availabilityFilter === "all" ||
      expert.availability === availabilityFilter;

    return (
      matchesSearch &&
      matchesSpecialty &&
      matchesLanguage &&
      matchesPrice &&
      matchesAvailability
    );
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
        return "Available Now";
      case "busy":
        return "Busy";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  const handleBookConsultation = (expert: Expert) => {
    setSelectedExpert(expert);
    setConsultationRequest((prev) => ({ ...prev, expertId: expert.id }));
    setShowBooking(true);
  };

  const handleSubmitRequest = () => {
    console.log("Consultation request:", consultationRequest);
    alert(
      `Consultation request sent to ${selectedExpert?.name}! You will receive a confirmation shortly.`,
    );
    setShowBooking(false);
    setSelectedExpert(null);
    setConsultationRequest({
      expertId: "",
      type: "chat",
      description: "",
      urgency: "medium",
      attachments: [],
    });
  };

  const toggleFavorite = (expertId: string) => {
    setFavoriteExperts((prev) =>
      prev.includes(expertId)
        ? prev.filter((id) => id !== expertId)
        : [...prev, expertId],
    );
  };

  const uniqueSpecialties = [
    ...new Set(experts.map((expert) => expert.specialty)),
  ];
  const uniqueLanguages = [
    ...new Set(experts.flatMap((expert) => expert.languages)),
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
                <span>Expert Consultation</span>
                <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  First Session FREE
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Connect with certified agricultural experts for personalized
                farming guidance
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {experts.length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Expert Advisors
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">4.7★</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Avg Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Available
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
                  id: "browse",
                  label: "Browse Experts",
                  icon: Search,
                  count: filteredExperts.length,
                },
                {
                  id: "history",
                  label: "My Consultations",
                  icon: Clock,
                  count: consultationHistory.length,
                },
                {
                  id: "favorites",
                  label: "Favorites",
                  icon: Heart,
                  count: favoriteExperts.length,
                },
                {
                  id: "messages",
                  label: "Messages",
                  icon: MessageCircle,
                  count: 3,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as "browse" | "history" | "favorites" | "messages",
                    )
                  }
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
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
            {activeTab === "browse" && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search experts by name, specialty, or expertise..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center text-sm whitespace-nowrap"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                      {showFilters ? (
                        <ChevronDown className="w-4 h-4 ml-2" />
                      ) : (
                        <ChevronRight className="w-4 h-4 ml-2" />
                      )}
                    </button>
                  </div>

                  {showFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Specialty
                        </label>
                        <select
                          value={selectedSpecialty}
                          onChange={(e) => setSelectedSpecialty(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="all">All Specialties</option>
                          {uniqueSpecialties.map((specialty) => (
                            <option key={specialty} value={specialty}>
                              {specialty}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Language
                        </label>
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="all">All Languages</option>
                          {uniqueLanguages.map((language) => (
                            <option key={language} value={language}>
                              {language}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Availability
                        </label>
                        <select
                          value={availabilityFilter}
                          onChange={(e) =>
                            setAvailabilityFilter(e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="all">All Statuses</option>
                          <option value="available">Available Now</option>
                          <option value="busy">Busy</option>
                          <option value="offline">Offline</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Price Range (₹)
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) =>
                              setPriceRange((prev) => ({
                                ...prev,
                                min: Number(e.target.value),
                              }))
                            }
                            className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) =>
                              setPriceRange((prev) => ({
                                ...prev,
                                max: Number(e.target.value),
                              }))
                            }
                            className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Featured Experts Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                        Featured Experts
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Top-rated experts with proven track records and instant
                        availability
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        FREE
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        First Session
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expert Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredExperts.map((expert) => (
                    <div
                      key={expert.id}
                      className={`bg-white dark:bg-gray-800 border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200 ${
                        expert.featured
                          ? "border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                      }`}
                    >
                      {/* Expert Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center flex-1">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <User className="text-gray-600 dark:text-gray-400 w-8 h-8" />
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${getAvailabilityColor(expert.availability)}`}
                            ></div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {expert.name}
                              </h3>
                              {expert.featured && (
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
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
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => toggleFavorite(expert.id)}
                            className={`p-2 rounded-full transition-colors ${
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

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">
                              {expert.rating}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {expert.totalConsultations} reviews
                          </div>
                        </div>

                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                            {expert.experience}Y
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Experience
                          </div>
                        </div>

                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-sm font-bold text-green-600 mb-1">
                            {expert.successRate}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Success
                          </div>
                        </div>
                      </div>

                      {/* Sub-specialties */}
                      <div className="mb-4">
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Expertise:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {expert.subSpecialties
                            .slice(0, 3)
                            .map((sub, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                              >
                                {sub}
                              </span>
                            ))}
                          {expert.subSpecialties.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                              +{expert.subSpecialties.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Languages and Response Time */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center">
                          <Languages className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {expert.languages.join(", ")}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {expert.responseTime}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {expert.description}
                      </p>

                      {/* Pricing */}
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-green-700 dark:text-green-300">
                              First Session: FREE
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400">
                              Next sessions: ₹{expert.pricePerSession}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Response Time
                            </div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {expert.responseTime}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBookConsultation(expert)}
                          disabled={expert.availability === "offline"}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm font-medium"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Consultation
                        </button>
                        <button
                          onClick={() => {
                            setSelectedExpert(expert);
                            setShowExpertDetails(true);
                          }}
                          className="px-4 py-2 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>

                      {/* Consultation Types */}
                      <div className="flex justify-center mt-3 space-x-4">
                        {expert.consultationTypes.map((type) => (
                          <div
                            key={type}
                            className="flex items-center text-xs text-gray-500 dark:text-gray-400"
                          >
                            {type === "chat" && (
                              <MessageCircle className="w-3 h-3 mr-1" />
                            )}
                            {type === "voice" && (
                              <Phone className="w-3 h-3 mr-1" />
                            )}
                            {type === "video" && (
                              <Video className="w-3 h-3 mr-1" />
                            )}
                            {type === "field" && (
                              <MapPin className="w-3 h-3 mr-1" />
                            )}
                            {type.charAt(0).toUpperCase() + type.slice(1)}
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
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-6">
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
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {consultation.expertName}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                consultation.status === "completed"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                  : consultation.status === "scheduled"
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                              }`}
                            >
                              {consultation.status.charAt(0).toUpperCase() +
                                consultation.status.slice(1)}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {consultation.date}
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              {consultation.type}
                            </div>
                          </div>

                          {consultation.notes && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                              {consultation.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {consultation.rating && (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium ml-1">
                                {consultation.rating}
                              </span>
                            </div>
                          )}
                          <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {consultationHistory.length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No consultation history
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Start your first consultation with an expert
                    </p>
                    <button
                      onClick={() => setActiveTab("browse")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                    >
                      Browse Experts
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "favorites" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Favorite Experts
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {favoriteExperts.length} favorites
                  </span>
                </div>

                {favoriteExperts.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {experts
                      .filter((expert) => favoriteExperts.includes(expert.id))
                      .map((expert) => (
                        <div
                          key={expert.id}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <User className="text-gray-600 dark:text-gray-400 w-6 h-6" />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                  {expert.name}
                                </h4>
                                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                                  {expert.specialty}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleFavorite(expert.id)}
                              className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                              <span>{expert.rating}</span>
                              <span className="ml-2">
                                ({expert.totalConsultations} consultations)
                              </span>
                            </div>
                            <button
                              onClick={() => handleBookConsultation(expert)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-sm"
                            >
                              Book Session
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No favorite experts yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Add experts to your favorites for quick access
                    </p>
                    <button
                      onClick={() => setActiveTab("browse")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                    >
                      Browse Experts
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Messages Coming Soon
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Real-time messaging with experts will be available soon
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              1st FREE
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Consultation
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">95%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Success Rate
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              &lt; 2hrs
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Response Time
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">5000+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Happy Farmers
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Book Consultation
                </h3>
                <button
                  onClick={() => setShowBooking(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </button>
              </div>

              {/* Expert Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="text-gray-600 dark:text-gray-400 w-6 h-6" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {selectedExpert.name}
                    </h4>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      {selectedExpert.specialty}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span>{selectedExpert.rating}</span>
                      <span className="mx-2">•</span>
                      <span>{selectedExpert.responseTime} response</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">FREE</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      First session
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      Next: ₹{selectedExpert.pricePerSession}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Consultation Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Consultation Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedExpert.consultationTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setConsultationRequest((prev) => ({ ...prev, type }))
                        }
                        className={`p-4 border-2 rounded-lg transition-all text-center ${
                          consultationRequest.type === type
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          {type === "chat" && (
                            <MessageCircle className="w-5 h-5" />
                          )}
                          {type === "voice" && <Phone className="w-5 h-5" />}
                          {type === "video" && <Video className="w-5 h-5" />}
                          {type === "field" && <MapPin className="w-5 h-5" />}
                          <span className="text-sm font-medium capitalize">
                            {type}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Priority Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "low", label: "Low", desc: "Within a week" },
                      { value: "medium", label: "Medium", desc: "2-3 days" },
                      { value: "high", label: "High", desc: "Today/Tomorrow" },
                    ].map((priority) => (
                      <button
                        key={priority.value}
                        onClick={() =>
                          setConsultationRequest((prev) => ({
                            ...prev,
                            urgency: priority.value as
                              | "low"
                              | "medium"
                              | "high",
                          }))
                        }
                        className={`p-3 border-2 rounded-lg transition-all text-center ${
                          consultationRequest.urgency === priority.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="font-medium text-sm">
                          {priority.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {priority.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Describe Your Issue
                  </label>
                  <textarea
                    value={consultationRequest.description}
                    onChange={(e) =>
                      setConsultationRequest((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Please describe your farming issue, crop problem, or what you need help with in detail. Include relevant information like crop type, symptoms, duration, etc."
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {consultationRequest.description.length}/500 characters
                  </div>
                </div>

                {/* Preferred Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Preferred Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={consultationRequest.preferredTime}
                    onChange={(e) =>
                      setConsultationRequest((prev) => ({
                        ...prev,
                        preferredTime: e.target.value,
                      }))
                    }
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Available Slots */}
                {selectedExpert.slots.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Available Today
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedExpert.slots.map((slot) => (
                        <button
                          key={slot}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm transition-colors text-gray-700 dark:text-gray-300"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowBooking(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRequest}
                  disabled={!consultationRequest.description.trim()}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expert Details Modal */}
      {showExpertDetails && selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Expert Profile
                </h3>
                <button
                  onClick={() => setShowExpertDetails(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Expert Info */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
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

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Rating:
                        </span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {selectedExpert.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Experience:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedExpert.experience} years
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Consultations:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedExpert.totalConsultations}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Success Rate:
                        </span>
                        <span className="font-medium text-green-600">
                          {selectedExpert.successRate}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Response Time:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedExpert.responseTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowExpertDetails(false);
                      handleBookConsultation(selectedExpert);
                    }}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-medium"
                  >
                    Book Consultation
                  </button>
                </div>

                {/* Detailed Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      About
                    </h5>
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedExpert.description}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Specializations
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedExpert.subSpecialties.map((spec, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Qualifications
                    </h5>
                    <ul className="space-y-2">
                      {selectedExpert.qualifications.map((qual, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                        >
                          <GraduationCap className="w-4 h-4 text-blue-600 mr-2" />
                          {qual}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Certifications
                    </h5>
                    <ul className="space-y-2">
                      {selectedExpert.certifications.map((cert, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                        >
                          <Award className="w-4 h-4 text-green-600 mr-2" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Languages
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedExpert.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedExpert.reviews.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Recent Reviews
                      </h5>
                      <div className="space-y-4">
                        {selectedExpert.reviews.map((review) => (
                          <div
                            key={review.id}
                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {review.userName}
                                </span>
                                {review.verified && (
                                  <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                                )}
                              </div>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                  {review.rating}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {review.comment}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                              {review.date}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertConsultation;
