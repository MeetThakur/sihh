import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Leaf,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Sprout,
  AlertCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { RegisterData } from "../types";

interface RegisterProps {
  onToggleMode: () => void;
}

type Step = 1 | 2 | 3;

const Register: React.FC<RegisterProps> = ({ onToggleMode }) => {
  const { state, register, clearError } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pincode, setPincode] = useState("");
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    password: "",
    name: "",
    phone: "",
    role: "farmer",
    profile: {
      farmSize: undefined,
      location: {
        state: "",
        district: "",
        village: "",
      },
      soilType: undefined,
      farmingExperience: undefined,
      primaryCrops: [],
      preferredLanguage: "en",
    },
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const soilTypes = [
    { value: "clay", label: "Clay" },
    { value: "sandy", label: "Sandy" },
    { value: "loamy", label: "Loamy" },
    { value: "silt", label: "Silt" },
    { value: "peat", label: "Peat" },
    { value: "chalk", label: "Chalk" },
  ];

  const commonCrops = [
    "Rice",
    "Wheat",
    "Corn",
    "Sugarcane",
    "Cotton",
    "Soybean",
    "Potato",
    "Tomato",
    "Onion",
    "Chili",
    "Tea",
    "Coffee",
    "Coconut",
    "Banana",
    "Mango",
    "Apple",
    "Grapes",
    "Orange",
  ];

  const validateStep = (step: Step): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      // Basic information validation
      if (!formData.name.trim()) {
        errors.name = "Full name is required";
      } else if (formData.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
      }

      if (!formData.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }

      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        errors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
      }

      if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      if (formData.phone && formData.phone.trim()) {
        // Remove all non-digits to check format
        const digitsOnly = formData.phone.replace(/\D/g, '');
        // Allow Indian mobile numbers (10 digits) or international format
        if (!/^(\+91)?[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, '')) &&
            !/^[6-9]\d{9}$/.test(digitsOnly)) {
          errors.phone = "Please enter a valid Indian mobile number (10 digits starting with 6-9)";
        }
      }
    }

    if (step === 2) {
      // Location validation
      if (!formData.profile?.location?.state?.trim()) {
        errors.state = "State is required";
      }
      if (!formData.profile?.location?.district?.trim()) {
        errors.district = "District/City is required";
      }
    }

    if (step === 3) {
      // Farm details validation (optional but validate if provided)
      if (formData.profile?.farmSize && formData.profile.farmSize <= 0) {
        errors.farmSize = "Farm size must be greater than 0";
      }
      if (
        formData.profile?.farmingExperience &&
        formData.profile.farmingExperience < 0
      ) {
        errors.farmingExperience = "Farming experience cannot be negative";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else if (name.includes("profile.")) {
      const profileField = name.replace("profile.", "");
      if (profileField.includes("location.")) {
        const locationField = profileField.replace("location.", "");
        setFormData((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            location: {
              state: prev.profile?.location?.state || "",
              district: prev.profile?.location?.district || "",
              village: prev.profile?.location?.village || "",
              ...prev.profile?.location,
              [locationField]: value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            [profileField]:
              profileField === "farmSize" ||
              profileField === "farmingExperience"
                ? value
                  ? parseFloat(value)
                  : undefined
                : value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear validation error for this field
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }

    // Clear auth error when user starts typing
    if (state.error) {
      clearError();
    }
  };

  const handleCropToggle = (crop: string) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        primaryCrops: prev.profile?.primaryCrops?.includes(crop)
          ? prev.profile.primaryCrops.filter((c) => c !== crop)
          : [...(prev.profile?.primaryCrops || []), crop],
      },
    }));
  };

  // Simplified handlers that work with regular input fields
  // const handleStateChange and handleCityChange removed since we're using regular inputs

  const handlePincodeChange = async (value: string) => {
    setPincode(value);

    // Simple validation for 6-digit pincode
    if (value.length === 6 && /^\d{6}$/.test(value)) {
      setIsLoadingPincode(true);
      try {
        // Use fetch directly since locationService might have import issues
        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await response.json();

        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0];

          // Auto-fill state and district based on pincode
          setFormData((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              location: {
                ...prev.profile?.location,
                state: postOffice.State,
                district: postOffice.District,
              },
            },
          }));

          // Clear validation errors
          setValidationErrors(prev => ({
            ...prev,
            state: undefined,
            district: undefined
          }));
        }
      } catch (error) {
        console.error('Failed to lookup pincode:', error);
      } finally {
        setIsLoadingPincode(false);
      }
    }
  };



  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3) as Step);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    try {
      // Clean up the data before sending
      const cleanedData: any = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
      };

      // Only include phone if it has a value
      if (formData.phone && formData.phone.trim()) {
        cleanedData.phone = formData.phone.trim();
      }

      // Build profile object with only non-empty values
      const profile: any = {
        preferredLanguage: formData.profile?.preferredLanguage || "en",
      };

      // Add optional profile fields only if they have values
      if (formData.profile?.farmSize) {
        profile.farmSize = formData.profile.farmSize;
      }

      if (formData.profile?.soilType) {
        profile.soilType = formData.profile.soilType;
      }

      if (formData.profile?.farmingExperience) {
        profile.farmingExperience = formData.profile.farmingExperience;
      }

      if (formData.profile?.primaryCrops?.length) {
        profile.primaryCrops = formData.profile.primaryCrops;
      }

      // Add location only if at least one field has a value
      if (formData.profile?.location) {
        const { state, district, village } = formData.profile.location;
        if ((state && state.trim()) || (district && district.trim()) || (village && village.trim())) {
          profile.location = {};
          if (state && state.trim()) profile.location.state = state.trim();
          if (district && district.trim()) profile.location.district = district.trim();
          if (village && village.trim()) profile.location.village = village.trim();
        }
      }

      cleanedData.profile = profile;

      // Debug logging to see what data is being sent
      console.log("Registration data being sent:", JSON.stringify(cleanedData, null, 2));
      console.log("Location data:", cleanedData.profile?.location);
      console.log("Profile data:", cleanedData.profile);
      console.log("Original form data:", JSON.stringify(formData, null, 2));

      await register(cleanedData);
    } catch (error) {
      console.error("Registration failed:", error);

      // Show detailed validation errors if available
      if (error instanceof Error) {
        if (error.message.includes("Validation failed")) {
          // The error details should be in the backend response
          console.error("Validation failed - check console for details");
          setValidationErrors({
            ...validationErrors,
            submit: "Please check all fields and try again. Some required information may be missing or invalid."
          });
        } else {
          setValidationErrors({
            ...validationErrors,
            submit: error.message || "Registration failed. Please try again."
          });
        }
      }
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
        <p className="text-sm text-gray-600">
          Let's start with your basic details
        </p>
      </div>

      {/* Full Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Full Name *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleInputChange}
            className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
              validationErrors.name ? "border-red-300" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            placeholder="Enter your full name"
          />
        </div>
        {validationErrors.name && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email Address *
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
            className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
              validationErrors.email ? "border-red-300" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            placeholder="Enter your email"
          />
        </div>
        {validationErrors.email && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Phone Number (optional)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={handleInputChange}
            className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
              validationErrors.phone ? "border-red-300" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            placeholder="Enter your phone number (e.g., 9876543210)"
          />
        </div>
        {validationErrors.phone && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className={`appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border ${
              validationErrors.password ? "border-red-300" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            placeholder="Password (min 6 chars, include A-Z, a-z, 0-9)"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {validationErrors.password && (
          <p className="mt-1 text-sm text-red-600">
            {validationErrors.password}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Confirm Password *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={handleInputChange}
            className={`appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border ${
              validationErrors.confirmPassword
                ? "border-red-300"
                : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {validationErrors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {validationErrors.confirmPassword}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Location Details</h3>
        <p className="text-sm text-gray-600">
          Tell us where your farm is located
        </p>
      </div>

      {/* Pincode Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pincode (Optional)
        </label>
        <div className="relative">
          <input
            type="text"
            value={pincode}
            onChange={(e) => handlePincodeChange(e.target.value)}
            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Enter 6-digit pincode"
            maxLength={6}
          />
          {isLoadingPincode && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Enter pincode to auto-fill state and city
        </p>
      </div>

      {/* State Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="profile.location.state"
            name="profile.location.state"
            type="text"
            required
            value={formData.profile?.location?.state || ""}
            onChange={handleInputChange}
            className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
              validationErrors.state ? "border-red-300" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            placeholder="Enter your state"
          />
        </div>
        {validationErrors.state && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.state}</p>
        )}
      </div>

      {/* City/District Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City/District *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="profile.location.district"
            name="profile.location.district"
            type="text"
            required
            value={formData.profile?.location?.district || ""}
            onChange={handleInputChange}
            className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
              validationErrors.district ? "border-red-300" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            placeholder="Enter your city or district"
          />
        </div>
        {validationErrors.district && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.district}</p>
        )}
      </div>

      {/* Village */}
      <div>
        <label
          htmlFor="profile.location.village"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Village (Optional)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="profile.location.village"
            name="profile.location.village"
            type="text"
            value={formData.profile?.location?.village || ""}
            onChange={handleInputChange}
            className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Enter your village or area"
          />
        </div>
      </div>

      {/* Language Preference */}
      <div>
        <label
          htmlFor="profile.preferredLanguage"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Preferred Language
        </label>
        <select
          id="profile.preferredLanguage"
          name="profile.preferredLanguage"
          value={formData.profile?.preferredLanguage || "en"}
          onChange={handleInputChange}
          className="appearance-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Farm Details</h3>
        <p className="text-sm text-gray-600">
          Help us understand your farming background (optional)
        </p>
      </div>

      {/* Farm Size */}
      <div>
        <label
          htmlFor="profile.farmSize"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Farm Size (in acres)
        </label>
        <input
          id="profile.farmSize"
          name="profile.farmSize"
          type="number"
          min="0"
          step="0.1"
          value={formData.profile?.farmSize || ""}
          onChange={handleInputChange}
          className={`appearance-none relative block w-full px-3 py-3 border ${
            validationErrors.farmSize ? "border-red-300" : "border-gray-300"
          } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
          placeholder="Enter farm size"
        />
        {validationErrors.farmSize && (
          <p className="mt-1 text-sm text-red-600">
            {validationErrors.farmSize}
          </p>
        )}
      </div>

      {/* Soil Type */}
      <div>
        <label
          htmlFor="profile.soilType"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Soil Type
        </label>
        <select
          id="profile.soilType"
          name="profile.soilType"
          value={formData.profile?.soilType || ""}
          onChange={handleInputChange}
          className="appearance-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <option value="">Select soil type</option>
          {soilTypes.map((soil) => (
            <option key={soil.value} value={soil.value}>
              {soil.label}
            </option>
          ))}
        </select>
      </div>

      {/* Farming Experience */}
      <div>
        <label
          htmlFor="profile.farmingExperience"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Farming Experience (in years)
        </label>
        <input
          id="profile.farmingExperience"
          name="profile.farmingExperience"
          type="number"
          min="0"
          value={formData.profile?.farmingExperience || ""}
          onChange={handleInputChange}
          className={`appearance-none relative block w-full px-3 py-3 border ${
            validationErrors.farmingExperience
              ? "border-red-300"
              : "border-gray-300"
          } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
          placeholder="Enter years of experience"
        />
        {validationErrors.farmingExperience && (
          <p className="mt-1 text-sm text-red-600">
            {validationErrors.farmingExperience}
          </p>
        )}
      </div>

      {/* Primary Crops */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Primary Crops (select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {commonCrops.map((crop) => (
            <label key={crop} className="flex items-center">
              <input
                type="checkbox"
                checked={
                  formData.profile?.primaryCrops?.includes(crop) || false
                }
                onChange={() => handleCropToggle(crop)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{crop}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Join KhetSetu
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to start smart farming
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep
                    ? "bg-green-600 text-white"
                    : step < currentStep
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-8 h-1 mx-2 ${
                    step < currentStep ? "bg-green-200" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            {/* Error Display */}
            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{state.error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step Content */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={state.loading}
                  className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Sprout className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </form>

        {/* Submit Error Message */}
        {validationErrors.submit && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{validationErrors.submit}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
