import axiosInstance from './axiosInstance';
import { API_BASE_URL } from './apiConfig';

export const getDashboardSummary = async () => {
  const { data } = await axiosInstance.get('/dashboard/summary');
  return data;
};

export const getIncidentTimeline = async (monitorId) => {
  const { data } = await axiosInstance.get(`/dashboard/incidents/${monitorId}`);
  return data;
};

export const getAIInsights = async (monitorId) => {
  const { data } = await axiosInstance.get(`/dashboard/ai/${monitorId}`);
  return data;
};

export const getApiBaseUrl = () => API_BASE_URL;
