import express from "express";
import logRoutes from "./modules/logs/log.routes.js";
import monitorRoutes from "./modules/monitor/monitor.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

const app = express();

app.use(express.json());
app.use("/logs", logRoutes);
app.use("/ai", aiRoutes);
app.use("/monitors", monitorRoutes);
app.use("/dashboard", dashboardRoutes);

export default app;