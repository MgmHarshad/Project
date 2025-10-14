import express from "express";
const router = express.Router();
import { getDonorStats, getReceiverStats } from "../controllers/stats.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

// Get donor statistics
router.get("/stats/donor", authMiddleware, getDonorStats);

// Get receiver statistics  
router.get("/stats/receiver", authMiddleware, getReceiverStats);

export default router;
