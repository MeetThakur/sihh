import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, MapPin, Search, X, Loader2 } from 'lucide-react';
import { locationService, State, City } from '../../services/locationService';

interface LocationSelectorProps {
  selectedState?: State | null;
  selectedCity?: City | null;
  onStateChange: (state: State | null) => void;
  onCityChange: (city: City | null) => void;
  showPincode?: boolean;
  onPincodeChange?: (pincode: string, locationData?: any) => void;
  disabled?: boolean;
  className?: string;
  error?: string;
  required?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedState,
  selectedCity,
  onStateChange,
  onCityChange,
  showPincode = false,
  onPincodeChange,
  disabled = false,
  className = '',
  error,
  required = false,
}) => {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);

  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [stateSearchQuery, setStateSearchQuery] = useState('');
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [pincode, setPincode] = useState('');

  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Load states on component mount
  useEffect(() => {
    loadStates();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (selectedState) {
      loadCities(selectedState.code);
      onCityChange(null); // Reset city when state changes
    } else {
      setCities([]);
      onCityChange(null);
    }
  }, [selectedState]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
        setShowStateDropdown(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadStates = async () => {
    setIsLoadingStates(true);
    try {
      const statesList = await locationService.getStates();
      setStates(statesList);
    } catch (error) {
      console.error('Failed to load states:', error);
    } finally {
      setIsLoadingStates(false);
    }
  };

  const loadCities = async (stateCode: string) => {
    setIsLoadingCities(true);
    try {
      const citiesList = await locationService.getCities(stateCode);
      setCities(citiesList);
    } catch (error) {
      console.error('Failed to load cities:', error);
    } finally {
      setIsLoadingCities(false);
    }
  };

  const handlePincodeChange = async (value: string) => {
    setPincode(value);

    if (locationService.isValidPincode(value)) {
      setIsLoadingPincode(true);
      try {
        const locationData = await locationService.getLocationByPincode(value);
        if (locationData) {
          // Auto-select state and city based on pincode
          const state = locationService.getStateByNameOrCode(locationData.state);
          if (state) {
            onStateChange(state);

            // Try to find and select the city
            const citiesList = await locationService.getCities(state.code);
            const city = citiesList.find(c =>
              c.name.toLowerCase() === locationData.city.toLowerCase() ||
              c.name.toLowerCase() === locationData.district.toLowerCase()
            );
            if (city) {
              onCityChange(city);
            }
          }

          if (onPincodeChange) {
            onPincodeChange(value, locationData);
          }
        }
      } catch (error) {
        console.error('Failed to lookup pincode:', error);
      } finally {
        setIsLoadingPincode(false);
      }
    } else if (onPincodeChange) {
      onPincodeChange(value);
    }
  };

  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(stateSearchQuery.toLowerCase())
  );

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Pincode Input (if enabled) */}
      {showPincode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode {required && '*'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={pincode}
              onChange={(e) => handlePincodeChange(e.target.value)}
              className={`appearance-none relative block w-full px-3 py-3 border ${
                error ? 'border-red-300' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              placeholder="Enter 6-digit pincode"
              maxLength={6}
              disabled={disabled}
            />
            {isLoadingPincode && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Enter pincode to auto-fill state and city
          </p>
        </div>
      )}

      {/* State Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State {required && '*'}
        </label>
        <div className="relative" ref={stateDropdownRef}>
          <button
            type="button"
            onClick={() => setShowStateDropdown(!showStateDropdown)}
            disabled={disabled}
            className={`relative w-full bg-white border ${
              error ? 'border-red-300' : 'border-gray-300'
            } rounded-md pl-3 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm ${
              disabled ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
              <span className="block truncate">
                {selectedState ? selectedState.name : 'Select State'}
              </span>
            </span>
            <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </span>
          </button>

          {showStateDropdown && (
            <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {/* Search input */}
              <div className="sticky top-0 bg-white p-2 border-b">
                <div className="relative">
                  <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={stateSearchQuery}
                    onChange={(e) => setStateSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Search states..."
                  />
                </div>
              </div>

              {isLoadingStates ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">Loading states...</span>
                </div>
              ) : filteredStates.length === 0 ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  No states found
                </div>
              ) : (
                filteredStates.map((state) => (
                  <button
                    key={state.id}
                    type="button"
                    onClick={() => {
                      onStateChange(state);
                      setShowStateDropdown(false);
                      setStateSearchQuery('');
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                      selectedState?.id === state.id ? 'bg-green-50 text-green-600' : 'text-gray-900'
                    }`}
                  >
                    {state.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* City Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City/District {required && '*'}
        </label>
        <div className="relative" ref={cityDropdownRef}>
          <button
            type="button"
            onClick={() => setShowCityDropdown(!showCityDropdown)}
            disabled={disabled || !selectedState}
            className={`relative w-full bg-white border ${
              error ? 'border-red-300' : 'border-gray-300'
            } rounded-md pl-3 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm ${
              disabled || !selectedState ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
              <span className="block truncate">
                {selectedCity ? selectedCity.name : selectedState ? 'Select City' : 'Select State First'}
              </span>
            </span>
            <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </span>
          </button>

          {showCityDropdown && selectedState && (
            <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {/* Search input */}
              <div className="sticky top-0 bg-white p-2 border-b">
                <div className="relative">
                  <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Search cities..."
                  />
                </div>
              </div>

              {isLoadingCities ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">Loading cities...</span>
                </div>
              ) : filteredCities.length === 0 ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  No cities found
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const customCity: City = {
                          id: 'custom',
                          name: citySearchQuery || 'Other',
                          stateId: selectedState.id,
                          stateName: selectedState.name,
                        };
                        onCityChange(customCity);
                        setShowCityDropdown(false);
                        setCitySearchQuery('');
                      }}
                      className="text-xs text-green-600 hover:text-green-700"
                    >
                      Add "{citySearchQuery || 'Other'}" as custom city
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => {
                        onCityChange(city);
                        setShowCityDropdown(false);
                        setCitySearchQuery('');
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                        selectedCity?.id === city.id ? 'bg-green-50 text-green-600' : 'text-gray-900'
                      }`}
                    >
                      {city.name}
                    </button>
                  ))}
                  {citySearchQuery && !filteredCities.some(city =>
                    city.name.toLowerCase() === citySearchQuery.toLowerCase()
                  ) && (
                    <button
                      type="button"
                      onClick={() => {
                        const customCity: City = {
                          id: 'custom',
                          name: citySearchQuery,
                          stateId: selectedState.id,
                          stateName: selectedState.name,
                        };
                        onCityChange(customCity);
                        setShowCityDropdown(false);
                        setCitySearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-green-600 border-t"
                    >
                      + Add "{citySearchQuery}" as custom city
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Clear Selection */}
      {(selectedState || selectedCity) && (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              onStateChange(null);
              onCityChange(null);
              setPincode('');
              if (onPincodeChange) onPincodeChange('');
            }}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
            disabled={disabled}
          >
            <X className="h-3 w-3 mr-1" />
            Clear selection
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default LocationSelector;
