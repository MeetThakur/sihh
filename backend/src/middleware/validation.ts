import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { logger } from "../config/logger";

// Middleware to validate request and return errors if any
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.type === "field" ? error.path : error.type,
      message: error.msg,
      value: error.type === "field" ? error.value : undefined,
      location: error.type === "field" ? error.location : undefined,
    }));

    logger.warn("Validation failed:", {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      errors: formattedErrors,
    });

    res.status(400).json({
      success: false,
      message: "Validation failed",
      error: "VALIDATION_ERROR",
      errors: formattedErrors,
    });
    return;
  }

  next();
};

// Run validation chains and handle errors
export const validate = (validations: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    // Run all validations
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        field: error.type === "field" ? error.path : error.type,
        message: error.msg,
        value: error.type === "field" ? error.value : undefined,
        location: error.type === "field" ? error.location : undefined,
      }));

      logger.warn("Validation failed:", {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        errors: formattedErrors,
      });

      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: "VALIDATION_ERROR",
        errors: formattedErrors,
      });
      return;
    }

    next();
  };
};

// Custom validation helper functions
export const validationHelpers = {
  // Check if value is a valid MongoDB ObjectId
  isObjectId: (value: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(value);
  },

  // Check if value is a valid Indian mobile number
  isIndianMobile: (value: string): boolean => {
    return /^[6-9]\d{9}$/.test(value.replace(/\s+/g, ""));
  },

  // Check if value is a valid Indian PIN code
  isIndianPincode: (value: string): boolean => {
    return /^[1-9][0-9]{5}$/.test(value);
  },

  // Check if value is a valid latitude
  isLatitude: (value: number): boolean => {
    return value >= -90 && value <= 90;
  },

  // Check if value is a valid longitude
  isLongitude: (value: number): boolean => {
    return value >= -180 && value <= 180;
  },

  // Check if value is a valid Indian state
  isIndianState: (value: string): boolean => {
    const indianStates = [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      "Andaman and Nicobar Islands",
      "Chandigarh",
      "Dadra and Nagar Haveli and Daman and Diu",
      "Delhi",
      "Jammu and Kashmir",
      "Ladakh",
      "Lakshadweep",
      "Puducherry",
    ];
    return indianStates.includes(value);
  },

  // Check if value is a valid crop name
  isCropName: (value: string): boolean => {
    const commonCrops = [
      "rice",
      "wheat",
      "maize",
      "bajra",
      "jowar",
      "ragi",
      "barley",
      "sugarcane",
      "cotton",
      "jute",
      "tea",
      "coffee",
      "rubber",
      "coconut",
      "areca nut",
      "cashew",
      "black pepper",
      "cardamom",
      "turmeric",
      "ginger",
      "coriander",
      "cumin",
      "fenugreek",
      "mustard",
      "sesame",
      "groundnut",
      "sunflower",
      "safflower",
      "soybean",
      "castor",
      "linseed",
      "niger",
      "potato",
      "onion",
      "tomato",
      "brinjal",
      "okra",
      "cabbage",
      "cauliflower",
      "beans",
      "peas",
      "carrot",
      "radish",
      "beetroot",
      "spinach",
      "fenugreek leaves",
      "coriander leaves",
      "mint",
      "chili",
      "capsicum",
      "cucumber",
      "bottle gourd",
      "bitter gourd",
      "ridge gourd",
      "ash gourd",
      "pumpkin",
      "watermelon",
      "muskmelon",
      "mango",
      "banana",
      "citrus",
      "apple",
      "grapes",
      "pomegranate",
      "guava",
      "papaya",
      "jackfruit",
      "sapota",
      "custard apple",
      "lentils",
      "chickpea",
      "pigeon pea",
      "black gram",
      "green gram",
      "field pea",
      "lathyrus",
      "cowpea",
      "cluster bean",
      "french bean",
    ];
    return commonCrops.some(
      (crop) =>
        value.toLowerCase().includes(crop) ||
        crop.includes(value.toLowerCase()),
    );
  },

  // Check if password meets security requirements
  isStrongPassword: (value: string): boolean => {
    // At least 8 characters, contains uppercase, lowercase, number, and special character
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(value);
  },

  // Check if value is a valid Indian GST number
  isGSTNumber: (value: string): boolean => {
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(value);
  },

  // Check if value is a valid Aadhaar number
  isAadhaar: (value: string): boolean => {
    const aadhaarRegex = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
    return aadhaarRegex.test(value.replace(/\s+/g, ""));
  },

  // Check if value is a valid PAN number
  isPAN: (value: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(value.toUpperCase());
  },

  // Check if value is a valid bank account number
  isBankAccount: (value: string): boolean => {
    // Indian bank account numbers are typically 9-18 digits
    const bankAccountRegex = /^[0-9]{9,18}$/;
    return bankAccountRegex.test(value);
  },

  // Check if value is a valid IFSC code
  isIFSC: (value: string): boolean => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(value.toUpperCase());
  },

  // Sanitize and validate file upload
  isValidFileType: (filename: string, allowedTypes: string[]): boolean => {
    const fileExtension = filename.split(".").pop()?.toLowerCase();
    return fileExtension ? allowedTypes.includes(fileExtension) : false;
  },

  // Check if value is a valid URL
  isValidURL: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  // Check if value is a valid image base64 string
  isValidBase64Image: (value: string): boolean => {
    const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    return base64Regex.test(value);
  },

  // Check if date is within valid range
  isValidDateRange: (date: Date, minDate?: Date, maxDate?: Date): boolean => {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  },

  // Check if value is a valid Indian vehicle number
  isVehicleNumber: (value: string): boolean => {
    const vehicleRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/;
    return vehicleRegex.test(value.replace(/\s+/g, "").toUpperCase());
  },

  // Validate Indian agricultural land survey number
  isSurveyNumber: (value: string): boolean => {
    // Survey numbers can vary by state but typically contain numbers and slashes
    const surveyRegex = /^[0-9]+([\/\-][0-9]+)*$/;
    return surveyRegex.test(value);
  },

  // Check if value is a valid Indian farmer ID
  isFarmerID: (value: string): boolean => {
    // Farmer IDs vary by state, general pattern check
    const farmerIdRegex = /^[A-Z0-9\-\/]{8,20}$/;
    return farmerIdRegex.test(value.toUpperCase());
  },
};

// Create custom validation chains
export const customValidations = {
  objectId: (field: string, optional: boolean = false) => {
    const validation = (req: Request) => {
      const value = req.body[field] || req.params[field] || req.query[field];
      if (optional && !value) return true;
      return validationHelpers.isObjectId(value);
    };
    return validation;
  },

  indianMobile: (field: string, optional: boolean = false) => {
    const validation = (req: Request) => {
      const value = req.body[field];
      if (optional && !value) return true;
      return validationHelpers.isIndianMobile(value);
    };
    return validation;
  },

  strongPassword: (field: string) => {
    const validation = (req: Request) => {
      const value = req.body[field];
      return validationHelpers.isStrongPassword(value);
    };
    return validation;
  },
};

// Error response formatter
export const formatValidationError = (errors: any[]) => {
  return {
    success: false,
    message: "Validation failed",
    error: "VALIDATION_ERROR",
    errors: errors.map((error) => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
      location: error.location,
    })),
  };
};

// Async validation wrapper
export const asyncValidation = (fn: Function) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      logger.error("Async validation error:", error);
      res.status(500).json({
        success: false,
        message: "Validation error",
        error: "ASYNC_VALIDATION_ERROR",
      });
    }
  };
};

export default {
  validateRequest,
  validate,
  validationHelpers,
  customValidations,
  formatValidationError,
  asyncValidation,
};
