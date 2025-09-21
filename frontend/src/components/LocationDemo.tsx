import React, { useState } from 'react';
import { MapPin, Search, Globe, Navigation } from 'lucide-react';
import SimpleLocationDropdown from './common/SimpleLocationDropdown';
import LocationSelector from './common/LocationSelector';
import { State, City, locationService } from '../services/locationService';

const LocationDemo: React.FC = () => {
  // Simple dropdown states
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Advanced selector states
  const [advancedState, setAdvancedState] = useState<State | null>(null);
  const [advancedCity, setAdvancedCity] = useState<City | null>(null);
  const [pincode, setPincode] = useState('');
  const [pincodeData, setPincodeData] = useState<any>(null);

  // Demo data display
  const [farmingCities, setFarmingCities] = useState<City[]>([]);
  const [popularCities, setPopularCities] = useState<City[]>([]);

  React.useEffect(() => {
    // Load demo data
    setFarmingCities(locationService.getFarmingCities());
    setPopularCities(locationService.getPopularCities());
  }, []);

  const handlePincodeChange = async (value: string, locationData?: any) => {
    setPincode(value);
    if (locationData) {
      setPincodeData(locationData);
    } else {
      setPincodeData(null);
    }
  };

  const resetAll = () => {
    setSelectedState('');
    setSelectedCity('');
    setAdvancedState(null);
    setAdvancedCity(null);
    setPincode('');
    setPincodeData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            KhetSetu Location Selector Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience our advanced location selection components with Indian states, cities,
            and pincode lookup functionality designed for agricultural platforms.
          </p>
        </div>

        {/* Demo Sections */}
        <div className="space-y-12">

          {/* Simple Location Dropdown Demo */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Navigation className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Simple Location Dropdown</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Basic state and city selection with dependency management. Cities load based on selected state.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <SimpleLocationDropdown
                  type="state"
                  value={selectedState}
                  onChange={setSelectedState}
                  placeholder="Select your state"
                  required
                />
              </div>
              <div>
                <SimpleLocationDropdown
                  type="city"
                  value={selectedCity}
                  onChange={setSelectedCity}
                  placeholder="Select your city"
                  dependsOn={selectedState}
                  required
                />
              </div>
            </div>

            {(selectedState || selectedCity) && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Selected Values:</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">State:</span> {selectedState || 'None'}</p>
                  <p><span className="font-medium">City:</span> {selectedCity || 'None'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Location Selector Demo */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Search className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Advanced Location Selector</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Feature-rich location selector with pincode lookup, search functionality,
              and automatic location detection.
            </p>

            <LocationSelector
              selectedState={advancedState}
              selectedCity={advancedCity}
              onStateChange={setAdvancedState}
              onCityChange={setAdvancedCity}
              showPincode={true}
              onPincodeChange={handlePincodeChange}
              required
            />

            {(advancedState || advancedCity || pincodeData) && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Advanced Selection Results:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-2"><span className="font-medium">Selected State:</span></p>
                    {advancedState ? (
                      <div className="bg-white p-3 rounded border">
                        <p><span className="font-medium">Name:</span> {advancedState.name}</p>
                        <p><span className="font-medium">Code:</span> {advancedState.code}</p>
                        <p><span className="font-medium">ID:</span> {advancedState.id}</p>
                      </div>
                    ) : (
                      <p className="text-gray-400">None selected</p>
                    )}
                  </div>

                  <div>
                    <p className="text-gray-600 mb-2"><span className="font-medium">Selected City:</span></p>
                    {advancedCity ? (
                      <div className="bg-white p-3 rounded border">
                        <p><span className="font-medium">Name:</span> {advancedCity.name}</p>
                        <p><span className="font-medium">State:</span> {advancedCity.stateName}</p>
                        <p><span className="font-medium">ID:</span> {advancedCity.id}</p>
                      </div>
                    ) : (
                      <p className="text-gray-400">None selected</p>
                    )}
                  </div>
                </div>

                {pincodeData && (
                  <div className="mt-4">
                    <p className="text-gray-600 mb-2"><span className="font-medium">Pincode Data:</span></p>
                    <div className="bg-white p-3 rounded border">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <p><span className="font-medium">Pincode:</span> {pincodeData.pincode}</p>
                        <p><span className="font-medium">City:</span> {pincodeData.city}</p>
                        <p><span className="font-medium">District:</span> {pincodeData.district}</p>
                        <p><span className="font-medium">State:</span> {pincodeData.state}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Popular Farming Cities */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Globe className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Agriculture-Focused Cities</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Pre-curated list of cities known for agricultural activities and farming.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {farmingCities.map((city) => (
                <div
                  key={city.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-300 cursor-pointer transition-colors"
                  onClick={() => {
                    const state = locationService.getStateByNameOrCode(city.stateName);
                    if (state) {
                      setAdvancedState(state);
                      setAdvancedCity(city);
                    }
                  }}
                >
                  <div className="text-sm font-medium text-gray-900">{city.name}</div>
                  <div className="text-xs text-gray-500">{city.stateName}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Cities */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <MapPin className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Popular Cities</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Major cities across India for quick selection.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularCities.map((city) => (
                <div
                  key={city.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-300 cursor-pointer transition-colors"
                  onClick={() => {
                    const state = locationService.getStateByNameOrCode(city.stateName);
                    if (state) {
                      setAdvancedState(state);
                      setAdvancedCity(city);
                    }
                  }}
                >
                  <div className="text-sm font-medium text-gray-900">{city.name}</div>
                  <div className="text-xs text-gray-500">{city.stateName}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features List */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Simple Dropdown Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Clean and simple interface
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    State-dependent city loading
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Validation support
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Disabled state handling
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Advanced Selector Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Pincode-based auto-fill
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Search functionality
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    External API integration
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Custom city addition
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Loading states and error handling
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Test Pincodes */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Test Pincodes</h2>
            <p className="text-gray-600 mb-4">
              Try these sample pincodes to test the auto-fill functionality:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { pincode: '110001', location: 'New Delhi, Delhi' },
                { pincode: '400001', location: 'Mumbai, Maharashtra' },
                { pincode: '560001', location: 'Bangalore, Karnataka' },
                { pincode: '600001', location: 'Chennai, Tamil Nadu' },
                { pincode: '700001', location: 'Kolkata, West Bengal' },
                { pincode: '380001', location: 'Ahmedabad, Gujarat' },
                { pincode: '302001', location: 'Jaipur, Rajasthan' },
                { pincode: '141001', location: 'Ludhiana, Punjab' },
              ].map((item) => (
                <div
                  key={item.pincode}
                  className="p-3 border border-gray-200 rounded-lg hover:border-green-300 cursor-pointer transition-colors text-center"
                  onClick={() => handlePincodeChange(item.pincode)}
                >
                  <div className="text-sm font-medium text-gray-900">{item.pincode}</div>
                  <div className="text-xs text-gray-500">{item.location}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="text-center">
            <button
              onClick={resetAll}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Reset All Selections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDemo;
