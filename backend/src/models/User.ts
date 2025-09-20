import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: "farmer" | "advisor" | "admin";
  profile: {
    farmSize?: number; // in acres
    location?: {
      state: string;
      district: string;
      village?: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    soilType?: "clay" | "sandy" | "loamy" | "silt" | "peat" | "chalk";
    farmingExperience?: number; // in years
    primaryCrops?: string[];
    preferredLanguage: "en" | "hi";
    avatar?: string;
  };
  subscription?: {
    plan: "free" | "basic" | "premium";
    expiresAt?: Date;
    features: string[];
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      weatherAlerts: boolean;
      pestAlerts: boolean;
      marketUpdates: boolean;
    };
    units: {
      area: "acres" | "hectares";
      temperature: "celsius" | "fahrenheit";
      currency: "INR" | "USD";
    };
  };
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: Date;
  refreshTokens: string[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateResetPasswordToken(): string;
  generateEmailVerificationToken(): string;
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Don't include password in queries by default
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?[\d\s-()]+$/, "Please provide a valid phone number"],
    },
    role: {
      type: String,
      enum: ["farmer", "advisor", "admin"],
      default: "farmer",
    },
    profile: {
      farmSize: {
        type: Number,
        min: [0, "Farm size cannot be negative"],
      },
      location: {
        state: String,
        district: String,
        village: String,
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
      soilType: {
        type: String,
        enum: ["clay", "sandy", "loamy", "silt", "peat", "chalk"],
      },
      farmingExperience: {
        type: Number,
        min: [0, "Farming experience cannot be negative"],
      },
      primaryCrops: [
        {
          type: String,
          trim: true,
        },
      ],
      preferredLanguage: {
        type: String,
        enum: ["en", "hi"],
        default: "en",
      },
      avatar: String,
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "premium"],
        default: "free",
      },
      expiresAt: Date,
      features: [
        {
          type: String,
        },
      ],
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
        weatherAlerts: { type: Boolean, default: true },
        pestAlerts: { type: Boolean, default: true },
        marketUpdates: { type: Boolean, default: false },
      },
      units: {
        area: { type: String, enum: ["acres", "hectares"], default: "acres" },
        temperature: {
          type: String,
          enum: ["celsius", "fahrenheit"],
          default: "celsius",
        },
        currency: { type: String, enum: ["INR", "USD"], default: "INR" },
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
    refreshTokens: [
      {
        type: String,
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({
  "profile.location.state": 1,
  "profile.location.district": 1,
});
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to check password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate reset password token
UserSchema.methods.generateResetPasswordToken = function (): string {
  const crypto = require("crypto");
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return resetToken;
};

// Instance method to generate email verification token
UserSchema.methods.generateEmailVerificationToken = function (): string {
  const crypto = require("crypto");
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  return verificationToken;
};

// Virtual for user's full profile completion percentage
UserSchema.virtual("profileCompletion").get(function (this: IUser) {
  let completedFields = 0;
  const totalFields = 8;

  if (this.name) completedFields++;
  if (this.phone) completedFields++;
  if ((this.profile as any)?.farmSize) completedFields++;
  if ((this.profile as any)?.location?.state) completedFields++;
  if ((this.profile as any)?.soilType) completedFields++;
  if ((this.profile as any)?.farmingExperience !== undefined) completedFields++;
  if ((this.profile as any)?.primaryCrops?.length) completedFields++;
  if ((this.profile as any)?.avatar) completedFields++;

  return Math.round((completedFields / totalFields) * 100);
});

// Virtual for subscription status
UserSchema.virtual("subscriptionStatus").get(function (this: IUser) {
  if (!(this.subscription as any)?.expiresAt) return "active";

  const now = new Date();
  const expiresAt = new Date((this.subscription as any).expiresAt);

  if (now > expiresAt) return "expired";

  const daysUntilExpiry = Math.ceil(
    (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysUntilExpiry <= 7) return "expiring_soon";

  return "active";
});

// Static method to find users by location
UserSchema.statics.findByLocation = function (
  state: string,
  district?: string,
) {
  const query: any = { "profile.location.state": state };
  if (district) {
    query["profile.location.district"] = district;
  }
  return this.find(query);
};

// Static method to find farmers by crop
UserSchema.statics.findByCrop = function (crop: string) {
  return this.find({
    "profile.primaryCrops": { $in: [crop] },
    role: "farmer",
  });
};

export default mongoose.model<IUser>("User", UserSchema);
