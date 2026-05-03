import express from "express";
import { createMonitorController, getAllMonitorsController, updateMonitorController, deleteMonitorController } from "./monitor.controller.js";

const router = express.Router();

router.post("/", createMonitorController);
router.get("/", getAllMonitorsController);
router.put("/:id", updateMonitorController);
router.delete("/:id", deleteMonitorController);

export default router;