import React, { useState } from 'react';
import { Map as MapIcon, Plus, Eye, AlertTriangle, Droplets } from 'lucide-react';

interface PlotData {
  id: string;
  crop: string;
  health: 'excellent' | 'good' | 'warning' | 'poor';
  soilMoisture: 'high' | 'medium' | 'low';
  pestAlert: boolean;
}

const FarmVisualization: React.FC = () => {
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'crops' | 'health' | 'moisture'>('crops');

  // Mock farm data - 4x4 grid representing farm plots
  const [farmData, setFarmData] = useState<PlotData[]>([
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
  ]);

  const getPlotColor = (plot: PlotData) => {
    if (viewMode === 'crops') {
      switch (plot.crop) {
        case 'Rice': return 'bg-emerald-200 border-emerald-400';
        case 'Wheat': return 'bg-amber-200 border-amber-400';
        case 'Sugarcane': return 'bg-green-200 border-green-400';
        default: return 'bg-gray-100 border-gray-300';
      }
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

  const getCropEmoji = (crop: string) => {
    switch (crop) {
      case 'Rice': return '🌾';
      case 'Wheat': return '🌾';
      case 'Sugarcane': return '🎋';
      default: return '⬜';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <MapIcon className="mr-2 text-emerald-600" size={24} />
            Farm Visualization
          </h2>
          
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farm Grid */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Layout (2.5 acres)</h3>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            {farmData.map((plot) => (
              <button
                key={plot.id}
                onClick={() => setSelectedPlot(plot.id)}
                className={`
                  relative aspect-square border-2 rounded-lg p-2 transition-all duration-200 hover:scale-105
                  ${getPlotColor(plot)}
                  ${selectedPlot === plot.id ? 'ring-2 ring-emerald-500' : ''}
                `}
              >
                <div className="text-xs font-medium text-gray-700 mb-1">{plot.id}</div>
                {viewMode === 'crops' && (
                  <div className="text-lg">{getCropEmoji(plot.crop)}</div>
                )}
                {plot.pestAlert && (
                  <AlertTriangle 
                    size={12} 
                    className="absolute top-1 right-1 text-red-500" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Legend</h4>
            {viewMode === 'crops' && (
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-emerald-200 border border-emerald-400 rounded"></div>
                  <span>Rice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-amber-200 border border-amber-400 rounded"></div>
                  <span>Wheat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                  <span>Sugarcane</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
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
          </div>
        </div>

        {/* Plot Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plot Details</h3>
          
          {selectedPlot ? (
            <div className="space-y-4">
              {(() => {
                const plot = farmData.find(p => p.id === selectedPlot);
                if (!plot) return null;
                
                return (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Plot {plot.id}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Crop:</span>
                          <span className="font-medium">{plot.crop}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Health:</span>
                          <span className={`font-medium capitalize ${
                            plot.health === 'excellent' ? 'text-emerald-600' :
                            plot.health === 'good' ? 'text-green-600' :
                            plot.health === 'warning' ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {plot.health}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Soil Moisture:</span>
                          <span className={`font-medium capitalize ${
                            plot.soilMoisture === 'high' ? 'text-blue-600' :
                            plot.soilMoisture === 'medium' ? 'text-sky-600' : 'text-red-600'
                          }`}>
                            {plot.soilMoisture}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pest Alert:</span>
                          <span className={`font-medium ${plot.pestAlert ? 'text-red-600' : 'text-green-600'}`}>
                            {plot.pestAlert ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {plot.crop !== 'Empty' && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Recommendations</h4>
                        <div className="space-y-2 text-sm">
                          {plot.health === 'warning' && (
                            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                              <p className="text-amber-800">Consider applying organic fertilizer and check for nutrient deficiency.</p>
                            </div>
                          )}
                          {plot.health === 'poor' && (
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                              <p className="text-red-800">Immediate attention required. Consider soil testing and pest treatment.</p>
                            </div>
                          )}
                          {plot.soilMoisture === 'low' && (
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-blue-800">Increase irrigation frequency. Monitor crop stress signs.</p>
                            </div>
                          )}
                          {plot.pestAlert && (
                            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                              <p className="text-orange-800">Pest detected nearby. Apply preventive measures immediately.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapIcon size={48} className="mx-auto mb-4 text-gray-400" />
              <p>Click on a plot to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Farm Statistics */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">62.5%</div>
            <div className="text-sm text-gray-600">Land Utilization</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">75%</div>
            <div className="text-sm text-gray-600">Average Health</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">High</div>
            <div className="text-sm text-gray-600">Soil Moisture</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-sm text-gray-600">Active Alerts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmVisualization;