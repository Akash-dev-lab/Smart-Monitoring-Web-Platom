import { API_BASE_URL } from './apiConfig';

const LOGS_URL = `${API_BASE_URL}/logs`;

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
    throw new Error(payload?.error || 'Log request failed');
  }

  return payload;
};

export const getMonitorAnalytics = async (monitorId, range = '24h') => {
  const params = new URLSearchParams({ range });

  return request(`${LOGS_URL}/analytics/${monitorId}?${params.toString()}`);
};
