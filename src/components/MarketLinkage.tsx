import React from 'react';
import { TrendingUp, MapPin, Phone, Users, ExternalLink, RefreshCw } from 'lucide-react';

interface MarketPrice {
  crop: string;
  market: string;
  price: number;
  change: number;
  distance: string;
  lastUpdated: string;
}

interface Buyer {
  id: string;
  name: string;
  type: 'FPO' | 'Trader' | 'Processor';
  location: string;
  crops: string[];
  rating: number;
  contact: string;
}

const MarketLinkage: React.FC = () => {
  // Mock market data
  const marketPrices: MarketPrice[] = [
    {
      crop: 'Rice (Basmati)',
      market: 'Rampur Mandi',
      price: 2450,
      change: 8.2,
      distance: '5 km',
      lastUpdated: '2 hours ago'
    },
    {
      crop: 'Rice (Basmati)',
      market: 'Delhi Azadpur',
      price: 2650,
      change: 12.5,
      distance: '45 km',
      lastUpdated: '1 hour ago'
    },
    {
      crop: 'Wheat',
      market: 'Rampur Mandi',
      price: 2150,
      change: -2.3,
      distance: '5 km',
      lastUpdated: '3 hours ago'
    },
    {
      crop: 'Sugarcane',
      market: 'Sugar Mill Rampur',
      price: 320,
      change: 5.1,
      distance: '8 km',
      lastUpdated: '6 hours ago'
    }
  ];

  const buyers: Buyer[] = [
    {
      id: '1',
      name: 'Rampur Farmers Producer Organization',
      type: 'FPO',
      location: 'Rampur',
      crops: ['Rice', 'Wheat', 'Sugarcane'],
      rating: 4.8,
      contact: '+91 98765 43210'
    },
    {
      id: '2',
      name: 'Modern Food Processing',
      type: 'Processor',
      location: 'Ghaziabad',
      crops: ['Rice', 'Wheat'],
      rating: 4.5,
      contact: '+91 98765 43211'
    },
    {
      id: '3',
      name: 'Green Valley Traders',
      type: 'Trader',
      location: 'Delhi',
      crops: ['Rice', 'Sugarcane'],
      rating: 4.2,
      contact: '+91 98765 43212'
    }
  ];

  const getChangeIcon = (change: number) => {
    return change >= 0 ? '↗' : '↘';
  };

  const getBuyerTypeColor = (type: string) => {
    switch (type) {
      case 'FPO': return 'bg-emerald-100 text-emerald-800';
      case 'Processor': return 'bg-blue-100 text-blue-800';
      case 'Trader': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen p-6">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Market Linkage Platform
        </h1>
        <p className="text-gray-600 text-lg">Real-time Prices & Direct Buyer Connections</p>
      </div>

      {/* Enhanced Market Prices */}
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mr-4 shadow-lg">
              <TrendingUp className="text-white" size={28} />
            </div>
            Live Market Prices
          </h2>
          <button className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold">
            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            <span>Refresh Prices</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {marketPrices.map((price, index) => (
            <div key={index} className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{price.crop}</h3>
                  <div className={`flex items-center px-4 py-2 rounded-2xl font-bold shadow-lg ${
                    price.change >= 0 
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                      : 'bg-gradient-to-r from-red-100 to-orange-100 text-red-700'
                  }`}>
                    <span className="text-lg mr-1">{getChangeIcon(price.change)}</span>
                    <span>{Math.abs(price.change)}%</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Market:</span>
                      <span className="font-bold text-blue-700">{price.market}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Current Price:</span>
                      <span className="text-2xl font-bold text-emerald-600">₹{price.price}</span>
                    </div>
                    <div className="text-sm text-emerald-600 text-right font-medium">per quintal</div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center p-2 bg-purple-50 rounded-xl">
                      <MapPin size={16} className="mr-2 text-purple-500" />
                      <span className="text-purple-700 font-medium">{price.distance}</span>
                    </div>
                    <span className="text-gray-500 font-medium">{price.lastUpdated}</span>
                  </div>
                </div>
                
                <button className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <ExternalLink size={20} className="inline mr-2" />
                  Get Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Buyer Connections */}
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <div className="p-3 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl mr-4 shadow-lg">
            <Users className="text-white" size={28} />
          </div>
          Connect with Verified Buyers
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {buyers.map((buyer) => (
            <div key={buyer.id} className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full opacity-20 -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{buyer.name}</h4>
                    <span className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${getBuyerTypeColor(buyer.type)}`}>
                      {buyer.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-amber-400 text-lg mb-1">
                      {'★'.repeat(Math.floor(buyer.rating))}
                    </div>
                    <span className="text-sm font-bold text-amber-600">{buyer.rating}/5</span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <div className="flex items-center text-sm">
                      <MapPin size={16} className="mr-2 text-blue-500" />
                      <span className="text-blue-700 font-medium">{buyer.location}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    <div className="flex items-center text-sm">
                      <Phone size={16} className="mr-2 text-green-500" />
                      <span className="text-green-700 font-medium">{buyer.contact}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-700 mb-3">Currently Buying:</p>
                  <div className="flex flex-wrap gap-2">
                    {buyer.crops.map((crop, index) => (
                      <span key={index} className="px-3 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl text-sm font-bold border border-emerald-200">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <Phone size={16} className="inline mr-2" />
                    Call
                  </button>
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Price Trends */}
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mr-4 shadow-lg">
            <TrendingUp className="text-white" size={28} />
          </div>
          Price Trends (Last 30 Days)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-6 bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl border-2 border-emerald-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <h4 className="text-lg font-bold text-emerald-900 mb-3">Rice (Basmati)</h4>
            <div className="text-3xl font-bold text-emerald-600 mb-2">₹2,450</div>
            <div className="flex items-center text-sm">
              <span className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-xl font-bold mr-2">↗ +8.2%</span>
              <span className="text-emerald-600 font-medium">Trending Up</span>
            </div>
          </div>
          
          <div className="group p-6 bg-gradient-to-br from-red-50 to-orange-100 rounded-3xl border-2 border-red-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <h4 className="text-lg font-bold text-red-900 mb-3">Wheat</h4>
            <div className="text-3xl font-bold text-red-600 mb-2">₹2,150</div>
            <div className="flex items-center text-sm">
              <span className="px-3 py-1 bg-red-200 text-red-800 rounded-xl font-bold mr-2">↘ -2.3%</span>
              <span className="text-red-600 font-medium">Declining</span>
            </div>
          </div>
          
          <div className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl border-2 border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <h4 className="text-lg font-bold text-blue-900 mb-3">Sugarcane</h4>
            <div className="text-3xl font-bold text-blue-600 mb-2">₹320</div>
            <div className="flex items-center text-sm">
              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-xl font-bold mr-2">↗ +5.1%</span>
              <span className="text-blue-600 font-medium">Stable Growth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketLinkage;