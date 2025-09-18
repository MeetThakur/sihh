import React, { useState } from 'react';
import { Leaf, Calendar, DollarSign, Clock, Bell, CheckCircle, Droplet, AlertCircle } from 'lucide-react';
import { generateCropRecommendations } from '../utils/aiService';
import { useLanguage } from '../contexts/LanguageContext';
import SoilDetection from './SoilDetection';

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
  estimatedCost?: number;
  suitabilityScore?: string;
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
      case 'sowing': return 'bg-green-100 text-green-800';
      case 'irrigation': return 'bg-blue-100 text-blue-800';
      case 'fertilizer': return 'bg-purple-100 text-purple-800';
      case 'pest': return 'bg-red-100 text-red-800';
      case 'harvest': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Use AI service for dynamic recommendations with ROI in rupees
  const generateRecommendations = async () => {
    setLoading(true);
    
    try {
      // Call the AI service with farm input data
      const aiRecommendations = await generateCropRecommendations(farmInput);
      
      // Filter recommendations based on budget (minimum 10,000)
      let filtered = aiRecommendations;
      const budget = farmInput.budget ? Number(farmInput.budget) : 0;
      if (budget >= 10000) {
        filtered = aiRecommendations.filter(rec => {
          const cost = (rec as any).estimatedCost || 0;
          return cost <= budget;
        });
      }

      setRecommendations(filtered);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback to static recommendations if AI service fails
      const fallbackRecommendations = getStaticFallback(farmInput);
      setRecommendations(fallbackRecommendations || []);
    }
    
    setLoading(false);
  };

  // Fallback static recommendations if AI fails - with weather-specific ROI
  const getStaticFallback = (farmInput: FarmInput): CropRecommendation[] => {
    const budget = Number(farmInput.budget) || 0;
    
    if (farmInput.season === 'kharif') {
      if (farmInput.weather === 'rainy') {
        return [
          {
            name: 'Rice (Paddy)',
            suitability: 'High' as const,
            expectedYield: '45-55 quintals/hectare',
            roi: '₹45,000 - ₹65,000', // Higher ROI due to optimal water conditions
            requirements: ['Abundant water supply', 'Well-prepared field', 'Pest management in wet conditions'],
            tips: ['Monitor for blast disease in rainy conditions', 'Ensure proper drainage', 'Use disease-resistant varieties'],
            estimatedCost: 25000
          },
          {
            name: 'Maize (Corn)',
            suitability: 'High' as const,
            expectedYield: '65-85 quintals/hectare',
            roi: '₹45,000 - ₹65,000', // Good ROI with adequate rainfall
            requirements: ['Well-drained soil to prevent waterlogging', 'Balanced nutrition', 'Fall armyworm monitoring'],
            tips: ['Ensure good drainage in rainy season', 'Apply fertilizers before heavy rains', 'Monitor for fungal diseases'],
            estimatedCost: 20000
          }
        ].filter(rec => budget === 0 || rec.estimatedCost <= budget);
      } else if (farmInput.weather === 'hot_humid') {
        return [
          {
            name: 'Rice (Paddy)',
            suitability: 'Medium' as const,
            expectedYield: '35-45 quintals/hectare',
            roi: '₹30,000 - ₹45,000', // Lower ROI due to heat stress and higher irrigation costs
            requirements: ['Continuous irrigation', 'Heat-tolerant varieties', 'Higher water management costs'],
            tips: ['Use heat-resistant varieties', 'Increase irrigation frequency', 'Monitor for heat stress symptoms'],
            estimatedCost: 30000
          },
          {
            name: 'Sugarcane',
            suitability: 'High' as const,
            expectedYield: '85-105 tonnes/hectare',
            roi: '₹90,000 - ₹130,000', // Higher ROI as sugarcane thrives in hot humid conditions
            requirements: ['High water requirement', 'Rich soil', 'Long growing season benefits from heat'],
            tips: ['Optimal conditions for sugarcane', 'Regular irrigation essential', 'Higher yields expected in hot humid weather'],
            estimatedCost: 45000
          }
        ].filter(rec => budget === 0 || rec.estimatedCost <= budget);
      } else { // moderate weather
        return [
          {
            name: 'Rice (Paddy)',
            suitability: 'Medium' as const,
            expectedYield: '40-50 quintals/hectare',
            roi: '₹38,000 - ₹55,000', // Moderate ROI for moderate conditions
            requirements: ['Balanced water supply', 'Good field preparation', 'Standard pest management'],
            tips: ['Moderate conditions require balanced approach', 'Standard irrigation schedule', 'Regular monitoring needed'],
            estimatedCost: 26000
          }
        ].filter(rec => budget === 0 || rec.estimatedCost <= budget);
      }
    } else if (farmInput.season === 'rabi') {
      if (farmInput.weather === 'cool_dry') {
        return [
          {
            name: 'Wheat',
            suitability: 'High' as const,
            expectedYield: '50-60 quintals/hectare',
            roi: '₹45,000 - ₹60,000', // Optimal ROI for ideal wheat conditions
            requirements: ['Cool weather ideal for wheat', 'Timely sowing', 'Controlled irrigation'],
            tips: ['Perfect conditions for wheat', 'Sow in November for best results', 'Expect higher yields'],
            estimatedCost: 22000
          },
          {
            name: 'Mustard',
            suitability: 'High' as const,
            expectedYield: '18-22 quintals/hectare',
            roi: '₹40,000 - ₹55,000', // Higher ROI in ideal cool dry conditions
            requirements: ['Cool dry weather perfect for mustard', 'Minimal irrigation needed', 'Timely harvesting'],
            tips: ['Ideal weather for mustard cultivation', 'Lower input costs due to less irrigation', 'Higher oil content expected'],
            estimatedCost: 16000
          }
        ].filter(rec => budget === 0 || rec.estimatedCost <= budget);
      } else if (farmInput.weather === 'moderate') {
        return [
          {
            name: 'Wheat',
            suitability: 'Medium' as const,
            expectedYield: '40-50 quintals/hectare',
            roi: '₹35,000 - ₹50,000', // Lower ROI than ideal cool conditions
            requirements: ['Moderate weather may require more irrigation', 'Disease monitoring needed', 'Temperature fluctuation management'],
            tips: ['Monitor for temperature stress', 'May need additional irrigation', 'Watch for disease pressure'],
            estimatedCost: 24000
          }
        ].filter(rec => budget === 0 || rec.estimatedCost <= budget);
      }
    }
    
    // Default fallback for any other conditions
    return [
      {
        name: 'Mixed Farming',
        suitability: 'Medium' as const,
        expectedYield: '200-300 quintals/hectare',
        roi: farmInput.weather === 'hot_humid' ? '₹60,000 - ₹90,000' : '₹50,000 - ₹80,000',
        requirements: ['Diversified approach', 'Weather-appropriate crops', 'Risk management'],
        tips: ['Consult local agricultural officer', 'Choose weather-suitable varieties', 'Market timing important'],
        estimatedCost: 30000
      }
    ].filter(rec => budget === 0 || rec.estimatedCost <= budget);
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
    <div className="space-y-8">
      {/* Minimal Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {t('cropAdvisory.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">AI-Powered Crop Recommendations for Your Farm</p>
      </div>

      {/* Minimal Input Form */}
      <div className="minimal-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Leaf className="text-gray-600 mr-2" size={20} />
          Farm Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('cropAdvisory.budget')} (Min: ₹10,000)
            </label>
            <input
              type="number"
              value={farmInput.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="minimal-input"
              placeholder="50000"
              min="10000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('cropAdvisory.season')}
            </label>
            <select
              value={farmInput.season}
              onChange={(e) => handleInputChange('season', e.target.value)}
              className="minimal-input"
            >
              <option value="">{t('action.select')} {t('cropAdvisory.season')}</option>
              <option value="kharif">{t('season.kharif')}</option>
              <option value="rabi">{t('season.rabi')}</option>
              <option value="zaid">{t('season.zaid')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('cropAdvisory.soilType')}
            </label>
            <select
              value={farmInput.soilType}
              onChange={(e) => handleInputChange('soilType', e.target.value)}
              className="minimal-input"
            >
              <option value="">{t('action.select')} {t('cropAdvisory.soilType')}</option>
              <option value="clay">{t('soil.clay')}</option>
              <option value="sandy">{t('soil.sandy')}</option>
              <option value="loam">{t('soil.loam')}</option>
              <option value="silt">{t('soil.silt')}</option>
              <option value="black_cotton">{t('soil.black')}</option>
              <option value="red">{t('soil.red')}</option>
            </select>
          </div>

          {/* Minimal Soil Image Detection */}
          <div className="col-span-full bg-gray-50 p-4 rounded-lg border border-gray-200">
            <SoilDetection 
              onSoilTypeDetected={(detectedSoilType) => handleInputChange('soilType', detectedSoilType)}
              currentSoilType={farmInput.soilType}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('cropAdvisory.weather')}
            </label>
            <select
              value={farmInput.weather}
              onChange={(e) => handleInputChange('weather', e.target.value)}
              className="minimal-input"
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
              {t('cropAdvisory.farmSize')} (acres)
            </label>
            <input
              type="number"
              value={farmInput.farmSize}
              onChange={(e) => handleInputChange('farmSize', e.target.value)}
              className="minimal-input"
              placeholder="2.5"
              step="0.1"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={generateRecommendations}
            disabled={loading || !farmInput.budget || Number(farmInput.budget) < 10000 || !farmInput.season || !farmInput.soilType}
            className="minimal-button minimal-button-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>{t('cropAdvisory.generating')}</span>
                </>
              ) : (
                <>
                  <Leaf className="group-hover:rotate-12 transition-transform duration-300" size={24} />
                  <span>{t('cropAdvisory.getAdvice')}</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Crop Recommendations */}
      {recommendations.length > 0 && (
        <div className="minimal-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Leaf className="text-gray-600 mr-2" size={20} />
            {t('cropAdvisory.recommendations')}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendations.map((crop, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{crop.name}</h3>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-md text-sm font-medium ${getSuitabilityColor(crop.suitability)}`}>
                      {crop.suitability}
                    </span>
                    {crop.suitabilityScore && (
                      <div className="text-xs text-gray-500 mt-1">
                        Score: {crop.suitabilityScore}/100
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Expected Yield:</span>
                    <span className="font-semibold text-gray-900">{crop.expectedYield}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Potential ROI:</span>
                    <span className="font-semibold text-gray-900">{crop.roi}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="mr-2 text-gray-600" size={16} />
                    Requirements:
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    {crop.requirements.map((req, i) => (
                      <li key={i} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Bell className="mr-2 text-gray-600" size={16} />
                    Expert Tips:
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    {crop.tips.map((tip, i) => (
                      <li key={i} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => generateCalendar(crop.name)}
                    className="w-full minimal-button minimal-button-primary flex items-center justify-center"
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

      {/* Fasal Calendar */}
      {showCalendar && calendarData && (
        <div className="minimal-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="mr-2 text-gray-600" size={20} />
                Fasal Calendar - {calendarData.cropName}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                AI-powered seasonal activity plan for {calendarData.season}
              </p>
            </div>
            <button
              onClick={() => setShowCalendar(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Calendar Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="text-gray-600 mr-2" size={16} />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium text-gray-900">{calendarData.totalWeeks} weeks</p>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <DollarSign className="text-gray-600 mr-2" size={16} />
                <div>
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="font-medium text-gray-900">{calendarData.budgetTotal}</p>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <Bell className="text-gray-600 mr-2" size={16} />
                <div>
                  <p className="text-sm text-gray-600">Activities</p>
                  <p className="font-medium text-gray-900">{calendarData.activities.length} planned</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Alerts */}
          {calendarData.weatherAlerts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="text-yellow-600 mr-2 mt-0.5" size={16} />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-2">Weather Alerts</h4>
                  <ul className="space-y-1">
                    {calendarData.weatherAlerts.map((alert, index) => (
                      <li key={index} className="text-sm text-yellow-700">{alert}</li>
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
                  className={`border rounded-lg p-4 ${
                    activity.completed ? 'bg-green-50 border-green-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleActivityComplete(activity.id)}
                        className={`mt-1 w-5 h-5 rounded border flex items-center justify-center ${
                          activity.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {activity.completed && <CheckCircle size={12} />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{activity.icon}</span>
                          <h4 className={`font-medium ${activity.completed ? 'text-green-800' : 'text-gray-900'}`}>
                            Week {activity.week}: {activity.activity}
                          </h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getActivityTypeColor(activity.type)}`}>
                            {activity.type}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          {activity.budget && (
                            <div className="flex items-center text-gray-600">
                              <DollarSign size={14} className="mr-1" />
                              {activity.budget}
                            </div>
                          )}
                          
                          {activity.weatherDependent && (
                            <div className="flex items-center text-gray-600">
                              <Droplet size={14} className="mr-1" />
                              Weather dependent
                            </div>
                          )}
                        </div>

                        {activity.alternatives && activity.alternatives.length > 0 && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-medium text-gray-800 mb-1">Budget-friendly alternatives:</p>
                            <ul className="text-xs text-gray-700 space-y-1">
                              {activity.alternatives.map((alt, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
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
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <Leaf className="text-green-600 mr-2 mt-0.5" size={16} />
              <div>
                <h4 className="font-medium text-green-800 mb-1">Digital Farm Health Card Integration</h4>
                <p className="text-sm text-green-700">
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