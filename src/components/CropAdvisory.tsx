import React, { useState } from 'react';
import { Leaf, Calendar, DollarSign, Thermometer, Droplets, Clock, Bell, CheckCircle, Droplet, AlertCircle, Layers } from 'lucide-react';
import { generateCropRecommendations } from '../utils/aiService';
import { useLanguage } from '../contexts/LanguageContext';

interface FarmInput {
  budget: string;
  season: string;
  soilType: string;
  weather: string;
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

interface CalendarActivity {
  id: string;
  week: number;
  activity: string;
  description: string;
  icon: string;
  type: 'sowing' | 'irrigation' | 'fertilizer' | 'pest' | 'harvest';
  budget?: string;
  completed?: boolean;
  weatherDependent?: boolean;
  alternatives?: string[];
}

interface FasalCalendar {
  cropName: string;
  season: string;
  totalWeeks: number;
  activities: CalendarActivity[];
  weatherAlerts: string[];
  budgetTotal: string;
}

const CropAdvisory: React.FC = () => {
  const { t } = useLanguage();
  const [farmInput, setFarmInput] = useState<FarmInput>({
    budget: '',
    season: '',
    soilType: '',
    weather: '',
    farmSize: ''
  });  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarData, setCalendarData] = useState<FasalCalendar | null>(null);

  const generateFasalCalendar = (cropName: string): FasalCalendar => {
    // Generate sample calendar based on crop type and farm inputs
    const baseActivities: CalendarActivity[] = [
      {
        id: '1',
        week: 1,
        activity: 'Soil Preparation & Sowing',
        description: 'Prepare soil, select quality seeds, and sow according to recommended spacing',
        icon: '🌱',
        type: 'sowing',
        budget: '₹2,000-3,000',
        completed: false,
        weatherDependent: true,
        alternatives: ['Use organic compost instead of chemical fertilizers']
      },
      {
        id: '2',
        week: 2,
        activity: 'Initial Irrigation',
        description: 'Provide adequate water for seed germination',
        icon: '💧',
        type: 'irrigation',
        budget: '₹500-800',
        completed: false,
        weatherDependent: true,
        alternatives: ['Rainwater harvesting if available']
      },
      {
        id: '3',
        week: 4,
        activity: 'First Fertilizer Application',
        description: 'Apply nitrogen-rich fertilizer for initial growth',
        icon: '🧪',
        type: 'fertilizer',
        budget: '₹1,500-2,500',
        completed: false,
        alternatives: ['Use vermicompost or organic manure']
      },
      {
        id: '4',
        week: 6,
        activity: 'Pest Monitoring',
        description: 'Check for early signs of pests and diseases',
        icon: '🐛',
        type: 'pest',
        budget: '₹800-1,200',
        completed: false,
        alternatives: ['Use neem oil or biological pest control']
      },
      {
        id: '5',
        week: 8,
        activity: 'Mid-season Irrigation',
        description: 'Critical watering during growth phase',
        icon: '💧',
        type: 'irrigation',
        budget: '₹600-1,000',
        completed: false,
        weatherDependent: true
      },
      {
        id: '6',
        week: 12,
        activity: 'Final Pest Check',
        description: 'Last opportunity to control pests before harvest',
        icon: '🐛',
        type: 'pest',
        budget: '₹500-800',
        completed: false
      },
      {
        id: '7',
        week: 16,
        activity: 'Harvest',
        description: 'Harvest when crop reaches maturity',
        icon: '🌾',
        type: 'harvest',
        budget: '₹2,000-3,000',
        completed: false,
        weatherDependent: true
      }
    ];

    return {
      cropName,
      season: farmInput.season || 'Kharif 2025',
      totalWeeks: 16,
      activities: baseActivities,
      weatherAlerts: [
        'Monitor rainfall patterns - excess water can damage young plants',
        'Watch for drought conditions during weeks 8-12'
      ],
      budgetTotal: '₹8,000-12,000'
    };
  };

  const generateCalendar = (cropName: string) => {
    const calendar = generateFasalCalendar(cropName);
    setCalendarData(calendar);
    setShowCalendar(true);
  };

