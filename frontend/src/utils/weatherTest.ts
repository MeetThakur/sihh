// Weather Service Test Utility
// This file can be used to test the weather service functionality

import weatherService from '../services/weatherService';

/**
 * Test the weather service with a sample location
 */
export const testWeatherService = async () => {
  console.log('🌤️ Testing Weather Service...');

  try {
    // Test with Delhi, India as default location
    const testLocation = 'Delhi, India';
    console.log(`📍 Testing location: ${testLocation}`);

    // Test current weather
    console.log('🔄 Fetching current weather...');
    const currentWeather = await weatherService.getCurrentWeather(testLocation);

    if (currentWeather.success) {
      console.log('✅ Current weather data received:', {
        location: currentWeather.data?.location.name,
        temperature: currentWeather.data?.current.temp_c,
        condition: currentWeather.data?.current.condition.text,
        humidity: currentWeather.data?.current.humidity,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Current weather failed:', currentWeather.error);
    }

    // Test dashboard weather
    console.log('🔄 Fetching dashboard weather...');
    const dashboardWeather = await weatherService.getDashboardWeather(testLocation);

    if (dashboardWeather.success) {
      console.log('✅ Dashboard weather data received:', {
        temperature: dashboardWeather.data?.current.temperature,
        condition: dashboardWeather.data?.current.condition,
        forecastDays: dashboardWeather.data?.forecast.length,
        alerts: dashboardWeather.data?.alerts.length,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Dashboard weather failed:', dashboardWeather.error);
    }

    // Test forecast
    console.log('🔄 Fetching 5-day forecast...');
    const forecast = await weatherService.getForecast(testLocation, 5);

    if (forecast.success) {
      console.log('✅ Forecast data received:', {
        location: forecast.data?.location.name,
        forecastDays: forecast.data?.forecast.forecastday.length,
        firstDayMaxTemp: forecast.data?.forecast.forecastday[0]?.day.maxtemp_c,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Forecast failed:', forecast.error);
    }

    // Test agricultural weather insights
    console.log('🔄 Fetching agricultural insights...');
    const agriWeather = await weatherService.getAgriculturalWeather(testLocation);

    if (agriWeather.success) {
      console.log('✅ Agricultural insights received:', {
        isGoodForPlanting: agriWeather.data?.insights.isGoodForPlanting,
        irrigationNeeded: agriWeather.data?.insights.irrigationNeeded,
        pestRisk: agriWeather.data?.insights.pestRisk,
        harvestWeather: agriWeather.data?.insights.harvestWeather,
        recommendationsCount: agriWeather.data?.insights.recommendations.length,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Agricultural insights failed:', agriWeather.error);
    }

    console.log('🎉 Weather service test completed!');
    return true;

  } catch (error) {
    console.error('💥 Weather service test failed with exception:', error);
    return false;
  }
};

/**
 * Test weather service with multiple locations
 */
export const testMultipleLocations = async () => {
  const locations = [
    'Delhi, India',
    'Mumbai, India',
    'Bangalore, India',
    'Chennai, India',
    'Ludhiana, Punjab, India'
  ];

  console.log('🌍 Testing multiple locations...');

  for (const location of locations) {
    try {
      console.log(`📍 Testing: ${location}`);
      const result = await weatherService.getCurrentWeather(location);

      if (result.success) {
        console.log(`✅ ${location}: ${result.data?.current.temp_c}°C, ${result.data?.current.condition.text}`);
      } else {
        console.error(`❌ ${location}: ${result.error}`);
      }
    } catch (error) {
      console.error(`💥 ${location}: Exception -`, error);
    }

    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

/**
 * Test location search functionality
 */
export const testLocationSearch = async () => {
  console.log('🔍 Testing location search...');

  const searchQueries = ['Del', 'Mumbai', 'Ban', 'Chen', 'Pun'];

  for (const query of searchQueries) {
    try {
      console.log(`🔍 Searching for: "${query}"`);
      const results = await weatherService.searchLocations(query);

      if (results.success) {
        console.log(`✅ Found ${results.data?.length} locations for "${query}"`);
        results.data?.slice(0, 3).forEach((loc, index) => {
          console.log(`   ${index + 1}. ${loc.name}, ${loc.region}, ${loc.country}`);
        });
      } else {
        console.error(`❌ Search failed for "${query}":`, results.error);
      }
    } catch (error) {
      console.error(`💥 Search exception for "${query}":`, error);
    }

    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

/**
 * Run all weather service tests
 */
export const runAllWeatherTests = async () => {
  console.log('🚀 Starting comprehensive weather service tests...');
  console.log('=====================================');

  try {
    // Test basic functionality
    await testWeatherService();

    console.log('\n=====================================');

    // Test multiple locations
    await testMultipleLocations();

    console.log('\n=====================================');

    // Test search functionality
    await testLocationSearch();

    console.log('\n=====================================');
    console.log('🎉 All weather service tests completed!');

  } catch (error) {
    console.error('💥 Weather service test suite failed:', error);
  }
};

/**
 * Quick weather check for development
 */
export const quickWeatherCheck = async (location: string = 'Delhi, India') => {
  try {
    console.log(`⚡ Quick weather check for ${location}...`);
    const result = await weatherService.getDashboardWeather(location);

    if (result.success) {
      const { current, forecast } = result.data!;
      console.log(`🌡️ Temperature: ${current.temperature}°C`);
      console.log(`☁️ Condition: ${current.condition}`);
      console.log(`💧 Humidity: ${current.humidity}%`);
      console.log(`💨 Wind: ${current.windSpeed} km/h`);
      console.log(`🌧️ Rainfall: ${current.rainfall} mm`);
      console.log(`☀️ UV Index: ${current.uvIndex}`);
      console.log(`📅 Forecast days: ${forecast.length}`);

      return result.data;
    } else {
      console.error('❌ Quick weather check failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('💥 Quick weather check exception:', error);
    return null;
  }
};

// Export for console testing
declare global {
  interface Window {
    weatherTest: {
      quick: typeof quickWeatherCheck;
      full: typeof testWeatherService;
      multiple: typeof testMultipleLocations;
      search: typeof testLocationSearch;
      all: typeof runAllWeatherTests;
    };
  }
}

// Make available in browser console for development
if (typeof window !== 'undefined') {
  window.weatherTest = {
    quick: quickWeatherCheck,
    full: testWeatherService,
    multiple: testMultipleLocations,
    search: testLocationSearch,
    all: runAllWeatherTests
  };

  console.log('🛠️ Weather test utilities loaded!');
  console.log('Available commands:');
  console.log('  weatherTest.quick("location") - Quick weather check');
  console.log('  weatherTest.full() - Full service test');
  console.log('  weatherTest.multiple() - Test multiple locations');
  console.log('  weatherTest.search() - Test location search');
  console.log('  weatherTest.all() - Run all tests');
}
