import { API_BASE_URL } from './apiConfig';

const DASHBOARD_URL = `${API_BASE_URL}/dashboard`;

const request = async (url) => {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.error || 'Dashboard request failed');
  }

  return payload;
};

export const getDashboardSummary = () => request(`${DASHBOARD_URL}/summary`);

export const getIncidentTimeline = (monitorId) => request(`${DASHBOARD_URL}/incidents/${monitorId}`);

export const getAIInsights = (monitorId) => request(`${DASHBOARD_URL}/ai/${monitorId}`);

export const getApiBaseUrl = () => API_BASE_URL;
