import axiosInstance from './axiosInstance';

export const getMonitorAnalytics = async (monitorId, range = '24h') => {
  const { data } = await axiosInstance.get(`/logs/analytics/${monitorId}`, {
    params: { range },
  });

  return data;
};
