import React from 'react';
import { Leaf, AlertTriangle, TrendingUp, Calendar, Users, Droplets, Map as MapIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Season</p>
              <p className="text-2xl font-bold text-gray-900">Kharif 2025</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Calendar className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Crops</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Leaf className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pest Alerts</p>
              <p className="text-2xl font-bold text-orange-600">2</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expected ROI</p>
              <p className="text-2xl font-bold text-blue-600">₹45,000</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Leaf className="text-emerald-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Crop Advisory Received</p>
                <p className="text-xs text-gray-600">Recommended Rice for Plot A - 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="text-orange-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Pest Alert</p>
                <p className="text-xs text-gray-600">Brown Planthopper detected nearby - 5 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="text-blue-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Market Update</p>
                <p className="text-xs text-gray-600">Rice prices increased by 8% - 1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather & Soil</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-sky-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <Droplets className="text-sky-600" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Rainfall</p>
                  <p className="text-sm text-gray-600">125mm this month</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-sky-600">Good</p>
                <p className="text-xs text-gray-600">Above average</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <div className="w-5 h-5 bg-amber-600 rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Soil pH</p>
                  <p className="text-sm text-gray-600">6.8 (Neutral)</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-amber-600">Optimal</p>
                <p className="text-xs text-gray-600">For rice cultivation</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <div className="w-5 h-5 bg-emerald-600 rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nitrogen</p>
                  <p className="text-sm text-gray-600">Medium levels</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">Good</p>
                <p className="text-xs text-gray-600">Supplement needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Insights */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <Users className="mx-auto text-emerald-600 mb-2" size={24} />
            <p className="text-2xl font-bold text-gray-900">1,247</p>
            <p className="text-sm text-gray-600">Active Farmers</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <MapIcon className="mx-auto text-blue-600 mb-2" size={24} />
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-sm text-gray-600">Farms Monitored</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <AlertTriangle className="mx-auto text-orange-600 mb-2" size={24} />
            <p className="text-2xl font-bold text-gray-900">23</p>
            <p className="text-sm text-gray-600">Active Pest Alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;