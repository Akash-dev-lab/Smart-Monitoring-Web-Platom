import Monitor from "../monitor/monitor.model.js";
import Incident from "../incident/incident.model.js";
import Log from "../logs/log.model.js";

export const getAdminSummary = async () => {
  const totalMonitors = await Monitor.countDocuments();
  const activeMonitors = await Monitor.countDocuments({ active: true });
  const activeIncidents = await Incident.countDocuments({ status: "OPEN" });
  const totalLogs = await Log.countDocuments();
  const successLogs = await Log.countDocuments({ success: true });

  return {
    totalMonitors,
    activeMonitors,
    pausedMonitors: Math.max(totalMonitors - activeMonitors, 0),
    activeIncidents,
    uptime: totalLogs ? Number(((successLogs / totalLogs) * 100).toFixed(2)) : 0,
  };
};

export const getAdminMonitors = async () => {
  return Monitor.find().sort({ createdAt: -1 }).lean();
};
