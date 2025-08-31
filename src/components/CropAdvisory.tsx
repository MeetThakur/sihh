import React, { useState } from 'react';
import { Leaf, MapPin, Calendar, DollarSign, Thermometer, Droplets } from 'lucide-react';
import { generateCropRecommendations } from '../utils/aiService';

interface FarmInput {
  budget: string;
  season: string;
  soilType: string;
  weather: string;
  location: string;
  farmSize: string;
}

interface CropRecommendation {
  name: string;
  suitability: 'High' | 'Medium' | 'Low';
  expectedYield: string;
  roi: string;
  requirements: string[];
  tips: string[];
}

const CropAdvisory: React.FC = () => {
  const [farmInput, setFarmInput] = useState<FarmInput>({
    budget: '',
    season: '',
    soilType: '',
    weather: '',
    location: '',
    farmSize: ''
  });
  
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  // Use AI service for dynamic recommendations
  const generateRecommendations = async () => {
    setLoading(true);
    
    try {
      // Call the AI service with farm input data
      const aiRecommendations = await generateCropRecommendations(farmInput);
      setRecommendations(aiRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback to a basic recommendation if AI service fails
      setRecommendations([
        {
          name: 'Basic Crop Option',
          suitability: 'Medium',
          expectedYield: '20-30 quintals/hectare',
          roi: '₹15,000 - ₹25,000',
          requirements: ['Based on your inputs, please try again or consult local experts'],
          tips: ['Check your internet connection and input values']
        }
      ]);
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: keyof FarmInput, value: string) => {
    setFarmInput(prev => ({ ...prev, [field]: value }));
  };

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'High': return 'text-emerald-600 bg-emerald-100';
      case 'Medium': return 'text-amber-600 bg-amber-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Leaf className="mr-2 text-emerald-600" size={24} />
          Farm Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign size={16} className="inline mr-1" />
              Available Budget (₹)
            </label>
            <input
              type="number"
              value={farmInput.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Season
            </label>
            <select
              value={farmInput.season}
              onChange={(e) => handleInputChange('season', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select Season</option>
              <option value="kharif">Kharif (Monsoon)</option>
              <option value="rabi">Rabi (Winter)</option>
              <option value="zaid">Zaid (Summer)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-1" />
              Soil Type
            </label>
            <select
              value={farmInput.soilType}
              onChange={(e) => handleInputChange('soilType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select Soil Type</option>
              <option value="clay">Clay</option>
              <option value="loamy">Loamy</option>
              <option value="sandy">Sandy</option>
              <option value="black">Black Cotton</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Thermometer size={16} className="inline mr-1" />
              Weather Condition
            </label>
            <select
              value={farmInput.weather}
              onChange={(e) => handleInputChange('weather', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select Weather</option>
              <option value="hot_humid">Hot & Humid</option>
              <option value="moderate">Moderate</option>
              <option value="cool_dry">Cool & Dry</option>
              <option value="rainy">Rainy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-1" />
              Location (District)
            </label>
            <input
              type="text"
              value={farmInput.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your district"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Droplets size={16} className="inline mr-1" />
              Farm Size (acres)
            </label>
            <input
              type="number"
              value={farmInput.farmSize}
              onChange={(e) => handleInputChange('farmSize', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="2.5"
              step="0.1"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={generateRecommendations}
            disabled={loading || !farmInput.budget || !farmInput.season || !farmInput.soilType}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating Recommendations...' : 'Get AI Crop Advisory'}
          </button>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Crop Recommendations</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendations.map((crop, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSuitabilityColor(crop.suitability)}`}>
                    {crop.suitability}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Yield:</span>
                    <span className="font-medium">{crop.expectedYield}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Potential ROI:</span>
                    <span className="font-medium text-emerald-600">{crop.roi}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {crop.requirements.map((req, i) => (
                      <li key={i} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Expert Tips:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {crop.tips.map((tip, i) => (
                      <li key={i} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CropAdvisory;