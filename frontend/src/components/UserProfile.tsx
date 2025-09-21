import React, { useState } from "react";
import {
  User,
  Settings,
  Camera,
  Save,
  X,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { User as UserType } from "../types";

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { state, updateProfile, changePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "preferences"
  >("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [profileData, setProfileData] = useState<Partial<UserType>>({
    name: state.user?.name || "",
    phone: state.user?.phone || "",
    profile: {
      ...state.user?.profile,
      location: {
        state: state.user?.profile?.location?.state || "",
        district: state.user?.profile?.location?.district || "",
        village: state.user?.profile?.location?.village || "",
      },
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const soilTypes = [
    { value: "clay", label: "Clay" },
    { value: "sandy", label: "Sandy" },
    { value: "loamy", label: "Loamy" },
    { value: "silt", label: "Silt" },
    { value: "peat", label: "Peat" },
    { value: "chalk", label: "Chalk" },
  ];

  const handleProfileChange = (
    field: string,
    value: string | number | undefined,
  ) => {
    if (field.includes("profile.location.")) {
      const locationField = field.replace("profile.location.", "");
      setProfileData((prev) => ({
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
    } else if (field.includes("profile.")) {
      const profileField = field.replace("profile.", "");
      setProfileData((prev) => ({
        ...prev,
        profile: {
          farmSize: prev.profile?.farmSize,
          location: prev.profile?.location,
          soilType: prev.profile?.soilType,
          farmingExperience: prev.profile?.farmingExperience,
          primaryCrops: prev.profile?.primaryCrops,
          preferredLanguage: prev.profile?.preferredLanguage || "en",
          avatar: prev.profile?.avatar,
          ...prev.profile,
          [profileField]:
            profileField === "farmSize" || profileField === "farmingExperience"
              ? value
                ? parseFloat(value as string)
                : undefined
              : value,
        },
      }));
    } else {
      setProfileData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);

    try {
      await updateProfile(profileData);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } catch {
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long.",
      });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Failed to change password. Please check your current password.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isOpen) return null;

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            {state.user?.profile?.avatar ? (
              <img
                src={state.user.profile.avatar}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-green-600" />
            )}
          </div>
          {isEditing && (
            <button className="absolute -bottom-1 -right-1 bg-green-600 text-white rounded-full p-1 hover:bg-green-700">
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {state.user?.name}
          </h3>
          <p className="text-sm text-gray-500">{state.user?.email}</p>
          <p className="text-xs text-green-600 capitalize">
            {state.user?.role}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 gap-6">
        {/* Basic Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Basic Information
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name || ""}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone || ""}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Location</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={profileData.profile?.location?.state || ""}
                onChange={(e) =>
                  handleProfileChange("profile.location.state", e.target.value)
                }
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District
              </label>
              <input
                type="text"
                value={profileData.profile?.location?.district || ""}
                onChange={(e) =>
                  handleProfileChange(
                    "profile.location.district",
                    e.target.value,
                  )
                }
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Village
              </label>
              <input
                type="text"
                value={profileData.profile?.location?.village || ""}
                onChange={(e) =>
                  handleProfileChange(
                    "profile.location.village",
                    e.target.value,
                  )
                }
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Farm Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Farm Details
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Farm Size (acres)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={profileData.profile?.farmSize || ""}
                onChange={(e) =>
                  handleProfileChange("profile.farmSize", e.target.value)
                }
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Soil Type
              </label>
              <select
                value={profileData.profile?.soilType || ""}
                onChange={(e) =>
                  handleProfileChange("profile.soilType", e.target.value)
                }
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="">Select soil type</option>
                {soilTypes.map((soil) => (
                  <option key={soil.value} value={soil.value}>
                    {soil.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Farming Experience (years)
              </label>
              <input
                type="number"
                min="0"
                value={profileData.profile?.farmingExperience || ""}
                onChange={(e) =>
                  handleProfileChange(
                    "profile.farmingExperience",
                    e.target.value,
                  )
                }
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );

  const renderPasswordTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Change Password
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Choose a strong password to keep your account secure.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  current: !prev.current,
                }))
              }
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.current ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
              }
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.new ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  confirm: !prev.confirm,
                }))
              }
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.confirm ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleChangePassword}
        disabled={
          isSaving ||
          !passwordData.currentPassword ||
          !passwordData.newPassword ||
          !passwordData.confirmPassword
        }
        className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
            Changing Password...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2 inline" />
            Change Password
          </>
        )}
      </button>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Account Preferences
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Language Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Language
        </label>
        <select
          value={state.user?.profile?.preferredLanguage || "en"}
          onChange={(e) =>
            handleProfileChange("profile.preferredLanguage", e.target.value)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
        </select>
      </div>

      {/* Account Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h5 className="text-sm font-medium text-gray-900 mb-2">
          Account Status
        </h5>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Email Verification</span>
            <span
              className={`flex items-center ${state.user?.isEmailVerified ? "text-green-600" : "text-red-600"}`}
            >
              {state.user?.isEmailVerified ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Not Verified
                </>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Account Status</span>
            <span className="text-green-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Subscription Plan</span>
            <span className="text-blue-600 capitalize">
              {state.user?.subscription?.plan || "Free"}
            </span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300"
        >
          <LogOut className="w-4 h-4 mr-2 inline" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          ></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                User Profile
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "profile"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <User className="w-4 h-4 mr-2 inline" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "password"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Lock className="w-4 h-4 mr-2 inline" />
                Password
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "preferences"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Settings className="w-4 h-4 mr-2 inline" />
                Settings
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-6">
            {/* Message Display */}
            {message && (
              <div
                className={`mb-4 p-4 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex">
                  {message.type === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                  <div className="ml-3">
                    <p
                      className={`text-sm ${message.type === "success" ? "text-green-800" : "text-red-800"}`}
                    >
                      {message.text}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content */}
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "password" && renderPasswordTab()}
            {activeTab === "preferences" && renderPreferencesTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
