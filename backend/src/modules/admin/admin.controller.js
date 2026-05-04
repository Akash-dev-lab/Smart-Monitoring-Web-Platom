import { getAdminMonitors, getAdminSummary } from "./admin.service.js";

export const getAdminSummaryController = async (req, res) => {
  try {
    const summary = await getAdminSummary();
    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAdminMonitorsController = async (req, res) => {
  try {
    const monitors = await getAdminMonitors();
    res.json({
      success: true,
      count: monitors.length,
      data: monitors,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
