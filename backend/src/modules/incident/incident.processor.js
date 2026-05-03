import { getOpenIncident, createIncident, resolveIncident } from "./incident.service.js";
import { triggerAlert } from "../alert/alert.service.js";

const FAILURE_THRESHOLD = 3;

// in-memory tracker (simple version)
const failureMap = new Map();

export const handleFailure = async (monitorId) => {
  const count = (failureMap.get(monitorId) || 0) + 1;
  failureMap.set(monitorId, count);

  console.log(`⚠️ Failure count: ${count}`);

  if (count >= FAILURE_THRESHOLD) {
    const existing = await getOpenIncident(monitorId);

    if (!existing) {
      console.log("🚨 Incident Created");
      const newIncident = await createIncident({ monitorId, failCount: count });

      await triggerAlert({
        monitorId,
        incident: newIncident,
      });
    }
  }
};

export const handleSuccess = async (monitorId) => {
  const hadFailure = failureMap.get(monitorId);

  if (hadFailure && hadFailure >= FAILURE_THRESHOLD) {
    console.log("✅ Incident Resolved");
    await resolveIncident(monitorId);
  }

  // reset counter
  failureMap.set(monitorId, 0);
};
