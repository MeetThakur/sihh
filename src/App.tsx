import React, { useState } from 'react';
import { Leaf, Map as MapIcon, Bug, TrendingUp, FileText, Home, Globe, Users } from 'lucide-react';
import Navigation from './components/Navigation';
import CropAdvisory from './components/CropAdvisory';
import FarmVisualization from './components/FarmVisualization';
import PestWatch from './components/PestWatch';
import MarketLinkage from './components/MarketLinkage';
import HealthCard from './components/HealthCard';
import Dashboard from './components/Dashboard';
import ExpertConsultation from './components/ExpertConsultation';
import Chatbot from './components/Chatbot';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';


type ActiveTab = 'dashboard' | 'advisory' | 'farm' | 'pest' | 'market' | 'health' | 'consult';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const { t, language, setLanguage } = useLanguage();

  const navigationItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
    { id: 'advisory', label: t('nav.cropAdvisory'), icon: Leaf },
    { id: 'farm', label: t('nav.farmView'), icon: MapIcon },
    { id: 'pest', label: t('nav.pestWatch'), icon: Bug },
    { id: 'market', label: t('nav.market'), icon: TrendingUp },
    { id: 'health', label: t('nav.healthCard'), icon: FileText },
    { id: 'consult', label: t('nav.expertConsult'), icon: Users },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'advisory':
        return <CropAdvisory />;
      case 'farm':
        return <FarmVisualization />;
      case 'pest':
        return <PestWatch />;
      case 'market':
        return <MarketLinkage />;
      case 'health':
        return <HealthCard />;
      case 'consult':
        return <ExpertConsultation />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header with KhetSetu Branding */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('header.title')}</h1>
                <p className="text-sm text-gray-600">{t('header.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
              >
                <Globe className="w-4 h-4 mr-2" />
                {language === 'en' ? 'हिंदी' : 'English'}
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
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {renderActiveComponent()}
      </main>
      
      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;