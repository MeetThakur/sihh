interface WeatherData {
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
  };
}

interface ForecastDay {
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
    totalsnow_cm: number;
    avgvis_km: number;
    avgvis_miles: number;
    avghumidity: number;
    daily_will_it_rain: number;
    daily_chance_of_rain: number;
    daily_will_it_snow: number;
    daily_chance_of_snow: number;
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
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    will_it_rain: number;
    chance_of_rain: number;
    will_it_snow: number;
    chance_of_snow: number;
    vis_km: number;
    vis_miles: number;
    gust_mph: number;
    gust_kph: number;
    uv: number;
  }>;
}

interface WeatherForecast {
  location: WeatherData["location"];
  current: WeatherData["current"];
  forecast: {
    forecastday: ForecastDay[];
  };
}

interface WeatherAlert {
  headline: string;
  msgtype: string;
  severity: string;
  urgency: string;
  areas: string;
  category: string;
  certainty: string;
  event: string;
  note: string;
  effective: string;
  expires: string;
  desc: string;
  instruction: string;
}

interface WeatherResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class WeatherService {
  private readonly API_KEY =
    import.meta.env.VITE_WEATHER_API_KEY || "8f30ca483be54af28f0203235252109";
  private readonly BASE_URL = "https://api.weatherapi.com/v1";

