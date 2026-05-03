import Monitor from "../monitor/monitor.model.js";
import Log from "../logs/log.model.js";
import Incident from "../incident/incident.model.js";
import { buildPrompt } from "./ai.promptBuilder.js";
import { callAI } from "./ai.service.js";
import { formatAIResponse } from "./ai.formatter.js";

export const getAIInsights = async (req, res) => {
  try {
    const { monitorId } = req.params;

    const monitor = await Monitor.findById(monitorId);
    const logs = await Log.find({ monitorId }).sort({ createdAt: -1 }).limit(10);
    const incident = await Incident.findOne({ monitorId, status: "OPEN" });

    

    if (!monitor) {
        console.log(monitor)
      return res.status(404).json({ message: "Monitor not found" });
    }

    const prompt = buildPrompt({ monitor, logs, incident });

    const rawAI = await callAI(prompt);

    const formatted = formatAIResponse(rawAI);

    return res.json({
      monitorId,
      ai: formatted
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI failed" });
  }
};

//unused code for future use - to fetch AI timeline for a monitor
// export const getAITimeline = async (req, res) => {
//   try {
//     const { monitorId } = req.params;

//     const insights = await AIInsight.findById({ monitorId })
//       .sort({ createdAt: -1 });

//     res.json(insights);

//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch timeline" });
//   }
// };