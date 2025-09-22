// Authentication Types
export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: "farmer" | "advisor" | "admin";
  profile: {
    farmSize?: number;
    location?: {
      state: string;
      district: string;
      village?: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    soilType?: "clay" | "sandy" | "loamy" | "silt" | "peat" | "chalk";
    farmingExperience?: number;
    primaryCrops?: string[];
    preferredLanguage: "en" | "hi";
    avatar?: string;
  };
  subscription?: {
    plan: "free" | "basic" | "premium";
    expiresAt?: string;
    features: string[];
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      weatherAlerts: boolean;
      pestAlerts: boolean;
      marketUpdates: boolean;
    };
    units: {
      area: "acres" | "hectares";
      temperature: "celsius" | "fahrenheit";
      currency: "INR" | "USD";
    };
  };
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profileCompletion?: number;
  subscriptionStatus?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: "farmer" | "advisor" | "admin";
  profile?: {
    farmSize?: number;
    location?: {
      state: string;
      district: string;
      village?: string;
    };
    soilType?: "clay" | "sandy" | "loamy" | "silt" | "peat" | "chalk";
    farmingExperience?: number;
    primaryCrops?: string[];
    preferredLanguage?: "en" | "hi";
  };
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Array<{
    msg?: string;
    message?: string;
    param?: string;
    value?: unknown;
  }>;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Farm Types
export interface FarmInput {
  budget: string;
  season: string;
  soilType: string;
  weather: string;
  location: string;
  farmSize: string;
}

export interface CropRecommendation {
  name: string;
  suitability: "High" | "Medium" | "Low";
  suitabilityScore?: number;
  expectedYield: string;
  roi: string;
  requirements: string[];
  tips: string[];
}

export interface PlotData {
  id: string;
  crop: string;
  health: "excellent" | "good" | "warning" | "poor";
  soilMoisture: "high" | "medium" | "low";
  pestAlert: boolean;
}

export interface PestReport {
  id: string;
  location: string;
  pestType: string;
  severity: "Low" | "Medium" | "High";
  crop: string;
  reportedBy: string;
  timestamp: string;
  imageUrl?: string;
}

export interface MarketPrice {
  crop: string;
  market: string;
  price: number;
  change: number;
  distance: string;
  lastUpdated: string;
}

export interface Buyer {
  id: string;
  name: string;
  type: "FPO" | "Trader" | "Processor";
  location: string;
  crops: string[];
  rating: number;
  contact: string;
}

export interface SeasonData {
  season: string;
  year: string;
  cropsGrown: string[];
  totalYield: string;
  revenue: string;
  soilHealth: "Excellent" | "Good" | "Average" | "Poor";
  pestIncidents: number;
}
