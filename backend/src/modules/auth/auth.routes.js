import express from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "./auth.controller.js";
import { protect } from "./auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", protect, logout);

export default router;