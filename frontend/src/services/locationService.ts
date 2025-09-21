// Location Service for Indian States and Cities
// Uses multiple APIs for comprehensive location data

export interface State {
  id: string;
  name: string;
  code: string;
}

export interface City {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  pincode?: string;
}

export interface PincodeData {
  pincode: string;
  city: string;
  district: string;
  state: string;
  country: string;
}

class LocationService {
  private readonly API_ENDPOINTS = {
    // Primary API for Indian states and cities
    states: "https://api.countrystatecity.in/v1/countries/IN/states",
    cities: (stateCode: string) =>
      `https://api.countrystatecity.in/v1/countries/IN/states/${stateCode}/cities`,

    // Backup API for pincode lookup
    pincode: (pincode: string) =>
      `https://api.postalpincode.in/pincode/${pincode}`,

    // Alternative API
    alternativeStates: "https://cdn-api.co-vin.in/api/v2/admin/location/states",
    alternativeDistricts: (stateId: string) =>
      `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId}`,
  };

  private readonly API_HEADERS = {
    "X-CSCAPI-KEY": "YOUR_API_KEY_HERE", // Replace with actual API key from countrystatecity.in
    "Content-Type": "application/json",
  };

  // Fallback data for Indian states
  private readonly INDIAN_STATES: State[] = [
    { id: "1", name: "Andhra Pradesh", code: "AP" },
    { id: "2", name: "Arunachal Pradesh", code: "AR" },
    { id: "3", name: "Assam", code: "AS" },
    { id: "4", name: "Bihar", code: "BR" },
    { id: "5", name: "Chhattisgarh", code: "CG" },
    { id: "6", name: "Goa", code: "GA" },
    { id: "7", name: "Gujarat", code: "GJ" },
    { id: "8", name: "Haryana", code: "HR" },
    { id: "9", name: "Himachal Pradesh", code: "HP" },
    { id: "10", name: "Jharkhand", code: "JH" },
    { id: "11", name: "Karnataka", code: "KA" },
    { id: "12", name: "Kerala", code: "KL" },
    { id: "13", name: "Madhya Pradesh", code: "MP" },
    { id: "14", name: "Maharashtra", code: "MH" },
    { id: "15", name: "Manipur", code: "MN" },
    { id: "16", name: "Meghalaya", code: "ML" },
    { id: "17", name: "Mizoram", code: "MZ" },
    { id: "18", name: "Nagaland", code: "NL" },
    { id: "19", name: "Odisha", code: "OR" },
    { id: "20", name: "Punjab", code: "PB" },
    { id: "21", name: "Rajasthan", code: "RJ" },
    { id: "22", name: "Sikkim", code: "SK" },
    { id: "23", name: "Tamil Nadu", code: "TN" },
    { id: "24", name: "Telangana", code: "TS" },
    { id: "25", name: "Tripura", code: "TR" },
    { id: "26", name: "Uttar Pradesh", code: "UP" },
    { id: "27", name: "Uttarakhand", code: "UK" },
    { id: "28", name: "West Bengal", code: "WB" },
    { id: "29", name: "Andaman and Nicobar Islands", code: "AN" },
    { id: "30", name: "Chandigarh", code: "CH" },
    { id: "31", name: "Dadra and Nagar Haveli and Daman and Diu", code: "DH" },
    { id: "32", name: "Delhi", code: "DL" },
    { id: "33", name: "Jammu and Kashmir", code: "JK" },
    { id: "34", name: "Ladakh", code: "LA" },
    { id: "35", name: "Lakshadweep", code: "LD" },
    { id: "36", name: "Puducherry", code: "PY" },
  ];

  // Major cities data for popular states
  private readonly MAJOR_CITIES: Record<string, City[]> = {
    MH: [
      // Maharashtra
      { id: "1", name: "Mumbai", stateId: "14", stateName: "Maharashtra" },
      { id: "2", name: "Pune", stateId: "14", stateName: "Maharashtra" },
      { id: "3", name: "Nagpur", stateId: "14", stateName: "Maharashtra" },
      { id: "4", name: "Nashik", stateId: "14", stateName: "Maharashtra" },
      { id: "5", name: "Aurangabad", stateId: "14", stateName: "Maharashtra" },
    ],
    DL: [
      // Delhi
      { id: "6", name: "New Delhi", stateId: "32", stateName: "Delhi" },
      { id: "7", name: "Delhi", stateId: "32", stateName: "Delhi" },
    ],
    KA: [
      // Karnataka
      { id: "8", name: "Bangalore", stateId: "11", stateName: "Karnataka" },
      { id: "9", name: "Mysore", stateId: "11", stateName: "Karnataka" },
      { id: "10", name: "Hubli", stateId: "11", stateName: "Karnataka" },
    ],
    TN: [
      // Tamil Nadu
      { id: "11", name: "Chennai", stateId: "23", stateName: "Tamil Nadu" },
      { id: "12", name: "Coimbatore", stateId: "23", stateName: "Tamil Nadu" },
      { id: "13", name: "Madurai", stateId: "23", stateName: "Tamil Nadu" },
    ],
    UP: [
      // Uttar Pradesh
      { id: "14", name: "Lucknow", stateId: "26", stateName: "Uttar Pradesh" },
      { id: "15", name: "Kanpur", stateId: "26", stateName: "Uttar Pradesh" },
      { id: "16", name: "Agra", stateId: "26", stateName: "Uttar Pradesh" },
    ],
    GJ: [
      // Gujarat
      { id: "17", name: "Ahmedabad", stateId: "7", stateName: "Gujarat" },
      { id: "18", name: "Surat", stateId: "7", stateName: "Gujarat" },
      { id: "19", name: "Vadodara", stateId: "7", stateName: "Gujarat" },
    ],
    PB: [
      // Punjab
      { id: "20", name: "Ludhiana", stateId: "20", stateName: "Punjab" },
      { id: "21", name: "Amritsar", stateId: "20", stateName: "Punjab" },
      { id: "22", name: "Jalandhar", stateId: "20", stateName: "Punjab" },
    ],
    RJ: [
      // Rajasthan
      { id: "23", name: "Jaipur", stateId: "21", stateName: "Rajasthan" },
      { id: "24", name: "Jodhpur", stateId: "21", stateName: "Rajasthan" },
      { id: "25", name: "Udaipur", stateId: "21", stateName: "Rajasthan" },
    ],
  };

