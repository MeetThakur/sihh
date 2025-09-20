import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { logger } from "../config/logger";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      token?: string;
    }
  }
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Main authentication middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
        error: "MISSING_TOKEN",
      });
      return;
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error("JWT_SECRET is not defined in environment variables");
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: "MISSING_JWT_SECRET",
      });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // Get user from database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Token is valid but user not found",
        error: "USER_NOT_FOUND",
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: "Account has been deactivated",
        error: "ACCOUNT_DEACTIVATED",
      });
      return;
    }

    // Attach user and token to request object
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    logger.error("Authentication error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
        error: "INVALID_TOKEN",
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Token has expired",
        error: "TOKEN_EXPIRED",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: "AUTH_ERROR",
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.header("Authorization");
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    if (!token) {
      return next(); // Continue without authentication
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next(); // Continue without authentication
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    const user = await User.findById(decoded.userId).select("-password");

    if (user && user.isActive) {
      req.user = user;
      req.token = token;
    }

    next();
  } catch (error) {
    // Log error but don't fail the request
    logger.warn("Optional authentication failed:", error);
    next();
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
        error: "NOT_AUTHENTICATED",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `Authorization failed for user ${req.user._id}. Required: ${roles}, Has: ${req.user.role}`,
      );
      res.status(403).json({
        success: false,
        message: "Insufficient permissions",
        error: "INSUFFICIENT_PERMISSIONS",
      });
      return;
    }

    next();
  };
};

// Admin only middleware
export const adminOnly = authorize("admin");

// Advisor or Admin middleware
export const advisorOrAdmin = authorize("advisor", "admin");

// Farmer, Advisor, or Admin middleware
export const authenticated = authorize("farmer", "advisor", "admin");

// Check if user owns the resource or is admin
export const ownerOrAdmin = (resourceOwnerField: string = "user") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        error: "NOT_AUTHENTICATED",
      });
    }

    // Admin can access everything
    if (req.user.role === "admin") {
      return next();
    }

    // Check if user owns the resource
    const resourceOwnerId =
      req.params[resourceOwnerField] || req.body[resourceOwnerField];
    if (
      resourceOwnerId &&
      resourceOwnerId.toString() === req.user._id.toString()
    ) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied. You can only access your own resources.",
      error: "OWNERSHIP_REQUIRED",
    });
  };
};

// Middleware to check subscription access
export const checkSubscription = (requiredPlan: "basic" | "premium") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        error: "NOT_AUTHENTICATED",
      });
    }

    // Admin always has access
    if (req.user.role === "admin") {
      return next();
    }

    const userPlan = req.user.subscription?.plan || "free";
    const planHierarchy = { free: 0, basic: 1, premium: 2 };

    if (planHierarchy[userPlan] < planHierarchy[requiredPlan]) {
      return res.status(403).json({
        success: false,
        message: `This feature requires a ${requiredPlan} subscription`,
        error: "SUBSCRIPTION_REQUIRED",
        requiredPlan,
      });
    }

    // Check if subscription is not expired
    if (
      req.user.subscription?.expiresAt &&
      new Date() > req.user.subscription.expiresAt
    ) {
      return res.status(403).json({
        success: false,
        message: "Your subscription has expired",
        error: "SUBSCRIPTION_EXPIRED",
      });
    }

    next();
  };
};

// Rate limiting based on user role
export const roleBasedRateLimit = () => {
  const limits = {
    admin: Infinity,
    advisor: 1000, // requests per hour
    farmer: 100, // requests per hour
  };

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(); // Let other middleware handle authentication
    }

    const userLimit =
      limits[req.user.role as keyof typeof limits] || limits.farmer;

    // This is a simplified rate limiting - in production, you'd use Redis or similar
    // For now, we'll just attach the limit to the request for other middleware to use
    (req as any).userRateLimit = userLimit;

    next();
  };
};

// Middleware to validate API key for external services
export const validateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const apiKey = req.header("X-API-Key");
  const validApiKeys = process.env.VALID_API_KEYS?.split(",") || [];

  if (!apiKey || !validApiKeys.includes(apiKey)) {
    res.status(401).json({
      success: false,
      message: "Invalid or missing API key",
      error: "INVALID_API_KEY",
    });
    return;
  }

  next();
};

// Generate JWT token
export const generateToken = (user: IUser): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn } as jwt.SignOptions,
  );
};

// Generate refresh token
export const generateRefreshToken = (user: IUser): string => {
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

  if (!jwtRefreshSecret) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }

  return jwt.sign(
    {
      userId: user._id.toString(),
      type: "refresh",
    },
    jwtRefreshSecret,
    { expiresIn: jwtRefreshExpiresIn } as jwt.SignOptions,
  );
};

// Verify refresh token
export const verifyRefreshToken = (token: string): { userId: string } => {
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtRefreshSecret) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }

  const decoded = jwt.verify(token, jwtRefreshSecret) as any;

  if (decoded.type !== "refresh") {
    throw new Error("Invalid token type");
  }

  return { userId: decoded.userId };
};

// Middleware to extract user info from token without requiring authentication
export const extractUserInfo = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.header("Authorization");
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    if (token) {
      const jwtSecret = process.env.JWT_SECRET;
      if (jwtSecret) {
        const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
        (req as any).tokenInfo = {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        };
      }
    }
  } catch (error) {
    // Silently ignore errors for optional token extraction
  }

  next();
};
