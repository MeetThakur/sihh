import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User, { IUser } from "../models/User";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../middleware/auth";
import { logger } from "../config/logger";

// Register new user
export const register = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password, name, phone, role, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, ...(phone ? [{ phone }] : [])],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email or phone number",
        error: "USER_EXISTS",
      });
    }

    // Create new user
    const userData: Partial<IUser> = {
      email: email.toLowerCase(),
      password,
      name,
      phone,
      role: role || "farmer",
      profile: {
        preferredLanguage: "en",
        ...profile,
      },
      preferences: {
        notifications: {
          email: true,
          sms: false,
          push: true,
          weatherAlerts: true,
          pestAlerts: true,
          marketUpdates: false,
        },
        units: {
          area: "acres",
          temperature: "celsius",
          currency: "INR",
        },
      },
    };

    const user = new User(userData);
    await user.save();

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Add refresh token to user
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete (userResponse as any).password;
    delete (userResponse as any).refreshTokens;

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: userResponse,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: "REGISTRATION_ERROR",
    });
  }
};

// User login
export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        error: "INVALID_CREDENTIALS",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account has been deactivated",
        error: "ACCOUNT_DEACTIVATED",
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        error: "INVALID_CREDENTIALS",
      });
    }

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Add refresh token to user and update last login
    user.refreshTokens.push(refreshToken);
    user.lastLogin = new Date();
    await user.save();

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshTokens;

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: userResponse,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: "LOGIN_ERROR",
    });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
        error: "MISSING_REFRESH_TOKEN",
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user and check if refresh token exists
    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
        error: "INVALID_REFRESH_TOKEN",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account has been deactivated",
        error: "ACCOUNT_DEACTIVATED",
      });
    }

    // Generate new tokens
    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Replace old refresh token with new one
    user.refreshTokens = user.refreshTokens.filter(
      (token) => token !== refreshToken,
    );
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    logger.error("Token refresh error:", error);
    res.status(401).json({
      success: false,
      message: "Token refresh failed",
      error: "TOKEN_REFRESH_ERROR",
    });
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
        error: "NOT_AUTHENTICATED",
      });
    }

    // Remove refresh token if provided
    if (refreshToken) {
      user.refreshTokens = user.refreshTokens.filter(
        (token) => token !== refreshToken,
      );
      await user.save();
    }

    logger.info(`User logged out: ${user.email}`);

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    logger.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: "LOGOUT_ERROR",
    });
  }
};

// Logout from all devices
export const logoutAll = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
        error: "NOT_AUTHENTICATED",
      });
    }

    // Clear all refresh tokens
    user.refreshTokens = [];
    await user.save();

    logger.info(`User logged out from all devices: ${user.email}`);

    res.json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    logger.error("Logout all error:", error);
    res.status(500).json({
      success: false,
      message: "Logout from all devices failed",
      error: "LOGOUT_ALL_ERROR",
    });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
        error: "NOT_AUTHENTICATED",
      });
    }

    // Get fresh user data with computed virtuals
    const userProfile = await User.findById(user._id);

    res.json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        user: userProfile,
      },
    });
  } catch (error) {
    logger.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve profile",
      error: "PROFILE_ERROR",
    });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
        error: "NOT_AUTHENTICATED",
      });
    }

    const updateData = req.body;

    // Prevent updating sensitive fields
    delete updateData.password;
    delete updateData.email;
    delete updateData.role;
    delete updateData.refreshTokens;
    delete updateData.isActive;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    logger.info(`Profile updated for user: ${user.email}`);

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    logger.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: "UPDATE_PROFILE_ERROR",
    });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
        error: "NOT_AUTHENTICATED",
      });
    }

    // Get user with password
    const userWithPassword = await User.findById(user._id).select("+password");
    if (!userWithPassword) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "USER_NOT_FOUND",
      });
    }

    // Verify current password
    const isCurrentPasswordValid =
      await userWithPassword.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
        error: "INVALID_CURRENT_PASSWORD",
      });
    }

    // Update password
    userWithPassword.password = newPassword;
    await userWithPassword.save();

    // Clear all refresh tokens to force re-login
    userWithPassword.refreshTokens = [];
    await userWithPassword.save();

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: "Password changed successfully. Please login again.",
    });
  } catch (error) {
    logger.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: "CHANGE_PASSWORD_ERROR",
    });
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = user.generateResetPasswordToken();
    await user.save();

    // In a real application, you would send an email here
    // For now, we'll just log the token (DON'T DO THIS IN PRODUCTION)
    logger.info(`Password reset token for ${email}: ${resetToken}`);

    res.json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
      // Remove this in production
      resetToken:
        process.env.NODE_ENV === "development" ? resetToken : undefined,
    });
  } catch (error) {
    logger.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process forgot password request",
      error: "FORGOT_PASSWORD_ERROR",
    });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { token, newPassword } = req.body;

    // Hash the token to find user
    const crypto = require("crypto");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
        error: "INVALID_RESET_TOKEN",
      });
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshTokens = []; // Clear all refresh tokens
    await user.save();

    logger.info(`Password reset successfully for user: ${user.email}`);

    res.json({
      success: true,
      message:
        "Password has been reset successfully. Please login with your new password.",
    });
  } catch (error) {
    logger.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: "RESET_PASSWORD_ERROR",
    });
  }
};

// Deactivate account
export const deactivateAccount = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
        error: "NOT_AUTHENTICATED",
      });
    }

    // Deactivate user account
    user.isActive = false;
    user.refreshTokens = [];
    await user.save();

    logger.info(`Account deactivated for user: ${user.email}`);

    res.json({
      success: true,
      message: "Account has been deactivated successfully",
    });
  } catch (error) {
    logger.error("Deactivate account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to deactivate account",
      error: "DEACTIVATE_ACCOUNT_ERROR",
    });
  }
};

// Verify email (placeholder for email verification implementation)
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    // Hash the token to find user
    const crypto = require("crypto");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
        error: "INVALID_VERIFICATION_TOKEN",
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    logger.info(`Email verified for user: ${user.email}`);

    res.json({
      success: true,
      message: "Email has been verified successfully",
    });
  } catch (error) {
    logger.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify email",
      error: "EMAIL_VERIFICATION_ERROR",
    });
  }
};
