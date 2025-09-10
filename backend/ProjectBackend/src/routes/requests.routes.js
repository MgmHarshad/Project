import express from "express";
const router = express.Router();
import {
  createRequest,
  getRequests,
  getMyRequests,
} from "../controllers/requests.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

router.post("/request", authMiddleware, createRequest);

router.get("/requests", getRequests);

router.get("/getMyRequests", authMiddleware, getMyRequests);

export default router;
