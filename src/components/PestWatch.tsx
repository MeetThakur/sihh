import React, { useState } from 'react';
import { MapPin, AlertTriangle, Users } from 'lucide-react';
import PestImageDetection from './PestImageDetection';
import { PestAnalysisResult } from '../utils/pestDetectionService';

interface PestReport {
  id: string;
  location: string;
  pestType: string;
  severity: 'Low' | 'Medium' | 'High';
  crop: string;
  reportedBy: string;
  timestamp: string;
  imageUrl?: string;
}

const PestWatch: React.FC = () => {
  // Mock pest reports data
  const [pestReports] = useState<PestReport[]>([
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
  ]);

  const handlePestDetection = (pestData: PestAnalysisResult) => {
    console.log('Pest detected:', pestData);
    // You can add the detection to pest reports here if needed
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-amber-600 bg-amber-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 min-h-screen p-6">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
          Pest Watch Dashboard
        </h1>
        <p className="text-gray-600 text-lg">AI-Powered Pest Detection & Community Monitoring</p>
      </div>

      {/* Enhanced AI-Powered Pest Image Detection */}
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100">
        <PestImageDetection onPestDetected={handlePestDetection} />
      </div>

      {/* Enhanced Community Pest Reports */}
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mr-4 shadow-lg">
              <Users className="text-white" size={28} />
            </div>
            Community Pest Reports
          </h3>
          <span className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-2xl text-sm font-bold shadow-lg animate-pulse">
            {pestReports.length} Active Alerts
          </span>
        </div>

        <div className="space-y-6">
          {pestReports.map((report) => (
            <div key={report.id} className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-200 to-orange-200 rounded-full opacity-20 -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h4 className="text-xl font-bold text-gray-900">{report.pestType}</h4>
                    <span className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${getSeverityColor(report.severity)}`}>
                      {report.severity} Risk
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <div className="flex items-center mb-2">
                        <MapPin size={16} className="mr-2 text-blue-500" />
                        <span className="font-bold text-gray-700">Location</span>
                      </div>
                      <p className="text-blue-700 font-medium">{report.location}</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                      <div className="flex items-center mb-2">
                        <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                        <span className="font-bold text-gray-700">Affected Crop</span>
                      </div>
                      <p className="text-green-700 font-medium">{report.crop}</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                      <div className="flex items-center mb-2">
                        <Users size={16} className="mr-2 text-purple-500" />
                        <span className="font-bold text-gray-700">Reported By</span>
                      </div>
                      <p className="text-purple-700 font-medium">{report.reportedBy}</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-100">
                      <div className="flex items-center mb-2">
                        <span className="w-4 h-4 bg-amber-500 rounded-full mr-2"></span>
                        <span className="font-bold text-gray-700">Time</span>
                      </div>
                      <p className="text-amber-700 font-medium">{report.timestamp}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-3 ml-6">
                  <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold">
                    View Details
                  </button>
                  {report.severity === 'High' && (
                    <div className="p-3 bg-red-100 rounded-2xl animate-pulse">
                      <AlertTriangle size={24} className="text-red-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Regional Pest Map */}
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl mr-4 shadow-lg">
            <MapPin className="text-white" size={28} />
          </div>
          Regional Pest Outbreak Map
        </h3>
        
        <div className="bg-gradient-to-br from-emerald-100 via-green-100 to-blue-100 rounded-3xl p-10 text-center shadow-inner">
          <div className="p-6 bg-white/50 backdrop-blur-sm rounded-3xl mb-6">
            <MapPin className="mx-auto text-emerald-600 mb-4" size={64} />
            <h4 className="text-2xl font-bold text-gray-900 mb-2">Village Rampur Region</h4>
            <p className="text-gray-600 text-lg">Interactive pest outbreak visualization</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="group p-6 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl border-4 border-red-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="p-4 bg-white/80 rounded-2xl mb-4">
                <AlertTriangle className="mx-auto text-red-600 mb-2" size={32} />
                <div className="text-lg font-bold text-red-800">High Risk Zone</div>
              </div>
              <div className="text-sm font-bold text-red-700">Sector 12</div>
              <div className="text-xs text-red-600 mt-1">Brown Planthopper outbreak</div>
            </div>
            
            <div className="group p-6 bg-gradient-to-br from-amber-100 to-yellow-200 rounded-3xl border-4 border-amber-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="p-4 bg-white/80 rounded-2xl mb-4">
                <AlertTriangle className="mx-auto text-amber-600 mb-2" size={32} />
                <div className="text-lg font-bold text-amber-800">Medium Risk Zone</div>
              </div>
              <div className="text-sm font-bold text-amber-700">Sector 8</div>
              <div className="text-xs text-amber-600 mt-1">Aphid presence detected</div>
            </div>
            
            <div className="group p-6 bg-gradient-to-br from-green-100 to-emerald-200 rounded-3xl border-4 border-green-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="p-4 bg-white/80 rounded-2xl mb-4">
                <span className="block mx-auto w-8 h-8 bg-green-500 rounded-full mb-2"></span>
                <div className="text-lg font-bold text-green-800">Safe Zone</div>
              </div>
              <div className="text-sm font-bold text-green-700">Other Areas</div>
              <div className="text-xs text-green-600 mt-1">No threats detected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestWatch;