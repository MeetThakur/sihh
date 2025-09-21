import { ApiResponse } from "../types";

export interface FarmLocation {
  address: string;
  state: string;
  district: string;
  village?: string;
  pincode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PlotData {
  plotNumber: number;
  size: number;
  crop?: {
    name: string;
    variety?: string;
    plantedDate?: string;
    expectedHarvestDate?: string;
    stage:
      | "planted"
      | "growing"
      | "flowering"
      | "ready_to_harvest"
      | "harvested"
      | "fallow";
    health: "excellent" | "good" | "fair" | "poor" | "critical";
  };
  soilHealth: {
    ph?: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    organicMatter?: number;
    moisture?: number;
    lastTested?: string;
    recommendations?: string[];
  };
  irrigation: {
    type?: "drip" | "sprinkler" | "flood" | "manual";
    lastWatered?: string;
    waterRequirement?: number;
    schedule?: {
      frequency: number;
      duration: number;
      times: string[];
    };
  };
  pestAlerts: Array<{
    type: string;
    severity: "low" | "medium" | "high" | "critical";
    detectedDate: string;
    status: "active" | "treated" | "resolved";
    treatment?: string;
    notes?: string;
  }>;
  activities: Array<{
    type:
      | "planting"
      | "watering"
      | "fertilizing"
      | "pesticide"
      | "weeding"
      | "harvesting"
      | "soil_test"
      | "other";
    date: string;
    description: string;
    cost?: number;
    materials?: Array<{
      name: string;
      quantity: number;
      unit: string;
      cost?: number;
    }>;
    laborHours?: number;
    weather?: {
      temperature: number;
      humidity: number;
      rainfall: number;
    };
    notes?: string;
  }>;
  coordinates?: {
    topLeft: { latitude: number; longitude: number };
    topRight: { latitude: number; longitude: number };
    bottomLeft: { latitude: number; longitude: number };
    bottomRight: { latitude: number; longitude: number };
  };
  isActive: boolean;
}

export interface Farm {
  _id: string;
  owner: string;
  name: string;
  totalSize: number;
  location: FarmLocation;
  soilType:
    | "clay"
    | "sandy"
    | "loamy"
    | "silt"
    | "peat"
    | "chalk"
    | "alluvial"
    | "black"
    | "red"
    | "laterite";
  plots: PlotData[];
  irrigation: {
    type: "drip" | "sprinkler" | "flood" | "manual";
    sources: Array<{
      type: "well" | "borewell" | "canal" | "river" | "pond" | "rainwater";
      capacity?: number;
      quality?: "excellent" | "good" | "fair" | "poor";
      cost?: number;
    }>;
    schedule?: {
      frequency: number;
      duration: number;
      times: string[];
    };
  };
  soilHealth?: {
    ph?: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    organicMatter?: number;
    lastTested?: string;
    recommendations?: string[];
  };
  registrationNumber?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFarmData {
  name: string;
  totalSize: number;
  location: FarmLocation;
  soilType?: string;
  irrigationType?: string;
  registrationNumber?: string;
  description?: string;
  plots?: Partial<PlotData>[];
}

export interface UpdateFarmData {
  name?: string;
  totalSize?: number;
  location?: Partial<FarmLocation>;
  soilType?: string;
  irrigation?: Partial<Farm["irrigation"]>;
  registrationNumber?: string;
  description?: string;
}

export interface DashboardData {
  totalFarms: number;
  totalAcreage: number;
  activeCrops: number;
  pestAlerts: number;
  healthScore: number;
  recentActivities: Array<{
    farmName: string;
    plotNumber: number;
    type: string;
    description: string;
    date: string;
    cost?: number;
  }>;
  currentSeason: string;
  cropVariety: string[];
  averageFarmSize: number;
  totalPlots: number;
  recommendations: string[];
}

export interface FarmStats {
  totalFarms: number;
  totalAcreage: number;
  activeCrops: number;
  plotsWithPestAlerts: number;
  healthPercentage: number;
  recentActivities: RecentActivity[];
  summary: {
    averageFarmSize: number;
    totalPlots: number;
    plotsNeedingAttention: number;
  };
}

export interface RecentActivity {
  farmName: string;
  plotName: string;
  activityType: string;
  description: string;
  date: string;
}

export interface PlotActivity {
  type:
    | "planting"
    | "watering"
    | "fertilizing"
    | "pesticide"
    | "weeding"
    | "harvesting"
    | "soil_test"
    | "other";
  description: string;
  date?: string;
  cost?: number;
  materials?: Array<{
    name: string;
    quantity: number;
    unit: string;
    cost?: number;
  }>;
  laborHours?: number;
  weather?: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
  notes?: string;
}

import ApiService from "./api";

class FarmService {
  // Get all farms for the current user
  async getFarms(): Promise<ApiResponse<{ farms: Farm[] }>> {
    return ApiService.getFarms();
  }

  // Get a specific farm by ID
  async getFarmById(id: string): Promise<ApiResponse<{ farm: Farm }>> {
    return ApiService.getFarmById(id);
  }

  // Create a new farm
  async createFarm(
    farmData: CreateFarmData,
  ): Promise<ApiResponse<{ farm: Farm }>> {
    return ApiService.createFarm(farmData);
  }

  // Update an existing farm
  async updateFarm(
    id: string,
    farmData: UpdateFarmData,
  ): Promise<ApiResponse<{ farm: Farm }>> {
    return ApiService.updateFarm(id, farmData);
  }

  // Delete a farm
  async deleteFarm(id: string): Promise<ApiResponse<void>> {
    return ApiService.deleteFarm(id);
  }

  // Get dashboard data
  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    return ApiService.getDashboardData();
  }

  // Get farm statistics
  async getFarmStats(): Promise<ApiResponse<FarmStats>> {
    return ApiService.getFarmStats();
  }

  // Update a specific plot
  async updatePlot(
    farmId: string,
    plotNumber: number,
    plotData: Partial<PlotData>,
  ): Promise<ApiResponse<{ farm: Farm; updatedPlot: PlotData }>> {
    return ApiService.updatePlot(farmId, plotNumber, plotData);
  }

  // Add activity to a plot
  async addPlotActivity(
    farmId: string,
    plotNumber: number,
    activity: PlotActivity,
  ): Promise<ApiResponse<{ activity: PlotActivity; plot: PlotData }>> {
    return ApiService.addPlotActivity(farmId, plotNumber, activity);
  }

  // Helper method to generate default plot data
  generateDefaultPlots(
    rows: number,
    cols: number,
    plotSize: number = 0.16,
  ): PlotData[] {
    const plots: PlotData[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const plotNumber = row * cols + col + 1;
        plots.push({
          plotNumber,
          size: plotSize,
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
        });
      }
    }

    return plots;
  }

  // Helper method to calculate farm health score
  calculateHealthScore(plots: PlotData[]): number {
    if (!plots.length) return 0;

    const healthyPlots = plots.filter(
      (plot) => plot.crop && ["excellent", "good"].includes(plot.crop.health),
    ).length;

    return Math.round((healthyPlots / plots.length) * 100);
  }

  // Helper method to count active pest alerts
  countPestAlerts(plots: PlotData[]): number {
    return plots.reduce((count, plot) => {
      const activeAlerts = plot.pestAlerts.filter(
        (alert) => alert.status === "active",
      );
      return count + activeAlerts.length;
    }, 0);
  }

  // Helper method to get recent activities across all plots
  getRecentActivities(farms: Farm[], limit: number = 10): RecentActivity[] {
    const activities: RecentActivity[] = [];

    farms.forEach((farm) => {
      farm.plots.forEach((plot) => {
        plot.activities.forEach((activity) => {
          activities.push({
            farmName: farm.name,
            plotName: `Plot ${plot.plotNumber}`,
            activityType: activity.type,
            description: activity.description,
            date: activity.date,
          });
        });
      });
    });

    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  // Method to create a default farm for new users
  async createDefaultFarm(userLocation?: {
    state: string;
    district: string;
  }): Promise<ApiResponse<{ farm: Farm }>> {
    const defaultFarmData: CreateFarmData = {
      name: "My Farm",
      totalSize: 2.5,
      location: {
        address: userLocation
          ? `${userLocation.district}, ${userLocation.state}`
          : "India",
        state: userLocation?.state || "Maharashtra",
        district: userLocation?.district || "Pune",
        village: "",
      },
      soilType: "loamy",
      irrigationType: "manual",
      description: "Default farm created for new user",
      plots: this.generateDefaultPlots(4, 4, 0.16), // 4x4 grid with 0.16 acres per plot
    };

    return this.createFarm(defaultFarmData);
  }
}

export const farmService = new FarmService();
export default farmService;
