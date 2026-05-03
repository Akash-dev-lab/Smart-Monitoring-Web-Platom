import Monitor from "../monitor/monitor.model.js";
import Log from "../logs/log.model.js";
import Incident from "../incident/incident.model.js";
import AIInsight from "../ai/ai.model.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const totalMonitors = await Monitor.countDocuments();
    const activeIncidents = await Incident.countDocuments({ status: "OPEN" });

    const totalLogs = await Log.countDocuments();
    const successLogs = await Log.countDocuments({ success: true });

    const uptime = totalLogs
      ? ((successLogs / totalLogs) * 100).toFixed(2)
      : 0;

    res.json({
      totalMonitors,
      activeIncidents,
      uptime
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMonitorsDashboard = async (req, res) => {
  try {
    const monitors = await Monitor.find().sort({ createdAt: -1 });

    res.json(monitors);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getIncidentTimeline = async (req, res) => {
  try {
    const { monitorId } = req.params;

    const incidents = await Incident.find({ monitorId })
      .sort({ createdAt: -1 });

    res.json(incidents);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAIInsights = async (req, res) => {
  try {
    const { monitorId } = req.params;

    const insights = await AIInsight.find({ monitorId })
      .sort({ createdAt: -1 });

    res.json(insights);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMonitorAnalytics = async (req, res) => {
  try {
    const { monitorId } = req.params;

    const logs = await Log.find({ monitorId })
      .sort({ createdAt: -1 })
      .limit(50);

    const latency = logs.map(l => l.responseTime);
    const successRate = logs.filter(l => l.success).length;

    res.json({
      totalChecks: logs.length,
      successRate,
      latency
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};