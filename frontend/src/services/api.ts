import {
  User,
  LoginCredentials,
  RegisterData,
  ApiResponse,
  AuthResponse,
} from "../types";
import {
  Farm,
  CreateFarmData,
  UpdateFarmData,
  DashboardData,
  FarmStats,
  PlotData,
  PlotActivity,
} from "./farmService";

// Re-export types for easier importing
export type { User, LoginCredentials, RegisterData, ApiResponse, AuthResponse };

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiService {
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    this.token = localStorage.getItem("authToken");
    this.refreshToken = localStorage.getItem("refreshToken");
  }

  // Helper method to make HTTP requests
  public async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (
      this.token &&
      !endpoint.includes("/auth/login") &&
      !endpoint.includes("/auth/register")
    ) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      // Handle 401 unauthorized - token might be expired
      if (
        response.status === 401 &&
        this.refreshToken &&
        !endpoint.includes("/auth/refresh-token")
      ) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request with new token
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${this.token}`,
          };
          const retryResponse = await fetch(url, config);
          const retryData = await retryResponse.json();
          return retryData;
        } else {
          // Refresh failed, clear tokens and redirect to login
          this.clearTokens();
          throw new Error("Session expired. Please login again.");
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Authentication methods
  async login(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await this.makeRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      this.setTokens(response.data.token, response.data.refreshToken);
    }

    return response;
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await this.makeRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      this.setTokens(response.data.token, response.data.refreshToken);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.makeRequest("/auth/logout", {
        method: "POST",
      });
      return response;
    } finally {
      this.clearTokens();
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await this.makeRequest<{
        token: string;
        refreshToken: string;
      }>("/auth/refresh-token", {
        method: "POST",
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.success && response.data) {
        this.setTokens(response.data.token, response.data.refreshToken);
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    return false;
  }

  // User profile methods
  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.makeRequest<{ user: User }>("/auth/profile");
  }

  async updateProfile(
    userData: Partial<User>,
  ): Promise<ApiResponse<{ user: User }>> {
    return this.makeRequest<{ user: User }>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async changePassword(passwords: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    return this.makeRequest("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(passwords),
    });
  }

  // Password reset methods
  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.makeRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ApiResponse> {
    return this.makeRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Email verification
  async verifyEmail(token: string): Promise<ApiResponse> {
    return this.makeRequest(`/auth/verify-email/${token}`, {
      method: "GET",
    });
  }

  async resendVerificationEmail(): Promise<ApiResponse> {
    return this.makeRequest("/auth/resend-verification", {
      method: "POST",
    });
  }

  // Token management
  setTokens(accessToken: string, refreshToken: string): void {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  clearTokens(): void {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.clearTokens();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Farm management methods
  async getFarms(): Promise<ApiResponse<{ farms: Farm[] }>> {
    return this.makeRequest<{ farms: Farm[] }>("/farms");
  }

  async getFarmById(id: string): Promise<ApiResponse<{ farm: Farm }>> {
    return this.makeRequest<{ farm: Farm }>(`/farms/${id}`);
  }

  async createFarm(
    farmData: CreateFarmData,
  ): Promise<ApiResponse<{ farm: Farm }>> {
    return this.makeRequest<{ farm: Farm }>("/farms", {
      method: "POST",
      body: JSON.stringify(farmData),
    });
  }

  async updateFarm(
    farmId: string,
    farmData: UpdateFarmData,
  ): Promise<ApiResponse<{ farm: Farm }>> {
    return this.makeRequest<{ farm: Farm }>(`/farms/${farmId}`, {
      method: "PUT",
      body: JSON.stringify(farmData),
    });
  }

  async deleteFarm(farmId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/farms/${farmId}`, {
      method: "DELETE",
    });
  }

  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    return this.makeRequest<DashboardData>("/farms/dashboard");
  }

  async getFarmStats(): Promise<ApiResponse<FarmStats>> {
    return this.makeRequest<FarmStats>("/farms/stats");
  }

  async updatePlot(
    farmId: string,
    plotNumber: number,
    plotData: Partial<PlotData>,
  ): Promise<ApiResponse<{ farm: Farm; updatedPlot: PlotData }>> {
    return this.makeRequest<{ farm: Farm; updatedPlot: PlotData }>(
      `/farms/${farmId}/plots/${plotNumber}`,
      {
        method: "PUT",
        body: JSON.stringify(plotData),
      },
    );
  }

  async bulkUpdatePlots(
    farmId: string,
    plotNumbers: number[],
    plotData: Partial<PlotData>,
  ): Promise<ApiResponse<{ farm: Farm; updatedPlots: PlotData[] }>> {
    // Force convert to integers to be absolutely sure
    const safeIntegerPlotNumbers = plotNumbers
      .map((n) => Math.floor(Number(n)))
      .filter((n) => Number.isInteger(n) && n > 0);

    const requestBody = {
      plotNumbers: safeIntegerPlotNumbers,
      plotData,
    };

    console.log("API Request:", {
      url: `/farms/${farmId}/plots/bulk-update`,
      plotNumbers: safeIntegerPlotNumbers,
      plotData: plotData,
    });

    return this.makeRequest<{ farm: Farm; updatedPlots: PlotData[] }>(
      `/farms/${farmId}/plots/bulk-update`,
      {
        method: "PUT",
        body: JSON.stringify(requestBody),
      },
    );
  }

  async bulkClearPlots(
    farmId: string,
    plotNumbers: number[],
  ): Promise<ApiResponse<{ farm: Farm; clearedPlots: number[] }>> {
    // Force convert to integers to be absolutely sure
    const safeIntegerPlotNumbers = plotNumbers
      .map((n) => Math.floor(Number(n)))
      .filter((n) => Number.isInteger(n) && n > 0);

    const requestBody = {
      plotNumbers: safeIntegerPlotNumbers,
    };

    return this.makeRequest<{ farm: Farm; clearedPlots: number[] }>(
      `/farms/${farmId}/plots/bulk-clear`,
      {
        method: "PUT",
        body: JSON.stringify(requestBody),
      },
    );
  }

  async addPlotActivity(
    farmId: string,
    plotNumber: number,
    activity: PlotActivity,
  ): Promise<ApiResponse<{ activity: PlotActivity; plot: PlotData }>> {
    return this.makeRequest<{ activity: PlotActivity; plot: PlotData }>(
      `/farms/${farmId}/plots/${plotNumber}/activities`,
      {
        method: "POST",
        body: JSON.stringify(activity),
      },
    );
  }

  // Crop management methods (for future use)
  async getCrops(): Promise<ApiResponse<unknown[]>> {
    return this.makeRequest("/crops");
  }

  async getCropRecommendations(
    farmData: Record<string, unknown>,
  ): Promise<ApiResponse<unknown[]>> {
    return this.makeRequest("/crops/recommendations", {
      method: "POST",
      body: JSON.stringify(farmData),
    });
  }

  // Weather methods (for future use)
  async getWeather(location: {
    lat: number;
    lon: number;
  }): Promise<ApiResponse<unknown>> {
    return this.makeRequest(`/weather?lat=${location.lat}&lon=${location.lon}`);
  }

  // Market prices methods (for future use)
  async getMarketPrices(
    crop?: string,
    location?: string,
  ): Promise<ApiResponse<unknown[]>> {
    const params = new URLSearchParams();
    if (crop) params.append("crop", crop);
    if (location) params.append("location", location);

    return this.makeRequest(
      `/market/prices${params.toString() ? `?${params.toString()}` : ""}`,
    );
  }

  // Pest alerts methods (for future use)
  async getPestAlerts(location?: string): Promise<ApiResponse<unknown[]>> {
    const params = location ? `?location=${location}` : "";
    return this.makeRequest(`/pests/alerts${params}`);
  }

  async reportPest(
    pestData: Record<string, unknown>,
  ): Promise<ApiResponse<unknown>> {
    return this.makeRequest("/pests/report", {
      method: "POST",
      body: JSON.stringify(pestData),
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Also export the class for testing purposes
export { ApiService };
