import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/database";
import { logger, morganStream } from "./config/logger";

// Import routes
import authRoutes from "./routes/authRoutes";
import farmRoutes from "./routes/farmRoutes";
import cropAdvisoryRoutes from "./routes/cropAdvisoryRoutes";
import aiRoutes from "./routes/aiRoutes";
import weatherRoutes from "./routes/weatherRoutes";
import marketRoutes from "./routes/marketRoutes";
import userRoutes from "./routes/userRoutes";
import healthRoutes from "./routes/healthRoutes";

// Import middleware
import { authenticate, optionalAuth } from "./middleware/auth";
import errorHandler from "./middleware/errorHandler";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Trust proxy for accurate IP addresses (important for rate limiting)
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://api.openweathermap.org",
          "https://generativelanguage.googleapis.com",
        ],
      },
    },
  }),
);

// CORS configuration - Permissive for development
const corsOptions = {
  origin: true, // Allow all origins for development
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-API-Key",
    "X-Requested-With",
  ],
};

app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use(morgan("combined", { stream: morganStream }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || "100"), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
    error: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: "Too many requests from this IP, please try again later.",
      error: "RATE_LIMIT_EXCEEDED",
    });
  },
});

// Apply rate limiting to all requests
app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
    error: "AUTH_RATE_LIMIT_EXCEEDED",
  },
  skipSuccessfulRequests: true,
});

// API Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", authenticate, userRoutes);
app.use("/api/farms", authenticate, farmRoutes);
app.use("/api/crop-advisory", authenticate, cropAdvisoryRoutes);
app.use("/api/ai", authenticate, aiRoutes);
app.use("/api/weather", optionalAuth, weatherRoutes);
app.use("/api/market", optionalAuth, marketRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to KhetSetu API",
    version: "1.0.0",
    documentation: "/api/docs",
    status: "active",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      users: "/api/users",
      farms: "/api/farms",
      cropAdvisory: "/api/crop-advisory",
      ai: "/api/ai",
      weather: "/api/weather",
      market: "/api/market",
    },
  });
});

// API documentation route (placeholder)
app.get("/api/docs", (req, res) => {
  res.json({
    success: true,
    message: "KhetSetu API Documentation",
    version: "1.0.0",
    description: "Smart Agricultural Platform API",
    endpoints: {
      authentication: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        logout: "POST /api/auth/logout",
        refreshToken: "POST /api/auth/refresh-token",
        forgotPassword: "POST /api/auth/forgot-password",
        resetPassword: "POST /api/auth/reset-password",
      },
      users: {
        getProfile: "GET /api/users/profile",
        updateProfile: "PUT /api/users/profile",
        changePassword: "POST /api/users/change-password",
        deactivateAccount: "POST /api/users/deactivate",
      },
      farms: {
        getAllFarms: "GET /api/farms",
        getFarm: "GET /api/farms/:id",
        createFarm: "POST /api/farms",
        updateFarm: "PUT /api/farms/:id",
        deleteFarm: "DELETE /api/farms/:id",
        addPlot: "POST /api/farms/:id/plots",
        updatePlot: "PUT /api/farms/:id/plots/:plotNumber",
        addActivity: "POST /api/farms/:id/plots/:plotNumber/activities",
      },
      cropAdvisory: {
        getCropRecommendations: "POST /api/crop-advisory/recommendations",
        getAdvisoryHistory: "GET /api/crop-advisory/history",
        getAdvisory: "GET /api/crop-advisory/:id",
        submitFeedback: "POST /api/crop-advisory/:id/feedback",
      },
      ai: {
        chat: "POST /api/ai/chat",
        cropAdvice: "POST /api/ai/crop-advice",
        pestIdentification: "POST /api/ai/pest-identification",
        soilAnalysis: "POST /api/ai/soil-analysis",
      },
      weather: {
        getCurrentWeather: "GET /api/weather/current",
        getForecast: "GET /api/weather/forecast",
        getWeatherAlerts: "GET /api/weather/alerts",
      },
      market: {
        getCropPrices: "GET /api/market/prices",
        getMarketTrends: "GET /api/market/trends",
        getDemandForecast: "GET /api/market/demand-forecast",
      },
    },
  });
});

// Health check for load balancers
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
  });
});

// Handle 404 for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: "ROUTE_NOT_FOUND",
  });
});

// Global error handler (must be last middleware)
app.use(errorHandler);

// Graceful shutdown handling
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Process terminated");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Process terminated");
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🌾 KhetSetu API Server running on port ${PORT}`);
  logger.info(
    `📖 API Documentation available at http://localhost:${PORT}/api/docs`,
  );
  logger.info(`🏥 Health check available at http://localhost:${PORT}/health`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
