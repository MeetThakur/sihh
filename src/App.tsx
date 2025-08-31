import React, { useState } from 'react';
import { Leaf, Map as MapIcon, Bug, TrendingUp, FileText, Home } from 'lucide-react';
import Navigation from './components/Navigation';
import CropAdvisory from './components/CropAdvisory';
import FarmVisualization from './components/FarmVisualization';
import PestWatch from './components/PestWatch';
import MarketLinkage from './components/MarketLinkage';
import HealthCard from './components/HealthCard';
import Dashboard from './components/Dashboard';


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
      <Navigation
        items={navigationItems}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as ActiveTab)}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {renderActiveComponent()}
      </main>
      
      {/* AI Chatbot */}
      {/* <Chatbot /> */}
    </div>
  );
}

export default App;