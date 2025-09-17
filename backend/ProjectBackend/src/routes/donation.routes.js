import express from "express";
const router = express.Router();
import {
  createDonation,
  getDonation,
  getMyDonations,
} from "../controllers/donation.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { mlPredictionMiddleware } from "../middlewares/ml.middleware.js";

router.post("/donation", authMiddleware, mlPredictionMiddleware, createDonation);

router.get("/donation", getDonation);

router.get("/getMyDonations", authMiddleware, getMyDonations);

export default router;
