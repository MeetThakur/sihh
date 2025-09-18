import React from 'react';
import { Leaf, AlertTriangle, TrendingUp, Calendar, Users, Droplets, Map as MapIcon, Clock, CloudRain, Thermometer, ArrowUp, ArrowDown } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Minimal Welcome Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome to KhetSetu
        </h1>
        <p className="text-gray-600">Your Smart Farming Dashboard</p>
      </div>

      {/* Minimal Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="minimal-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Season</p>
              <p className="text-2xl font-semibold text-gray-900">Kharif 2025</p>
              <p className="text-xs text-gray-500 mt-1">Peak growing season</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Calendar className="text-gray-600" size={24} />
            </div>
          </div>
        </div>

        <div className="minimal-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Crops</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
              <div className="flex items-center mt-1">
                <ArrowUp className="w-3 h-3 text-green-600 mr-1" />
                <p className="text-xs text-green-600">+2 this month</p>
              </div>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Leaf className="text-gray-600" size={24} />
            </div>
          </div>
        </div>

        <div className="minimal-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pest Alerts</p>
              <p className="text-2xl font-semibold text-gray-900">2</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                <p className="text-xs text-orange-600">Requires attention</p>
              </div>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <AlertTriangle className="text-gray-600" size={24} />
            </div>
          </div>
        </div>

        <div className="minimal-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expected ROI</p>
              <p className="text-2xl font-semibold text-gray-900">₹45,000</p>
              <div className="flex items-center mt-1">
                <ArrowUp className="w-3 h-3 text-green-600 mr-1" />
                <p className="text-xs text-green-600">+12% from last season</p>
              </div>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <TrendingUp className="text-gray-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Recent Activities & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="minimal-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="text-gray-600 mr-2" size={20} />
            Recent Activities
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <Leaf className="text-green-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Crop Advisory Received</p>
                <p className="text-xs text-gray-600">Recommended Rice for Plot A</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="text-orange-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Pest Alert</p>
                <p className="text-xs text-gray-600">Brown Planthopper detected nearby</p>
                <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
              </div>
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="text-blue-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Market Update</p>
                <p className="text-xs text-gray-600">Rice prices increased by 8%</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
              <ArrowUp className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>

        <div className="minimal-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <CloudRain className="text-gray-600 mr-2" size={20} />
            Weather & Soil
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Droplets className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Rainfall</p>
                  <p className="text-sm text-gray-600">125mm this month</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">Good</p>
                <p className="text-xs text-gray-600">Above average</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+15%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Thermometer className="text-yellow-600" size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Soil pH</p>
                  <p className="text-sm text-gray-600">6.8 (Neutral)</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">Optimal</p>
                <p className="text-xs text-gray-600">For rice cultivation</p>
                <div className="w-2 h-2 bg-green-400 rounded-full mt-1 ml-auto"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Leaf className="text-green-600" size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nitrogen</p>
                  <p className="text-sm text-gray-600">Medium levels</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">Good</p>
                <p className="text-xs text-gray-600">Supplement needed</p>
                <div className="flex items-center mt-1">
                  <ArrowDown className="w-3 h-3 text-yellow-500 mr-1" />
                  <span className="text-xs text-yellow-600">Monitor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Insights */}
      <div className="minimal-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Users className="text-gray-600 mr-2" size={20} />
          Community Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <div className="p-3 bg-green-100 rounded-lg mx-auto mb-4 w-fit">
              <Users className="text-green-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">1,247</p>
            <p className="text-sm font-medium text-gray-700">Active Farmers</p>
            <p className="text-xs text-gray-600 mt-2">Connected community</p>
            <div className="mt-3 flex items-center justify-center">
              <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+12% this month</span>
            </div>
          </div>
          
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <div className="p-3 bg-blue-100 rounded-lg mx-auto mb-4 w-fit">
              <MapIcon className="text-blue-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">156</p>
            <p className="text-sm font-medium text-gray-700">Farms Monitored</p>
            <p className="text-xs text-gray-600 mt-2">Smart agriculture</p>
            <div className="mt-3 flex items-center justify-center">
              <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+8% growth</span>
            </div>
          </div>
          
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <div className="p-3 bg-orange-100 rounded-lg mx-auto mb-4 w-fit">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">23</p>
            <p className="text-sm font-medium text-gray-700">Active Alerts</p>
            <p className="text-xs text-gray-600 mt-2">Pest monitoring</p>
            <div className="mt-3 flex items-center justify-center">
              <ArrowDown className="w-3 h-3 text-red-500 mr-1" />
              <span className="text-xs text-red-600">-15% from last week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;