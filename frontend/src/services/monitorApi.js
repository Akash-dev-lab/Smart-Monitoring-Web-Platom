import axiosInstance from './axiosInstance';

export const mapMonitor = (monitor) => {
  const id = monitor._id || monitor.id;
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
  const { data } = await axiosInstance.get('/monitors');
  const monitors = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

  return monitors.map(mapMonitor);
};

export const createMonitor = async ({ url, method, interval, active }) => {
  const { data: created } = await axiosInstance.post('/monitors', {
    url,
    method,
    interval: Number(interval),
  });

  const createdMonitor = created?.data || created;

  if (active === false) {
    const id = createdMonitor._id || createdMonitor.id;
    const updated = await updateMonitor(id, { active: false });
    return updated;
  }

  return mapMonitor(createdMonitor);
};

export const updateMonitor = async (id, data) => {
  const { data: payload } = await axiosInstance.put(`/monitors/${id}`, {
    url: data.url,
    method: data.method,
    interval: Number(data.interval),
    active: data.active,
  });

  return mapMonitor(payload?.data || payload);
};

export const deleteMonitor = async (id) => {
  await axiosInstance.delete(`/monitors/${id}`);
};
