import { createMonitor, getAllMonitors, updateMonitorById, deleteMonitorById } from "./monitor.service.js";

export const createMonitorController = async (req, res) => {
  try {
    const { url, method, interval } = req.body;

    const monitor = await createMonitor({ url, method, interval, userId: req.user.userId });
    res.status(201).json(monitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMonitorsController = async (req, res) => {
  try {
    const monitors = await getAllMonitors(req.user.userId);

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

    const updated = await updateMonitorById(id, req.user.userId, req.body);

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

    const deleted = await deleteMonitorById(id, req.user.userId);

    if (!deleted) {
      return res.status(404).json({ error: "Monitor not found or unauthorized" });
    }

    res.json({ success: true, message: "Monitor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};