import express from "express";
const router = express.Router();
import {
  createDonation,
  getDonation,
  getMyDonations,
} from "../controllers/donation.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

router.post("/donation", authMiddleware, createDonation);

router.get("/donation", getDonation);

router.get("/getMyDonations", authMiddleware, getMyDonations);

export default router;
