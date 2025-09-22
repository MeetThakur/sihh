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
  CheckSquare,
  Square,
  Users,
  Trash2,
  BarChart3,
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

  // Bulk operations state
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedPlots, setSelectedPlots] = useState<Set<number>>(new Set());
  const [bulkCropSelection, setBulkCropSelection] = useState("");
  const [bulkOperationLoading, setBulkOperationLoading] = useState(false);

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

  const updateFarmConfig = (farm: Farm) => {
    let rows = 4;
    let cols = 4;

    // Try to extract grid configuration from farm description
    if (farm.description) {
      const gridMatch = farm.description.match(/Grid: (\d+)x(\d+)/);
      if (gridMatch) {
        rows = parseInt(gridMatch[1]);
        cols = parseInt(gridMatch[2]);
      }
    }

    // Fallback: infer from actual plot count if no stored config
    if (farm.plots.length > 0 && !farm.description?.includes("Grid:")) {
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

        if (factors.length > 0) {
          // Find the most rectangular factor (closest to square but prefer wider)
          const bestFactor = factors.reduce((prev, current) => {
            const [prevRows, prevCols] = prev;
            const [currentRows, currentCols] = current;
            const prevRatio =
              Math.max(prevRows, prevCols) / Math.min(prevRows, prevCols);
            const currentRatio =
              Math.max(currentRows, currentCols) /
              Math.min(currentRows, currentCols);
            return currentRatio < prevRatio ? current : prev;
          });
          [rows, cols] = bestFactor;
        }
      }
    }

    // Calculate plot size based on total farm size and number of plots
    const totalPlots = rows * cols;
    const calculatedPlotSize =
      totalPlots > 0 ? farm.totalSize / totalPlots : 0.16;

    const newConfig = {
      rows,
      cols,
      totalAcres: farm.totalSize,
      plotSizeAcres: calculatedPlotSize,
    };

    setFarmConfig(newConfig);
  };

  useEffect(() => {
    loadFarms();
  }, []); // loadFarms is defined inside the component and doesn't need to be in deps

  // Update farm config when selected farm changes
  useEffect(() => {
    if (selectedFarm) {
      updateFarmConfig(selectedFarm);
    }
  }, [selectedFarm]);

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await farmService.getFarms();

      if (response.success && response.data) {
        setFarms(response.data.farms);
        if (response.data.farms.length > 0) {
          const firstFarm = response.data.farms[0];
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

  // Bulk operation functions
  const toggleBulkSelectMode = () => {
    setBulkSelectMode(!bulkSelectMode);
    setSelectedPlots(new Set());
    if (bulkSelectMode) {
      setSelectedPlot(null);
    }
  };

  const togglePlotSelection = (plotNumber: number) => {
    if (!bulkSelectMode) return;

    // Ensure plotNumber is an integer
    const intPlotNumber = parseInt(String(plotNumber), 10);

    if (!Number.isInteger(intPlotNumber) || intPlotNumber < 1) {
      console.error("Invalid plot number:", plotNumber, "->", intPlotNumber);
      return;
    }

    console.log("Plot selection:", intPlotNumber, typeof intPlotNumber);

    const newSelectedPlots = new Set(selectedPlots);
    if (newSelectedPlots.has(intPlotNumber)) {
      newSelectedPlots.delete(intPlotNumber);
    } else {
      newSelectedPlots.add(intPlotNumber);
    }

    setSelectedPlots(newSelectedPlots);
  };

  const selectAllPlots = () => {
    if (!selectedFarm) return;

    // Convert all plot numbers to guaranteed integers
    const integerPlotNumbers = selectedFarm.plots
      .map((plot) => Math.floor(Number(plot.plotNumber)))
      .filter((n) => Number.isInteger(n) && n > 0);

    setSelectedPlots(new Set(integerPlotNumbers));
  };

  const clearPlotSelection = () => {
    setSelectedPlots(new Set());
  };

  const bulkPlantCrop = async () => {
    if (!selectedFarm || selectedPlots.size === 0 || !bulkCropSelection) return;

    try {
      setBulkOperationLoading(true);
      setError(null);

      const plotNumbers = Array.from(selectedPlots);

      // Ensure all plot numbers are valid integers
      const validPlotNumbers = plotNumbers
        .map((num) => Math.floor(Number(num)))
        .filter((num) => Number.isInteger(num) && num > 0);

      if (validPlotNumbers.length === 0) {
        setError("Invalid plot numbers selected");
        return;
      }

      // Calculate expected harvest date (3 months from now as default)
      const plantedDate = new Date();
      const expectedHarvestDate = new Date();
      expectedHarvestDate.setMonth(expectedHarvestDate.getMonth() + 3);

      const cropData = {
        crop: {
          name: bulkCropSelection,
          variety: "",
          plantedDate: plantedDate.toISOString(),
          expectedHarvestDate: expectedHarvestDate.toISOString(),
          stage: "planted" as const,
          health: "good" as const,
        },
      };

      const response = await farmService.bulkUpdatePlots(
        selectedFarm._id,
        validPlotNumbers,
        cropData,
      );

      if (response.success) {
        await loadFarms();
        setSelectedPlots(new Set());
        setBulkCropSelection("");
        setBulkSelectMode(false);
      } else {
        console.error("Bulk planting failed:", response);
        console.error("Full error details:", JSON.stringify(response, null, 2));
        if (response.errors && Array.isArray(response.errors)) {
          console.error("Individual errors:", response.errors);
          const errorMessages = response.errors
            .map((err) => err.msg || err.message)
            .join(", ");
          setError(`Validation failed: ${errorMessages}`);
        } else {
          setError(response.message || "Failed to plant crops in bulk");
        }
      }
    } catch (err) {
      console.error("Bulk plant crop error:", err);
      setError("Failed to plant crops in bulk. Please try again.");
    } finally {
      setBulkOperationLoading(false);
    }
  };

  const bulkClearPlots = async () => {
    if (!selectedFarm || selectedPlots.size === 0) return;

    try {
      setBulkOperationLoading(true);
      setError(null);

      const plotNumbers = Array.from(selectedPlots);

      // Ensure all plot numbers are valid integers
      const validPlotNumbers = plotNumbers
        .map((num) => Math.floor(Number(num)))
        .filter((num) => Number.isInteger(num) && num > 0);

      if (validPlotNumbers.length === 0) {
        setError("Invalid plot numbers selected");
        return;
      }

      const response = await farmService.bulkClearPlots(
        selectedFarm._id,
        validPlotNumbers,
      );

      if (response.success) {
        await loadFarms();
        setSelectedPlots(new Set());
        setBulkSelectMode(false);
      } else {
        console.error("Bulk clearing failed:", response);
        console.error("Full error details:", JSON.stringify(response, null, 2));
        if (response.errors && Array.isArray(response.errors)) {
          console.error("Individual errors:", response.errors);
          const errorMessages = response.errors
            .map((err) => err.msg || err.message)
            .join(", ");
          setError(`Validation failed: ${errorMessages}`);
        } else {
          setError(response.message || "Failed to clear plots in bulk");
        }
      }
    } catch (err) {
      console.error("Bulk clear plots error:", err);
      setError("Failed to clear plots in bulk. Please try again.");
    } finally {
      setBulkOperationLoading(false);
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
        const existingPlot = selectedFarm?.plots.find((plot) => {
          const backendPlotNumber = Math.floor(Number(plot.plotNumber));
          return backendPlotNumber === plotNumber;
        });

        newData.push(
          existingPlot
            ? {
                ...existingPlot,
                plotNumber: Math.floor(Number(existingPlot.plotNumber)),
                size: calculatedPlotSize,
              }
            : {
                plotNumber: plotNumber,
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

  // Crop color mapping for different crop types
  const getCropColor = (cropName: string): string => {
    const cropColors: { [key: string]: string } = {
      // Grains
      Rice: "bg-yellow-100 border-yellow-400 hover:bg-yellow-200",
      Wheat: "bg-amber-100 border-amber-400 hover:bg-amber-200",
      Corn: "bg-yellow-200 border-yellow-500 hover:bg-yellow-300",
      Barley: "bg-orange-100 border-orange-400 hover:bg-orange-200",
      Millet: "bg-yellow-50 border-yellow-300 hover:bg-yellow-100",

      // Vegetables
      Tomato: "bg-red-100 border-red-400 hover:bg-red-200",
      Potato: "bg-amber-50 border-amber-300 hover:bg-amber-100",
      Onion: "bg-purple-100 border-purple-400 hover:bg-purple-200",
      Carrot: "bg-orange-200 border-orange-500 hover:bg-orange-300",
      Cabbage: "bg-green-100 border-green-400 hover:bg-green-200",
      Lettuce: "bg-green-50 border-green-300 hover:bg-green-100",
      Spinach: "bg-emerald-100 border-emerald-400 hover:bg-emerald-200",
      Broccoli: "bg-green-200 border-green-500 hover:bg-green-300",
      Cauliflower: "bg-gray-100 border-gray-400 hover:bg-gray-200",
      "Bell Pepper": "bg-red-50 border-red-300 hover:bg-red-100",
      Cucumber: "bg-green-50 border-green-200 hover:bg-green-100",
      Eggplant: "bg-purple-200 border-purple-500 hover:bg-purple-300",

      // Legumes
      Soybean: "bg-lime-100 border-lime-400 hover:bg-lime-200",
      Peas: "bg-green-100 border-green-300 hover:bg-green-200",
      Beans: "bg-emerald-50 border-emerald-300 hover:bg-emerald-100",
      Lentils: "bg-orange-50 border-orange-300 hover:bg-orange-100",
      Chickpeas: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",

      // Fruits
      Strawberry: "bg-pink-100 border-pink-400 hover:bg-pink-200",
      Watermelon: "bg-green-200 border-green-400 hover:bg-green-300",
      Pumpkin: "bg-orange-200 border-orange-400 hover:bg-orange-300",
      Melon: "bg-green-100 border-green-300 hover:bg-green-200",

      // Cash crops
      Cotton: "bg-white border-gray-300 hover:bg-gray-50",
      Sugarcane: "bg-green-300 border-green-600 hover:bg-green-400",
      Tobacco: "bg-amber-200 border-amber-500 hover:bg-amber-300",

      // Herbs & Spices
      Basil: "bg-green-100 border-green-300 hover:bg-green-200",
      Mint: "bg-green-50 border-green-200 hover:bg-green-100",
      Cilantro: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
      Parsley: "bg-green-100 border-green-200 hover:bg-green-200",

      // Oilseeds
      Sunflower: "bg-yellow-200 border-yellow-500 hover:bg-yellow-300",
      Mustard: "bg-yellow-100 border-yellow-300 hover:bg-yellow-200",
      Sesame: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    };

    return (
      cropColors[cropName] || "bg-blue-100 border-blue-400 hover:bg-blue-200"
    );
  };

  // Get plot color based on view mode
  const getPlotColor = (plot: PlotData): string => {
    switch (viewMode) {
      case "crops":
        if (!plot.crop || plot.crop.name === "Empty")
          return "bg-gray-200 border-gray-300";
        return getCropColor(plot.crop.name);

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

          <button
            onClick={async () => {
              console.log("🧪 Testing plot number validation:");
              const plotNumbers = Array.from(selectedPlots);
              console.log("- selectedPlots Set:", selectedPlots);
              console.log("- Array from Set:", plotNumbers);
              console.log(
                "- Types:",
                plotNumbers.map((n) => typeof n),
              );
              console.log(
                "- All integers?",
                plotNumbers.every((n) => Number.isInteger(n)),
              );
              console.log(
                "- All positive?",
                plotNumbers.every((n) => n > 0),
              );

              const testData = {
                plotNumbers: plotNumbers,
              };
              console.log("- Test JSON:", JSON.stringify(testData));

              // Call test endpoint
              try {
                const response = await fetch("/api/farms/test-plot-numbers", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify(testData),
                });
                const result = await response.json();
                console.log("🧪 Test endpoint response:", result);
              } catch (error) {
                console.error("🧪 Test endpoint error:", error);
              }
            }}
            className="p-2 text-purple-600 hover:text-purple-900 border border-purple-300 rounded-md"
            title="Test Plot Numbers"
          >
            🧪
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {selectedFarm?.name}
        </h1>

        {/* View Mode Selector */}
        <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
          <button
            onClick={() => setViewMode("crops")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "crops"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
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
            Moisture
          </button>
        </div>
      </div>

      {/* Crop Distribution Statistics */}
      <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <BarChart3 className="w-4 h-4 mr-2" />
          Farm Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(() => {
            const cropCounts =
              selectedFarm?.plots.reduce(
                (acc, plot) => {
                  const cropName = plot.crop?.name || "Empty";
                  acc[cropName] = (acc[cropName] || 0) + 1;
                  return acc;
                },
                {} as Record<string, number>,
              ) || {};

            const totalPlots = selectedFarm?.plots.length || 0;

            return Object.entries(cropCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([cropName, count]) => (
                <div key={cropName} className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <div
                      className={`w-3 h-3 rounded border ${
                        cropName === "Empty"
                          ? "bg-gray-200 border-gray-300"
                          : getCropColor(cropName)
                              .split(" ")
                              .slice(0, 2)
                              .join(" ")
                      }`}
                    ></div>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {count}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {cropName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {((count / totalPlots) * 100).toFixed(0)}%
                  </div>
                </div>
              ));
          })()}
        </div>
      </div>

      {/* Legends - Show different legends based on view mode */}
      <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
        {viewMode === "crops" && (
          <>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Leaf className="w-4 h-4 mr-2" />
              Crop Color Legend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
              {(() => {
                const activeCrops =
                  selectedFarm?.plots
                    ?.filter((plot) => plot.crop && plot.crop.name !== "Empty")
                    ?.map((plot) => plot.crop!.name)
                    ?.filter((crop, index, arr) => arr.indexOf(crop) === index)
                    ?.sort() || [];

                return activeCrops.map((cropName) => (
                  <div
                    key={cropName}
                    className="flex items-center space-x-2 min-w-0"
                  >
                    <div
                      className={`w-4 h-4 rounded border-2 flex-shrink-0 ${getCropColor(cropName).split(" ").slice(0, 2).join(" ")}`}
                    ></div>
                    <span className="text-xs text-gray-600 truncate">
                      {cropName}
                    </span>
                  </div>
                ));
              })()}
              {selectedFarm?.plots.some(
                (plot) => !plot.crop || plot.crop.name === "Empty",
              ) && (
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-4 h-4 rounded border-2 bg-gray-200 border-gray-300 flex-shrink-0"></div>
                  <span className="text-xs text-gray-600">Empty</span>
                </div>
              )}
            </div>
          </>
        )}

        {viewMode === "health" && (
          <>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Plant Health Legend
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border-2 bg-green-200 border-green-400"></div>
                <span className="text-xs text-gray-600">Excellent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border-2 bg-green-100 border-green-300"></div>
                <span className="text-xs text-gray-600">Good</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border-2 bg-yellow-100 border-yellow-300"></div>
                <span className="text-xs text-gray-600">Fair</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border-2 bg-orange-100 border-orange-300"></div>
                <span className="text-xs text-gray-600">Poor</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border-2 bg-red-100 border-red-300"></div>
                <span className="text-xs text-gray-600">Critical</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border-2 bg-gray-200 border-gray-300"></div>
                <span className="text-xs text-gray-600">Empty</span>
              </div>
            </div>
          </>
        )}

        {viewMode === "moisture" && (
          <>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Droplets className="w-4 h-4 mr-2" />
              Soil Moisture Legend
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border-2 bg-blue-200 border-blue-400"></div>
                <span className="text-xs text-gray-600">High (70%+)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border-2 bg-blue-100 border-blue-300"></div>
                <span className="text-xs text-gray-600">Medium (40-70%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border-2 bg-red-100 border-red-300"></div>
                <span className="text-xs text-gray-600">Low (&lt;40%)</span>
              </div>
            </div>
          </>
        )}
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
                  onClick={toggleBulkSelectMode}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    bulkSelectMode
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  {bulkSelectMode ? (
                    <>
                      <X className="w-4 h-4 mr-1 inline" />
                      Cancel Selection
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-1 inline" />
                      Bulk Operations
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    isEditing
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                  disabled={bulkSelectMode}
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

              {/* Bulk Selection Info Bar */}
              {bulkSelectMode && (
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-blue-900">
                        Bulk Selection Mode
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full">
                        {selectedPlots.size} selected
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={selectAllPlots}
                        className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        onClick={clearPlotSelection}
                        className="text-xs px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      >
                        Clear
                      </button>
                      <button
                        onClick={toggleBulkSelectMode}
                        className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Exit
                      </button>
                    </div>
                  </div>
                  {selectedPlots.size > 0 && (
                    <div className="mt-3 p-2 bg-white/50 rounded border border-blue-200">
                      <p className="text-xs text-blue-700 font-medium mb-1">
                        Selected Plots:
                      </p>
                      <p className="text-xs text-blue-600">
                        {Array.from(selectedPlots)
                          .sort((a, b) => a - b)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              )}
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
                  onClick={() => {
                    const intPlotNumber = Math.floor(Number(plot.plotNumber));
                    if (bulkSelectMode) {
                      return togglePlotSelection(intPlotNumber);
                    } else {
                      // Ensure selectedPlot is always an integer
                      setSelectedPlot(intPlotNumber);
                      return;
                    }
                  }}
                  className={`
                    aspect-square border-2 rounded-lg cursor-pointer transition-all duration-200
                    flex flex-col items-center justify-center p-2 text-center relative
                    ${getPlotColor(plot)}
                    ${selectedPlot === Math.floor(Number(plot.plotNumber)) && !bulkSelectMode ? "ring-2 ring-green-500 ring-offset-2" : ""}
                    ${selectedPlots.has(Math.floor(Number(plot.plotNumber))) ? "ring-2 ring-blue-500 ring-offset-2 bg-blue-50" : ""}
                    ${isEditing || bulkSelectMode ? "hover:scale-105" : ""}
                  `}
                >
                  {bulkSelectMode && (
                    <div className="absolute top-1 right-1">
                      {selectedPlots.has(
                        Math.floor(Number(plot.plotNumber)),
                      ) ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  )}
                  <div className="text-xs font-semibold text-gray-800 mb-1">
                    Plot {plot.plotNumber}
                  </div>
                  <div
                    className={`text-xs font-medium truncate w-full px-1 py-0.5 rounded ${
                      plot.crop?.name && plot.crop.name !== "Empty"
                        ? "text-gray-800 bg-white/60 backdrop-blur-sm"
                        : "text-gray-500"
                    }`}
                  >
                    {plot.crop?.name || "Empty"}
                  </div>
                  {plot.crop?.stage && plot.crop.name !== "Empty" && (
                    <div className="text-xs text-gray-600 mt-0.5 capitalize px-1 py-0.5 bg-white/40 rounded text-center">
                      {plot.crop.stage.replace("_", " ")}
                    </div>
                  )}
                  <div className="flex items-center justify-center mt-1 space-x-1">
                    {plot.pestAlerts.some(
                      (alert) => alert.status === "active",
                    ) && (
                      <div
                        className="w-2 h-2 bg-red-500 rounded-full"
                        title="Pest Alert"
                      ></div>
                    )}
                    {plot.crop?.health &&
                      plot.crop.health !== "good" &&
                      plot.crop.health !== "excellent" &&
                      plot.crop.name !== "Empty" && (
                        <div
                          className={`w-2 h-2 rounded-full ${
                            plot.crop.health === "fair"
                              ? "bg-yellow-500"
                              : plot.crop.health === "poor"
                                ? "bg-orange-500"
                                : plot.crop.health === "critical"
                                  ? "bg-red-600"
                                  : ""
                          }`}
                          title={`Health: ${plot.crop.health}`}
                        ></div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plot Details Sidebar - Takes 1 column on desktop, full width on mobile */}
        <div className="xl:col-span-1 space-y-4">
          {/* Bulk Actions Sidebar */}
          {bulkSelectMode && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden sticky top-4">
              <div className="bg-gradient-to-r from-green-50 to-green-100 px-4 py-3 border-b border-green-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-green-900 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Bulk Actions
                  </h3>
                  <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded-full">
                    {selectedPlots.size} plots
                  </span>
                </div>
              </div>

              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Error Display */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPlots.size === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      No plots selected
                    </p>
                    <p className="text-xs text-gray-400">
                      Select plots from the grid to perform bulk actions
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Plant Same Crop */}
                    <div>
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <Plus className="w-4 h-4 text-green-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">
                          Plant Crop
                        </h4>
                      </div>
                      <div className="space-y-3 ml-11">
                        <select
                          value={bulkCropSelection}
                          onChange={(e) => setBulkCropSelection(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        >
                          <option value="">Select crop to plant</option>
                          {availableCrops
                            .filter((crop) => crop !== "Empty")
                            .map((crop) => (
                              <option key={crop} value={crop}>
                                {crop}
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={bulkPlantCrop}
                          disabled={
                            !bulkCropSelection ||
                            bulkOperationLoading ||
                            selectedPlots.size === 0
                          }
                          className="w-full px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-sm"
                        >
                          {bulkOperationLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4 mr-2" />
                          )}
                          Plant in {selectedPlots.size} plot
                          {selectedPlots.size !== 1 ? "s" : ""}
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Clear Plots */}
                    <div>
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">
                          Clear Plots
                        </h4>
                      </div>
                      <div className="space-y-3 ml-11">
                        <p className="text-sm text-gray-600">
                          Remove crops from selected plots and make them empty
                        </p>
                        <button
                          onClick={bulkClearPlots}
                          disabled={
                            bulkOperationLoading || selectedPlots.size === 0
                          }
                          className="w-full px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-sm"
                        >
                          {bulkOperationLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                          )}
                          Clear {selectedPlots.size} plot
                          {selectedPlots.size !== 1 ? "s" : ""}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
          ) : !bulkSelectMode ? (
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
          ) : null}
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
