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
import Dashboard from "./components/Dashboard";
import ExpertConsultation from "./components/ExpertConsultation";
import Chatbot from "./components/Chatbot";
import AuthWrapper from "./components/AuthWrapper";
import UserProfile from "./components/UserProfile";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

type ActiveTab =
  | "dashboard"
  | "advisory"
  | "farm"
  | "pest"
  | "market"
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
      case "consult":
        return <ExpertConsultation />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {t("header.title")}
                </h1>
                <p className="text-xs text-gray-500">{t("header.subtitle")}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
              >
                <Globe className="w-4 h-4 mr-2" />
                {language === "en" ? "हिंदी" : "English"}
              </button>

              {/* User Profile Button */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
              >
                <User className="w-4 h-4 mr-2" />
                {state.user?.name || "Profile"}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    <AuthProvider>
      <LanguageProvider>
        <AuthWrapper>
          <AppContent />
        </AuthWrapper>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
