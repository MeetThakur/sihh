import React from 'react';
import { Leaf, AlertTriangle, TrendingUp, Calendar, Users, Droplets, Map as MapIcon, Clock, CloudRain, Thermometer, ArrowUp, ArrowDown } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50 min-h-screen p-6">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Welcome to KhetSetu
        </h1>
        <p className="text-gray-600 text-lg">Your Smart Farming Dashboard</p>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-20 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Current Season</p>
                <p className="text-3xl font-bold text-white">Kharif 2025</p>
                <p className="text-emerald-200 text-xs mt-1">Peak growing season</p>
              </div>
              <div className="p-4 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                <Calendar className="text-white" size={28} />
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-20 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Crops</p>
                <p className="text-3xl font-bold text-white">3</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="w-3 h-3 text-green-200 mr-1" />
                  <p className="text-green-200 text-xs">+2 this month</p>
                </div>
              </div>
              <div className="p-4 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                <Leaf className="text-white" size={28} />
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-20 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pest Alerts</p>
                <p className="text-3xl font-bold text-white">2</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                  <p className="text-orange-200 text-xs">Requires attention</p>
                </div>
              </div>
              <div className="p-4 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                <AlertTriangle className="text-white" size={28} />
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-20 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Expected ROI</p>
                <p className="text-3xl font-bold text-white">₹45,000</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="w-3 h-3 text-green-300 mr-1" />
                  <p className="text-blue-200 text-xs">+12% from last season</p>
                </div>
              </div>
              <div className="p-4 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                <TrendingUp className="text-white" size={28} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Recent Activities & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl mr-3 shadow-lg">
              <Clock className="text-white" size={20} />
            </div>
            Recent Activities
          </h3>
          <div className="space-y-4">
            <div className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Leaf className="text-white" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">Crop Advisory Received</p>
                <p className="text-xs text-emerald-700 font-medium">Recommended Rice for Plot A</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="text-white" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">Pest Alert</p>
                <p className="text-xs text-orange-700 font-medium">Brown Planthopper detected nearby</p>
                <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
              </div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="text-white" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">Market Update</p>
                <p className="text-xs text-blue-700 font-medium">Rice prices increased by 8%</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
              <ArrowUp className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl mr-3 shadow-lg">
              <CloudRain className="text-white" size={20} />
            </div>
            Weather & Soil
          </h3>
          <div className="space-y-5">
            <div className="group flex items-center justify-between p-5 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border border-sky-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Droplets className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Rainfall</p>
                  <p className="text-sm text-sky-700 font-medium">125mm this month</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-sky-600">Good</p>
                <p className="text-xs text-gray-600 font-medium">Above average</p>
                <div className="flex mt-1">
                  <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">+15%</span>
                </div>
              </div>
            </div>

            <div className="group flex items-center justify-between p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Thermometer className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Soil pH</p>
                  <p className="text-sm text-amber-700 font-medium">6.8 (Neutral)</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-amber-600">Optimal</p>
                <p className="text-xs text-gray-600 font-medium">For rice cultivation</p>
                <div className="w-2 h-2 bg-green-400 rounded-full mt-1 ml-auto"></div>
              </div>
            </div>

            <div className="group flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Nitrogen</p>
                  <p className="text-sm text-emerald-700 font-medium">Medium levels</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">Good</p>
                <p className="text-xs text-gray-600 font-medium">Supplement needed</p>
                <div className="flex mt-1">
                  <ArrowDown className="w-3 h-3 text-yellow-500 mr-1" />
                  <span className="text-xs text-yellow-600 font-medium">Monitor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Community Insights */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl mr-3 shadow-lg">
            <Users className="text-white" size={20} />
          </div>
          Community Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="p-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl mx-auto mb-4 w-fit shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Users className="text-white" size={28} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">1,247</p>
            <p className="text-sm font-bold text-emerald-700">Active Farmers</p>
            <p className="text-xs text-gray-600 mt-2">Connected community</p>
            <div className="mt-3 flex items-center justify-center">
              <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600 font-medium">+12% this month</span>
            </div>
          </div>
          
          <div className="group text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="p-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl mx-auto mb-4 w-fit shadow-lg group-hover:scale-110 transition-transform duration-300">
              <MapIcon className="text-white" size={28} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">156</p>
            <p className="text-sm font-bold text-blue-700">Farms Monitored</p>
            <p className="text-xs text-gray-600 mt-2">Smart agriculture</p>
            <div className="mt-3 flex items-center justify-center">
              <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600 font-medium">+8% growth</span>
            </div>
          </div>
          
          <div className="group text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="p-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mx-auto mb-4 w-fit shadow-lg group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="text-white" size={28} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">23</p>
            <p className="text-sm font-bold text-orange-700">Active Alerts</p>
            <p className="text-xs text-gray-600 mt-2">Pest monitoring</p>
            <div className="mt-3 flex items-center justify-center">
              <ArrowDown className="w-3 h-3 text-red-500 mr-1" />
              <span className="text-xs text-red-600 font-medium">-15% from last week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;