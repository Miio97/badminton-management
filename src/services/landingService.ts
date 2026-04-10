import axios from 'axios';

// Public API client that doesn't need token interceptor, or we can just use apiClient if the route is public
import { apiClient } from '../app/api';

export interface LandingStats {
  totalCourts: number;
  availableCourts: number;
  openingHours: string;
  operatingDays: number;
}

export interface CourtStat {
  id: string;
  name: string;
  status: "available" | "booked" | "maintenance";
  type: string;
  price: string;
  image: string;
  timeSlots: { time: string, available: boolean }[];
}

export interface ReviewItem {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  courtName: string;
  date: string;
  likes: number;
}

export interface ReviewStats {
  avgRating: number;
  totalReviews: number;
  satisfiedPct: number;
}

export const landingService = {
  getStats: async (): Promise<LandingStats> => {
    try {
      const response = await apiClient.get('/dashboard/stats');
      return response.data as LandingStats;
    } catch (error) {
      console.error('Failed to fetch landing stats:', error);
      return {
        totalCourts: 12, // Fallback
        availableCourts: 8,
        openingHours: '18h',
        operatingDays: 7
      };
    }
  },
  getPublicCourts: async (date?: string): Promise<CourtStat[]> => {
    try {
      const qs = date ? `?date=${date}` : '';
      const response = await apiClient.get(`/dashboard/public-courts${qs}`);
      return response.data as CourtStat[];
    } catch (err) {
      console.error('Failed to fetch public courts:', err);
      return [];
    }
  },
  getReviews: async (): Promise<{ reviews: ReviewItem[], stats: ReviewStats }> => {
    try {
      const response = await apiClient.get('/dashboard/reviews');
      return response.data;
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      return {
        reviews: [],
        stats: { avgRating: 0, totalReviews: 0, satisfiedPct: 0 }
      };
    }
  }
};