  const toggleActivityComplete = (activityId: string) => {
    if (calendarData) {
      const updatedActivities = calendarData.activities.map(activity =>
        activity.id === activityId
          ? { ...activity, completed: !activity.completed }
          : activity
      );
      setCalendarData({ ...calendarData, activities: updatedActivities });
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'sowing': return 'bg-green-100 text-green-800 border-green-200';
      case 'irrigation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fertilizer': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pest': return 'bg-red-100 text-red-800 border-red-200';
      case 'harvest': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Use AI service for dynamic recommendations
  const generateRecommendations = async () => {
    setLoading(true);
    
    try {
      // Call the AI service with farm input data
      const aiRecommendations = await generateCropRecommendations(farmInput);
      // Filter recommendations based on budget (minimum 10,000)
      let filtered = aiRecommendations;
      const budget = farmInput.budget ? Number(farmInput.budget) : 0;
      if (budget > 0) {
        filtered = aiRecommendations.filter(rec => {
          // rec may include estimatedCost in different formats; attempt parsing
          const costRaw = (rec as any).estimatedCost;
          if (!costRaw) return true; // keep if no cost info
          // try to extract number from strings like '₹10,000' or '10000-15000'
          const nums = String(costRaw).replace(/[^0-9\-]/g, '').split('-').filter(Boolean);
          const low = nums.length > 0 ? Number(nums[0]) : NaN;
          return isNaN(low) ? true : low <= budget;
        });
      }

      setRecommendations(filtered);
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
          {t('cropAdvisory.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign size={16} className="inline mr-1" />
              {t('cropAdvisory.budget')} (Min: ₹10,000)
            </label>
            <input
              type="number"
              value={farmInput.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="50000"
              min="10000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              {t('cropAdvisory.season')}
            </label>
            <select
              value={farmInput.season}
              onChange={(e) => handleInputChange('season', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">{t('action.select')} {t('cropAdvisory.season')}</option>
              <option value="kharif">{t('season.kharif')}</option>
              <option value="rabi">{t('season.rabi')}</option>
              <option value="zaid">{t('season.zaid')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Layers size={16} className="inline mr-1" />
              {t('cropAdvisory.soilType')}
            </label>
            <select
              value={farmInput.soilType}
              onChange={(e) => handleInputChange('soilType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">{t('action.select')} {t('cropAdvisory.soilType')}</option>
              <option value="clay">{t('soil.clay')}</option>
              <option value="sandy">{t('soil.sandy')}</option>
              <option value="loam">{t('soil.loam')}</option>
              <option value="silt">{t('soil.silt')}</option>
              <option value="black_cotton">{t('soil.black')}</option>
              <option value="red">{t('soil.red')}</option>
            </select>
          </div>          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Thermometer size={16} className="inline mr-1" />
              {t('cropAdvisory.weather')}
            </label>
            <select
              value={farmInput.weather}
              onChange={(e) => handleInputChange('weather', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">{t('action.select')} {t('cropAdvisory.weather')}</option>
              <option value="hot_humid">{t('weather.hotHumid')}</option>
              <option value="moderate">{t('weather.moderate')}</option>
              <option value="cool_dry">{t('weather.coolDry')}</option>
              <option value="rainy">{t('weather.rainy')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Droplets size={16} className="inline mr-1" />
              {t('cropAdvisory.farmSize')}
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
            disabled={loading || !farmInput.budget || Number(farmInput.budget) < 10000 || !farmInput.season || !farmInput.soilType}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t('cropAdvisory.generating') : t('cropAdvisory.getAdvice')}
          </button>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('cropAdvisory.recommendations')}</h2>
          
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

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => generateCalendar(crop.name)}
                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                  >
                    <Calendar size={16} className="mr-2" />
                    View Fasal Calendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fasal Calendar (Smart Crop Calendar) */}
      {showCalendar && calendarData && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="mr-2 text-emerald-600" size={24} />
                Fasal Calendar - {calendarData.cropName}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                AI-powered seasonal activity plan for {calendarData.season}
              </p>
            </div>
            <button
              onClick={() => setShowCalendar(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Calendar Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="text-emerald-600 mr-2" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium text-gray-900">{calendarData.totalWeeks} weeks</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <DollarSign className="text-blue-600 mr-2" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="font-medium text-gray-900">{calendarData.budgetTotal}</p>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Bell className="text-amber-600 mr-2" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Activities</p>
                  <p className="font-medium text-gray-900">{calendarData.activities.length} planned</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Alerts */}
          {calendarData.weatherAlerts.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="text-orange-600 mr-2 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-orange-800 mb-2">Weather Alerts</h4>
                  <ul className="space-y-1">
                    {calendarData.weatherAlerts.map((alert, index) => (
                      <li key={index} className="text-sm text-orange-700">{alert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Timeline</h3>
            
            <div className="space-y-3">
              {calendarData.activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`border rounded-lg p-4 transition-all ${
                    activity.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleActivityComplete(activity.id)}
                        className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          activity.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {activity.completed && <CheckCircle size={12} />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">{activity.icon}</span>
                          <h4 className={`font-medium ${activity.completed ? 'text-green-800' : 'text-gray-900'}`}>
                            Week {activity.week}: {activity.activity}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getActivityTypeColor(activity.type)}`}>
                            {activity.type}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          {activity.budget && (
                            <div className="flex items-center text-blue-600">
                              <DollarSign size={14} className="mr-1" />
                              {activity.budget}
                            </div>
                          )}
                          
                          {activity.weatherDependent && (
                            <div className="flex items-center text-amber-600">
                              <Droplet size={14} className="mr-1" />
                              Weather dependent
                            </div>
                          )}
                        </div>

                        {activity.alternatives && activity.alternatives.length > 0 && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs font-medium text-blue-800 mb-1">Budget-friendly alternatives:</p>
                            <ul className="text-xs text-blue-700 space-y-1">
                              {activity.alternatives.map((alt, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                  {alt}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Notice */}
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-start">
              <Leaf className="text-emerald-600 mr-2 mt-0.5" size={20} />
              <div>
                <h4 className="font-medium text-emerald-800 mb-1">Digital Farm Health Card Integration</h4>
                <p className="text-sm text-emerald-700">
                  Each completed task is automatically logged into your Farm Health Report. 
                  Track your farming progress and maintain detailed records for better decision making.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropAdvisory;