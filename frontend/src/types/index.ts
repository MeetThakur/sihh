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
  suitability: 'High' | 'Medium' | 'Low';
  suitabilityScore?: number;
  expectedYield: string;
  roi: string;
  requirements: string[];
  tips: string[];
}

export interface PlotData {
  id: string;
  crop: string;
  health: 'excellent' | 'good' | 'warning' | 'poor';
  soilMoisture: 'high' | 'medium' | 'low';
  pestAlert: boolean;
}

export interface PestReport {
  id: string;
  location: string;
  pestType: string;
  severity: 'Low' | 'Medium' | 'High';
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
  type: 'FPO' | 'Trader' | 'Processor';
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
  soilHealth: 'Excellent' | 'Good' | 'Average' | 'Poor';
  pestIncidents: number;
}