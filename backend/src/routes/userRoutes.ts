import { Router } from "express";
import { body, param } from "express-validator";
import {
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount,
} from "../controllers/authController";
import { authorize } from "../middleware/auth";

const router = Router();

// Validation rules for profile update
const updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),
  body("profile.farmSize")
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage("Farm size must be at least 0.1 acres"),
  body("profile.location.state")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Invalid state"),
  body("profile.location.district")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Invalid district"),
  body("profile.location.village")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Village name must be between 2 and 100 characters"),
  body("profile.location.coordinates.latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),
  body("profile.location.coordinates.longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),
  body("profile.soilType")
    .optional()
    .isIn(["clay", "sandy", "loamy", "silt", "peat", "chalk"])
    .withMessage("Invalid soil type"),
  body("profile.farmingExperience")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Farming experience must be a positive number"),
  body("profile.primaryCrops")
    .optional()
    .isArray({ max: 10 })
    .withMessage("Primary crops must be an array with maximum 10 items"),
  body("profile.primaryCrops.*")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Each crop name must be between 2 and 50 characters"),
  body("profile.preferredLanguage")
    .optional()
    .isIn(["en", "hi"])
    .withMessage("Preferred language must be English (en) or Hindi (hi)"),
  body("preferences.notifications.email")
    .optional()
    .isBoolean()
    .withMessage("Email notification preference must be boolean"),
  body("preferences.notifications.sms")
    .optional()
    .isBoolean()
    .withMessage("SMS notification preference must be boolean"),
  body("preferences.notifications.push")
    .optional()
    .isBoolean()
    .withMessage("Push notification preference must be boolean"),
  body("preferences.notifications.weatherAlerts")
    .optional()
    .isBoolean()
    .withMessage("Weather alerts preference must be boolean"),
  body("preferences.notifications.pestAlerts")
    .optional()
    .isBoolean()
    .withMessage("Pest alerts preference must be boolean"),
  body("preferences.notifications.marketUpdates")
    .optional()
    .isBoolean()
    .withMessage("Market updates preference must be boolean"),
  body("preferences.units.area")
    .optional()
    .isIn(["acres", "hectares"])
    .withMessage("Area unit must be acres or hectares"),
  body("preferences.units.temperature")
    .optional()
    .isIn(["celsius", "fahrenheit"])
    .withMessage("Temperature unit must be celsius or fahrenheit"),
  body("preferences.units.currency")
    .optional()
    .isIn(["INR", "USD"])
    .withMessage("Currency must be INR or USD"),
];

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
];

// Get current user profile
router.get("/profile", getProfile);

// Update user profile
router.put("/profile", updateProfileValidation, updateProfile);

// Change password
router.post("/change-password", changePasswordValidation, changePassword);

// Deactivate account
router.post("/deactivate", deactivateAccount);

// Get user statistics (for dashboard)
router.get("/stats", async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
        error: "NOT_AUTHENTICATED",
      });
    }

    // This would typically fetch from various collections
    // For now, return mock data
    const stats = {
      farmsCount: 1,
      totalFarmSize: user.profile?.farmSize || 0,
      activeCrops: user.profile?.primaryCrops?.length || 0,
      advisoriesReceived: 0,
      profileCompletion: (user as any).profileCompletion || 0,
      memberSince: user.createdAt,
      lastLogin: user.lastLogin,
    };

    res.json({
      success: true,
      message: "User statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user statistics",
      error: "STATS_ERROR",
    });
  }
});

// Get user activity log
router.get("/activity", async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
        error: "NOT_AUTHENTICATED",
      });
    }

    // Mock activity data - in real app, this would come from activity logs
    const activities = [
      {
        type: "profile_update",
        description: "Updated profile information",
        timestamp: new Date(),
        details: { field: "farmSize" },
      },
      {
        type: "login",
        description: "Logged into account",
        timestamp: user.lastLogin || new Date(),
        details: { ip: req.ip },
      },
    ];

    res.json({
      success: true,
      message: "User activity retrieved successfully",
      data: {
        activities,
        total: activities.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user activity",
      error: "ACTIVITY_ERROR",
    });
  }
});

// Update notification preferences
router.put(
  "/preferences/notifications",
  [
    body("email").optional().isBoolean(),
    body("sms").optional().isBoolean(),
    body("push").optional().isBoolean(),
    body("weatherAlerts").optional().isBoolean(),
    body("pestAlerts").optional().isBoolean(),
    body("marketUpdates").optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
          error: "NOT_AUTHENTICATED",
        });
      }

      const notifications = req.body;

      // Update user preferences
      Object.keys(notifications).forEach((key) => {
        if (
          user.preferences?.notifications &&
          key in user.preferences.notifications
        ) {
          (user.preferences.notifications as any)[key] = notifications[key];
        }
      });

      await user.save();

      res.json({
        success: true,
        message: "Notification preferences updated successfully",
        data: {
          notifications: user.preferences?.notifications,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update notification preferences",
        error: "PREFERENCES_UPDATE_ERROR",
      });
    }
  },
);

// Update unit preferences
router.put(
  "/preferences/units",
  [
    body("area").optional().isIn(["acres", "hectares"]),
    body("temperature").optional().isIn(["celsius", "fahrenheit"]),
    body("currency").optional().isIn(["INR", "USD"]),
  ],
  async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
          error: "NOT_AUTHENTICATED",
        });
      }

      const units = req.body;

      // Update user preferences
      Object.keys(units).forEach((key) => {
        if (user.preferences?.units && key in user.preferences.units) {
          (user.preferences.units as any)[key] = units[key];
        }
      });

      await user.save();

      res.json({
        success: true,
        message: "Unit preferences updated successfully",
        data: {
          units: user.preferences?.units,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update unit preferences",
        error: "PREFERENCES_UPDATE_ERROR",
      });
    }
  },
);

export default router;
