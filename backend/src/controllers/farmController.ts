import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Farm, { IFarm } from "../models/Farm";
import logger from "../config/logger";
import mongoose from "mongoose";

// Get all farms for the authenticated user
export const getFarms = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;

    const farms = await Farm.find({ owner: userId, isActive: true })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Farms retrieved successfully",
      data: { farms },
    });
  } catch (error) {
    logger.error("Get farms error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve farms",
      error: "GET_FARMS_ERROR",
    });
  }
};

// Get a specific farm by ID
export const getFarmById = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const userId = req.user!._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid farm ID",
        error: "INVALID_FARM_ID",
      });
    }

    const farm = await Farm.findOne({
      _id: id,
      owner: userId,
      isActive: true,
    }).populate("owner", "name email");

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
        error: "FARM_NOT_FOUND",
      });
    }

    res.json({
      success: true,
      message: "Farm retrieved successfully",
      data: { farm },
    });
  } catch (error) {
    logger.error("Get farm by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve farm",
      error: "GET_FARM_ERROR",
    });
  }
};

// Create a new farm
export const createFarm = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const userId = req.user!._id;
    const {
      name,
      totalSize,
      location,
      soilType,
      plots,
      irrigationType,
      registrationNumber,
      description,
    } = req.body;

    // Create the farm data
    const farmData: Partial<IFarm> = {
      owner: userId,
      name,
      totalSize,
      location: {
        ...location,
        coordinates: location.coordinates || {
          latitude: 28.8955, // Default to Rampur, UP coordinates
          longitude: 79.0974,
        },
      },
      soilType: soilType || "loamy",
      plots: plots || [],
      farmingMethods: ["conventional"],
      infrastructure: {
        waterSource: [irrigationType === "drip" ? "borewell" : "canal"],
        connectivity: {
          electricity: true,
          internet: true,
          roadAccess: "good",
        },
      },
      economics: {
        expenses: [],
        income: [],
      },
      documents: [],
      settings: {
        units: {
          area: "acres",
          weight: "quintals",
          currency: "INR",
        },
        notifications: {
          weatherAlerts: true,
          pestAlerts: true,
          irrigationReminders: true,
          harvestReminders: true,
          marketPriceUpdates: false,
        },
        privacy: {
          isPublic: false,
          shareLocation: false,
          shareYield: false,
        },
      },
      isActive: true,
    };

    const farm = new Farm(farmData);
    await farm.save();

    await farm.populate("owner", "name email");

    logger.info(`New farm created: ${name} by user ${userId}`);

    res.status(201).json({
      success: true,
      message: "Farm created successfully",
      data: { farm },
    });
  } catch (error) {
    logger.error("Create farm error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create farm",
      error: "CREATE_FARM_ERROR",
    });
  }
};

// Update an existing farm
export const updateFarm = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const userId = req.user!._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid farm ID",
        error: "INVALID_FARM_ID",
      });
    }

    const farm = await Farm.findOne({
      _id: id,
      owner: userId,
      isActive: true,
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
        error: "FARM_NOT_FOUND",
      });
    }

    const allowedUpdates = [
      "name",
      "totalSize",
      "location",
      "soilType",
      "plots",
      "farmingMethods",
      "infrastructure",
      "settings",
      "description",
    ];

    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: "Invalid updates",
        error: "INVALID_UPDATES",
      });
    }

    updates.forEach((update) => {
      if (req.body[update] !== undefined) {
        (farm as any)[update] = req.body[update];
      }
    });

    await farm.save();
    await farm.populate("owner", "name email");

    logger.info(`Farm updated: ${id} by user ${userId}`);

    res.json({
      success: true,
      message: "Farm updated successfully",
      data: { farm },
    });
  } catch (error) {
    logger.error("Update farm error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update farm",
      error: "UPDATE_FARM_ERROR",
    });
  }
};

