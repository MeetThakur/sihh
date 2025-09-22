import apiService, { ApiResponse } from "./api";

export interface MarketPrice {
  id: string;
  crop: string;
  variety: string;
  market: string;
  price: number;
  change: number;
  volume: number;
  distance: string;
  lastUpdated: string;
  grade: string;
  trend: "up" | "down" | "stable";
  historical: number[];
  unit: string;
  state: string;
  district: string;
}

export interface MarketBuyer {
  id: string;
  name: string;
  type: "FPO" | "Trader" | "Processor" | "Exporter" | "Retailer";
  location: string;
  crops: string[];
  rating: number;
  contact: string;
  verified: boolean;
  activeDeals: number;
  lastActive: string;
  preferredQuantity: string;
  paymentTerms: string;
  requirements: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

export interface MarketOpportunity {
  id: string;
  title: string;
  description: string;
  crop: string;
  type: "export" | "contract" | "spot" | "premium";
  price: number;
  quantity: string;
  deadline: string;
  roi: string;
  risk: "low" | "medium" | "high";
  requirements: string[];
  company: string;
  location: string;
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  terms: string[];
  benefits: string[];
}

export interface ContractFarming {
  id: string;
  company: string;
  crop: string;
  duration: string;
  guaranteedPrice: number;
  advancePayment: string;
  inputs: string;
  area: string;
  location: string;
  terms: string[];
  requirements: string[];
  benefits: string[];
  applicationDeadline: string;
  status: "open" | "closed" | "full";
}

export interface PriceAlert {
  id: string;
  crop: string;
  variety?: string;
  market?: string;
  targetPrice: number;
  currentPrice: number;
  condition: "above" | "below";
  active: boolean;
  createdAt: string;
  triggeredAt?: string;
  userId: string;
}

export interface MarketTrend {
  crop: string;
  period: "7d" | "30d" | "90d" | "1y";
  priceChange: string;
  direction: "up" | "down" | "stable";
  averagePrice: number;
  highestPrice: number;
  lowestPrice: number;
  volatility: number;
  forecast: {
    nextMonth: number;
    confidence: number;
  };
}

export interface DemandForecast {
  crop: string;
  region: string;
  month: string;
  demandLevel: "low" | "medium" | "high" | "very_high";
  projectedPrice: number;
  confidence: number;
  factors: string[];
  recommendations: string[];
}

class MarketService {
  // Market Prices
  async getMarketPrices(params?: {
    crop?: string;
    state?: string;
    district?: string;
    market?: string;
    date?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ prices: MarketPrice[]; total: number }>> {
    const queryParams = new URLSearchParams();

    if (params?.crop) queryParams.append("crop", params.crop);
    if (params?.state) queryParams.append("state", params.state);
    if (params?.district) queryParams.append("district", params.district);
    if (params?.market) queryParams.append("market", params.market);
    if (params?.date) queryParams.append("date", params.date);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    return apiService.makeRequest(
      `/market/prices${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
      { method: "GET" },
    );
  }

  async getLivePrices(
    crops: string[] = [],
  ): Promise<ApiResponse<{ prices: MarketPrice[] }>> {
    const queryParams = new URLSearchParams();
    if (crops.length > 0) {
      crops.forEach((crop) => queryParams.append("crops[]", crop));
    }

    return apiService.makeRequest(
      `/market/live-prices${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
      { method: "GET" },
    );
  }

  async getPriceHistory(
    crop: string,
    market: string,
    days: number = 30,
  ): Promise<ApiResponse<{ history: { date: string; price: number }[] }>> {
    return apiService.makeRequest(
      `/market/price-history?crop=${crop}&market=${market}&days=${days}`,
      { method: "GET" },
    );
  }

  // Market Trends
  async getMarketTrends(params?: {
    crop?: string;
    period?: "7d" | "30d" | "90d" | "1y";
    region?: string;
  }): Promise<ApiResponse<{ trends: MarketTrend[] }>> {
    const queryParams = new URLSearchParams();

    if (params?.crop) queryParams.append("crop", params.crop);
    if (params?.period) queryParams.append("period", params.period);
    if (params?.region) queryParams.append("region", params.region);

    return apiService.makeRequest(
      `/market/trends${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
      { method: "GET" },
    );
  }

  // Demand Forecasting
  async getDemandForecast(params?: {
    crop?: string;
    region?: string;
    months?: number;
  }): Promise<ApiResponse<{ forecast: DemandForecast[] }>> {
    const queryParams = new URLSearchParams();

    if (params?.crop) queryParams.append("crop", params.crop);
    if (params?.region) queryParams.append("region", params.region);
    if (params?.months) queryParams.append("months", params.months.toString());

    return apiService.makeRequest(
      `/market/demand-forecast${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
      { method: "GET" },
    );
  }

  // Buyers and Suppliers
  async getBuyers(params?: {
    crop?: string;
    quantity?: number;
    location?: string;
    type?: string;
    verified?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ buyers: MarketBuyer[]; total: number }>> {
    const queryParams = new URLSearchParams();

    if (params?.crop) queryParams.append("crop", params.crop);
    if (params?.quantity)
      queryParams.append("quantity", params.quantity.toString());
    if (params?.location) queryParams.append("location", params.location);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.verified !== undefined)
      queryParams.append("verified", params.verified.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    return apiService.makeRequest(
      `/market/buyers${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
      { method: "GET" },
    );
  }

  async getBuyerDetails(
    buyerId: string,
  ): Promise<ApiResponse<{ buyer: MarketBuyer }>> {
    return apiService.makeRequest(`/market/buyers/${buyerId}`, {
      method: "GET",
    });
  }

  async contactBuyer(
    buyerId: string,
    message: string,
    cropDetails: {
      crop: string;
      quantity: number;
      quality: string;
      availableDate: string;
    },
  ): Promise<ApiResponse<{ contactId: string }>> {
    return apiService.makeRequest(`/market/buyers/${buyerId}/contact`, {
      method: "POST",
      body: JSON.stringify({ message, cropDetails }),
    });
  }

  // Market Opportunities
  async getOpportunities(params?: {
    farmSize?: number;
    location?: string;
    budget?: number;
    crop?: string;
    type?: string;
    risk?: string;
    limit?: number;
    offset?: number;
  }): Promise<
    ApiResponse<{ opportunities: MarketOpportunity[]; total: number }>
  > {
    const queryParams = new URLSearchParams();

    if (params?.farmSize)
      queryParams.append("farmSize", params.farmSize.toString());
    if (params?.location) queryParams.append("location", params.location);
    if (params?.budget) queryParams.append("budget", params.budget.toString());
    if (params?.crop) queryParams.append("crop", params.crop);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.risk) queryParams.append("risk", params.risk);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    return apiService.makeRequest(
      `/market/opportunities${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
      { method: "GET" },
    );
  }

  async applyToOpportunity(
    opportunityId: string,
    application: {
      message: string;
      expectedQuantity: number;
      proposedPrice?: number;
      additionalInfo: string;
    },
  ): Promise<ApiResponse<{ applicationId: string }>> {
    return apiService.makeRequest(
      `/market/opportunities/${opportunityId}/apply`,
      {
        method: "POST",
        body: JSON.stringify(application),
      },
    );
  }

  // Contract Farming
  async getContracts(params?: {
    crop?: string;
    duration?: "short" | "medium" | "long";
    type?: "fixed" | "variable" | "spot";
    location?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ contracts: ContractFarming[]; total: number }>> {
    const queryParams = new URLSearchParams();

    if (params?.crop) queryParams.append("crop", params.crop);
    if (params?.duration) queryParams.append("duration", params.duration);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.location) queryParams.append("location", params.location);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    return apiService.makeRequest(
      `/market/contracts${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
      { method: "GET" },
    );
  }

  async applyToContract(
    contractId: string,
    application: {
      farmSize: number;
      location: string;
      experience: string;
      proposedArea: number;
      additionalInfo: string;
    },
  ): Promise<ApiResponse<{ applicationId: string }>> {
    return apiService.makeRequest(`/market/contracts/${contractId}/apply`, {
      method: "POST",
      body: JSON.stringify(application),
    });
  }

  // Price Alerts
  async createPriceAlert(alert: {
    crop: string;
    variety?: string;
    market?: string;
    targetPrice: number;
    condition: "above" | "below";
  }): Promise<ApiResponse<{ alert: PriceAlert }>> {
    return apiService.makeRequest("/market/price-alerts", {
      method: "POST",
      body: JSON.stringify(alert),
    });
  }

  async getPriceAlerts(): Promise<ApiResponse<{ alerts: PriceAlert[] }>> {
    return apiService.makeRequest("/market/price-alerts", { method: "GET" });
  }

  async updatePriceAlert(
    alertId: string,
    updates: Partial<Pick<PriceAlert, "targetPrice" | "condition" | "active">>,
  ): Promise<ApiResponse<{ alert: PriceAlert }>> {
    return apiService.makeRequest(`/market/price-alerts/${alertId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deletePriceAlert(alertId: string): Promise<ApiResponse<void>> {
    return apiService.makeRequest(`/market/price-alerts/${alertId}`, {
      method: "DELETE",
    });
  }

  // Market Analysis
  async getMarketAnalysis(params?: {
    crop?: string;
    region?: string;
    timeframe?: "weekly" | "monthly" | "quarterly";
  }): Promise<
    ApiResponse<{
      analysis: {
        summary: string;
        priceVolatility: number;
        demandSupplyBalance: "surplus" | "balanced" | "deficit";
        seasonalTrends: { month: string; averagePrice: number }[];
        recommendations: string[];
        riskFactors: string[];
      };
    }>
  > {
    const queryParams = new URLSearchParams();

    if (params?.crop) queryParams.append("crop", params.crop);
    if (params?.region) queryParams.append("region", params.region);
    if (params?.timeframe) queryParams.append("timeframe", params.timeframe);

    return apiService.makeRequest(
      `/market/analysis${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
      { method: "GET" },
    );
  }

  // Real-time Market Updates
  async subscribeToLiveUpdates(
    callback: (update: { type: string; data: MarketPrice[] }) => void,
    crops: string[] = [],
  ): Promise<() => void> {
    // This would typically use WebSocket or Server-Sent Events
    // For now, we'll use polling as a fallback
    const interval = setInterval(async () => {
      try {
        const response = await this.getLivePrices(crops);
        if (response.success && response.data) {
          callback({
            type: "price_update",
            data: response.data.prices,
          });
        }
      } catch (error) {
        console.error("Error fetching live updates:", error);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }

  // Market Statistics
  async getMarketStats(): Promise<
    ApiResponse<{
      stats: {
        totalMarkets: number;
        activeBuyers: number;
        dailyTransactions: number;
        averagePriceChange: number;
        topGainers: { crop: string; change: number }[];
        topLosers: { crop: string; change: number }[];
        marketSentiment: "bullish" | "bearish" | "neutral";
      };
    }>
  > {
    return apiService.makeRequest("/market/stats", { method: "GET" });
  }

  // Location-based Services
  async getNearbyMarkets(params: {
    latitude: number;
    longitude: number;
    radius?: number; // in kilometers
    crop?: string;
  }): Promise<
    ApiResponse<{
      markets: {
        id: string;
        name: string;
        address: string;
        distance: number;
        crops: string[];
        facilities: string[];
        operatingHours: string;
        contact: string;
      }[];
    }>
  > {
    const queryParams = new URLSearchParams({
      lat: params.latitude.toString(),
      lng: params.longitude.toString(),
    });

    if (params.radius) queryParams.append("radius", params.radius.toString());
    if (params.crop) queryParams.append("crop", params.crop);

    return apiService.makeRequest(`/market/nearby?${queryParams.toString()}`, {
      method: "GET",
    });
  }

  // Export/Import utilities
  async exportMarketData(params: {
    format: "csv" | "excel" | "pdf";
    dateRange: {
      start: string;
      end: string;
    };
    crops?: string[];
    markets?: string[];
  }): Promise<Blob> {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/market/export`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(params),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to export market data");
    }

    return response.blob();
  }
}

const marketService = new MarketService();
export default marketService;
