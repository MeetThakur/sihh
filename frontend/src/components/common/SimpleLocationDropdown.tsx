import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

interface LocationOption {
  value: string;
  label: string;
}

interface SimpleLocationDropdownProps {
  type: 'state' | 'city';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  dependsOn?: string; // For city dropdown to depend on state
  className?: string;
}

const SimpleLocationDropdown: React.FC<SimpleLocationDropdownProps> = ({
  type,
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  required = false,
  dependsOn,
  className = '',
}) => {
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Indian states data
  const INDIAN_STATES: LocationOption[] = [
    { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
    { value: 'arunachal-pradesh', label: 'Arunachal Pradesh' },
    { value: 'assam', label: 'Assam' },
    { value: 'bihar', label: 'Bihar' },
    { value: 'chhattisgarh', label: 'Chhattisgarh' },
    { value: 'goa', label: 'Goa' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'himachal-pradesh', label: 'Himachal Pradesh' },
    { value: 'jharkhand', label: 'Jharkhand' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'manipur', label: 'Manipur' },
    { value: 'meghalaya', label: 'Meghalaya' },
    { value: 'mizoram', label: 'Mizoram' },
    { value: 'nagaland', label: 'Nagaland' },
    { value: 'odisha', label: 'Odisha' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'sikkim', label: 'Sikkim' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'tripura', label: 'Tripura' },
    { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
    { value: 'uttarakhand', label: 'Uttarakhand' },
    { value: 'west-bengal', label: 'West Bengal' },
    { value: 'andaman-nicobar', label: 'Andaman and Nicobar Islands' },
    { value: 'chandigarh', label: 'Chandigarh' },
    { value: 'dadra-nagar-haveli-daman-diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'jammu-kashmir', label: 'Jammu and Kashmir' },
    { value: 'ladakh', label: 'Ladakh' },
    { value: 'lakshadweep', label: 'Lakshadweep' },
    { value: 'puducherry', label: 'Puducherry' },
  ];

  // Cities data organized by state
  const CITIES_BY_STATE: Record<string, LocationOption[]> = {
    'maharashtra': [
      { value: 'mumbai', label: 'Mumbai' },
      { value: 'pune', label: 'Pune' },
      { value: 'nagpur', label: 'Nagpur' },
      { value: 'nashik', label: 'Nashik' },
      { value: 'aurangabad', label: 'Aurangabad' },
      { value: 'solapur', label: 'Solapur' },
      { value: 'kolhapur', label: 'Kolhapur' },
      { value: 'sangli', label: 'Sangli' },
      { value: 'ahmednagar', label: 'Ahmednagar' },
      { value: 'akola', label: 'Akola' },
    ],
    'gujarat': [
      { value: 'ahmedabad', label: 'Ahmedabad' },
      { value: 'surat', label: 'Surat' },
      { value: 'vadodara', label: 'Vadodara' },
      { value: 'rajkot', label: 'Rajkot' },
      { value: 'bhavnagar', label: 'Bhavnagar' },
      { value: 'jamnagar', label: 'Jamnagar' },
      { value: 'gandhinagar', label: 'Gandhinagar' },
      { value: 'anand', label: 'Anand' },
      { value: 'bharuch', label: 'Bharuch' },
      { value: 'morbi', label: 'Morbi' },
    ],
    'punjab': [
      { value: 'ludhiana', label: 'Ludhiana' },
      { value: 'amritsar', label: 'Amritsar' },
      { value: 'jalandhar', label: 'Jalandhar' },
      { value: 'patiala', label: 'Patiala' },
      { value: 'bathinda', label: 'Bathinda' },
      { value: 'mohali', label: 'Mohali' },
      { value: 'firozpur', label: 'Firozpur' },
      { value: 'pathankot', label: 'Pathankot' },
      { value: 'moga', label: 'Moga' },
      { value: 'abohar', label: 'Abohar' },
    ],
    'rajasthan': [
      { value: 'jaipur', label: 'Jaipur' },
      { value: 'jodhpur', label: 'Jodhpur' },
      { value: 'udaipur', label: 'Udaipur' },
      { value: 'kota', label: 'Kota' },
      { value: 'bikaner', label: 'Bikaner' },
      { value: 'ajmer', label: 'Ajmer' },
      { value: 'alwar', label: 'Alwar' },
      { value: 'bharatpur', label: 'Bharatpur' },
      { value: 'sikar', label: 'Sikar' },
      { value: 'pali', label: 'Pali' },
    ],
    'karnataka': [
      { value: 'bangalore', label: 'Bangalore' },
      { value: 'mysore', label: 'Mysore' },
      { value: 'hubli-dharwad', label: 'Hubli-Dharwad' },
      { value: 'mangalore', label: 'Mangalore' },
      { value: 'belgaum', label: 'Belgaum' },
      { value: 'gulbarga', label: 'Gulbarga' },
      { value: 'davanagere', label: 'Davanagere' },
      { value: 'bellary', label: 'Bellary' },
      { value: 'bijapur', label: 'Bijapur' },
      { value: 'shimoga', label: 'Shimoga' },
    ],
    'tamil-nadu': [
      { value: 'chennai', label: 'Chennai' },
      { value: 'coimbatore', label: 'Coimbatore' },
      { value: 'madurai', label: 'Madurai' },
      { value: 'tiruchirappalli', label: 'Tiruchirappalli' },
      { value: 'salem', label: 'Salem' },
      { value: 'tirunelveli', label: 'Tirunelveli' },
      { value: 'tiruppur', label: 'Tiruppur' },
      { value: 'vellore', label: 'Vellore' },
      { value: 'erode', label: 'Erode' },
      { value: 'thoothukudi', label: 'Thoothukudi' },
    ],
    'uttar-pradesh': [
      { value: 'lucknow', label: 'Lucknow' },
      { value: 'kanpur', label: 'Kanpur' },
      { value: 'ghaziabad', label: 'Ghaziabad' },
      { value: 'agra', label: 'Agra' },
      { value: 'meerut', label: 'Meerut' },
      { value: 'varanasi', label: 'Varanasi' },
      { value: 'allahabad', label: 'Allahabad' },
      { value: 'bareilly', label: 'Bareilly' },
      { value: 'aligarh', label: 'Aligarh' },
      { value: 'moradabad', label: 'Moradabad' },
    ],
    'west-bengal': [
      { value: 'kolkata', label: 'Kolkata' },
      { value: 'howrah', label: 'Howrah' },
      { value: 'durgapur', label: 'Durgapur' },
      { value: 'asansol', label: 'Asansol' },
      { value: 'siliguri', label: 'Siliguri' },
      { value: 'malda', label: 'Malda' },
      { value: 'barrackpore', label: 'Barrackpore' },
      { value: 'bhatpara', label: 'Bhatpara' },
      { value: 'panihati', label: 'Panihati' },
      { value: 'kamarhati', label: 'Kamarhati' },
    ],
    'haryana': [
      { value: 'faridabad', label: 'Faridabad' },
      { value: 'gurgaon', label: 'Gurgaon' },
      { value: 'panipat', label: 'Panipat' },
      { value: 'ambala', label: 'Ambala' },
      { value: 'karnal', label: 'Karnal' },
      { value: 'hisar', label: 'Hisar' },
      { value: 'rohtak', label: 'Rohtak' },
      { value: 'sirsa', label: 'Sirsa' },
      { value: 'yamunanagar', label: 'Yamunanagar' },
      { value: 'panchkula', label: 'Panchkula' },
    ],
    'bihar': [
      { value: 'patna', label: 'Patna' },
      { value: 'gaya', label: 'Gaya' },
      { value: 'bhagalpur', label: 'Bhagalpur' },
      { value: 'muzaffarpur', label: 'Muzaffarpur' },
      { value: 'darbhanga', label: 'Darbhanga' },
      { value: 'bihar-sharif', label: 'Bihar Sharif' },
      { value: 'arrah', label: 'Arrah' },
      { value: 'begusarai', label: 'Begusarai' },
      { value: 'katihar', label: 'Katihar' },
      { value: 'munger', label: 'Munger' },
    ],
    'delhi': [
      { value: 'new-delhi', label: 'New Delhi' },
      { value: 'delhi', label: 'Delhi' },
      { value: 'gurgaon', label: 'Gurgaon' },
      { value: 'faridabad', label: 'Faridabad' },
      { value: 'noida', label: 'Noida' },
      { value: 'ghaziabad', label: 'Ghaziabad' },
    ],
  };

  useEffect(() => {
    if (type === 'state') {
      setOptions(INDIAN_STATES);
    } else if (type === 'city' && dependsOn) {
      setOptions(CITIES_BY_STATE[dependsOn] || []);
    }
  }, [type, dependsOn]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption?.label || placeholder || `Select ${type}`;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || (type === 'city' && !dependsOn)}
        className={`relative w-full bg-white border ${
          error ? 'border-red-300' : 'border-gray-300'
        } rounded-md pl-3 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm ${
          disabled || (type === 'city' && !dependsOn) ? 'bg-gray-50 cursor-not-allowed' : ''
        }`}
      >
        <span className="flex items-center">
          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
          <span className={`block truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
            {displayText}
          </span>
        </span>
        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </span>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {options.length === 0 ? (
            <div className="py-4 text-center text-sm text-gray-500">
              {type === 'city' && !dependsOn ? 'Please select a state first' : 'No options available'}
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                  value === option.value ? 'bg-green-50 text-green-600' : 'text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SimpleLocationDropdown;
