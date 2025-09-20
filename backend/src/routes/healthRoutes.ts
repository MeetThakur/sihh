import { Router } from "express";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { checkDatabaseHealth } from "../config/database";
import { logger } from "../config/logger";

const router = Router();

// Basic health check
router.get("/", async (req: Request, res: Response) => {
  try {
    const healthData = {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      memory: {
        used:
          Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
          100,
        total:
          Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
          100,
        external:
          Math.round((process.memoryUsage().external / 1024 / 1024) * 100) /
          100,
        rss: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
      },
      cpu: {
        loadAverage:
          process.platform !== "win32" ? require("os").loadavg() : null,
        arch: process.arch,
        platform: process.platform,
      },
    };

    res.status(200).json({
      success: true,
      message: "Server is healthy",
      data: healthData,
    });
  } catch (error) {
    logger.error("Health check error:", error);
    res.status(500).json({
      success: false,
      message: "Health check failed",
      error: "HEALTH_CHECK_ERROR",
    });
  }
});

// Detailed health check with dependencies
router.get("/detailed", async (req: Request, res: Response) => {
  try {
    // Check database health
    const dbHealth = await checkDatabaseHealth();

    // Check AI service availability
    const aiHealth = {
      status: process.env.GEMINI_API_KEY ? "configured" : "not_configured",
      message: process.env.GEMINI_API_KEY
        ? "API key is configured"
        : "API key not found",
    };

    // Check environment variables
    const envHealth = {
      status: "OK",
      requiredVars: {
        MONGODB_URI: !!process.env.MONGODB_URI,
        JWT_SECRET: !!process.env.JWT_SECRET,
        GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
      },
      missingVars: [],
    };

    // Check for missing environment variables
    const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET", "GEMINI_API_KEY"];
    envHealth.missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName],
    ) as string[];

    if (envHealth.missingVars.length > 0) {
      envHealth.status = "WARNING";
    }

    // Overall health status
    const overallStatus =
      dbHealth.status === "healthy" &&
      aiHealth.status === "configured" &&
      envHealth.status === "OK"
        ? "healthy"
        : "unhealthy";

    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      services: {
        database: dbHealth,
        ai: aiHealth,
        environment: envHealth,
      },
      system: {
        memory: {
          used:
            Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
            100,
          total:
            Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
            100,
          external:
            Math.round((process.memoryUsage().external / 1024 / 1024) * 100) /
            100,
          rss:
            Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
        },
        cpu: {
          loadAverage:
            process.platform !== "win32" ? require("os").loadavg() : null,
          arch: process.arch,
          platform: process.platform,
          nodeVersion: process.version,
        },
        network: {
          hostname: require("os").hostname(),
          networkInterfaces: Object.keys(require("os").networkInterfaces()),
        },
      },
    };

    const statusCode = overallStatus === "healthy" ? 200 : 503;

    res.status(statusCode).json({
      success: overallStatus === "healthy",
      message:
        overallStatus === "healthy"
          ? "All systems healthy"
          : "Some systems unhealthy",
      data: healthData,
    });
  } catch (error) {
    logger.error("Detailed health check error:", error);
    res.status(500).json({
      success: false,
      message: "Detailed health check failed",
      error: "DETAILED_HEALTH_CHECK_ERROR",
    });
  }
});

// Database connectivity check
router.get("/database", async (req: Request, res: Response) => {
  try {
    const dbHealth = await checkDatabaseHealth();

    // Additional database metrics
    const dbStats = {
      readyState: mongoose.connection.readyState,
      readyStates: {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
      },
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
    };

    const statusCode = dbHealth.status === "healthy" ? 200 : 503;

    res.status(statusCode).json({
      success: dbHealth.status === "healthy",
      message: dbHealth.message,
      data: {
        health: dbHealth,
        stats: dbStats,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Database health check error:", error);
    res.status(500).json({
      success: false,
      message: "Database health check failed",
      error: "DATABASE_HEALTH_CHECK_ERROR",
    });
  }
});

// AI service health check
router.get("/ai", async (req: Request, res: Response) => {
  try {
    const isConfigured = !!process.env.GEMINI_API_KEY;

    let testResult = null;
    if (isConfigured) {
      try {
        // Test AI service with a simple prompt
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const startTime = Date.now();
        const result = await model.generateContent("Say 'Hello' in one word.");
        const response = await result.response;
        const text = response.text();
        const responseTime = Date.now() - startTime;

        testResult = {
          success: true,
          responseTime,
          testPrompt: "Say 'Hello' in one word.",
          response: text.substring(0, 50), // Truncate response
          timestamp: new Date().toISOString(),
        };
      } catch (testError) {
        testResult = {
          success: false,
          error:
            testError instanceof Error ? testError.message : "Unknown error",
          timestamp: new Date().toISOString(),
        };
      }
    }

    const healthData = {
      status: isConfigured
        ? testResult?.success
          ? "healthy"
          : "unhealthy"
        : "not_configured",
      configured: isConfigured,
      model: "gemini-1.5-flash",
      test: testResult,
      capabilities: [
        "text_generation",
        "image_analysis",
        "crop_advisory",
        "pest_identification",
        "soil_analysis",
      ],
    };

    const statusCode = healthData.status === "healthy" ? 200 : 503;

    res.status(statusCode).json({
      success: healthData.status === "healthy",
      message:
        healthData.status === "healthy"
          ? "AI service is healthy"
          : healthData.status === "not_configured"
            ? "AI service not configured"
            : "AI service is unhealthy",
      data: healthData,
    });
  } catch (error) {
    logger.error("AI health check error:", error);
    res.status(500).json({
      success: false,
      message: "AI health check failed",
      error: "AI_HEALTH_CHECK_ERROR",
    });
  }
});

// Liveness probe (for Kubernetes/Docker)
router.get("/live", (req: Request, res: Response) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
  });
});

// Readiness probe (for Kubernetes/Docker)
router.get("/ready", async (req: Request, res: Response) => {
  try {
    // Check if database is connected
    const isDbReady = mongoose.connection.readyState === 1;

    // Check if required environment variables are set
    const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];
    const envReady = requiredEnvVars.every((varName) => !!process.env[varName]);

    const isReady = isDbReady && envReady;

    const statusCode = isReady ? 200 : 503;

    res.status(statusCode).json({
      status: isReady ? "ready" : "not_ready",
      checks: {
        database: isDbReady,
        environment: envReady,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Readiness check error:", error);
    res.status(503).json({
      status: "not_ready",
      error: "READINESS_CHECK_ERROR",
      timestamp: new Date().toISOString(),
    });
  }
});

// System metrics endpoint
router.get("/metrics", (req: Request, res: Response) => {
  try {
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: {
        usage: process.cpuUsage(),
        loadAverage:
          process.platform !== "win32" ? require("os").loadavg() : null,
      },
      system: {
        arch: process.arch,
        platform: process.platform,
        nodeVersion: process.version,
        totalMemory: require("os").totalmem(),
        freeMemory: require("os").freemem(),
        cpuCount: require("os").cpus().length,
      },
      database: {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
      },
    };

    res.status(200).json({
      success: true,
      message: "System metrics retrieved",
      data: metrics,
    });
  } catch (error) {
    logger.error("Metrics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve metrics",
      error: "METRICS_ERROR",
    });
  }
});

export default router;
