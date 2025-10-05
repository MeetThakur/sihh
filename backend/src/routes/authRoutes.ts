import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  deactivateAccount,
  verifyEmail,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Validation rules
const registerValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),
  body("role")
    .optional()
    .isIn(["farmer", "advisor", "admin"])
    .withMessage("Role must be farmer, advisor, or admin"),
  body("profile.farmSize")
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage("Farm size must be at least 0.1 acres"),
  body("profile.location.state")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("State is required if location is provided"),
  body("profile.location.district")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("District is required if location is provided"),
  body("profile.soilType")
    .optional()
    .isIn(["clay", "sandy", "loamy", "silt", "peat", "chalk"])
    .withMessage("Invalid soil type"),
  body("profile.farmingExperience")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Farming experience must be a positive number"),
  body("profile.preferredLanguage")
    .optional()
    .isIn(["en", "hi"])
    .withMessage("Preferred language must be English (en) or Hindi (hi)"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

const refreshTokenValidation = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

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
  body("profile.soilType")
    .optional()
    .isIn(["clay", "sandy", "loamy", "silt", "peat", "chalk"])
    .withMessage("Invalid soil type"),
  body("profile.farmingExperience")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Farming experience must be a positive number"),
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

const forgotPasswordValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
];

const resetPasswordValidation = [
  body("token").notEmpty().withMessage("Reset token is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
];

// Public routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/refresh-token", refreshTokenValidation, refreshToken);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/reset-password", resetPasswordValidation, resetPassword);
router.get("/verify-email/:token", verifyEmail);

// Protected routes
router.post("/logout", authenticate, logout);
router.post("/logout-all", authenticate, logoutAll);
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfileValidation, updateProfile);
router.post(
  "/change-password",
  authenticate,
  changePasswordValidation,
  changePassword,
);
router.post("/deactivate", authenticate, deactivateAccount);

export default router;
