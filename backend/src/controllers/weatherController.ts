import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { logger } from "../config/logger";

interface WeatherAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime: string;
  };
  current: {
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
    air_quality?: {
      co: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      "us-epa-index": number;
      "gb-defra-index": number;
    };
  };
}

interface ForecastAPIResponse {
  location: WeatherAPIResponse["location"];
  current: WeatherAPIResponse["current"];
  forecast: {
    forecastday: Array<{
      date: string;
      date_epoch: number;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        avgtemp_c: number;
        avgtemp_f: number;
        maxwind_mph: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        totalprecip_in: number;
        avgvis_km: number;
        avgvis_miles: number;
        avghumidity: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        uv: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
        moonrise: string;
        moonset: string;
        moon_phase: string;
        moon_illumination: string;
      };
      hour: Array<{
        time_epoch: number;
        time: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        vis_km: number;
        vis_miles: number;
        uv: number;
        will_it_rain: number;
        chance_of_rain: string;
        will_it_snow: number;
        chance_of_snow: string;
      }>;
    }>;
  };
}

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1";

class WeatherService {
  private async makeRequest<T>(
    endpoint: string,
    params: Record<string, string>,
  ): Promise<T> {
    if (!WEATHER_API_KEY) {
      throw new Error("Weather API key not configured");
    }

    const url = new URL(`${WEATHER_API_BASE_URL}${endpoint}`);
    url.searchParams.append("key", WEATHER_API_KEY);

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`Weather API error: ${response.status} - ${errorText}`);
      throw new Error(`Weather API error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async getCurrentWeather(location: string): Promise<WeatherAPIResponse> {
    return this.makeRequest<WeatherAPIResponse>("/current.json", {
      q: location,
      aqi: "yes",
    });
  }

  async getForecast(
    location: string,
    days: number = 3,
  ): Promise<ForecastAPIResponse> {
    return this.makeRequest<ForecastAPIResponse>("/forecast.json", {
      q: location,
      days: Math.min(Math.max(days, 1), 14).toString(),
      aqi: "yes",
      alerts: "yes",
    });
  }

  async getHistoricalWeather(location: string, date: string): Promise<any> {
    return this.makeRequest("/history.json", {
      q: location,
      dt: date,
    });
  }

  async searchLocations(query: string): Promise<any[]> {
    return this.makeRequest<any[]>("/search.json", {
      q: query,
    });
  }
}

const weatherService = new WeatherService();

// Get current weather
export const getCurrentWeather = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { lat, lon, location } = req.query;

    let searchQuery: string;
    if (location && typeof location === "string") {
      searchQuery = location;
    } else if (lat && lon) {
      searchQuery = `${lat},${lon}`;
    } else {
      return res.status(400).json({
        success: false,
        message: "Either location name or coordinates (lat, lon) are required",
        error: "MISSING_LOCATION",
      });
    }

    const weatherData = await weatherService.getCurrentWeather(searchQuery);

    res.json({
      success: true,
      message: "Current weather retrieved successfully",
      data: {
        location: weatherData.location,
        current: weatherData.current,
        last_updated: weatherData.current.last_updated,
        agricultural_insights: {
          irrigation_recommended:
            weatherData.current.humidity < 60 &&
            weatherData.current.precip_mm < 1,
          pest_risk:
            weatherData.current.humidity > 80
              ? "high"
              : weatherData.current.humidity > 60
                ? "medium"
                : "low",
          field_work_suitable:
            weatherData.current.precip_mm < 1 &&
            weatherData.current.wind_kph < 25,
          uv_protection_needed: weatherData.current.uv > 6,
        },
      },
    });
  } catch (error) {
    logger.error("Get current weather error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve current weather",
      error: error instanceof Error ? error.message : "WEATHER_API_ERROR",
    });
  }
};

// Get weather forecast
export const getWeatherForecast = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { lat, lon, location, days = "3" } = req.query;

    let searchQuery: string;
    if (location && typeof location === "string") {
      searchQuery = location;
    } else if (lat && lon) {
      searchQuery = `${lat},${lon}`;
    } else {
      return res.status(400).json({
        success: false,
        message: "Either location name or coordinates (lat, lon) are required",
        error: "MISSING_LOCATION",
      });
    }

    const forecastDays = parseInt(days as string, 10) || 3;
    const forecastData = await weatherService.getForecast(
      searchQuery,
      forecastDays,
    );

    // Add agricultural insights for each day
    const enhancedForecast = forecastData.forecast.forecastday.map((day) => ({
      ...day,
      agricultural_insights: {
        best_time_for_irrigation:
          day.day.avghumidity < 60 ? "morning" : "evening",
        planting_conditions:
          day.day.maxtemp_c > 15 &&
          day.day.maxtemp_c < 35 &&
          day.day.totalprecip_mm < 10
            ? "good"
            : "poor",
        harvest_suitable:
          day.day.totalprecip_mm < 5 && day.day.avghumidity < 80,
        pest_alert: day.day.avghumidity > 80 && day.day.maxtemp_c > 20,
        frost_risk: day.day.mintemp_c < 5,
      },
    }));

    res.json({
      success: true,
      message: "Weather forecast retrieved successfully",
      data: {
        location: forecastData.location,
        current: forecastData.current,
        forecast: enhancedForecast,
      },
    });
  } catch (error) {
    logger.error("Get weather forecast error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve weather forecast",
      error: error instanceof Error ? error.message : "WEATHER_API_ERROR",
    });
  }
};

// Get weather alerts and agricultural recommendations
export const getWeatherAlerts = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { lat, lon, location } = req.query;

    let searchQuery: string;
    if (location && typeof location === "string") {
      searchQuery = location;
    } else if (lat && lon) {
      searchQuery = `${lat},${lon}`;
    } else {
      return res.status(400).json({
        success: false,
        message: "Either location name or coordinates (lat, lon) are required",
        error: "MISSING_LOCATION",
      });
    }

    // Get 7-day forecast for alert analysis
    const forecastData = await weatherService.getForecast(searchQuery, 7);

    const alerts = [];
    const recommendations = [];

    // Analyze weather data for agricultural alerts
    forecastData.forecast.forecastday.forEach((day, index) => {
      const date = new Date(day.date);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      // Temperature alerts
      if (day.day.maxtemp_c > 40) {
        alerts.push({
          type: "heat_warning",
          severity: "high",
          title: "Extreme Heat Warning",
          message: `Very high temperature expected on ${dayName} (${day.day.maxtemp_c}°C)`,
          date: day.date,
          recommendations: [
            "Avoid midday field work",
            "Increase irrigation",
            "Provide shade for livestock",
          ],
        });
      }

      if (day.day.mintemp_c < 0) {
        alerts.push({
          type: "frost_warning",
          severity: "high",
          title: "Frost Warning",
          message: `Frost expected on ${dayName} (${day.day.mintemp_c}°C)`,
          date: day.date,
          recommendations: [
            "Cover sensitive crops",
            "Harvest mature crops",
            "Use frost protection methods",
          ],
        });
      }

      // Heavy rain alerts
      if (day.day.totalprecip_mm > 25) {
        alerts.push({
          type: "heavy_rain",
          severity: "medium",
          title: "Heavy Rain Expected",
          message: `Heavy rainfall expected on ${dayName} (${day.day.totalprecip_mm}mm)`,
          date: day.date,
          recommendations: [
            "Ensure proper drainage",
            "Postpone harvesting",
            "Check for waterlogging",
          ],
        });
      }

      // Drought conditions
      if (day.day.totalprecip_mm < 1 && day.day.avghumidity < 40) {
        recommendations.push({
          type: "irrigation_needed",
          title: "Irrigation Recommended",
          message: `Low moisture conditions on ${dayName}`,
          date: day.date,
          actions: [
            "Increase irrigation frequency",
            "Check soil moisture",
            "Mulch around plants",
          ],
        });
      }

      // Pest risk
      if (
        day.day.avghumidity > 80 &&
        day.day.maxtemp_c > 20 &&
        day.day.maxtemp_c < 30
      ) {
        alerts.push({
          type: "pest_risk",
          severity: "medium",
          title: "High Pest Activity Risk",
          message: `Conditions favorable for pest activity on ${dayName}`,
          date: day.date,
          recommendations: [
            "Monitor crops closely",
            "Consider preventive treatments",
            "Check for early signs of infestation",
          ],
        });
      }
    });

    res.json({
      success: true,
      message: "Weather alerts and recommendations retrieved successfully",
      data: {
        location: forecastData.location,
        alerts,
        recommendations,
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Get weather alerts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve weather alerts",
      error: error instanceof Error ? error.message : "WEATHER_API_ERROR",
    });
  }
};

// Search locations
export const searchLocations = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
        error: "MISSING_QUERY",
      });
    }

    const locations = await weatherService.searchLocations(q);

    res.json({
      success: true,
      message: "Locations retrieved successfully",
      data: {
        locations,
      },
    });
  } catch (error) {
    logger.error("Search locations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search locations",
      error: error instanceof Error ? error.message : "WEATHER_API_ERROR",
    });
  }
};

// Get historical weather (for agricultural planning)
export const getHistoricalWeather = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { lat, lon, location, date } = req.query;

    let searchQuery: string;
    if (location && typeof location === "string") {
      searchQuery = location;
    } else if (lat && lon) {
      searchQuery = `${lat},${lon}`;
    } else {
      return res.status(400).json({
        success: false,
        message: "Either location name or coordinates (lat, lon) are required",
        error: "MISSING_LOCATION",
      });
    }

    if (!date || typeof date !== "string") {
      return res.status(400).json({
        success: false,
        message: "Date is required (YYYY-MM-DD format)",
        error: "MISSING_DATE",
      });
    }

    const historicalData = await weatherService.getHistoricalWeather(
      searchQuery,
      date,
    );

    res.json({
      success: true,
      message: "Historical weather data retrieved successfully",
      data: historicalData,
    });
  } catch (error) {
    logger.error("Get historical weather error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve historical weather data",
      error: error instanceof Error ? error.message : "WEATHER_API_ERROR",
    });
  }
};
