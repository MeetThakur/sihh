import { Router } from "express";
import { query } from "express-validator";
import {
  getCurrentWeather,
  getWeatherForecast,
  getWeatherAlerts,
  searchLocations,
  getHistoricalWeather,
} from "../controllers/weatherController";

const router = Router();

// Get current weather
router.get(
  "/current",
  [
    query("lat")
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage("Invalid latitude"),
    query("lon")
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Invalid longitude"),
    query("location")
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Location must be a non-empty string"),
  ],
  getCurrentWeather,
);

// Get weather forecast
router.get(
  "/forecast",
  [
    query("lat")
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage("Invalid latitude"),
    query("lon")
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Invalid longitude"),
    query("location")
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Location must be a non-empty string"),
    query("days")
      .optional()
      .isInt({ min: 1, max: 14 })
      .withMessage("Days must be between 1 and 14"),
  ],
  getWeatherForecast,
);

// Get weather alerts and agricultural recommendations
router.get(
  "/alerts",
  [
    query("lat")
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage("Invalid latitude"),
    query("lon")
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Invalid longitude"),
    query("location")
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Location must be a non-empty string"),
  ],
  getWeatherAlerts,
);

// Search locations (autocomplete)
router.get(
  "/search",
  [
    query("q")
      .isString()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Search query must be at least 2 characters"),
  ],
  searchLocations,
);

// Get historical weather data
router.get(
  "/historical",
  [
    query("lat")
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage("Invalid latitude"),
    query("lon")
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Invalid longitude"),
    query("location")
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Location must be a non-empty string"),
    query("date")
      .isString()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Date must be in YYYY-MM-DD format"),
  ],
  getHistoricalWeather,
);

export default router;