  /**
   * Get all Indian states
   */
  async getStates(): Promise<State[]> {
    try {
      // Try primary API first
      const response = await fetch(this.API_ENDPOINTS.states, {
        headers: this.API_HEADERS,
      });

      if (response.ok) {
        const states = await response.json();
        return states.map(
          (state: { id: number; name: string; iso2: string }) => ({
            id: state.id.toString(),
            name: state.name,
            code: state.iso2,
          }),
        );
      }

      // Fallback to hardcoded data
      return this.INDIAN_STATES;
    } catch (error) {
      console.warn("Primary states API failed, using fallback data:", error);
      return this.INDIAN_STATES;
    }
  }

  /**
   * Get cities for a specific state
   */
  async getCities(stateCode: string): Promise<City[]> {
    try {
      // Try to get from major cities first
      if (this.MAJOR_CITIES[stateCode]) {
        return this.MAJOR_CITIES[stateCode];
      }

      // Try primary API
      const response = await fetch(this.API_ENDPOINTS.cities(stateCode), {
        headers: this.API_HEADERS,
      });

      if (response.ok) {
        const cities = await response.json();
        const state = this.INDIAN_STATES.find((s) => s.code === stateCode);

        return cities.map((city: { id: number; name: string }) => ({
          id: city.id.toString(),
          name: city.name,
          stateId: state?.id || "",
          stateName: state?.name || "",
        }));
      }

      // Fallback to major cities or empty array
      return this.MAJOR_CITIES[stateCode] || [];
    } catch (error) {
      console.warn("Cities API failed, using fallback data:", error);
      return this.MAJOR_CITIES[stateCode] || [];
    }
  }

  /**
   * Get location data from pincode
   */
  async getLocationByPincode(pincode: string): Promise<PincodeData | null> {
    try {
      const response = await fetch(this.API_ENDPOINTS.pincode(pincode));

      if (response.ok) {
        const data = await response.json();

        if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0];
          return {
            pincode: pincode,
            city: postOffice.Name || postOffice.District,
            district: postOffice.District,
            state: postOffice.State,
            country: postOffice.Country,
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Pincode lookup failed:", error);
      return null;
    }
  }

  /**
   * Search cities by name
   */
  searchCities(query: string, stateCode?: string): City[] {
    const allCities = stateCode
      ? this.MAJOR_CITIES[stateCode] || []
      : Object.values(this.MAJOR_CITIES).flat();

    return allCities.filter((city) =>
      city.name.toLowerCase().includes(query.toLowerCase()),
    );
  }

  /**
   * Get state by name or code
   */
  getStateByNameOrCode(nameOrCode: string): State | null {
    return (
      this.INDIAN_STATES.find(
        (state) =>
          state.name.toLowerCase() === nameOrCode.toLowerCase() ||
          state.code.toLowerCase() === nameOrCode.toLowerCase(),
      ) || null
    );
  }

  /**
   * Validate Indian pincode format
   */
  isValidPincode(pincode: string): boolean {
    return /^[1-9][0-9]{5}$/.test(pincode);
  }

  /**
   * Get popular cities (for quick selection)
   */
  getPopularCities(): City[] {
    return [
      { id: "1", name: "Mumbai", stateId: "14", stateName: "Maharashtra" },
      { id: "6", name: "New Delhi", stateId: "32", stateName: "Delhi" },
      { id: "8", name: "Bangalore", stateId: "11", stateName: "Karnataka" },
      { id: "11", name: "Chennai", stateId: "23", stateName: "Tamil Nadu" },
      { id: "2", name: "Pune", stateId: "14", stateName: "Maharashtra" },
      { id: "17", name: "Ahmedabad", stateId: "7", stateName: "Gujarat" },
      { id: "23", name: "Jaipur", stateId: "21", stateName: "Rajasthan" },
      { id: "20", name: "Ludhiana", stateId: "20", stateName: "Punjab" },
    ];
  }

  /**
   * Get farming-focused cities (for agricultural users)
   */
  getFarmingCities(): City[] {
    return [
      { id: "20", name: "Ludhiana", stateId: "20", stateName: "Punjab" },
      { id: "21", name: "Amritsar", stateId: "20", stateName: "Punjab" },
      { id: "3", name: "Nagpur", stateId: "14", stateName: "Maharashtra" },
      { id: "15", name: "Kanpur", stateId: "26", stateName: "Uttar Pradesh" },
      { id: "18", name: "Surat", stateId: "7", stateName: "Gujarat" },
      { id: "13", name: "Madurai", stateId: "23", stateName: "Tamil Nadu" },
      { id: "24", name: "Jodhpur", stateId: "21", stateName: "Rajasthan" },
    ];
  }

  /**
   * Auto-suggest location based on partial input
   */
  async autoSuggestLocation(query: string): Promise<{
    states: State[];
    cities: City[];
  }> {
    const states = this.INDIAN_STATES.filter((state) =>
      state.name.toLowerCase().includes(query.toLowerCase()),
    );

    const cities = this.searchCities(query);

    return { states, cities };
  }
}

// Export singleton instance
export const locationService = new LocationService();
export default locationService;
