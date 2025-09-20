import mongoose, { Document, Schema } from "mongoose";

export interface ICropRecommendation {
  crop: string;
  variety?: string;
  confidence: number; // 0-100
  expectedYield: number;
  expectedRevenue: number;
  investmentRequired: number;
  roi: number; // Return on Investment percentage
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
  warnings?: string[];
  timeline: {
    sowingStart: Date;
    sowingEnd: Date;
    harvestStart: Date;
    harvestEnd: Date;
  };
  requirements: {
    soilType: string[];
    climate: string;
    water: number; // liters per day per acre
    fertilizers: Array<{
      name: string;
      quantity: number;
      unit: string;
      applicationTime: string;
    }>;
    pesticides?: Array<{
      name: string;
      usage: string;
      precautions: string[];
    }>;
  };
  marketData?: {
    currentPrice: number;
    averagePrice: number;
    priceRange: { min: number; max: number };
    demand: "low" | "medium" | "high";
    marketTrend: "rising" | "stable" | "falling";
  };
}

export interface ICropAdvisory extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  farm?: mongoose.Types.ObjectId;
  requestDetails: {
    budget: number;
    farmSize: number;
    soilType: string;
    location: {
      state: string;
      district: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    season: "kharif" | "rabi" | "summer" | "year_round";
    experience: "beginner" | "intermediate" | "expert";
    farmingMethod: "organic" | "conventional" | "mixed";
    preferences?: {
      cropTypes?: string[];
      avoidCrops?: string[];
      riskTolerance: "low" | "medium" | "high";
      prioritize: "profit" | "sustainability" | "food_security";
    };
    constraints?: {
      waterAvailability: "abundant" | "moderate" | "limited";
      laborAvailability: "abundant" | "moderate" | "limited";
      storageCapacity: number; // in tons
      transportAccess: "excellent" | "good" | "fair" | "poor";
    };
  };
  recommendations: ICropRecommendation[];
  aiResponse: {
    model: string; // 'gemini-1.5-flash', 'gpt-4', etc.
    prompt: string;
    rawResponse: string;
    processingTime: number; // in milliseconds
    confidence: number;
    version: string;
  };
  weatherContext?: {
    current: {
      temperature: number;
      humidity: number;
      rainfall: number;
    };
    forecast: Array<{
      date: Date;
      temperature: { min: number; max: number };
      rainfall: number;
      conditions: string;
    }>;
    seasonalTrends: {
      rainfall: number;
      temperature: number;
      humidity: number;
    };
  };
  marketContext?: {
    priceHistory: Array<{
      crop: string;
      date: Date;
      price: number;
      market: string;
    }>;
    demandForecast: Array<{
      crop: string;
      month: string;
      demand: "low" | "medium" | "high";
      priceProjection: number;
    }>;
    competitiveAnalysis: {
      nearbyFarms: number;
      popularCrops: string[];
      marketSaturation: "low" | "medium" | "high";
    };
  };
  feedback?: {
    rating: number; // 1-5
    comments?: string;
    implemented: boolean;
    implementedCrops?: string[];
    actualResults?: Array<{
      crop: string;
      actualYield: number;
      actualRevenue: number;
      actualROI: number;
      notes: string;
    }>;
    submittedAt: Date;
  };
  followUp?: {
    nextReviewDate: Date;
    remindersSent: number;
    currentStatus: "pending" | "in_progress" | "completed" | "abandoned";
    activities: Array<{
      type: "reminder" | "check_in" | "update" | "completion";
      date: Date;
      message: string;
      response?: string;
    }>;
  };
  validUntil: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CropRecommendationSchema: Schema = new Schema(
  {
    crop: { type: String, required: true },
    variety: String,
    confidence: {
      type: Number,
      required: true,
      min: [0, "Confidence cannot be negative"],
      max: [100, "Confidence cannot exceed 100"],
    },
    expectedYield: {
      type: Number,
      required: true,
      min: [0, "Expected yield cannot be negative"],
    },
    expectedRevenue: {
      type: Number,
      required: true,
      min: [0, "Expected revenue cannot be negative"],
    },
    investmentRequired: {
      type: Number,
      required: true,
      min: [0, "Investment required cannot be negative"],
    },
    roi: {
      type: Number,
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    reasons: [{ type: String, required: true }],
    warnings: [String],
    timeline: {
      sowingStart: { type: Date, required: true },
      sowingEnd: { type: Date, required: true },
      harvestStart: { type: Date, required: true },
      harvestEnd: { type: Date, required: true },
    },
    requirements: {
      soilType: [{ type: String, required: true }],
      climate: { type: String, required: true },
      water: {
        type: Number,
        required: true,
        min: [0, "Water requirement cannot be negative"],
      },
      fertilizers: [
        {
          name: { type: String, required: true },
          quantity: {
            type: Number,
            required: true,
            min: [0, "Fertilizer quantity cannot be negative"],
          },
          unit: { type: String, required: true },
          applicationTime: { type: String, required: true },
        },
      ],
      pesticides: [
        {
          name: { type: String, required: true },
          usage: { type: String, required: true },
          precautions: [String],
        },
      ],
    },
    marketData: {
      currentPrice: Number,
      averagePrice: Number,
      priceRange: {
        min: Number,
        max: Number,
      },
      demand: {
        type: String,
        enum: ["low", "medium", "high"],
      },
      marketTrend: {
        type: String,
        enum: ["rising", "stable", "falling"],
      },
    },
  },
  { _id: false },
);

const CropAdvisorySchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
    },
    requestDetails: {
      budget: {
        type: Number,
        required: [true, "Budget is required"],
        min: [0, "Budget cannot be negative"],
      },
      farmSize: {
        type: Number,
        required: [true, "Farm size is required"],
        min: [0.1, "Farm size must be at least 0.1"],
      },
      soilType: {
        type: String,
        required: [true, "Soil type is required"],
        enum: ["clay", "sandy", "loamy", "silt", "peat", "chalk"],
      },
      location: {
        state: { type: String, required: true },
        district: { type: String, required: true },
        coordinates: {
          latitude: {
            type: Number,
            min: [-90, "Invalid latitude"],
            max: [90, "Invalid latitude"],
          },
          longitude: {
            type: Number,
            min: [-180, "Invalid longitude"],
            max: [180, "Invalid longitude"],
          },
        },
      },
      season: {
        type: String,
        enum: ["kharif", "rabi", "summer", "year_round"],
        required: [true, "Season is required"],
      },
      experience: {
        type: String,
        enum: ["beginner", "intermediate", "expert"],
        required: [true, "Experience level is required"],
      },
      farmingMethod: {
        type: String,
        enum: ["organic", "conventional", "mixed"],
        required: [true, "Farming method is required"],
      },
      preferences: {
        cropTypes: [String],
        avoidCrops: [String],
        riskTolerance: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "medium",
        },
        prioritize: {
          type: String,
          enum: ["profit", "sustainability", "food_security"],
          default: "profit",
        },
      },
      constraints: {
        waterAvailability: {
          type: String,
          enum: ["abundant", "moderate", "limited"],
          default: "moderate",
        },
        laborAvailability: {
          type: String,
          enum: ["abundant", "moderate", "limited"],
          default: "moderate",
        },
        storageCapacity: {
          type: Number,
          min: [0, "Storage capacity cannot be negative"],
          default: 0,
        },
        transportAccess: {
          type: String,
          enum: ["excellent", "good", "fair", "poor"],
          default: "good",
        },
      },
    },
    recommendations: {
      type: [CropRecommendationSchema],
      validate: {
        validator: function (recommendations: ICropRecommendation[]) {
          return recommendations.length > 0 && recommendations.length <= 10;
        },
        message: "Must have between 1 and 10 recommendations",
      },
    },
    aiResponse: {
      model: { type: String, required: true },
      prompt: { type: String, required: true },
      rawResponse: { type: String, required: true },
      processingTime: {
        type: Number,
        required: true,
        min: [0, "Processing time cannot be negative"],
      },
      confidence: {
        type: Number,
        required: true,
        min: [0, "Confidence cannot be negative"],
        max: [100, "Confidence cannot exceed 100"],
      },
      version: { type: String, required: true },
    },
    weatherContext: {
      current: {
        temperature: Number,
        humidity: Number,
        rainfall: Number,
      },
      forecast: [
        {
          date: Date,
          temperature: {
            min: Number,
            max: Number,
          },
          rainfall: Number,
          conditions: String,
        },
      ],
      seasonalTrends: {
        rainfall: Number,
        temperature: Number,
        humidity: Number,
      },
    },
    marketContext: {
      priceHistory: [
        {
          crop: String,
          date: Date,
          price: Number,
          market: String,
        },
      ],
      demandForecast: [
        {
          crop: String,
          month: String,
          demand: {
            type: String,
            enum: ["low", "medium", "high"],
          },
          priceProjection: Number,
        },
      ],
      competitiveAnalysis: {
        nearbyFarms: Number,
        popularCrops: [String],
        marketSaturation: {
          type: String,
          enum: ["low", "medium", "high"],
        },
      },
    },
    feedback: {
      rating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"],
      },
      comments: String,
      implemented: { type: Boolean, default: false },
      implementedCrops: [String],
      actualResults: [
        {
          crop: String,
          actualYield: Number,
          actualRevenue: Number,
          actualROI: Number,
          notes: String,
        },
      ],
      submittedAt: Date,
    },
    followUp: {
      nextReviewDate: Date,
      remindersSent: { type: Number, default: 0 },
      currentStatus: {
        type: String,
        enum: ["pending", "in_progress", "completed", "abandoned"],
        default: "pending",
      },
      activities: [
        {
          type: {
            type: String,
            enum: ["reminder", "check_in", "update", "completion"],
            required: true,
          },
          date: { type: Date, default: Date.now },
          message: { type: String, required: true },
          response: String,
        },
      ],
    },
    validUntil: {
      type: Date,
      required: true,
      default: function () {
        return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days from now
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
CropAdvisorySchema.index({ user: 1, createdAt: -1 });
CropAdvisorySchema.index({ farm: 1 });
CropAdvisorySchema.index({
  "requestDetails.location.state": 1,
  "requestDetails.location.district": 1,
});
CropAdvisorySchema.index({ "requestDetails.season": 1 });
CropAdvisorySchema.index({ validUntil: 1 });
CropAdvisorySchema.index({ isActive: 1 });
CropAdvisorySchema.index({ "recommendations.crop": 1 });

// Virtual for top recommendation
CropAdvisorySchema.virtual("topRecommendation").get(function () {
  if ((this.recommendations as any).length === 0) return null;
  return (this.recommendations as any).reduce(
    (top: ICropRecommendation, current: ICropRecommendation) => {
      return current.confidence > top.confidence ? current : top;
    },
  );
});

// Virtual for average ROI
CropAdvisorySchema.virtual("averageROI").get(function () {
  if ((this.recommendations as any).length === 0) return 0;
  const totalROI = (this.recommendations as any).reduce(
    (sum: number, rec: ICropRecommendation) => sum + rec.roi,
    0,
  );
  return (
    Math.round((totalROI / (this.recommendations as any).length) * 100) / 100
  );
});

// Virtual for implementation rate
CropAdvisorySchema.virtual("implementationRate").get(function () {
  if (!(this.feedback as any)?.implementedCrops) return 0;
  const implementedCount = (this.feedback as any).implementedCrops.length;
  const totalRecommendations = (this.recommendations as any).length;
  return totalRecommendations > 0
    ? Math.round((implementedCount / totalRecommendations) * 100)
    : 0;
});

// Virtual for success rate (based on feedback)
CropAdvisorySchema.virtual("successRate").get(function () {
  if (!(this.feedback as any)?.actualResults) return null;

  const successfulCrops = (this.feedback as any).actualResults.filter(
    (result: any) => {
      const recommendation = (this.recommendations as any).find(
        (rec: ICropRecommendation) => rec.crop === result.crop,
      );
      if (!recommendation) return false;

      // Consider successful if actual yield is within 20% of predicted yield
      const yieldDifference =
        Math.abs(result.actualYield - recommendation.expectedYield) /
        recommendation.expectedYield;
      return yieldDifference <= 0.2;
    },
  );

  return Math.round(
    (successfulCrops.length / (this.feedback as any).actualResults.length) *
      100,
  );
});

// Virtual for validity status
CropAdvisorySchema.virtual("isValid").get(function () {
  const expiry = new Date(this.validUntil as any);
  return new Date() <= expiry;
});

// Static method to find advisories by crop
CropAdvisorySchema.statics.findByCrop = function (cropName: string) {
  return this.find({
    "recommendations.crop": { $regex: new RegExp(cropName, "i") },
    isActive: true,
  });
};

// Static method to find advisories by location
CropAdvisorySchema.statics.findByLocation = function (
  state: string,
  district?: string,
) {
  const query: any = {
    "requestDetails.location.state": state,
    isActive: true,
  };
  if (district) {
    query["requestDetails.location.district"] = district;
  }
  return this.find(query);
};

// Static method to get analytics for a region
CropAdvisorySchema.statics.getRegionalAnalytics = function (
  state: string,
  district?: string,
) {
  const matchStage: any = {
    "requestDetails.location.state": state,
    isActive: true,
  };
  if (district) {
    matchStage["requestDetails.location.district"] = district;
  }

  return this.aggregate([
    { $match: matchStage },
    { $unwind: "$recommendations" },
    {
      $group: {
        _id: "$recommendations.crop",
        count: { $sum: 1 },
        averageROI: { $avg: "$recommendations.roi" },
        averageYield: { $avg: "$recommendations.expectedYield" },
        averageInvestment: { $avg: "$recommendations.investmentRequired" },
        riskLevels: { $push: "$recommendations.riskLevel" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 20 },
  ]);
};

// Instance method to add feedback
CropAdvisorySchema.methods.addFeedback = function (feedbackData: any) {
  this.feedback = {
    ...feedbackData,
    submittedAt: new Date(),
  };
  return this.save();
};

// Instance method to update follow-up status
CropAdvisorySchema.methods.updateFollowUpStatus = function (
  status: string,
  message: string,
) {
  if (!this.followUp) {
    this.followUp = {
      nextReviewDate: new Date(),
      remindersSent: 0,
      currentStatus: status as any,
      activities: [],
    };
  }

  this.followUp.currentStatus = status as any;
  this.followUp.activities.push({
    type: "update",
    date: new Date(),
    message: message,
  });

  return this.save();
};

// Pre-save middleware to set next review date
CropAdvisorySchema.pre("save", function (next) {
  if (this.isNew && !(this.followUp as any)?.nextReviewDate) {
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + 30); // 30 days for first review

    if (!this.followUp) {
      this.followUp = {
        nextReviewDate: reviewDate,
        remindersSent: 0,
        currentStatus: "pending",
        activities: [],
      };
    } else {
      (this.followUp as any).nextReviewDate = reviewDate;
    }
  }
  next();
});

export default mongoose.model<ICropAdvisory>(
  "CropAdvisory",
  CropAdvisorySchema,
);
