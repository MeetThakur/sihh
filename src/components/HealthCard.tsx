import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, AlertTriangle, Award } from 'lucide-react';

interface SeasonData {
  season: string;
  year: string;
  cropsGrown: string[];
  totalYield: string;
  revenue: string;
  soilHealth: 'Excellent' | 'Good' | 'Average' | 'Poor';
  pestIncidents: number;
}

const HealthCard: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState<string>('kharif-2024');

  // Mock seasonal data
  const seasonalData: { [key: string]: SeasonData } = {
    'kharif-2024': {
      season: 'Kharif',
      year: '2024',
      cropsGrown: ['Rice (Basmati)', 'Sugarcane'],
      totalYield: '65 quintals',
      revenue: '₹1,58,500',
      soilHealth: 'Good',
      pestIncidents: 2
    },
    'rabi-2023': {
      season: 'Rabi',
      year: '2023-24',
      cropsGrown: ['Wheat', 'Mustard'],
      totalYield: '42 quintals',
      revenue: '₹1,12,400',
      soilHealth: 'Excellent',
      pestIncidents: 1
    },
    'kharif-2023': {
      season: 'Kharif',
      year: '2023',
      cropsGrown: ['Rice (Basmati)', 'Cotton'],
      totalYield: '58 quintals',
      revenue: '₹1,45,200',
      soilHealth: 'Good',
      pestIncidents: 3
    }
  };

  const currentData = seasonalData[selectedSeason];

  const generateHealthCard = () => {
    // Mock AI-generated health card - in real app this would call OpenAI API
    alert('Farm Health Card generated and ready for download! This would contain AI-generated insights about soil health, crop performance, and recommendations for government schemes and loans.');
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Excellent': return 'text-emerald-600 bg-emerald-100';
      case 'Good': return 'text-green-600 bg-green-100';
      case 'Average': return 'text-amber-600 bg-amber-100';
      case 'Poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileText className="mr-2 text-emerald-600" size={24} />
            Digital Farm Health Card
          </h2>
          
          <div className="flex space-x-3">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="kharif-2024">Kharif 2024</option>
              <option value="rabi-2023">Rabi 2023-24</option>
              <option value="kharif-2023">Kharif 2023</option>
            </select>
            
            <button
              onClick={generateHealthCard}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Download size={16} />
              <span>Generate Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* Season Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Calendar className="mr-2 text-emerald-600" size={20} />
          {currentData.season} {currentData.year} Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="text-center">
              <TrendingUp className="mx-auto text-emerald-600 mb-2" size={24} />
              <div className="text-2xl font-bold text-emerald-600">{currentData.totalYield}</div>
              <div className="text-sm text-gray-600">Total Yield</div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentData.revenue}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(currentData.soilHealth)}`}>
                {currentData.soilHealth}
              </span>
              <div className="text-sm text-gray-600 mt-1">Soil Health</div>
            </div>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-center">
              <AlertTriangle className="mx-auto text-orange-600 mb-2" size={24} />
              <div className="text-2xl font-bold text-orange-600">{currentData.pestIncidents}</div>
              <div className="text-sm text-gray-600">Pest Incidents</div>
            </div>
          </div>
        </div>
      </div>

      {/* Crops Grown */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Crops Grown This Season</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentData.cropsGrown.map((crop, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-2xl">🌾</div>
              <div>
                <div className="font-medium text-gray-900">{crop}</div>
                <div className="text-sm text-gray-600">Successfully cultivated</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Government Scheme Eligibility */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Award className="mr-2 text-emerald-600" size={20} />
          Government Scheme Eligibility
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div>
              <h4 className="font-medium text-gray-900">PM-KISAN Scheme</h4>
              <p className="text-sm text-gray-600">Direct income support for small farmers</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                Eligible
              </span>
              <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                Apply
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <h4 className="font-medium text-gray-900">Crop Insurance</h4>
              <p className="text-sm text-gray-600">PMFBY - Premium crop insurance</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Eligible
              </span>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Apply
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div>
              <h4 className="font-medium text-gray-900">KCC Loan</h4>
              <p className="text-sm text-gray-600">Kisan Credit Card for farm expenses</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                Under Review
              </span>
              <button className="px-3 py-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm">
                Check Status
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Insights</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-medium text-blue-900 mb-2">Performance Analysis</h4>
            <p className="text-blue-800 text-sm">
              Your farm showed 15% yield improvement this season compared to last year. Rice cultivation 
              performed exceptionally well due to optimal soil conditions and proper irrigation management.
            </p>
          </div>
          
          <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
            <h4 className="font-medium text-emerald-900 mb-2">Recommendations</h4>
            <p className="text-emerald-800 text-sm">
              Consider diversifying with pulse crops in the upcoming rabi season. Your soil health 
              indicators suggest excellent suitability for legumes, which will also improve nitrogen fixation.
            </p>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
            <h4 className="font-medium text-amber-900 mb-2">Areas for Improvement</h4>
            <p className="text-amber-800 text-sm">
              Implement integrated pest management to reduce pest incidents. Consider organic farming 
              practices to improve long-term soil health and access premium markets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCard;