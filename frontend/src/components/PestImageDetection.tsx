import React, { useState } from 'react';
import { Upload, Loader2, AlertCircle, Bug, Shield, Clock } from 'lucide-react';
import { analyzePestImage, PestAnalysisResult } from '../utils/pestDetectionService';

interface PestImageDetectionProps {
  onPestDetected?: (pestData: PestAnalysisResult) => void;
}

export const PestImageDetection: React.FC<PestImageDetectionProps> = ({ onPestDetected }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PestAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    // Show image preview
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzePestImage(file);
      setAnalysisResult(result);
      if (onPestDetected) {
        onPestDetected(result);
      }
    } catch (err) {
      setError('Failed to analyze pest image. Please try again.');
      console.error('Pest analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Immediate': return 'text-red-700 bg-red-100';
      case 'Within 24 hours': return 'text-orange-700 bg-orange-100';
      case 'Within a week': return 'text-yellow-700 bg-yellow-100';
      case 'Monitor': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Bug className="h-5 w-5 text-red-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Pest Image Detection
        </h3>
      </div>

      <div className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              <label htmlFor="pest-image" className="cursor-pointer text-red-600 hover:text-red-700 font-medium">
                Click to upload
              </label>
              <span> or drag and drop your pest/damage image</span>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG up to 5MB - Focus on affected plant parts
            </p>
          </div>
          <input
            id="pest-image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isAnalyzing}
          />
        </div>

        {/* Image Preview */}
        {uploadedImage && (
          <div className="flex justify-center">
            <img 
              src={uploadedImage} 
              alt="Uploaded pest image" 
              className="max-w-64 max-h-48 object-contain rounded-lg border"
            />
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="flex items-center justify-center space-x-2 py-4">
            <Loader2 className="h-5 w-5 animate-spin text-red-600" />
            <span className="text-gray-600">Analyzing pest image...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            {/* Pest Identification */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bug className="h-5 w-5 text-red-600" />
                <span className="font-medium text-gray-900">
                  {analysisResult.pestType}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-600">
                Confidence: {analysisResult.confidence}%
              </div>
            </div>

            {/* Severity and Urgency */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg border ${getSeverityColor(analysisResult.severity)}`}>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Severity: {analysisResult.severity}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${getUrgencyColor(analysisResult.urgencyLevel)}`}>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{analysisResult.urgencyLevel}</span>
                </div>
              </div>
            </div>

            {/* Pest Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Pest Details:</h4>
              <div className="bg-white p-3 rounded border space-y-2 text-sm">
                <p><strong>Scientific Name:</strong> {analysisResult.pestDetails.scientificName}</p>
                <p><strong>Common Names:</strong> {analysisResult.pestDetails.commonNames.join(', ')}</p>
                <p><strong>Damage Type:</strong> {analysisResult.pestDetails.damageType}</p>
                <p><strong>Lifecycle:</strong> {analysisResult.pestDetails.lifecycle}</p>
              </div>
            </div>

            {/* Characteristics */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Observed Characteristics:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {analysisResult.characteristics.map((char, index) => (
                  <li key={index}>{char}</li>
                ))}
              </ul>
            </div>

            {/* Treatments */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-600" />
                Treatment Options:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {analysisResult.treatments.map((treatment, index) => (
                  <li key={index}>{treatment}</li>
                ))}
              </ul>
            </div>

            {/* Preventive Measures */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Prevention Strategies:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {analysisResult.preventiveMeasures.map((measure, index) => (
                  <li key={index}>{measure}</li>
                ))}
              </ul>
            </div>

            {/* Affected Crops */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Commonly Affected Crops:</h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.affectedCrops.map((crop, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PestImageDetection;
