import React, { useState } from 'react';
import { Map as MapIcon, Eye, AlertTriangle, Droplets, Edit3, X, Lightbulb } from 'lucide-react';
import { mockFarmData } from '../utils/mockData';

interface PlotData {
  id: string;
  crop: string;
  health: 'excellent' | 'good' | 'warning' | 'poor';
  soilMoisture: 'high' | 'medium' | 'low';
  pestAlert: boolean;
}

interface CropSuggestion {
  name: string;
  suitability: 'High' | 'Medium' | 'Low';
  reason: string;
  expectedYield: string;
  roi: string;
}

const FarmVisualization: React.FC = () => {
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'crops' | 'health' | 'moisture'>('crops');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlot, setEditingPlot] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [farmData, setFarmData] = useState<PlotData[]>(mockFarmData);

  // Available crops for selection
  const availableCrops = [
    'Empty', 'Rice', 'Wheat', 'Sugarcane', 'Maize', 'Mustard', 'Potato', 'Onion', 'Tomato', 'Cotton'
  ];

  // Generate crop suggestions based on plot conditions
  const generateCropSuggestions = (plot: PlotData): CropSuggestion[] => {
    const suggestions: CropSuggestion[] = [];
    
    if (plot.soilMoisture === 'high') {
      suggestions.push({
        name: 'Rice',
        suitability: 'High',
        reason: 'High soil moisture ideal for rice cultivation',
        expectedYield: '40-50 quintals/hectare',
        roi: '₹35,000-45,000'
      });
      
      if (plot.health === 'excellent' || plot.health === 'good') {
        suggestions.push({
          name: 'Sugarcane',
          suitability: 'High',
          reason: 'High moisture and good soil health perfect for sugarcane',
          expectedYield: '450-550 quintals/hectare',
          roi: '₹80,000-1,20,000'
        });
      }
    }
    
    if (plot.soilMoisture === 'medium') {
      suggestions.push({
        name: 'Maize',
        suitability: 'High',
        reason: 'Medium moisture suitable for maize with good drainage',
        expectedYield: '30-40 quintals/hectare',
        roi: '₹25,000-35,000'
      });
      
      suggestions.push({
        name: 'Cotton',
        suitability: 'Medium',
        reason: 'Moderate water needs, good for cotton cultivation',
        expectedYield: '15-20 quintals/hectare',
        roi: '₹40,000-60,000'
      });
    }
    
    if (plot.soilMoisture === 'low') {
      suggestions.push({
        name: 'Mustard',
        suitability: 'High',
        reason: 'Low water requirement, suitable for dry conditions',
        expectedYield: '10-15 quintals/hectare',
        roi: '₹45,000-65,000'
      });
    }
    
    if (plot.health === 'poor') {
      suggestions.push({
        name: 'Empty (Soil Recovery)',
        suitability: 'High',
        reason: 'Allow soil to recover with cover crops or organic amendments',
        expectedYield: 'Soil health improvement',
        roi: 'Long-term benefits'
      });
    }
    
    if (plot.health === 'excellent' && plot.soilMoisture !== 'low') {
      suggestions.push({
        name: 'Tomato',
        suitability: 'Medium',
        reason: 'High-value crop for excellent soil conditions',
        expectedYield: '200-300 quintals/hectare',
        roi: '₹80,000-1,50,000'
      });
    }
    
    return suggestions.slice(0, 3);
  };

  const updatePlot = (plotId: string, newCrop: string) => {
    setFarmData(prevData => 
      prevData.map(plot => 
        plot.id === plotId 
          ? { 
              ...plot, 
              crop: newCrop,
              health: newCrop === 'Empty' ? plot.health : 
                      plot.health === 'poor' ? 'warning' : plot.health
            }
          : plot
      )
    );
    setEditingPlot(null);
  };

  const getCropColor = (crop: string) => {
    switch (crop) {
      case 'Rice': return 'bg-emerald-200 border-emerald-400';
      case 'Wheat': return 'bg-amber-200 border-amber-400';
      case 'Sugarcane': return 'bg-green-200 border-green-400';
      case 'Maize': return 'bg-yellow-200 border-yellow-400';
      case 'Mustard': return 'bg-orange-200 border-orange-400';
      case 'Potato': return 'bg-purple-200 border-purple-400';
      case 'Onion': return 'bg-pink-200 border-pink-400';
      case 'Tomato': return 'bg-red-200 border-red-400';
      case 'Cotton': return 'bg-indigo-200 border-indigo-400';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getPlotColor = (plot: PlotData) => {
    if (viewMode === 'crops') {
      return getCropColor(plot.crop);
    } else if (viewMode === 'health') {
      switch (plot.health) {
        case 'excellent': return 'bg-emerald-200 border-emerald-400';
        case 'good': return 'bg-green-200 border-green-400';
        case 'warning': return 'bg-amber-200 border-amber-400';
        case 'poor': return 'bg-red-200 border-red-400';
        default: return 'bg-gray-100 border-gray-300';
      }
    } else {
      switch (plot.soilMoisture) {
        case 'high': return 'bg-blue-200 border-blue-400';
        case 'medium': return 'bg-sky-200 border-sky-400';
        case 'low': return 'bg-red-200 border-red-400';
        default: return 'bg-gray-100 border-gray-300';
      }
    }
  };

  const selectedPlotData = selectedPlot ? farmData.find(p => p.id === selectedPlot) : null;
  const cropSuggestions = selectedPlotData ? generateCropSuggestions(selectedPlotData) : [];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <MapIcon className="mr-2 text-emerald-600" size={24} />
            Farm Visualization
          </h2>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setEditingPlot(null);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                isEditing 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isEditing ? (
                <>
                  <X size={16} className="mr-1" />
                  Cancel Edit
                </>
              ) : (
                <>
                  <Edit3 size={16} className="mr-1" />
                  Edit Plots
                </>
              )}
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('crops')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'crops' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Crops
              </button>
              <button
                onClick={() => setViewMode('health')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'health' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Eye size={16} className="inline mr-1" />
                Health
              </button>
              <button
                onClick={() => setViewMode('moisture')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'moisture' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Droplets size={16} className="inline mr-1" />
                Moisture
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farm Grid */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Layout ({farmData.length * 0.16} acres)</h3>
          
          <div className="grid grid-cols-6 gap-2 mb-4">
            {farmData.map((plot) => (
              <div key={plot.id} className="relative">
                {editingPlot === plot.id ? (
                  <div className="aspect-square border-2 border-emerald-500 rounded-lg p-1 bg-white">
                    <select
                      value={plot.crop}
                      onChange={(e) => updatePlot(plot.id, e.target.value)}
                      className="w-full h-full text-xs bg-white border-none focus:ring-0 focus:outline-none"
                      autoFocus
                    >
                      {availableCrops.map(crop => (
                        <option key={crop} value={crop}>{crop}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (isEditing) {
                        setEditingPlot(plot.id);
                      } else {
                        setSelectedPlot(plot.id);
                        setShowSuggestions(true);
                      }
                    }}
                    className={`
                      relative aspect-square border-2 rounded-lg p-2 transition-all duration-200 hover:scale-105 w-full
                      ${getPlotColor(plot)}
                      ${selectedPlot === plot.id ? 'ring-2 ring-emerald-500' : ''}
                      ${isEditing ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer' : ''}
                    `}
                  >
                    <div className="text-xs font-medium text-gray-700 mb-1">{plot.id}</div>
                    {plot.pestAlert && (
                      <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 shadow-lg animate-pulse">
                        <AlertTriangle 
                          size={16} 
                          className="text-white animate-bounce" 
                          fill="white"
                        />
                      </div>
                    )}
                    {isEditing && (
                      <Edit3 
                        size={10} 
                        className="absolute bottom-1 right-1 text-blue-500" 
                      />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Legend</h4>
            {viewMode === 'crops' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-emerald-200 border border-emerald-400 rounded"></div>
                  <span className="text-lg mr-1">🌾</span>
                  <span>Rice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-amber-200 border border-amber-400 rounded"></div>
                  <span className="text-lg mr-1">🌾</span>
                  <span>Wheat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                  <span className="text-lg mr-1">🎋</span>
                  <span>Sugarcane</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded"></div>
                  <span className="text-lg mr-1">🌽</span>
                  <span>Maize</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-200 border border-orange-400 rounded"></div>
                  <span className="text-lg mr-1">🌻</span>
                  <span>Mustard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-200 border border-purple-400 rounded"></div>
                  <span className="text-lg mr-1">🥔</span>
                  <span>Potato</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-pink-200 border border-pink-400 rounded"></div>
                  <span className="text-lg mr-1">🧅</span>
                  <span>Onion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
                  <span className="text-lg mr-1">🍅</span>
                  <span>Tomato</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-indigo-200 border border-indigo-400 rounded"></div>
                  <span className="text-lg mr-1">🌿</span>
                  <span>Cotton</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                  <span className="text-lg mr-1">⬜</span>
                  <span>Empty</span>
                </div>
              </div>
            )}
            {viewMode === 'health' && (
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-emerald-200 border border-emerald-400 rounded"></div>
                  <span>Excellent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                  <span>Good</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-amber-200 border border-amber-400 rounded"></div>
                  <span>Warning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
                  <span>Poor</span>
                </div>
              </div>
            )}
            {viewMode === 'moisture' && (
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                  <span>High Moisture</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-sky-200 border border-sky-400 rounded"></div>
                  <span>Medium Moisture</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
                  <span>Low Moisture</span>
                </div>
              </div>
            )}
            
            {/* Pest Alert Legend */}
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <div className="bg-red-500 rounded-full p-1 animate-pulse">
                  <AlertTriangle size={14} className="text-white" fill="white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-red-800">Pest Alert</span>
                  <p className="text-xs text-red-600">Plots with this symbol require immediate pest management attention</p>
                </div>
              </div>
            </div>
            
            {isEditing && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <Edit3 size={16} className="inline mr-1" />
                  Click on any plot to change its crop. The system will automatically suggest suitable crops based on soil conditions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Plot Details and Suggestions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Plot Details</h3>
            {selectedPlotData && (
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
              >
                <Lightbulb size={16} className="mr-1" />
                {showSuggestions ? 'Hide' : 'Show'} Suggestions
              </button>
            )}
          </div>
          
          {selectedPlotData ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Plot {selectedPlotData.id}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crop:</span>
                    <span className="font-medium">{selectedPlotData.crop}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Health:</span>
                    <span className={`font-medium capitalize ${
                      selectedPlotData.health === 'excellent' ? 'text-emerald-600' :
                      selectedPlotData.health === 'good' ? 'text-green-600' :
                      selectedPlotData.health === 'warning' ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {selectedPlotData.health}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Soil Moisture:</span>
                    <span className={`font-medium capitalize ${
                      selectedPlotData.soilMoisture === 'high' ? 'text-blue-600' :
                      selectedPlotData.soilMoisture === 'medium' ? 'text-sky-600' : 'text-red-600'
                    }`}>
                      {selectedPlotData.soilMoisture}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pest Alert:</span>
                    <div className="flex items-center space-x-2">
                      {selectedPlotData.pestAlert && (
                        <div className="bg-red-500 rounded-full p-1 animate-pulse">
                          <AlertTriangle size={12} className="text-white" fill="white" />
                        </div>
                      )}
                      <span className={`font-medium ${selectedPlotData.pestAlert ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedPlotData.pestAlert ? 'Active Alert' : 'No Alert'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Crop Recommendations */}
              {selectedPlotData.crop !== 'Empty' && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Current Crop Recommendations</h4>
                  <div className="space-y-2 text-sm">
                    {selectedPlotData.health === 'warning' && (
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-amber-800">Consider applying organic fertilizer and check for nutrient deficiency.</p>
                      </div>
                    )}
                    {selectedPlotData.health === 'poor' && (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-red-800">Immediate attention required. Consider soil testing and pest treatment.</p>
                      </div>
                    )}
                    {selectedPlotData.soilMoisture === 'low' && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-800">Increase irrigation frequency. Monitor crop stress signs.</p>
                      </div>
                    )}
                    {selectedPlotData.pestAlert && (
                      <div className="p-4 bg-red-50 rounded-lg border-2 border-red-300 shadow-md">
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-500 rounded-full p-2 animate-pulse">
                            <AlertTriangle size={20} className="text-white" fill="white" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-red-800 mb-1">🚨 URGENT: Pest Alert Active</h5>
                            <p className="text-red-700 text-sm">
                              Immediate pest management required! Apply organic neem spray or consult agricultural expert. 
                              Check neighboring plots for spread prevention.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Crop Suggestions */}
              {showSuggestions && cropSuggestions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <Lightbulb size={18} className="mr-2 text-emerald-600" />
                    Recommended Crops for this Plot
                  </h4>
                  <div className="space-y-3">
                    {cropSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-emerald-900">{suggestion.name}</h5>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            suggestion.suitability === 'High' ? 'bg-green-100 text-green-800' :
                            suggestion.suitability === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {suggestion.suitability} Suitability
                          </span>
                        </div>
                        <p className="text-sm text-emerald-800 mb-2">{suggestion.reason}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Expected Yield:</span>
                            <div className="font-medium">{suggestion.expectedYield}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Expected ROI:</span>
                            <div className="font-medium">{suggestion.roi}</div>
                          </div>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => updatePlot(selectedPlotData.id, suggestion.name.split(' ')[0])}
                            className="mt-2 w-full px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                          >
                            Plant {suggestion.name.split(' ')[0]}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapIcon size={48} className="mx-auto mb-4 text-gray-400" />
              <p>Click on a plot to view details and get crop recommendations</p>
              {isEditing && (
                <p className="text-sm mt-2 text-blue-600">Edit Mode: Click plots to change crops</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Farm Statistics */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">
              {Math.round((farmData.filter(p => p.crop !== 'Empty').length / farmData.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Land Utilization</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((farmData.filter(p => p.health === 'excellent' || p.health === 'good').length / farmData.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Healthy Plots</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {farmData.filter(p => p.soilMoisture === 'high').length > farmData.length / 2 ? 'High' : 
               farmData.filter(p => p.soilMoisture === 'medium').length > farmData.length / 2 ? 'Medium' : 'Low'}
            </div>
            <div className="text-sm text-gray-600">Avg Soil Moisture</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {farmData.filter(p => p.pestAlert).length}
            </div>
            <div className="text-sm text-gray-600">Active Alerts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmVisualization;