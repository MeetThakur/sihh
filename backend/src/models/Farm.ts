import mongoose, { Document, Schema } from "mongoose";

export interface IPlot {
  plotNumber: number;
  size: number; // in acres or hectares
  crop?: {
    name: string;
    variety?: string;
    plantedDate?: Date;
    expectedHarvestDate?: Date;
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
    lastTested?: Date;
    recommendations?: string[];
  };
  irrigation: {
    type?: "drip" | "sprinkler" | "flood" | "manual";
    lastWatered?: Date;
    waterRequirement?: number; // liters per day
    schedule?: {
      frequency: number; // days
      duration: number; // minutes
      times: string[]; // ['06:00', '18:00']
    };
  };
  pestAlerts: Array<{
    type: string;
    severity: "low" | "medium" | "high" | "critical";
    detectedDate: Date;
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
    date: Date;
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

export interface IFarm extends Document {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  name: string;
  totalSize: number; // in acres or hectares
  location: {
    address: string;
    state: string;
    district: string;
    village?: string;
    pincode?: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  soilType: "clay" | "sandy" | "loamy" | "silt" | "peat" | "chalk";
  climateZone?: string;
  plots: IPlot[];
  farmingMethods: Array<"organic" | "conventional" | "mixed" | "sustainable">;
  certifications?: Array<{
    type: string;
    issuedBy: string;
    issuedDate: Date;
    expiryDate?: Date;
    certificateNumber: string;
    status: "active" | "expired" | "pending";
  }>;
  infrastructure: {
    waterSource?: Array<"borewell" | "canal" | "river" | "pond" | "rainwater">;
    storage?: {
      type: Array<"warehouse" | "cold_storage" | "silo" | "open_storage">;
      capacity?: number; // in tons
    };
    equipment?: Array<{
      name: string;
      type: string;
      purchaseDate?: Date;
      condition: "excellent" | "good" | "fair" | "poor";
      maintenanceSchedule?: {
        frequency: number; // days
        lastMaintenance?: Date;
        nextMaintenance?: Date;
      };
    }>;
    connectivity: {
      electricity: boolean;
      internet: boolean;
      roadAccess: "excellent" | "good" | "fair" | "poor";
    };
  };
  weather: {
    lastUpdate?: Date;
    current?: {
      temperature: number;
      humidity: number;
      windSpeed: number;
      rainfall: number;
      pressure: number;
      visibility: number;
    };
    forecast?: Array<{
      date: Date;
      minTemp: number;
      maxTemp: number;
      humidity: number;
      rainfall: number;
      windSpeed: number;
      description: string;
    }>;
  };
  economics: {
    totalInvestment?: number;
    yearlyRevenue?: number;
    yearlyExpenses?: number;
    profitMargin?: number;
    breakEvenPoint?: Date;
    expenses: Array<{
      category:
        | "seeds"
        | "fertilizers"
        | "pesticides"
        | "labor"
        | "equipment"
        | "irrigation"
        | "transportation"
        | "other";
      amount: number;
      date: Date;
      description: string;
      receipt?: string;
    }>;
    income: Array<{
      source: "crop_sale" | "government_subsidy" | "insurance" | "other";
      amount: number;
      date: Date;
      description: string;
      buyer?: string;
      receipt?: string;
    }>;
  };
  documents: Array<{
    type:
      | "land_records"
      | "insurance"
      | "loan"
      | "certification"
      | "tax"
      | "other";
    name: string;
    url: string;
    uploadDate: Date;
    expiryDate?: Date;
    isVerified: boolean;
  }>;
  collaborators?: Array<{
    user: mongoose.Types.ObjectId;
    role: "viewer" | "editor" | "manager";
    permissions: string[];
    addedDate: Date;
  }>;
  settings: {
    units: {
      area: "acres" | "hectares";
      weight: "kg" | "tons" | "quintals";
      currency: "INR" | "USD";
    };
    notifications: {
      weatherAlerts: boolean;
      pestAlerts: boolean;
      irrigationReminders: boolean;
      harvestReminders: boolean;
      marketPriceUpdates: boolean;
    };
    privacy: {
      isPublic: boolean;
      shareLocation: boolean;
      shareYield: boolean;
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlotSchema: Schema = new Schema(
  {
    plotNumber: {
      type: Number,
      required: [true, "Plot number is required"],
      min: [1, "Plot number must be at least 1"],
    },
    size: {
      type: Number,
      required: [true, "Plot size is required"],
      min: [0.1, "Plot size must be at least 0.1"],
    },
    crop: {
      name: String,
      variety: String,
      plantedDate: Date,
      expectedHarvestDate: Date,
      stage: {
        type: String,
        enum: [
          "planted",
          "growing",
          "flowering",
          "ready_to_harvest",
          "harvested",
          "fallow",
        ],
        default: "fallow",
      },
      health: {
        type: String,
        enum: ["excellent", "good", "fair", "poor", "critical"],
        default: "good",
      },
    },
    soilHealth: {
      ph: {
        type: Number,
        min: [0, "pH cannot be negative"],
        max: [14, "pH cannot exceed 14"],
      },
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
      organicMatter: Number,
      moisture: {
        type: Number,
        min: [0, "Moisture cannot be negative"],
        max: [100, "Moisture cannot exceed 100%"],
      },
      lastTested: Date,
      recommendations: [String],
    },
    irrigation: {
      type: {
        type: String,
        enum: ["drip", "sprinkler", "flood", "manual"],
      },
      lastWatered: Date,
      waterRequirement: Number,
      schedule: {
        frequency: Number,
        duration: Number,
        times: [String],
      },
    },
    pestAlerts: [
      {
        type: { type: String, required: true },
        severity: {
          type: String,
          enum: ["low", "medium", "high", "critical"],
          required: true,
        },
        detectedDate: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["active", "treated", "resolved"],
          default: "active",
        },
        treatment: String,
        notes: String,
      },
    ],
    activities: [
      {
        type: {
          type: String,
          enum: [
            "planting",
            "watering",
            "fertilizing",
            "pesticide",
            "weeding",
            "harvesting",
            "soil_test",
            "other",
          ],
          required: true,
        },
        date: { type: Date, required: true },
        description: { type: String, required: true },
        cost: Number,
        materials: [
          {
            name: String,
            quantity: Number,
            unit: String,
            cost: Number,
          },
        ],
        laborHours: Number,
        weather: {
          temperature: Number,
          humidity: Number,
          rainfall: Number,
        },
        notes: String,
      },
    ],
    coordinates: {
      topLeft: {
        latitude: Number,
        longitude: Number,
      },
      topRight: {
        latitude: Number,
        longitude: Number,
      },
      bottomLeft: {
        latitude: Number,
        longitude: Number,
      },
      bottomRight: {
        latitude: Number,
        longitude: Number,
      },
    },
    isActive: { type: Boolean, default: true },
  },
  { _id: false },
);

const FarmSchema: Schema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Farm owner is required"],
    },
    name: {
      type: String,
      required: [true, "Farm name is required"],
      trim: true,
      maxlength: [100, "Farm name cannot exceed 100 characters"],
    },
    totalSize: {
      type: Number,
      required: [true, "Total farm size is required"],
      min: [0.1, "Farm size must be at least 0.1"],
    },
    location: {
      address: { type: String, required: true },
      state: { type: String, required: true },
      district: { type: String, required: true },
      village: String,
      pincode: String,
      coordinates: {
        latitude: {
          type: Number,
          required: true,
          min: [-90, "Invalid latitude"],
          max: [90, "Invalid latitude"],
        },
        longitude: {
          type: Number,
          required: true,
          min: [-180, "Invalid longitude"],
          max: [180, "Invalid longitude"],
        },
      },
    },
    soilType: {
      type: String,
      enum: ["clay", "sandy", "loamy", "silt", "peat", "chalk"],
      required: [true, "Soil type is required"],
    },
    climateZone: String,
    plots: {
      type: [PlotSchema],
      validate: {
        validator: function (plots: IPlot[]) {
          const totalPlotSize = plots.reduce((sum, plot) => sum + plot.size, 0);
          return totalPlotSize <= (this as any).totalSize * 1.1; // Allow 10% variance
        },
        message: "Total plot size cannot exceed farm size significantly",
      },
    },
    farmingMethods: [
      {
        type: String,
        enum: ["organic", "conventional", "mixed", "sustainable"],
      },
    ],
    certifications: [
      {
        type: String,
        issuedBy: String,
        issuedDate: Date,
        expiryDate: Date,
        certificateNumber: String,
        status: {
          type: String,
          enum: ["active", "expired", "pending"],
          default: "active",
        },
      },
    ],
    infrastructure: {
      waterSource: [
        {
          type: String,
          enum: ["borewell", "canal", "river", "pond", "rainwater"],
        },
      ],
      storage: {
        type: [
          {
            type: String,
            enum: ["warehouse", "cold_storage", "silo", "open_storage"],
          },
        ],
        capacity: Number,
      },
      equipment: [
        {
          name: String,
          type: String,
          purchaseDate: Date,
          condition: {
            type: String,
            enum: ["excellent", "good", "fair", "poor"],
            default: "good",
          },
          maintenanceSchedule: {
            frequency: Number,
            lastMaintenance: Date,
            nextMaintenance: Date,
          },
        },
      ],
      connectivity: {
        electricity: { type: Boolean, default: false },
        internet: { type: Boolean, default: false },
        roadAccess: {
          type: String,
          enum: ["excellent", "good", "fair", "poor"],
          default: "good",
        },
      },
    },
    weather: {
      lastUpdate: Date,
      current: {
        temperature: Number,
        humidity: Number,
        windSpeed: Number,
        rainfall: Number,
        pressure: Number,
        visibility: Number,
      },
      forecast: [
        {
          date: Date,
          minTemp: Number,
          maxTemp: Number,
          humidity: Number,
          rainfall: Number,
          windSpeed: Number,
          description: String,
        },
      ],
    },
    economics: {
      totalInvestment: Number,
      yearlyRevenue: Number,
      yearlyExpenses: Number,
      profitMargin: Number,
      breakEvenPoint: Date,
      expenses: [
        {
          category: {
            type: String,
            enum: [
              "seeds",
              "fertilizers",
              "pesticides",
              "labor",
              "equipment",
              "irrigation",
              "transportation",
              "other",
            ],
            required: true,
          },
          amount: { type: Number, required: true },
          date: { type: Date, required: true },
          description: { type: String, required: true },
          receipt: String,
        },
      ],
      income: [
        {
          source: {
            type: String,
            enum: ["crop_sale", "government_subsidy", "insurance", "other"],
            required: true,
          },
          amount: { type: Number, required: true },
          date: { type: Date, required: true },
          description: { type: String, required: true },
          buyer: String,
          receipt: String,
        },
      ],
    },
    documents: [
      {
        type: {
          type: String,
          enum: [
            "land_records",
            "insurance",
            "loan",
            "certification",
            "tax",
            "other",
          ],
          required: true,
        },
        name: { type: String, required: true },
        url: { type: String, required: true },
        uploadDate: { type: Date, default: Date.now },
        expiryDate: Date,
        isVerified: { type: Boolean, default: false },
      },
    ],
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["viewer", "editor", "manager"],
          default: "viewer",
        },
        permissions: [String],
        addedDate: { type: Date, default: Date.now },
      },
    ],
    settings: {
      units: {
        area: { type: String, enum: ["acres", "hectares"], default: "acres" },
        weight: {
          type: String,
          enum: ["kg", "tons", "quintals"],
          default: "kg",
        },
        currency: { type: String, enum: ["INR", "USD"], default: "INR" },
      },
      notifications: {
        weatherAlerts: { type: Boolean, default: true },
        pestAlerts: { type: Boolean, default: true },
        irrigationReminders: { type: Boolean, default: true },
        harvestReminders: { type: Boolean, default: true },
        marketPriceUpdates: { type: Boolean, default: false },
      },
      privacy: {
        isPublic: { type: Boolean, default: false },
        shareLocation: { type: Boolean, default: false },
        shareYield: { type: Boolean, default: false },
      },
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better performance
FarmSchema.index({ owner: 1 });
FarmSchema.index({ "location.state": 1, "location.district": 1 });
FarmSchema.index({ soilType: 1 });
FarmSchema.index({ "location.coordinates": "2dsphere" });
FarmSchema.index({ isActive: 1 });
FarmSchema.index({ createdAt: -1 });

// Virtual for total active plots
FarmSchema.virtual("activePlotsCount").get(function (this: IFarm) {
  return (this.plots as any).filter((plot: IPlot) => plot.isActive).length;
});

// Virtual for total cultivated area
FarmSchema.virtual("cultivatedArea").get(function () {
  return (this.plots as any)
    .filter((plot: IPlot) => plot.isActive && plot.crop?.name)
    .reduce((sum: number, plot: IPlot) => sum + plot.size, 0);
});

// Virtual for current season crops
FarmSchema.virtual("currentCrops").get(function () {
  const crops = (this.plots as any)
    .filter((plot: IPlot) => plot.isActive && plot.crop?.name)
    .map((plot: IPlot) => plot.crop?.name)
    .filter((crop: string | undefined): crop is string => Boolean(crop));

  return [...new Set(crops)];
});

// Virtual for health status
FarmSchema.virtual("overallHealth").get(function (this: IFarm) {
  const activePlots = (this.plots as any).filter(
    (plot: IPlot) => plot.isActive && plot.crop?.name,
  );
  if (activePlots.length === 0) return "unknown";

  const healthScores = { excellent: 5, good: 4, fair: 3, poor: 2, critical: 1 };
  const totalScore = activePlots.reduce((sum: number, plot: IPlot) => {
    return sum + (healthScores[plot.crop?.health || "good"] || 3);
  }, 0);

  const averageScore = totalScore / activePlots.length;

  if (averageScore >= 4.5) return "excellent";
  if (averageScore >= 3.5) return "good";
  if (averageScore >= 2.5) return "fair";
  if (averageScore >= 1.5) return "poor";
  return "critical";
});

// Virtual for active pest alerts
FarmSchema.virtual("activePestAlerts").get(function (this: IFarm) {
  return (this.plots as any).reduce((alerts: any[], plot: IPlot) => {
    const activeAlerts = plot.pestAlerts.filter(
      (alert) => alert.status === "active",
    );
    return alerts.concat(activeAlerts);
  }, []);
});

// Static method to find farms near location
FarmSchema.statics.findNearLocation = function (
  longitude: number,
  latitude: number,
  maxDistance: number = 10000,
) {
  return this.find({
    "location.coordinates": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance,
      },
    },
  });
};

// Static method to find farms by crop
FarmSchema.statics.findByCrop = function (cropName: string) {
  return this.find({
    "plots.crop.name": { $regex: new RegExp(cropName, "i") },
    "plots.isActive": true,
  });
};

// Instance method to add activity to plot
FarmSchema.methods.addPlotActivity = function (
  plotNumber: number,
  activity: any,
) {
  const plot = this.plots.find((p: IPlot) => p.plotNumber === plotNumber);
  if (plot) {
    plot.activities.push(activity);
    return this.save();
  }
  throw new Error("Plot not found");
};

// Instance method to update plot health
FarmSchema.methods.updatePlotHealth = function (
  plotNumber: number,
  health: string,
) {
  const plot = this.plots.find((p: IPlot) => p.plotNumber === plotNumber);
  if (plot && plot.crop) {
    plot.crop.health = health as any;
    return this.save();
  }
  throw new Error("Plot or crop not found");
};

export default mongoose.model<IFarm>("Farm", FarmSchema);
