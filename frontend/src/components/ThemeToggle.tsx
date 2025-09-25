import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  size = 'md'
}) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        relative rounded-lg border transition-all duration-200
        bg-white dark:bg-dark-800
        border-gray-300 dark:border-dark-600
        text-gray-600 dark:text-dark-300
        hover:text-gray-900 dark:hover:text-white
        hover:border-gray-400 dark:hover:border-dark-500
        hover:bg-gray-50 dark:hover:bg-dark-700
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-dark-800
        active:scale-95
        flex items-center justify-center
        ${className}
      `}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {/* Icon container with smooth rotation */}
      <div className="relative transition-transform duration-300 ease-in-out">
        {theme === 'light' ? (
          <Moon
            className={`${iconSizes[size]} transition-all duration-300 opacity-100 rotate-0`}
          />
        ) : (
          <Sun
            className={`${iconSizes[size]} transition-all duration-300 opacity-100 rotate-0`}
          />
        )}
      </div>

      {/* Optional label */}
      {showLabel && (
        <span className="ml-2 text-sm font-medium hidden sm:inline-block">
          {theme === 'light' ? 'Dark' : 'Light'}
        </span>
      )}

      {/* Animated background for extra visual feedback */}
      <div
        className={`
          absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200
          ${theme === 'light'
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
            : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10'
          }
          hover:opacity-100
        `}
      />
    </button>
  );
};

export default ThemeToggle;
