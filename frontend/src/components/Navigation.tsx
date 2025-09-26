import React from "react";
import { LucideIcon } from "lucide-react";

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

const Navigation: React.FC<NavigationProps> = ({
  items,
  activeTab,
  onTabChange,
}) => {
  return (
    <nav className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-center py-2 sm:py-4 overflow-x-auto">
          <div className="flex space-x-0.5 sm:space-x-1 bg-gray-100 dark:bg-dark-700 rounded-lg p-1 transition-colors duration-200 min-w-max">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`
                    flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${
                      isActive
                        ? "bg-white dark:bg-dark-600 text-slate-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-dark-600/50"
                    }
                  `}
                >
                  <Icon
                    size={16}
                    className={`
                      sm:w-4 sm:h-4 flex-shrink-0
                      ${
                        isActive
                          ? "text-slate-700 dark:text-dark-200"
                          : "text-gray-500 dark:text-dark-400"
                      }
                    `}
                  />
                  <span className="hidden xs:inline sm:inline text-xs sm:text-sm truncate">
                    {item.label}
                  </span>
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
