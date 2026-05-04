import axiosInstance from './axiosInstance';

/**
 * Fetch monitor analytics (response times, uptime, etc.)
 * GET /logs/analytics/:monitorId?range=24h
 * 
 * Returns chart-safe structure even if API fails
 */
export const getMonitorAnalytics = async (monitorId, range = '24h') => {
  try {
    const { data } = await axiosInstance.get(`/logs/analytics/${monitorId}`, {
      params: { range },
    });

    // Ensure data structure is chart-safe
    const analytics = data?.data || data || {};

    return {
      timestamps: Array.isArray(analytics.timestamps) ? analytics.timestamps : [],
      responseTimes: Array.isArray(analytics.responseTimes) ? analytics.responseTimes : [],
      statusCodes: Array.isArray(analytics.statusCodes) ? analytics.statusCodes : [],
      uptime: typeof analytics.uptime === 'number' ? analytics.uptime : 0,
    };
  } catch (error) {
    console.warn(`Failed to fetch analytics for monitor ${monitorId}:`, error.message);
    
    // Return empty chart-safe structure
    return {
      timestamps: [],
      responseTimes: [],
      statusCodes: [],
      uptime: 0,
    };
  }
};
