import React, { useState } from 'react';
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
  const [selectedCrop, setSelectedCrop] = useState<string>('rice');

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

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-emerald-600' : 'text-red-600';
  };

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
    <div className="space-y-6">
      {/* Market Prices */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <TrendingUp className="mr-2 text-emerald-600" size={24} />
            Live Market Prices
          </h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {marketPrices.map((price, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{price.crop}</h3>
                <span className={`text-sm font-medium ${getChangeColor(price.change)}`}>
                  {getChangeIcon(price.change)} {Math.abs(price.change)}%
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Market:</span>
                  <span className="font-medium">{price.market}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="text-lg font-bold text-emerald-600">₹{price.price}/quintal</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {price.distance}
                  </span>
                  <span className="text-gray-500">{price.lastUpdated}</span>
                </div>
              </div>
              
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Get Directions
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Buyer Connections */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Users className="mr-2 text-emerald-600" size={20} />
          Connect with Buyers
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {buyers.map((buyer) => (
            <div key={buyer.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{buyer.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBuyerTypeColor(buyer.type)}`}>
                    {buyer.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-amber-500">
                    {'★'.repeat(Math.floor(buyer.rating))}
                  </div>
                  <span className="text-sm text-gray-600">{buyer.rating}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={14} className="mr-2" />
                  {buyer.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={14} className="mr-2" />
                  {buyer.contact}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Buying:</p>
                <div className="flex flex-wrap gap-1">
                  {buyer.crops.map((crop, index) => (
                    <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                  Contact
                </button>
                <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Trends */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Price Trends (Last 30 Days)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <h4 className="font-medium text-emerald-900 mb-2">Rice</h4>
            <div className="text-2xl font-bold text-emerald-600 mb-1">₹2,450</div>
            <div className="text-sm text-emerald-600 flex items-center">
              <span>↗ +8.2%</span>
              <span className="ml-2 text-emerald-500">Trending Up</span>
            </div>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-900 mb-2">Wheat</h4>
            <div className="text-2xl font-bold text-red-600 mb-1">₹2,150</div>
            <div className="text-sm text-red-600 flex items-center">
              <span>↘ -2.3%</span>
              <span className="ml-2 text-red-500">Declining</span>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Sugarcane</h4>
            <div className="text-2xl font-bold text-blue-600 mb-1">₹320</div>
            <div className="text-sm text-blue-600 flex items-center">
              <span>↗ +5.1%</span>
              <span className="ml-2 text-blue-500">Stable Growth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketLinkage;