import express from "express";
const router = express.Router();
import {
  createRequest,
  getRequests,
  getMyRequests,
  getAvailableRequests,
  acceptRequest,
  deliverRequest,
  getMyAcceptedRequests,
} from "../controllers/requests.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

router.post("/request", authMiddleware, createRequest);

router.get("/requests", getRequests);

router.get("/getMyRequests", authMiddleware, getMyRequests);

// New routes for request status management
router.get("/requests/available", authMiddleware, getAvailableRequests);

router.patch("/requests/:id/accept", authMiddleware, acceptRequest);

router.patch("/requests/:id/deliver", authMiddleware, deliverRequest);

router.get("/requests/my-accepted", authMiddleware, getMyAcceptedRequests);

export default router;
