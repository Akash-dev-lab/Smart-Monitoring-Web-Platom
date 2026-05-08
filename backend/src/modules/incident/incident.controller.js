import Incident from "./incident.model.js";

export const getIncidentsByMonitor = async (req, res) => {
  try {
    const { monitorId } = req.params;

    const incidents = await Incident.find({ monitorId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: incidents
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};