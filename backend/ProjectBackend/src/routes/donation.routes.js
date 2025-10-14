import express from "express";
const router = express.Router();
import {
  createDonation,
  getDonation,
  getMyDonations,
  getAvailableDonations,
  claimDonation,
  deliverDonation,
  getMyClaimedDonations,
} from "../controllers/donation.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { mlPredictionMiddleware } from "../middlewares/ml.middleware.js";

router.post("/donation", authMiddleware, mlPredictionMiddleware, createDonation);

router.get("/donation", getDonation);

router.get("/getMyDonations", authMiddleware, getMyDonations);

// New routes for donation status management
router.get("/donations/available", authMiddleware, getAvailableDonations);

router.patch("/donations/:id/claim", authMiddleware, claimDonation);

router.patch("/donations/:id/deliver", authMiddleware, deliverDonation);

router.get("/donations/my-claimed", authMiddleware, getMyClaimedDonations);

export default router;
