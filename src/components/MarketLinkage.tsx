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
      case 'FPO': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300';
      case 'Processor': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'Trader': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Minimal Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Market Linkage
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Real-time Prices & Direct Buyer Connections</p>
      </div>

      {/* Minimal Market Prices */}
      <div className="minimal-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <TrendingUp className="text-gray-600 dark:text-gray-400 mr-2" size={20} />
            Live Market Prices
          </h2>
          <button className="minimal-button minimal-button-secondary flex items-center">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {marketPrices.map((price, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{price.crop}</h3>
                <div className={`px-3 py-1 rounded-md text-sm font-medium ${
                  price.change >= 0 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                  <span className="mr-1">{getChangeIcon(price.change)}</span>
                  {Math.abs(price.change)}%
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Market:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{price.market}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">₹{price.price}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Distance:</span>
                  <span className="text-gray-900 dark:text-gray-100">{price.distance}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{price.lastUpdated}</span>
                </div>
                
                <button className="w-full mt-4 minimal-button minimal-button-primary flex items-center justify-center">
                  <ExternalLink size={16} className="mr-2" />
                  Get Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buyer Connections */}
      <div className="minimal-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <Users className="text-gray-600 dark:text-gray-400 mr-2" size={20} />
          Verified Buyers
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {buyers.map((buyer) => (
            <div key={buyer.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{buyer.name}</h4>
                  <span className={`px-3 py-1 rounded-md text-sm font-medium ${getBuyerTypeColor(buyer.type)}`}>
                    {buyer.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-400 text-sm mb-1">
                    {'★'.repeat(Math.floor(buyer.rating))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{buyer.rating}/5</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin size={16} className="mr-2" />
                  <span>{buyer.location}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone size={16} className="mr-2" />
                  <span>{buyer.contact}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currently Buying:</p>
                <div className="flex flex-wrap gap-2">
                  {buyer.crops.map((crop, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 minimal-button minimal-button-primary flex items-center justify-center">
                  <Phone size={16} className="mr-2" />
                  Call
                </button>
                <button className="flex-1 minimal-button minimal-button-secondary">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Trends */}
      <div className="minimal-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <TrendingUp className="text-gray-600 dark:text-gray-400 mr-2" size={20} />
          Price Trends (Last 30 Days)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Rice (Basmati)</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">₹2,450</div>
            <div className="flex items-center text-sm">
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-sm font-medium mr-2">↗ +8.2%</span>
              <span className="text-gray-600 dark:text-gray-400">Trending Up</span>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Wheat</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">₹2,150</div>
            <div className="flex items-center text-sm">
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded text-sm font-medium mr-2">↘ -2.3%</span>
              <span className="text-gray-600 dark:text-gray-400">Declining</span>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Sugarcane</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">₹320</div>
            <div className="flex items-center text-sm">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-sm font-medium mr-2">↗ +5.1%</span>
              <span className="text-gray-600 dark:text-gray-400">Stable Growth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketLinkage;