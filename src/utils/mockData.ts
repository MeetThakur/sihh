import { MarketPrice, PestReport, PlotData, SeasonData } from '../types';

export const mockMarketPrices: MarketPrice[] = [
  {
    crop: 'Rice (Basmati)',
    market: 'Rampur Mandi',
    price: 2450,
    change: 8.2,
    distance: '5 km',
    lastUpdated: '2 hours ago'
  },
  {
    crop: 'Rice (Basmati)',
    market: 'Delhi Azadpur',
    price: 2650,
    change: 12.5,
    distance: '45 km',
    lastUpdated: '1 hour ago'
  },
  {
    crop: 'Wheat',
    market: 'Rampur Mandi',
    price: 2150,
    change: -2.3,
    distance: '5 km',
    lastUpdated: '3 hours ago'
  },
  {
    crop: 'Sugarcane',
    market: 'Sugar Mill Rampur',
    price: 320,
    change: 5.1,
    distance: '8 km',
    lastUpdated: '6 hours ago'
  }
];

export const mockPestReports: PestReport[] = [
  {
    id: '1',
    location: 'Sector 12, Village Rampur',
    pestType: 'Brown Planthopper',
    severity: 'High',
    crop: 'Rice',
    reportedBy: 'Farmer Kumar',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    location: 'Sector 8, Village Rampur',
    pestType: 'Aphids',
    severity: 'Medium',
    crop: 'Wheat',
    reportedBy: 'Farmer Singh',
    timestamp: '5 hours ago'
  },
  {
    id: '3',
    location: 'Sector 15, Village Rampur',
    pestType: 'Stem Borer',
    severity: 'Low',
    crop: 'Rice',
    reportedBy: 'Farmer Patel',
    timestamp: '1 day ago'
  }
];

export const mockFarmData: PlotData[] = [
  { id: 'A1', crop: 'Rice', health: 'excellent', soilMoisture: 'high', pestAlert: false },
  { id: 'A2', crop: 'Rice', health: 'good', soilMoisture: 'high', pestAlert: false },
  { id: 'A3', crop: 'Wheat', health: 'warning', soilMoisture: 'medium', pestAlert: true },
  { id: 'A4', crop: 'Empty', health: 'good', soilMoisture: 'medium', pestAlert: false },
  { id: 'B1', crop: 'Rice', health: 'good', soilMoisture: 'high', pestAlert: false },
  { id: 'B2', crop: 'Rice', health: 'excellent', soilMoisture: 'high', pestAlert: false },
  { id: 'B3', crop: 'Wheat', health: 'poor', soilMoisture: 'low', pestAlert: true },
  { id: 'B4', crop: 'Empty', health: 'good', soilMoisture: 'medium', pestAlert: false },
  { id: 'C1', crop: 'Sugarcane', health: 'excellent', soilMoisture: 'high', pestAlert: false },
  { id: 'C2', crop: 'Sugarcane', health: 'good', soilMoisture: 'medium', pestAlert: false },
  { id: 'C3', crop: 'Empty', health: 'good', soilMoisture: 'medium', pestAlert: false },
  { id: 'C4', crop: 'Empty', health: 'good', soilMoisture: 'low', pestAlert: false },
  { id: 'D1', crop: 'Sugarcane', health: 'good', soilMoisture: 'high', pestAlert: false },
  { id: 'D2', crop: 'Sugarcane', health: 'excellent', soilMoisture: 'high', pestAlert: false },
  { id: 'D3', crop: 'Empty', health: 'good', soilMoisture: 'medium', pestAlert: false },
  { id: 'D4', crop: 'Empty', health: 'good', soilMoisture: 'medium', pestAlert: false },
];

export const weatherData = {
  temperature: 32,
  humidity: 78,
  rainfall: 125,
  forecast: 'Partly cloudy with chance of showers'
};

export const soilData = {
  ph: 6.8,
  nitrogen: 'Medium',
  phosphorus: 'Good',
  potassium: 'Good',
  organicMatter: 'High'
};