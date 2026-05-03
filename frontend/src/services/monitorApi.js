import { API_BASE_URL } from './apiConfig';

const MONITORS_URL = `${API_BASE_URL}/monitors`;

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.error || 'Monitor request failed');
  }

  return payload;
};

const getMonitorId = (monitor) => monitor._id || monitor.id;

export const mapMonitor = (monitor) => {
  const id = getMonitorId(monitor);
  const active = monitor.active !== false;
  const status = active ? 'active' : 'paused';

  const hostname = (() => {
    try {
      return new URL(monitor.url).hostname;
    } catch {
      return monitor.url;
    }
  })();

  return {
    id,
    name: hostname,
    url: monitor.url,
    method: monitor.method || 'GET',
    interval: monitor.interval || 60000,
    active,
    status,
    createdAt: monitor.createdAt,
    updatedAt: monitor.updatedAt,
  };
};

export const getMonitors = async () => {
  const payload = await request(MONITORS_URL);
  const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];

  return data.map(mapMonitor);
};

export const createMonitor = async ({ url, method, interval, active }) => {
  const created = await request(MONITORS_URL, {
    method: 'POST',
    body: JSON.stringify({ url, method, interval: Number(interval) }),
  });
  const createdMonitor = created?.data || created;

  if (active === false) {
    const id = getMonitorId(createdMonitor);
    const updated = await updateMonitor(id, { active: false });

    return updated;
  }

  return mapMonitor(createdMonitor);
};

export const updateMonitor = async (id, data) => {
  const payload = await request(`${MONITORS_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      url: data.url,
      method: data.method,
      interval: Number(data.interval),
      active: data.active,
    }),
  });

  return mapMonitor(payload?.data || payload);
};

export const deleteMonitor = async (id) => {
  await request(`${MONITORS_URL}/${id}`, {
    method: 'DELETE',
  });
};
