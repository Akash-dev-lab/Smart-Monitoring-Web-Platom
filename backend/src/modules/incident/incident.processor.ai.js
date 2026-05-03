import AIInsight from '../ai/ai.model.js';
import { buildPrompt } from '../ai/ai.promptBuilder.js';
import { callAI } from '../ai/ai.service.js';
import { formatAIResponse } from '../ai/ai.formatter.js';

import Monitor from '../monitor/monitor.model.js';
import Log from '../logs/log.model.js';

export const processIncident = async incident => {
  try {
    console.log('🧠 AI Triggered for incident...');

    const monitor = await Monitor.findById(incident.monitorId);

    const logs = await Log.find({ monitorId: incident.monitorId })
      .sort({ createdAt: -1 })
      .limit(10);

    const prompt = buildPrompt({
      monitor,
      logs,
      incident,
    });

    const rawAI = await callAI(prompt);

    if (!rawAI) {
      console.log('⚠️ AI skipped (no response)');
      return;
    }

    const formatted = formatAIResponse(rawAI);

    await AIInsight.create({
      monitorId: incident.monitorId,
      incidentId: incident._id,
      ...formatted,
    });

    console.log('✅ AI Insight saved');
  } catch (err) {
    console.error('❌ AI Processing Failed:', err.message);
  }
};
