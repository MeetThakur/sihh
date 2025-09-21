import React, { useState, useEffect } from "react";
import {
  Map as MapIcon,
  AlertTriangle,
  Edit3,
  X,
  Lightbulb,
  Settings,
  Plus,
  Grid3X3,
  Loader2,
  Save,
  Droplets,
  Leaf,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import farmService, {
  Farm,
  PlotData,
  PlotActivity,
} from "../services/farmService";

interface CropSuggestion {
  name: string;
  suitability: "High" | "Medium" | "Low";
  reason: string;
  expectedYield: string;
  roi: string;
}

interface FarmConfig {
  totalAcres: number;
  plotSizeAcres: number; // This will be calculated automatically
  rows: number;
  cols: number;
}

const FarmVisualization: React.FC = () => {
  const { state } = useAuth();
  const user = state.user;
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"crops" | "health" | "moisture">(
    "crops",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlot, setEditingPlot] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFarmConfig, setShowFarmConfig] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);

  // Farm data state
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [farmConfig, setFarmConfig] = useState<FarmConfig>({
    totalAcres: 2.5,
    plotSizeAcres: 0.16,
    rows: 4,
    cols: 4,
  });

  const [newActivity, setNewActivity] = useState<Partial<PlotActivity>>({
    type: "watering",
    description: "",
    date: new Date().toISOString().split("T")[0],
    cost: 0,
  });

  // Available crops for selection
  const availableCrops = [
    "Empty",
    "Rice",
    "Wheat",
    "Sugarcane",
    "Maize",
    "Mustard",
    "Potato",
    "Onion",
    "Tomato",
    "Cotton",
  ];

  useEffect(() => {
    loadFarms();
  }, []); // loadFarms is defined inside the component and doesn't need to be in deps

  // Update farm config when selected farm changes
  useEffect(() => {
    if (selectedFarm) {
      console.log(
        "Selected farm changed, updating config for:",
        selectedFarm.name,
      );
      updateFarmConfig(selectedFarm);
    }
  }, [selectedFarm]);

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await farmService.getFarms();

      if (response.success && response.data) {
        console.log(
          "✅ Farms loaded from backend:",
          response.data.farms.map((f) => ({
            id: f._id,
            name: f.name,
            totalSize: f.totalSize,
            plotsCount: f.plots.length,
            description: f.description,
          })),
        );
        setFarms(response.data.farms);
        if (response.data.farms.length > 0) {
          const firstFarm = response.data.farms[0];
          console.log("🎯 Setting first farm as selected:", {
            name: firstFarm.name,
            totalSize: firstFarm.totalSize,
            plotsCount: firstFarm.plots.length,
            description: firstFarm.description,
          });
          setSelectedFarm(firstFarm);
        }
      } else {
        setError(response.message || "Failed to load farms");
      }
    } catch (err) {
      console.error("Load farms error:", err);
      setError("Failed to load farm data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateFarmConfig = (farm: Farm) => {
    console.log("🔧 Updating farm config for farm:", {
      name: farm.name,
      id: farm._id,
      totalSize: farm.totalSize,
      plotsCount: farm.plots.length,
      description: farm.description,
    });

    let rows = 4;
    let cols = 4;

    // Try to extract grid configuration from farm description
    if (farm.description) {
      console.log("📝 Parsing farm description:", farm.description);
      const gridMatch = farm.description.match(/Grid: (\d+)x(\d+)/);

      if (gridMatch) {
        rows = parseInt(gridMatch[1]);
        cols = parseInt(gridMatch[2]);
        console.log("✅ Found stored grid config:", { rows, cols });
      } else {
        console.log("❌ No grid config found in description");
      }
    } else {
      console.log("❌ No farm description found");
    }

    // Fallback: infer from actual plot count if no stored config
    if (farm.plots.length > 0 && !farm.description?.includes("Grid:")) {
      console.log(
        "No stored config found, inferring from plot count:",
        farm.plots.length,
      );
      const maxPlotNumber = Math.max(...farm.plots.map((p) => p.plotNumber));

      if (maxPlotNumber <= 16) {
        rows = Math.ceil(Math.sqrt(maxPlotNumber));
        cols = Math.ceil(maxPlotNumber / rows);
      } else {
        // For larger farms, prefer rectangular layouts
        const factors = [];
        for (let i = 1; i <= Math.sqrt(maxPlotNumber); i++) {
          if (maxPlotNumber % i === 0) {
            factors.push([i, maxPlotNumber / i]);
          }
        }
        const bestRatio = factors.reduce(
          (best, [r, c]) => {
            const ratio = Math.max(r, c) / Math.min(r, c);
            const bestCurrentRatio =
              Math.max(best[0], best[1]) / Math.min(best[0], best[1]);
            return ratio < bestCurrentRatio ? [r, c] : best;
          },
          [1, maxPlotNumber],
        );
        [rows, cols] = bestRatio;
      }
    }

    // Calculate plot size based on total farm size and number of plots
    const totalPlots = rows * cols;
    const calculatedPlotSize =
      totalPlots > 0 ? farm.totalSize / totalPlots : 0.16;

    const newConfig = {
      totalAcres: farm.totalSize,
      plotSizeAcres: calculatedPlotSize,
      rows: rows,
      cols: cols,
    };

    console.log("📊 Final farm config being set:", newConfig);
    console.log("🔄 Previous farm config was:", farmConfig);
    setFarmConfig(newConfig);
  };

  const createDefaultFarm = async () => {
    try {
      setLoading(true);
      const userLocation = user?.profile?.location;

      const response = await farmService.createDefaultFarm(userLocation);

      if (response.success && response.data) {
        await loadFarms();
      } else {
        setError(response.message || "Failed to create farm");
      }
    } catch (err) {
      console.error("Create farm error:", err);
      setError("Failed to create farm. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updatePlotCrop = async (plotNumber: number, cropName: string) => {
    if (!selectedFarm) return;

    try {
      const plotData = {
        crop: {
          name: cropName,
          stage:
            cropName === "Empty" ? ("fallow" as const) : ("planted" as const),
          health: "good" as const,
        },
      };

      const response = await farmService.updatePlot(
        selectedFarm._id,
        plotNumber,
        plotData,
      );

      if (response.success) {
        await loadFarms();
        setIsEditing(false);
        setEditingPlot(null);
      } else {
        setError(response.message || "Failed to update plot");
      }
    } catch (err) {
      console.error("Update plot error:", err);
      setError("Failed to update plot. Please try again.");
    }
  };

  const addActivity = async () => {
    if (!selectedFarm || selectedPlot === null || !newActivity.description)
      return;

    try {
      const activity: PlotActivity = {
        type: newActivity.type || "other",
        description: newActivity.description,
        date: newActivity.date || new Date().toISOString(),
        cost: newActivity.cost || 0,
        notes: newActivity.notes || "",
      };

      const response = await farmService.addPlotActivity(
        selectedFarm._id,
        selectedPlot,
        activity,
      );

      if (response.success) {
        await loadFarms();
        setShowActivityForm(false);
        setNewActivity({
          type: "watering",
          description: "",
          date: new Date().toISOString().split("T")[0],
          cost: 0,
        });
      } else {
        setError(response.message || "Failed to add activity");
      }
    } catch (err) {
      console.error("Add activity error:", err);
      setError("Failed to add activity. Please try again.");
    }
  };

  // Save farm configuration and apply changes
  const [savingConfig, setSavingConfig] = useState(false);

  const saveFarmConfiguration = async () => {
    if (!selectedFarm || savingConfig) return;

    try {
      setSavingConfig(true);
      setError(null);

      console.log("Starting farm configuration save...", {
        farmId: selectedFarm._id,
        currentConfig: farmConfig,
        currentFarm: selectedFarm,
      });

      // Validate configuration
      if (farmConfig.rows < 1 || farmConfig.cols < 1) {
        setError("Rows and columns must be at least 1");
        return;
      }

      if (farmConfig.totalAcres <= 0) {
        setError("Total farm size must be greater than 0");
        return;
      }

      // Update the local farm config - calculate plot size from total size and number of plots
      const totalPlots = farmConfig.rows * farmConfig.cols;
      const calculatedPlotSize =
        totalPlots > 0 ? farmConfig.totalAcres / totalPlots : 0.16;

      // Update the farm config with calculated plot size
      const updatedConfig = {
        ...farmConfig,
        plotSizeAcres: calculatedPlotSize,
      };
      setFarmConfig(updatedConfig);

      console.log("Calculated values:", {
        totalPlots,
        totalAcres: farmConfig.totalAcres,
        calculatedPlotSize,
        updatedConfig,
      });

      // Generate new farm data with the updated configuration
      const newFarmData = generateFarmData(
        updatedConfig.rows,
        updatedConfig.cols,
      );
      console.log("Generated new farm data:", newFarmData.slice(0, 3)); // Log first 3 plots

      // Save to backend first
      const baseDescription = selectedFarm.description || "";
      const cleanDescription = baseDescription
        .replace(/Grid: \d+x\d+, PlotSize: [\d.]+/g, "")
        .trim();
      const gridConfig = `Grid: ${updatedConfig.rows}x${updatedConfig.cols}, PlotSize: ${updatedConfig.plotSizeAcres}`;

      const updateData = {
        totalSize: updatedConfig.totalAcres,
        plots: newFarmData,
        description: cleanDescription
          ? `${cleanDescription} ${gridConfig}`
          : `Default farm - ${gridConfig}`,
      };

      console.log("Sending update to backend:", updateData);

      const response = await farmService.updateFarm(
        selectedFarm._id,
        updateData,
      );

      console.log("Backend response:", response);

      if (response.success && response.data) {
        console.log(
          "Farm configuration successfully saved to backend. Updated farm:",
          response.data.farm,
        );

        // Update local state with the response from backend
        const updatedFarm = response.data.farm;
        setSelectedFarm(updatedFarm);

        // Update farms list to reflect changes
        setFarms(
          farms.map((farm) =>
            farm._id === selectedFarm._id ? updatedFarm : farm,
          ),
        );

        // Verify the configuration was saved correctly
        console.log("Verifying saved configuration:", {
          savedDescription: updatedFarm.description,
          savedTotalSize: updatedFarm.totalSize,
          savedPlotsCount: updatedFarm.plots.length,
          expectedConfig: farmConfig,
        });

        setShowFarmConfig(false);

        // Reset selected plot if it no longer exists
        const newTotalPlots = updatedConfig.rows * updatedConfig.cols;
        if (selectedPlot && selectedPlot > newTotalPlots) {
          setSelectedPlot(null);
        }

        // Force reload farms data after a short delay to ensure persistence
        setTimeout(async () => {
          console.log("🔄 Reloading farms to verify persistence...");
          try {
            const reloadResponse = await farmService.getFarms();
            if (reloadResponse.success && reloadResponse.data) {
              const reloadedFarm = reloadResponse.data.farms.find(
                (f) => f._id === selectedFarm._id,
              );
              if (reloadedFarm) {
                console.log("✅ Verified persistence - reloaded farm:", {
                  name: reloadedFarm.name,
                  totalSize: reloadedFarm.totalSize,
                  plotsCount: reloadedFarm.plots.length,
                  description: reloadedFarm.description,
                });
                // Update selected farm with reloaded data
                setSelectedFarm(reloadedFarm);
                setFarms(
                  farms.map((f) =>
                    f._id === reloadedFarm._id ? reloadedFarm : f,
                  ),
                );
              } else {
                console.error("❌ Could not find reloaded farm!");
              }
            }
          } catch (error) {
            console.error("❌ Error during verification reload:", error);
          }
        }, 2000);
      } else {
        console.error("Failed to save farm configuration:", response);
        setError(
          response.message || "Failed to save farm configuration to server",
        );
      }
    } catch (err) {
      console.error("Save configuration error:", err);
      setError("Failed to save farm configuration. Please try again.");
    } finally {
      setSavingConfig(false);
    }
  };

  // Generate farm data based on current farm's plots
  const generateFarmData = (rows: number, cols: number): PlotData[] => {
    const newData: PlotData[] = [];
    const totalPlots = rows * cols;
    const calculatedPlotSize =
      totalPlots > 0 ? farmConfig.totalAcres / totalPlots : 0.16;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const plotNumber = row * cols + col + 1;
        const existingPlot = selectedFarm?.plots.find(
          (plot) => plot.plotNumber === plotNumber,
        );

        newData.push(
          existingPlot
            ? {
                ...existingPlot,
                size: calculatedPlotSize, // Update existing plot size
              }
            : {
                plotNumber,
                size: calculatedPlotSize,
                crop: {
                  name: "Empty",
                  stage: "fallow",
                  health: "good",
                },
                soilHealth: {
                  ph: 7.0,
                  moisture: 50,
                  recommendations: [],
                },
                irrigation: {
                  type: "manual",
                  schedule: {
                    frequency: 2,
                    duration: 30,
                    times: ["06:00", "18:00"],
                  },
                },
                pestAlerts: [],
                activities: [],
                isActive: true,
              },
        );
      }
    }
    return newData;
  };

  // Get plot color based on view mode
  const getPlotColor = (plot: PlotData): string => {
    switch (viewMode) {
      case "crops":
        if (!plot.crop || plot.crop.name === "Empty")
          return "bg-gray-200 border-gray-300";
        return "bg-green-100 border-green-300 hover:bg-green-200";

      case "health":
        if (!plot.crop || plot.crop.name === "Empty")
          return "bg-gray-200 border-gray-300";
        switch (plot.crop.health) {
          case "excellent":
            return "bg-green-200 border-green-400";
          case "good":
            return "bg-green-100 border-green-300";
          case "fair":
            return "bg-yellow-100 border-yellow-300";
          case "poor":
            return "bg-orange-100 border-orange-300";
          case "critical":
            return "bg-red-100 border-red-300";
          default:
            return "bg-gray-200 border-gray-300";
        }

      case "moisture": {
        const moisture = plot.soilHealth.moisture || 0;
        if (moisture >= 70) return "bg-blue-200 border-blue-400";
        if (moisture >= 40) return "bg-blue-100 border-blue-300";
        return "bg-red-100 border-red-300";
      }

      default:
        return "bg-gray-200 border-gray-300";
    }
  };

  // Generate crop suggestions based on plot conditions
  const generateCropSuggestions = (plot: PlotData): CropSuggestion[] => {
    const suggestions: CropSuggestion[] = [];
    const moisture = plot.soilHealth.moisture || 50;
    const ph = plot.soilHealth.ph || 7;

    if (moisture >= 60) {
      suggestions.push({
        name: "Rice",
        suitability: "High",
        reason: "High soil moisture ideal for rice cultivation",
        expectedYield: "40-50 quintals/hectare",
        roi: "₹35,000-45,000",
      });
    }

    if (ph >= 6 && ph <= 7.5) {
      suggestions.push({
        name: "Wheat",
        suitability: "High",
        reason: "Optimal pH range for wheat cultivation",
        expectedYield: "35-45 quintals/hectare",
        roi: "₹40,000-50,000",
      });
    }

    if (moisture <= 40) {
      suggestions.push({
        name: "Mustard",
        suitability: "Medium",
        reason: "Drought tolerant crop suitable for low moisture",
        expectedYield: "15-20 quintals/hectare",
        roi: "₹25,000-35,000",
      });
    }

    return suggestions;
  };

  const farmData = selectedFarm
    ? generateFarmData(farmConfig.rows, farmConfig.cols)
    : [];
  const selectedPlotData =
    selectedPlot !== null
      ? farmData.find((p) => p.plotNumber === selectedPlot)
      : null;
  const cropSuggestions = selectedPlotData
    ? generateCropSuggestions(selectedPlotData)
    : [];

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your farm data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Farm Data Error
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadFarms}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No farms state
  if (farms.length === 0) {
    return (
      <div className="text-center py-12">
        <MapIcon className="h-16 w-16 text-gray-300 mx-auto mb-6" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Farms Found
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Create your first farm to start visualizing and managing your plots,
          crops, and activities.
        </p>
        <button
          onClick={createDefaultFarm}
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Your First Farm
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Farm Visualization
          </h1>
          <p className="text-gray-600">
            Manage your plots and monitor crop health
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Farm Selector */}
          {farms.length > 1 && (
            <select
              value={selectedFarm?._id || ""}
              onChange={(e) => {
                const farm = farms.find((f) => f._id === e.target.value);
                if (farm) {
                  setSelectedFarm(farm);
                  setSelectedPlot(null);
                  setError(null);
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {farms.map((farm) => (
                <option key={farm._id} value={farm._id}>
                  {farm.name} ({farm.totalSize} acres)
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => {
              setError(null);
              setShowFarmConfig(!showFarmConfig);
            }}
            className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md"
            title="Farm Configuration"
          >
            <Settings size={20} />
          </button>

          <button
            onClick={async () => {
              console.log("🔄 Manual refresh triggered");
              setError(null);
              await loadFarms();
            }}
            className="p-2 text-blue-600 hover:text-blue-900 border border-blue-300 rounded-md"
            title="Refresh Farm Data"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Farm Stats */}
      {selectedFarm && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <MapIcon className="text-green-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Total Area</p>
                <p className="font-semibold text-gray-900">
                  {selectedFarm.totalSize} acres
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <Grid3X3 className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Total Plots</p>
                <p className="font-semibold text-gray-900">
                  {selectedFarm.plots.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <Leaf className="text-green-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Active Crops</p>
                <p className="font-semibold text-gray-900">
                  {
                    selectedFarm.plots.filter(
                      (p) => p.crop && p.crop.name !== "Empty",
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-orange-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Alerts</p>
                <p className="font-semibold text-gray-900">
                  {selectedFarm.plots.reduce(
                    (count, plot) =>
                      count +
                      plot.pestAlerts.filter(
                        (alert) => alert.status === "active",
                      ).length,
                    0,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Mode Selector */}
      <div className="flex items-center justify-center space-x-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("crops")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "crops"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Leaf className="w-4 h-4 mr-2 inline" />
            Crops
          </button>
          <button
            onClick={() => setViewMode("health")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "health"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2 inline" />
            Health
          </button>
          <button
            onClick={() => setViewMode("moisture")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "moisture"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Droplets className="w-4 h-4 mr-2 inline" />
            Moisture
          </button>
        </div>
      </div>

      {/* Main Farm View with Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Farm Grid - Takes 2 columns on desktop */}
        <div className="xl:col-span-2">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedFarm?.name || "Farm Layout"}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    isEditing
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-1 inline" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-1 inline" />
                      Edit
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Grid Layout */}
            <div
              className="grid gap-2 max-w-3xl mx-auto"
              style={{
                gridTemplateColumns: `repeat(${farmConfig.cols}, minmax(0, 1fr))`,
              }}
            >
              {farmData.map((plot) => (
                <div
                  key={plot.plotNumber}
                  onClick={() => setSelectedPlot(plot.plotNumber)}
                  className={`
                    aspect-square border-2 rounded-lg cursor-pointer transition-all duration-200
                    flex flex-col items-center justify-center p-2 text-center
                    ${getPlotColor(plot)}
                    ${selectedPlot === plot.plotNumber ? "ring-2 ring-green-500 ring-offset-2" : ""}
                    ${isEditing ? "hover:scale-105" : ""}
                  `}
                >
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    Plot {plot.plotNumber}
                  </div>
                  <div className="text-xs text-gray-600 truncate w-full">
                    {plot.crop?.name || "Empty"}
                  </div>
                  {plot.pestAlerts.some(
                    (alert) => alert.status === "active",
                  ) && (
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plot Details Sidebar - Takes 1 column on desktop, full width on mobile */}
        <div className="xl:col-span-1">
          {selectedPlotData ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-4">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Plot {selectedPlotData.plotNumber}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedPlot(null)}
                      className="p-1 text-gray-400 hover:text-gray-600 xl:hidden"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Crop Information */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 flex items-center mb-3">
                    <Leaf className="w-4 h-4 mr-2 text-green-600" />
                    Crop Details
                  </h4>
                  <div className="space-y-3">
                    {isEditing &&
                    editingPlot === selectedPlotData.plotNumber ? (
                      <select
                        value={selectedPlotData.crop?.name || "Empty"}
                        onChange={(e) =>
                          updatePlotCrop(
                            selectedPlotData.plotNumber,
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        {availableCrops.map((crop) => (
                          <option key={crop} value={crop}>
                            {crop}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-600">Current Crop</p>
                        <p className="font-medium text-gray-900">
                          {selectedPlotData.crop?.name || "No crop planted"}
                        </p>
                        {isEditing && (
                          <button
                            onClick={() =>
                              setEditingPlot(selectedPlotData.plotNumber)
                            }
                            className="mt-2 text-xs text-green-600 hover:text-green-700"
                          >
                            Click to edit crop
                          </button>
                        )}
                      </div>
                    )}

                    {selectedPlotData.crop?.name !== "Empty" && (
                      <div className="space-y-2">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-600">Growth Stage</p>
                          <p className="font-medium text-gray-900 capitalize">
                            {selectedPlotData.crop?.stage.replace("_", " ")}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-600">Health Status</p>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                              selectedPlotData.crop?.health === "excellent"
                                ? "bg-green-100 text-green-800"
                                : selectedPlotData.crop?.health === "good"
                                  ? "bg-green-100 text-green-700"
                                  : selectedPlotData.crop?.health === "fair"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : selectedPlotData.crop?.health === "poor"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-red-100 text-red-800"
                            }`}
                          >
                            {selectedPlotData.crop?.health}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Plot Size Information */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 flex items-center mb-3">
                    <MapIcon className="w-4 h-4 mr-2 text-blue-600" />
                    Plot Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">Plot Size</p>
                      <p className="font-medium text-gray-900">
                        {selectedPlotData.size.toFixed(3)} acres
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">Plot Number</p>
                      <p className="font-medium text-gray-900">
                        #{selectedPlotData.plotNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Soil Health */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 flex items-center mb-3">
                    <TrendingUp className="w-4 h-4 mr-2 text-orange-600" />
                    Soil Health
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-600">pH Level</p>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            selectedPlotData.soilHealth.ph
                              ? selectedPlotData.soilHealth.ph < 6.5
                                ? "bg-red-100 text-red-700"
                                : selectedPlotData.soilHealth.ph > 7.5
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {selectedPlotData.soilHealth.ph
                            ? selectedPlotData.soilHealth.ph < 6.5
                              ? "Acidic"
                              : selectedPlotData.soilHealth.ph > 7.5
                                ? "Alkaline"
                                : "Optimal"
                            : "Unknown"}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {selectedPlotData.soilHealth.ph?.toFixed(1) || "7.0"}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-600">Moisture Level</p>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            (selectedPlotData.soilHealth.moisture || 50) >= 70
                              ? "bg-blue-100 text-blue-700"
                              : (selectedPlotData.soilHealth.moisture || 50) >=
                                  40
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {(selectedPlotData.soilHealth.moisture || 50) >= 70
                            ? "High"
                            : (selectedPlotData.soilHealth.moisture || 50) >= 40
                              ? "Good"
                              : "Low"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              (selectedPlotData.soilHealth.moisture || 50) >= 70
                                ? "bg-blue-500"
                                : (selectedPlotData.soilHealth.moisture ||
                                      50) >= 40
                                  ? "bg-green-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${selectedPlotData.soilHealth.moisture || 50}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedPlotData.soilHealth.moisture || 50}%
                        </span>
                      </div>
                    </div>

                    {selectedPlotData.soilHealth.nitrogen !== undefined && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-600">Nitrogen (N)</p>
                        <p className="font-medium text-gray-900">
                          {selectedPlotData.soilHealth.nitrogen} ppm
                        </p>
                      </div>
                    )}

                    {selectedPlotData.soilHealth.lastTested && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-600">Last Tested</p>
                        <p className="font-medium text-gray-900">
                          {new Date(
                            selectedPlotData.soilHealth.lastTested,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Irrigation */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 flex items-center mb-3">
                    <Droplets className="w-4 h-4 mr-2 text-blue-600" />
                    Irrigation
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">System Type</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {selectedPlotData.irrigation.type || "Manual"}
                      </p>
                    </div>

                    {selectedPlotData.irrigation.schedule && (
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                        <p className="text-sm text-blue-700 font-medium mb-2">
                          Watering Schedule
                        </p>
                        <div className="space-y-1">
                          <p className="text-xs text-blue-600">
                            <strong>Frequency:</strong>{" "}
                            {selectedPlotData.irrigation.schedule.frequency}x
                            per week
                          </p>
                          <p className="text-xs text-blue-600">
                            <strong>Duration:</strong>{" "}
                            {selectedPlotData.irrigation.schedule.duration}{" "}
                            minutes
                          </p>
                          {selectedPlotData.irrigation.schedule.times && (
                            <p className="text-xs text-blue-600">
                              <strong>Times:</strong>{" "}
                              {selectedPlotData.irrigation.schedule.times.join(
                                ", ",
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedPlotData.irrigation.lastWatered && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-600">Last Watered</p>
                        <p className="font-medium text-gray-900">
                          {new Date(
                            selectedPlotData.irrigation.lastWatered,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pest Alerts */}
                {selectedPlotData.pestAlerts.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 flex items-center mb-3">
                      <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                      Active Alerts (
                      {
                        selectedPlotData.pestAlerts.filter(
                          (alert) => alert.status === "active",
                        ).length
                      }
                      )
                    </h4>
                    <div className="space-y-2">
                      {selectedPlotData.pestAlerts
                        .filter((alert) => alert.status === "active")
                        .slice(0, 3)
                        .map((alert, index) => (
                          <div
                            key={index}
                            className="bg-red-50 border border-red-200 p-3 rounded-md"
                          >
                            <p className="text-sm font-medium text-red-800 capitalize">
                              {alert.type}
                            </p>
                            <p className="text-xs text-red-600">
                              Severity: {alert.severity}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowActivityForm(true)}
                    className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Activity
                  </button>
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center justify-center"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Get Suggestions
                  </button>
                </div>

                {/* Empty State for Plot Details */}
                {!selectedPlotData.crop ||
                selectedPlotData.crop.name === "Empty" ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Leaf className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-2">Empty Plot</p>
                    <p className="text-xs text-gray-400 mb-4">
                      This plot is ready for planting
                    </p>
                    {isEditing && (
                      <button
                        onClick={() =>
                          setEditingPlot(selectedPlotData.plotNumber)
                        }
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                      >
                        Select Crop
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            /* No Plot Selected State */
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid3X3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a Plot
              </h3>
              <p className="text-gray-500 mb-4">
                Click on any plot in the farm grid to view its details and
                manage crops
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• View crop information and health status</p>
                <p>• Add activities and track progress</p>
                <p>• Get AI-powered crop suggestions</p>
                <p>• Monitor soil health and irrigation</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activity Form Modal */}
      {showActivityForm && selectedPlot !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Activity - Plot {selectedPlot}
              </h3>
              <button
                onClick={() => setShowActivityForm(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Type
                </label>
                <select
                  value={newActivity.type}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      type: e.target.value as PlotActivity["type"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="planting">Planting</option>
                  <option value="watering">Watering</option>
                  <option value="fertilizing">Fertilizing</option>
                  <option value="pesticide">Pesticide Application</option>
                  <option value="weeding">Weeding</option>
                  <option value="harvesting">Harvesting</option>
                  <option value="soil_test">Soil Testing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Describe the activity..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newActivity.date}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={newActivity.cost}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        cost: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                    step="10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={newActivity.notes}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowActivityForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={addActivity}
                disabled={!newActivity.description}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-1 inline" />
                Add Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crop Suggestions Panel */}
      {showSuggestions && selectedPlotData && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Crop Suggestions for Plot {selectedPlotData.plotNumber}
            </h3>
            <button
              onClick={() => setShowSuggestions(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cropSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer"
                onClick={() => {
                  if (isEditing) {
                    updatePlotCrop(
                      selectedPlotData.plotNumber,
                      suggestion.name,
                    );
                    setShowSuggestions(false);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">
                    {suggestion.name}
                  </h5>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      suggestion.suitability === "High"
                        ? "bg-green-100 text-green-800"
                        : suggestion.suitability === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {suggestion.suitability}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {suggestion.reason}
                </p>
                <div className="space-y-1 text-xs text-gray-500">
                  <p>
                    <strong>Expected Yield:</strong> {suggestion.expectedYield}
                  </p>
                  <p>
                    <strong>ROI:</strong> {suggestion.roi}
                  </p>
                </div>
                {isEditing && (
                  <button className="mt-3 w-full px-3 py-2 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200">
                    Plant {suggestion.name}
                  </button>
                )}
              </div>
            ))}
          </div>

          {cropSuggestions.length === 0 && (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No specific suggestions available</p>
              <p className="text-sm text-gray-400">
                Consider updating soil health data for better recommendations
              </p>
            </div>
          )}
        </div>
      )}

      {/* Farm Configuration Modal */}
      {showFarmConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Farm Configuration
              </h3>
              <button
                onClick={() => !savingConfig && setShowFarmConfig(false)}
                disabled={savingConfig}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Farm Size (acres)
                </label>
                <input
                  type="number"
                  value={farmConfig.totalAcres}
                  onChange={(e) =>
                    setFarmConfig({
                      ...farmConfig,
                      totalAcres: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  step="0.1"
                  min="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plot Size (calculated)
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600">
                  {(
                    farmConfig.totalAcres /
                    (farmConfig.rows * farmConfig.cols)
                  ).toFixed(3)}{" "}
                  acres each
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Automatically calculated from total farm size ÷ number of
                  plots
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rows
                  </label>
                  <input
                    type="number"
                    value={farmConfig.rows}
                    onChange={(e) =>
                      setFarmConfig({
                        ...farmConfig,
                        rows: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Columns
                  </label>
                  <input
                    type="number"
                    value={farmConfig.cols}
                    onChange={(e) =>
                      setFarmConfig({
                        ...farmConfig,
                        cols: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Total Plots:</strong>{" "}
                  {farmConfig.rows * farmConfig.cols}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Plot Size:</strong>{" "}
                  {(
                    farmConfig.totalAcres /
                    (farmConfig.rows * farmConfig.cols)
                  ).toFixed(3)}{" "}
                  acres each
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Total Area:</strong>{" "}
                  {farmConfig.totalAcres.toFixed(2)} acres
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setError(null);
                  setShowFarmConfig(false);
                  // Restore original config if canceled
                  if (selectedFarm) {
                    updateFarmConfig(selectedFarm);
                  }
                }}
                disabled={savingConfig}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={saveFarmConfiguration}
                disabled={savingConfig}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {savingConfig ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Configuration"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {viewMode === "crops" && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
                <span className="text-gray-600">Empty Plot</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-gray-600">Planted</span>
              </div>
            </>
          )}

          {viewMode === "health" && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                <span className="text-gray-600">Excellent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-gray-600">Good</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span className="text-gray-600">Fair</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
                <span className="text-gray-600">Poor</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-gray-600">Critical</span>
              </div>
            </>
          )}

          {viewMode === "moisture" && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                <span className="text-gray-600">High (70%+)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                <span className="text-gray-600">Medium (40-70%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-gray-600">Low (&lt;40%)</span>
              </div>
            </>
          )}

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Pest Alert</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmVisualization;
