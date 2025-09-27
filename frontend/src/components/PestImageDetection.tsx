import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  AlertCircle,
  Bug,
  Shield,
  Clock,
  Camera,
  X,
  CheckCircle,
  TrendingUp,
  Zap,
  Target,
  ChevronDown,
  Eye,
  Cpu,
} from "lucide-react";
import {
  analyzePestImage,
  PestAnalysisResult,
} from "../utils/pestDetectionService";

interface PestImageDetectionProps {
  onPestDetected?: (pestData: PestAnalysisResult) => void;
}

export const PestImageDetection: React.FC<PestImageDetectionProps> = ({
  onPestDetected,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<PestAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [detectionMode, setDetectionMode] = useState("advanced");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectionOptions = [
    {
      id: "advanced",
      label: "Advanced Detection",
      icon: Cpu,
      description: "High accuracy AI analysis",
    },
    {
      id: "quick",
      label: "Quick Scan",
      icon: Zap,
      description: "Fast basic detection",
    },
    {
      id: "detailed",
      label: "Detailed Analysis",
      icon: Eye,
      description: "Comprehensive pest report",
    },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDropdown && !target.closest("[data-dropdown]")) {
        setShowDropdown(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showDropdown) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showDropdown]);

  const processFile = async (file: File) => {
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
      setError("Failed to analyze pest image. Please try again.");
      console.error("Pest analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "High":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Immediate":
        return "text-red-700 bg-red-100";
      case "Within 24 hours":
        return "text-orange-700 bg-orange-100";
      case "Within a week":
        return "text-yellow-700 bg-yellow-100";
      case "Monitor":
        return "text-blue-700 bg-blue-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <Camera className="h-6 w-6 text-red-600 mr-3" />
              AI-Powered Pest Detection
            </h3>

            {/* Detection Mode Dropdown */}
            <div className="relative z-50 w-full sm:w-auto" data-dropdown>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-between gap-2 px-3 py-2 w-full sm:w-auto bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {detectionOptions.find((opt) => opt.id === detectionMode)
                  ?.icon &&
                  React.createElement(
                    detectionOptions.find((opt) => opt.id === detectionMode)!
                      .icon,
                    { className: "w-4 h-4" },
                  )}
                <span>
                  {
                    detectionOptions.find((opt) => opt.id === detectionMode)
                      ?.label
                  }
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showDropdown && (
                <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[100]">
                  <div className="py-2">
                    {detectionOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setDetectionMode(option.id);
                          setShowDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          detectionMode === option.id
                            ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <option.icon
                            className={`w-5 h-5 mt-0.5 ${detectionMode === option.id ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}
                          />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Upload crop images for instant pest identification and treatment
            recommendations
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">95%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Accuracy
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">2.5s</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Avg Time
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 overflow-visible relative">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive
              ? "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600"
              : uploadedImage
                ? "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
          } ${isAnalyzing ? "pointer-events-none opacity-60" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            {!uploadedImage ? (
              <>
                <div
                  className={`p-4 rounded-full ${dragActive ? "bg-red-100 dark:bg-red-900/30" : "bg-gray-100 dark:bg-gray-700"}`}
                >
                  <Upload
                    className={`h-8 w-8 ${dragActive ? "text-red-600" : "text-gray-400 dark:text-gray-500"}`}
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {dragActive ? "Drop your image here" : "Upload Pest Image"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="pest-image"
                      className="cursor-pointer text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                    >
                      Click to browse
                    </label>
                    <span> or drag and drop your image</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Supports PNG, JPG up to 5MB • Best results with clear,
                    well-lit images
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                  <div className="flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    High Accuracy
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    Instant Results
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Secure Processing
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-lg font-medium text-green-700">
                  Image uploaded successfully!
                </div>
                <button
                  onClick={clearImage}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center mx-auto"
                >
                  <X className="w-4 h-4 mr-2" />
                  Upload Different Image
                </button>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
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
          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Uploaded pest image"
                  className="max-w-80 max-h-64 object-contain rounded-xl border-2 border-gray-200 shadow-sm"
                />
                <button
                  onClick={clearImage}
                  className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-full p-1.5 shadow-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-red-200 dark:border-red-800 rounded-full animate-spin border-t-red-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Bug className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Analyzing Pest Image...
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Our AI is examining the image for pest identification...
                </div>
                <div className="flex items-center justify-center space-x-6 text-xs text-gray-400 dark:text-gray-500 mt-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Detecting patterns
                  </div>
                  <div className="flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    Identifying species
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Analyzing severity
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-red-800 dark:text-red-300 mb-1">
                  Analysis Failed
                </div>
                <div className="text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
                <button
                  onClick={clearImage}
                  className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-800 dark:text-red-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {analysisResult.pestType}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Analysis completed successfully
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {analysisResult.confidence}%
                  </div>
                  <div className="text-xs text-gray-500">Confidence</div>
                </div>
              </div>

              {/* Severity and Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-xl border-2 ${getSeverityColor(analysisResult.severity)}`}
                >
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5" />
                    <div>
                      <div className="font-semibold">Severity Level</div>
                      <div className="text-sm opacity-90">
                        {analysisResult.severity}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl border-2 ${getUrgencyColor(analysisResult.urgencyLevel)}`}
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5" />
                    <div>
                      <div className="font-semibold">Action Required</div>
                      <div className="text-sm opacity-90">
                        {analysisResult.urgencyLevel}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Information Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pest Details */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <Bug className="h-5 w-5 mr-2 text-red-600" />
                  Pest Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Scientific Name:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {analysisResult.pestDetails.scientificName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Common Names:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {analysisResult.pestDetails.commonNames.join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Damage Type:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {analysisResult.pestDetails.damageType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Lifecycle:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {analysisResult.pestDetails.lifecycle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Characteristics */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Observed Symptoms
                </h4>
                <ul className="space-y-2 text-sm">
                  {analysisResult.characteristics.map((char, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {char}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Treatment Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Recommended Treatments
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.treatments.map((treatment, index) => (
                  <div
                    key={index}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4"
                  >
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {treatment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prevention Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-purple-600" />
                Prevention Strategies
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.preventiveMeasures.map((measure, index) => (
                  <div
                    key={index}
                    className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4"
                  >
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {measure}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Affected Crops */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4">
                Commonly Affected Crops
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.affectedCrops.map((crop, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full font-medium"
                  >
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
