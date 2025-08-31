import React, { useState } from 'react';
import { Bug, Upload, Camera, MapPin, AlertTriangle, Users } from 'lucide-react';

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    
    // Simulate AI analysis - in real app this would call Gemini Vision API
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResult = {
      pestDetected: true,
      pestType: 'Brown Planthopper',
      confidence: 87,
      severity: 'Medium',
      recommendations: [
        'Apply neem oil spray immediately',
        'Increase field drainage',
        'Monitor neighboring plots',
        'Consider systemic insecticide if infestation spreads'
      ],
      preventiveMeasures: [
        'Use resistant rice varieties',
        'Maintain proper plant spacing',
        'Regular monitoring of field conditions'
      ]
    };
    
    setAnalysisResult(mockResult);
    setAnalyzing(false);
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
    <div className="space-y-6">
      {/* Image Upload & Analysis */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Bug className="mr-2 text-emerald-600" size={24} />
          Pest Detection & Analysis
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors">
              <Camera className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Crop Image</h3>
              <p className="text-gray-600 mb-4">Take a photo of affected crops for AI analysis</p>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors"
              >
                <Upload size={16} className="mr-2" />
                Choose Image
              </label>
            </div>

            {selectedImage && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Selected:</strong> {selectedImage.name}
                  </p>
                </div>
                
                <button
                  onClick={analyzeImage}
                  disabled={analyzing}
                  className="w-full px-4 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {analyzing ? 'Analyzing Image...' : 'Analyze with AI'}
                </button>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          <div className="space-y-4">
            {analysisResult && (
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{analysisResult.pestType}</p>
                      <p className="text-sm text-gray-600">Confidence: {analysisResult.confidence}%</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(analysisResult.severity)}`}>
                      {analysisResult.severity}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Immediate Actions:</h5>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {analysisResult.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Prevention:</h5>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {analysisResult.preventiveMeasures.map((measure: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {measure}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors">
                    Report to Community
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Community Pest Reports */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="mr-2 text-emerald-600" size={20} />
            Community Pest Reports
          </h3>
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            {pestReports.length} Active Alerts
          </span>
        </div>

        <div className="space-y-4">
          {pestReports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{report.pestType}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                      {report.severity}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {report.location}
                    </div>
                    <p>Crop: {report.crop}</p>
                    <p>Reported by: {report.reportedBy}</p>
                    <p>{report.timestamp}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm">
                    View Details
                  </button>
                  {report.severity === 'High' && (
                    <AlertTriangle size={20} className="text-red-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Pest Map */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Pest Outbreak Map</h3>
        
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-8 text-center">
          <MapPin className="mx-auto text-emerald-600 mb-4" size={48} />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Village Rampur Region</h4>
          <p className="text-gray-600 mb-4">Interactive pest outbreak visualization</p>
          
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="p-3 bg-red-100 rounded-lg border-2 border-red-300">
              <div className="text-xs font-medium text-red-800">High Risk</div>
              <div className="text-xs text-red-600">Sector 12</div>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg border-2 border-amber-300">
              <div className="text-xs font-medium text-amber-800">Medium Risk</div>
              <div className="text-xs text-amber-600">Sector 8</div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg border-2 border-green-300">
              <div className="text-xs font-medium text-green-800">Low Risk</div>
              <div className="text-xs text-green-600">Other Areas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestWatch;