import mongoose from "mongoose";
import { logger } from "./logger";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env.NODE_ENV === "production"
        ? process.env.MONGODB_URI_PROD
        : process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongoURI, {
      // Remove deprecated options
      // useNewUrlParser and useUnifiedTopology are no longer needed in mongoose 6+
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("connected", () => {
      logger.info("Mongoose connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("Mongoose disconnected from MongoDB");
    });

    // Handle application termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;

// Database configuration options
export const dbConfig = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0,
  bufferCommands: false,
};

// Health check function
export const checkDatabaseHealth = async (): Promise<{
  status: string;
  message: string;
}> => {
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    if (state === 1) {
      // Perform a simple ping operation
      await mongoose.connection.db?.admin().ping();
      return {
        status: "healthy",
        message: `Database is ${states[state as keyof typeof states]} and responsive`,
      };
    } else {
      return {
        status: "unhealthy",
        message: `Database is ${states[state as keyof typeof states]}`,
      };
    }
  } catch (error) {
    return {
      status: "unhealthy",
      message: `Database health check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};
