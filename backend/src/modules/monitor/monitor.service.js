import Monitor from "./monitor.model.js";

export const createMonitor = async (payload) => {
  return await Monitor.create(payload);
};

export const getActiveMonitors = async () => {
  return await Monitor.find({ active: true });
};

// 🔥 GET ALL
export const getAllMonitors = async () => {
  return await Monitor.find().sort({ createdAt: -1 });
};

// 🔥 UPDATE
export const updateMonitorById = async (id, data) => {
  return await Monitor.findByIdAndUpdate(id, data, { new: true });
};

// 🔥 DELETE
export const deleteMonitorById = async (id) => {
  return await Monitor.findByIdAndDelete(id);
};