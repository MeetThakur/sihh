import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Leaf,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  Wifi,
  WifiOff,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { LoginCredentials } from "../types";

interface LoginProps {
  onToggleMode: () => void;
  onForgotPassword: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggleMode, onForgotPassword }) => {
  const { state, login, clearError } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Partial<LoginCredentials>
  >({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const validateForm = (): boolean => {
    const errors: Partial<LoginCredentials> = {};

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field
    if (validationErrors[name as keyof LoginCredentials]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Clear auth error when user starts typing
    if (state.error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if offline
    if (!isOnline) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
    } catch (error: any) {
      console.error("Login failed:", error);
    }
  };

  const getErrorMessage = () => {
    const error = state.error;
    if (!error) return null;

    if (
      error.includes("Network") ||
      error.includes("fetch") ||
      error.includes("Failed to fetch")
    ) {
      return {
        type: "network",
        message:
          "Unable to connect to server. Please check your internet connection and try again.",
        suggestion:
          "Make sure you're connected to the internet and the server is running.",
      };
    }

    if (error.includes("timeout") || error.includes("Timeout")) {
      return {
        type: "timeout",
        message:
          "Connection timeout. The server is taking too long to respond.",
        suggestion: "Please try again in a moment.",
      };
    }

    if (error.includes("401") || error.includes("Invalid credentials")) {
      return {
        type: "auth",
        message:
          "Invalid email or password. Please check your credentials and try again.",
        suggestion: "Make sure your email and password are correct.",
      };
    }

    return {
      type: "general",
      message: error,
      suggestion: "If this problem persists, please contact support.",
    };
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Leaf className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to KhetSetu
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Smart Agricultural Platform for Modern Farmers
          </p>

          {/* Connection Status */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            {isOnline ? (
              <div className="flex items-center space-x-2 text-green-600">
                <Wifi size={16} />
                <span className="text-sm">Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-600">
                <WifiOff size={16} />
                <span className="text-sm">Offline</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {errorInfo && (
          <div
            className={`rounded-lg p-4 border ${
              errorInfo.type === "network"
                ? "bg-red-50 border-red-200"
                : errorInfo.type === "timeout"
                  ? "bg-yellow-50 border-yellow-200"
                  : errorInfo.type === "auth"
                    ? "bg-orange-50 border-orange-200"
                    : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start">
              <AlertCircle
                className={`h-5 w-5 mt-0.5 mr-3 ${
                  errorInfo.type === "network"
                    ? "text-red-500"
                    : errorInfo.type === "timeout"
                      ? "text-yellow-500"
                      : errorInfo.type === "auth"
                        ? "text-orange-500"
                        : "text-red-500"
                }`}
              />
              <div className="flex-1">
                <h3
                  className={`text-sm font-medium ${
                    errorInfo.type === "network"
                      ? "text-red-800"
                      : errorInfo.type === "timeout"
                        ? "text-yellow-800"
                        : errorInfo.type === "auth"
                          ? "text-orange-800"
                          : "text-red-800"
                  }`}
                >
                  {errorInfo.message}
                </h3>
                <p
                  className={`mt-1 text-xs ${
                    errorInfo.type === "network"
                      ? "text-red-700"
                      : errorInfo.type === "timeout"
                        ? "text-yellow-700"
                        : errorInfo.type === "auth"
                          ? "text-orange-700"
                          : "text-red-700"
                  }`}
                >
                  {errorInfo.suggestion}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    validationErrors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                  placeholder="Enter your email"
                />
                {formData.email && !validationErrors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    validationErrors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={state.loading || !isOnline}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              {state.loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in to your account"
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onToggleMode}
                className="font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                Sign up here
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Demo Account
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                <strong>Email:</strong> demo@khetsetu.com
              </p>
              <p>
                <strong>Password:</strong> demo123
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  email: "demo@khetsetu.com",
                  password: "demo123",
                });
                clearError();
              }}
              className="mt-2 text-xs text-blue-600 hover:text-blue-700 underline"
            >
              Use demo credentials
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
          <p className="mt-1">KhetSetu v1.0 - Smart Agriculture Platform</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
