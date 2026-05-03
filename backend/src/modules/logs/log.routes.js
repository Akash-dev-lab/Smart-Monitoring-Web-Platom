// src/modules/log/log.routes.js
import express from "express";
import { getMonitorAnalyticsController } from "./log.controller.js";

const router = express.Router();

router.get("/analytics/:monitorId", getMonitorAnalyticsController);

export default router;