  private async makeRequest<T>(endpoint: string): Promise<WeatherResponse<T>> {
    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error:
            errorData.error?.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          message: "Failed to fetch weather data",
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Weather API error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        message: "Failed to connect to weather service",
      };
    }
  }

  /**
   * Get current weather data for a location
   */
  async getCurrentWeather(
    location: string,
  ): Promise<WeatherResponse<WeatherData>> {
    const endpoint = `/current.json?key=${this.API_KEY}&q=${encodeURIComponent(location)}&aqi=yes`;
    return this.makeRequest<WeatherData>(endpoint);
  }

  /**
   * Get weather forecast for multiple days
   */
  async getForecast(
    location: string,
    days: number = 7,
  ): Promise<WeatherResponse<WeatherForecast>> {
    // Limit days to API constraints (1-10 days for free tier)
    const validDays = Math.min(Math.max(days, 1), 7);
    const endpoint = `/forecast.json?key=${this.API_KEY}&q=${encodeURIComponent(location)}&days=${validDays}&aqi=yes&alerts=yes`;
    return this.makeRequest<WeatherForecast>(endpoint);
  }

  /**
   * Get weather alerts for a location
   */
  async getWeatherAlerts(
    location: string,
  ): Promise<WeatherResponse<WeatherAlert[]>> {
    const endpoint = `/forecast.json?key=${this.API_KEY}&q=${encodeURIComponent(location)}&days=1&aqi=no&alerts=yes`;
    const response = await this.makeRequest<{
      alerts?: { alert: WeatherAlert[] };
    }>(endpoint);

    if (response.success && response.data?.alerts?.alert) {
      return {
        success: true,
        data: response.data.alerts.alert,
      };
    }

    return {
      success: true,
      data: [],
    };
  }

  /**
   * Search for locations (for autocomplete)
   */
  async searchLocations(query: string): Promise<
    WeatherResponse<
      Array<{
        id: number;
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        url: string;
      }>
    >
  > {
    if (query.length < 3) {
      return {
        success: true,
        data: [],
      };
    }

    const endpoint = `/search.json?key=${this.API_KEY}&q=${encodeURIComponent(query)}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Get agricultural-specific weather insights
   */
  async getAgriculturalWeather(location: string): Promise<
    WeatherResponse<{
      current: WeatherData["current"];
      forecast: ForecastDay[];
      insights: {
        isGoodForPlanting: boolean;
        irrigationNeeded: boolean;
        pestRisk: "low" | "medium" | "high";
        harvestWeather: "excellent" | "good" | "poor";
        recommendations: string[];
      };
    }>
  > {
    const forecastResponse = await this.getForecast(location, 7);

    if (!forecastResponse.success || !forecastResponse.data) {
      return {
        success: false,
        error: forecastResponse.error,
        message: forecastResponse.message,
      };
    }

    const { current, forecast } = forecastResponse.data;
    const forecastDays = forecast.forecastday;

    // Calculate agricultural insights
    const avgHumidity =
      forecastDays.reduce((sum, day) => sum + day.day.avghumidity, 0) /
      forecastDays.length;
    const totalRainfall = forecastDays.reduce(
      (sum, day) => sum + day.day.totalprecip_mm,
      0,
    );
    const avgTemp =
      forecastDays.reduce((sum, day) => sum + day.day.avgtemp_c, 0) /
      forecastDays.length;

    const insights = {
      isGoodForPlanting: avgTemp >= 15 && avgTemp <= 35 && totalRainfall < 50,
      irrigationNeeded: totalRainfall < 10 && avgHumidity < 60,
      pestRisk:
        avgHumidity > 80 || totalRainfall > 30
          ? "high"
          : avgHumidity > 60 || totalRainfall > 15
            ? "medium"
            : "low",
      harvestWeather:
        totalRainfall < 5 && avgHumidity < 70
          ? "excellent"
          : totalRainfall < 15 && avgHumidity < 80
            ? "good"
            : "poor",
      recommendations: this.generateRecommendations(current, forecastDays),
    } as const;

    return {
      success: true,
      data: {
        current,
        forecast: forecastDays,
        insights,
      },
    };
  }

  private generateRecommendations(
    current: WeatherData["current"],
    forecast: ForecastDay[],
  ): string[] {
    const recommendations: string[] = [];
    const avgTemp =
      forecast.reduce((sum, day) => sum + day.day.avgtemp_c, 0) /
      forecast.length;
    const totalRain = forecast.reduce(
      (sum, day) => sum + day.day.totalprecip_mm,
      0,
    );
    const avgHumidity =
      forecast.reduce((sum, day) => sum + day.day.avghumidity, 0) /
      forecast.length;

    // Temperature-based recommendations
    if (avgTemp > 35) {
      recommendations.push(
        "High temperatures expected - increase irrigation frequency and provide shade for sensitive crops",
      );
    } else if (avgTemp < 10) {
      recommendations.push(
        "Low temperatures forecasted - protect crops from frost and consider delayed planting",
      );
    }

    // Rainfall recommendations
    if (totalRain > 50) {
      recommendations.push(
        "Heavy rainfall expected - ensure proper drainage and monitor for fungal diseases",
      );
    } else if (totalRain < 5) {
      recommendations.push(
        "Minimal rainfall forecasted - plan for increased irrigation and water conservation",
      );
    }

    // Humidity recommendations
    if (avgHumidity > 80) {
      recommendations.push(
        "High humidity levels - monitor for pest activity and fungal infections",
      );
    } else if (avgHumidity < 40) {
      recommendations.push(
        "Low humidity conditions - increase watering frequency and consider mulching",
      );
    }

    // Wind recommendations
    if (current.wind_kph > 25) {
      recommendations.push(
        "Strong winds expected - secure plant supports and protect young seedlings",
      );
    }

    // UV recommendations
    if (current.uv > 8) {
      recommendations.push(
        "High UV levels - protect workers and consider shade for sensitive crops",
      );
    }

    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push(
        "Weather conditions are favorable for normal farming activities",
      );
    }

    return recommendations;
  }

  /**
   * Get weather data suitable for dashboard display
   */
  async getDashboardWeather(location: string): Promise<
    WeatherResponse<{
      current: {
        temperature: number;
        condition: string;
        humidity: number;
        windSpeed: number;
        rainfall: number;
        uvIndex: number;
        icon: string;
      };
      forecast: Array<{
        date: string;
        maxTemp: number;
        minTemp: number;
        condition: string;
        chanceOfRain: number;
        icon: string;
      }>;
      alerts: WeatherAlert[];
      lastUpdated: string;
    }>
  > {
    try {
      const [currentResponse, forecastResponse, alertsResponse] =
        await Promise.all([
          this.getCurrentWeather(location),
          this.getForecast(location, 5),
          this.getWeatherAlerts(location),
        ]);

      if (!currentResponse.success) {
        return {
          success: false,
          error: currentResponse.error,
          message: currentResponse.message,
        };
      }

      const current = currentResponse.data!.current;
      const forecast = forecastResponse.data?.forecast.forecastday || [];
      const alerts = alertsResponse.data || [];

      return {
        success: true,
        data: {
          current: {
            temperature: Math.round(current.temp_c),
            condition: current.condition.text,
            humidity: current.humidity,
            windSpeed: Math.round(current.wind_kph),
            rainfall: current.precip_mm,
            uvIndex: current.uv,
            icon: current.condition.icon,
          },
          forecast: forecast.slice(1, 5).map((day) => ({
            date: day.date,
            maxTemp: Math.round(day.day.maxtemp_c),
            minTemp: Math.round(day.day.mintemp_c),
            condition: day.day.condition.text,
            chanceOfRain: day.day.daily_chance_of_rain,
            icon: day.day.condition.icon,
          })),
          alerts,
          lastUpdated: current.last_updated,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to fetch dashboard weather data",
      };
    }
  }
}

// Export singleton instance
const weatherService = new WeatherService();
export default weatherService;

// Export types for use in components
export type {
  WeatherData,
  WeatherForecast,
  ForecastDay,
  WeatherAlert,
  WeatherResponse,
};
