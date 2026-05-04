import { createMonitor, getAllMonitors, updateMonitorById, deleteMonitorById } from "./monitor.service.js";

const getAuthenticatedUserId = (req) => req.user?._id?.toString?.() || req.user?.userId || null;

export const createMonitorController = async (req, res) => {
  try {
    const { url, method, interval } = req.body;
    const userId = getAuthenticatedUserId(req);

    const monitor = await createMonitor({ url, method, interval, userId });
    res.status(201).json(monitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMonitorsController = async (req, res) => {
  try {
    const monitors = await getAllMonitors(getAuthenticatedUserId(req));

    res.json({
      success: true,
      count: monitors.length,
      data: monitors,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 UPDATE
export const updateMonitorController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getAuthenticatedUserId(req);

    const updated = await updateMonitorById(id, userId, req.body);

    if (!updated) {
      return res.status(404).json({ error: "Monitor not found or unauthorized" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 DELETE
export const deleteMonitorController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getAuthenticatedUserId(req);

    const deleted = await deleteMonitorById(id, userId);

    if (!deleted) {
      return res.status(404).json({ error: "Monitor not found or unauthorized" });
    }

    res.json({ success: true, message: "Monitor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
