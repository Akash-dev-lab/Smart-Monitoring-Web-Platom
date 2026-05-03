import express from "express";
import logRoutes from "./modules/logs/log.routes.js";
import monitorRoutes from "./modules/monitor/monitor.routes.js";

const app = express();

app.use(express.json());
app.use("/logs", logRoutes);
app.use("/monitors", monitorRoutes);

export default app;