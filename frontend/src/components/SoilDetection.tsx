import React, { useState } from "react";
import {
  Camera,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  analyzeSoilImage,
  SoilAnalysisResult,
} from "../utils/soilDetectionService";

interface SoilDetectionProps {
  onSoilTypeDetected: (soilType: string) => void;
  currentSoilType?: string;
}

export const SoilDetection: React.FC<SoilDetectionProps> = ({
  onSoilTypeDetected,
  currentSoilType,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<SoilAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
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
      setError("Failed to analyze soil image. Please try again.");
      console.error("Soil analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 dark:text-green-400";
    if (confidence >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return "High Confidence";
    if (confidence >= 60) return "Medium Confidence";
    return "Low Confidence";
  };

  const getColorInsight = (colorAnalysis: {
    organicMatter: string;
    fertility: string;
    moistureLevel: string;
  }) => {
    const { organicMatter, fertility, moistureLevel } = colorAnalysis;

    if (organicMatter === "high" && fertility === "high") {
      return "Excellent soil with rich organic content - ideal for most crops";
    } else if (organicMatter === "low" && fertility === "low") {
      return "Soil may need organic amendments and fertilizers";
    } else if (moistureLevel === "dry") {
      return "Soil appears dry - consider irrigation requirements";
    }
    return "Soil shows moderate fertility characteristics";
  };

  const getTextureInsight = (textureAnalysis: {
    drainage: string;
    compaction: string;
    porosity: string;
  }) => {
    const { drainage, compaction, porosity } = textureAnalysis;

    if (drainage === "excellent" && porosity === "high") {
      return "Great soil structure for root development and water movement";
    } else if (drainage === "poor" && compaction === "compacted") {
      return "Soil may need tillage or organic matter to improve structure";
    } else if (compaction === "compacted") {
      return "Consider deep tillage to reduce soil compaction";
    }
    return "Soil structure appears suitable for cultivation";
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-200">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="h-5 w-5 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
          Soil Type Detection
        </h3>
      </div>

      <div className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-6 text-center hover:border-green-500 dark:hover:border-green-400 transition-colors duration-200">
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400 dark:text-dark-400" />
            <div className="text-sm text-gray-600 dark:text-dark-300">
              <label
                htmlFor="soil-image"
                className="cursor-pointer text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors duration-200"
              >
                Click to upload
              </label>
              <span> or drag and drop your soil image</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-dark-400">
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
            <Loader2 className="h-5 w-5 animate-spin text-green-600 dark:text-green-400" />
            <span className="text-gray-600 dark:text-dark-300">
              Analyzing soil image...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md transition-colors duration-200">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-4 space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Detected:{" "}
                  {analysisResult.soilType.charAt(0).toUpperCase() +
                    analysisResult.soilType.slice(1)}{" "}
                  Soil
                </span>
              </div>
              <div
                className={`text-sm font-medium ${getConfidenceColor(analysisResult.confidence)}`}
              >
                {getConfidenceLabel(analysisResult.confidence)} (
                {analysisResult.confidence}%)
              </div>
            </div>

            {/* Soil Characteristics */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                Basic Properties:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-dark-300">
                <li>Color: {analysisResult.color}</li>
                <li>Texture: {analysisResult.texture}</li>
                {analysisResult.characteristics.map((char, index) => (
                  <li key={index}>{char}</li>
                ))}
              </ul>
            </div>

            {/* Color Analysis */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                Color Analysis:
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded transition-colors duration-200">
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    Primary Color:
                  </span>
                  <br />
                  <span className="text-gray-700 dark:text-dark-200">
                    {analysisResult.colorAnalysis.primaryColor}
                  </span>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded transition-colors duration-200">
                  <span className="font-medium text-green-800 dark:text-green-200">
                    Organic Matter:
                  </span>
                  <br />
                  <span className="text-gray-700 dark:text-dark-200">
                    {analysisResult.colorAnalysis.organicMatter
                      .charAt(0)
                      .toUpperCase() +
                      analysisResult.colorAnalysis.organicMatter.slice(1)}
                  </span>
                </div>
                <div className="bg-cyan-50 dark:bg-cyan-900/30 p-2 rounded transition-colors duration-200">
                  <span className="font-medium text-cyan-800 dark:text-cyan-200">
                    Moisture Level:
                  </span>
                  <br />
                  <span className="text-gray-700 dark:text-dark-200">
                    {analysisResult.colorAnalysis.moistureLevel
                      .charAt(0)
                      .toUpperCase() +
                      analysisResult.colorAnalysis.moistureLevel.slice(1)}
                  </span>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded transition-colors duration-200">
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">
                    Fertility:
                  </span>
                  <br />
                  <span className="text-gray-700 dark:text-dark-200">
                    {analysisResult.colorAnalysis.fertility
                      .charAt(0)
                      .toUpperCase() +
                      analysisResult.colorAnalysis.fertility.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Texture Analysis */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                Texture Analysis:
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded transition-colors duration-200">
                  <span className="font-medium text-purple-800 dark:text-purple-200">
                    Particle Size:
                  </span>
                  <br />
                  <span className="text-gray-700 dark:text-dark-200">
                    {analysisResult.textureAnalysis.particleSize
                      .charAt(0)
                      .toUpperCase() +
                      analysisResult.textureAnalysis.particleSize.slice(1)}
                  </span>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded transition-colors duration-200">
                  <span className="font-medium text-indigo-800 dark:text-indigo-200">
                    Drainage:
                  </span>
                  <br />
                  <span className="text-gray-700 dark:text-dark-200">
                    {analysisResult.textureAnalysis.drainage
                      .charAt(0)
                      .toUpperCase() +
                      analysisResult.textureAnalysis.drainage.slice(1)}
                  </span>
                </div>
                <div className="bg-pink-50 dark:bg-pink-900/30 p-2 rounded transition-colors duration-200">
                  <span className="font-medium text-pink-800 dark:text-pink-200">
                    Compaction:
                  </span>
                  <br />
                  <span className="text-gray-700 dark:text-dark-200">
                    {analysisResult.textureAnalysis.compaction
                      .charAt(0)
                      .toUpperCase() +
                      analysisResult.textureAnalysis.compaction.slice(1)}
                  </span>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/30 p-2 rounded transition-colors duration-200">
                  <span className="font-medium text-orange-800 dark:text-orange-200">
                    Porosity:
                  </span>
                  <br />
                  <span className="text-gray-700 dark:text-dark-200">
                    {analysisResult.textureAnalysis.porosity
                      .charAt(0)
                      .toUpperCase() +
                      analysisResult.textureAnalysis.porosity.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700 transition-colors duration-200">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center transition-colors duration-200">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                Soil Insights:
              </h4>
              <div className="space-y-2 text-sm text-gray-700 dark:text-dark-200">
                <p className="bg-white/50 dark:bg-dark-800/50 p-2 rounded transition-colors duration-200">
                  <strong>Color Analysis:</strong>{" "}
                  {getColorInsight(analysisResult.colorAnalysis)}
                </p>
                <p className="bg-white/50 dark:bg-dark-800/50 p-2 rounded transition-colors duration-200">
                  <strong>Texture Analysis:</strong>{" "}
                  {getTextureInsight(analysisResult.textureAnalysis)}
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                Farming Recommendations:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-dark-300">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Current Selection */}
        {currentSoilType && (
          <div className="text-sm text-gray-600 dark:text-dark-300 text-center transition-colors duration-200">
            Current soil type:{" "}
            <span className="font-medium text-green-600 dark:text-green-400">
              {currentSoilType.charAt(0).toUpperCase() +
                currentSoilType.slice(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilDetection;
