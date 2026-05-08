import express from "express";
import { protect } from "../auth/auth.middleware.js";
import { getIncidentsByMonitor } from "./incident.controller.js";

const router = express.Router();

router.get("/:monitorId", protect, getIncidentsByMonitor);

export default router;