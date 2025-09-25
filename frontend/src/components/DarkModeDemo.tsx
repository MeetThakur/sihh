import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Info,
  Heart,
  Star,
  Settings,
  User,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  Plus,
  Minus,
  X,
  Check,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Lock,
  Unlock,
  Home,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Zap,
  Target,
  Award,
  Gift,
  Coffee,
  Camera,
  Image,
  File,
  Folder,
  Link,
  Share2,
  Copy,
  Save,
  RefreshCw,
  Power,
  Wifi,
  Battery,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
  Move,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Layers,
  Grid,
  List,
  Table,
  PieChart,
  LineChart,
  MoreHorizontal,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Bookmark,
  Flag,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const DarkModeDemo: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('components');
  const [showPassword, setShowPassword] = useState(false);
  const [checkboxState, setCheckboxState] = useState(false);
  const [radioState, setRadioState] = useState('option1');
  const [selectValue, setSelectValue] = useState('option1');
  const [sliderValue, setSliderValue] = useState(50);
  const [toggleState, setToggleState] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New farm alert', message: 'Moisture levels are low in Farm A', type: 'warning', time: '2 min ago' },
    { id: 2, title: 'Harvest ready', message: 'Tomatoes in Plot 3 are ready for harvest', type: 'success', time: '1 hour ago' },
    { id: 3, title: 'Weather update', message: 'Rain expected tomorrow', type: 'info', time: '3 hours ago' }
  ]);

  const tabs = [
    { id: 'components', label: 'Components', icon: Grid },
    { id: 'forms', label: 'Forms', icon: Edit },
    { id: 'cards', label: 'Cards', icon: Layers },
    { id: 'navigation', label: 'Navigation', icon: List },
    { id: 'data', label: 'Data Display', icon: BarChart3 },
    { id: 'feedback', label: 'Feedback', icon: MessageCircle }
  ];

  const renderComponents = () => (
    <div className="space-y-8">
      {/* Buttons Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <button className="minimal-button minimal-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Primary Button
          </button>
          <button className="minimal-button minimal-button-secondary">
            <Settings className="w-4 h-4 mr-2" />
            Secondary Button
          </button>
          <button className="minimal-button minimal-button-ghost">
            <Eye className="w-4 h-4 mr-2" />
            Ghost Button
          </button>
          <button className="minimal-button minimal-button-danger">
            <Trash2 className="w-4 h-4 mr-2" />
            Danger Button
          </button>
          <button className="minimal-button minimal-button-primary" disabled>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </button>
        </div>
      </div>

      {/* Icon Showcase */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Icons</h3>
        <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-4">
          {[
            Leaf, Sun, Moon, Heart, Star, Bell, Search, Filter, Download, Upload,
            Edit, Trash2, Eye, EyeOff, Settings, User, Lock, Unlock, Home, BarChart3,
            Calendar, MapPin, Phone, Mail, Globe, Shield, Activity, Users, Zap, Target,
            Award, Gift, Coffee, Camera, Image, File, Folder, Link, Share2, Copy,
            Save, RefreshCw, Power, Wifi, Battery, Volume2, Play, Pause, SkipBack, SkipForward
          ].map((Icon, index) => (
            <div key={index} className="flex items-center justify-center p-3 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200">
              <Icon className="w-5 h-5 text-gray-600 dark:text-dark-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Badges</h3>
        <div className="flex flex-wrap gap-3">
          <span className="minimal-badge minimal-badge-green">Success</span>
          <span className="minimal-badge minimal-badge-yellow">Warning</span>
          <span className="minimal-badge minimal-badge-red">Error</span>
          <span className="minimal-badge minimal-badge-blue">Info</span>
          <span className="minimal-badge minimal-badge-gray">Default</span>
        </div>
      </div>

      {/* Loading Spinners */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Loading States</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <RefreshCw className="minimal-spinner" />
            <span className="text-gray-600 dark:text-dark-300">Loading...</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-300 dark:bg-dark-600 h-10 w-10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderForms = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Form Elements</h3>

          <div>
            <label className="minimal-label">Text Input</label>
            <input type="text" className="minimal-input" placeholder="Enter your name" />
          </div>

          <div>
            <label className="minimal-label">Password Input</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="minimal-input pr-10"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="minimal-label">Email Input</label>
            <input type="email" className="minimal-input" placeholder="your@email.com" />
          </div>

          <div>
            <label className="minimal-label">Textarea</label>
            <textarea className="minimal-textarea" rows={4} placeholder="Enter your message"></textarea>
          </div>

          <div>
            <label className="minimal-label">Select Dropdown</label>
            <select
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              className="minimal-select"
            >
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Interactive Elements</h3>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="checkbox"
                type="checkbox"
                checked={checkboxState}
                onChange={(e) => setCheckboxState(e.target.checked)}
                className="minimal-checkbox"
              />
              <label htmlFor="checkbox" className="ml-2 text-sm text-gray-700 dark:text-dark-200">
                Checkbox option
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="radio1"
                  name="radio"
                  type="radio"
                  value="option1"
                  checked={radioState === 'option1'}
                  onChange={(e) => setRadioState(e.target.value)}
                  className="minimal-radio"
                />
                <label htmlFor="radio1" className="ml-2 text-sm text-gray-700 dark:text-dark-200">
                  Radio Option 1
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="radio2"
                  name="radio"
                  type="radio"
                  value="option2"
                  checked={radioState === 'option2'}
                  onChange={(e) => setRadioState(e.target.value)}
                  className="minimal-radio"
                />
                <label htmlFor="radio2" className="ml-2 text-sm text-gray-700 dark:text-dark-200">
                  Radio Option 2
                </label>
              </div>
            </div>

            <div>
              <label className="minimal-label">Range Slider: {sliderValue}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-dark-200">Toggle Switch</span>
              <button
                onClick={() => setToggleState(!toggleState)}
                className={`${
                  toggleState ? 'bg-green-600' : 'bg-gray-200 dark:bg-dark-600'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-dark-800`}
              >
                <span
                  className={`${
                    toggleState ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCards = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="minimal-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Farm Statistics</h4>
            <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-300">Total Crops</span>
              <span className="font-semibold text-gray-900 dark:text-white">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-300">Active Plots</span>
              <span className="font-semibold text-gray-900 dark:text-white">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-300">Health Score</span>
              <span className="font-semibold text-green-600 dark:text-green-400">85%</span>
            </div>
          </div>
        </div>

        <div className="minimal-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Weather Today</h4>
            <Sun className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">28°C</div>
            <div className="text-gray-600 dark:text-dark-300 mb-4">Sunny</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 dark:text-dark-400">Humidity</div>
                <div className="font-semibold text-gray-900 dark:text-white">65%</div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-dark-400">Wind</div>
                <div className="font-semibold text-gray-900 dark:text-white">12 km/h</div>
              </div>
            </div>
          </div>
        </div>

        <div className="minimal-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h4>
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Watered Plot 3</div>
                <div className="text-xs text-gray-500 dark:text-dark-400">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Added fertilizer</div>
                <div className="text-xs text-gray-500 dark:text-dark-400">5 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Pest alert resolved</div>
                <div className="text-xs text-gray-500 dark:text-dark-400">1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h5 className="font-medium text-green-800 dark:text-green-200">Success Alert</h5>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Your crops have been successfully updated with new growth data.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <h5 className="font-medium text-red-800 dark:text-red-200">Warning Alert</h5>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Low moisture levels detected in Plot 5. Immediate attention required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Breadcrumb</h3>
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <a href="#" className="text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200">
                <Home className="w-4 h-4" />
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronDown className="w-4 h-4 text-gray-400 rotate-270" />
                <a href="#" className="ml-4 text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200">
                  Farms
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronDown className="w-4 h-4 text-gray-400 rotate-270" />
                <span className="ml-4 text-gray-900 dark:text-white font-medium">
                  My Farm
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Pagination */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pagination</h3>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-dark-300">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
            <span className="font-medium">97</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-dark-300">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-green-600 border border-green-600 rounded-md text-white">
              1
            </button>
            <button className="px-3 py-1 text-sm bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-dark-300">
              2
            </button>
            <button className="px-3 py-1 text-sm bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-dark-300">
              3
            </button>
            <button className="px-3 py-1 text-sm bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-dark-300">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Menu/Dropdown */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dropdown Menu</h3>
        <div className="relative inline-block text-left">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-200 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Actions
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-56 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-md shadow-lg animate-fade-in">
              <div className="py-1">
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-200 hover:bg-gray-100 dark:hover:bg-dark-700">
                  <Edit className="w-4 h-4 mr-3" />
                  Edit
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-200 hover:bg-gray-100 dark:hover:bg-dark-700">
                  <Copy className="w-4 h-4 mr-3" />
                  Duplicate
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-200 hover:bg-gray-100 dark:hover:bg-dark-700">
                  <Share2 className="w-4 h-4 mr-3" />
                  Share
                </a>
                <hr className="minimal-divider my-1" />
                <a href="#" className="flex items-center px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30">
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDataDisplay = () => (
    <div className="space-y-8">
      {/* Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Table</h3>
        <div className="minimal-card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Farm Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Health
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Green Valley Farm
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-400">
                  Punjab, India
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="minimal-badge minimal-badge-green">Active</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-400">
                  85%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                    View
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Sunrise Crops
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-400">
                  Karnataka, India
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="minimal-badge minimal-badge-yellow">Monitoring</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-400">
                  72%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="minimal-card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">1,234</div>
            <div className="text-sm text-gray-500 dark:text-dark-400">Total Plants</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">+12%</span>
            </div>
          </div>

          <div className="minimal-card p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">42</div>
            <div className="text-sm text-gray-500 dark:text-dark-400">Active Plots</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">+5%</span>
            </div>
          </div>

          <div className="minimal-card p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">3</div>
            <div className="text-sm text-gray-500 dark:text-dark-400">Alerts</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm text-red-600 dark:text-red-400">-8%</span>
            </div>
          </div>

          <div className="minimal-card p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">87%</div>
            <div className="text-sm text-gray-500 dark:text-dark-400">Health Score</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">+3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="space-y-8">
      {/* Notifications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="minimal-card p-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/50' :
                  notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/50' :
                  'bg-blue-100 dark:bg-blue-900/50'
                }`}>
                  {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />}
                  {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
                  {notification.type === 'info' && <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-dark-300 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 dark:text-dark-400 mt-2">{notification.time}</p>
                </div>
                <button
                  onClick={() => setNotifications(notifications.filter(n => n.id !== notification.id))}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Example */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Modal Dialog</h3>
        <button
          onClick={() => setModalOpen(true)}
          className="minimal-button minimal-button-primary"
        >
          Open Modal
        </button>

        {modalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="minimal-modal-overlay" onClick={() => setModalOpen(false)} />
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="minimal-modal w-full max-w-md p-6 animate-scale-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Action</h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-dark-300 mb-6">
                  Are you sure you want to perform this action? This cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="minimal-button minimal-button-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="minimal-button minimal-button-danger"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast-style Messages */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Toast Messages</h3>
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 p-4 rounded">
            <div className="flex">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Successfully updated farm data!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  Error: Unable to connect to weather service.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex">
              <Info className="w-5 h-5 text-blue-400" />
              <div className="ml-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  New weather update available for your area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'components':
        return renderComponents();
      case 'forms':
        return renderForms();
      case 'cards':
        return renderCards();
      case 'navigation':
        return renderNavigation();
      case 'data':
        return renderDataDisplay();
      case 'feedback':
        return renderFeedback();
      default:
        return renderComponents();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dark Mode Demo
              </h1>
              <p className="text-gray-600 dark:text-dark-300 mt-2">
                Showcase of all UI components with dark mode support
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-dark-300">
                Current theme: <span className="font-medium capitalize">{theme}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-300">
                <Sun className="w-4 h-4" />
                <span>/</span>
                <Moon className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-100 dark:bg-dark-800 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-dark-600/50'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-dark-700">
          <div className="text-center text-gray-500 dark:text-dark-400 text-sm">
            <p>KhetSetu Dark Mode Demo - All components support both light and dark themes</p>
            <p className="mt-2">Toggle between themes using the button in the header</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DarkModeDemo;
