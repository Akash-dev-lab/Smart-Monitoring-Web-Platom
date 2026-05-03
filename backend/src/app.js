import express from "express";
import cors from "cors";
import logRoutes from "./modules/logs/log.routes.js";
import monitorRoutes from "./modules/monitor/monitor.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/logs", logRoutes);
app.use("/ai", aiRoutes);
app.use("/monitors", monitorRoutes);

export default app;