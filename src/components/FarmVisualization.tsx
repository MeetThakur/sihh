import React, { useState } from 'react';
import { Map as MapIcon, AlertTriangle, Edit3, X, Lightbulb, Settings, Plus, Minus, Grid3X3 } from 'lucide-react';
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

interface FarmConfig {
  totalAcres: number;
  plotSizeAcres: number;
  rows: number;
  cols: number;
}

const FarmVisualization: React.FC = () => {
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'crops' | 'health' | 'moisture'>('crops');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlot, setEditingPlot] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [farmData, setFarmData] = useState<PlotData[]>(mockFarmData);
  const [showFarmConfig, setShowFarmConfig] = useState(false);
  const [farmConfig, setFarmConfig] = useState<FarmConfig>({
    totalAcres: farmData.length * 0.16,
    plotSizeAcres: 0.16,
    rows: 6,
    cols: 6
  });

  // Available crops for selection
  const availableCrops = [
    'Empty', 'Rice', 'Wheat', 'Sugarcane', 'Maize', 'Mustard', 'Potato', 'Onion', 'Tomato', 'Cotton'
  ];

  // Generate plot IDs based on grid dimensions
  const generatePlotId = (row: number, col: number): string => {
    const rowLabel = String.fromCharCode(65 + row); // A, B, C, etc.
    return `${rowLabel}${col + 1}`;
  };

  // Generate new farm data based on configuration
  const generateFarmData = (rows: number, cols: number): PlotData[] => {
    const newData: PlotData[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const plotId = generatePlotId(row, col);
        // Try to preserve existing plot data if it exists
        const existingPlot = farmData.find(plot => plot.id === plotId);
        
        newData.push(existingPlot || {
          id: plotId,
          crop: 'Empty',
          health: 'good',
          soilMoisture: 'medium',
          pestAlert: false
        });
      }
    }
    return newData;
  };

  // Update farm configuration
  const updateFarmConfig = (newConfig: Partial<FarmConfig>) => {
    const updatedConfig = { ...farmConfig, ...newConfig };
    
    // Calculate total acres if plot size changed
    if (newConfig.plotSizeAcres) {
      updatedConfig.totalAcres = updatedConfig.rows * updatedConfig.cols * newConfig.plotSizeAcres;
    }
    
    // Update rows and cols if total acres changed
    if (newConfig.totalAcres && !newConfig.plotSizeAcres) {
      const totalPlots = Math.round(newConfig.totalAcres / updatedConfig.plotSizeAcres);
      const newRows = Math.ceil(Math.sqrt(totalPlots));
      const newCols = Math.ceil(totalPlots / newRows);
      updatedConfig.rows = newRows;
      updatedConfig.cols = newCols;
      updatedConfig.totalAcres = newRows * newCols * updatedConfig.plotSizeAcres;
    }
    
    setFarmConfig(updatedConfig);
    
    // Generate new farm data if grid dimensions changed
    if (newConfig.rows !== undefined || newConfig.cols !== undefined) {
      const newFarmData = generateFarmData(updatedConfig.rows, updatedConfig.cols);
      setFarmData(newFarmData);
    }
  };

  // Add or remove plots
  const adjustPlotCount = (increment: boolean) => {
    const currentTotal = farmConfig.rows * farmConfig.cols;
    const newTotal = increment ? currentTotal + 1 : Math.max(1, currentTotal - 1);
    
    const newRows = Math.ceil(Math.sqrt(newTotal));
    const newCols = Math.ceil(newTotal / newRows);
    
    updateFarmConfig({
      rows: newRows,
      cols: newCols,
      totalAcres: newRows * newCols * farmConfig.plotSizeAcres
    });
  };

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
    <div className="space-y-8 bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 min-h-screen p-6">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Smart Farm Visualization
        </h1>
        <p className="text-gray-600 text-lg">Interactive Farm Layout & Crop Management Dashboard</p>
      </div>

      {/* Enhanced Controls */}
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mr-4 shadow-lg">
              <MapIcon className="text-white" size={28} />
            </div>
            Farm Layout Manager
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowFarmConfig(!showFarmConfig)}
              className={`group px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center ${
                showFarmConfig
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
              }`}
            >
              <Settings size={20} className="mr-2 group-hover:rotate-45 transition-transform duration-300" />
              Farm Settings
            </button>
            
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setEditingPlot(null);
              }}
              className={`group px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center ${
                isEditing 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700' 
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700'
              }`}
            >
              {isEditing ? (
                <>
                  <X size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Cancel Edit
                </>
              ) : (
                <>
                  <Edit3 size={20} className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Edit Plots
                </>
              )}
            </button>
            
            <div className="flex bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
              <button
                onClick={() => setViewMode('crops')}
                className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                  viewMode === 'crops' 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                Crops
              </button>
              <button
                onClick={() => setViewMode('health')}
                className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                  viewMode === 'health' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                Soil Health
              </button>
              <button
                onClick={() => setViewMode('moisture')}
                className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                  viewMode === 'moisture' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-700'
                }`}
              >
                Moisture
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFarmConfig && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Grid3X3 className="mr-3 text-purple-600" size={24} />
              Farm Configuration
            </h3>
            <button
              onClick={() => setShowFarmConfig(false)}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Total Farm Size (acres)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={farmConfig.totalAcres}
                onChange={(e) => updateFarmConfig({ totalAcres: parseFloat(e.target.value) || 0.1 })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Plot Size (acres each)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={farmConfig.plotSizeAcres}
                onChange={(e) => updateFarmConfig({ plotSizeAcres: parseFloat(e.target.value) || 0.01 })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Grid Rows</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateFarmConfig({ rows: Math.max(1, farmConfig.rows - 1) })}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-bold text-gray-900 min-w-[3rem] text-center">{farmConfig.rows}</span>
                <button
                  onClick={() => updateFarmConfig({ rows: farmConfig.rows + 1 })}
                  className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Grid Columns</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateFarmConfig({ cols: Math.max(1, farmConfig.cols - 1) })}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-bold text-gray-900 min-w-[3rem] text-center">{farmConfig.cols}</span>
                <button
                  onClick={() => updateFarmConfig({ cols: farmConfig.cols + 1 })}
                  className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white rounded-xl border border-purple-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total Plots: <strong className="text-gray-900">{farmConfig.rows * farmConfig.cols}</strong></span>
              <span>Calculated Size: <strong className="text-gray-900">{(farmConfig.rows * farmConfig.cols * farmConfig.plotSizeAcres).toFixed(2)} acres</strong></span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Farm Grid */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Farm Layout ({farmConfig.totalAcres.toFixed(2)} acres)
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => adjustPlotCount(false)}
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                title="Remove plots"
              >
                <Minus size={16} />
              </button>
              <span className="text-sm text-gray-600 min-w-[4rem] text-center">
                {farmData.length} plots
              </span>
              <button
                onClick={() => adjustPlotCount(true)}
                className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                title="Add plots"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div 
            className="grid gap-2 mb-4"
            style={{ gridTemplateColumns: `repeat(${farmConfig.cols}, 1fr)` }}
          >
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