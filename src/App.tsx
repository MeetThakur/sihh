import React, { useState } from 'react';
import { Leaf, Map as MapIcon, Bug, TrendingUp, FileText, Home } from 'lucide-react';
import Navigation from './components/Navigation';
import CropAdvisory from './components/CropAdvisory';
import FarmVisualization from './components/FarmVisualization';
import PestWatch from './components/PestWatch';
import MarketLinkage from './components/MarketLinkage';
import HealthCard from './components/HealthCard';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';


type ActiveTab = 'dashboard' | 'advisory' | 'farm' | 'pest' | 'market' | 'health';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'advisory', label: 'Crop Advisory', icon: Leaf },
    { id: 'farm', label: 'Farm View', icon: MapIcon },
    { id: 'pest', label: 'Pest Watch', icon: Bug },
    { id: 'market', label: 'Market', icon: TrendingUp },
    { id: 'health', label: 'Health Card', icon: FileText },
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
                <h1 className="text-2xl font-bold text-gray-900">KhetSetu</h1>
                <p className="text-sm text-gray-600">Smart Agricultural Platform</p>
              </div>
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
}

export default App;