// Delete a farm (soft delete)
export const deleteFarm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid farm ID",
        error: "INVALID_FARM_ID",
      });
    }

    const farm = await Farm.findOne({
      _id: id,
      owner: userId,
      isActive: true,
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
        error: "FARM_NOT_FOUND",
      });
    }

    farm.isActive = false;
    await farm.save();

    logger.info(`Farm deleted: ${id} by user ${userId}`);

    res.json({
      success: true,
      message: "Farm deleted successfully",
    });
  } catch (error) {
    logger.error("Delete farm error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete farm",
      error: "DELETE_FARM_ERROR",
    });
  }
};

// Get farm statistics for dashboard
export const getFarmStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;

    const farms = await Farm.find({ owner: userId, isActive: true });

    let totalFarms = farms.length;
    let totalAcreage = 0;
    let activeCrops = 0;
    let plotsWithPestAlerts = 0;
    let plotsWithGoodHealth = 0;
    let totalPlots = 0;

    farms.forEach((farm) => {
      totalAcreage += farm.totalSize;
      farm.plots.forEach((plot) => {
        totalPlots++;

        if (plot.crop && plot.crop.stage && plot.crop.stage !== "fallow") {
          activeCrops++;
        }

        if (
          plot.pestAlerts &&
          plot.pestAlerts.some((alert) => alert.status === "active")
        ) {
          plotsWithPestAlerts++;
        }

        if (plot.crop && ["excellent", "good"].includes(plot.crop.health)) {
          plotsWithGoodHealth++;
        }
      });
    });

    const healthPercentage =
      totalPlots > 0 ? Math.round((plotsWithGoodHealth / totalPlots) * 100) : 0;

    // Get recent activities across all farms
    const recentActivities = farms
      .flatMap((farm) =>
        farm.plots.flatMap((plot) =>
          plot.activities
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .slice(0, 5)
            .map((activity) => ({
              farmName: farm.name,
              plotId: plot.plotNumber,
              ...activity,
            })),
        ),
      )
      .slice(0, 10);

    res.json({
      success: true,
      message: "Farm statistics retrieved successfully",
      data: {
        totalFarms,
        totalAcreage,
        activeCrops,
        plotsWithPestAlerts,
        healthPercentage,
        recentActivities,
        summary: {
          averageFarmSize:
            totalFarms > 0
              ? Math.round((totalAcreage / totalFarms) * 100) / 100
              : 0,
          totalPlots,
          plotsNeedingAttention: plotsWithPestAlerts,
        },
      },
    });
  } catch (error) {
    logger.error("Get farm stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve farm statistics",
      error: "GET_FARM_STATS_ERROR",
    });
  }
};

// Update a specific plot within a farm
export const updatePlot = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { farmId, plotNumber } = req.params;
    const userId = req.user!._id;

    if (!mongoose.Types.ObjectId.isValid(farmId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid farm ID",
        error: "INVALID_FARM_ID",
      });
    }

    const farm = await Farm.findOne({
      _id: farmId,
      owner: userId,
      isActive: true,
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
        error: "FARM_NOT_FOUND",
      });
    }

    const plotIndex = farm.plots.findIndex(
      (plot) => plot.plotNumber === parseInt(plotNumber),
    );

    if (plotIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Plot not found",
        error: "PLOT_NOT_FOUND",
      });
    }

    // Update plot data
    const allowedUpdates = [
      "crop",
      "soilHealth",
      "irrigation",
      "pestAlerts",
      "activities",
    ];
    const updates = Object.keys(req.body);

    updates.forEach((update) => {
      if (allowedUpdates.includes(update) && req.body[update] !== undefined) {
        if (update === "pestAlerts" || update === "activities") {
          // For arrays, append new items
          farm.plots[plotIndex][update] = [
            ...farm.plots[plotIndex][update],
            ...req.body[update],
          ];
        } else {
          // For objects, merge with existing data
          farm.plots[plotIndex][update] = {
            ...farm.plots[plotIndex][update],
            ...req.body[update],
          };
        }
      }
    });

    await farm.save();

    logger.info(
      `Plot ${plotNumber} updated in farm ${farmId} by user ${userId}`,
    );

    res.json({
      success: true,
      message: "Plot updated successfully",
      data: {
        farm,
        updatedPlot: farm.plots[plotIndex],
      },
    });
  } catch (error) {
    logger.error("Update plot error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update plot",
      error: "UPDATE_PLOT_ERROR",
    });
  }
};

