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
      case 'High': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'Medium': return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30';
      case 'Low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Minimal Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Pest Watch
        </h1>
        <p className="text-gray-600 dark:text-gray-400">AI-Powered Pest Detection & Community Monitoring</p>
      </div>

      {/* Minimal AI-Powered Pest Image Detection */}
      <div className="minimal-card p-6">
        <PestImageDetection onPestDetected={handlePestDetection} />
      </div>

      {/* Minimal Community Pest Reports */}
      <div className="minimal-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Users className="text-gray-600 dark:text-gray-400 mr-2" size={20} />
            Community Pest Reports
          </h3>
          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded text-sm font-medium">
            {pestReports.length} Active Alerts
          </span>
        </div>

        <div className="space-y-4">
          {pestReports.map((report) => (
            <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{report.pestType}</h4>
                    <span className={`px-3 py-1 rounded-md text-sm font-medium ${getSeverityColor(report.severity)}`}>
                      {report.severity} Risk
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                        <p className="text-gray-900 dark:text-gray-100">{report.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Crop:</span>
                        <p className="text-gray-900 dark:text-gray-100">{report.crop}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Reported By:</span>
                        <p className="text-gray-900 dark:text-gray-100">{report.reportedBy}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Time:</span>
                        <p className="text-gray-900 dark:text-gray-100">{report.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-3 ml-6">
                  <button className="minimal-button minimal-button-primary">
                    View Details
                  </button>
                  {report.severity === 'High' && (
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
                      <AlertTriangle size={20} className="text-red-500 dark:text-red-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Pest Map */}
      <div className="minimal-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <MapPin className="text-gray-600 dark:text-gray-400 mr-2" size={20} />
          Regional Pest Outbreak Map
        </h3>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center">
          <div className="mb-6">
            <MapPin className="mx-auto text-gray-600 dark:text-gray-400 mb-2" size={48} />
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Village Rampur Region</h4>
            <p className="text-gray-600 dark:text-gray-400">Interactive pest outbreak visualization</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
              <div className="mb-3">
                <AlertTriangle className="mx-auto text-red-600 dark:text-red-400 mb-2" size={24} />
                <div className="font-semibold text-red-800 dark:text-red-300">High Risk Zone</div>
              </div>
              <div className="text-sm font-medium text-red-700 dark:text-red-400">Sector 12</div>
              <div className="text-xs text-red-600 dark:text-red-500 mt-1">Brown Planthopper outbreak</div>
            </div>
            
            <div className="border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="mb-3">
                <AlertTriangle className="mx-auto text-yellow-600 dark:text-yellow-400 mb-2" size={24} />
                <div className="font-semibold text-yellow-800 dark:text-yellow-300">Medium Risk Zone</div>
              </div>
              <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Sector 8</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">Aphid presence detected</div>
            </div>
            
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
              <div className="mb-3">
                <span className="block mx-auto w-6 h-6 bg-green-500 dark:bg-green-400 rounded-full mb-2"></span>
                <div className="font-semibold text-green-800 dark:text-green-300">Safe Zone</div>
              </div>
              <div className="text-sm font-medium text-green-700 dark:text-green-400">Other Areas</div>
              <div className="text-xs text-green-600 dark:text-green-500 mt-1">No threats detected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestWatch;