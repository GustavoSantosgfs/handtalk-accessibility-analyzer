import axios from 'axios';
import type { AnalysisResponse, PaginatedResponse } from '../types/analysis';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const analyzeUrl = async (url: string, socketId?: string): Promise<AnalysisResponse> => {
  const headers: Record<string, string> = {};
  if (socketId) {
    headers['x-socket-id'] = socketId;
  }

  const response = await api.post<AnalysisResponse>('/analyze', { url }, { headers });
  return response.data;
};

export const getHistory = async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<AnalysisResponse>> => {
  const response = await api.get<PaginatedResponse<AnalysisResponse>>('/history', {
    params: { page, limit }
  });
  return response.data;
};

export const getAnalysisById = async (id: string): Promise<AnalysisResponse> => {
  const response = await api.get<AnalysisResponse>(`/analysis/${id}`);
  return response.data;
};

export default api;