// Bulk update multiple plots with the same data
export const bulkUpdatePlots = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("❌ bulkUpdatePlots validation failed:");
      console.error("Request body:", JSON.stringify(req.body, null, 2));
      console.error("Validation errors:", errors.array());
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { farmId } = req.params;
    const { plotNumbers, plotData } = req.body;
    const userId = req.user!._id;

    if (!mongoose.Types.ObjectId.isValid(farmId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid farm ID",
        error: "INVALID_FARM_ID",
      });
    }

    if (!Array.isArray(plotNumbers) || plotNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "plotNumbers must be a non-empty array",
        error: "INVALID_PLOT_NUMBERS",
      });
    }

    const farm = await Farm.findOne({
      _id: farmId,
      owner: userId,
      isActive: true,
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
        error: "FARM_NOT_FOUND",
      });
    }

    const updatedPlots: any[] = [];
    const allowedUpdates = [
      "crop",
      "soilHealth",
      "irrigation",
      "pestAlerts",
      "activities",
    ];

    // Update each specified plot
    plotNumbers.forEach((plotNumber: number) => {
      const plotIndex = farm.plots.findIndex(
        (plot) => plot.plotNumber === plotNumber,
      );

      if (plotIndex !== -1) {
        const updates = Object.keys(plotData);

        updates.forEach((update) => {
          if (
            allowedUpdates.includes(update) &&
            plotData[update] !== undefined
          ) {
            if (update === "pestAlerts" || update === "activities") {
              // For arrays, replace with new data
              farm.plots[plotIndex][update] = plotData[update];
            } else if (update === "crop") {
              // Handle crop data with proper date conversion
              const cropData = plotData[update];
              const convertedCropData = {
                ...farm.plots[plotIndex][update],
                ...cropData,
              };

              // Convert date strings to Date objects if they exist
              if (
                cropData.plantedDate &&
                typeof cropData.plantedDate === "string"
              ) {
                convertedCropData.plantedDate = new Date(cropData.plantedDate);
              }
              if (
                cropData.expectedHarvestDate &&
                typeof cropData.expectedHarvestDate === "string"
              ) {
                convertedCropData.expectedHarvestDate = new Date(
                  cropData.expectedHarvestDate,
                );
              }

              farm.plots[plotIndex][update] = convertedCropData;
            } else {
              // For other objects, merge with existing data
              farm.plots[plotIndex][update] = {
                ...farm.plots[plotIndex][update],
                ...plotData[update],
              };
            }
          }
        });

        updatedPlots.push(farm.plots[plotIndex]);
      }
    });

    if (updatedPlots.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No valid plots found to update",
        error: "NO_PLOTS_FOUND",
      });
    }

    await farm.save();

    logger.info(
      `Bulk updated ${updatedPlots.length} plots in farm ${farmId} by user ${userId}`,
    );

    res.json({
      success: true,
      message: `Successfully updated ${updatedPlots.length} plots`,
      data: {
        farm,
        updatedPlots,
      },
    });
  } catch (error) {
    logger.error("Bulk update plots error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to bulk update plots",
      error: "BULK_UPDATE_PLOTS_ERROR",
    });
  }
};

