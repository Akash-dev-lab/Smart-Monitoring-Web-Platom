import express from "express";
import { protect, isAdmin } from "../auth/auth.middleware.js";
import {
  getAdminMonitorsController,
  getAdminSummaryController,
} from "./admin.controller.js";

const router = express.Router();

router.use(protect, isAdmin);

router.get("/summary", getAdminSummaryController);
router.get("/monitors", getAdminMonitorsController);

export default router;
