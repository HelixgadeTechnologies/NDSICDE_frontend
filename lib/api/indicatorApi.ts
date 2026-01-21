import axios from 'axios';
import { IndicatorPayload } from '@/types/indicator';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const indicatorApi = {
  createIndicator: async (payload: IndicatorPayload) => {
    try {
      const response = await api.post('/api/projectManagement/indicator', payload);
      return response.data;
    } catch (error: any) {
      console.error('Error creating indicator:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create indicator');
    }
  },
  
  // You can add more methods here as needed
  // getIndicators: async () => { ... },
  // updateIndicator: async (id: string, payload: IndicatorPayload) => { ... },
  // deleteIndicator: async (id: string) => { ... },
};