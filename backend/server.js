// src/server.js
import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { startScheduler } from "./src/modules/monitor/monitor.scheduler.js";
import { startBullWorker } from "./src/workers/monitor.worker.js";
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"])

dotenv.config();

connectDB();
startScheduler();
startBullWorker();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});