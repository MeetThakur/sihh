import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface NavigationProps {
  items: NavigationItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ items, activeTab, onTabChange }) => {
  return (
    <nav className="bg-gradient-to-r from-white via-blue-50 to-emerald-50 shadow-xl border-b border-gray-100 backdrop-blur-sm">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-center py-6">
          <div className="flex space-x-2 bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-gray-200/50">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`
                    group relative flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap transform hover:scale-105
                    ${isActive 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-200' 
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:text-emerald-700 hover:shadow-md'
                    }
                  `}
                >
                  <div className={`p-1 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'group-hover:bg-emerald-100 group-hover:scale-110'
                  }`}>
                    <Icon size={20} className={isActive ? 'text-white' : 'text-emerald-600'} />
                  </div>
                  <span className="hidden sm:inline font-bold tracking-wide">{item.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-md animate-pulse"></div>
                  )}
                  
                  {/* Hover effect */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/0 to-green-400/0 group-hover:from-emerald-400/10 group-hover:to-green-400/10 transition-all duration-300"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;