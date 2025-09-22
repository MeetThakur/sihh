import { Router } from "express";
import { body, param } from "express-validator";
import {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
  getFarmStats,
  getDashboardData,
  updatePlot,
  bulkUpdatePlots,
  bulkClearPlots,
  addPlotActivity,
} from "../controllers/farmController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Validation rules for farm creation
const createFarmValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Farm name must be between 2 and 100 characters"),
  body("totalSize")
    .isFloat({ min: 0.1 })
    .withMessage("Farm size must be at least 0.1 acres"),
  body("location.address")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters"),
  body("location.state")
    .trim()
    .isLength({ min: 2 })
    .withMessage("State is required"),
  body("location.district")
    .trim()
    .isLength({ min: 2 })
    .withMessage("District is required"),
  body("soilType")
    .optional()
    .isIn([
      "clay",
      "sandy",
      "loamy",
      "silt",
      "peat",
      "chalk",
      "alluvial",
      "black",
      "red",
      "laterite",
    ])
    .withMessage("Invalid soil type"),
  body("irrigationType")
    .optional()
    .isIn(["drip", "sprinkler", "flood", "manual"])
    .withMessage("Invalid irrigation type"),
  body("registrationNumber")
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage("Registration number must be between 5 and 50 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
];

// Validation rules for farm updates
const updateFarmValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Farm name must be between 2 and 100 characters"),
  body("totalSize")
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage("Farm size must be at least 0.1 acres"),
  body("location.address")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters"),
  body("location.state")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("State is required"),
  body("location.district")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("District is required"),
  body("soilType")
    .optional()
    .isIn([
      "clay",
      "sandy",
      "loamy",
      "silt",
      "peat",
      "chalk",
      "alluvial",
      "black",
      "red",
      "laterite",
    ])
    .withMessage("Invalid soil type"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
];

// Validation for plot updates
const updatePlotValidation = [
  param("farmId").isMongoId().withMessage("Invalid farm ID"),
  param("plotNumber")
    .isInt({ min: 1 })
    .withMessage("Plot number must be a positive integer"),
  body("crop.name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Crop name must be at least 2 characters"),
  body("crop.variety")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Crop variety must be at least 2 characters"),
  body("crop.stage")
    .optional()
    .isIn([
      "planted",
      "growing",
      "flowering",
      "ready_to_harvest",
      "harvested",
      "fallow",
    ])
    .withMessage("Invalid crop stage"),
  body("crop.health")
    .optional()
    .isIn(["excellent", "good", "fair", "poor", "critical"])
    .withMessage("Invalid health status"),
  body("soilHealth.ph")
    .optional()
    .isFloat({ min: 0, max: 14 })
    .withMessage("pH must be between 0 and 14"),
  body("soilHealth.nitrogen")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Nitrogen level must be non-negative"),
  body("soilHealth.phosphorus")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Phosphorus level must be non-negative"),
  body("soilHealth.potassium")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Potassium level must be non-negative"),
  body("soilHealth.moisture")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Moisture percentage must be between 0 and 100"),
];

// Validation for adding activities
const addActivityValidation = [
  param("farmId").isMongoId().withMessage("Invalid farm ID"),
  param("plotNumber")
    .isInt({ min: 1 })
    .withMessage("Plot number must be a positive integer"),
  body("type")
    .isIn([
      "planting",
      "watering",
      "fertilizing",
      "pesticide",
      "weeding",
      "harvesting",
      "soil_test",
      "other",
    ])
    .withMessage("Invalid activity type"),
  body("description")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Description must be between 5 and 200 characters"),
  body("date").optional().isISO8601().withMessage("Invalid date format"),
  body("cost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Cost must be non-negative"),
  body("laborHours")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Labor hours must be non-negative"),
];

// Bulk plot operations validation
const bulkUpdatePlotsValidation = [
  param("farmId").isMongoId().withMessage("Invalid farm ID"),
  body("plotNumbers")
    .isArray({ min: 1 })
    .withMessage("plotNumbers must be a non-empty array"),
  body("plotNumbers.*")
    .custom((value) => {
      const num = Number(value);
      if (!Number.isInteger(num) || num < 1) {
        throw new Error("Each plot number must be a positive integer");
      }
      return true;
    })
    .customSanitizer((value) => Number(value)),
  body("plotData").isObject().withMessage("plotData must be an object"),
];

const bulkClearPlotsValidation = [
  param("farmId").isMongoId().withMessage("Invalid farm ID"),
  body("plotNumbers")
    .isArray({ min: 1 })
    .withMessage("plotNumbers must be a non-empty array"),
  body("plotNumbers.*")
    .custom((value) => {
      const num = Number(value);
      if (!Number.isInteger(num) || num < 1) {
        throw new Error("Each plot number must be a positive integer");
      }
      return true;
    })
    .customSanitizer((value) => Number(value)),
];

// Farm ID parameter validation
const farmIdValidation = [
  param("id").isMongoId().withMessage("Invalid farm ID"),
];

// All routes require authentication
router.use(authenticate);

// Farm management routes
router.get("/", getFarms);
router.get("/dashboard", getDashboardData);
router.get("/stats", getFarmStats);
router.post("/", createFarmValidation, createFarm);
router.get("/:id", farmIdValidation, getFarmById);
router.put("/:id", farmIdValidation, updateFarmValidation, updateFarm);
router.delete("/:id", farmIdValidation, deleteFarm);

// Plot management routes - specific routes first, then parameterized routes
router.put(
  "/:farmId/plots/bulk-update",
  bulkUpdatePlotsValidation,
  bulkUpdatePlots,
);
router.put(
  "/:farmId/plots/bulk-clear",
  bulkClearPlotsValidation,
  bulkClearPlots,
);
router.put("/:farmId/plots/:plotNumber", updatePlotValidation, updatePlot);

router.post(
  "/:farmId/plots/:plotNumber/activities",
  addActivityValidation,
  addPlotActivity,
);

export default router;
