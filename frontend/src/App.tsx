import React, { useState } from "react";
import {
  Leaf,
  Map as MapIcon,
  Bug,
  TrendingUp,
  Home,
  Globe,
  Users,
  User,
} from "lucide-react";
import Navigation from "./components/Navigation";
import CropAdvisory from "./components/CropAdvisory";
import FarmVisualization from "./components/FarmVisualization";
import PestWatch from "./components/PestWatch";
import MarketLinkage from "./components/MarketLinkage";
import ExportAssistance from "./components/ExportAssistance";
import Dashboard from "./components/Dashboard";
import ExpertConsultation from "./components/ExpertConsultation";
import Chatbot from "./components/Chatbot";
import AuthWrapper from "./components/AuthWrapper";
import UserProfile from "./components/UserProfile";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

type ActiveTab =
  | "dashboard"
  | "advisory"
  | "farm"
  | "pest"
  | "market"
  | "export"
  | "consult";

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { state } = useAuth();

  const navigationItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: Home },
    { id: "advisory", label: t("nav.cropAdvisory"), icon: Leaf },
    { id: "farm", label: t("nav.farmView"), icon: MapIcon },
    { id: "pest", label: t("nav.pestWatch"), icon: Bug },
    { id: "market", label: t("nav.market"), icon: TrendingUp },
    { id: "export", label: "Export Assistance", icon: Globe },
    { id: "consult", label: t("nav.expertConsult"), icon: Users },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "advisory":
        return <CropAdvisory />;
      case "farm":
        return <FarmVisualization />;
      case "pest":
        return <PestWatch />;
      case "market":
        return <MarketLinkage />;
      case "export":
        return <ExportAssistance />;
      case "consult":
        return <ExpertConsultation />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      {/* Minimal Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 dark:bg-green-600 rounded-md flex items-center justify-center transition-colors duration-200 flex-shrink-0">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200 truncate">
                  {t("header.title")}
                </h1>
                <p className="text-xs text-gray-500 dark:text-dark-400 transition-colors duration-200 hidden xs:block truncate">
                  {t("header.subtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <button
                onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                className="flex items-center px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-md hover:border-gray-400 dark:hover:border-dark-500 transition-colors duration-200"
              >
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  {language === "en" ? "हिंदी" : "English"}
                </span>
                <span className="sm:hidden">
                  {language === "en" ? "हि" : "En"}
                </span>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle size="sm" />

              {/* User Profile Button */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-md hover:border-gray-400 dark:hover:border-dark-500 transition-colors duration-200"
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline truncate max-w-20">
                  {state.user?.name || "Profile"}
                </span>
                <span className="sm:hidden">Demo</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <Navigation
        items={navigationItems}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as ActiveTab)}
      />

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {renderActiveComponent()}
      </main>

      {/* AI Chatbot */}
      <Chatbot />

      {/* User Profile Modal */}
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <AuthWrapper>
            <AppContent />
          </AuthWrapper>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
