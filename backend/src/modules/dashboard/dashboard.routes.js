import express from "express";
import {
  getDashboardSummary,
  getAllMonitorsDashboard,
  getIncidentTimeline,
  getAIInsights,
  getMonitorAnalytics
} from "./dashboard.controller.js";

const router = express.Router();

router.get("/summary", getDashboardSummary);
router.get("/monitors", getAllMonitorsDashboard);
router.get("/incidents/:monitorId", getIncidentTimeline);
router.get("/ai/:monitorId", getAIInsights);
router.get("/analytics/:monitorId", getMonitorAnalytics);

export default router;