// Bulk clear multiple plots (make them empty)
export const bulkClearPlots = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("❌ bulkClearPlots validation failed:");
      console.error("Request body:", JSON.stringify(req.body, null, 2));
      console.error("Validation errors:", errors.array());
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { farmId } = req.params;
    const { plotNumbers } = req.body;
    const userId = req.user!._id;

    if (!mongoose.Types.ObjectId.isValid(farmId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid farm ID",
        error: "INVALID_FARM_ID",
      });
    }

    if (!Array.isArray(plotNumbers) || plotNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "plotNumbers must be a non-empty array",
        error: "INVALID_PLOT_NUMBERS",
      });
    }

    const farm = await Farm.findOne({
      _id: farmId,
      owner: userId,
      isActive: true,
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
        error: "FARM_NOT_FOUND",
      });
    }

    const clearedPlots: number[] = [];

    // Clear each specified plot
    plotNumbers.forEach((plotNumber: number) => {
      const plotIndex = farm.plots.findIndex(
        (plot) => plot.plotNumber === plotNumber,
      );

      if (plotIndex !== -1) {
        // Reset plot to empty state
        farm.plots[plotIndex].crop = {
          name: "Empty",
          variety: "",
          plantedDate: undefined,
          expectedHarvestDate: undefined,
          stage: "fallow",
          health: "good",
        };

        // Clear pest alerts
        farm.plots[plotIndex].pestAlerts = [];

        // Add activity for clearing the plot
        farm.plots[plotIndex].activities.push({
          type: "other",
          description: "Plot cleared (bulk operation)",
          date: new Date(),
          cost: 0,
          notes: "Bulk clearing operation",
        });

        clearedPlots.push(plotNumber);
      }
    });

    if (clearedPlots.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No valid plots found to clear",
        error: "NO_PLOTS_FOUND",
      });
    }

    await farm.save();

    logger.info(
      `Bulk cleared ${clearedPlots.length} plots in farm ${farmId} by user ${userId}`,
    );

    res.json({
      success: true,
      message: `Successfully cleared ${clearedPlots.length} plots`,
      data: {
        farm,
        clearedPlots,
      },
    });
  } catch (error) {
    logger.error("Bulk clear plots error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to bulk clear plots",
      error: "BULK_CLEAR_PLOTS_ERROR",
    });
  }
};

// Add a new activity to a plot
export const addPlotActivity = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { farmId, plotNumber } = req.params;
    const userId = req.user!._id;
    const activityData = req.body;

    if (!mongoose.Types.ObjectId.isValid(farmId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid farm ID",
        error: "INVALID_FARM_ID",
      });
    }

    const farm = await Farm.findOne({
      _id: farmId,
      owner: userId,
      isActive: true,
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
        error: "FARM_NOT_FOUND",
      });
    }

    const plotIndex = farm.plots.findIndex(
      (plot) => plot.plotNumber === parseInt(plotNumber),
    );

    if (plotIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Plot not found",
        error: "PLOT_NOT_FOUND",
      });
    }

    // Add the new activity
    const newActivity = {
      type: activityData.type,
      date: activityData.date || new Date(),
      description: activityData.description,
      cost: activityData.cost,
      materials: activityData.materials || [],
      laborHours: activityData.laborHours,
      weather: activityData.weather,
      notes: activityData.notes,
    };

    farm.plots[plotIndex].activities.push(newActivity);
    await farm.save();

    logger.info(
      `Activity added to plot ${plotNumber} in farm ${farmId} by user ${userId}`,
    );

    res.status(201).json({
      success: true,
      message: "Activity added successfully",
      data: {
        activity: newActivity,
        plot: farm.plots[plotIndex],
      },
    });
  } catch (error) {
    logger.error("Add plot activity error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add activity",
      error: "ADD_ACTIVITY_ERROR",
    });
  }
};

