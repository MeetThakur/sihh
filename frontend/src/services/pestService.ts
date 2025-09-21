// Pest Service for handling pest-related API calls
// Provides methods for fetching pest reports, submitting new reports, and managing pest alerts

export interface PestReport {
  id: string;
  location: {
    state: string;
    district: string;
    village?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  pestType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  crop: string;
  symptoms: string;
  reportedBy: {
    id: string;
    name: string;
    contact?: string;
  };
  farmId: string;
  plotId: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'investigating';
  imageUrl?: string;
  treatmentRecommendations?: Array<{
    name: string;
    dosage: string;
    applicationMethod: string;
    cost: number;
  }>;
  verificationStatus: 'pending' | 'verified' | 'false_alarm';
  verifiedBy?: string;
  resolutionDate?: string;
  notes?: string;
}

export interface PestAlert {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved';
  reportedDate: string;
  resolvedDate?: string;
  description: string;
  location: string;
  affectedArea: number; // in acres
  treatmentApplied?: string;
  treatmentDate?: string;
  notes?: string;
}

export interface PestIdentificationRequest {
  crop: string;
  symptoms: string;
  location: {
    state: string;
    district: string;
    village?: string;
  };
  season: string;
  image?: File;
  farmerNotes?: string;
}

export interface PestIdentificationResponse {
  identification: {
    name: string;
    scientificName?: string;
    type: 'pest' | 'disease' | 'deficiency';
    confidence: number;
    description: string;
  };
  treatment: {
    immediate: string[];
    preventive: string[];
    organic: string[];
    chemical: string[];
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  };
  timeToRecover: string;
  processingTime: number;
}

export interface RegionalPestData {
  region: string;
  totalReports: number;
  activeReports: number;
  severityBreakdown: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  commonPests: Array<{
    name: string;
    count: number;
    affectedCrops: string[];
  }>;
  hotspots: Array<{
    location: string;
    riskLevel: 'low' | 'medium' | 'high';
    activeAlerts: number;
    primaryThreat: string;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class PestService {
  private readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          message: 'Request failed'
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data
      };
    } catch (error) {
      console.error('Pest service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to connect to pest service'
      };
    }
  }

