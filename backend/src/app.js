import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logRoutes from "./modules/logs/log.routes.js";
import monitorRoutes from "./modules/monitor/monitor.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

const configuredOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const localViteOrigin = /^http:\/\/(localhost|127\.0\.0\.1):517\d$/;

const corsOptions = {
  origin(origin, callback) {
    if (!origin || configuredOrigins.includes(origin) || localViteOrigin.test(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/logs", logRoutes);
app.use("/ai", aiRoutes);
app.use("/monitors", monitorRoutes);
app.use("/dashboard", dashboardRoutes);

export default app;
