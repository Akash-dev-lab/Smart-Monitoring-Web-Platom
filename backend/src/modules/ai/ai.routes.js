// src/modules/ai/ai.routes.js

import express from "express";
import { getAIInsights } from "./ai.controller.js";

const router = express.Router();

router.get("/insights/:monitorId", getAIInsights);

export default router;