  /**
   * Get all pest reports for the current user's farms
   */
  async getPestReports(filters?: {
    severity?: string;
    status?: string;
    cropType?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  }): Promise<ApiResponse<PestReport[]>> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          queryParams.append(key, value);
        } else if (value && typeof value === 'object' && 'start' in value && 'end' in value) {
          queryParams.append('startDate', value.start);
          queryParams.append('endDate', value.end);
        }
      });
    }

    const endpoint = `/farms/pest-reports${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<PestReport[]>(endpoint);
  }

  /**
   * Get regional pest data for community monitoring
   */
  async getRegionalPestData(location?: {
    state: string;
    district?: string;
  }): Promise<ApiResponse<RegionalPestData>> {
    const queryParams = new URLSearchParams();

    if (location) {
      queryParams.append('state', location.state);
      if (location.district) {
        queryParams.append('district', location.district);
      }
    }

    const endpoint = `/farms/regional-pest-data${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<RegionalPestData>(endpoint);
  }

  /**
   * Submit a new pest report
   */
  async submitPestReport(report: {
    farmId: string;
    plotId: string;
    pestType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    symptoms: string;
    affectedArea: number;
    image?: File;
    notes?: string;
  }): Promise<ApiResponse<PestReport>> {
    const formData = new FormData();

    Object.entries(report).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return this.makeRequest<PestReport>('/farms/pest-reports', {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  }

  /**
   * Update pest report status
   */
  async updatePestReportStatus(
    reportId: string,
    updates: {
      status?: 'active' | 'resolved' | 'investigating';
      treatmentApplied?: string;
      notes?: string;
    }
  ): Promise<ApiResponse<PestReport>> {
    return this.makeRequest<PestReport>(`/farms/pest-reports/${reportId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Get pest identification using AI
   */
  async identifyPest(request: PestIdentificationRequest): Promise<ApiResponse<PestIdentificationResponse>> {
    const formData = new FormData();

    // Add basic fields
    formData.append('crop', request.crop);
    formData.append('symptoms', request.symptoms);
    formData.append('season', request.season);
    formData.append('location[state]', request.location.state);
    formData.append('location[district]', request.location.district);

    if (request.location.village) {
      formData.append('location[village]', request.location.village);
    }

    if (request.farmerNotes) {
      formData.append('farmerNotes', request.farmerNotes);
    }

    if (request.image) {
      formData.append('image', request.image);
    }

    return this.makeRequest<PestIdentificationResponse>('/ai/pest-identification', {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  }

  /**
   * Get pest alerts for specific farm
   */
  async getFarmPestAlerts(farmId: string): Promise<ApiResponse<PestAlert[]>> {
    return this.makeRequest<PestAlert[]>(`/farms/${farmId}/pest-alerts`);
  }

  /**
   * Add pest alert to farm
   */
  async addPestAlert(
    farmId: string,
    plotId: string,
    alert: {
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      affectedArea: number;
    }
  ): Promise<ApiResponse<PestAlert>> {
    return this.makeRequest<PestAlert>(`/farms/${farmId}/plots/${plotId}/pest-alerts`, {
      method: 'POST',
      body: JSON.stringify(alert),
    });
  }

  /**
   * Resolve pest alert
   */
  async resolvePestAlert(
    farmId: string,
    plotId: string,
    alertId: string,
    resolution: {
      treatmentApplied: string;
      treatmentDate: string;
      notes?: string;
    }
  ): Promise<ApiResponse<PestAlert>> {
    return this.makeRequest<PestAlert>(`/farms/${farmId}/plots/${plotId}/pest-alerts/${alertId}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify(resolution),
    });
  }

  /**
   * Get pest statistics for dashboard
   */
  async getPestStatistics(): Promise<ApiResponse<{
    totalReports: number;
    activeAlerts: number;
    resolvedThisMonth: number;
    criticalAlerts: number;
    trendData: Array<{
      date: string;
      reports: number;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>;
  }>> {
    return this.makeRequest('/farms/pest-statistics');
  }

  /**
   * Get nearby pest reports for community awareness
   */
  async getNearbyPestReports(
    location: { latitude: number; longitude: number },
    radius: number = 10 // km
  ): Promise<ApiResponse<PestReport[]>> {
    const queryParams = new URLSearchParams({
      lat: location.latitude.toString(),
      lng: location.longitude.toString(),
      radius: radius.toString(),
    });

    return this.makeRequest<PestReport[]>(`/farms/nearby-pest-reports?${queryParams.toString()}`);
  }

  /**
   * Export pest reports as CSV
   */
  async exportPestReports(filters?: {
    startDate?: string;
    endDate?: string;
    severity?: string;
    status?: string;
  }): Promise<ApiResponse<Blob>> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
    }

    const endpoint = `/farms/pest-reports/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          message: 'Failed to export pest reports'
        };
      }

      const blob = await response.blob();
      return {
        success: true,
        data: blob
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to export pest reports'
      };
    }
  }

  /**
   * Get pest prevention recommendations based on location and season
   */
  async getPestPreventionRecommendations(location: {
    state: string;
    district: string;
  }): Promise<ApiResponse<{
    season: string;
    commonPests: Array<{
      name: string;
      crops: string[];
      preventiveMeasures: string[];
      criticalPeriod: string;
    }>;
    generalRecommendations: string[];
  }>> {
    const queryParams = new URLSearchParams({
      state: location.state,
      district: location.district,
    });

    return this.makeRequest(`/ai/pest-prevention?${queryParams.toString()}`);
  }
}

// Export singleton instance
const pestService = new PestService();
export default pestService;

// Export types for use in components
export type {
  PestReport,
  PestAlert,
  PestIdentificationRequest,
  PestIdentificationResponse,
  RegionalPestData,
  ApiResponse as PestApiResponse,
};
