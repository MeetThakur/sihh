import React, { useState } from 'react';
import { Camera, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { analyzeSoilImage, SoilAnalysisResult } from '../utils/soilDetectionService';

interface SoilDetectionProps {
  onSoilTypeDetected: (soilType: string) => void;
  currentSoilType?: string;
}

export const SoilDetection: React.FC<SoilDetectionProps> = ({ 
  onSoilTypeDetected, 
  currentSoilType 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SoilAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeSoilImage(file);
      setAnalysisResult(result);
      onSoilTypeDetected(result.soilType);
    } catch (err) {
      setError('Failed to analyze soil image. Please try again.');
      console.error('Soil analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High Confidence';
    if (confidence >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const getColorInsight = (colorAnalysis: any) => {
    const { organicMatter, fertility, moistureLevel } = colorAnalysis;
    
    if (organicMatter === 'high' && fertility === 'high') {
      return 'Excellent soil with rich organic content - ideal for most crops';
    } else if (organicMatter === 'low' && fertility === 'low') {
      return 'Soil may need organic amendments and fertilizers';
    } else if (moistureLevel === 'dry') {
      return 'Soil appears dry - consider irrigation requirements';
    }
    return 'Soil shows moderate fertility characteristics';
  };

  const getTextureInsight = (textureAnalysis: any) => {
    const { drainage, compaction, porosity } = textureAnalysis;
    
    if (drainage === 'excellent' && porosity === 'high') {
      return 'Great soil structure for root development and water movement';
    } else if (drainage === 'poor' && compaction === 'compacted') {
      return 'Soil may need tillage or organic matter to improve structure';
    } else if (compaction === 'compacted') {
      return 'Consider deep tillage to reduce soil compaction';
    }
    return 'Soil structure appears suitable for cultivation';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Soil Type Detection
        </h3>
      </div>

      <div className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              <label htmlFor="soil-image" className="cursor-pointer text-green-600 hover:text-green-700 font-medium">
                Click to upload
              </label>
              <span> or drag and drop your soil image</span>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG up to 5MB
            </p>
          </div>
          <input
            id="soil-image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isAnalyzing}
          />
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="flex items-center justify-center space-x-2 py-4">
            <Loader2 className="h-5 w-5 animate-spin text-green-600" />
            <span className="text-gray-600">Analyzing soil image...</span>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-900">
                  Detected: {analysisResult.soilType.charAt(0).toUpperCase() + analysisResult.soilType.slice(1)} Soil
                </span>
              </div>
              <div className={`text-sm font-medium ${getConfidenceColor(analysisResult.confidence)}`}>
                {getConfidenceLabel(analysisResult.confidence)} ({analysisResult.confidence}%)
              </div>
            </div>

            {/* Soil Characteristics */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Basic Properties:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>Color: {analysisResult.color}</li>
                <li>Texture: {analysisResult.texture}</li>
                {analysisResult.characteristics.map((char, index) => (
                  <li key={index}>{char}</li>
                ))}
              </ul>
            </div>

            {/* Color Analysis */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Color Analysis:</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <span className="font-medium text-blue-800">Primary Color:</span>
                  <br />{analysisResult.colorAnalysis.primaryColor}
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <span className="font-medium text-green-800">Organic Matter:</span>
                  <br />{analysisResult.colorAnalysis.organicMatter.charAt(0).toUpperCase() + analysisResult.colorAnalysis.organicMatter.slice(1)}
                </div>
                <div className="bg-cyan-50 p-2 rounded">
                  <span className="font-medium text-cyan-800">Moisture Level:</span>
                  <br />{analysisResult.colorAnalysis.moistureLevel.charAt(0).toUpperCase() + analysisResult.colorAnalysis.moistureLevel.slice(1)}
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <span className="font-medium text-yellow-800">Fertility:</span>
                  <br />{analysisResult.colorAnalysis.fertility.charAt(0).toUpperCase() + analysisResult.colorAnalysis.fertility.slice(1)}
                </div>
              </div>
            </div>

            {/* Texture Analysis */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Texture Analysis:</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-purple-50 p-2 rounded">
                  <span className="font-medium text-purple-800">Particle Size:</span>
                  <br />{analysisResult.textureAnalysis.particleSize.charAt(0).toUpperCase() + analysisResult.textureAnalysis.particleSize.slice(1)}
                </div>
                <div className="bg-indigo-50 p-2 rounded">
                  <span className="font-medium text-indigo-800">Drainage:</span>
                  <br />{analysisResult.textureAnalysis.drainage.charAt(0).toUpperCase() + analysisResult.textureAnalysis.drainage.slice(1)}
                </div>
                <div className="bg-pink-50 p-2 rounded">
                  <span className="font-medium text-pink-800">Compaction:</span>
                  <br />{analysisResult.textureAnalysis.compaction.charAt(0).toUpperCase() + analysisResult.textureAnalysis.compaction.slice(1)}
                </div>
                <div className="bg-orange-50 p-2 rounded">
                  <span className="font-medium text-orange-800">Porosity:</span>
                  <br />{analysisResult.textureAnalysis.porosity.charAt(0).toUpperCase() + analysisResult.textureAnalysis.porosity.slice(1)}
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                Soil Insights:
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="bg-white/50 p-2 rounded">
                  <strong>Color Analysis:</strong> {getColorInsight(analysisResult.colorAnalysis)}
                </p>
                <p className="bg-white/50 p-2 rounded">
                  <strong>Texture Analysis:</strong> {getTextureInsight(analysisResult.textureAnalysis)}
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Farming Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Current Selection */}
        {currentSoilType && (
          <div className="text-sm text-gray-600 text-center">
            Current soil type: <span className="font-medium text-green-600">
              {currentSoilType.charAt(0).toUpperCase() + currentSoilType.slice(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilDetection;