// Get dashboard data (aggregated farm information)
export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;

    const farms = await Farm.find({ owner: userId, isActive: true });

    if (farms.length === 0) {
      return res.json({
        success: true,
        message: "No farms found",
        data: {
          totalFarms: 0,
          totalAcreage: 0,
          activeCrops: 0,
          pestAlerts: 0,
          healthScore: 0,
          recentActivities: [],
          weatherSummary: null,
          currentSeason: getCurrentSeason(),
          cropVariety: [],
          averageFarmSize: 0,
          totalPlots: 0,
          recommendations: [
            "Create your first farm to get started",
            "Add plot information for better insights",
            "Set up irrigation schedules",
          ],
        },
      });
    }

    let totalAcreage = 0;
    let activeCrops = 0;
    let pestAlerts = 0;
    let totalPlots = 0;
    let healthyPlots = 0;
    const recentActivities: any[] = [];
    const cropTypes = new Set<string>();

    farms.forEach((farm) => {
      totalAcreage += farm.totalSize;

      farm.plots.forEach((plot) => {
        totalPlots++;

        if (plot.crop && plot.crop.stage && plot.crop.stage !== "fallow") {
          activeCrops++;
          cropTypes.add(plot.crop.name);
        }

        if (plot.crop && ["excellent", "good"].includes(plot.crop.health)) {
          healthyPlots++;
        }

        // Count active pest alerts
        const activePestAlerts = plot.pestAlerts.filter(
          (alert) => alert.status === "active",
        );
        pestAlerts += activePestAlerts.length;

        // Get recent activities
        plot.activities
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .slice(0, 3)
          .forEach((activity) => {
            recentActivities.push({
              farmName: farm.name,
              plotNumber: plot.plotNumber,
              type: activity.type,
              description: activity.description,
              date: activity.date,
              cost: activity.cost,
            });
          });
      });
    });

    // Sort recent activities by date
    recentActivities.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const healthScore =
      totalPlots > 0 ? Math.round((healthyPlots / totalPlots) * 100) : 0;

    res.json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: {
        totalFarms: farms.length,
        totalAcreage: Math.round(totalAcreage * 100) / 100,
        activeCrops,
        pestAlerts,
        healthScore,
        recentActivities: recentActivities.slice(0, 10),
        currentSeason: getCurrentSeason(),
        cropVariety: Array.from(cropTypes),
        averageFarmSize: Math.round((totalAcreage / farms.length) * 100) / 100,
        totalPlots,
        recommendations: generateRecommendations(
          farms,
          healthScore,
          pestAlerts,
        ),
      },
    });
  } catch (error) {
    logger.error("Get dashboard data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard data",
      error: "GET_DASHBOARD_ERROR",
    });
  }
};

// Helper function to get current agricultural season
function getCurrentSeason(): string {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() returns 0-11
  const year = now.getFullYear();

  if (month >= 6 && month <= 11) {
    return `Kharif ${year}`;
  } else if (month >= 11 || month <= 3) {
    return `Rabi ${year}`;
  } else {
    return `Summer ${year}`;
  }
}

// Helper function to generate recommendations based on farm data
function generateRecommendations(
  farms: IFarm[],
  healthScore: number,
  pestAlerts: number,
): string[] {
  const recommendations: string[] = [];

  if (healthScore < 70) {
    recommendations.push(
      "Consider soil testing and nutrient management for better crop health",
    );
  }

  if (pestAlerts > 0) {
    recommendations.push(
      "Review pest management strategies for affected plots",
    );
  }

  if (
    farms.some((farm) => farm.plots.some((plot) => !plot.irrigation.schedule))
  ) {
    recommendations.push(
      "Set up irrigation schedules for optimal water management",
    );
  }

  // Check if any plots need soil testing
  const needsSoilTesting = farms.some((farm) =>
    farm.plots.some(
      (plot) =>
        !plot.soilHealth?.lastTested ||
        new Date(plot.soilHealth.lastTested).getTime() <
          Date.now() - 6 * 30 * 24 * 60 * 60 * 1000,
    ),
  );

  if (needsSoilTesting) {
    recommendations.push(
      "Schedule soil testing - some plots need updated soil analysis",
    );
  }

  // Default recommendations if none specific
  if (recommendations.length === 0) {
    recommendations.push(
      "Continue monitoring crop health and weather conditions",
      "Plan for next season crop rotation",
      "Review market prices for optimal harvest timing",
    );
  }

  return recommendations.slice(0, 3); // Limit to 3 recommendations
}
